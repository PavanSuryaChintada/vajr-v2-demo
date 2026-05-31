import React, { useEffect } from 'react';
import Preloader from './components/Preloader';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import About from './components/About';
import Collections from './components/Collections';
import Bridal from './components/Bridal';
import Craftsmanship from './components/Craftsmanship';
import Showrooms from './components/Showrooms';
import Footer from './components/Footer';

// Use the newly migrated Vanilla CSS
import './index.css';

function App() {
  useEffect(() => {
    // Reveal Animations for target sections
    const elementsToReveal = document.querySelectorAll('.target-heading, .target-text, .target-about-image-wrap, .target-collection-card, .target-bridal-heading, .target-bridal-text, .target-btn, .target-craft-item');
    
    // Set initial state
    elementsToReveal.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
    });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    elementsToReveal.forEach(el => observer.observe(el));

    // Cursor Glow
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      const glow = document.createElement('div');
      glow.id = 'cursor-glow';
      document.body.appendChild(glow);

      let visible = false;
      const moveGlow = (e) => {
        glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        if (!visible) {
          glow.style.opacity = '1';
          visible = true;
        }
      };
      
      const hideGlow = () => {
        glow.style.opacity = '0';
        visible = false;
      };

      document.addEventListener('mousemove', moveGlow, { passive: true });
      document.addEventListener('mouseleave', hideGlow);

      return () => {
        document.removeEventListener('mousemove', moveGlow);
        document.removeEventListener('mouseleave', hideGlow);
        glow.remove();
      };
    }
  }, []);

  return (
    <>
      <Preloader />
      <Navigation />
      <main>
        <Hero />
        <About />
        <Collections />
        <Bridal />
        <Craftsmanship />
        <Showrooms />
      </main>
      <Footer />
    </>
  );
}

export default App;
