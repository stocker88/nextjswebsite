const assert=require('node:assert/strict');
const fs=require('node:fs');
const ts=require('typescript');
const Module=require('node:module');
const path=require('node:path');
const filename=path.resolve('lib/localization/routes.ts');
const mod=new Module(filename,module);
mod._compile(ts.transpileModule(fs.readFileSync(filename,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,filename);
const {languageOf,languagePath,englishPath,hasSpanish,spanishRoutes}=mod.exports;
assert.equal(languageOf('/es/?utm_source=google'),'es');
assert.equal(languageOf('/es?utm_source=google'),'es');
assert.equal(languageOf('/estimates/'),'en');
assert.equal(englishPath('/es?ref=test'),'/?ref=test');
assert.equal(languagePath('/trading-tools/?utm_source=google#tool-library','es'),'/es/trading-tools/?utm_source=google#tool-library');
assert.equal(languagePath('/es/trading-tools/?utm_source=google#tool-library','en'),'/trading-tools/?utm_source=google#tool-library');
assert.equal(languagePath('/stock-market-news/example/','es'),'/stock-market-news/example/');
assert.equal(languagePath('/prediction/micron-stock-price-prediction/2030/','es'),'/es/prediction/micron-stock-price-prediction/2030/');
assert.equal(languagePath('https://example.com/path','es'),'https://example.com/path');
assert.equal(languagePath('//example.com/path','es'),'//example.com/path');
assert.equal(hasSpanish('/es/trading-tools'),true);
assert.equal(hasSpanish('/stock-market-news/'),false);
for(const route of spanishRoutes){
 const name=route==='/'?'index':route.replace(/^\//,'').replace(/\/$/,'');
 assert.ok(fs.existsSync(`pages/es/${name}.tsx`)||fs.existsSync(`pages/es/${name}/index.tsx`),`Missing Spanish page: ${route}`);
}
console.log(`Passed localization URL checks; ${spanishRoutes.length} Spanish routes registered.`);
