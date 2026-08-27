import React, { useState } from 'react';
import Image from 'next/image';

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
  { label: 'About Aness', href: '#about-aness' },
  { label: 'Reviews', href: '#reviews' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Watch & Learn', href: '#watch-and-learn' },
  { label: 'Download', href: '#download' },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => setIsOpen(false);

  return (
    <header className="site-header">
      <nav className="site-nav" aria-label="Main navigation">
        <a className="site-brand" href="#home" onClick={closeMenu}>
          <Image
            src="/assets/images/stockerRobotIcon.png"
            alt="Stocks To Buy Now AI"
            width={38}
            height={38}
            priority
          />
          <span>Stocks To Buy Now AI</span>
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

        <div className={`nav-content${isOpen ? ' is-open' : ''}`}>
          <div className="nav-links">
            {navItems.map((item) => (
              <a key={item.href} href={item.href} onClick={closeMenu}>
                {item.label}
              </a>
            ))}
          </div>

          <a
            className="nav-cta"
            href={getAppStoreUrl()}
            target="_blank"
            rel="noopener noreferrer"
            onClick={closeMenu}
          >
            Get the App
          </a>
        </div>
      </nav>
    </header>
  );
}
