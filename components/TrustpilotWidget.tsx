import React, { useEffect, useRef, useState } from 'react';

interface TrustProps {
  templateId: string;
  businessUnitId: string;
  height?: string;
  isTopStrip?: boolean;
}

export default function TrustpilotWidget({
  templateId,
  businessUnitId,
  height = "140px",
  isTopStrip = false
}: TrustProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;

    const loadWidget = () => {
      if (window.Trustpilot) {
        if (containerRef.current) {
          window.Trustpilot.loadFromElement(containerRef.current);
          setTimeout(() => setIsLoaded(true), 50);
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        setTimeout(loadWidget, 100);
      }
    };

    loadWidget();
  }, []);

  // Switches class namespaces cleanly to target the appropriate CSS rules
  const containerClassName = isTopStrip
    ? `trustpilot-top-strip ${isLoaded ? 'is-loaded' : ''}`
    : `trustpilot-widget-container-flat ${isLoaded ? 'is-active' : ''}`;

  return (
    <div className={containerClassName}>
      <div
        ref={containerRef}
        className="trustpilot-widget"
        data-locale="en-US"
        data-template-id={templateId}
        data-businessunit-id={businessUnitId}
        data-style-height={height}
        data-style-width="100%"
        data-stars="4,5"
        data-theme={"dark"}
        data-review-languages="en"
        data-schema-type="Organization"
      >
        <a
          href="https://trustpilot.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot
        </a>
      </div>
    </div>
  );
}
