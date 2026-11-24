const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const source=ts.transpileModule(fs.readFileSync('components/DeviceRecovery.tsx','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX,esModuleInterop:true}}).outputText;
const mod={exports:{}};
new Function('require','module','exports',source)(name=>name.endsWith('.css')?{}:name==='./AccountDevices'||name==='./DeviceUpgrade'?()=>null:name==='../lib/account-devices'?{}:require(name),mod,mod.exports);
for(const removedUntil of [undefined,'2026-11-25T12:00:00.000Z']){
 const html=renderToStaticMarkup(React.createElement(mod.exports.default,{removedUntil,onChanged:()=>{}}));
 assert.equal((html.match(/<button/g)||[]).length,2);
 assert.ok(html.includes('Add more device slots'));
 assert.ok(html.includes(removedUntil?'Back to sign in':'Manage signed-in devices'));
 assert.ok(!html.includes('Reset All Devices'));
 if(removedUntil){assert.ok(html.includes('Available again'));assert.ok(!html.includes('Manage signed-in devices'));}
}
console.log('PASS: normal and removed-device screens contain exactly the requested two actions.');
