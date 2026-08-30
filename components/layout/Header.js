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
  { label: 'Watch & Learn', href: '#watch-and-learn' },
  { label: 'Expertise', href: '#about-aness' },
  { label: 'Download', href: '#download' },
];

export default function Header({ homeHref = '#home', navBasePath = '' }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSocialBrowser, setIsSocialBrowser] = useState(null);

  useEffect(() => {
    setIsSocialBrowser(Boolean(detectSocialBrowser(navigator.userAgent)));
  }, []);

  useEffect(() => {
    const updateBrowserTheme = (isPageScrolled) => {
      let themeMeta = document.querySelector('meta[name="theme-color"]');

      if (!themeMeta) {
        themeMeta = document.createElement('meta');
        themeMeta.setAttribute('name', 'theme-color');
        document.head.appendChild(themeMeta);
      }

      themeMeta.setAttribute(
        'content',
        isPageScrolled ? '#080d1b' : '#00a3f5',
      );
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

  if (isSocialBrowser === null) return null;

  if (isSocialBrowser) {
    return <SocialBrowserNotice />;
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
