const fs=require('node:fs'),path=require('node:path');
// Next removes these server-only bindings from client bundles along with getStaticPaths.
function wrap(source,template,runtime){
 if(!/\bgetStaticPaths\b/.test(source))return source;
 let getter='__originalStaticPaths',props='getStaticProps',handled=false;
 source=source.replace(/export\s*\{([^}]*\bgetStaticPaths\b[^}]*)\}\s*from\s*(['"])([^'"]+)\2\s*;?/,(_,names,q,from)=>{
  handled=true;const keep=names.split(',').map(s=>s.trim()).filter(s=>s!=='getStaticPaths');
  props='__incrementalProps';
  return `export {${keep.join(',')}} from ${q}${from}${q};\nimport {getStaticPaths as ${getter},getStaticProps as ${props}} from ${q}${from}${q};`;
 });
 if(!handled){
  source=source.replace(/export\s+(async\s+)?function\s+getStaticPaths\b/,(_,asyncWord='')=>{handled=true;return `${asyncWord}function ${getter}`;});
  if(!handled)source=source.replace(/export\s+(const|let)\s+getStaticPaths\b/,(_,kind)=>{handled=true;return `${kind} ${getter}`;});
 }
 if(!handled)throw Error('Unsupported getStaticPaths declaration: '+template);
 return source+`\nexport async function getStaticPaths(context:any={}) {\n const all=await (${getter} as any)({...context,__incrementalAll:true});\n if(context.__incrementalAll)return all;\n return require(${JSON.stringify(runtime)}).select(${JSON.stringify(template)},all,${props});\n}\n`;
}
function prepare(stage){fs.writeFileSync(path.join(stage,'.incremental-signatures.json'),JSON.stringify(require('./signatures.cjs').state(stage)));const runtime=path.join(stage,'scripts/incremental/select.cjs');
 function walk(dir){for(const e of fs.readdirSync(dir,{withFileTypes:true})){const file=path.join(dir,e.name);if(e.isDirectory())walk(file);else if(/\.[jt]sx?$/.test(e.name)){
  const source=fs.readFileSync(file,'utf8');if(!source.includes('getStaticPaths'))continue;
  const template='/'+path.relative(path.join(stage,'pages'),file).replace(/\.[jt]sx?$/,'').replace(/\/index$/,'');
  fs.writeFileSync(file,wrap(source,template,runtime));
 }}}walk(path.join(stage,'pages'));
}
module.exports={prepare,wrap};
