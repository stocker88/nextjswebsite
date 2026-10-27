const fs=require('node:fs'),assert=require('node:assert/strict'),ts=require('typescript'),React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const frozen=JSON.parse(fs.readFileSync('data/snow-signal-replay.json','utf8'));
function load(file,imports={}){
 const m={exports:{}};
 const output=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.React,esModuleInterop:true}}).outputText;
 new Function('module','exports','require','React',output)(m,m.exports,id=>{if(id in imports)return imports[id];throw Error('Unexpected dependency: '+id)},React);
 return m.exports;
}
const core=load('lib/snow-signal-replay.ts',{'../data/snow-signal-replay.json':frozen});
assert.equal(frozen.signalId,'1778630772');
assert.equal(frozen.original.price.length,105);assert.equal(frozen.review.price.length,129);
assert.equal(frozen.original.financials.length,7);assert.equal(frozen.review.financials.length,9);
assert.deepEqual(frozen.review.price.slice(0,105),frozen.original.price);
assert.deepEqual(frozen.review.financials.slice(0,7),frozen.original.financials);
assert.equal(frozen.original.price.at(-1).y1,151.52);
assert.equal(frozen.review.price.at(-1).y1,334.95001221);
for(const series of [frozen.original.price,frozen.original.financials,frozen.review.price,frozen.review.financials]){
 assert.ok(series.every((p,i)=>Number.isFinite(p.y1)&&p.x>1e9&&(i===0||p.x>series[i-1].x)));
}
const native=load('lib/signal-chart.ts');
for(const [key,mode] of [['price','price'],['financials','financial']]){
 const projected=native.signalChartProjection(frozen.original[key].map(p=>({x:p.x,value:p.y1})),'up',mode).map(p=>({x:p.x,y1:p.value}));
 assert.deepEqual(frozen.original[key==='price'?'priceProjection':'financialProjection'],projected);
}
const geometry=core.replayGeometry(frozen.original.price,frozen.original.priceProjection);
assert.equal(geometry.path(frozen.original.price).match(/L /g).length,104);
assert.ok(Math.abs(geometry.x(frozen.original.price.at(-1))-(4+92/1.3))<1e-9);
assert.equal(geometry.y(geometry.min),87);assert.equal(geometry.y(geometry.max),14);
assert.equal(core.nearestReplayPoint(frozen.original.price,geometry.x(frozen.original.price[39]),geometry.x),39);
const bars=core.replayGeometry(frozen.original.financials,frozen.original.financialProjection,true);
assert.equal(bars.projectedBars.length,2);
assert.equal(bars.y(frozen.original.financials[0].y1),bars.y(bars.baseline));
const featured=JSON.parse(fs.readFileSync('data/featured-research.json','utf8')).find(p=>p.id==='Z1DGRFrLd7Gl7ZuAV712');
const component=load('components/SnowSignalStory.tsx',{'react':React,'./AppDownloadModal':{default:()=>null},'../lib/snow-signal-replay':core,'../lib/featured-research':{overnightOptionsResult:featured},'../styles/SnowSignalStory.module.css':new Proxy({},{get:(_,k)=>k})});
const markup=renderToStaticMarkup(React.createElement(component.default));
assert.match(markup,/105 saved observations/);assert.match(markup,/129 saved observations/);
assert.match(markup,/Original signal/);assert.match(markup,/What happened next/);
assert.match(markup,/\$151.52/);assert.match(markup,/\$334.95/);assert.match(markup,/\+121.1%/);
assert.ok(!markup.includes('$141.00'));
const source=fs.readFileSync('components/SnowSignalStory.tsx','utf8');
assert.doesNotMatch(source,/getSiteAuth|firebase\/firestore|localStorage|useSiteAccount|fetch\(|slice\(-120\)|previewData|stockbuyanalyst/);
console.log('PASS: exact saved signal; 105/129 price points; 7/9 revenue periods; unchanged original prefix; native projection parity; complete SVG paths; marker/hover geometry; static public rendering; no runtime data refresh.');
