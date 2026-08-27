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
    const maxAttempts = 30;

    const forceMobileRender = () => {
      // 1. Double check if the third-party window object downloaded successfully
      if (window.Trustpilot) {
        if (containerRef.current) {
          /*
            2. CRITICAL MOBILE FIX: Force an explicit document context reload targeting
               the active container ref element to wake up the WebKit layout engine.
          */
          window.Trustpilot.loadFromElement(containerRef.current);

          // Smoothly toggle container visibility flags after a layout paint break
          setTimeout(() => setIsLoaded(true), 100);
        }
      } else if (attempts < maxAttempts) {
        attempts++;
        // 3. Retry on the macro-task execution queue if the network loop is slow
        setTimeout(forceMobileRender, 150);
      }
    };

    // Run the parser loop after the component mounts
    forceMobileRender();
  }, [templateId, businessUnitId]);

  // Determine structural style assignments
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
          href="https://www.trustpilot.com/review/stockstobuynow.ai"
          target="_blank"
          rel="noopener noreferrer"
        >
          Trustpilot Reviews
        </a>
      </div>
    </div>
  );
}
