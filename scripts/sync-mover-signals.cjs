const fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
async function sync(root=path.join(__dirname,'..')) {
 const r=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/moverThreadCoverage',{signal:AbortSignal.timeout(30000)});if(!r.ok)throw Error('Signal coverage unavailable');
 const data=await r.json();if(data.version!==1||!Array.isArray(data.items))throw Error('Invalid signal coverage');
 const m={exports:{}};new Function('module','exports',ts.transpileModule(fs.readFileSync(path.join(root,'lib/research.ts'),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports);
 const items=data.items.filter(a=>a.kind==='signal'&&a.isAIAdvisor===true&&a.sourceCollection==='posts').map(a=>({...a,href:m.exports.researchUrl(a.postId,a.title)+'/'}));
 fs.writeFileSync(path.join(root,'data/mover-signals.json'),JSON.stringify(items));console.log('Saved',items.length,'Signal links');
}
if(require.main===module)sync().catch(e=>{console.error(e.message);process.exitCode=1});module.exports={sync};
