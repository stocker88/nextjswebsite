// Shared by local builds and CI. At most one upstream attempt every 48 hours.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript'),Module=require('node:module');
const filename=path.join(__dirname,'../lib/fear-greed.ts');
const compiled=new Module(filename,module);
compiled._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,filename);
const TTL=48*60*60*1000;
const read=file=>{try{return JSON.parse(fs.readFileSync(file,'utf8'));}catch{return null;}};
function write(file,value){fs.mkdirSync(path.dirname(file),{recursive:true});fs.writeFileSync(file+'.tmp',JSON.stringify(value)+'\n');fs.renameSync(file+'.tmp',file);}
async function sync({root=path.join(__dirname,'..'),fetcher=fetch,now=Date.now(),log=console.log}={}){
 const file=path.join(root,'data/fear-greed.json'),cache=path.join(root,'.cache/fear-greed/state.json');
 const state=read(cache)||{},saved=read(file);
 const valid=s=>compiled.exports.score(s?.score)!==null&&Number.isFinite(Date.parse(s?.timestamp));
 const candidates=[state.snapshot,saved].filter(valid).sort((a,b)=>Date.parse(b.timestamp)-Date.parse(a.timestamp)||Date.parse(b.fetchedAt||b.timestamp)-Date.parse(a.fetchedAt||a.timestamp));
 const snapshot=candidates[0]||null;
 if(snapshot){write(file,snapshot);write(path.join(root,'public/data/fear-greed.json'),snapshot);}
 const last=Math.max(Number(state.lastAttempt)||0,Date.parse(snapshot?.fetchedAt)||0);
 if(last>0&&now-last<TTL){log('Fear & Greed: using saved snapshot; next attempt '+new Date(last+TTL).toISOString());return {updated:false,snapshot};}
 // Persist failures too, so repeated deployments cannot hammer the provider.
 write(cache,{lastAttempt:now,snapshot});
 try{
  const response=await fetcher(compiled.exports.FINICA_URL,{signal:AbortSignal.timeout(12000)});
  if(!response.ok)throw Error('HTTP '+response.status);
  const next=compiled.exports.normalizeFinicaFearGreed(await response.json(),new Date(now));
  if(!next)throw Error('Invalid index response');
  if(snapshot&&Date.parse(next.timestamp)<Date.parse(snapshot.timestamp))throw Error('Provider returned an older reading');
  write(file,next);write(path.join(root,'public/data/fear-greed.json'),next);write(cache,{lastAttempt:now,snapshot:next});
  log('Saved CNN Fear & Greed via Finica, data date '+next.timestamp.slice(0,10));
  return {updated:true,snapshot:next};
 }catch(error){log('Fear & Greed snapshot unchanged: '+error.message);return {updated:true,snapshot};}
}
module.exports={sync,TTL};
if(require.main===module)sync().then(result=>{if(result.snapshot)require('./render-fear-greed-share.cjs').render();if(process.env.GITHUB_OUTPUT)fs.appendFileSync(process.env.GITHUB_OUTPUT,'updated='+result.updated+'\n');}).catch(error=>{console.error(error);process.exitCode=1;});
