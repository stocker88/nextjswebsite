import {useState} from 'react';
export default function StockLogo({symbol,src}:{symbol:string;src:string|null}) {
 const [failed,setFailed]=useState(false);
 return <span className="stock-logo" aria-hidden="true">{src&&!failed?<img src={src} alt="" width={48} height={48} loading="lazy" onError={()=>setFailed(true)}/>:<span>{symbol.replace(/[^a-z0-9]/gi,'').slice(0,2)}</span>}<style jsx>{`.stock-logo{width:48px;height:48px;flex-shrink:0;display:inline-flex;align-items:center;justify-content:center;border-radius:50%;overflow:hidden;background:#26354c;color:#d3e5ff;font-size:16px;font-weight:700}.stock-logo img{width:48px;height:48px;object-fit:contain;background:white}`}</style></span>;
}
