import Link from 'next/link';
import LegalLayout from '../../components/LegalLayout';
import pages from '../../data/legal-disclosures.json';
import s from '../../styles/Legal.module.css';
export default function Legal(){return <LegalLayout title="Legal & Disclosures" description="Research disclosures, personal trading, editorial standards, performance calculations and service information." path="/legal/">
<header className={s.hero}><span className={s.kicker}>STOCKS TO BUY NOW RESEARCH</span><h1>Legal &amp; Disclosures</h1><p>Understand the interests behind research, how performance figures are calculated and which terms apply to the service.</p></header>
<div className={s.grid}>{pages.map(p=><Link className={s.card} href={'/legal/'+p.slug+'/'} key={p.slug}><span className={s.kicker}>{p.pending.length?'POLICY DETAILS TO CONFIRM':'BASED ON CURRENT METHODOLOGY'}</span><h2>{p.title}</h2><p>{p.description}</p><strong>Read disclosure →</strong></Link>)}<Link className={s.card} href="/posts/privacypolicy"><span className={s.kicker}>EXISTING TERMS</span><h2>Privacy Policy &amp; Terms of Use</h2><p>Account information, privacy, service providers, subscriptions, cancellation and refunds.</p><strong>Read existing terms →</strong></Link></div>
<section className={s.contact}><h2>Questions or corrections?</h2><p>Contact <a href="mailto:support@stockstobuynow.ai">support@stockstobuynow.ai</a> with the relevant page URL and your question.</p></section></LegalLayout>}
