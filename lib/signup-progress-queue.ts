export type SignupEvent={browserId?:string;eventId:string;step:string;action:string;errorCode:string;platform:'web';clientAt:number;sessionId:string;build:'web-funnel-v2';provider?:string;attemptId?:string;durationMs?:number;isNewUser?:boolean;experience?:string;deviceClass?:string};
// Account-scoped, bounded, at-least-once delivery. Server IDs deduplicate retries.
export class SignupProgressQueue {
 private events:SignupEvent[];private busy=false;
 constructor(private save:(events:SignupEvent[])=>void,initial:SignupEvent[]=[],private now=()=>Date.now()){
  this.events=initial.filter(e=>e&&typeof e.eventId==='string'&&Number.isFinite(e.clientAt)&&this.now()-e.clientAt<86400000).slice(-100);
 }
 add(event:SignupEvent){if(!this.events.some(e=>e.eventId===event.eventId))this.events=[...this.events,event].slice(-100);this.save(this.events)}
 async flush(send:(event:SignupEvent)=>Promise<void>,active:()=>boolean){
  if(this.busy)return true;
  this.busy=true;
  try{
   while(this.events.length&&active()){
    const event=this.events[0];
    if(this.now()-event.clientAt>=86400000){this.events.shift();this.save(this.events);continue}
    try{await send(event)}catch(error){
     if(!['functions/invalid-argument','functions/permission-denied'].includes((error as {code?:string})?.code||''))return false;
    }
    this.events=this.events.filter(e=>e.eventId!==event.eventId);this.save(this.events);
   }
   return true;
  }finally{this.busy=false}
 }
}
