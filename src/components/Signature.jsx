import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const slides = [
  {
    id: 'vault-intro',
    eyebrow: 'The Vault — Chapter I',
    title: 'Brilliant',
    titleAccent: 'Cuts',
    body: 'Deep within our vaults lie diamonds that nature spent billions of years creating. We spend years finding them.',
    stat: null,
    image: '/diamond_rings.png',
    align: 'left',
  },
  {
    id: 'vault-source',
    eyebrow: 'The Vault — Chapter II',
    title: 'Only the',
    titleAccent: 'Rarest',
    body: 'From Botswana to Mumbai, our gemologists travel the world to handpick diamonds that represent the top 1% of all stones mined globally.',
    stat: { num: '1%', label: 'Of All Diamonds Sourced' },
    image: '/collection_featured.png',
    align: 'right',
  },
  {
    id: 'vault-certify',
    eyebrow: 'The Vault — Chapter III',
    title: 'GIA',
    titleAccent: 'Certified',
    body: 'Every stone in our vault carries full GIA certification — the gold standard in gemological grading — guaranteeing cut, colour, clarity and carat.',
    stat: { num: '100%', label: 'GIA Certified' },
    image: '/bridal_collection.png',
    align: 'left',
  },
  {
    id: 'vault-craft',
    eyebrow: 'The Vault — Chapter IV',
    title: 'Master',
    titleAccent: 'Setting',
    body: 'Our artisans dedicate up to 200 hours per piece. Every prong, every bezel, every pavé row — placed with microscopic precision.',
    stat: { num: '200h', label: 'Per Signature Piece' },
    image: '/craftsmanship_hero.png',
    align: 'right',
  },
  {
    id: 'vault-legacy',
    eyebrow: 'The Vault — Chapter V',
    title: 'Your',
    titleAccent: 'Legacy',
    body: 'A VAJR diamond is not bought. It is inherited. Pieces designed to outlive moments — built to be passed down for generations.',
    stat: null,
    image: '/gold_necklace.png',
    align: 'left',
    cta: true,
  },
];

const Signature = () => {
  const containerRef = useRef(null);
  const trackRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const container = containerRef.current;
      if (!track || !container) return;

      const panels = gsap.utils.toArray('.hsv-slide', track);
      const totalWidth = panels.length * window.innerWidth;

      // Animate the track horizontally while pinned
      gsap.to(track, {
        x: () => -(totalWidth - window.innerWidth),
        ease: 'none',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: () => `+=${totalWidth - window.innerWidth}`,
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      // Animate each slide's content in as it enters
      panels.forEach((panel, i) => {
        const eyebrow = panel.querySelector('.hsv-eyebrow');
        const title = panel.querySelector('.hsv-title');
        const body = panel.querySelector('.hsv-body');
        const stat = panel.querySelector('.hsv-stat-box');
        const cta = panel.querySelector('.hsv-cta');
        const img = panel.querySelector('.hsv-slide-image');

        const enterOffset = i * window.innerWidth;

        // Slide image parallax
        if (img) {
          gsap.fromTo(img,
            { scale: 1.12 },
            {
              scale: 1,
              ease: 'none',
              scrollTrigger: {
                trigger: container,
                start: () => `top top+=${enterOffset * 0.8}`,
                end: () => `top top+=${enterOffset + window.innerWidth}`,
                scrub: 1.5,
                invalidateOnRefresh: true,
              },
            }
          );
        }

        // Text reveal
        const els = [eyebrow, title, body, stat, cta].filter(Boolean);
        els.forEach((el, j) => {
          gsap.fromTo(el,
            { opacity: 0, y: 36 },
            {
              opacity: 1,
              y: 0,
              duration: 0.6,
              delay: j * 0.1,
              ease: 'power2.out',
              scrollTrigger: {
                trigger: container,
                start: () => `top top+=${Math.max(0, enterOffset - window.innerWidth * 0.3)}`,
                end: () => `top top+=${enterOffset + window.innerWidth * 0.5}`,
                toggleActions: 'play none none reverse',
                invalidateOnRefresh: true,
              },
            }
          );
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      id="signature"
      ref={containerRef}
      className="hsv-container"
      aria-label="Brilliant Cuts — Horizontal Story"
    >
      {/* Progress bar */}
      <div className="hsv-progress-track" aria-hidden="true">
        {slides.map((s, i) => (
          <div key={s.id} className="hsv-progress-dot" style={{ animationDelay: `${i * 0.15}s` }} />
        ))}
      </div>

      {/* Chapter counter */}
      <div className="hsv-chapter-counter" aria-hidden="true">
        {slides.map((_, i) => (
          <span key={i} className="hsv-dot" />
        ))}
      </div>

      {/* Horizontal track */}
      <div ref={trackRef} className="hsv-track">
        {slides.map((slide) => (
          <div
            key={slide.id}
            id={slide.id}
            className={`hsv-slide hsv-slide--${slide.align}`}
            aria-label={slide.eyebrow}
          >
            {/* Background image */}
            <div className="hsv-slide-bg">
              <img
                src={slide.image}
                alt={slide.titleAccent}
                className="hsv-slide-image"
              />
              <div className="hsv-slide-overlay" />
            </div>

            {/* Text Content */}
            <div className="hsv-slide-content">
              <p className="hsv-eyebrow">{slide.eyebrow}</p>

              <h2 className="hsv-title">
                {slide.title}<br />
                <span className="hsv-title-accent">{slide.titleAccent}</span>
              </h2>

              <p className="hsv-body">{slide.body}</p>

              {slide.stat && (
                <div className="hsv-stat-box">
                  <span className="hsv-stat-num">{slide.stat.num}</span>
                  <span className="hsv-stat-label">{slide.stat.label}</span>
                </div>
              )}

              {slide.cta && (
                <a href="#bridal" className="hsv-cta" id="hsv-cta-btn">
                  Explore The Vault
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </a>
              )}
            </div>

            {/* Slide number */}
            <div className="hsv-slide-num" aria-hidden="true">
              {String(slides.indexOf(slide) + 1).padStart(2, '0')}
            </div>
          </div>
        ))}
      </div>

      {/* Scroll hint on first slide */}
      <div className="hsv-scroll-hint" aria-hidden="true">
        <span className="hsv-scroll-arrow">→</span>
        <span className="hsv-scroll-text">Scroll to explore</span>
      </div>
    </div>
  );
};

export default Signature;
