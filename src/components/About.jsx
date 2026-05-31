import React from 'react';

const About = () => {
  return (
    <section id="about" className="target-section target-about">
      <div className="target-container">
        <div className="target-about-grid">
          <div className="target-about-content">
            <div className="target-gold-line"></div>
            <h2 className="target-heading">
              A Legacy of <br />
              <span className="target-gold-italic">Unparalleled Craft</span>
            </h2>
            <p className="target-text">
              For generations, VAJR JEWELS has been the custodian of India's most
              extraordinary gems. We do not merely create jewelry; we sculpt
              heirlooms. Every diamond is meticulously selected, every emerald
              ethically sourced, and every setting handcrafted by master artisans
              whose skills have been honed over decades.
            </p>
            <p className="target-text">
              Our pieces are born from a dialogue between ancient heritage and
              contemporary brilliance. When you wear VAJR, you wear a testament to
              eternity.
            </p>
            <div className="target-about-link-wrap">
              <a href="#craftsmanship" className="target-link">
                Discover Our Process
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="target-svg-icon" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
                </svg>
              </a>
            </div>
          </div>
          <div className="target-about-image-wrap">
            <div className="target-about-image-inner">
              <img alt="Heritage Craftsmanship" src="/craftsmanship_hero.png" className="target-img-cover" />
              <div className="target-image-overlay"></div>
            </div>
            <div className="target-about-quote">
              <p>"Perfection in every facet."</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
