import { useEffect } from 'react';

/** Progressive enhancement: content stays visible without JavaScript or motion support. */
export default function HomeMotion() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>('[data-home-motion]');
    if (!root || !('IntersectionObserver' in window)) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    const desktop = window.matchMedia('(min-width: 900px) and (pointer: fine)');
    let dispose = () => {};

    const setup = () => {
      dispose();
      if (reduced.matches) return;
      const reveals = Array.from(root.querySelectorAll<HTMLElement>('[data-motion-reveal]'));
      const enter = (element: HTMLElement) => { element.dataset.motionState = 'entered'; };
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return;
          enter(entry.target as HTMLElement);
          observer.unobserve(entry.target);
        });
      }, { rootMargin: '0px 0px -24px 0px', threshold: 0 });
      reveals.forEach(element => {
        // Never hide a restored scroll position, anchor destination or focused control.
        if (element.getBoundingClientRect().top < window.innerHeight || element.contains(document.activeElement)) {
          enter(element);
        } else {
          element.dataset.motionState = 'waiting';
          observer.observe(element);
        }
      });
      const focus = (event: FocusEvent) => {
        if (!(event.target instanceof Element)) return;
        const target = event.target.closest<HTMLElement>('[data-motion-reveal]');
        if (target) { enter(target); observer.unobserve(target); }
      };
      root.addEventListener('focusin', focus);

      // Only decorative artwork moves with scrolling; never the data or its controls.
      const layers = desktop.matches ? Array.from(root.querySelectorAll<HTMLElement>('[data-motion-depth]')) : [];
      const visible = new Set<HTMLElement>();
      let frame = 0;
      const draw = () => {
        frame = 0;
        if (document.hidden) return;
        const updates = Array.from(visible).map(element => {
          const rect = element.getBoundingClientRect();
          const progress = Math.max(-1, Math.min(1, (window.innerHeight / 2 - (rect.top + rect.height / 2)) / window.innerHeight));
          const distance = Math.min(28, Number(element.dataset.motionDepth) || 0);
          return { element, offset: progress * distance };
        });
        updates.forEach(({element, offset}) => element.style.setProperty('--motion-depth', `${offset.toFixed(2)}px`));
      };
      const schedule = () => { if (!frame && !document.hidden && visible.size) frame = requestAnimationFrame(draw); };
      const depthObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) visible.add(entry.target as HTMLElement);
          else visible.delete(entry.target as HTMLElement);
        });
        schedule();
      }, { rootMargin: '80px' });
      layers.forEach(element => depthObserver.observe(element));
      if (layers.length) {
        window.addEventListener('scroll', schedule, { passive: true });
        window.addEventListener('resize', schedule);
        document.addEventListener('visibilitychange', schedule);
      }
      dispose = () => {
        observer.disconnect();
        depthObserver.disconnect();
        cancelAnimationFrame(frame);
        root.removeEventListener('focusin', focus);
        window.removeEventListener('scroll', schedule);
        window.removeEventListener('resize', schedule);
        document.removeEventListener('visibilitychange', schedule);
        reveals.forEach(element => delete element.dataset.motionState);
        layers.forEach(element => element.style.removeProperty('--motion-depth'));
      };
    };
    setup();
    reduced.addEventListener('change', setup);
    desktop.addEventListener('change', setup);
    return () => {
      dispose();
      reduced.removeEventListener('change', setup);
      desktop.removeEventListener('change', setup);
    };
  }, []);
  return null;
}
