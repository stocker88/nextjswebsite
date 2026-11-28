// Render only legal routes into a separately deployed asset namespace.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{execFileSync}=require('node:child_process');
const root=path.resolve(__dirname,'../..');
function build(){
 const stage=path.join(process.env.WEBSITE_EXPORT_VOLUME||root,'.legal-build');fs.rmSync(stage,{recursive:true,force:true});fs.mkdirSync(stage,{recursive:true});
 for(const dir of ['components','lib','styles','data','context','contexts','hooks','utils','types','@types','interfaces','layouts','views'])if(fs.existsSync(path.join(root,dir)))fs.cpSync(path.join(root,dir),path.join(stage,dir),{recursive:true});
 for(const file of ['package.json','tsconfig.json','next-env.d.ts','postcss.config.js','tailwind.config.js','tailwind.config.ts','stockerSession.tsx','mathjax-config.js'])if(fs.existsSync(path.join(root,file)))fs.copyFileSync(path.join(root,file),path.join(stage,file));
 fs.mkdirSync(path.join(stage,'pages'));for(const file of ['_app.tsx','_document.tsx'])if(fs.existsSync(path.join(root,'pages',file)))fs.copyFileSync(path.join(root,'pages',file),path.join(stage,'pages',file));
 fs.cpSync(path.join(root,'pages/legal'),path.join(stage,'pages/legal'),{recursive:true});
 fs.mkdirSync(path.join(stage,'components/partial'),{recursive:true});
 fs.copyFileSync(path.join(stage,'pages/legal/[slug].tsx'),path.join(stage,'components/partial/LegalDisclosure.tsx'));
 fs.unlinkSync(path.join(stage,'pages/legal/[slug].tsx'));
 for(const page of require(path.join(root,'data/legal-disclosures.json')))fs.writeFileSync(path.join(stage,'pages/legal',page.slug+'.tsx'),`import Page from '../../components/partial/LegalDisclosure';import pages from '../../data/legal-disclosures.json';export default function Legal(){return <Page page={pages.find(p=>p.slug===${JSON.stringify(page.slug)})!}/>}`);
 fs.symlinkSync(path.join(root,'node_modules'),path.join(stage,'node_modules'),'dir');
 fs.writeFileSync(path.join(stage,'next.config.js'),"module.exports={output:'export',assetPrefix:'/_legal-assets',trailingSlash:true,poweredByHeader:false,images:{unoptimized:true},experimental:{cpus:2}};");
 execFileSync(process.execPath,[path.join(root,'node_modules/next/dist/bin/next'),'build'],{cwd:stage,stdio:'inherit',env:{...process.env,NEXT_TELEMETRY_DISABLED:'1'}});
 const generated=path.join(stage,'out'),routes=['legal',...require(path.join(root,'data/legal-disclosures.json')).map(p=>'legal/'+p.slug)];
 for(const route of routes){const html=fs.readFileSync(path.join(generated,route,'index.html'),'utf8');assert(html.includes('https://www.stockstobuynow.ai/'+route+'/'));assert(/name="robots" content="index,follow/.test(html));assert(!/Draft for review|Before this policy can be published/.test(html));}
 fs.mkdirSync(path.join(generated,'_legal-assets'),{recursive:true});fs.renameSync(path.join(generated,'_next'),path.join(generated,'_legal-assets/_next'));
 fs.mkdirSync(path.join(generated,'sitemaps'),{recursive:true});fs.writeFileSync(path.join(generated,'sitemaps/legal.xml'),'<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'+routes.map(r=>'<url><loc>https://www.stockstobuynow.ai/'+r+'/</loc></url>').join('')+'</urlset>');
 const out=path.join(root,'legal-out');fs.rmSync(out,{recursive:true,force:true});fs.renameSync(generated,out);
 console.log('Legal-only export verified: six static pages and their isolated assets.');
}
if(require.main===module)build();module.exports={build};
