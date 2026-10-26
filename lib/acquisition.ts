const ENDPOINT = 'https://us-central1-stocker-fcda2.cloudfunctions.net/recordWebsiteVisit';
const IDENTITY = 'stocker.acquisition.v1';
const SESSION = 'stocker.acquisition.session.v1';
const ARRIVAL = 'stocker.acquisition.arrival.v1';
const APPLE_PROVIDER = process.env.NEXT_PUBLIC_APPLE_PROVIDER_TOKEN || '';
type Identity = {visitorId:string; visitorToken:string};
type Campaign = {
  source?:string;
  medium?:string;
  campaign?:string;
  term?:string;
  content?:string;
  adGroup?:string;
  referrerUid?:string;
  goal?:string;
};
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
function arrival(campaign:Campaign={}) {
  const params=new URLSearchParams(location.search);
  if(originalReferrer===null){
    try { const stored=JSON.parse(sessionStorage.getItem(ARRIVAL)||'null');
      if(stored && Date.now()-stored.at<30*60*1000){savedCampaign=stored.campaign||{};originalReferrer=stored.referrer||'';}
      else {sessionMemory='';sessionStorage.removeItem(SESSION);}
    }catch(_){}
    if(originalReferrer===null)originalReferrer=document.referrer;
  }
  const incoming:Campaign={};
  const fields = [
    ['source','utm_source'],
    ['medium','utm_medium'],
    ['campaign','utm_campaign'],
    ['term','utm_term'],
    ['content','utm_content'],
    ['adGroup','utm_adgroup'],
    ['referrerUid','referrerUid'],
  ] as const;
  for(const [key,queryKey] of fields){
    const value=campaign[key]||(key==='referrerUid'?campaign.goal||params.get('goal'):'')||params.get(queryKey)||params.get(key);
    if(value)incoming[key]=value.slice(0,160);
  }
  // A new campaign must not inherit the previous campaign's medium or invite.
  if(Object.keys(incoming).length) savedCampaign=incoming;
  try{sessionStorage.setItem(ARRIVAL,JSON.stringify({campaign:savedCampaign,referrer:originalReferrer,at:Date.now()}));}catch(_){}
}
function payload(campaign:Campaign={},store?:'apple'|'google') {
  arrival(campaign);
  return {...identity(),sessionId:session(),path:location.pathname,referrer:originalReferrer,...savedCampaign,store};
}
export function captureAcquisition(campaign:Campaign={}, store?:'apple'|'google') {
  if(typeof window==='undefined')return;
  try {
    const data=payload(campaign,store);
    // Capture landings, resolved campaigns and store exits, not every rerender.
    const key=JSON.stringify({...data,path:undefined});if(key===previousKey&&!store)return;previousKey=key;
    void fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),keepalive:true}).then(response=>{if(!response.ok)previousKey='';}).catch(()=>{previousKey='';});
  }catch(_){/* Analytics must never block navigation. */}
}
export async function createAcquisitionRecoveryCode():Promise<string> {
  const response=await fetch(ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({...payload(),issueCode:true})});
  if(!response.ok)throw new Error('Unable to create a code. Please try again.');
  const result=await response.json();
  if(typeof result.recoveryCode!=='string')throw new Error('Please try again.');
  return result.recoveryCode;
}
export function attributionLink(raw:string):string {
  if(typeof window==='undefined')return raw;
  try{
    arrival();
    const url=new URL(raw,location.origin);
    const isPlay=url.hostname==='play.google.com'&&url.pathname==='/store/apps/details'&&url.searchParams.get('id')==='com.newcompany.stocker';
    const isApp=['com.newcompany.stocker:','ai.stockstobuynow:'].includes(url.protocol);
    const isInsight=url.origin===location.origin&&url.pathname==='/insight_details_page';
    const isApple=url.hostname==='apps.apple.com'&&/\/id1565527320(?:$|\/)/.test(url.pathname);
    if(isApple){
      if(APPLE_PROVIDER && /^[0-9]+$/.test(APPLE_PROVIDER)){
        if(!url.searchParams.has('pt'))url.searchParams.set('pt',APPLE_PROVIDER);
        if(!url.searchParams.has('ct'))url.searchParams.set('ct',(savedCampaign.campaign||savedCampaign.source||'website').slice(0,30));
        url.searchParams.set('mt','8');
      }
      return url.toString();
    }
    if(!isPlay&&!isApp&&!isInsight)return raw;
    const id=identity();const target=isPlay?new URLSearchParams(url.searchParams.get('referrer')||''):url.searchParams;
    for(const [key,param] of [['source','utm_source'],['medium','utm_medium'],['campaign','utm_campaign'],['term','utm_term'],['content','utm_content'],['adGroup','utm_adgroup']] as const){
      if(savedCampaign[key]&&!target.has(param))target.set(param,savedCampaign[key]!);
    }
    if(savedCampaign.referrerUid&&!target.has('referrerUid'))target.set('referrerUid',savedCampaign.referrerUid);
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
    if (['com.newcompany.stocker:','ai.stockstobuynow:'].includes(url.protocol)||['play.google.com','apps.apple.com'].includes(url.hostname)) target.href=attributionLink(target.href);
  };
  // Capture phase updates the destination before React handlers or navigation.
  document.addEventListener('click',click,true);
  document.addEventListener('auxclick',click,true);
  return ()=>{document.removeEventListener('click',click,true);document.removeEventListener('auxclick',click,true);};
}
