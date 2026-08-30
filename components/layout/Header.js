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

const navItems = [
  { label: 'Reviews', href: '#reviews' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Learn for Free', href: '#watch-and-learn' },
  { label: 'Expertise', href: '#about-aness' },
  { label: 'Download', href: '#download' },
];

export default function Header({
  homeHref = '#home',
  navBasePath = '',
  socialNoticeMode = 'all',
  socialNoticeVariant = 'standard',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [socialBrowserName, setSocialBrowserName] = useState(null);

  useEffect(() => {
    setSocialBrowserName(detectSocialBrowser(navigator.userAgent));
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

    const handleScroll = () => {
      const isPageScrolled = window.scrollY > 50;
      setIsScrolled(isPageScrolled);
      updateBrowserTheme(isPageScrolled);
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <SocialBrowserNotice
        browserName={socialBrowserName}
        variant={socialNoticeVariant}
      />
    );
  }

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <nav className="site-nav" aria-label="Main navigation">
        <a className="site-brand" href={homeHref} onClick={closeMenu}>
          <Image
            src="/assets/images/stockerRobotIcon.png"
            alt="Stocks To Buy Now AI"
            width={38}
            height={38}
            priority
          />
          <span>Stocks To Buy Now AI</span>
        </a>

        {/* Links container (Collapses into dropdown on mobile) */}
        <div className={`nav-content${isOpen ? ' is-open' : ''}`}>
          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item.href} href={`${navBasePath}${item.href}`} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right side actions (Horizontal alignment on mobile) */}
        <div className="nav-actions">
          <a
            className="nav-cta"
            href={getAppStoreUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackHeaderDownload}
          >
            Get the App
          </a>

          <button
            className="nav-toggle"
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={isOpen}
            onClick={() => setIsOpen(!isOpen)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </nav>
    </header>
  );
}
