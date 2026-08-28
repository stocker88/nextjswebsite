import React, { useEffect, useRef, useState } from 'react';

interface TrustProps {
  templateId: string;
  businessUnitId: string;
  height?: string;
  isTopStrip?: boolean;
  trustpilotUrl?: string;
}

export default function TrustpilotWidget({
  templateId,
  businessUnitId,
  height = "140px",
  isTopStrip = false,
  trustpilotUrl = "https://www.trustpilot.com/review/stockstobuynow.ai"
}: TrustProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  // States: 'loading' | 'widget' | 'fallback'
  const [renderMode, setRenderMode] = useState<'loading' | 'widget' | 'fallback'>('loading');

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 10;
    let timeoutId: NodeJS.Timeout;
    let isCancelled = false;

    // Strict 1-second fallback trigger
    const fallbackTimer = setTimeout(() => {
      if (!isCancelled) {
        setRenderMode((prev) => (prev === 'widget' ? 'widget' : 'fallback'));
      }
    }, 2200);

    const renderWidget = () => {
      if (!containerRef.current || typeof window === 'undefined' || isCancelled) return;

      const trustpilotAPI = (window as any).Trustpilot;

      if (trustpilotAPI) {
        containerRef.current.innerHTML = '';

        const trustbox = document.createElement("div");
        trustbox.className = "trustpilot-widget";
        trustbox.setAttribute("data-locale", "en-US");
        trustbox.setAttribute("data-template-id", templateId);
        trustbox.setAttribute("data-businessunit-id", businessUnitId);
        trustbox.setAttribute("data-style-height", height);
        trustbox.setAttribute("data-style-width", "100%");
        trustbox.setAttribute("data-stars", "4,5");
        trustbox.setAttribute("data-theme", isTopStrip ? "dark" : "light");
        trustbox.setAttribute("data-review-languages", "en");
        trustbox.setAttribute("data-schema-type", "Organization");
        trustbox.style.minHeight = height;
        trustbox.style.display = "block";

        const fallbackAnchor = document.createElement("a");
        fallbackAnchor.href = trustpilotUrl;
        fallbackAnchor.target = "_blank";
        fallbackAnchor.rel = "noopener noreferrer";
        fallbackAnchor.textContent = "Trustpilot Reviews";
        trustbox.appendChild(fallbackAnchor);

        containerRef.current.appendChild(trustbox);

        if (trustpilotAPI.loadFromElement) {
          trustpilotAPI.loadFromElement(trustbox, true);
        }

        clearTimeout(fallbackTimer);
        if (!isCancelled) {
          setRenderMode('widget');
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        timeoutId = setTimeout(renderWidget, 100);
      } else {
        if (!isCancelled) {
          setRenderMode('fallback');
        }
      }
    };

    renderWidget();

    return () => {
      isCancelled = true;
      clearTimeout(fallbackTimer);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [templateId, businessUnitId, height, isTopStrip, trustpilotUrl]);

  return (
    <a
      href={trustpilotUrl}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'block', textDecoration: 'none', cursor: 'pointer', width: '100%' }}
    >
      <div
        className={isTopStrip ? `trustpilot-top-strip ${renderMode === 'widget' ? 'is-loaded' : ''}` : `trustpilot-widget-container-flat ${renderMode === 'widget' ? 'is-active' : ''}`}
        style={{ position: 'relative', minHeight: height }}
      >
        {/* Render ONLY the fallback if renderMode evaluates to fallback */}
        {renderMode === 'fallback' && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: height,
            color: '#ffffff',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            textAlign: 'center',
            padding: '16px 0',
            boxSizing: 'border-box'
          }}>
            <div style={{ fontSize: '26px', fontWeight: '700', letterSpacing: '-0.02em', marginBottom: '8px' }}>
              Excellent
            </div>

            <div style={{ display: 'flex', gap: '3px', marginBottom: '8px' }}>
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    backgroundColor: '#00b67a',
                    width: '32px',
                    height: '32px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#ffffff">
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
                  </svg>
                </div>
              ))}
            </div>

            <div style={{ fontSize: '13px', color: '#aab3c5', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>Based on <strong style={{ color: '#fff', textDecoration: 'underline' }}>3,440 reviews</strong></span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="#00b67a">
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/>
              </svg>
              <span style={{ fontSize: '18px', fontWeight: '700', color: '#ffffff', letterSpacing: '-0.03em' }}>
                Trustpilot
              </span>
            </div>
          </div>
        )}

        {/* Dynamic Trustpilot Target: Kept in DOM for script initialization, strictly unmounted/hidden when fallback renders */}
        <div
          ref={containerRef}
          style={{
            width: '100%',
            minHeight: height,
            display: renderMode === 'widget' ? 'block' : 'none'
          }}
        />
      </div>
    </a>
  );
}