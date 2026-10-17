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
function poster(s){
 if(!valid(s?.score)||!Number.isFinite(Date.parse(s.timestamp)))throw Error('No valid sentiment snapshot to share');
 const date=new Date(s.timestamp).toLocaleDateString('en-US',{timeZone:'UTC',month:'short',day:'numeric',year:'numeric'});
 const text=(v,x,y,size=26,c='#f1f5ff',weight=400,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${c}" font-weight="${weight}" text-anchor="${anchor}">${esc(v)}</text>`;
 const card=(x,y,w,h)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="24" fill="#111d30" stroke="#2a394f"/>`;
 let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1800" viewBox="0 0 1600 1800"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#111c32"/><stop offset="1" stop-color="#080f20"/></linearGradient><linearGradient id="mood"><stop stop-color="#f17886"/><stop offset=".3" stop-color="#efa46b"/><stop offset=".5" stop-color="#e7cc7b"/><stop offset=".75" stop-color="#8bd8bf"/><stop offset="1" stop-color="#42c99a"/></linearGradient></defs><rect width="1600" height="1800" fill="url(#bg)"/><g font-family="Roboto">`;
 svg+=text('THE MOOD OF THE MARKET',64,74,22,'#b8a6ef',700)+text('Fear & Greed Index',64,148,64,'#f1f5ff',700)+text(`${date}  ·  Market sentiment snapshot`,64,205,26,'#a8b9d4');
 svg+=card(64,260,850,505)+text('WHERE SENTIMENT STANDS',100,310,22,'#b8a6ef',700);
 svg+='<path d="M229 650 A260 260 0 0 1 749 650" stroke="url(#mood)" stroke-width="34" stroke-linecap="round" fill="none"/>';
 const a=Math.PI*(1-s.score/100);
 svg+=`<circle cx="${489+260*Math.cos(a)}" cy="${650-260*Math.sin(a)}" r="16" fill="#fff" stroke="#111b2b" stroke-width="5"/>`;
 svg+=text(Math.round(s.score),489,590,112,color(s.score),700,'middle')+text(rating(s.score),489,643,32,color(s.score),700,'middle')+text('0 · Fear',214,710,23,'#a8b9d4')+text('Greed · 100',764,710,23,'#a8b9d4',400,'end');
 [['Previous close',s.previousClose],['One week ago',s.weekAgo],['One month ago',s.monthAgo],['One year ago',s.yearAgo]].forEach(([label,n],i)=>{const x=942+(i%2)*307,y=260+Math.floor(i/2)*265;svg+=card(x,y,287,240)+text(label,x+24,y+45,24,'#a8b9d4')+text(valid(n)?Math.round(n):'—',x+24,y+127,62,color(n),700)+text(rating(n),x+24,y+185,24,color(n));});
 svg+=card(64,795,1472,315)+text('HOW THE MOOD HAS CHANGED',100,844,22,'#b8a6ef',700);
 const end=Date.parse(s.timestamp),points=(s.history||[]).filter(p=>valid(p.value)&&Date.parse(p.date)<=end&&Date.parse(p.date)>=end-90*86400000).sort((a,b)=>a.date.localeCompare(b.date));
 [0,25,50,75,100].forEach(n=>{const y=1030-n*1.5;svg+=`<line x1="150" x2="1490" y1="${y}" y2="${y}" stroke="#29344a"/>`+text(n,130,y+6,18,'#9eafc9',400,'end');});
 if(points.length>1){const start=Date.parse(points[0].date),last=Date.parse(points[points.length-1].date);svg+=`<path d="${points.map((p,i)=>`${i?'L':'M'}${150+(Date.parse(p.date)-start)/Math.max(1,last-start)*1340},${1030-p.value*1.5}`).join(' ')}" fill="none" stroke="#bfa6ff" stroke-width="5" stroke-linejoin="round"/>`+text(points[0].date.slice(0,10),150,1075,19,'#a8b9d4')+text(points[points.length-1].date.slice(0,10),1490,1075,19,'#a8b9d4',400,'end');}else svg+=text('Historical readings unavailable',820,965,28,'#a8b9d4',400,'middle');
 svg+=text('SEVEN PIECES OF THE PICTURE',64,1164,22,'#b8a6ef',700);
 keys.forEach((key,i)=>{const n=s.indicators?.find(v=>v.key===key)?.score,y=1210+i*49;svg+=text(names[i],64,y,26,'#dce5f5')+`<rect x="555" y="${y-18}" width="520" height="10" rx="5" fill="#26344a"/>`;if(valid(n))svg+=`<rect x="555" y="${y-18}" width="${5.2*n}" height="10" rx="5" fill="${color(n)}"/>`;svg+=text(valid(n)?`${Math.round(n)} · ${rating(n)}`:'Unavailable',1536,y,25,color(n),400,'end');});
 svg+=text('Scale: 0–100 · Saved reading · Market sentiment, not a forecast',64,1560,21,'#9eafc9')+'<path d="M64 1590 H1536" stroke="#34435e"/>'+text('www.StocksToBuyNow.ai',64,1707,44,'#e3d8ff',700);
 const qr=renderToStaticMarkup(React.createElement(QRCodeSVG,{value:'https://www.stockstobuynow.ai/fear-and-greed-index/',size:160,level:'M',includeMargin:true})).replace('<svg ','<svg x="1376" y="1620" ');
 return svg+qr+'</g></svg>';
}
function render(root=path.join(__dirname,'..')){
 const s=JSON.parse(fs.readFileSync(path.join(root,'data/fear-greed.json'),'utf8'));
 const svg=poster(s),font=path.join(root,'public/assets/packages/language_picker/assets/fonts/Roboto/Roboto-Regular.ttf');
 const bytes=new Resvg(svg,{font:{fontFiles:[font],loadSystemFonts:false,defaultFontFamily:'Roboto'}}).render().asPng();
 const hash=crypto.createHash('sha256').update(bytes).digest('hex').slice(0,20),image=`/data/fear-greed-share-${hash}.png`;
 const metadata={image,timestamp:s.timestamp,score:s.score,width:1600,height:1800};
 fs.mkdirSync(path.join(root,'public/data'),{recursive:true});
 fs.writeFileSync(path.join(root,'public',image),bytes);
 for(const file of ['data/fear-greed-share.json','public/data/fear-greed-share.json'])fs.writeFileSync(path.join(root,file),JSON.stringify(metadata)+'\n');
 return metadata;
}
module.exports={poster,render};
if(require.main===module)console.log(render());
