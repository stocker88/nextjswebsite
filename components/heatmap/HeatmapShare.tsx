import {useEffect,useRef,useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {HeatStock,Period,periodLabel,periodScale,dateLabel,heatColor,percent,tile,TileSizing,HeatGrouping,sizeLabels,stockWeight,stockGroups,fixedGroupTiles} from '../../lib/market-heatmap';
import styles from './Heatmap.module.css';
export default function HeatmapShare({rows,period,asOf,sector,sizing,grouping,universe,viewUrl,direction,colorblind,fixed,groupNames,sessionLabel}:{rows:HeatStock[];period:Period;asOf:string;sector:string;sizing:TileSizing;grouping:HeatGrouping;universe:HeatStock[];viewUrl:string;direction:string;colorblind:boolean;fixed:boolean;groupNames:string[];sessionLabel?:string}){
 const qr=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[image,setImage]=useState<{url:string;file:File}|null>(null);
 useEffect(()=>{if(image)dialog.current?.showModal();return()=>{if(image)URL.revokeObjectURL(image.url)}},[image]);
 async function prepare(){
  setBusy(true);setError('');
  try{
   const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=1800;
   const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');
   const background=ctx.createLinearGradient(0,0,1600,1800);background.addColorStop(0,'#111c32');background.addColorStop(1,'#080f20');ctx.fillStyle=background;ctx.fillRect(0,0,1600,1800);
   const text=(value:string,x:number,y:number,size:number,color='#f1f5ff',bold=false,maxWidth=1600)=>{ctx.font=`${bold?700:400} ${size}px Arial, sans-serif`;ctx.fillStyle=color;ctx.fillText(value,x,y,maxWidth)};
   text('THE MARKET AT A GLANCE',64,74,22,'#b8a6ef',true);
   text('Stock market heatmap',64,148,64,'#f1f5ff',true);
   text(`${dateLabel(asOf)}  ·  ${sessionLabel||periodLabel(period)}  ·  ${sessionLabel?"Saved session quotes":"Closing prices"}`,64,200,26,'#a8b9d4');
   text(`${sector==='all'?'S&P 500 largest holdings':sector}  ·  ${rows.length} stocks${direction==='up'?' · Advancing':direction==='down'?' · Declining':direction==='missing'?' · Unavailable prices':''}`,64,245,25,'#cbd6e8');
   const groups=stockGroups(rows,grouping);
   const weight=(r:HeatStock)=>stockWeight(r,sizing,universe);
   const layout=fixed?fixedGroupTiles(groups,groupNames,1472,1190):tile(groups,g=>g.rows.reduce((sum,r)=>sum+weight(r),0),1472,1190);
   for(const group of layout){
    const gx=64+group.x,gy=292+group.y,gw=group.width-5,gh=group.height-5,header=Math.min(39,Math.max(0,gh*.22));
    ctx.save();ctx.beginPath();ctx.rect(gx,gy,gw,gh);ctx.clip();ctx.fillStyle='#20304a';ctx.fillRect(gx,gy,gw,gh);
    if(header>12)text(group.item.name,gx+8,gy+header*.72,Math.min(22,gw/10,header*.65),'#dce5f5',true,Math.max(1,gw-16));
    for(const cell of tile(group.item.rows,weight,gw,Math.max(0,gh-header))){
     const x=gx+cell.x,y=gy+header+cell.y,w=cell.width,h=cell.height,r=cell.item;
     ctx.fillStyle=heatColor(r.changes[period],periodScale[period],colorblind);ctx.fillRect(x+1,y+1,w-2,h-2);
     if(w<38||h<35)continue;
     ctx.save();ctx.beginPath();ctx.rect(x+3,y+3,w-6,h-6);ctx.clip();ctx.textAlign='center';
     const size=Math.max(12,Math.min(58,w/(r.symbol.length*.68+1),h/3.4));
     text(r.symbol,x+w/2,y+h/2-size*.05,size,'#fff',true,w-8);
     text(r.changes[period]===null?'—':percent(r.changes[period]),x+w/2,y+h/2+size*.92,size*.7,'#fff',false,w-8);ctx.restore();
    }
    ctx.restore();
   }
   text(`Tile size: ${sizeLabels[sizing].toLowerCase()}${fixed?' within fixed groups':''}  ·  Gray: unavailable or older prices`,64,1524,21,'#9eafc9',false,910);
   if(!['day','week','month'].includes(period))text('Weekly / monthly history · lookback dates are approximate.',64,1557,20,'#9eafc9');
   const values=[-1,-.5,0,.5,1].map(v=>v*periodScale[period]);values.forEach((v,i)=>{ctx.fillStyle=heatColor(v,periodScale[period],colorblind);ctx.fillRect(1020+i*94,1502,90,20);text(`${v>0?'+':''}${v}%`,1020+i*94,1550,19,'#aabbd3')});
   ctx.strokeStyle='#34435e';ctx.beginPath();ctx.moveTo(64,1590);ctx.lineTo(1536,1590);ctx.stroke();
   text('www.StocksToBuyNow.ai',64,1707,44,'#e3d8ff',true);
   const svg=qr.current?.querySelector('svg');if(!svg)throw Error('QR unavailable');
   const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
   try{const code=new Image();await new Promise<void>((resolve,reject)=>{code.onload=()=>resolve();code.onerror=reject;code.src=url});ctx.drawImage(code,1376,1620,160,160)}finally{URL.revokeObjectURL(url)}
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Export failed')),'image/png'));
   setImage({url:URL.createObjectURL(blob),file:new File([blob],`stock-market-heatmap-${asOf}-${period}.png`,{type:'image/png'})});
  }catch{setError('The image could not be created. Please try again.')}finally{setBusy(false)}
 }
 async function share(){if(!image)return;try{if(navigator.canShare?.({files:[image.file]}))await navigator.share({files:[image.file],title:'Stock market heatmap'});else download()}catch(e){if((e as Error).name!=='AbortError')setError('Sharing is unavailable here. Use Download PNG.')}}
 function download(){if(!image)return;const a=document.createElement('a');a.href=image.url;a.download=image.file.name;a.click()}
 return <><button onClick={prepare} disabled={busy||!rows.length}>{busy?'Creating image…':'↗ Share'}</button><div hidden ref={qr}><QRCodeSVG value={viewUrl} size={320} level="M" includeMargin/></div>
 {error&&!image&&<span role="alert">{error}</span>}
 <dialog className={styles.shareDialog} ref={dialog} onCancel={()=>setImage(null)}><div className={styles.shareHeader}><h2>Share heatmap</h2><button aria-label="Close image preview" onClick={()=>{dialog.current?.close();setImage(null)}}>×</button></div>{image&&<img src={image.url} alt="Navy stock market heatmap with website source and QR code"/>}<div className={styles.shareActions}><button onClick={share}>Share image</button><button onClick={download}>Download PNG</button></div>{error&&<p role="alert">{error}</p>}</dialog></>;
}
