import React, { useState, useEffect } from 'react';

const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setMobileOpen(!mobileOpen);
  };

  const closeMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <nav id="luxury-nav" className={scrolled ? 'scrolled' : ''} role="navigation" aria-label="Main navigation">
        <div className="nav-inner">
          <a href="#" className="nav-logo" aria-label="Vajr Jewels — Home">
            <img src="/vajr-logo.svg" alt="Vajr Jewels" className="nav-logo-img" width="140" height="66" loading="eager" />
          </a>
          <ul className="nav-links" role="list">
            <li><a href="#collections" className="nav-link">Collections</a></li>
            <li><a href="#signature" className="nav-link">Signature</a></li>
            <li><a href="#craftsmanship" className="nav-link">Craftsmanship</a></li>
            <li><a href="#about" className="nav-link">Heritage</a></li>
            <li><a href="#showrooms" className="nav-link">Showrooms</a></li>
          </ul>
          <a href="#about" className="nav-cta" id="nav-cta-btn">Discover</a>
          <button 
            className="nav-hamburger" 
            id="nav-hamburger" 
            aria-label="Open mobile menu" 
            aria-expanded={mobileOpen}
            onClick={toggleMenu}
          >
            <span></span><span></span><span></span>
          </button>
        </div>
        <div className={`mobile-menu ${mobileOpen ? 'open' : ''}`} id="mobile-menu" aria-hidden={!mobileOpen}>
          <a href="#collections" onClick={closeMenu}>Collections</a>
          <a href="#signature" onClick={closeMenu}>Signature</a>
          <a href="#craftsmanship" onClick={closeMenu}>Craftsmanship</a>
          <a href="#about" onClick={closeMenu}>Heritage</a>
          <a href="#bridal" onClick={closeMenu}>Bridal</a>
          <a href="#showrooms" onClick={closeMenu}>Showrooms</a>
        </div>
      </nav>
      {/* Scroll progress bar (left edge) */}
      <div id="scroll-progress" aria-hidden="true">
        <div id="scroll-progress-fill"></div>
      </div>
    </>
  );
};

export default Navigation;
