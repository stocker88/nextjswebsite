// Analytics correlation only. Never use this ID to authenticate or credit referrals.
const COOKIE = 'stbn_browser_v1';
const STORAGE = 'stbn.browser.v1';
const LIFETIME = 180 * 24 * 60 * 60 * 1000;
type BrowserIdentity = {id:string; expiresAt:number};
let memory:BrowserIdentity|undefined;
function valid(value:unknown):value is BrowserIdentity {
 const v=value as BrowserIdentity;
 return !!v && /^[a-f0-9]{32}$/.test(v.id) && Number.isSafeInteger(v.expiresAt)
   && v.expiresAt>Date.now() && v.expiresAt<=Date.now()+LIFETIME;
}
export function browserIdentity():string|undefined {
 if(typeof window==='undefined')return undefined;
 if(valid(memory))return memory.id;
 let stored:unknown;
 try {
  const raw=document.cookie.split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);
  if(raw)stored=JSON.parse(decodeURIComponent(raw));
 }catch{}
 if(!valid(stored)){try{stored=JSON.parse(localStorage.getItem(STORAGE)||'null')}catch{}}
 memory=valid(stored)?stored:{id:Array.from(crypto.getRandomValues(new Uint8Array(16)),v=>v.toString(16).padStart(2,'0')).join(''),expiresAt:Date.now()+LIFETIME};
 const value=JSON.stringify(memory);
 // Host-only, first-party cookie. Never include account IDs or handoff credentials.
 try{document.cookie=COOKIE+'='+encodeURIComponent(value)+'; Path=/; SameSite=Lax; Expires='+new Date(memory.expiresAt).toUTCString()+(location.protocol==='https:'?'; Secure':'')}catch{}
 try{localStorage.setItem(STORAGE,value)}catch{}
 return memory.id;
}
