import React from 'react';
import Image from 'next/image';

const credentials = [
  { value: '$4B', label: 'Managed' },
  { value: '20+', label: 'Years in market research' },
  { value: '1M+', label: 'Followers' },
];

const expertise = [
  'Trading & Risk',
  'Statistics & AI',
  'Macroeconomics',
  'Software Engineering',
];

const Testimonial = () => {
  return (
    <section className="founder-section" aria-labelledby="founder-title">
      <div className="founder-shell">
        <div className="founder-portrait-wrap">
          <Image
            className="founder-portrait"
            src="/assets/images/aness.jpg"
            alt="Aness Hussein Ali, founder of Stocks To Buy Now AI"
            width={520}
            height={520}
            sizes="(max-width: 900px) 82vw, 420px"
          />
          <div className="founder-portrait-caption">
            <span className="founder-status" />
            Founder of Stocks To Buy Now AI
          </div>
        </div>

        <div className="founder-copy">
          <p className="founder-eyebrow">Built by market expertise</p>
          <h2 id="founder-title">$4 Billion Managed</h2>
          <p className="founder-role">
            Statistician, economist, trader, data scientist and software engineer.
          </p>

          <p className="founder-description">
            Aness combines institutional-market experience with statistics,
            economics and technology to make sophisticated investing research
            clearer and more practical. His background includes financial
            engineering at UC Berkeley Haas, advanced studies in statistics and
            finance, and experience across trading, asset management and risk.
          </p>

          <div className="founder-metrics" aria-label="Professional highlights">
            {credentials.map((credential) => (
              <div className="founder-metric" key={credential.label}>
                <strong>{credential.value}</strong>
                <span>{credential.label}</span>
              </div>
            ))}
          </div>

          <div className="founder-expertise" aria-label="Areas of expertise">
            {expertise.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>

          <div className="founder-actions">
            <a
              className="founder-primary-link"
              href="https://www.linkedin.com/in/anesshusseinali/"
              target="_blank"
              rel="noopener noreferrer"
            >
              View LinkedIn profile
              <span aria-hidden="true">↗</span>
            </a>
            <a
              className="founder-secondary-link"
              href="https://anesshusseinali.com/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit personal website
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonial;
