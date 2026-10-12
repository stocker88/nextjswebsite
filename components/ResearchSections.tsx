import Link from 'next/link';

export default function ResearchSections({path}: {path: string}) {
  const current = path.split('?')[0];
  const sections = [
    {href: '/stock-market-news', label: 'STOCK MARKET NEWS', title: 'View Stock Market News →', active: current.startsWith('/stock-market-news') || current.startsWith('/market-news')},
    {href: '/earnings-calendar/', label: 'EARNINGS CALENDAR', title: 'Upcoming Earnings →', active: current.startsWith('/earnings-calendar')},
    {href: '/stocks-to-buy', label: 'STOCK IDEAS', title: 'View Stocks to Buy Ideas →', active: current.startsWith('/stocks-to-buy')},
  ];
  return <>
    <nav className="research-navigation" aria-label="Research sections">
      {sections.map(section => <Link key={section.href} href={section.href} aria-current={section.active ? 'page' : undefined}>
        <span>{section.label}</span><strong>{section.title}</strong>
      </Link>)}
    </nav>
    <style jsx>{`
      .research-navigation {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;margin-bottom:20px;}
      .research-navigation :global(a) {display:flex;flex-direction:column;gap:8px;min-width:0;padding:18px 20px;border:1px solid #303c55;border-radius:16px;background:#111a2b;color:#c7d2e6;text-decoration:none;transition:background .2s,border-color .2s;}
      .research-navigation :global(a[aria-current="page"]) {background:linear-gradient(120deg,#232045,#152a40);border-color:#9770e9;color:white;}
      .research-navigation :global(a:hover) {border-color:#a586ee;background:#202b43;}
      .research-navigation :global(a:focus-visible) {outline:2px solid #bfa0ff;outline-offset:3px;}
      .research-navigation span {font-size:10px;letter-spacing:.12em;color:#98b9eb;font-weight:700;}
      .research-navigation strong {font-size:clamp(12px,1.6vw,17px);line-height:1.4;}
      @media(max-width:600px) {.research-navigation {gap:8px;} .research-navigation :global(a) {padding:12px 10px;}}
      @media(max-width:600px) {.research-navigation span {font-size:8px;letter-spacing:.05em;} .research-navigation strong {font-size:12px;} }
    `}</style>
  </>;
}
