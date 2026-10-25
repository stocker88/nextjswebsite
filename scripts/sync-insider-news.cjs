// Fetch only published, credential-free disclosure articles. Keep a good archive on outages.
const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText,f);
const {validInsiderArticle}=require('../lib/insider-news.ts');
const file=path.resolve(__dirname,'../data/insider-news.json');
async function sync(){const old=JSON.parse(fs.readFileSync(file,'utf8'));try{const collected=new Map(),seen=new Set();let after=null;
 do{const r=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/smartMoneyArticles'+(after?'?after='+encodeURIComponent(after):''),{signal:AbortSignal.timeout(20000)});if(!r.ok)throw Error('HTTP '+r.status);const data=await r.json();if(data.version!==1||!Array.isArray(data.items)||!data.items.every(validInsiderArticle))throw Error('Invalid public article feed');for(const a of data.items)if(Date.parse(a.publishedAt)<=Date.now())collected.set(a.slug,a);after=data.next;if(after!==null&&(typeof after!=='string'||seen.has(after)))throw Error('Invalid archive cursor');seen.add(after);
 }while(after);const items=[...collected.values()].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt)||a.slug.localeCompare(b.slug));fs.writeFileSync(file+'.tmp',JSON.stringify({version:1,items}));fs.renameSync(file+'.tmp',file);console.log('Saved '+items.length+' disclosure articles');
 }catch(e){console.warn('Keeping dated disclosure archive ('+e.message+')');if(!Array.isArray(old.items))throw e;}}
sync().catch(e=>{console.error(e.message);process.exitCode=1;});
