import SiteMenu from '../SiteMenu';
import menuStyles from '../../styles/SiteMenu.module.css';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Head from 'next/head';
import { trackAppStoreClick } from '../../lib/analytics';
import { usesLegacySafariChrome } from '../../lib/safari-chrome';
import SocialBrowserNotice, { detectSocialBrowser } from '../SocialBrowserNotice';

const iosAppStoreUrl =
  'https://apps.apple.com/us/app/stocks-to-buy-now-ai-signals/id1565527320';

const androidPlayStoreUrl =
  'https://play.google.com/store/apps/details?id=com.newcompany.stocker';

const getAppStoreUrl = () => {
  if (typeof window === 'undefined') return iosAppStoreUrl;
  const isAndroid = /Android/i.test(navigator.userAgent);
  return isAndroid ? androidPlayStoreUrl : iosAppStoreUrl;
};



export default function Header({
  homeHref = '/',
  forceDark = false,
  hideAppDownload = false,
  navBasePath = '',
  socialNoticeMode = 'all',
  socialNoticeVariant = 'standard',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [chromeColor, setChromeColor] = useState(forceDark ? '#080d1b' : '#00a3f5');
  const [bannerColors, setBannerColors] = useState({ top: '#00a3f5', bottom: '#00a3f5' });
  const [socialBrowserName, setSocialBrowserName] = useState(null);

  useEffect(() => {
    const detect = () => {
      let attribution = '';
      try { attribution = sessionStorage.getItem('socialBrowserAttribution') || ''; } catch { /* Storage may be unavailable in embedded browsers. */ }
      setSocialBrowserName(
        detectSocialBrowser(
          navigator.userAgent,
          document.referrer,
          window.location.href,
          attribution,
        ),
      );
    };

    detect();
    window.addEventListener('social-browser-attribution', detect);
    return () =>
      window.removeEventListener('social-browser-attribution', detect);
  }, []);

  useEffect(() => {
    let frame = 0;
    const legacySafari = usesLegacySafariChrome(navigator.userAgent, navigator.maxTouchPoints);
    const canvas = document.documentElement;
    const previousLegacyMode = canvas.getAttribute('data-legacy-safari-chrome');
    const previousLegacyColor = canvas.style.getPropertyValue('--legacy-safari-color');
    let ownsLegacyCanvas = false;
    const update = () => {
      frame = 0;
      const y = Math.max(0, window.scrollY);
      setIsScrolled(y > 0);
      if (y === 0) setIsOpen(false);
      // Match the continuous hero gradient, including the mobile status strip.
      // Keep the initial reveal blue; ease toward navy near the end of the hero.
      const hero = document.getElementById('home');
      const heroHeight = hero?.getBoundingClientRect().height || 1;
      const headerHeight = document.querySelector('.site-header')?.getBoundingClientRect().height || 80;
      const progress = Math.min(1, y / heroHeight);
      const fade = Math.max(0, Math.min(1, (progress - .55) / .45));
      const darkness = fade * fade * (3 - 2 * fade);
      const colorAt = offset => {
        if (forceDark || !hero) return '#080d1b';
        const fraction = Math.min(1, (y + offset) / heroHeight);
        return '#' + [0, 163, 245].map((start, i) => {
          const heroChannel = start + ([21, 0, 128][i] - start) * fraction;
          return Math.round(heroChannel * (1 - darkness) + [8, 13, 27][i] * darkness)
            .toString(16).padStart(2, '0');
        }).join('');
      };
      const themeColor = colorAt(0);
      setBannerColors({ top: themeColor, bottom: colorAt(headerHeight) });
      setChromeColor(themeColor);
      // Older Safari needs a painted document canvas for its bottom toolbar.
      // Scope it to the homepage and never set this on Safari 26's glass UI.
      if (legacySafari && hero && !forceDark) {
        canvas.setAttribute('data-legacy-safari-chrome', 'true');
        canvas.style.setProperty('--legacy-safari-color', themeColor);
        ownsLegacyCanvas = true;
      }
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(update); };
    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      if (ownsLegacyCanvas) {
        if (previousLegacyMode === null) canvas.removeAttribute('data-legacy-safari-chrome');
        else canvas.setAttribute('data-legacy-safari-chrome', previousLegacyMode);
        if (previousLegacyColor) canvas.style.setProperty('--legacy-safari-color', previousLegacyColor);
        else canvas.style.removeProperty('--legacy-safari-color');
      }
    };
  }, [forceDark]);

  const closeMenu = () => setIsOpen(false);

  const trackHeaderDownload = () => {
    const linkUrl = getAppStoreUrl();
    trackAppStoreClick({
      store: /Android/i.test(navigator.userAgent) ? 'google' : 'apple',
      placement: 'header',
      linkUrl,
    });
    closeMenu();
  };

  const browserTheme = (
    <Head>
      <meta key="viewport" name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
      {/* Older Safari uses this for the status bar; Safari 26 samples the
          independent top edge. Keep both tied to the same scroll tint. */}
      <meta key="theme-color" name="theme-color" content={chromeColor} />
    </Head>
  );

  // Render the normal header during SSR and browser detection so its sticky
  // footprint is present from the first paint and cannot push the hero down.

  const shouldShowSocialNotice = Boolean(socialBrowserName) &&
    (socialNoticeMode === 'all' || socialBrowserName === 'TikTok');

  if (shouldShowSocialNotice) {
    return (
      <>
        {browserTheme}
        <SocialBrowserNotice
          browserName={socialBrowserName}
          variant={socialNoticeVariant}
        />
        <div
          className="social-browser-notice-spacer"
          aria-hidden="true"
          style={{
            height: socialNoticeVariant === 'insight'
              ? 'clamp(160px, 20vw, 190px)'
              : 'clamp(150px, 18vw, 180px)',
          }}
        />
      </>
    );
  }

  return (
    <>
      {browserTheme}
      <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`} style={{'--header-top-color': bannerColors.top + 'b3', '--header-bottom-color': bannerColors.bottom + 'b3', '--header-edge-color': chromeColor}}>
        <span className="site-header-edge" aria-hidden="true" />
        <nav className={menuStyles.nav} aria-label="Main navigation">
          <a className={menuStyles.brand} href={homeHref} onClick={closeMenu}>
            <Image
              src="/assets/images/stockerRobotIcon.png"
              alt="Stocks To Buy Now AI"
              width={38}
              height={38}
              priority
            />
            <span>Stocks To Buy Now AI</span>
          </a>

          <SiteMenu isOpen={isOpen} onClose={closeMenu} navBasePath={navBasePath} />

          {/* Right side actions (Horizontal alignment on mobile) */}
          <div className={menuStyles.actions}>
            {!hideAppDownload && <a
              className={menuStyles.download}
              href={getAppStoreUrl()}
              target="_blank"
              rel="noopener noreferrer"
              onClick={trackHeaderDownload}
            >
              Get the App
            </a>}

            <button
              className={menuStyles.toggle}
              type="button"
              aria-label="Toggle navigation"
              aria-expanded={isOpen}
              aria-controls="site-navigation-links"
              onClick={() => setIsOpen(!isOpen)}
            >
              <b>{isOpen ? 'Close' : 'Explore'}</b>
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true"><path d={isOpen ? 'm5 5 10 10 M15 5 5 15' : 'M3 6h14 M3 14h14'} /></svg>
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}
