const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {select,embedded,routeFor,assetsFromHtml}=require('./select.cjs'),{wrap}=require('./prepare.cjs'),{merge}=require('./merge.cjs');
(async()=>{
 const baselineRun=require('./restore.cjs').findBaseline(endpoint=>endpoint.includes('status=success')?{workflow_runs:[{id:1,conclusion:'success'}]}:endpoint.includes('status=completed')?{workflow_runs:Array.from({length:10},(_,i)=>({id:20-i,conclusion:'failure'}))}:endpoint.endsWith('/jobs')?{jobs:[{name:'deploy',conclusion:'skipped'}]}:{artifacts:[{name:'cloudflare-site',expired:false}]},99);assert.equal(baselineRun.id,1);
 const root=fs.mkdtempSync(path.join(os.tmpdir(),'incremental-check-')),baseline=path.join(root,'previous'),out=path.join(root,'out');
 const write=(name,text)=>{fs.mkdirSync(path.dirname(name),{recursive:true});fs.writeFileSync(name,text)};
 const assets=['static/chunks/framework-a.js','static/chunks/pages/_app-a.js','static/chunks/pages/news/[slug]-a.js','static/css/a.css'];
 write(path.join(root,'.next/build-manifest.json'),JSON.stringify({pages:{'/_app':assets.slice(0,2),'/news/[slug]':assets.slice(2)}}));write(path.join(root,'.next/BUILD_ID'),'new');
 const html=(slug,text)=>'<html>'+assets.map(a=>a.endsWith('.css')?`<link rel="stylesheet" href="/_next/${a}"/>`:`<script src="/_next/${a}"></script>`).join('')+'<script id="__NEXT_DATA__">'+JSON.stringify({buildId:'old',page:'/news/[slug]',props:{__N_SSG:true,pageProps:{slug,text}}})+'</script></html>';
 for(const [slug,text] of [['same','unchanged'],['edit','old'],['removed','retired']])write(path.join(baseline,'news',slug,'index.html'),html(slug,text));
 const {state,sameLanguage}=require('./signatures.cjs');
 write(path.join(root,'data/localization/home.json'),JSON.stringify({Hello:{fr:'Bonjour',de:'Hallo'}}));const before=state(root);
 write(path.join(root,'data/localization/home.json'),JSON.stringify({Hello:{fr:'Salut',de:'Hallo'}}));const after=state(root);
 assert(sameLanguage(after,before,'/de/prediction/[slug]'));assert(sameLanguage(after,before,'/prediction/[slug]'));assert(!sameLanguage(after,before,'/fr/prediction/[slug]'));
 const previous=process.env.WEBSITE_PREVIOUS_EXPORT;process.env.WEBSITE_PREVIOUS_EXPORT=baseline;
 const result=await select('/news/[slug]',{paths:['same','edit','new'].map(slug=>({params:{slug}})),fallback:false},async({params:{slug}})=>({props:{slug,text:slug==='same'?'unchanged':'new'}}),root);
 assert.deepEqual(result.paths.map(e=>e.params.slug),['edit','new']);assert.equal(routeFor('/fr/guides/[...slug]',{params:{slug:['one','two']}}),'/fr/guides/one/two');
 for(const slug of ['edit','new'])write(path.join(out,'news',slug,'index.html'),html(slug,'new'));
 for(const a of assets)write(path.join(baseline,'_next',a),'asset');
 merge(root,out,baseline);assert(fs.existsSync(path.join(out,'news/same/index.html')));assert(!fs.existsSync(path.join(out,'news/removed/index.html')));assert.equal(embedded(fs.readFileSync(path.join(out,'news/edit/index.html'),'utf8')).props.pageProps.text,'new');
 assert(assetsFromHtml(html('same','unchanged')).every(a=>/js|css/.test(a)));
 const wrapped=wrap('export {default,getStaticProps,getStaticPaths} from "../news";','/fr/news/[slug]','/runtime.cjs');assert(wrapped.includes('__incrementalAll:true'));assert(wrapped.includes('getStaticProps as __incrementalProps'));
 const worker=(await import('../../worker/prediction-data.mjs')).default;
 const env={ASSETS:{fetch:async req=>{const p=new URL(req.url).pathname;if(p==='/__deployment.json')return Response.json({buildId:'new'});if(p==='/news/same/')return new Response(html('same','unchanged'));return new Response(null,{status:404});}}};
 for(const id of ['old','new']){const r=await worker.fetch(new Request('https://example.com/_next/data/'+id+'/news/same.json'),env);assert.equal(r.status,200);assert.equal((await r.json()).pageProps.text,'unchanged');}
 assert.equal((await worker.fetch(new Request('https://example.com/_next/data/unknown/news/same.json'),env)).status,404);
 if(previous===undefined)delete process.env.WEBSITE_PREVIOUS_EXPORT;else process.env.WEBSITE_PREVIOUS_EXPORT=previous;
 fs.rmSync(root,{recursive:true});console.log('PASS incremental content changes, unchanged reuse, deleted routes, language paths, assets and cross-build navigation');
})().catch(e=>{console.error(e);process.exitCode=1});
