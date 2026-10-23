import {useEffect,useState} from 'react';
import {defaultMarketView,type MarketOverviewView} from './default-market-view';

/** Automatic until the visitor explicitly chooses any period or session. */
export function useDefaultMarketView() {
  // Keep static HTML and first hydration identical in every visitor timezone.
  const [automatic,setAutomatic] = useState<MarketOverviewView>('day');
  const [selected,setSelected] = useState<MarketOverviewView|null>(null);
  useEffect(() => {
    if (selected !== null) return;
    let timer: ReturnType<typeof setTimeout>;
    const update = () => {
      clearTimeout(timer);
      if (document.visibilityState === 'hidden') return;
      const now = Date.now();
      setAutomatic(defaultMarketView(now));
      // Clock-only selection check. Market requests keep their existing schedule.
      timer = setTimeout(update,60000-now%60000);
    };
    update();
    document.addEventListener('visibilitychange',update);
    window.addEventListener('focus',update);
    return () => {clearTimeout(timer);document.removeEventListener('visibilitychange',update);window.removeEventListener('focus',update);};
  },[selected]);
  return [selected ?? automatic,setSelected] as const;
}
