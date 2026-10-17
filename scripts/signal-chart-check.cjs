const fs=require('fs'),assert=require('node:assert/strict'),ts=require('typescript');
const m={exports:{}};
new Function('module','exports',ts.transpileModule(fs.readFileSync('lib/signal-chart.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText)(m,m.exports);
const values=m.exports.signalChartValues;
assert.deepEqual(values([{y1:12},{y1:'N/A'},{y1:NaN},{y1:null},{y1:''},{y1:' '},null,{y1:Infinity},{y1:0},{y1:-4},{y1:'18.5'},{y1:true}]),[12,0,-4,18.5]);
assert.deepEqual(values([{y1:'NA'},{y1:'NaN'}]),[]);
console.log('Missing values skipped; zero, negative and valid numeric values retained.');
