import {AccountLink} from '../SiteAccount';
import {Event} from '../../lib/earnings';
export default function EarningsInsightLinks({event}:{event:Event}) {
 return <div className="ec-insight-links">{event.insights?.filter(i=>i.href&&/^\/(news|catalysts)\/[a-z0-9-]+\/$/.test(i.href)).map(i=><AccountLink key={i.postId} destination={i.href!} title={i.title} aria-label={`${event.symbol}: ${i.title}`}>{i.kind==='results'?'Results':'Preview'} ↗</AccountLink>)}<style jsx global>{`.ec-insight-links{display:flex;flex-wrap:wrap;justify-content:center;gap:4px}.ec-insight-links a{display:inline-block;margin-top:5px;padding:5px 7px;border:1px solid #9f7dd080;border-radius:7px;background:#a780e51c;color:#d2b5ff;font-size:10px;line-height:1.3;text-decoration:none}.ec-insight-links a:focus-visible{outline:2px solid #d2b5ff}@media(max-width:700px){.ews .ec-insight-links a{font-size:8px;padding:5px 3px}}`}</style></div>;
}
