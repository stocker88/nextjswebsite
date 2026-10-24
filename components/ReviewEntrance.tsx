import {ReactNode, useEffect, useRef} from 'react';
import styles from '../styles/ReviewEntrance.module.css';

/** Scroll-driven reviews, with an unpinned reveal when the viewport is short. */
export default function ReviewEntrance({children}: {children: ReactNode}) {
  const root = useRef<HTMLElement>(null);
  const viewport = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const element = root.current;
    const measure = viewport.current;
    if (!element || !measure) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
    // Full-height sticky scenes touch Safari's bottom edge and cause it to
    // extend a solid color behind the toolbar. Keep the animated flow layout
    // on iOS so ordinary page content can scroll beneath the browser controls.
    const useFlowLayout = CSS.supports('-webkit-touch-callout', 'none');
    const stage = element.querySelector<HTMLElement>(`.${styles.stage}`)!;
    let frame = 0;
    let visible = false;
    const clamp = (value: number) => Math.max(0, Math.min(1, value));
    // offsetTop is unaffected by our transforms, so the reveal cannot feed
    // back into its own scroll measurements.
    const flowProgress = (selector: string, top: number, height: number) => {
      let node = element.querySelector<HTMLElement>(selector);
      if (!node) return 1;
      let offset = 0;
      while (node && node !== element) {
        offset += node.offsetTop;
        node = node.offsetParent as HTMLElement | null;
      }
      return clamp((height * .95 - top - offset) / (height * .55));
    };
    const draw = () => {
      frame = 0;
      const rect = element.getBoundingClientRect();
      // svh is stable when Safari's address bar expands/collapses.
      const height = measure.offsetHeight || window.innerHeight;
      const compact = useFlowLayout || height <= 650;
      element.dataset.layout = compact ? 'flow' : 'pinned';
      const header = window.innerWidth < 1000 ? 68 : 80;
      const p = compact
        ? flowProgress('[data-review-top]', rect.top, height)
        : clamp((header - rect.top) / Math.max(1, element.offsetHeight - stage.offsetHeight));
      const halo = document.querySelector('.hero-atmosphere i:last-child')?.getBoundingClientRect();
      if (halo) {
        element.style.setProperty('--halo-x', `${halo.left - rect.left}px`);
        element.style.setProperty('--halo-y', `${halo.top - rect.top}px`);
        element.style.setProperty('--halo-w', `${halo.width}px`);
        element.style.setProperty('--halo-h', `${halo.height}px`);
      }
      const set = (name: string, value: number) => element.style.setProperty(name, String(value));
      set('--reviews-progress', p);
      set('--review-panel', compact ? p : clamp(.12 + p / .75));
      set('--review-top', compact ? p : clamp(.12 + p / .35));
      set('--review-heading', compact ? flowProgress('.review-sources__heading', rect.top, height) : clamp((p - .25) / .4));
      set('--review-cards', compact ? flowProgress('.review-sources__grid', rect.top, height) : clamp((p - .25) / .4));
      set('--review-bottom', compact ? flowProgress('[data-review-bottom]', rect.top, height) : clamp((p - .55) / .3));
    };
    const schedule = () => {
      if (visible && !reduced.matches && !frame) frame = requestAnimationFrame(draw);
    };
    const setup = () => {
      cancelAnimationFrame(frame);
      frame = 0;
      if (reduced.matches) {
        delete element.dataset.enhanced;
        delete element.dataset.layout;
        element.removeAttribute('style');
      } else {
        element.dataset.enhanced = 'true';
        draw();
      }
    };
    const observer = new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      schedule();
    }, {rootMargin: '100px 0px'});
    const resize = new ResizeObserver(schedule);
    setup();
    observer.observe(element);
    resize.observe(measure);
    resize.observe(stage);
    window.addEventListener('scroll', schedule, {passive: true});
    window.addEventListener('resize', schedule);
    reduced.addEventListener('change', setup);
    return () => {
      observer.disconnect();
      resize.disconnect();
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      reduced.removeEventListener('change', setup);
    };
  }, []);
  return <section ref={root} className={styles.entrance} aria-label="Investor reviews">
    <div ref={viewport} className={styles.viewportMeasure} aria-hidden="true" />
    <div className={styles.gradientTail} aria-hidden="true"><i /></div>
    <div className={styles.stage}>
      <div className={styles.darkPanel} aria-hidden="true" />
      <div className={styles.reviews}>{children}</div>
    </div>
  </section>;
}
