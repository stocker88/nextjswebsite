import Link from 'next/link';
import InstrumentResearch, {type InstrumentResearchProps} from './InstrumentResearch';
import {stockPageHref} from '../lib/stock-page';
export default function CompanyResearchSection({research}:{research:InstrumentResearchProps}){
 const {symbol,name}=research.item;
 return <section id={'company-research-'+symbol} className="company-research" aria-label={symbol+' full company research'}>
 <header><div><p>EXPLORE COMPANY RESEARCH</p><h2>{name}: the full stock picture</h2><span>Earnings history, financials, price action and peer comparisons — all below.</span></div><Link href={stockPageHref(symbol)}>Open {symbol} stock page ↗</Link></header>
 <InstrumentResearch {...research} embedded/>
 <style jsx>{`.company-research{margin-top:44px;padding-top:30px;border-top:1px solid #42516b;scroll-margin-top:110px;min-width:0}.company-research>header{display:flex;align-items:center;justify-content:space-between;gap:24px;padding:28px;border:1px solid #8562b7;border-radius:22px;background:linear-gradient(120deg,#27203d,#101e30);margin-bottom:24px}.company-research header p{color:#c9acf9;font-size:12px;letter-spacing:.12em;margin:0 0 12px}.company-research header h2{font-size:clamp(24px,3vw,34px);line-height:1.2;margin:0 0 12px;color:#f4f0fc}.company-research header span{color:#bfcee2;font-size:15px;line-height:1.6}.company-research header :global(a){display:inline-flex;flex-shrink:0;padding:14px 18px;border:1px solid #bca0ec;border-radius:12px;background:#7854a647;color:#eee2ff;text-decoration:none;font-size:14px;font-weight:600}.company-research header :global(a:hover),.company-research header :global(a:focus-visible){background:#7854a680}@media(max-width:700px){.company-research>header{align-items:flex-start;flex-direction:column;padding:22px}}`}</style>
 </section>;
}
