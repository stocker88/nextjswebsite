function project(docs,now=Date.now()){
 const assets={};
 for(const doc of docs){let data;try{data=typeof doc.data==='string'?JSON.parse(doc.data):doc.data;}catch{continue;}
  for(const [symbol,points] of Object.entries(data||{})){
   if(!/^[A-Z0-9.^=-]{1,25}$/.test(symbol)||!points||typeof points!=='object')continue;
   const byDay=new Map();
   for(const [stamp,value] of Object.entries(points)){const ms=Number(stamp)*1000;if(!Number.isFinite(ms)||ms<=0||ms>now||typeof value!=='number'||!Number.isFinite(value)||value<=0)continue;byDay.set(new Date(ms).toISOString().slice(0,10),value);}
   const rows=[...byDay].sort((a,b)=>a[0].localeCompare(b[0])).slice(-100);
   if(rows.length>=40)assets[symbol]=rows;
  }
 }
 return {version:1,source:'Existing app market-history cache',exportedAt:new Date(now).toISOString(),assets};
}
module.exports={project};
