const fs=require('fs'),ts=require(process.cwd()+'/node_modules/typescript'),assert=require('node:assert/strict');
require.extensions['.ts']=(m,f)=>m._compile(ts.transpileModule(fs.readFileSync(f,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,f);
const {marketToday,defaultCalendarWeek}=require(process.cwd()+'/lib/calendar-period.ts');
for(const d of [12,13,14,15])assert.equal(defaultCalendarWeek('2026-10-'+d),'2026-10-12');
for(const d of [16,17,18])assert.equal(defaultCalendarWeek('2026-10-'+d),'2026-10-19');
assert.equal(defaultCalendarWeek('2026-10-19'),'2026-10-19');
assert.equal(defaultCalendarWeek('2026-10-30'),'2026-11-02');
assert.equal(defaultCalendarWeek('2027-01-01'),'2027-01-04');
assert.equal(defaultCalendarWeek('2026-10-17','this-week'),'2026-10-12');
assert.equal(defaultCalendarWeek('2026-10-17','next-week'),'2026-10-19');
for(const [instant,date,week] of [['2026-10-16T03:59:59Z','2026-10-15','2026-10-12'],['2026-10-16T04:00:00Z','2026-10-16','2026-10-19'],['2026-11-06T04:59:59Z','2026-11-05','2026-11-02'],['2026-11-06T05:00:00Z','2026-11-06','2026-11-09']]){assert.equal(marketToday(new Date(instant)),date);assert.equal(defaultCalendarWeek(marketToday(new Date(instant))),week)}
console.log('Weekday, weekend, New York midnight/DST, month/year boundary and explicit week checks passed.');
