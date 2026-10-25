const assert=require('node:assert/strict'),fs=require('node:fs'),ts=require('typescript'),vm=require('node:vm');
const mod={exports:{}};
vm.runInNewContext(ts.transpileModule(fs.readFileSync('lib/hedging-events.ts','utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS}}).outputText,{module:mod,exports:mod.exports,require:()=>({marketToday:()=> '2026-10-22'})});
const {hedgingAhead}=mod.exports;
for(const title of ['FOMC rate decision','Fed chair press conference','Initial jobless claims','CPI inflation','Producer Price Index','PCE inflation & consumer spending','Jobs report · payrolls & unemployment','Q3 GDP · advance estimate'])assert(hedgingAhead({title,date:'2026-10-22',category:'macro'}),title);
for(const event of [{title:'New home sales',date:'2026-10-23'},{title:'CPI earnings',date:'2026-10-23',category:'earnings'},{title:'FOMC rate decision',date:'2026-10-21'},{title:'CPI inflation',date:'2026-10-23',status:'Cancelled'}])assert(!hedgingAhead(event),JSON.stringify(event));
console.log('Hedging flags: major releases, category guard, past events and cancelled events passed.');
