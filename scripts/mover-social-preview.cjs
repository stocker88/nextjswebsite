const fs=require('node:fs');
const path=require('node:path');
const {Resvg}=require('@resvg/resvg-js');

const WIDTH=1200,HEIGHT=630,LAYOUT_VERSION=3;
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[char]));
const previewPath=article=>`/assets/social/movers/${article.slug}-${Date.parse(article.updatedAt).toString(36)}-v${LAYOUT_VERSION}.png`;
const etParts=timestamp=>Object.fromEntries(new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date(timestamp*1000)).filter(part=>part.type!=='literal').map(part=>[part.type,part.value]));
const etDate=parts=>`${parts.year}-${parts.month}-${parts.day}`;
const sessionName=session=>session==='afterhours'?'AFTER-HOURS':session==='premarket'?'PRE-MARKET':'REGULAR SESSION';
const money=value=>'$'+Number(value).toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2});
const shortText=(value,max)=>String(value||'').replace(/\s+/g,' ').trim().slice(0,max).replace(/\s+\S*$/,'')+(String(value||'').length>max?'…':'');

function sessionMinutes(session){
 if(session==='premarket')return [4*60,9*60+30];
 if(session==='afterhours')return [16*60,20*60];
 return [9*60+30,16*60];
}
function chartUrl(article){
 const start=Math.floor(Date.parse(`${article.sessionDate}T00:00:00-05:00`)/1000)-86400;
 const end=start+3*86400;
 return `https://query2.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(article.symbol)}?period1=${start}&period2=${end}&interval=5m&includePrePost=true&events=div%2Csplits`;
}
async function loadSeries(article){
 const response=await fetch(chartUrl(article),{headers:{'user-agent':'Mozilla/5.0 StocksToBuyNow/1.0'},signal:AbortSignal.timeout(20000)});
 if(!response.ok)throw Error(`chart HTTP ${response.status}`);
 const result=(await response.json()).chart?.result?.[0];
 if(!result)throw Error('chart response contained no result');
 const timestamps=result.timestamp||[],closes=result.indicators?.quote?.[0]?.close||[];
 const [start,end]=sessionMinutes(article.marketSession);
 const points=[];
 for(let i=0;i<timestamps.length;i++){
  if(!Number.isFinite(closes[i]))continue;
  const parts=etParts(timestamps[i]),minute=Number(parts.hour)*60+Number(parts.minute);
  if(etDate(parts)===article.sessionDate&&minute>=start&&minute<=end)points.push({timestamp:timestamps[i],value:closes[i],minute});
 }
 if(points.length<2)throw Error('fewer than two session prices');
 const baseline=Number.isFinite(article.regularClose)?article.regularClose:Number.isFinite(article.stockContext?.close)?article.stockContext.close:result.meta?.regularMarketPrice;
 const last=points.at(-1).value;
 const move=Number.isFinite(article.move)?article.move:Number.isFinite(baseline)&&baseline!==0?(last/baseline-1)*100:null;
 return {points,baseline,last,move};
}
function splitHeadline(text){
 const words=shortText(text,116).split(' '),lines=[''];
 for(const word of words){
  const current=lines.at(-1),next=(current+' '+word).trim();
  if(next.length>58&&lines.length<2)lines.push(word);else lines[lines.length-1]=next;
 }
 return lines;
}
function poster(article,series){
 const positive=(series.move??0)>=0,color=positive?'#36d399':'#ff6174',soft=positive?'#123e35':'#421f2a';
 const chart={left:66,right:1134,top:244,bottom:510};
 const values=series.points.map(point=>point.value).concat(Number.isFinite(series.baseline)?[series.baseline]:[]);
 let min=Math.min(...values),max=Math.max(...values),padding=Math.max((max-min)*.13,max*.006);
 min-=padding;max+=padding;
 const [sessionStart,sessionEnd]=sessionMinutes(article.marketSession);
 const x=point=>chart.left+(point.minute-sessionStart)/(sessionEnd-sessionStart)*(chart.right-chart.left);
 const y=value=>chart.bottom-(value-min)/(max-min)*(chart.bottom-chart.top);
 const line=series.points.map((point,index)=>`${index?'L':'M'} ${x(point).toFixed(1)} ${y(point.value).toFixed(1)}`).join(' ');
 const area=`${line} L ${x(series.points.at(-1)).toFixed(1)} ${chart.bottom} L ${x(series.points[0]).toFixed(1)} ${chart.bottom} Z`;
 const spikeIndex=series.points.reduce((best,point,index)=>{const previous=index?series.points[index-1].value:series.baseline;const change=Number.isFinite(previous)?Math.abs(point.value/previous-1):0;return change>best.change?{index,change}:best},{index:0,change:0}).index;
 const spike=series.points[spikeIndex],spikeX=x(spike),spikeY=y(spike.value);
 const grid=Array.from({length:4},(_,index)=>{const value=min+(max-min)*(3-index)/3,gy=chart.top+(chart.bottom-chart.top)*index/3;return `<line x1="${chart.left}" x2="${chart.right}" y1="${gy}" y2="${gy}" stroke="#243249" stroke-width="1"/><text x="${chart.right}" y="${gy-8}" text-anchor="end" fill="#8190a8" font-size="18">${esc(money(value))}</text>`;}).join('');
 const baseline=Number.isFinite(series.baseline)?`<line x1="${chart.left}" x2="${chart.right}" y1="${y(series.baseline)}" y2="${y(series.baseline)}" stroke="#8ea0ba" stroke-width="2" stroke-dasharray="8 9" opacity=".7"/><text x="${chart.left}" y="${y(series.baseline)-10}" fill="#aebbd0" font-size="17">Previous close ${esc(money(series.baseline))}</text>`:'';
 const headlines=splitHeadline(article.catalyst||article.summary);
 const move=series.move===null?'':`${positive?'+':''}${series.move.toFixed(1)}%`;
 const periods=['1D','1W','1M','YTD','1Y','3Y','5Y'];
 const periodSelector=periods.map((period,index)=>{const px=64+index*68,selected=index===0;return `<rect x="${px}" y="174" width="56" height="34" rx="17" fill="${selected?soft:'#111d31'}" stroke="${selected?color:'#31405a'}" stroke-width="1.5"/><text x="${px+28}" y="197" text-anchor="middle" fill="${selected?color:'#8291a8'}" font-size="16" font-weight="700">${period}</text>`;}).join('');
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="#101a2d"/><stop offset="1" stop-color="#07101f"/></linearGradient><linearGradient id="area" x2="0" y2="1"><stop stop-color="${color}" stop-opacity=".42"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient><filter id="glow"><feGaussianBlur stdDeviation="6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter></defs><rect width="1200" height="630" fill="url(#bg)"/><g font-family="Roboto, Arial, sans-serif"><text x="64" y="58" fill="#a99af0" font-size="20" font-weight="700">STOCKS TO BUY NOW AI · MARKET MOVE</text><text x="64" y="126" fill="#f5f8ff" font-size="54" font-weight="700">$${esc(article.symbol)}</text><rect x="244" y="78" width="${Math.max(190,move.length*31)}" height="62" rx="31" fill="${soft}"/><text x="${244+Math.max(190,move.length*31)/2}" y="122" text-anchor="middle" fill="${color}" font-size="36" font-weight="700">${esc(move)}</text><text x="1136" y="104" text-anchor="end" fill="#dce5f4" font-size="23" font-weight="700">${sessionName(article.marketSession)}</text><text x="1136" y="134" text-anchor="end" fill="#8798b2" font-size="18">${esc(article.sessionDate)}</text><text x="64" y="160" fill="#73839b" font-size="14" font-weight="700" letter-spacing="1">PERIOD</text>${periodSelector}${grid}${baseline}<path d="${area}" fill="url(#area)"/><line x1="${spikeX}" x2="${spikeX}" y1="${chart.top+12}" y2="${chart.bottom}" stroke="${color}" stroke-width="2" stroke-dasharray="5 7" opacity=".65"/><path d="${line}" fill="none" stroke="${color}" stroke-width="8" stroke-linecap="round" stroke-linejoin="round" filter="url(#glow)"/><circle cx="${spikeX}" cy="${spikeY}" r="8" fill="#f5f8ff" stroke="${color}" stroke-width="4"/><rect x="${Math.min(chart.right-178,Math.max(chart.left,spikeX-30))}" y="${chart.top+12}" width="178" height="38" rx="19" fill="${soft}" stroke="${color}" stroke-opacity=".55"/><text x="${Math.min(chart.right-89,Math.max(chart.left+89,spikeX+59))}" y="${chart.top+38}" text-anchor="middle" fill="${color}" font-size="17" font-weight="700">PRICE SPIKE</text><circle cx="${x(series.points.at(-1))}" cy="${y(series.last)}" r="9" fill="${color}" stroke="#eaf2ff" stroke-width="3"/><rect x="64" y="530" width="1072" height="1" fill="#2b3950"/>${headlines.map((text,index)=>`<text x="64" y="${568+index*30}" fill="${index?'#b5c0d2':'#eef3fb'}" font-size="${index?'21':'23'}" font-weight="${index?'400':'700'}">${esc(text)}</text>`).join('')}<text x="1136" y="604" text-anchor="end" fill="#9b8bea" font-size="20" font-weight="700">StocksToBuyNow.ai</text></g></svg>`;
}
async function renderMoverPreviews(root=path.join(__dirname,'..'),articles){
 const items=articles||JSON.parse(fs.readFileSync(path.join(root,'data/mover-research.json'),'utf8'));
 const output=path.join(root,'public/assets/social/movers');
 fs.mkdirSync(output,{recursive:true});
 const manifest={version:LAYOUT_VERSION,generatedAt:new Date().toISOString(),items:{}};
 for(const article of items){
  if(article.kind==='manual_news'){manifest.items[article.id]={status:'reviewed-company-image',url:article.images[0]?.url};continue;}
  try{
   const series=await loadSeries(article),image=previewPath(article);
   const font=path.join(root,'public/assets/packages/language_picker/assets/fonts/Roboto/Roboto-Regular.ttf');
   const bytes=new Resvg(poster(article,series),{font:{fontFiles:[font],loadSystemFonts:false,defaultFontFamily:'Roboto'}}).render().asPng();
   fs.writeFileSync(path.join(root,'public',image),bytes);
   manifest.items[article.slug]={image,width:WIDTH,height:HEIGHT,points:series.points.length,move:series.move,last:series.last,baseline:series.baseline};
   console.log('Rendered mover social preview:',article.symbol,article.sessionDate);
  }catch(error){console.warn('Skipped mover social preview:',article.symbol,article.sessionDate,'-',error.message);}
 }
 fs.writeFileSync(path.join(output,'manifest.json'),JSON.stringify(manifest,null,2)+'\n');
 return manifest;
}
if(require.main===module)renderMoverPreviews().catch(error=>{console.error(error);process.exitCode=1});
module.exports={renderMoverPreviews,poster,loadSeries,previewPath};
