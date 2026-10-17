const fs=require('fs'),assert=require('node:assert/strict'),ts=require('typescript');
const m={exports:{}};
new Function('module','exports',ts.transpileModule(fs.readFileSync('lib/signal-chart.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports);
const values=m.exports.signalChartValues;
assert.deepEqual(values([{y1:12},{y1:'N/A'},{y1:NaN},{y1:null},{y1:''},{y1:' '},null,{y1:Infinity},{y1:0},{y1:-4},{y1:'18.5'},{y1:true}]),[12,0,-4,18.5]);
assert.deepEqual(values([{y1:'NA'},{y1:'NaN'}]),[]);
console.log('Missing values skipped; zero, negative and valid numeric values retained.');

const {signalChartObservations:observations,signalChartDate:date}=m.exports;
assert.deepEqual(observations([{x:1700000000,y1:10},{x:1700100000,y1:'N/A'},{x:1700200000,y1:11}],1700150000),[{value:10,x:1700000000}]);
assert.equal(date(1700000000),'Nov 14, 2023');
assert.equal(date(20),null);
assert.equal(date(NaN),null);
assert.equal(date('1700000000'),null);
console.log('Signal cutoff, missing values and saved price dates verified.');

const project=m.exports.signalChartProjection;
const history=[{x:1700000000,value:10},{x:1700100000,value:20},{x:1700200000,value:18}];
const projected=project(history);
assert.equal(projected.length,41);
assert.deepEqual(projected[0],history[2]);
assert.ok(projected[1].value>projected[0].value);
assert.ok(projected.some((p,i)=>i>0&&p.value<projected[i-1].value));
assert.ok(projected.every((p,i)=>Number.isFinite(p.value)&&(i===0||p.x>projected[i-1].x)));
assert.equal(projected[40].x,1700260000);
assert.ok(Math.abs(projected[40].value-24)<1e-9);
assert.deepEqual(project(history),projected);
assert.deepEqual(project([{value:1},{value:2}]),[]);
assert.deepEqual(project([{x:1700000000,value:2},{x:1700100000,value:1}]),[]);
assert.deepEqual(project(history.slice().reverse()),[]);
console.log('Illustrative slope, elapsed-time scale, upward start and small fluctuations verified.');

const declining=project([{x:1700000000,value:9},{x:1700100000,value:5},{x:1700200000,value:2}],'down');
assert.equal(declining.length,41);
assert.ok(declining.every((p,i)=>p.value>0&&(i===0||p.value<declining[i-1].value)));
assert.ok(declining[40].value>=1.2);
assert.equal(declining[40].x,projected[40].x);
const negative=project([{x:1700000000,value:-3},{x:1700100000,value:-2},{x:1700200000,value:-1}]);
assert.equal(negative.length,41);
assert.ok(negative[40].value>negative[0].value);
console.log('Financial projections support negative metrics; short interest declines gradually above zero.');


// A one-day EPS correction used to extrapolate across years and flatten history.
const day=86400,start=1700000000;
const eps=[.02,.03,.05,.08,-.2,.12,.11,.13,.14].map((value,i)=>({x:start+i*90*day,value}));
eps.splice(5,0,{x:eps[4].x+day,value:.5});
const soft=project(eps,'up','financial'),old=project(eps);
assert.ok(old.at(-1).value>10,'regression fixture reproduces the extreme old slope');
assert.equal(soft.length,41);
assert.deepEqual(soft[0],eps.at(-1));
const span=Math.max(0,...eps.map(p=>p.value))-Math.min(0,...eps.map(p=>p.value));
assert.ok(soft.every(p=>p.value>=eps.at(-1).value&&p.value<=eps.at(-1).value+span*.25+1e-10));
const expanded=Math.max(0,...eps.map(p=>p.value),...soft.map(p=>p.value))-Math.min(0,...eps.map(p=>p.value),...soft.map(p=>p.value));
assert.ok(span/expanded>=.8-1e-10,'historical bars retain at least 80% of their original scale');
assert.equal(soft.at(-1).x,old.at(-1).x,'projection boundary and horizon stay aligned');
const steady=[1,2,3,4].map((value,i)=>({x:start+i*90*day,value}));
assert.ok(project(steady,'up','financial').at(-1).value>4);
const flat=steady.map(p=>({...p,value:4}));
assert.ok(project(flat,'up','financial').every(p=>p.value===4),'flat histories do not acquire invented growth');
const shrinking=project(steady.map(p=>({...p,value:5-p.value})),'down','financial');
assert.ok(shrinking.every((p,i)=>p.value>=.6&&(i===0||p.value<=shrinking[i-1].value)));
const losses=project(steady.map(p=>({...p,value:p.value-5})),'up','financial');
assert.ok(losses.every(p=>p.value>=-1&&p.value<=0));
console.log('Financial trend damping, EPS jump regression, scale cap, flat history and short-interest limits verified.');
