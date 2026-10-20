const ENDPOINT = 'https://us-central1-stocker-fcda2.cloudfunctions.net/recordWebsiteVisit';
const IDENTITY = 'stocker.acquisition.v1';
const SESSION = 'stocker.acquisition.session.v1';
type Identity = {visitorId:string; visitorToken:string};
type Campaign = {source?:string; medium?:string; campaign?:string;referrerUid?:string;goal?:string};
let memory: Identity | null = null;
let sessionMemory = '';
let previousKey = '';
let originalReferrer: string | null = null;
let savedCampaign: Campaign = {};
const random = (bytes:number) => Array.from(crypto.getRandomValues(new Uint8Array(bytes))).map(n=>n.toString(16).padStart(2,'0')).join('');
function identity():Identity {
  if(memory)return memory;
  try { const stored=JSON.parse(localStorage.getItem(IDENTITY)||'null');
    if(/^[a-f0-9]{32}$/.test(stored?.visitorId)&&/^[a-f0-9]{64}$/.test(stored?.visitorToken)) return memory=stored;
  } catch (_) { /* Storage may be unavailable in private browsers. */ }
  memory={visitorId:random(16),visitorToken:random(32)};
  try{localStorage.setItem(IDENTITY,JSON.stringify(memory));}catch(_){}
  return memory;
}
function session():string {
  if(sessionMemory)return sessionMemory;
  try{sessionMemory=sessionStorage.getItem(SESSION)||'';}catch(_){}
  if(!/^[a-f0-9]{32}$/.test(sessionMemory)){
    sessionMemory=random(16);try{sessionStorage.setItem(SESSION,sessionMemory);}catch(_){}
  }
  return sessionMemory;
}
export function captureAcquisition(campaign:Campaign={}, store?:'apple'|'google') {
  if(typeof window==='undefined')return;
  try {
    const params=new URLSearchParams(location.search);
    if(originalReferrer===null)originalReferrer=document.referrer;
    for (const key of ['source','medium','campaign','referrerUid'] as const) {
      const value=campaign[key]||(key==='referrerUid'?campaign.goal||params.get('goal'):'')||params.get(key)||params.get(`utm_${key}`);
      if(value)savedCampaign[key]=value;
    }
    const data={...identity(),sessionId:session(),path:location.pathname,referrer:originalReferrer,
      source:savedCampaign.source||'',
      medium:savedCampaign.medium||'',
      campaign:savedCampaign.campaign||'',referrerUid:savedCampaign.referrerUid||'',store};
    // Capture landings, resolved campaigns and store exits, not every rerender.
    const key=JSON.stringify({...data,path:undefined});if(key===previousKey&&!store)return;previousKey=key;
    void fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true}).catch(()=>{previousKey='';});
  }catch(_){/* Analytics must never block navigation. */}
}
export function attributionLink(raw:string):string {
  if(typeof window==='undefined')return raw;
  try{
    const url=new URL(raw,location.origin);
    const isPlay=url.hostname==='play.google.com'&&url.pathname==='/store/apps/details'&&url.searchParams.get('id')==='com.newcompany.stocker';
    const isApp=['com.newcompany.stocker:','ai.stockstobuynow:'].includes(url.protocol);
    const isInsight=url.origin===location.origin&&url.pathname==='/insight_details_page';
    if(!isPlay&&!isApp&&!isInsight)return raw;
    const id=identity();const target=isPlay?new URLSearchParams(url.searchParams.get('referrer')||''):url.searchParams;
    target.set('web_visit',id.visitorId);target.set('web_token',id.visitorToken);
    if(isPlay)url.searchParams.set('referrer',target.toString());
    return url.toString();
  }catch(_){return raw;}
}
export function installAcquisitionCapture():()=>void {
  captureAcquisition();
  const click=(event:Event)=>{
    const target=event.target instanceof Element?event.target.closest('a'):null;
    if(!(target instanceof HTMLAnchorElement))return;
    const url=new URL(target.href,location.origin);
    if(url.hostname==='apps.apple.com')captureAcquisition({},'apple');
    if(url.hostname==='play.google.com')captureAcquisition({},'google');
    if (['com.newcompany.stocker:','ai.stockstobuynow:'].includes(url.protocol)||url.hostname==='play.google.com') target.href=attributionLink(target.href);
  };
  // Capture phase updates the destination before React handlers or navigation.
  document.addEventListener('click',click,true);
  document.addEventListener('auxclick',click,true);
  return ()=>{document.removeEventListener('click',click,true);document.removeEventListener('auxclick',click,true);};
}
