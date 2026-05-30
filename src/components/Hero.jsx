import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger);

const CONFIG = {
  FRAME_DIR: '/vajrassets/',
  FRAME_PREFIX: 'ezgif-frame-',
  FRAME_EXT: '.jpg',
  TOTAL_FRAMES: 206,
  SCROLL_MULTIPLIER: 5,
  PARTICLE_COUNT_HERO: 60,
};

function padFrame(n) {
  return String(n).padStart(3, '0');
}

function getFramePath(n) {
  return `${CONFIG.FRAME_DIR}${CONFIG.FRAME_PREFIX}${padFrame(n)}${CONFIG.FRAME_EXT}`;
}

const Hero = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const particleCanvasRef = useRef(null);
  const contentRef = useRef(null);
  const progressBarRef = useRef(null);
  const scrollIndicatorRef = useRef(null);
  
  const state = useRef({
    frames: [],
    currentFrame: 0,
    particlesActive: false,
    particlesHero: [],
    particleOpacity: 0
  });

  // Particle Class Definition
  class GoldParticle {
    constructor(canvasW, canvasH) {
      this.reset(canvasW, canvasH);
    }
    reset(canvasW, canvasH) {
      this.x = Math.random() * canvasW;
      this.y = (canvasH * (0.4 + Math.random() * 0.6));
      this.size = Math.random() * 3 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.8;
      this.speedY = -(Math.random() * 1.5 + 0.3);
      this.alpha = Math.random() * 0.7 + 0.2;
      this.decay = Math.random() * 0.008 + 0.003;
      this.twinkle = Math.random() * Math.PI * 2;
      this.twinkleSpeed = Math.random() * 0.04 + 0.01;
      const colors = [
        `rgba(201, 168, 76,`,
        `rgba(228, 201, 110,`,
        `rgba(245, 237, 212,`,
        `rgba(181, 69, 26,`,
        `rgba(212, 185, 90,`
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }
    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.twinkle += this.twinkleSpeed;
      this.alpha -= this.decay;
      this.speedX += (Math.random() - 0.5) * 0.02;
    }
    draw(ctx, particleOpacity) {
      const twinkleFactor = 0.5 + 0.5 * Math.sin(this.twinkle);
      const a = Math.max(0, this.alpha * twinkleFactor);
      ctx.save();
      ctx.globalAlpha = a * particleOpacity;
      if (this.size > 2) {
        ctx.fillStyle = `${this.color} ${a})`;
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const r = this.size * (i % 2 === 0 ? 1 : 0.4);
          if (i === 0) ctx.moveTo(this.x + Math.cos(angle) * r, this.y + Math.sin(angle) * r);
          else ctx.lineTo(this.x + Math.cos(angle) * r, this.y + Math.sin(angle) * r);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        ctx.fillStyle = `${this.color} ${a})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
    isDead() { return this.alpha <= 0; }
  }

  useEffect(() => {
    // Preload frames
    const total = CONFIG.TOTAL_FRAMES;
    state.current.frames = new Array(total).fill(null);
    
    const loadFrame = (index) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => {
          state.current.frames[index - 1] = img;
          if (index === 1) {
            drawFrame(0); // Draw first frame when loaded
            // Show canvas in blurred state as soon as first frame is ready
            const canvas = canvasRef.current;
            if (canvas) {
              canvas.classList.remove('is-sharp');
              canvas.classList.add('is-blurred');
            }
          }
          resolve();
        };
        img.onerror = () => resolve();
        img.src = getFramePath(index);
      });
    };

    const loadAll = async () => {
      const priority = Array.from({length: 30}, (_, i) => i + 1);
      await Promise.all(priority.map(loadFrame));

      // Upgrade to sharp (full quality) once priority frames are loaded
      const canvas = canvasRef.current;
      if (canvas) {
        canvas.classList.remove('is-blurred');
        canvas.classList.add('is-sharp');
      }
      
      const rest = Array.from({length: total - 30}, (_, i) => i + 31);
      for (let i = 0; i < rest.length; i += 20) {
        await Promise.all(rest.slice(i, i + 20).map(loadFrame));
      }
    };
    loadAll();

    // Setup Canvases
    const resizeCanvas = () => {
      const heroCanvas = canvasRef.current;
      const particleCanvas = particleCanvasRef.current;
      if (!heroCanvas || !particleCanvas) return;

      const heroCtx = heroCanvas.getContext('2d', { alpha: false });
      const pCtx = particleCanvas.getContext('2d');
      const cssW = window.innerWidth;
      const cssH = window.innerHeight;
      const DPR = Math.min(window.devicePixelRatio || 1, 3);

      [heroCanvas, particleCanvas].forEach(c => {
        c.width = Math.round(cssW * DPR);
        c.height = Math.round(cssH * DPR);
        c.style.width = cssW + 'px';
        c.style.height = cssH + 'px';
      });

      heroCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
      heroCtx.imageSmoothingEnabled = true;
      heroCtx.imageSmoothingQuality = 'high';
      pCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

      drawFrame(state.current.currentFrame);
    };

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  const drawFrame = (index) => {
    const frame = state.current.frames[index];
    const canvas = canvasRef.current;
    if (!frame || !canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    const cw = window.innerWidth;
    const ch = window.innerHeight;
    const fw = frame.naturalWidth || frame.width;
    const fh = frame.naturalHeight || frame.height;
    if (!fw || !fh) return;

    const scale = Math.max(cw / fw, ch / fh);
    const dw = fw * scale;
    const dh = fh * scale;
    const dx = (cw - dw) / 2;
    const dy = (ch - dh) / 2;

    ctx.fillStyle = '#0E0B08';
    ctx.fillRect(0, 0, cw, ch);
    ctx.drawImage(frame, dx, dy, dw, dh);
  };

  useGSAP(() => {
    const section = containerRef.current;
    const wrapper = document.getElementById('hero-canvas-wrapper');
    const heroContent = contentRef.current;
    const frameBarFill = progressBarRef.current;
    
    // Initial reveal animation
    const eyebrow = document.getElementById('hero-eyebrow');
    const lines = document.querySelectorAll('.hero-line');
    const subtitle = document.querySelector('.hero-subtitle');
    
    setTimeout(() => { if (eyebrow) eyebrow.classList.add('visible'); }, 300);
    lines.forEach((line, i) => {
      line.style.opacity = '0';
      line.style.transform = 'translateY(30px)';
      line.style.transition = `opacity 1s ease, transform 1s ease`;
      setTimeout(() => {
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 600 + i * 200);
    });
    if (subtitle) {
      subtitle.style.opacity = '0';
      subtitle.style.transition = 'opacity 1s ease 1.4s';
      setTimeout(() => { subtitle.style.opacity = '1'; }, 100);
    }

    // Scroll Trigger Logic
    let particleRAF = null;
    const pCtx = particleCanvasRef.current?.getContext('2d');

    const triggerParticleTransition = () => {
      state.current.particlesHero = [];
      const canvas = particleCanvasRef.current;
      for (let i = 0; i < CONFIG.PARTICLE_COUNT_HERO; i++) {
        state.current.particlesHero.push(new GoldParticle(canvas.width, canvas.height));
      }
      gsap.to(state.current, {
        particleOpacity: 1,
        duration: 1.5,
        ease: 'power2.out',
      });
      if (!particleRAF) animateParticles();
    };

    const cancelParticleTransition = () => {
      gsap.to(state.current, {
        particleOpacity: 0,
        duration: 0.8,
        ease: 'power2.in',
        onComplete: () => {
          state.current.particlesHero = [];
          pCtx?.clearRect(0, 0, window.innerWidth, window.innerHeight);
          if (particleRAF) {
            cancelAnimationFrame(particleRAF);
            particleRAF = null;
          }
        }
      });
    };

    const animateParticles = () => {
      particleRAF = requestAnimationFrame(animateParticles);
      if (!pCtx) return;
      pCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      const canvas = particleCanvasRef.current;

      if (state.current.particlesActive && state.current.particlesHero.length < CONFIG.PARTICLE_COUNT_HERO) {
        state.current.particlesHero.push(new GoldParticle(canvas.width, canvas.height));
      }

      state.current.particlesHero = state.current.particlesHero.filter(p => {
        p.update();
        p.draw(pCtx, state.current.particleOpacity);
        return !p.isDead();
      });
    };

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      pin: wrapper,
      pinSpacing: false,
      scrub: 0.6,
      onUpdate: (self) => {
        const progress = self.progress;
        
        // Update frame
        const rawIndex = Math.floor(progress * (CONFIG.TOTAL_FRAMES - 1));
        const frameIndex = Math.min(rawIndex, CONFIG.TOTAL_FRAMES - 1);
        if (frameIndex !== state.current.currentFrame) {
          state.current.currentFrame = frameIndex;
          drawFrame(frameIndex);
        }

        // Update progress bar
        if (frameBarFill) frameBarFill.style.width = `${progress * 100}%`;

        // Update content opacity
        const contentOpacity = Math.max(0, 1 - progress * 5);
        if (heroContent) {
          heroContent.style.opacity = contentOpacity;
          heroContent.style.transform = `translateY(${progress * -30}px)`;
        }

        // Handle global scroll progress bar
        const fill = document.getElementById('scroll-progress-fill');
        if (fill) {
           const scrollTop = window.scrollY;
           const docHeight = document.documentElement.scrollHeight - window.innerHeight;
           if (docHeight > 0) {
              const globalProgress = Math.min(scrollTop / docHeight, 1);
              fill.style.height = `${globalProgress * 100}%`;
           }
        }

        // Particles
        if (progress > 0.88 && !state.current.particlesActive) {
          state.current.particlesActive = true;
          triggerParticleTransition();
        } else if (progress < 0.85 && state.current.particlesActive) {
          state.current.particlesActive = false;
          cancelParticleTransition();
        }
      }
    });

  }, { scope: containerRef });

  return (
    <section ref={containerRef} id="hero-section" aria-label="Hero cinematic showcase" style={{ height: `${CONFIG.SCROLL_MULTIPLIER * 100}vh` }}>
      <div id="hero-canvas-wrapper">
        <canvas ref={canvasRef} id="hero-canvas" aria-hidden="true"></canvas>

        {/* Hero Overlay Text */}
        <div ref={contentRef} className="hero-content" id="hero-content">
          <p className="hero-eyebrow" id="hero-eyebrow">Est. 1987 · Multi-Branch Excellence</p>
          <h1 className="hero-title" id="hero-title">
            <span className="hero-line">Where Every</span>
            <span className="hero-line hero-italic">Diamond</span>
            <span className="hero-line">Tells A Story</span>
          </h1>
          <p className="hero-subtitle" id="hero-subtitle">Scroll to begin your journey</p>
          <div ref={scrollIndicatorRef} className="hero-scroll-indicator" id="hero-scroll-indicator" aria-label="Scroll indicator">
            <span className="scroll-dot"></span>
            <span className="scroll-label">Scroll</span>
          </div>
        </div>

        {/* Frame Progress */}
        <div className="frame-counter" id="frame-counter" aria-live="polite">
          <span className="frame-count-label">Experience</span>
          <div className="frame-bar-track">
            <div ref={progressBarRef} className="frame-bar-fill" id="frame-bar-fill"></div>
          </div>
        </div>
      </div>

      {/* Particle Transition Canvas */}
      <canvas ref={particleCanvasRef} id="particle-canvas" aria-hidden="true"></canvas>
    </section>
  );
};

export default Hero;
