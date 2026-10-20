// One canonical PNG for website downloads and native app sharing. No upstream requests.
const fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto');
const React=require('react'),{renderToStaticMarkup}=require('react-dom/server');
const {QRCodeSVG}=require('qrcode.react'),{Resvg}=require('@resvg/resvg-js');
const names=['Market momentum','Stock price strength','Market breadth','Put and call options','Market volatility','Safe-haven demand','Junk-bond demand'];
const keys=['market_momentum_sp500','stock_price_strength','stock_price_breadth','put_call_options','market_volatility_vix','safe_haven_demand','junk_bond_demand'];
const valid=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<=100;
const rating=n=>!valid(n)?'Unavailable':n<25?'Extreme fear':n<45?'Fear':n<=55?'Neutral':n<=75?'Greed':'Extreme greed';
const color=n=>!valid(n)?'#899bb4':n<25?'#f17886':n<45?'#efa46b':n<=55?'#e7cc7b':n<=75?'#8bd8bf':'#42c99a';
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[c]));
const WIDTH=1600,HEIGHT=2200,LAYOUT_VERSION=2;
function historySeries(s){
 const end=Date.parse(s.timestamp),startDate=new Date(end);
 startDate.setUTCFullYear(startDate.getUTCFullYear()-1);
 const start=startDate.getTime();
 const points=(s.history||[]).filter(p=>valid(p.value)&&Number.isFinite(Date.parse(p.date))&&Date.parse(p.date)>=start&&Date.parse(p.date)<=end).sort((a,b)=>a.date.localeCompare(b.date));
 return {start,end,points};
}
function poster(s){
 if(!valid(s?.score)||!Number.isFinite(Date.parse(s.timestamp)))throw Error('No valid sentiment snapshot to share');
 const date=new Date(s.timestamp).toLocaleDateString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric'});
 const text=(v,x,y,size=26,c='#f1f5ff',weight=400,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${c}" font-weight="${weight}" text-anchor="${anchor}">${esc(v)}</text>`;
 const card=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="#111d30" stroke="#2a394f"/>`;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#111c32"/><stop offset="1" stop-color="#080f20"/></linearGradient><linearGradient id="mood"><stop stop-color="#f17886"/><stop offset=".3" stop-color="#efa46b"/><stop offset=".5" stop-color="#e7cc7b"/><stop offset=".75" stop-color="#8bd8bf"/><stop offset="1" stop-color="#42c99a"/></linearGradient></defs><rect width="${WIDTH}" height="${HEIGHT}" fill="url(#bg)"/><g font-family="Roboto">`;
 svg+=text('THE MOOD OF THE MARKET',64,74,22,'#b8a6ef',700)+text('Fear & Greed Index',64,148,64,'#f1f5ff',700)+text(`${date}  ·  Market sentiment snapshot`,64,205,26,'#a8b9d4');
 svg+='<g id="sentiment-gauge">'+card(64,250,1472,790)+text('WHERE SENTIMENT STANDS',100,302,22,'#b8a6ef',700);
 svg+='<path d="M200 940 A600 600 0 0 1 1400 940" stroke="url(#mood)" stroke-width="48" stroke-linecap="round" fill="none"/>';
 const a=Math.PI*(1-s.score/100);
 svg+=`<circle cx="${800+600*Math.cos(a)}" cy="${940-600*Math.sin(a)}" r="23" fill="#fff" stroke="#111b2b" stroke-width="6"/>`;
 svg+=text(Math.round(s.score),800,814,160,color(s.score),700,'middle')+text(rating(s.score),800,885,46,color(s.score),700,'middle')+text('0 · Fear',176,998,26,'#a8b9d4')+text('Greed · 100',1424,998,26,'#a8b9d4',400,'end')+'</g>';
 svg+='<g id="history-chart">'+card(64,1072,904,440)+text('HOW THE MOOD HAS CHANGED · 1 YEAR',100,1122,22,'#b8a6ef',700);
 const {start,end,points}=historySeries(s),ceiling=points.reduce((max,p)=>Math.max(max,p.value),50);
 const left=138,right=926,top=1170,bottom=1430,height=bottom-top;
 // Use the actual one-year time window; never stretch shorter coverage to a year.
 svg+=`<defs><linearGradient id="history-mood" gradientUnits="userSpaceOnUse" x1="0" x2="0" y1="${bottom}" y2="${bottom-height*100/ceiling}"><stop offset="0" stop-color="#f17886"/><stop offset=".3" stop-color="#efa46b"/><stop offset=".5" stop-color="#e7cc7b"/><stop offset=".75" stop-color="#8bd8bf"/><stop offset="1" stop-color="#42c99a"/></linearGradient></defs>`;
 Array.from({length:5},(_,i)=>ceiling*i/4).forEach(n=>{const y=bottom-n/ceiling*height;svg+=`<line x1="${left}" x2="${right}" y1="${y}" y2="${y}" stroke="#29344a"/>`+text(Number(n.toFixed(1)),left-18,y+6,19,'#9eafc9',400,'end');});
 if(points.length>1){
  svg+=`<path d="${points.map((p,i)=>`${i?'L':'M'}${left+(Date.parse(p.date)-start)/(end-start)*(right-left)},${bottom-p.value/ceiling*height}`).join(' ')}" fill="none" stroke="url(#history-mood)" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>`;
 }else svg+=text('Historical readings unavailable',(left+right)/2,1300,26,'#a8b9d4',400,'middle');
 for(let i=0;i<5;i++){
  const stamp=start+(end-start)*i/4,label=new Date(stamp).toLocaleDateString('en-US',{timeZone:'UTC',month:'short',year:'2-digit'});
  svg+=text(label,left+(right-left)*i/4,1470,20,'#a8b9d4',400,i===0?'start':i===4?'end':'middle');
 }
 svg+='</g><g id="historical-comparisons">';
 [['Previous close',s.previousClose],['One week ago',s.weekAgo],['One month ago',s.monthAgo],['One year ago',s.yearAgo]].forEach(([label,n],i)=>{const x=996+(i%2)*280,y=1072+Math.floor(i/2)*230;svg+=card(x,y,260,210)+text(label,x+22,y+40,23,'#a8b9d4')+text(valid(n)?Math.round(n):'—',x+22,y+116,62,color(n),700)+text(rating(n),x+22,y+172,24,color(n));});
 svg+='</g>'+text('SEVEN PIECES OF THE PICTURE',64,1566,22,'#b8a6ef',700);
 keys.forEach((key,i)=>{const n=s.indicators?.find(v=>v.key===key)?.score,y=1612+i*49;svg+=text(names[i],64,y,26,'#dce5f5')+`<rect x="555" y="${y-18}" width="520" height="10" rx="5" fill="#26344a"/>`;if(valid(n))svg+=`<rect x="555" y="${y-18}" width="${5.2*n}" height="10" rx="5" fill="${color(n)}"/>`;svg+=text(valid(n)?`${Math.round(n)} · ${rating(n)}`:'Unavailable',1536,y,25,color(n),400,'end');});
 svg+=text('Scale: 0–100 · Saved reading · Market sentiment, not a forecast',64,1960,21,'#9eafc9')+'<path d="M64 1990 H1536" stroke="#34435e"/>'+text('www.StocksToBuyNow.ai',64,2107,44,'#e3d8ff',700);
 const qr=renderToStaticMarkup(React.createElement(QRCodeSVG,{value:'https://www.stockstobuynow.ai/fear-and-greed-index/',size:160,level:'M',includeMargin:true})).replace('<svg ','<svg x="1376" y="2020" ');
 return svg+qr+'</g></svg>';
}
function render(root=path.join(__dirname,'..')){
 const s=JSON.parse(fs.readFileSync(path.join(root,'data/fear-greed.json'),'utf8'));
 const svg=poster(s),font=path.join(root,'public/assets/packages/language_picker/assets/fonts/Roboto/Roboto-Regular.ttf');
 const bytes=new Resvg(svg,{font:{fontFiles:[font],loadSystemFonts:false,defaultFontFamily:'Roboto'}}).render().asPng();
 const hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20),image=`/data/fear-greed-share-${hash}.png`;
 const metadata={image,timestamp:s.timestamp,score:s.score,width:WIDTH,height:HEIGHT,layoutVersion:LAYOUT_VERSION,historyRange:'1Y'};
 fs.mkdirSync(path.join(root,'public/data'),{recursive:true});
 fs.writeFileSync(path.join(root,'public',image),bytes);
 for(const file of ['data/fear-greed-share.json','public/data/fear-greed-share.json'])fs.writeFileSync(path.join(root,file),JSON.stringify(metadata)+'\n');
 return metadata;
}
module.exports={poster,render,historySeries};
if(require.main===module)console.log(render());
