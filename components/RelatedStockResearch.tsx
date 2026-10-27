import {useState} from 'react';
import Link from 'next/link';
import {ResearchPreview,researchUrl} from '../lib/research';
import {displayDate} from '../lib/seo';
export default function RelatedStockResearch({items}:{items:ResearchPreview[]}){
 const [expanded,setExpanded]=useState(false);
 if(!items.length)return null;
 return <section className="related-stock-research"><h2>Related research</h2><p className="intro">Company research, movers, earnings and options results.</p><ul>{(expanded?items:items.slice(0,12)).map(a=><li key={a.id}><small>{a.category||'Research'} · {displayDate(a.time)}</small><Link href={a.href||researchUrl(a.id,a.title)}>{a.title}</Link></li>)}</ul>{items.length>12&&<button type="button" aria-expanded={expanded} onClick={()=>setExpanded(!expanded)}>{expanded?'Show less':`View all ${items.length} articles`}</button>}<style jsx>{`.related-stock-research{margin:40px 0}.intro,small{color:#9fafc6}ul{list-style:none;padding:0}li{padding:18px 0;border-bottom:1px solid #29364b}small{display:block;font-size:12px;margin-bottom:8px}li :global(a){font-size:17px;line-height:1.6;color:#a8cfff}button{padding:12px 18px;border:1px solid #73618f;border-radius:12px;background:#241c37;color:#dcc7ff;cursor:pointer;margin-top:18px}`}</style></section>;
}
