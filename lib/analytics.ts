import { captureAcquisition, acquisitionCampaign } from './acquisition';
import ReactGA from 'react-ga4';

export const GA_MEASUREMENT_ID = 'G-JPXMZYD5DY';
export const SITE_VERSION =
  process.env.NEXT_PUBLIC_SITE_VERSION || '2026-08-29-baseline';

// Handoff secrets are used only to link a visit to the app, never analytics.
export function safeAnalyticsUrl(raw: string): string {
  try {
    const url = new URL(raw, 'https://www.stockstobuynow.ai');
    url.searchParams.delete('web_visit'); url.searchParams.delete('web_token');
    if (url.searchParams.has('referrer')) {
      const referrer = new URLSearchParams(url.searchParams.get('referrer') || '');
      referrer.delete('web_visit'); referrer.delete('web_token');
      if (referrer.toString()) url.searchParams.set('referrer', referrer.toString());
      else url.searchParams.delete('referrer');
    }
    return raw.startsWith('/') ? url.pathname + url.search + url.hash : url.toString();
  } catch (_) { return ''; }
}
let initialized = false;

export function initializeAnalytics() {
  if (initialized || typeof window === 'undefined') return;

  ReactGA.initialize(GA_MEASUREMENT_ID, {
    gtagOptions: { send_page_view: false },
  });
  ReactGA.set({ site_version: SITE_VERSION });
  initialized = true;
}

export function trackPageView(path: string) {
  initializeAnalytics();
  ReactGA.send({
    hitType: 'pageview',
    page: safeAnalyticsUrl(path),
    site_version: SITE_VERSION,
  });
}

type AppStoreClick = {
  store: 'apple' | 'google';
  placement: string;
  linkUrl: string;
};

export function trackAppStoreClick({
  store,
  placement,
  linkUrl,
}: AppStoreClick) {
  // Explicit CTA handlers and the global anchor listener share this guard.
  const key=store;
  if(lastStoreClick?.key===key&&Date.now()-lastStoreClick.at<500)return;
  lastStoreClick={key,at:Date.now()};
  captureAcquisition({}, store);
  initializeAnalytics();
  ReactGA.event('app_store_click', {
    store,
    placement,
    link_url: safeAnalyticsUrl(linkUrl),
    landing_page: typeof window !== 'undefined' ? window.location.pathname : '',
    landing_referrer: typeof document !== 'undefined' ? safeAnalyticsUrl(document.referrer) : '',
    ...acquisitionCampaign(),
    site_version: SITE_VERSION,
  });
}

let lastStoreClick:{key:string;at:number}|null=null;
export function trackAuthentication(method:string,isNewUser:boolean) {
  try {
    initializeAnalytics();
    ReactGA.event(isNewUser?'sign_up':'login',{method,...acquisitionCampaign(),site_version:SITE_VERSION});
  } catch { /* Measurement must never turn a successful sign-in into an error. */ }
}
export function appDownloadStore(raw:string):'apple'|'google'|null {
  try {
    const url=new URL(raw);
    if(url.searchParams.has('action'))return null;
    if(url.hostname==='apps.apple.com'&&/\/id1565527320\/?$/.test(url.pathname))return 'apple';
    if(url.hostname==='play.google.com'&&url.pathname==='/store/apps/details'&&url.searchParams.get('id')==='com.newcompany.stocker'&&!url.searchParams.has('showAllReviews'))return 'google';
  }catch{}
  return null;
}
export function installAppDownloadTracking() {
  const click=(event:Event)=>{
    if(event.type==='auxclick'&&(event as MouseEvent).button!==1)return;
    const anchor=event.target instanceof Element?event.target.closest('a'):null;
    if(!(anchor instanceof HTMLAnchorElement))return;
    // Wait for React/desktop routing to decide whether this really leaves for a store.
    queueMicrotask(()=>{
      if(event.defaultPrevented)return;
      const store=appDownloadStore(anchor.href);
      if(!store)return;
      try {trackAppStoreClick({store,placement:anchor.dataset.analyticsPlacement||'site_link',linkUrl:anchor.href});}catch{}
    });
  };
  document.addEventListener('click',click,true);
  document.addEventListener('auxclick',click,true);
  return()=>{document.removeEventListener('click',click,true);document.removeEventListener('auxclick',click,true);};
}
