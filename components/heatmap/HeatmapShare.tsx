import {heroGroupGeometry,heroTileFont,heroTileValue} from '../../lib/hero-heatmap-layout';
import ShareAction from '../ShareAction';
import ShareControl from '../ShareControl';
import {useEffect,useRef,useState} from 'react';
import {QRCodeSVG} from 'qrcode.react';
import {HeatStock,Period,periodLabel,periodScale,dateLabel,heatColor,percent,tile,TileSizing,HeatGrouping,sizeLabels,stockWeight,stockGroups,fixedGroupTiles} from '../../lib/market-heatmap';
import styles from './Heatmap.module.css';
export default function HeatmapShare({rows,period,asOf,sector,sizing,grouping,universe,viewUrl,direction,colorblind,fixed,groupNames,sessionLabel,renderSize=640}:{rows:HeatStock[];period:Period;asOf:string;sector:string;sizing:TileSizing;grouping:HeatGrouping;universe:HeatStock[];viewUrl:string;direction:string;colorblind:boolean;fixed:boolean;groupNames:string[];sessionLabel?:string;renderSize?:number}){
 const qr=useRef<HTMLDivElement>(null),dialog=useRef<HTMLDialogElement>(null);
 const [busy,setBusy]=useState(false),[error,setError]=useState(''),[image,setImage]=useState<{url:string;file:File}|null>(null);
 useEffect(()=>{if(image)dialog.current?.showModal();return()=>{if(image)URL.revokeObjectURL(image.url)}},[image]);
 async function prepare(){
  setBusy(true);setError('');
  try{
   const canvas=document.createElement('canvas');canvas.width=1600;canvas.height=2082;
   const ctx=canvas.getContext('2d');if(!ctx)throw Error('Canvas unavailable');
   const background=ctx.createLinearGradient(0,0,1600,2082);background.addColorStop(0,'#111c32');background.addColorStop(1,'#080f20');ctx.fillStyle=background;ctx.fillRect(0,0,1600,2082);
   const text=(value:string,x:number,y:number,size:number,color='#f1f5ff',bold=false,maxWidth=1600)=>{ctx.font=`${bold?700:400} ${size}px Arial, sans-serif`;ctx.fillStyle=color;ctx.fillText(value,x,y,maxWidth)};
   text('THE MARKET AT A GLANCE',64,74,22,'#b8a6ef',true);
   text('Stock market heatmap',64,148,64,'#f1f5ff',true);
   text(`${dateLabel(asOf)}  ·  ${sessionLabel||periodLabel(period)}  ·  ${sessionLabel?"Saved session quotes":"Closing prices"}`,64,200,26,'#a8b9d4');
   text(`${sector==='all'?'S&P 500 largest holdings':sector}  ·  ${rows.length} stocks${direction==='up'?' · Advancing':direction==='down'?' · Declining':direction==='missing'?' · Unavailable prices':''}`,64,245,25,'#cbd6e8');
   await document.fonts.ready;
   const family=getComputedStyle(document.body).fontFamily||'Arial, sans-serif';
   const logicalSize=Math.max(240,renderSize),mapScale=1472/logicalSize;
   const groups=stockGroups(rows,grouping),weight=(r:HeatStock)=>stockWeight(r,sizing,universe);
   const layout=fixed?fixedGroupTiles(groups,groupNames,logicalSize,logicalSize):tile(groups,g=>g.rows.reduce((sum,r)=>sum+weight(r),0),logicalSize,logicalSize);
   canvas.dataset.mapSize=String(logicalSize);
   canvas.dataset.mapGroups=String(layout.length);
   canvas.dataset.mapLayout='hero';
   canvas.dataset.mapGrouping=grouping;
   ctx.save();ctx.translate(64,292);ctx.scale(mapScale,mapScale);
   ctx.beginPath();ctx.roundRect(0,0,logicalSize,logicalSize,6);ctx.clip();
   ctx.fillStyle='#101c2e';ctx.fillRect(0,0,logicalSize,logicalSize);
   for(const group of layout){
    const {header,gap,width:w,height:h,cells}=heroGroupGeometry(group,logicalSize,weight);
    ctx.save();ctx.beginPath();ctx.rect(group.x,group.y,group.width,group.height);ctx.clip();
    ctx.fillStyle='#101c2e';ctx.fillRect(group.x,group.y,group.width,group.height);
    ctx.strokeStyle='#28374d';ctx.lineWidth=logicalSize<450?.5:1;ctx.strokeRect(group.x+.5,group.y+.5,group.width-1,group.height-1);
    if(header){
     const font=logicalSize<450?6.5:9;
     ctx.font=`400 ${font}px ${family}`;ctx.fillStyle='#c4d2e6';ctx.textBaseline='top';ctx.textAlign='left';
     const available=Math.max(0,group.width-7);let heading=group.item.name;
     if(ctx.measureText(heading).width>available){while(heading&&ctx.measureText(heading+'…').width>available)heading=heading.slice(0,-1);heading+='…';}
     ctx.fillText(heading,group.x+4,group.y+1+font*.2);
    }
    // CSS group borders consume 2px; percentages fill the inner content box.
    const innerWidth=Math.max(0,group.width-2-gap*2),innerHeight=Math.max(0,group.height-2-header-gap*2);
    for(const cell of cells){
     const x=group.x+1+gap+cell.x/w*innerWidth,y=group.y+1+header+gap+cell.y/h*innerHeight;
     const cw=cell.width/w*innerWidth,ch=cell.height/h*innerHeight,r=cell.item;
     const value=r.asOf===asOf?r.changes[period]:null,font=heroTileFont(r.symbol,cell.width,cell.height,logicalSize);
     ctx.save();ctx.beginPath();ctx.rect(x,y,cw,ch);ctx.clip();
     ctx.fillStyle=heatColor(value,periodScale[period],colorblind);ctx.fillRect(x,y,cw,ch);
     ctx.strokeStyle='#101c2e';ctx.lineWidth=logicalSize<450?.35:.5;ctx.strokeRect(x+.25,y+.25,cw-.5,ch-.5);
     const line=font*1.15,sub=font*.85,top=y+(ch-line-sub*1.15)/2;
     ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#f2f6ff';ctx.font=`700 ${font}px ${family}`;ctx.fillText(r.symbol,x+cw/2,top+line/2);
     ctx.fillStyle='rgba(237,244,255,.9)';ctx.font=`400 ${sub}px ${family}`;ctx.fillText(heroTileValue(value,cell.width),x+cw/2,top+line+sub*1.15/2);
     ctx.restore();
    }
    ctx.restore();
   }
   ctx.restore();
   text(`Tile size: ${sizeLabels[sizing].toLowerCase()}${fixed?' within fixed groups':''}  ·  Gray: unavailable or older prices`,64,1806,21,'#9eafc9',false,910);
   if(!['day','week','month'].includes(period))text('Weekly / monthly history · lookback dates are approximate.',64,1839,20,'#9eafc9');
   const values=[-1,-.5,0,.5,1].map(v=>v*periodScale[period]);values.forEach((v,i)=>{ctx.fillStyle=heatColor(v,periodScale[period],colorblind);ctx.fillRect(1020+i*94,1784,90,20);text(`${v>0?'+':''}${v}%`,1020+i*94,1832,19,'#aabbd3')});
   ctx.strokeStyle='#34435e';ctx.beginPath();ctx.moveTo(64,1872);ctx.lineTo(1536,1872);ctx.stroke();
   text('www.StocksToBuyNow.ai',64,1989,44,'#e3d8ff',true);
   const svg=qr.current?.querySelector('svg');if(!svg)throw Error('QR unavailable');
   const url=URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(svg)],{type:'image/svg+xml'}));
   try{const code=new Image();await new Promise<void>((resolve,reject)=>{code.onload=()=>resolve();code.onerror=reject;code.src=url});ctx.drawImage(code,1376,1902,160,160)}finally{URL.revokeObjectURL(url)}
   const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(Error('Export failed')),'image/png'));
   setImage({url:URL.createObjectURL(blob),file:new File([blob],`stock-market-heatmap-${asOf}-${period}.png`,{type:'image/png'})});
  }catch{setError('The image could not be created. Please try again.')}finally{setBusy(false)}
 }
 async function share(){if(!image)return;try{if(navigator.canShare?.({files:[image.file]}))await navigator.share({files:[image.file],title:'Stock market heatmap'});else download()}catch(e){if((e as Error).name!=='AbortError')setError('Sharing is unavailable here. Use Download PNG.')}}
 function download(){if(!image)return;const a=document.createElement('a');a.href=image.url;a.download=image.file.name;a.click()}
 return <><ShareControl title="Stock market heatmap" path={viewUrl}/><ShareAction kind="save" onClick={prepare} disabled={busy||!rows.length}>{busy?'Creating image…':'Save Heatmap'}</ShareAction><div hidden ref={qr}><QRCodeSVG value={viewUrl} size={320} level="M" includeMargin/></div>
 {error&&!image&&<span role="alert">{error}</span>}
 <dialog className={styles.shareDialog} ref={dialog} onCancel={()=>setImage(null)}><div className={styles.shareHeader}><h2>Share heatmap</h2><button aria-label="Close image preview" onClick={()=>{dialog.current?.close();setImage(null)}}>×</button></div>{image&&<img src={image.url} alt="Navy stock market heatmap with website source and QR code"/>}<div className={styles.shareActions}><button onClick={share}>Share image</button><button onClick={download}>Download PNG</button></div>{error&&<p role="alert">{error}</p>}</dialog></>;
}
