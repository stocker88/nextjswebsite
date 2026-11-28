// Render only legal routes, preserving every other published file byte-for-byte.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
function merge(baseline,generated){
 const pages=require(path.join(root,'data/legal-disclosures.json')),routes=['legal',...pages.map(p=>'legal/'+p.slug)];
 for(const route of routes){
  const file=path.join(generated,route,'index.html'),html=fs.readFileSync(file,'utf8');
  assert(html.includes('https://www.stockstobuynow.ai/'+route+'/'),'Missing canonical '+route);
  assert(/name="robots" content="index,follow/.test(html),'Not indexable '+route);
  assert(!/Draft for review|Before this policy can be published|Proposed coverage/.test(html),'Draft text '+route);
  fs.mkdirSync(path.join(baseline,route),{recursive:true});fs.copyFileSync(file,path.join(baseline,route,'index.html'));
 }
 // Keep existing scripts/data/build IDs. New legal pages carry their own assets.
 for(const dir of ['static','data']){const source=path.join(generated,'_next',dir);if(fs.existsSync(source))fs.cpSync(source,path.join(baseline,'_next',dir),{recursive:true,errorOnExist:false});}
 const sitemapPath=path.join(baseline,'sitemap.xml');let sitemap=fs.readFileSync(sitemapPath,'utf8');
 const location='https://www.stockstobuynow.ai/sitemaps/legal.xml';
 if(sitemap.includes('</urlset>')){
  fs.mkdirSync(path.join(baseline,'sitemaps'),{recursive:true});
  fs.writeFileSync(path.join(baseline,'sitemaps/retained.xml'),sitemap);
  sitemap='<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.stockstobuynow.ai/sitemaps/retained.xml</loc></sitemap></sitemapindex>';
 }
 assert(sitemap.includes('</sitemapindex>'),'Expected production sitemap index');
 if(!sitemap.includes('<loc>'+location+'</loc>'))sitemap=sitemap.replace('</sitemapindex>','<sitemap><loc>'+location+'</loc></sitemap></sitemapindex>');
 fs.writeFileSync(sitemapPath,sitemap);
 // Remove existing legal entries from other partitions to keep canonical URLs unique.
 const parts=path.join(baseline,'sitemaps');
 for(const name of fs.readdirSync(parts)){if(!name.endsWith('.xml')||name==='legal.xml')continue;const p=path.join(parts,name),xml=fs.readFileSync(p,'utf8');const clean=xml.replace(/<url>\s*<loc>https:\/\/www\.stockstobuynow\.ai\/legal(?:\/[^<]*)?<\/loc>[\s\S]*?<\/url>/g,'');if(clean!==xml)fs.writeFileSync(p,clean);}
 fs.writeFileSync(path.join(parts,'legal.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>'<url><loc>https://www.stockstobuynow.ai/'+r+'/</loc></url>').join('')+'</urlset>');
 // A mixed release must never claim that all pages use the new source signatures.
 const metadata=path.join(baseline,'__deployment.json');if(fs.existsSync(metadata)){const d=JSON.parse(fs.readFileSync(metadata));delete d.signatures;fs.writeFileSync(metadata,JSON.stringify(d));}
 console.log('Legal-only merge: '+routes.length+' pages; other HTML and prediction packs retained.');
}
function build(){
 const baseline=process.env.WEBSITE_PREVIOUS_EXPORT;assert(baseline&&fs.existsSync(path.join(baseline,'index.html')),'A successful production export is required; no full-build fallback.');
 if(process.env.GITHUB_ACTIONS==='true'){
  const live=execFileSync('curl',['--fail','--silent','--show-error','https://www.stockstobuynow.ai/'],{encoding:'utf8'});
  const saved=fs.readFileSync(path.join(baseline,'index.html'),'utf8');
  const id=html=>JSON.parse(html.match(/<script\b[^>]*id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/)[1]).buildId;
  console.log('Production baseline build:',id(saved),'Live build:',id(live));
  assert.equal(id(saved),id(live),'Saved export does not match live production; refusing to replace unrelated pages.');
 }
 const stage=path.join(process.env.WEBSITE_EXPORT_VOLUME||root,'.legal-build');fs.rmSync(stage,{recursive:true,force:true});fs.mkdirSync(stage,{recursive:true});
 for(const dir of ['components','lib','styles','data','context','contexts','hooks','utils','types','@types','interfaces','layouts','views'])if(fs.existsSync(path.join(root,dir)))fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});
 for(const file of ['package.json','tsconfig.json','next-env.d.ts','postcss.config.js','tailwind.config.js','tailwind.config.ts','stockerSession.tsx','mathjax-config.js'])if(fs.existsSync(path.join(root,file)))fs.copyFileSync(path.join(root,file),path.join(stage,file));
 fs.mkdirSync(path.join(stage,'pages'));for(const file of ['_app.tsx','_document.tsx'])if(fs.existsSync(path.join(root,'pages',file)))fs.copyFileSync(path.join(root,'pages',file),path.join(stage,'pages',file));
 fs.cpSync(path.join(root,'pages/legal'),path.join(stage,'pages/legal'),{recursive:true});
 fs.symlinkSync(path.join(root,'node_modules'),path.join(stage,'node_modules'),'dir');
 fs.writeFileSync(path.join(stage,'next.config.js'),"module.exports={output:'export',trailingSlash:true,poweredByHeader:false,images:{unoptimized:true},experimental:{cpus:2}};");
 execFileSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build'],{cwd:stage,stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
 merge(baseline,path.join(stage,'out'));
 const out=path.join(root,'out');fs.rmSync(out,{recursive:true,force:true});fs.symlinkSync(baseline,out,'dir');
}
if(require.main===module)build();module.exports={merge};
