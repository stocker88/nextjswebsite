import {useEffect, useRef, useState} from 'react';
import {createPortal} from 'react-dom';
import type {ResearchImage} from '../lib/research';

export default function ResearchImages({images = []}: {images?: ResearchImage[]}) {
  const [active, setActive] = useState<number | null>(null);
  const [closing, setClosing] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({x:0,y:0});
  const [origin, setOrigin] = useState({x:0,y:0,sx:1,sy:1});
  const restore = useRef<HTMLElement | null>(null);
  const modal = useRef<HTMLDivElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const points = useRef(new Map<number,{x:number,y:number}>());
  const gesture = useRef({distance:0,zoom:1,x:0,y:0,startX:0});
  const items = images.filter(i => /^https?:\/\//.test(i.url)).slice(0,2);
  const close = () => {
    if (closing) return;
    setClosing(true);
    timer.current = setTimeout(() => {setActive(null);setClosing(false);}, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240);
  };
  const change = (step:number) => {
    setActive(i => i === null ? null : (i + step + items.length) % items.length);
    setZoom(1);setPan({x:0,y:0});points.current.clear();
  };
  useEffect(() => {
    if (active === null) return;
    const old = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    modal.current?.querySelector<HTMLButtonElement>('button')?.focus();
    return () => {document.body.style.overflow=old;restore.current?.focus();};
  }, [active === null]);
  useEffect(() => () => {if(timer.current)clearTimeout(timer.current);}, []);
  if (!items.length) return null;
  const title = (i:ResearchImage) => {
    const stem = (i.filename || '').replace(/\.[^.]+$/,'').trim();
    return !stem || /^\d+$/.test(stem) ? '' : stem.charAt(0).toUpperCase()+stem.slice(1).toLowerCase();
  };
  const open = (index:number, button:HTMLButtonElement) => {
    restore.current=button;
    const r=button.getBoundingClientRect();
    const width=Math.min(innerWidth-24,1100),height=innerHeight*.9;
    setOrigin({x:r.left+r.width/2-innerWidth/2,y:r.top+r.height/2-innerHeight/2,sx:r.width/width,sy:r.height/height});
    setZoom(1);setPan({x:0,y:0});setActive(index);
  };
  return <>
    <div className={'pictures '+(items.length===2?'pair':'')}>
      {items.map((i,index)=><div key={i.url}>
        <button className="picture" onClick={e=>open(index,e.currentTarget)} aria-label={'Expand '+(title(i)||'image '+(index+1))}>
          <img src={i.url} width={i.width || undefined} height={i.height || undefined} alt={title(i)||'Research illustration'} loading="lazy"/>
          <span className="expand" aria-hidden="true">⛶</span>
        </button>
        {title(i)&&<span className="caption">{title(i)}</span>}
      </div>)}
    </div>
    {active!==null && createPortal(
      <div className={'research-lightbox '+(closing?'closing':'')} onClick={e=>{if(e.target===e.currentTarget)close();}}>
        <div ref={modal} className="lightbox-panel" role="dialog" aria-modal="true" aria-label="Research images"
          style={{'--from':`translate(${origin.x}px,${origin.y}px) scale(${origin.sx},${origin.sy})`} as React.CSSProperties}
          onKeyDown={e=>{
            if(e.key==='Escape'){e.preventDefault();close();}
            if(e.key==='ArrowRight'){e.preventDefault();change(1);}
            if(e.key==='ArrowLeft'){e.preventDefault();change(-1);}
            if(e.key==='Tab'){
              const buttons=Array.from(modal.current?.querySelectorAll<HTMLButtonElement>('button')||[]);
              const first=buttons[0],last=buttons[buttons.length-1];
              if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}
              if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}
            }
          }}>
          <div className="lightbox-tools">
            <span>{title(items[active])}</span>
            {items.length>1&&<><button aria-label="Previous image" onClick={()=>change(-1)}>‹</button><span>{active+1} / {items.length}</span><button aria-label="Next image" onClick={()=>change(1)}>›</button></>}
            <button onClick={()=>{setZoom(zoom===1?2:1);setPan({x:0,y:0});}} aria-label={zoom===1?'Zoom in':'Reset zoom'}>{zoom===1?'+':'−'}</button>
            <button onClick={close} aria-label="Close image">✕</button>
          </div>
          <div className="lightbox-stage"
            onDoubleClick={()=>{setZoom(zoom===1?2:1);setPan({x:0,y:0});}}
            onPointerDown={e=>{
              e.currentTarget.setPointerCapture(e.pointerId);
              points.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
              const p=Array.from(points.current.values());
              gesture.current={distance:p.length===2?Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y):0,zoom,x:e.clientX,y:e.clientY,startX:e.clientX};
            }}
            onPointerMove={e=>{
              if(!points.current.has(e.pointerId))return;
              points.current.set(e.pointerId,{x:e.clientX,y:e.clientY});
              const p=Array.from(points.current.values());
              if(p.length===2&&gesture.current.distance){
                setZoom(Math.max(1,Math.min(6,gesture.current.zoom*Math.hypot(p[0].x-p[1].x,p[0].y-p[1].y)/gesture.current.distance)));
              } else if(p.length===1&&zoom>1){
                setPan(v=>({x:v.x+e.clientX-gesture.current.x,y:v.y+e.clientY-gesture.current.y}));
                gesture.current.x=e.clientX;gesture.current.y=e.clientY;
              }
            }}
            onPointerUp={e=>{
              if(points.current.size===1&&zoom===1&&Math.abs(e.clientX-gesture.current.startX)>60)change(e.clientX<gesture.current.startX?1:-1);
              points.current.delete(e.pointerId);
            }}
            onPointerCancel={()=>points.current.clear()}>
            <img src={items[active].url} alt={title(items[active])||'Expanded research illustration'} draggable={false}
              style={{transform:`translate(${pan.x}px,${pan.y}px) scale(${zoom})`}}/>
          </div>
          <p className="lightbox-hint">Pinch or double-click to zoom{items.length>1?' · Swipe or use arrows to switch':''}</p>
        </div>
      </div>,document.body)}
    <style jsx>{`
      .pictures{margin:16px 0;display:grid;gap:12px}.pair{grid-template-columns:repeat(2,minmax(0,1fr))}
      .picture{display:block;position:relative;width:100%;padding:0;border:0;border-radius:12px;overflow:hidden;background:#080f20;cursor:zoom-in}
      .picture img{display:block;width:100%;height:auto}.pair .picture{aspect-ratio:1}.pair .picture img{width:100%;height:100%;object-fit:contain}
      .expand{position:absolute;right:6px;bottom:6px;background:#0009;color:white;border-radius:6px;padding:2px 7px;font-size:24px}
      .caption{display:block;text-align:center;margin-top:6px;font-size:12px;color:#cbd5e7}.picture:focus-visible{outline:2px solid #b594ff;outline-offset:3px}
    `}</style>
    <style jsx global>{`
      .research-lightbox{position:fixed;inset:0;z-index:100000;display:grid;place-items:center;background:#000b;backdrop-filter:blur(8px);animation:researchBackdrop .24s ease both}
      .lightbox-panel{width:min(calc(100vw - 24px),1100px);height:90vh;height:90dvh;background:#101521;color:white;border-radius:20px;overflow:hidden;display:flex;flex-direction:column;animation:researchExpand .28s cubic-bezier(.22,.61,.36,1) both}
      .research-lightbox.closing{animation:researchBackdrop .24s ease reverse both}.closing .lightbox-panel{animation:researchCollapse .24s ease both}
      .lightbox-tools{display:flex;align-items:center;gap:10px;padding:10px 12px}.lightbox-tools>span:first-child{flex:1;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}
      .lightbox-tools button{min-width:44px;min-height:44px;border:0;border-radius:9px;background:#243047;color:white;font-size:24px;cursor:pointer}
      .lightbox-tools button:focus-visible{outline:2px solid #b594ff}
      .lightbox-stage{flex:1;min-height:0;display:flex;justify-content:center;align-items:center;overflow:hidden;touch-action:none;cursor:grab}
      .lightbox-stage img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;object-fit:contain;user-select:none}
      .lightbox-hint{font-size:12px;color:#b9c5d8;text-align:center;padding:12px;margin:0}
      @keyframes researchExpand{from{transform:var(--from);opacity:0}to{transform:translate(0,0) scale(1);opacity:1}}
      @keyframes researchCollapse{from{transform:translate(0,0) scale(1);opacity:1}to{transform:var(--from);opacity:0}}
      @keyframes researchBackdrop{from{background:#0000;backdrop-filter:blur(0)}to{background:#000b;backdrop-filter:blur(8px)}}
      @media(prefers-reduced-motion:reduce){.research-lightbox,.lightbox-panel,.research-lightbox.closing,.closing .lightbox-panel{animation:none}}
    `}</style>
  </>;
}
