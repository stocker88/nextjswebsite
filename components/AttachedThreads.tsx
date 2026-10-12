import Link from 'next/link';
import {ResearchPreview, AttachedThread, displayEngagementCount} from '../lib/research';
import {displayDate, isoDate} from '../lib/seo';
import ResearchImages from './ResearchImages';
import EngagementIcon from './EngagementIcon';

export default function AttachedThreads({item}: {item: ResearchPreview}) {
  const threads: AttachedThread[] = item.attachedThreads?.length ? item.attachedThreads :
    item.attachedTitle ? [{id: '', title: item.attachedTitle, time: null, symbols: []}] : [];
  if (!threads.length) return null;
  return <aside className="attached-threads" aria-label="Attached threads">
    {threads.map((thread, index) => <div className="attached-thread" key={thread.id || index}>
      <span className="attachment-label"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><path d="m10 13 4-4m-6 6-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 3 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(1 0)"/></svg>Attached thread</span>
      <div className="attachment-heading">{thread.id ?
        <Link href={`/stock-market-news/${encodeURIComponent(thread.id)}`}>{thread.title}<span aria-hidden="true"> ↗</span></Link> : thread.title}</div>
      {!!(thread.time || thread.symbols.length) && <div className="attachment-meta">
        {thread.symbols.length > 0 && <span>{thread.symbols.join(' · ')}</span>}
        {thread.time != null && <time dateTime={isoDate(thread.time) || undefined}>{displayDate(thread.time)}</time>}
      </div>}
      {thread.quickTake && <p>{thread.quickTake}</p>}
      <ResearchImages images={thread.images} compact thumbnailSize={128} />
      {thread.likes != null && <div className="attachment-engagement" aria-label="Thread engagement">
        {(['likes', 'comments', 'shares'] as const).map(kind =>
          <span key={kind} aria-label={`${displayEngagementCount(thread[kind] ?? 0)} ${kind}`}>
            <EngagementIcon kind={kind} />{displayEngagementCount(thread[kind] ?? 0)}
          </span>)}
      </div>}
    </div>)}
    <style jsx>{`
      .attached-threads { display:grid; gap:10px; margin-top:18px; min-width:0; }
      .attached-thread { min-width:0; padding:14px 16px; border:1px solid #2b3b52; border-left:3px solid #587daf; border-radius:12px; background:#101925; }
      .attachment-label { display:flex; gap:7px; align-items:center; color:#9db2d0; font-size:11px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; }
      .attachment-heading { margin-top:8px; font-size:16px; font-weight:650; line-height:1.45; overflow-wrap:anywhere; color:#e5edf8; }
      .attachment-heading :global(a) { color:#e5edf8; text-decoration:none; }
      .attachment-heading :global(a:hover) { color:#9ccaff; }
      .attachment-heading :global(a:focus-visible) { outline:2px solid #b99aff; outline-offset:3px; }
      .attachment-meta { display:flex; flex-wrap:wrap; gap:6px 14px; margin:6px 0; color:#98a9c0; font-size:12px; line-height:1.5; }
      .attachment-engagement { display:flex; flex-wrap:wrap; gap:18px; margin-top:12px; color:#98a9c0; font-size:12px; line-height:1.5; }
      .attachment-engagement span { display:inline-flex; gap:6px; align-items:center; }
      p { color:#afbdd1; font-size:14px; line-height:1.55; margin:8px 0 12px; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
      .attached-thread :global(.pictures) { margin-top:12px; flex-wrap:wrap; }
      .attached-thread :global(.picture) { max-width:100%; }
      @media(max-width:480px) { .attached-thread { padding:12px; } .attachment-heading { font-size:15px; } }
    `}</style>
  </aside>;
}
