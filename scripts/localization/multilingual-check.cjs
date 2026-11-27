const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),ts=require('typescript');
require.extensions['.ts']=(mod,file)=>mod._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true,target:ts.ScriptTarget.ES2020}}).outputText,file);
const {languages,hasTranslation,languagePath,languageOf,availableLanguages}=require('../../lib/localization/routes.ts');
const {catalogs,translateText,message}=require('../../lib/localization/translate.ts');
const {predictionSeo}=require('../../lib/prediction-seo.ts');
const keys=Object.keys(catalogs.de);
for(const lang of ['de','fr','ja','ko']){
 assert.deepEqual(Object.keys(catalogs[lang]).sort(),keys.slice().sort(),lang+' catalog parity');
 for(const key of keys){assert.ok(catalogs[lang][key].trim(),lang+': '+key);assert.deepEqual((catalogs[lang][key].match(/\{\w+\}/g)||[]).sort(),(key.match(/\{\w+\}/g)||[]).sort(),'placeholders: '+lang+' '+key);}
 for(const period of ['today','tomorrow','next-week','next-month','2026','2027','2028','2029','2030']){
 const english='/prediction/microsoft-stock-price-prediction/'+period+'/';
 assert.equal(languagePath(english+'?ref=1#chart',lang),'/'+lang+english+'?ref=1#chart');
 assert.equal(languagePath('/es'+english,lang),'/'+lang+english);
 assert.equal(languageOf('/'+lang+english),lang);
 assert.equal(availableLanguages(english).length,6);
 }
 assert.equal(hasTranslation('/stock-market-news/example/',lang),false);
 assert.equal(languagePath('/login/',lang),'/'+lang+'/login/');
 assert.equal(languagePath('https://example.com',lang),'https://example.com');
 for(const route of ['prediction/index.tsx','prediction/[slug].tsx','prediction/[slug]/[period].tsx','fear-and-greed-index/index.tsx','pentagon-pizza-index/index.tsx'])assert.ok(fs.existsSync(path.join('pages',lang,route)));
 assert.notEqual(translateText('What is the Microsoft stock price prediction for 2030?',lang),'What is the Microsoft stock price prediction for 2030?');
 assert.ok(!message('{name} stock price prediction for {period}: price chart & forecast',lang,{name:'Microsoft',period:'2030'}).includes('{'));
 assert.equal(translateText('489.93',lang),'489.93');
 assert.equal(translateText('Microsoft Corporation',lang),'Microsoft Corporation');
 const seo=predictionSeo('Microsoft','MSFT','2030',lang);assert.ok(seo.title.includes('2030')&&seo.description.includes('Microsoft'));assert.ok(!seo.description.includes('489.93'));
}
assert.equal(translateText('Markets','en'),'Markets');
assert.equal(translateText('Markets','es'),'Mercados');
assert.ok(message('Stock price prediction for {name} ({symbol})','es',{name:'Microsoft',symbol:'MSFT'}).startsWith('Predicción'));
console.log(`Passed: ${keys.length} keys × 4 catalogs, placeholders, locale routing, prediction templates, SEO and English/Spanish regression.`);
