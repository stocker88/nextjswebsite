import SiteMenu from '../SiteMenu';
import menuStyles from '../../styles/SiteMenu.module.css';
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { trackAppStoreClick } from '../../lib/analytics';
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
  navBasePath = '',
  socialNoticeMode = 'all',
  socialNoticeVariant = 'standard',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    const updateBrowserTheme = (isPageScrolled) => {
      const themeColor = isPageScrolled ? '#080d1b' : '#00a3f5';
      let themeMetas = document.querySelectorAll('meta[name="theme-color"]');

      if (themeMetas.length === 0) {
        const themeMeta = document.createElement('meta');
        themeMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeMeta);
        themeMetas = document.querySelectorAll('meta[name="theme-color"]');
      }

      themeMetas.forEach((themeMeta) => {
        themeMeta.setAttribute('content', themeColor);
      });

      // Newer physical iOS Safari versions may derive browser chrome from
      // the document background rather than honoring a dynamic theme-color.
      document.documentElement.style.backgroundColor = themeColor;
      document.body.style.backgroundColor = themeColor;
    };

    let previousScrolled = null;
    const handleScroll = () => {
      const isPageScrolled = forceDark || window.scrollY > 50;
      if (isPageScrolled === previousScrolled) return;
      previousScrolled = isPageScrolled;
      setIsScrolled(isPageScrolled);
      updateBrowserTheme(isPageScrolled);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
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

  if (socialBrowserName === null) return null;

  const shouldShowSocialNotice = Boolean(socialBrowserName) &&
    (socialNoticeMode === 'all' || socialBrowserName === 'TikTok');

  if (shouldShowSocialNotice) {
    return (
      <>
        <SocialBrowserNotice
          browserName={socialBrowserName}
          variant={socialNoticeVariant}
        />
        <div
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
    <header className={`site-header ${forceDark || isScrolled ? 'is-scrolled' : ''}`}>
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
          <a
            className={menuStyles.download}
            href={getAppStoreUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackHeaderDownload}
          >
            Get the App
          </a>

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
  );
}
