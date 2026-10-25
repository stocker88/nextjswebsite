// Read the saved public projection. Never place provider credentials in the site.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'..'),file=path.join(root,'data/smart-money.json');
async function sync(){let old=null;try{old=JSON.parse(fs.readFileSync(file,'utf8'));}catch{}
 try{const response=await fetch('https://us-central1-stocker-fcda2.cloudfunctions.net/smartMoneySnapshot',{signal:AbortSignal.timeout(20000)});if(!response.ok)throw Error('HTTP '+response.status);const data=await response.json();if(data.version!==1||!data.updatedAt||!Array.isArray(data.items)||!data.items.length||!Array.isArray(data.feeds)||!Array.isArray(data.signals))throw Error('Invalid snapshot');if(old?.updatedAt&&Date.parse(data.updatedAt)<Date.parse(old.updatedAt))throw Error('Older snapshot');fs.writeFileSync(file+'.tmp',JSON.stringify(data));fs.renameSync(file+'.tmp',file);fs.writeFileSync(path.join(root,'public/smart-money-snapshot.json'),JSON.stringify(data));console.log('Refreshed '+data.items.length+' disclosure records');}
 catch(e){if(!old)throw e;fs.writeFileSync(path.join(root,'public/smart-money-snapshot.json'),JSON.stringify(old));console.warn('Keeping dated Smart Money snapshot ('+e.message+')');}
}
sync().catch(e=>{console.error(e.message);process.exitCode=1;});
