import ReactGA from 'react-ga4';

export const GA_MEASUREMENT_ID = 'G-JPXMZYD5DY';
export const SITE_VERSION =
  process.env.NEXT_PUBLIC_SITE_VERSION || '2026-08-29-baseline';

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
    page: path,
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
  initializeAnalytics();
  ReactGA.event('app_store_click', {
    store,
    placement,
    link_url: linkUrl,
    site_version: SITE_VERSION,
  });
}
