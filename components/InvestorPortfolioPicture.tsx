import {QRCodeSVG} from 'qrcode.react';
import {portfolioHoldings,portfolioColors,trackerMoney,trackerDate,TrackerDetail,TrackerRow} from '../lib/investor-tracker';

// The preview itself is rasterized for export, so the saved PNG matches it.
export default function InvestorPortfolioPicture({data,rows,period,portrait}:{data:TrackerDetail;rows:TrackerRow[];period:string;portrait?:string|null}){
 const fund=data.kind==='funds',all=portfolioHoldings(rows),total=all.reduce((s,h)=>s+h.value,0),top=all.slice(0,10),other=all.slice(10).reduce((s,h)=>s+h.value,0);
 const slices=[...top,...(other>0?[{symbol:'Other',value:other}]:[])];let offset=0;
 const missing=rows.filter(r=>typeof r.value!=='number'||!Number.isFinite(r.value)||r.value<0).length;
 const name=data.name.split(' · '),points=data.performance?.points||[],last=points[points.length-1];
 return <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 720 820" width="720" height="820" role="img" aria-label={`${data.name}: ${fund?'reported holdings':'reported transactions'}`} style={{width:'100%',height:'auto',fontFamily:'Arial, sans-serif'}}>
  <defs><linearGradient id="portfolio-bg" x2="1" y2="1"><stop stopColor="#17243a"/><stop offset="1" stopColor="#0b1020"/></linearGradient></defs>
  <rect width="720" height="820" fill="url(#portfolio-bg)"/>
  <g fill="#e9eef8"><text x="28" y="40" fill="#b59af7" fontSize="13" letterSpacing="2">STOCKS TO BUY NOW AI / INVESTOR TRACKER</text>
  <svg x="28" y="56" width="84" height="84" viewBox="0 0 84 84"><defs><clipPath id="investor-portrait-clip"><circle cx="42" cy="42" r="40"/></clipPath></defs><circle cx="42" cy="42" r="41" fill="#344159" stroke="#b59af7"/><text x="42" y="50" textAnchor="middle" fontSize="24">{name[0].split(' ').map(n=>n[0]).slice(0,2).join('')}</text>{portrait&&<image href={portrait} width="84" height="84" preserveAspectRatio="xMidYMin slice" clipPath="url(#investor-portrait-clip)"/>}</svg>
  <text x="128" y="82" fontSize="26" fontWeight="700">{name[0]}</text>{name[1]&&<text x="128" y="114" fontSize="22" fontWeight="700">{name[1]}</text>}
<text x="128" y="145" fontSize="15" fill="#a6b6ce">{fund?`Reported holdings · ${trackerDate(period||rows[0]?.period)}`:`Reported transactions · ${period||'Available archive'}`}</text>
  {fund&&total>0?<><g transform="translate(360 250) rotate(-90)">{slices.map((h,i)=>{const circumference=2*Math.PI*72,share=h.value/total*circumference,start=offset;offset+=share;return <circle key={h.symbol} r="72" fill="none" stroke={portfolioColors[i]} strokeWidth="28" strokeDasharray={`${share} ${circumference-share}`} strokeDashoffset={-start}/>})}</g><text x="360" y="250" textAnchor="middle" fontSize="26" fontWeight="700">{trackerMoney(total)}</text><text x="360" y="273" textAnchor="middle" fontSize="12" fill="#a6b6ce">reported value</text></>:<text x="28" y="205" fill="#a6b6ce" fontSize="16">{fund?'Reported values unavailable':'Transactions are not a complete holdings portfolio.'}</text>}
  {fund?<><text x="28" y="365" fontSize="13" letterSpacing="1.5">TOP 10 HOLDINGS</text>{other>0&&<text x="692" y="365" textAnchor="end" fontSize="13">Other holdings · {(other/total*100).toFixed(1)}%</text>}
   {top.map((h,i)=>{const x=28+(i%3)*224,y=380+Math.floor(i/3)*56;return <g key={h.symbol}><rect x={x} y={y} width="216" height="48" rx="10" fill="#1d2b40"/><circle cx={x+13} cy={y+23} r="4" fill={portfolioColors[i]}/><image href={`/assets/logo/${encodeURIComponent(h.symbol)}.webp`} x={x+23} y={y+10} width="28" height="28" preserveAspectRatio="xMidYMid meet" onError={e=>e.currentTarget.style.display='none'}/><text x={x+58} y={y+20} fontSize="15" fontWeight="700">{h.symbol.slice(0,10)}</text><text x={x+58} y={y+37} fontSize="12" fill="#a6b6ce">{trackerMoney(h.value)}</text><text x={x+205} y={y+30} textAnchor="end" fontSize="14">{(h.value/total*100).toFixed(1)}%</text></g>})}
   <text x="28" y="615" fontSize="12" fill="#a6b6ce">Share of known reported value · {all.length} holdings{missing?` · ${missing} records without values excluded`:''}</text>
  </>:rows.slice(0,10).map((r,i)=><g key={r.id||i}><text x="28" y={245+i*34} fontSize="16" fontWeight="700">{r.symbol}</text><text x="692" y={245+i*34} textAnchor="end" fontSize="13">{`${r.rawAction||'Transaction'} · ${r.amount||'Range unavailable'}`.slice(0,72)}</text></g>)}
  {last&&Number.isFinite(last.value)&&<><text x="28" y="651" fontSize="15" fill="#b59af7" fontWeight="700">Latest disclosed-stock model · {(last.value-100).toFixed(1)}%</text><text x="28" y="671" fontSize="12">{trackerDate(points[0].date)} – {trackerDate(last.date)} · Equal-weight price return, not actual investor returns.</text></>}
  <path d="M28 692H692" stroke="#344159"/>
  <g transform="translate(28 710)"><QRCodeSVG value="https://www.stockstobuynow.ai/smart-money/?view=tracker" size={80} includeMargin/></g>
  <text x="124" y="733" fontSize="19" fill="#b59af7" fontWeight="700">Explore Investor Tracker</text><text x="124" y="755" fontSize="15">StocksToBuyNow.ai</text>
  <text x="124" y="775" fontSize="11" fill="#a6b6ce">{fund?'Reported 13F holdings, not a complete live portfolio.':'Transactions may include spouse holdings; not a complete portfolio.'}</text><text x="124" y="792" fontSize="11" fill="#a6b6ce">Updated {trackerDate(data.updatedAt)} · Filings can lag activity.</text>
  </g>
 </svg>;
}
