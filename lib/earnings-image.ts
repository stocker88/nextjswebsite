import {Event,day,shortDate} from './earnings';
export const snapshotShareUrl='https://www.stockstobuynow.ai/earnings-calendar/';
function loadImage(src:string):Promise<HTMLImageElement|null>{return new Promise(resolve=>{const img=new Image();const timer=setTimeout(()=>{img.src='';resolve(null)},6000);img.onload=()=>{clearTimeout(timer);resolve(img)};img.onerror=()=>{clearTimeout(timer);resolve(null)};img.src=src;});}
export async function createEarningsImage(events:Event[],dates:string[],week:string,qr:SVGSVGElement,end:string=day(week,6),showBeat=false,showRevenue=false):Promise<Blob>{
 const canvas=document.createElement('canvas');canvas.width=1200;canvas.height=1200;
 const c=canvas.getContext('2d');if(!c)throw new Error('Image export is unavailable in this browser.');
 const badge=(item:Event)=>[showBeat?((showRevenue?'E ':'')+(item.research?.beat.total?Math.round(item.research.beat.rate!)+'%':'—')):'',showRevenue?'R '+(item.research?.revenueBeat?.total?Math.round(item.research.revenueBeat.rate!)+'%':'—'):''].filter(Boolean);
 const isRange=Date.parse(end)-Date.parse(week)>6*86400000;
 const imageDates=isRange?dates.slice(0,42):dates;
 const weekdays=dates.filter(d=>{const n=new Date(d+'T12:00:00Z').getUTCDay();return n>0&&n<6});
 const columns=weekdays.length?weekdays:dates.slice(0,5);
 const weekend=events.filter(e=>!columns.includes(e.date));
 const sessions=['bmo','amc','unknown'];
 const groups=(date:string,session:string)=>events.filter(e=>e.date===date&&e.session===session);
 const shown=isRange?imageDates.flatMap(date=>events.filter(e=>e.date===date).slice(0,3)):columns.flatMap(date=>sessions.flatMap(session=>groups(date,session).slice(0,9)));
 const symbols=Array.from(new Set([...shown,...weekend.slice(0,8)].map(e=>e.symbol)));
 const assets=await Promise.all(symbols.map(async symbol=>[symbol,await loadImage('/assets/logo/'+encodeURIComponent(symbol)+'.webp')] as const));
 const logos=new Map(assets);const icon=await loadImage('/assets/images/stockerRobotIcon.png');
 const modules=Number(qr.getAttribute('viewBox')?.split(' ')[2])||41;
 const qrSize=modules*Math.max(1,Math.floor(172/modules));
 const qrCopy=qr.cloneNode(true) as SVGSVGElement;qrCopy.setAttribute('width',String(qrSize));qrCopy.setAttribute('height',String(qrSize));
 const qrImage=await loadImage('data:image/svg+xml;charset=utf-8,'+encodeURIComponent(new XMLSerializer().serializeToString(qrCopy)));
 if(!qrImage)throw new Error('Could not generate the QR code. Please try again.');
 const box=(x:number,y:number,w:number,h:number,fill:string,stroke?:string)=>{c.fillStyle=fill;c.beginPath();const radius=12;c.moveTo(x+radius,y);c.arcTo(x+w,y,x+w,y+h,radius);c.arcTo(x+w,y+h,x,y+h,radius);c.arcTo(x,y+h,x,y,radius);c.arcTo(x,y,x+w,y,radius);c.closePath();c.fill();if(stroke){c.strokeStyle=stroke;c.lineWidth=1;c.stroke();}};
 const text=(value:string,x:number,y:number,size:number,color='#ecf1ff',weight=400,align:CanvasTextAlign='left')=>{c.font=`${weight} ${size}px Arial, sans-serif`;c.fillStyle=color;c.textAlign=align;c.textBaseline='top';c.fillText(value,x,y);};
 const logo=(symbol:string,x:number,y:number,size:number)=>{c.save();c.beginPath();c.arc(x+size/2,y+size/2,size/2,0,2*Math.PI);c.clip();c.fillStyle='#f7f8fc';c.fillRect(x,y,size,size);const img=logos.get(symbol);if(img){const scale=Math.min(size/img.width,size/img.height);const w=img.width*scale,h=img.height*scale;c.drawImage(img,x+(size-w)/2,y+(size-h)/2,w,h);}else text(symbol.slice(0,3),x+size/2,y+size/2-7,12,'#17233c',700,'center');c.restore();};
 c.fillStyle='#080f20';c.fillRect(0,0,1200,1200);
 text(isRange?'YOUR EARNINGS CALENDAR':'YOUR WEEKLY EARNINGS SNAPSHOT',36,30,39,'#edf1ff',700);
 text(`${shortDate(week)} – ${shortDate(isRange?imageDates[imageDates.length-1]:end)}, ${week.slice(0,4)} · US-listed companies`,36,85,22,'#b5c5df');
 box(36,125,1128,42,'#19253a');text('LARGEST COMPANIES FIRST  ·  EXPECTED RELEASE TIMES  ·  US EASTERN',52,137,17,'#b18bff',700);
 const width=(1128-(columns.length-1)*12)/Math.max(1,columns.length);
 let included=0;
 if(isRange){
  const offset=(new Date(week+'T12:00:00Z').getUTCDay()+6)%7;
  const rowCount=Math.ceil((offset+imageDates.length)/7),cw=1128/7,rh=750/rowCount;
  ['MON','TUE','WED','THU','FRI','SAT','SUN'].forEach((d,i)=>text(d,36+i*cw+cw/2,182,14,'#a7b9d5',700,'center'));
  imageDates.forEach((date,n)=>{const index=offset+n,x=36+(index%7)*cw,y=210+Math.floor(index/7)*rh;const all=events.filter(e=>e.date===date),items=all.slice(0,3);included+=items.length;
   box(x,y,cw-6,rh-6,'#0f1a2d','#30405d');text(shortDate(date),x+8,y+7,15,'#dfeaff',700);text(String(all.length),x+cw-15,y+9,11,'#91a7c5',400,'right');
   const step=Math.min(30,(rh-48)/3);
   items.forEach((item,i)=>{const ty=y+31+i*step;logo(item.symbol,x+8,ty,18);text(item.symbol,x+31,ty+3,11,'#ecf1ff',700);badge(item).forEach((b,j)=>text(b,x+cw-13,ty+j*11,9,'#85dbc1',600,'right'))});
   if(all.length>3)text('+'+(all.length-3)+' more',x+8,y+rh-23,10,'#92a8c7');
  });
 }else{
 columns.forEach((date,n)=>{
  const x=36+n*(width+12);box(x,189,width,704,'#0f1a2d','#30405d');
  text(new Date(date+'T12:00:00Z').toLocaleDateString('en-US',{weekday:'short',timeZone:'UTC'}).toUpperCase(),x+14,206,21,n%2?'#b38aff':'#76b4ff',700);
  text(shortDate(date),x+14,236,24,'#edf1ff',700);
  let y=279;
  sessions.forEach(session=>{const all=groups(date,session),items=all.slice(0,9);if(!all.length)return;included+=items.length;
   const active=sessions.filter(s=>groups(date,s).length).length;const rowHeight=Math.min(showRevenue?90:showBeat?78:68,Math.floor((600/active-60)/Math.ceil(items.length/3)));const height=35+Math.ceil(items.length/3)*rowHeight+(all.length>9?22:0);
   const fill=session==='bmo'?'#2b271f':session==='amc'?'#172b3c':'#202236';const accent=session==='bmo'?'#e9bd79':session==='amc'?'#91c9f3':'#beb5e2';
   box(x+8,y,width-16,height,fill);
   text(session==='bmo'?'Before open':session==='amc'?'After close':'Time unconfirmed',x+15,y+10,12,accent,700);
   text(String(all.length),x+width-15,y+10,12,accent,400,'right');
   const tile=(width-24)/3;
   items.forEach((item,i)=>{const cx=x+12+(i%3)*tile+tile/2,ty=y+33+Math.floor(i/3)*rowHeight;const size=Math.min(44,Math.max(12,rowHeight-(showRevenue?43:showBeat?30:17)));logo(item.symbol,cx-size/2,ty,size);text(item.symbol,cx,ty+size+3,11,'#edf1ff',700,'center');badge(item).forEach((b,j)=>text(b,cx,ty+size+17+j*11,10,'#85dbc1',600,'center'));});
   if(all.length>9)text(`+ ${all.length-9} more in calendar`,x+width/2,y+height-20,11,'#b8c8de',400,'center');
   y+=height+10;
  });
  if(!events.some(e=>e.date===date))text('No reports',x+width/2,307,15,'#8da2c0',400,'center');
 });
 if(weekend.length){box(36,906,1128,55,'#172136');text('WEEKEND',50,923,14,'#b59bdd',700);weekend.slice(0,8).forEach((item,i)=>{const x=170+i*110;logo(item.symbol,x,916,30);text(item.symbol,x+37,925,12,'#e8effb',700)});if(weekend.length>8)text(`+${weekend.length-8}`,1128,925,12,'#b5c5df',400,'right');included+=Math.min(8,weekend.length);}
 else text('Dates and release windows may change. Check the full calendar before trading.',36,922,16,'#98adca');
 }
 c.strokeStyle='#30405d';c.beginPath();c.moveTo(36,979);c.lineTo(1164,979);c.stroke();
 if(icon)c.drawImage(icon,36,1002,58,58);
 text('www.StocksToBuyNow.ai',108,1008,29,'#eef2ff',700);
 text(`${included} of ${events.length} matching reports shown · Full details online`,108,1048,16,'#b2c2db');
 text('Data: Financial Modeling Prep · Release windows: Nasdaq',36,1100,16,'#b2c2db');
 text(showBeat||showRevenue?'E: EPS · R: Revenue beat % · Up to 8 reports · — unavailable.':'Selected largest reporters per session. Dates may change.',36,1126,15,'#92a6c5');
 text('No affiliation or endorsement by data providers.',36,1150,14,'#8296b5');
 c.imageSmoothingEnabled=false;c.drawImage(qrImage,1164-qrSize,996,qrSize,qrSize);c.imageSmoothingEnabled=true;
 text('Scan for full calendar',1164-qrSize/2,1170,13,'#b5c5df',400,'center');
 return new Promise((resolve,reject)=>canvas.toBlob(blob=>blob?resolve(blob):reject(new Error('Could not create the image.')),'image/png'));
}
