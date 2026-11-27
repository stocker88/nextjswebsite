import {useSiteLanguage} from '../lib/localization/use-site-language';
import {message} from '../lib/localization/translate';
import Link from 'next/link';import {stockBriefings,briefingUrl} from '../lib/market-briefings';
export default function StockCatalystLinks({symbol}:{symbol:string}){const {language,t}=useSiteLanguage();const items=stockBriefings(symbol);if(!items.length)return null;return <section className="public-copy"><h2>{message('{symbol} earnings previews and market catalysts',language,{symbol})}</h2>{items.map(a=><p key={a.id}><Link href={briefingUrl(a)}>{a.title}</Link><br/><small>{a.sessionDate} · {a.summary}</small></p>)}<p><Link href="/catalysts/">{t('All upcoming earnings catalysts →')}</Link></p></section>}
