const {gzipSync,gunzipSync}=require('node:zlib');
const packedResponse=value=>new Response(gzipSync(JSON.stringify(value)));
const assert=require('node:assert/strict'),fs=require('node:fs'),os=require('node:os'),path=require('node:path');
const {compact}=require('./compact-prediction-export.cjs');
(async()=>{
 const worker=(await import('../worker/prediction-data.mjs')).default;
 const dir=fs.mkdtempSync(path.join(os.tmpdir(),'prediction-export-test-'));
 const props={pageProps:{stock:{ticker:'TEST'},text:'<>&',prices:[{date:'2026-11-25',close:25}]},__N_SSG:true};
 const html='<html><script id="__NEXT_DATA__" type="application/json">'+JSON.stringify({buildId:'build-1',props})+'</script></html>';
 const dataDir=path.join(dir,'_next/data/build-1/prediction/test-stock-price-prediction');fs.mkdirSync(dataDir,{recursive:true});
 const pageDir=path.join(dir,'prediction/test-stock-price-prediction/2030');fs.mkdirSync(pageDir,{recursive:true});
 fs.writeFileSync(path.join(dataDir,'2030.json'),JSON.stringify(props));fs.writeFileSync(path.join(pageDir,'index.html'),html);
 for(const locale of ['es','de','fr','ja','ko']){const dd=path.join(dir,'_next/data/build-1',locale,'prediction/test-stock-price-prediction');const hd=path.join(dir,locale,'prediction/test-stock-price-prediction/2030');fs.mkdirSync(dd,{recursive:true});fs.mkdirSync(hd,{recursive:true});fs.writeFileSync(path.join(dd,'2030.json'),JSON.stringify(props));fs.writeFileSync(path.join(hd,'index.html'),html);}
 assert.equal(compact(dir).count,6);assert(!fs.existsSync(path.join(dataDir,'2030.json')));
 const packed=await require('./pack-localized-predictions.cjs').pack(dir);assert.equal(packed.pages,5);assert.equal(packed.packs,5);
 for(const locale of ['es','de','fr','ja','ko']){const saved=JSON.parse(gunzipSync(fs.readFileSync(path.join(dir,'__localized',locale,'test-stock-price-prediction.json.gz'))).toString());assert.equal(saved['2030'],html);assert(!fs.existsSync(path.join(dir,locale,'prediction/test-stock-price-prediction/2030/index.html')));}
 const env={ASSETS:{fetch:async req=>new URL(req.url).pathname==='/prediction/test-stock-price-prediction/2030/'?new Response(html):new Response('missing',{status:404})}};
 const route='https://example.com/_next/data/build-1/prediction/test-stock-price-prediction/2030.json';
 for(const locale of ['es','de','fr','ja','ko']){const expected='/'+locale+'/prediction/test-stock-price-prediction/2030/';const localizedEnv={ASSETS:{fetch:async req=>{assert.equal(new URL(req.url).pathname,'/__localized/'+locale+'/test-stock-price-prediction.json.gz');return packedResponse({'2030':html,overview:html})}}};const localized=await worker.fetch(new Request(route.replace('/prediction/','/'+locale+'/prediction/')),localizedEnv);assert.equal(localized.status,200);assert.deepEqual(await localized.json(),props);}
 const htmlEnv={ASSETS:{fetch:async req=>new URL(req.url).pathname==='/__localized/fr/test-stock-price-prediction.json.gz'?packedResponse({'2030':html,overview:html}):new Response(null,{status:404})}};
 const htmlUrl='https://example.com/fr/prediction/test-stock-price-prediction/2030/';
 assert.equal(await(await worker.fetch(new Request(htmlUrl),htmlEnv)).text(),html);
 assert.equal(await(await worker.fetch(new Request(htmlUrl.replace('/2030/','/')),htmlEnv)).text(),html);
 assert.equal((await worker.fetch(new Request(htmlUrl.slice(0,-1)),htmlEnv)).status,308);
 assert.equal((await worker.fetch(new Request(htmlUrl.replace('/2030/','/2028/')),htmlEnv)).status,404);
 assert.equal(await(await worker.fetch(new Request(htmlUrl,{method:'HEAD'}),htmlEnv)).text(),'');
 const res=await worker.fetch(new Request(route),env);assert.equal(res.status,200);assert.deepEqual(await res.json(),props);
 assert.equal((await worker.fetch(new Request(route.replace('build-1','old-build')),env)).status,404);
 assert.equal((await worker.fetch(new Request(route.replace('/2030.json','/missing.json')),env)).status,404);
 assert.equal((await worker.fetch(new Request(route,{method:'POST'}),env)).status,405);
 assert.equal(await(await worker.fetch(new Request(route,{method:'HEAD'}),env)).text(),'');
 assert.equal((await worker.fetch(new Request('https://example.com/unknown'),env)).status,404);
 fs.rmSync(dir,{recursive:true});console.log('Compaction retains exact navigation data; old builds, missing pages, HEAD and methods verified.');
})().catch(e=>{console.error(e);process.exitCode=1});
