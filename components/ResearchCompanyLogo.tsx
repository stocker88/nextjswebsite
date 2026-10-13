import {useState} from 'react';

// Use bundled logos only: no quote/profile lookup is needed for a headline.
const topicTags = new Set(['EDUCATION', 'SIGNALS', 'SIGNAL', 'NEWS', 'MARKET', 'EARNINGS', 'RESULTS', 'AI', 'IPO', 'TIPS', 'LEARNING', 'ECONOMICDATA', 'OPTIONS', 'TECHNICALS', 'FINANCIALS']);
export default function ResearchCompanyLogo({symbols, title}: {symbols: string[]; title: string}) {
  const [failed, setFailed] = useState<string[]>([]);
  const mentioned = new Set(Array.from(title.matchAll(/(?:[$#]([A-Za-z][A-Za-z0-9.-]{0,11})\b|\(([A-Za-z][A-Za-z0-9.-]{0,11})\))/g), match => (match[1] || match[2]).toUpperCase()));
  const candidates = symbols.map(value => value.trim().replace(/^[#$]+/, '').toUpperCase())
    .filter(value => /^[A-Z][A-Z0-9.-]{0,11}$/.test(value) && (!topicTags.has(value) || mentioned.has(value)));
  const ordered = [...candidates.filter(value => mentioned.has(value)), ...candidates.filter(value => !mentioned.has(value))];
  const symbol = ordered.find(value => !failed.includes(value));
  if (!symbol) return null;
  return <><img className="research-company-logo" src={'/assets/logo/' + encodeURIComponent(symbol) + '.webp'}
    alt={symbol + ' logo'} width={32} height={32} loading="lazy" decoding="async"
    onError={() => setFailed(previous => [...previous, symbol])}/>
    <style jsx>{`
      .research-company-logo{display:inline-block;width:32px;height:32px;margin-right:10px;vertical-align:-7px;object-fit:contain;border-radius:50%;background:#fff;box-shadow:0 0 0 1px #ffffff24;}
      @media(max-width:700px){.research-company-logo{width:26px;height:26px;margin-right:8px;vertical-align:-6px;}}
    `}</style></>;
}
