import {Setup,MOVES} from './options-workspace';
import {expirationMetrics,expirationPnl,breakevenText,usd} from './options-strategies';
export async function exportSetupPng(s:Setup){
 const c=document.createElement('canvas');c.width=1200;c.height=1220+s.legs.length*34;
 const ctx=c.getContext('2d');if(!ctx)throw Error('Image export is unavailable in this browser.');
 const qr=await new Promise<HTMLImageElement>((resolve,reject)=>{const image=new Image();image.onload=()=>resolve(image);image.onerror=()=>reject(Error('Unable to load the QR code. Please retry.'));image.src='/assets/images/qrcode.webp'});
 ctx.fillStyle='#080e1c';ctx.fillRect(0,0,c.width,c.height);
 const text=(v:string,x:number,y:number,size=23,color='#dce6f6')=>{ctx.font=`${size>=30?'600':'400'} ${size}px Arial`;ctx.fillStyle=color;ctx.fillText(v,x,y,Math.max(40,c.width-x-32))};
 text('www.StocksToBuyNow.ai',56,65,30,'#86dec4');text((s.symbol?s.symbol+' · ':'')+s.name,56,123,38);
 text('Expiration: '+(s.expiry||'User-defined')+' · Reference: '+usd(s.reference),56,166);
 text('Data as of: '+(s.asOf||'Manual setup — no market quote'),56,201,18,'#9cacc2');
 text('User-entered premiums · Standard 100-share options · Expiration P/L',56,234,18,'#9cacc2');
 let y=281;
 s.legs.forEach(l=>{text(`${l.side.toUpperCase()} ${l.quantity} ${l.type==='stock'?'shares':l.type+' @ '+usd(l.strike)} · ${l.type==='stock'?'Share cost':'Premium/share'} ${usd(l.premium)}`,56,y,22);y+=34});
 const m=expirationMetrics(s.legs,s.fee);y+=30;
 text(`${m.cost<0?'Net credit':'Net debit'}: ${usd(Math.abs(m.cost))}`,56,y,24);text('Max profit: '+usd(m.maxProfit),620,y,24,'#86dec4');y+=40;
 text('Max loss: '+usd(m.maxLoss),56,y,24,'#ff9dad');text('Entry fee/contract: '+usd(s.fee),620,y,24);y+=40;
 // Break-even text can be long for multi-leg custom positions.
 const words=('Breakeven: '+breakevenText(m)).split(' ');let line='';
 for(const word of words){if(ctx.measureText(line+word).width>1060){text(line,56,y,20);y+=27;line=''}line+=word+' '}text(line,56,y,20);y+=60;
 text('Profit / loss at expiration',56,y,27);y+=28;
 const low=Math.max(0,Math.min(s.reference*.75,...s.legs.filter(l=>l.type!=='stock').map(l=>l.strike*.85))),high=Math.max(s.reference*1.25,...s.legs.map(l=>l.strike*1.15));
 const prices=Array.from(new Set([...Array.from({length:201},(_,i)=>low+(high-low)*i/200),...s.legs.filter(l=>l.type!=='stock').map(l=>l.strike).filter(k=>k>=low&&k<=high)])).sort((a,b)=>a-b);
 const vals=prices.map(p=>expirationPnl(s.legs,p,s.fee));const min=Math.min(0,...vals),max=Math.max(0,...vals),span=Math.max(1,max-min),left=155,right=1125,top=y+24,bottom=y+310;
 const px=(v:number)=>left+(v-low)/(high-low)*(right-left),py=(v:number)=>bottom-(v-min)/span*(bottom-top);
 [min,(min+max)/2,max].forEach(v=>{ctx.strokeStyle='#29364d';ctx.beginPath();ctx.moveTo(left,py(v));ctx.lineTo(right,py(v));ctx.stroke();text(usd(v),18,py(v)+7,17,'#9cacc2')});
 ctx.strokeStyle='#78899d';ctx.setLineDash([6,6]);ctx.beginPath();ctx.moveTo(left,py(0));ctx.lineTo(right,py(0));ctx.stroke();ctx.setLineDash([]);
 ctx.lineWidth=4;for(let i=1;i<prices.length;i++){ctx.strokeStyle=(vals[i]+vals[i-1])/2>=0?'#86dec4':'#ff9dad';ctx.beginPath();ctx.moveTo(px(prices[i-1]),py(vals[i-1]));ctx.lineTo(px(prices[i]),py(vals[i]));ctx.stroke()}
 [0,.25,.5,.75,1].forEach(t=>text(usd(low+(high-low)*t),px(low+(high-low)*t)-30,bottom+32,17,'#9cacc2'));y=bottom+88;
 text('Stock move',56,y,20);MOVES.forEach((move,i)=>text(`${move>0?'+':''}${move}%`,300+i*160,y,20));y+=36;
 text('Position P/L',56,y,20);MOVES.forEach((move,i)=>text(usd(expirationPnl(s.legs,s.reference*(1+move/100),s.fee)),300+i*160,y,18));
 const foot=c.height-200;ctx.fillStyle='#fff';ctx.fillRect(980,foot,170,170);ctx.drawImage(qr,988,foot+8,154,154);
 text('Scan to explore the app',56,foot+30,24,'#86dec4');text('Model assumptions, not a forecast or executable quote.',56,foot+70,19);
 text('Includes entry fees; excludes early assignment, exit fees,',56,foot+102,18,'#9cacc2');text('slippage, dividends, financing and taxes.',56,foot+130,18,'#9cacc2');
 const blob=await new Promise<Blob>((resolve,reject)=>c.toBlob(b=>b?resolve(b):reject(Error('Unable to generate image.')),'image/png'));
 const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`${s.symbol||'Options'}-${s.name.replace(/[^a-z0-9]+/gi,'-')}.png`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
}
