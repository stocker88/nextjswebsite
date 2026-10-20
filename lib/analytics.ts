import { captureAcquisition } from './acquisition';
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
  captureAcquisition({}, store);
  initializeAnalytics();
  ReactGA.event('app_store_click', {
    store,
    placement,
    link_url: safeAnalyticsUrl(linkUrl),
    landing_page: typeof window !== 'undefined' ? window.location.pathname : '',
    landing_referrer: typeof document !== 'undefined' ? document.referrer : '',
    utm_source: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_source') || '' : '',
    utm_medium: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_medium') || '' : '',
    utm_campaign: typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('utm_campaign') || '' : '',
    site_version: SITE_VERSION,
  });
}
