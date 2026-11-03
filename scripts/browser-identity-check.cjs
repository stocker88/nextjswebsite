const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
const source=ts.transpileModule(fs.readFileSync('lib/browser-identity.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText;
const values=new Map();let cookie='',written='',now=Date.now();
const store={getItem:k=>values.get(k)||null,setItem:(k,v)=>values.set(k,v)};
const doc={get cookie(){return cookie},set cookie(v){written=v;cookie=v.split(';')[0]}};
function load(overrides={}){const exports={};vm.runInNewContext(source,{exports,window:{},document:doc,localStorage:store,location:{protocol:'https:'},crypto:require('node:crypto').webcrypto,Uint8Array,Date:class extends Date{static now(){return now}},...overrides});return exports.browserIdentity;}
const first=load()();assert.match(first,/^[a-f0-9]{32}$/);assert.match(written,/; Secure$/);assert.match(written,/SameSite=Lax/);assert(!written.includes('Domain='));
assert.equal(load()(),first,'Reload retains browser');
values.clear();assert.equal(load()(),first,'Cookie restores local storage');
cookie='';assert.equal(load()(),first,'Local storage restores cookie');
assert.equal(load({localStorage:{getItem(){throw Error()},setItem(){throw Error()}}})(),first,'Cookie works when local storage is blocked');
const expires=JSON.parse(decodeURIComponent(cookie.split('=')[1])).expiresAt;now+=1000;load()();assert.equal(JSON.parse(decodeURIComponent(cookie.split('=')[1])).expiresAt,expires,'Reload does not extend retention');
now=expires+1;const next=load()();assert.notEqual(next,first,'Expired identity rotates');
cookie='';values.clear();assert.notEqual(load()(),next,'Cleared data is a new browser identity');
const ephemeral=load({document:{get cookie(){throw Error()},set cookie(v){throw Error()}},localStorage:{getItem(){throw Error()},setItem(){throw Error()}}});assert.equal(ephemeral(),ephemeral(),'Storage failures do not break signup');
assert.equal(load({window:undefined})(),undefined,'SSR has no browser ID');
console.log('Browser identity persistence, expiry, storage restrictions and SSR checks passed.');
