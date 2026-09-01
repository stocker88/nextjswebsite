import React from 'react';

const outlets = [
  {
    name: 'Reuters',
    className: 'reuters',
    href: 'https://www.reuters.com/press-releases/stocks-to-buy-now-event-driven-options-trading-framework-2026-08-31/',
  },
  { name: 'Bloomberg', className: 'bloomberg' ,href: 'https://www.reuters.com/press-releases/stocks-to-buy-now-event-driven-options-trading-framework-2026-08-31/',},
  { name: 'Forbes', className: 'forbes',href: 'https://www.reuters.com/press-releases/stocks-to-buy-now-event-driven-options-trading-framework-2026-08-31/', },
  { name: 'The New York Times', className: 'new-york-times' ,href: 'https://www.reuters.com/press-releases/stocks-to-buy-now-event-driven-options-trading-framework-2026-08-31/',},
];

const FeaturedMedia = () => (
  <section className="featured-media" aria-labelledby="featured-media-title">
    <h2 id="featured-media-title" className="featured-media-title">
      Featured in the media
    </h2>

    <div className="featured-media-outlets">
      {outlets.map((outlet) => {
        const content = (
          <>
            {outlet.className === 'reuters' && <span className="reuters-mark" aria-hidden="true" />}
            <span>{outlet.name}</span>

          </>
        );

        return outlet.href ? (
          <a
            key={outlet.name}
            className={`media-outlet ${outlet.className} media-outlet-link`}
            href={outlet.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Read Stocks To Buy Now AI coverage on ${outlet.name}`}
          >
            {content}
          </a>
        ) : (
          <span key={outlet.name} className={`media-outlet ${outlet.className}`}>
            {content}
          </span>
        );
      })}

      <span className="media-outlet more-outlets">and more</span>
    </div>

    <style jsx>{`
      .featured-media {
        width: 100%;
        margin: 0;
        padding: clamp(42px, 6vw, 72px) max(18px, calc((100% - 920px) / 2));
        background:
          radial-gradient(circle at 20% 20%, rgba(22, 131, 255, 0.13), transparent 36%),
          #070b18;
      }

      .featured-media-title {
        margin: 0 0 clamp(18px, 2.5vw, 26px);
        color: #4da3ff;
        font-size: clamp(13px, 1.4vw, 16px);
        font-weight: 800;
        letter-spacing: 0.18em;
        line-height: 1.2;
        text-align: center;
        text-transform: uppercase;
      }

      .featured-media-outlets {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-wrap: wrap;
        gap: 18px clamp(24px, 4vw, 52px);
      }

      .media-outlet {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 32px;
        color: rgba(255, 255, 255, 0.84);
        line-height: 1;
        white-space: nowrap;
      }

      .media-outlet-link {
        text-decoration: none;
        transition: color 160ms ease, transform 160ms ease;
      }

      .media-outlet-link:hover,
      .media-outlet-link:focus-visible {
        color: #fff;
        transform: translateY(-2px);
      }

      .media-outlet-link:focus-visible {
        border-radius: 4px;
        outline: 2px solid rgba(255, 255, 255, 0.9);
        outline-offset: 6px;
      }

      .reuters {
        gap: 8px;
        font-family: Arial, Helvetica, sans-serif;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: -0.04em;
      }

      .reuters-mark {
        width: 15px;
        height: 15px;
        border: 3px dotted #ff8000;
        border-radius: 50%;
      }

      .external-arrow {
        margin-left: 3px;
        color: rgba(255, 255, 255, 0.58);
        font-family: Arial, Helvetica, sans-serif;
        font-size: 13px;
      }

      .bloomberg {
        font-family: Arial, Helvetica, sans-serif;
        font-size: 20px;
        font-weight: 700;
        letter-spacing: -0.045em;
      }

      .forbes {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 23px;
        font-weight: 700;
        letter-spacing: -0.045em;
      }

      .new-york-times {
        font-family: Georgia, 'Times New Roman', serif;
        font-size: 19px;
        font-weight: 700;
        letter-spacing: -0.025em;
      }

      .more-outlets {
        color: rgba(255, 255, 255, 0.55);
        font-size: 14px;
        font-weight: 600;
      }

      @media (max-width: 640px) {
        .featured-media {
          padding: 42px 24px 48px;
        }

        .featured-media-outlets {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px 12px;
        }

        .reuters,
        .forbes {
          font-size: 19px;
        }

        .bloomberg,
        .new-york-times {
          font-size: 16px;
        }

        .more-outlets {
          grid-column: 1 / -1;
          min-height: 20px;
        }
      }
    `}</style>
  </section>
);

export default FeaturedMedia;
