// Restore only an artifact from a verified successful production workflow.
const fs=require('node:fs'),path=require('node:path'),{execFileSync}=require('node:child_process'),zlib=require('node:zlib');
function unpack(out){const base=path.join(out,'__localized');if(!fs.existsSync(base))return;
 for(const locale of fs.readdirSync(base))for(const file of fs.readdirSync(path.join(base,locale))){
  if(!file.endsWith('.json.gz'))continue;const stock=file.slice(0,-8);
  if(!/^[a-z0-9-]+$/.test(stock)||!['en','es','de','fr','ja','ko'].includes(locale))throw Error('Invalid saved prediction pack');
  const entries=JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(base,locale,file))));
  for(const [period,html] of Object.entries(entries)){
   if(!/^(overview|today|tomorrow|next-week|next-month|2026|2027|2028|2029|2030)$/.test(period)||typeof html!=='string')throw Error('Invalid saved prediction page');
   const dest=path.join(out,locale==='en'?'':locale,'prediction',stock,period==='overview'?'':period,'index.html');fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,html);
  }
 }fs.rmSync(base,{recursive:true});
}
function findBaseline(api,currentRun){
 const recent=api('actions/runs?status=completed&branch=main&per_page=10').workflow_runs;
 const successful=api('actions/runs?status=success&branch=main&per_page=10').workflow_runs;
 const runs=[...new Map([...recent,...successful].filter(r=>!r.path||['.github/workflows/nextjs.yml','.github/workflows/legal.yml'].includes(r.path.split('@')[0])).map(r=>[r.id,r])).values()].sort((a,b)=>b.id-a.id);
 for(const run of runs){
  if(String(run.id)===String(currentRun))continue;
  if(run.conclusion!=='success'&&!api(`actions/runs/${run.id}/jobs`).jobs.some(j=>j.name==='deploy'&&j.conclusion==='success'))continue;
  if(api(`actions/runs/${run.id}/artifacts`).artifacts.some(a=>a.name==='cloudflare-site'&&!a.expired))return run;
 }
 return null;
}
function restore(){
 if(process.env.WEBSITE_FULL_BUILD==='true'){console.log('Full build explicitly requested.');return;}
 const repo=process.env.GITHUB_REPOSITORY;if(!repo||!process.env.WEBSITE_EXPORT_VOLUME){console.log('No production artifact context; using a full build.');return;}
 const api=endpoint=>JSON.parse(execFileSync('gh',['api',`repos/${repo}/${endpoint}`],{encoding:'utf8'}));
 const chosen=findBaseline(api,process.env.GITHUB_RUN_ID);
 if(!chosen){if(process.env.WEBSITE_CONTENT_ONLY==='true')throw Error('Content publication requires a retained production export. Refusing a full-site rebuild; deploy a code baseline first.');console.log('No retained successful export; a full build is required.');return;}
 const archive=path.join(process.env.WEBSITE_EXPORT_VOLUME,'previous-archive'),out=path.join(process.env.WEBSITE_EXPORT_VOLUME,'previous');
 fs.mkdirSync(archive,{recursive:true});fs.mkdirSync(out,{recursive:true});
 execFileSync('gh',['run','download',String(chosen.id),'--repo',repo,'--name','cloudflare-site','--dir',archive],{stdio:'inherit'});
 execFileSync('tar',['-xzf',path.join(archive,'cloudflare-site.tar.gz'),'-C',out],{stdio:'inherit'});
 if(process.env.WEBSITE_KEEP_PACKED==='true'){
  // A page-only release also retains the deployed routing implementation/config.
  for(const file of ['worker/prediction-data.mjs','wrangler.jsonc']){const saved=api('contents/'+file+'?ref='+chosen.head_sha);if(saved.encoding!=='base64')throw Error('Missing deployed routing file '+file);fs.writeFileSync(path.join(process.cwd(),file),Buffer.from(saved.content,'base64'));}
 }else unpack(out);fs.rmSync(archive,{recursive:true});
 // Staging publication helpers are not public pages.
 fs.appendFileSync(process.env.GITHUB_ENV,`WEBSITE_PREVIOUS_EXPORT=${out}\n`);
 console.log(`Restored production export from run ${chosen.id} (${chosen.head_sha}).`);
}
if(require.main===module)restore();module.exports={unpack,findBaseline};
