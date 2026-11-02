const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const ts = require('typescript');
const events = [], captures = [];
const ga = {initialize(){},set(){},event:(...args)=>events.push(args),send(){}};
const exportsObject = {};
const context = {exports:exportsObject,process:{env:{}},URL,URLSearchParams,Date,
  window:{location:{pathname:'/learn'}},document:{referrer:''},
  require:(name)=>name==='react-ga4'?{default:ga,__esModule:true}:{captureAcquisition:(...args)=>captures.push(args),acquisitionCampaign:()=>({utm_source:'instagram',utm_campaign:'test'})}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/analytics.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText,context);
const api=exportsObject;
assert.equal(api.appDownloadStore('https://apps.apple.com/us/app/stocker/id1565527320'),'apple');
assert.equal(api.appDownloadStore('https://apps.apple.com/us/app/stocker/id1565527320?action=write-review'),null);
assert.equal(api.appDownloadStore('https://play.google.com/store/apps/details?id=com.newcompany.stocker'),'google');
assert.equal(api.appDownloadStore('https://play.google.com/store/apps/details?id=com.newcompany.stocker&showAllReviews=true'),null);
assert.equal(api.appDownloadStore('https://play.google.com.evil.test/store/apps/details?id=com.newcompany.stocker'),null);
api.trackAuthentication('google',true); api.trackAuthentication('apple',false);
assert.equal(events[0][0],'sign_up'); assert.equal(events[1][0],'login');
api.trackAppStoreClick({store:'apple',placement:'hero',linkUrl:'https://apps.apple.com/us/app/stocker/id1565527320?web_token=secret'});
api.trackAppStoreClick({store:'apple',placement:'site_link',linkUrl:'https://apps.apple.com/us/app/stocker/id1565527320'});
assert.equal(events.filter(e=>e[0]==='app_store_click').length,1);
assert.equal(captures.length,1);
assert.equal(events[2][1].utm_source,'instagram');
assert.ok(!events[2][1].link_url.includes('secret'));
assert.ok(!api.safeAnalyticsUrl('https://play.google.com/store/apps/details?referrer=web_token%3Dsecret%26utm_source%3Dinstagram').includes('secret'));
console.log('Signup/login, store destination exclusions, duplicate click prevention, campaign labels and secret redaction passed.');
