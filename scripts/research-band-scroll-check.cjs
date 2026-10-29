const ts=require('typescript'),fs=require('node:fs'),assert=require('node:assert/strict');
const compiled=ts.transpileModule(fs.readFileSync('lib/research-band-scroll.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText;
function setup(paused=false,reduced=false,max=300){
 let now=0,next=0,position=0;const frames=new Map();
 const motion=Object.assign(new EventTarget(),{matches:reduced});
 const win=Object.assign(new EventTarget(),{matchMedia:()=>motion,requestAnimationFrame:fn=>{frames.set(++next,fn);return next},cancelAnimationFrame:id=>frames.delete(id)});
 const doc=Object.assign(new EventTarget(),{hidden:false,activeElement:null});
 const rail=Object.assign(new EventTarget(),{scrollWidth:400,clientWidth:400-max});
 Object.defineProperty(rail,'scrollLeft',{get:()=>position,set:value=>position=Math.min(max,Math.max(0,Math.round(value)))});
 const region=Object.assign(new EventTarget(),{contains:value=>value==='inside'});
 const out={};new Function('exports','window','document','performance',compiled)(out,win,doc,{now:()=>now});
 const stop=out.startResearchBandScroll(rail,region,paused);
 const advance=ms=>{for(let t=0;t<ms;t+=16){now+=16;const batch=[...frames.values()];frames.clear();batch.forEach(fn=>fn(now));}};
 return {rail,region,doc,motion,advance,stop,frames};
}
let s=setup();s.advance(1800);const first=s.rail.scrollLeft;s.advance(1000);assert.ok(s.rail.scrollLeft>first+15&&s.rail.scrollLeft<first+21,'Moves gently at approximately 18 px/second');
s.region.dispatchEvent(Object.assign(new Event('pointerenter'),{pointerType:'mouse'}));const hovered=s.rail.scrollLeft;s.advance(3000);assert.equal(s.rail.scrollLeft,hovered,'Hover pauses reading');
s.region.dispatchEvent(new Event('pointerleave'));s.advance(3000);assert.ok(s.rail.scrollLeft>hovered,'Motion resumes after leaving');
s.region.dispatchEvent(new Event('focusin'));const focused=s.rail.scrollLeft;s.advance(3000);assert.equal(s.rail.scrollLeft,focused,'Keyboard focus pauses reading');
s.stop();assert.equal(s.frames.size,0,'Unmount cancels its animation frame');
for(const [paused,reduced,max] of [[true,false,300],[false,true,300],[false,false,0]]){s=setup(paused,reduced,max);s.advance(5000);assert.equal(s.rail.scrollLeft,0);s.stop();}
s=setup(false,false,20);s.advance(3100);assert.equal(s.rail.scrollLeft,20,'Reaches the final headline without a reset');s.advance(3500);assert.ok(s.rail.scrollLeft<20,'Gently reverses after the end pause');s.stop();
console.log('Slow scrolling, hover/focus pause, user pause, reduced motion, edge reversal and cleanup passed');
