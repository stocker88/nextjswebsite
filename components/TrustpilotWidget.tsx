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

    const renderWidget = () => {
      if (!containerRef.current || typeof window === 'undefined') return;

      const trustpilotAPI = (window as any).Trustpilot;

      if (trustpilotAPI) {
        // 1. Flush stale DOM inner nodes to prevent duplicate widget blocks on route changes
        containerRef.current.innerHTML = '';

        // 2. Programmatically create the widget container
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

        // 3. Attach fallback anchor context layout
        const fallbackAnchor = document.createElement("a");
        fallbackAnchor.href = "https://trustpilot.com";
        fallbackAnchor.target = "_blank";
        fallbackAnchor.rel = "noopener noreferrer";
        fallbackAnchor.textContent = "Trustpilot Reviews";
        trustbox.appendChild(fallbackAnchor);

        // 4. Inject it into the reactive reference target
        containerRef.current.appendChild(trustbox);

        // 5. SPA Fix: Force Trustpilot to compile the programmatically injected node element
        if (trustpilotAPI.loadFromElement) {
          // True flag parameter forces a deep iframe cache override pass on mobile engines
          trustpilotAPI.loadFromElement(trustbox, true);
        }

        // Toggle visibility state flags safely after layout paint execution
        setTimeout(() => setIsLoaded(true), 100);
      } else if (attempts < maxAttempts) {
        attempts++;
        // Retry execution macro-task loop step if network script is parsing
        setTimeout(renderWidget, 150);
      }
    };

    renderWidget();
  }, [templateId, businessUnitId, height, isTopStrip]); // Perfectly updates if props change dynamically

  const containerClassName = isTopStrip
    ? `trustpilot-top-strip ${isLoaded ? 'is-loaded' : ''}`
    : `trustpilot-widget-container-flat ${isLoaded ? 'is-active' : ''}`;

  return (
    <div className={containerClassName}>
      {/*
        This empty wrapper is preserved across page renders.
        The useEffect completely wipes its internals and reconstructs the widget layout
        cleanly every single time the route updates on iPhone.
      */}
      <div ref={containerRef} style={{ width: '100%', minHeight: height }} />
    </div>
  );
}
