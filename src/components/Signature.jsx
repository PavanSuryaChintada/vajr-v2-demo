import React, { useEffect, useRef } from 'react';

const Signature = () => {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            section.classList.add('sig-visible');
          }
        });
      },
      { threshold: 0.15 }
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="signature" className="sig-section" ref={sectionRef} aria-label="Signature Collection">
      {/* Background Image */}
      <div className="sig-bg">
        <img src="/diamond_rings.png" alt="Brilliant Cuts" className="sig-bg-img" />
        <div className="sig-overlay"></div>
      </div>

      {/* Content */}
      <div className="sig-content">
        <p className="sig-eyebrow">The Vault</p>
        <h2 className="sig-title">Brilliant<br /><span className="sig-title-light">Cuts</span></h2>
        <p className="sig-desc">
          Our rarest diamonds. Certified conflict-free, cut to mathematical perfection,
          and set in platinum by artisans sworn to excellence.
        </p>
        <div className="sig-stats">
          <div className="sig-stat">
            <span className="sig-stat-num">1%</span>
            <span className="sig-stat-label">Of All Diamonds Sourced</span>
          </div>
          <div className="sig-stat-divider"></div>
          <div className="sig-stat">
            <span className="sig-stat-num">50+</span>
            <span className="sig-stat-label">Quality Checkpoints</span>
          </div>
          <div className="sig-stat-divider"></div>
          <div className="sig-stat">
            <span className="sig-stat-num">GIA</span>
            <span className="sig-stat-label">Certified Stones</span>
          </div>
        </div>
        <a href="#collections" className="sig-btn" id="sig-explore-btn">
          Explore The Vault
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
      </div>

      {/* Decorative corner marks */}
      <span className="sig-corner sig-corner--tl" aria-hidden="true"></span>
      <span className="sig-corner sig-corner--tr" aria-hidden="true"></span>
      <span className="sig-corner sig-corner--bl" aria-hidden="true"></span>
      <span className="sig-corner sig-corner--br" aria-hidden="true"></span>
    </section>
  );
};

export default Signature;
