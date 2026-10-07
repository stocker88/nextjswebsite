import Head from 'next/head';
import Link from 'next/link';
import type {ReactNode} from 'react';
export default function ResearchPage({title, path, children}: {title:string; path:string; children:ReactNode}) {
  return <>
    <Head>
      <title>{title} | Stocks To Buy Now AI</title>
      <meta name="description" content={title} />
      <link rel="canonical" href={`https://www.stockstobuynow.ai${path}`} />
      <meta name="robots" content="index,follow" />
      <meta property="og:title" content={title} />
      <meta property="og:url" content={`https://www.stockstobuynow.ai${path}`} />
    </Head>
    <main><nav className="site-nav"><Link href="/">Home</Link><Link href="/stocks-to-buy-now">Research</Link><Link href="/stocks-to-buy">Stocks to buy</Link></nav>{children}</main>
    <style jsx>{`
      main {min-height:100vh;background:#070b18;color:white;padding:40px max(20px,calc((100vw - 1000px)/2));}
      nav {margin-bottom:40px;color:#59aaff;display:flex;gap:22px;flex-wrap:wrap;} nav a {color:#59aaff;text-decoration:none;} nav a:hover {color:#bca5ff;}
      main :global(h1) {font-size:clamp(28px,5vw,48px);line-height:1.2;}
      main :global(.research-board) {display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(8px,1.8vw,22px);margin-top:42px;align-items:start;width:100%;}
      main :global(.research-column) {min-width:0;}
      main :global(.research-column + .research-column) {border-left:1px solid rgba(120,145,190,.18);padding-left:16px;}
      main :global(.research-card-compact) {margin:0 0 16px;padding:18px;border-radius:18px;}
      main :global(.research-card-compact h2) {font-size:clamp(16px,1.8vw,22px);margin:12px 0 8px;line-height:1.2;}
      main :global(.research-card-compact .research-meta) {display:none;}
      main :global(.research-card-compact .metrics) {font-size:11px;gap:9px;flex-wrap:wrap;}
      main :global(.research-card) {display:block;min-width:0;overflow:hidden;overflow-wrap:anywhere;padding:28px;margin:18px 0;border:1px solid rgba(120,145,190,.25);border-radius:24px;background:linear-gradient(145deg,#121c2d,#0c1220);box-shadow:0 18px 44px rgba(0,0,0,.2);transition:transform .2s,border-color .2s;}
      main :global(.research-card:hover) {transform:translateY(-3px);border-color:#8d68ff;}
      main :global(.research-card h2) {margin:14px 0 10px;font-size:clamp(15px,1.7vw,20px);line-height:1.32;overflow-wrap:anywhere;}
      main :global(.insight-bubble) {display:inline-flex;align-items:center;gap:9px;border:1px solid #895cff;border-radius:999px;padding:8px 14px;color:#d9c8ff;background:rgba(91,49,172,.22);font-size:13px;font-weight:800;letter-spacing:.06em;}
      main :global(.ticker-logo) {width:24px;height:24px;border-radius:50%;object-fit:contain;background:#fff;}
      main :global(.signal-chart) {display:block;width:100%;height:150px;margin:18px 0 10px;border-radius:14px;background:linear-gradient(180deg,rgba(53,212,119,.14),rgba(19,31,50,.25));}
            main :global(.metric-switcher) {display:flex;gap:6px;margin:16px 0 2px;flex-wrap:wrap;} main :global(.metric-switcher button) {border:1px solid rgba(181,108,255,.35);background:transparent;color:#b9a6d9;border-radius:999px;padding:5px 9px;font-size:10px;cursor:pointer;} main :global(.metric-switcher button.active) {background:rgba(181,108,255,.22);color:#e2d4ff;border-color:#b56cff;} main :global(.metric-locked) {height:150px;display:grid;place-items:center;margin:12px 0;color:#c184ff;background:rgba(181,108,255,.1);border-radius:14px;text-align:center;font-size:12px;font-weight:700;}
main :global(.chart-label) {font-size:10px;font-weight:800;letter-spacing:.12em;margin-top:14px;} main :global(.price-label) {color:#35d477;} main :global(.prediction-label) {color:#c184ff;} main :global(.prediction-badge) {display:inline-block;margin-top:12px;padding:7px 12px;border-radius:999px;background:rgba(181,108,255,.16);border:1px solid rgba(181,108,255,.5);color:#d6a7ff;font-size:10px;font-weight:800;letter-spacing:.1em;}
      main :global(.insight-dot) {width:10px;height:10px;border-radius:50%;background:#a968ff;box-shadow:0 0 12px #a968ff;}
      main :global(.metrics) {display:flex;gap:18px;color:#aeb8ca;font-size:13px;}
      main :global(.research-meta) {color:#aeb8ca;font-size:14px;margin:14px 0;}
      @media (max-width: 700px) { main {padding-left:10px;padding-right:10px;} main :global(.research-board) {grid-template-columns:repeat(3,minmax(0,1fr));gap:7px;margin-top:26px;} main :global(.research-column + .research-column) {padding-left:7px;} main :global(.research-card-compact) {padding:10px;margin-bottom:8px;border-radius:12px;} main :global(.research-card-compact h2) {font-size:12px;margin:8px 0 6px;} main :global(.insight-bubble) {font-size:8px;padding:5px 6px;gap:4px;letter-spacing:.02em;} main :global(.ticker-logo) {width:16px;height:16px;} main :global(.metrics) {font-size:8px;gap:4px;} }
      main :global(.research-cta) {display:inline-block;background:#1683ff;padding:14px 22px;border-radius:28px;margin:18px 0;color:white;font-weight:750;}
    `}</style>
  </>;
}
