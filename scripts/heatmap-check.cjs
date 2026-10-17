const fs=require('fs'),assert=require('node:assert/strict'),Module=require('module');
const root=require('path').resolve(__dirname,'..');
const ts=require(root+'/node_modules/typescript');const file=root+'/lib/market-heatmap.ts';
const m=new Module(file);m.paths=Module._nodeModulePaths(root);m._compile(ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020}}).outputText,file);
for(const [w,h]of [[1440,760],[365,260],[40,20]]){
 const rows=Array.from({length:250},(_,i)=>({value:250-i})),total=rows.reduce((s,r)=>s+r.value,0),tiles=m.exports.tile(rows,r=>r.value,w,h);
 assert.equal(tiles.length,rows.length);
 assert.ok(Math.abs(tiles.reduce((s,r)=>s+r.width*r.height,0)-w*h)<1e-6);
 for(const r of tiles){assert.ok(r.x>=0&&r.y>=0&&r.x+r.width<=w+1e-6&&r.y+r.height<=h+1e-6);assert.ok(Math.abs(r.width*r.height/(w*h)-r.item.value/total)<1e-8)}
 for(let i=0;i<tiles.length;i++)for(let j=i+1;j<tiles.length;j++){const a=tiles[i],b=tiles[j];const overlapX=Math.min(a.x+a.width,b.x+b.width)-Math.max(a.x,b.x),overlapY=Math.min(a.y+a.height,b.y+b.height)-Math.max(a.y,b.y);assert.ok(overlapX<1e-7||overlapY<1e-7)}
}
assert.notEqual(m.exports.heatColor(null),m.exports.heatColor(0));assert.equal(m.exports.validSnapshot({version:1,asOf:'2026-10-16',rows:[{}]}),false);
console.log('Treemap area, proportional sizing, no overlap, bounds and missing-data color checks passed.');

const company={symbol:'GOOG',weight:3,marketCap:200};
const sibling={...company,symbol:'GOOGL',weight:2};
assert.equal(m.exports.stockWeight(company,'weight',[company,sibling]),3);
assert.equal(m.exports.stockWeight(company,'marketCap',[company,sibling]),100);
assert.equal(m.exports.stockWeight(company,'marketCap',[company]),200);
assert.equal(m.exports.stockWeight(company,'equal',[company,sibling]),1);
const classified=[{...company,sector:'Technology',industry:'Software'},{...sibling,sector:'Technology',industry:'Semiconductors'}];
assert.equal(m.exports.stockGroups(classified,'sector').length,1);
assert.equal(m.exports.stockGroups(classified,'industry').length,2);
console.log('Tile sizing and industry grouping checks passed.');
const sample=[{symbol:'A',sector:'Tech',changes:{day:10}},{symbol:'B',sector:'Tech',changes:{day:null}},{symbol:'C',sector:'Tech',changes:{day:-2}},{symbol:'D',sector:'Other',changes:{day:0}}];
const ranked=m.exports.sectorRankings(sample,'day');
assert.equal(ranked[0].average,4);assert.equal(ranked[0].available,2);assert.equal(ranked[0].total,3);
assert.deepEqual(m.exports.biggestMovers(sample,'day').gainers.map(r=>r.symbol),['A']);
assert.deepEqual(m.exports.biggestMovers(sample,'day').losers.map(r=>r.symbol),['C']);
assert.equal(m.exports.heatColor(null,4,true),m.exports.heatColor(null,4,false));
assert.notEqual(m.exports.heatColor(4,4,true),m.exports.heatColor(4,4,false));
assert.deepEqual(m.exports.readWatchlist('["NVDA","NVDA",3,"bad!","BRK-B"]'),['NVDA','BRK-B']);
assert.deepEqual(m.exports.readWatchlist('{broken'),[]);
const slots=m.exports.fixedGroupTiles([{name:'Tech'},{name:'Other'}],['Other','Tech'],600,400);
const filtered=m.exports.fixedGroupTiles([{name:'Tech'}],['Other','Tech'],600,400);
assert.deepEqual(filtered[0],slots[0]);
console.log('Rankings, movers, palette, watchlist validation and fixed-position checks passed.');

assert.deepEqual(m.exports.fixedGroupTiles([{name:'Only'}],['Only'],600,400),[{item:{name:'Only'},x:0,y:0,width:600,height:400}]);
