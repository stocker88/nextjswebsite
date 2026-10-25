import {HeatStock,Tile,tile} from './market-heatmap';
// One set of geometry and type rules for the on-screen hero and PNG export.
export function heroGroupGeometry(group:Tile<{name:string;rows:HeatStock[]}>,size:number,weight:(row:HeatStock)=>number){
 const header=group.height>26&&group.width>25?(size<450?9:13):0;
 const gap=size<450?1:2;
 const width=Math.max(1,group.width-gap*2),height=Math.max(1,group.height-header-gap*2);
 return {header,gap,width,height,cells:tile(group.item.rows,weight,width,height)};
}
export function heroTileFont(symbol:string,width:number,height:number,size:number){
 return Math.max(2,Math.min(size<450?11:19,(width-2)/(Math.max(symbol.length,6)*.7),(height-2)/2.7));
}
export function heroTileValue(value:number|null,width:number){return value===null?'—':`${value>0?'+':''}${value.toFixed(width<34?1:2)}%`;}
