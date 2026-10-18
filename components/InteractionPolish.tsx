import {useEffect, useRef} from 'react';
import {useRouter} from 'next/router';

type Transition = {finished: Promise<void>; skipTransition: () => void};
type TransitionDocument = Document & {startViewTransition?: (update: () => Promise<void>) => Transition};

/** Pointer lighting is delegated; only the card under the cursor is updated. */
export default function InteractionPolish() {
  const router = useRouter();
  const routerRef = useRef(router);
  routerRef.current = router;
  useEffect(() => {
    const reduced = matchMedia('(prefers-reduced-motion: reduce)');
    const fine = matchMedia('(hover: hover) and (pointer: fine)');
    let card: HTMLElement | null = null, frame = 0, px = 0, py = 0;
    let active: Transition | null = null;
    const reset = () => {card?.removeAttribute('data-lit'); card = null; cancelAnimationFrame(frame); frame = 0;};
    const move = (event: PointerEvent) => {
      if (reduced.matches || !fine.matches) return;
      const next = event.target instanceof Element ? event.target.closest<HTMLElement>('[data-depth-card]') : null;
      if (next !== card) {reset(); card = next;}
      if (!card) return;
      px = event.clientX; py = event.clientY;
      if (!frame) frame = requestAnimationFrame(() => {
        frame = 0;
        if (!card) return;
        const rect = card.getBoundingClientRect();
        card.style.setProperty('--light-x', `${px - rect.left}px`);
        card.style.setProperty('--light-y', `${py - rect.top}px`);
        card.dataset.lit = 'true';
      });
    };
    const clearNames = () => document.querySelectorAll<HTMLElement>('[data-stock-symbol]').forEach(el => el.style.removeProperty('view-transition-name'));
    const click = (event: MouseEvent) => {
      const doc = document as TransitionDocument;
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey || reduced.matches || !doc.startViewTransition || active) return;
      const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[data-stock-link]') : null;
      const source = link?.querySelector<HTMLElement>('[data-stock-symbol]');
      if (!link || !source || link.hasAttribute('download') || (link.target && link.target !== '_self') || link.origin !== location.origin || link.pathname === location.pathname) return;
      event.preventDefault(); // Next Link also observes this and avoids a second navigation.
      const symbol = source.dataset.stockSymbol;
      clearNames();
      source.style.setProperty('view-transition-name', 'stock-identity');
      let timer = 0;
      const transition = doc.startViewTransition(async () => {
        try {
          await routerRef.current.push(link.pathname + link.search + link.hash);
          await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
          clearNames();
          const target = Array.from(document.querySelectorAll<HTMLElement>('h1 [data-stock-symbol]')).find(el => el.dataset.stockSymbol === symbol);
          target?.style.setProperty('view-transition-name', 'stock-identity');
        } catch { clearNames(); }
      });
      active = transition;
      // Do not hold an old screen indefinitely while a slow route loads.
      timer = window.setTimeout(() => transition.skipTransition(), 1400);
      transition.finished.catch(() => {}).finally(() => {clearTimeout(timer); clearNames(); if (active === transition) active = null;});
    };
    const preference = () => {reset(); if (reduced.matches) active?.skipTransition();};
    document.addEventListener('pointermove', move, {passive:true});
    document.addEventListener('pointerleave', reset);
    window.addEventListener('scroll', reset, {passive:true});
    document.addEventListener('click', click, true);
    reduced.addEventListener('change', preference);
    fine.addEventListener('change', reset);
    return () => {
      reset(); active?.skipTransition(); clearNames();
      document.removeEventListener('pointermove', move);
      document.removeEventListener('pointerleave', reset);
      window.removeEventListener('scroll', reset);
      document.removeEventListener('click', click, true);
      reduced.removeEventListener('change', preference);
      fine.removeEventListener('change', reset);
    };
  }, []);
  return null;
}
