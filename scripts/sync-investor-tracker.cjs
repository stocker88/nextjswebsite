// Publish only saved public filings. No provider requests or account data.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'..'),directory=path.join(root,'public/investor-tracker');
const ids=['berkshire','pershing','appaloosa','duquesne','pelosi','gottheimer','khanna','mccaul','meuser','tuberville'];
const rowKeys=['id','symbol','company','value','shares','weight','period','filedDate','eventDate','rawAction','owner','securityType','amount','sourceUrl'];
const pick=(v,keys)=>Object.fromEntries(keys.filter(k=>v?.[k]!==undefined).map(k=>[k,v[k]]));
function project(v){return {...pick(v,['id','name','kind','updatedAt','stale','disclosure','methodology']),rows:v.rows.map(r=>pick(r,rowKeys)),history:(v.history||[]).map(h=>({period:h.period,rows:h.rows.map(r=>pick(r,rowKeys))})),performance:{...pick(v.performance,['symbols','reason','version','coverage']),weights:(v.performance?.weights||[]).map(w=>pick(w,['symbol','weight'])),points:(v.performance?.points||[]).map(p=>pick(p,['date','value','benchmark']))}};}
async function sync(){
 fs.mkdirSync(directory,{recursive:true});
 try{
  let profiles;
  if(process.argv.includes('--gcs'))profiles=ids.map(id=>JSON.parse(execFileSync('gcloud',['storage','cat','gs://stocker-fcda2.appspot.com/website-earnings/smart-money/tracker/'+id+'.json'],{encoding:'utf8',maxBuffer:20*1024*1024})));
  else{const r=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/publicInvestorSnapshot',{signal:AbortSignal.timeout(60000)});if(!r.ok)throw Error('HTTP '+r.status);profiles=(await r.json()).profiles;}
  const values=ids.map(id=>{const v=profiles?.find(p=>p.id===id);if(!v?.updatedAt||!Array.isArray(v.rows)||!v.name)throw Error('Missing saved profile '+id);return project(v)});
  for(const value of values){const file=path.join(directory,value.id+'.json');let old;try{old=JSON.parse(fs.readFileSync(file,'utf8'))}catch{}if(old&&Date.parse(old.updatedAt)>Date.parse(value.updatedAt))continue;fs.writeFileSync(file+'.tmp',JSON.stringify(value));fs.renameSync(file+'.tmp',file);}
  console.log('Saved public investor snapshots: '+values.length);
 }catch(e){if(!ids.every(id=>fs.existsSync(path.join(directory,id+'.json'))))throw e;console.warn('Keeping dated investor snapshots: '+e.message);}
}
sync().catch(e=>{console.error(e.message);process.exitCode=1});
