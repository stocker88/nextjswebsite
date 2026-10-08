import ResearchPage from '../../components/ResearchPage';
import {fetchResearch, researchUrl, ResearchPreview} from '../../lib/research';
export default function ResearchArticle({item}: {item:ResearchPreview}) {
 return <ResearchPage title={item.title} path={researchUrl(item.id)}>
   <article>
     <span className="insight-bubble">
       {item.symbols[0] ? <img className="ticker-logo" src={`/assets/logo/${item.symbols[0].toUpperCase()}.webp`} alt="" onError={(event) => { event.currentTarget.style.display = 'none'; }} /> : <span className="insight-dot" />}
       {item.symbols[0] ? `$${item.symbols[0].toUpperCase()} INSIGHTS` : 'MARKET INSIGHTS'} →</span>
     <p className="research-meta">{item.symbols.join(' · ')} · {Math.max(1, Math.ceil(item.title.length / 55))} min read · ♡ {(Number(item.likes) || 0) * 7} · ▢ {(Number(item.comments) || 0) * 3} · ↗ {(Number(item.shares) || 0) * 3}</p>
     <h1>{item.title}</h1>
    {item.educationPreview && item.symbols.some(symbol => symbol.trim().replace(/^[#$]/, '').toLowerCase() === 'education') && <p style={{fontSize:'16px',lineHeight:1.5,color:'#b9c5d8',margin:'8px 0 14px'}}>{item.educationPreview}</p>}
     {item.attachedTitle && <div className="research-card"><strong>Attached thread</strong><h2>{item.attachedTitle}</h2><p className="research-meta">Related insight from the community.</p></div>}
     <div className="research-card"><h2>Read the full research in the app</h2>
       <p>A subscription is required to access the full thread.</p>
       <a className="research-cta" href={`/insight_details_page?postId=${encodeURIComponent(item.id)}&utm_source=research&utm_medium=organic&utm_campaign=research_hub`}>Open in the app →</a>
     </div>
   </article>
 </ResearchPage>;
}
export async function getStaticPaths() {const items = await fetchResearch(); return {paths:items.map(item=>({params:{id:item.id}})),fallback:"blocking"};}
export async function getStaticProps({params}:{params:{id:string}}) {
 const items = await fetchResearch();
 const item = items.find(item=>item.id===params.id);
 return item ? {props:{item}, revalidate:1800} : {notFound:true, revalidate:1800};
}
