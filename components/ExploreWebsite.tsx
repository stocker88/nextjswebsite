import {siteNavigation} from '../lib/site-navigation';

export default function ExploreWebsite() {
  return <section className="explore-website" aria-labelledby="explore-title" id="explore-website">
    <div className="explore-shell">
      <span className="explore-eyebrow">RESEARCH · LEARN · EXPLORE</span>
      <h2 id="explore-title">Explore the website</h2>
      <p>Your next idea starts here.</p>
      <nav className="explore-grid" aria-label="Explore the website">
        {siteNavigation.map((item, index) => <a key={item.href} href={item.href} className={index === 0 ? 'featured' : ''}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={item.icon}/></svg>
          <span><strong>{item.label}</strong><small>{item.detail}</small></span>
          <span className="explore-arrow" aria-hidden="true">↗</span>
        </a>)}
      </nav>
    </div>
    <style jsx>{`
      .explore-website { padding:32px 20px 20px; scroll-margin-top:85px; }
      .explore-shell { max-width:1120px; margin:auto; padding:26px; border:1px solid #29354d; border-radius:22px; background:linear-gradient(125deg,#111e34,#17142b); }
      .explore-eyebrow { color:#ab92e8; font-size:10px; font-weight:700; letter-spacing:.13em; }
      h2 { color:#f0f4fc; font-size:26px; line-height:1.2; letter-spacing:-.025em; margin:8px 0; }
      p { margin:0 0 20px; color:#9faec5; font-size:14px; }
      .explore-grid { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:10px; }
      a { display:flex; align-items:center; gap:11px; padding:16px; min-height:76px; border:1px solid #2d3b53; border-radius:12px; background:#131e30; color:#99bdf6; text-decoration:none; transition:background .15s,border-color .15s; }
      a.featured { grid-column:span 2; background:linear-gradient(110deg,#26395c,#302447); border-color:#65568a; color:#c6a7fb; }
      a:hover { background:#21324c; border-color:#809ac0; }
      a:focus-visible { outline:2px solid #ba9bfa; outline-offset:3px; }
      svg { flex-shrink:0; }
      strong { display:block; color:#edf2fc; font-size:14px; font-weight:600; line-height:1.3; }
      small { display:block; color:#9faec5; margin-top:4px; font-size:11px; line-height:1.3; }
      .explore-arrow { margin-left:auto; color:#91a6c4; }
      @media(max-width:700px) {
        .explore-website { padding:24px 14px 12px; }
        .explore-shell { padding:18px 14px; border-radius:18px; }
        h2 { font-size:23px; }
        p { margin-bottom:16px; font-size:13px; }
        .explore-grid { grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px; }
        a { padding:12px 10px; gap:8px; min-height:62px; }
        strong { font-size:12px; }
        small { display:none; }
        .featured small { display:block; }
        .explore-arrow { display:none; }
        .featured .explore-arrow { display:block; }
      }
    `}</style>
  </section>;
}
