/* ═══════════════════════════════════════════════════════════
   VAJR JEWELS — LUXURY JAVASCRIPT ENGINE
   Frame Sequence · GSAP · Particles · Scroll Animations
═══════════════════════════════════════════════════════════ */

'use strict';

/* ════════════════════════════════════════
   CONFIGURATION
════════════════════════════════════════ */
const CONFIG = {
  FRAME_DIR: 'vajrassets/',
  FRAME_PREFIX: 'ezgif-frame-',
  FRAME_EXT: '.jpg',
  TOTAL_FRAMES: 206,
  SCROLL_MULTIPLIER: 5,    // How many vh of scroll = full sequence
  PARTICLE_COUNT_HERO: 60,
  PARTICLE_COUNT_CTA: 80,
};

/* ════════════════════════════════════════
   STATE
════════════════════════════════════════ */
const state = {
  currentFrame: 0,
  loadedFrames: 0,
  frames: [],
  isLoaded: false,
  heroScrollProgress: 0,
  particlesActive: false,
  particlesHero: [],
  particlesCta: [],
  ctaParticleAngle: 0,
  dragState: { isDragging: false, startX: 0, scrollLeft: 0 },
};

/* ════════════════════════════════════════
   LOADING SCREEN INJECTION
════════════════════════════════════════ */
/* ════════════════════════════════════════
   LOADING SCREEN INJECTION
════════════════════════════════════════ */
function injectLoadingScreen() {
  const el = document.createElement('div');
  el.id = 'loading-screen';
  el.innerHTML = `
    <div class="preloader-inner">
      <div class="preloader-logo-entrance">
        <img src="vajr-logo.svg" alt="Vajr Jewels" class="preloader-logo-pulse" />
      </div>
    </div>
  `;
  document.body.insertBefore(el, document.body.firstChild);
}

/* ════════════════════════════════════════
   FRAME PRELOADER
════════════════════════════════════════ */
function padFrame(n) {
  return String(n).padStart(3, '0');
}

function getFramePath(n) {
  return `${CONFIG.FRAME_DIR}${CONFIG.FRAME_PREFIX}${padFrame(n)}${CONFIG.FRAME_EXT}`;
}

function preloadFrames(onProgress, onComplete) {
  const total = CONFIG.TOTAL_FRAMES;
  state.frames = new Array(total).fill(null);
  let loaded = 0;

  // Prioritize first 30 frames for fast initial display
  const priority = [];
  const rest = [];
  for (let i = 1; i <= total; i++) {
    if (i <= 30) priority.push(i);
    else rest.push(i);
  }

  const loadFrame = (index) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        state.frames[index - 1] = img;
        loaded++;
        onProgress(loaded / total);
        resolve();
      };
      img.onerror = () => {
        loaded++;
        onProgress(loaded / total);
        resolve();
      };
      img.src = getFramePath(index);
    });
  };

  const loadAll = async () => {
    await Promise.all(priority.map(loadFrame));
    onComplete('partial');
    for (let i = 0; i < rest.length; i += 20) {
      await Promise.all(rest.slice(i, i + 20).map(loadFrame));
    }
    onComplete('full');
  };

  loadAll();
}

/* ════════════════════════════════════════
   CANVAS RENDERER — HiDPI / Retina Quality
════════════════════════════════════════ */
const heroCanvas = document.getElementById('hero-canvas');
const heroCtx = heroCanvas.getContext('2d', { alpha: false });

// Cache DPR — clamp at 3 max so 5K screens don't tank performance
let DPR = Math.min(window.devicePixelRatio || 1, 3);

function resizeCanvas() {
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;

  // Update DPR in case it changed (e.g. moved between monitors)
  DPR = Math.min(window.devicePixelRatio || 1, 3);

  // Buffer in PHYSICAL pixels — this is what makes Retina sharp
  heroCanvas.width  = Math.round(cssW * DPR);
  heroCanvas.height = Math.round(cssH * DPR);

  // Keep CSS display size so layout stays correct
  heroCanvas.style.width  = cssW + 'px';
  heroCanvas.style.height = cssH + 'px';

  // Scale context so all draw calls work in CSS-pixel coords
  heroCtx.setTransform(DPR, 0, 0, DPR, 0, 0);

  // Maximum quality upscaling
  heroCtx.imageSmoothingEnabled = true;
  heroCtx.imageSmoothingQuality = 'high';

  drawFrame(state.currentFrame);
}

function drawFrame(index) {
  const frame = state.frames[index];
  if (!frame) return;

  // Work in CSS-pixel space (context is pre-scaled by DPR)
  const cw = window.innerWidth;
  const ch = window.innerHeight;
  const fw = frame.naturalWidth  || frame.width;
  const fh = frame.naturalHeight || frame.height;

  if (!fw || !fh) return;

  // Cover-fit: fill the viewport, centre-crop any overflow
  const scale = Math.max(cw / fw, ch / fh);
  const dw = fw * scale;
  const dh = fh * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  // alpha:false context — fillRect is faster than clearRect
  heroCtx.fillStyle = '#0E0B08';
  heroCtx.fillRect(0, 0, cw, ch);
  heroCtx.drawImage(frame, dx, dy, dw, dh);
}

/* ════════════════════════════════════════
   HERO SCROLL ENGINE
════════════════════════════════════════ */
function setupHeroScroll() {
  gsap.registerPlugin(ScrollTrigger);

  const heroSection = document.getElementById('hero-section');
  const heroCWrapper = document.getElementById('hero-canvas-wrapper');
  const frameBarFill = document.getElementById('frame-bar-fill');
  const heroContent = document.getElementById('hero-content');

  // Set the hero section height to create scroll distance
  heroSection.style.height = `${CONFIG.SCROLL_MULTIPLIER * 100}vh`;

  ScrollTrigger.create({
    trigger: heroSection,
    start: 'top top',
    end: `bottom bottom`,
    pin: heroCWrapper,
    pinSpacing: false,
    scrub: 0.6,
    onUpdate: (self) => {
      const progress = self.progress;
      state.heroScrollProgress = progress;

      // Map progress to frame index
      const rawIndex = Math.floor(progress * (CONFIG.TOTAL_FRAMES - 1));
      const frameIndex = Math.min(rawIndex, CONFIG.TOTAL_FRAMES - 1);

      if (frameIndex !== state.currentFrame) {
        state.currentFrame = frameIndex;
        drawFrame(frameIndex);
      }

      // Update progress bar
      if (frameBarFill) {
        frameBarFill.style.width = `${progress * 100}%`;
      }

      // Fade hero content as scroll begins
      const contentOpacity = Math.max(0, 1 - progress * 5);
      if (heroContent) {
        heroContent.style.opacity = contentOpacity;
        heroContent.style.transform = `translateY(${progress * -30}px)`;
      }

      // Trigger particle transition near end
      if (progress > 0.88 && !state.particlesActive) {
        state.particlesActive = true;
        triggerParticleTransition();
      } else if (progress < 0.85 && state.particlesActive) {
        state.particlesActive = false;
        cancelParticleTransition();
      }
    }
  });
}

/* ════════════════════════════════════════
   HERO TEXT REVEAL
════════════════════════════════════════ */
function revealHeroText() {
  const eyebrow = document.getElementById('hero-eyebrow');
  const lines = document.querySelectorAll('.hero-line');
  const subtitle = document.querySelector('.hero-subtitle');
  const indicator = document.getElementById('hero-scroll-indicator');

  // Eyebrow
  setTimeout(() => {
    if (eyebrow) eyebrow.classList.add('visible');
  }, 300);

  // Lines with stagger
  lines.forEach((line, i) => {
    line.style.opacity = '0';
    line.style.transform = 'translateY(30px)';
    line.style.transition = `opacity 1s ease, transform 1s ease`;
    setTimeout(() => {
      line.style.opacity = '1';
      line.style.transform = 'translateY(0)';
    }, 600 + i * 200);
  });

  // Subtitle
  if (subtitle) {
    subtitle.style.opacity = '0';
    subtitle.style.transition = 'opacity 1s ease 1.4s';
    setTimeout(() => { subtitle.style.opacity = ''; }, 100);
  }
}

/* ════════════════════════════════════════
   GOLD PARTICLE TRANSITION
════════════════════════════════════════ */
const particleCanvas = document.getElementById('particle-canvas');
const pCtx = particleCanvas.getContext('2d');
let particleRAF = null;
let particleOpacity = 0;

class GoldParticle {
  constructor(canvasW, canvasH, isFromHero) {
    this.reset(canvasW, canvasH, isFromHero);
  }

  reset(canvasW, canvasH, isFromHero) {
    this.x = Math.random() * canvasW;
    this.y = isFromHero ? (canvasH * (0.4 + Math.random() * 0.6)) : canvasH + 10;
    this.size = Math.random() * 3 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.8;
    this.speedY = -(Math.random() * 1.5 + 0.3);
    this.alpha = Math.random() * 0.7 + 0.2;
    this.decay = Math.random() * 0.008 + 0.003;
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.04 + 0.01;

    // Color variation: gold to champagne to rust
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
    // Slight drift
    this.speedX += (Math.random() - 0.5) * 0.02;
  }

  draw(ctx) {
    const twinkleFactor = 0.5 + 0.5 * Math.sin(this.twinkle);
    const a = Math.max(0, this.alpha * twinkleFactor);
    ctx.save();
    ctx.globalAlpha = a * particleOpacity;

    // Star / sparkle shape
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
      // Simple circle
      ctx.fillStyle = `${this.color} ${a})`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  isDead() { return this.alpha <= 0; }
}

function setupParticleCanvas() {
  const cssW = window.innerWidth;
  const cssH = window.innerHeight;
  // Match hero canvas DPR so particles align perfectly
  particleCanvas.width  = Math.round(cssW * DPR);
  particleCanvas.height = Math.round(cssH * DPR);
  particleCanvas.style.width  = cssW + 'px';
  particleCanvas.style.height = cssH + 'px';
  pCtx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function triggerParticleTransition() {
  // Spawn particles
  state.particlesHero = [];
  for (let i = 0; i < CONFIG.PARTICLE_COUNT_HERO; i++) {
    state.particlesHero.push(new GoldParticle(particleCanvas.width, particleCanvas.height, true));
  }

  // Fade in the particle canvas
  gsap.to({ val: 0 }, {
    val: 1,
    duration: 1.5,
    ease: 'power2.out',
    onUpdate: function() { particleOpacity = this.targets()[0].val; }
  });

  // Animate
  if (!particleRAF) animateParticles();
}

function cancelParticleTransition() {
  gsap.to({ val: particleOpacity }, {
    val: 0,
    duration: 0.8,
    ease: 'power2.in',
    onUpdate: function() { particleOpacity = this.targets()[0].val; },
    onComplete: () => {
      state.particlesHero = [];
      pCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      if (particleRAF) {
        cancelAnimationFrame(particleRAF);
        particleRAF = null;
      }
    }
  });
}

function animateParticles() {
  particleRAF = requestAnimationFrame(animateParticles);

  // Clear in CSS-pixel space (context is DPR-scaled via setTransform)
  pCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  // Spawn new particles to maintain density
  if (state.particlesActive && state.particlesHero.length < CONFIG.PARTICLE_COUNT_HERO) {
    state.particlesHero.push(new GoldParticle(particleCanvas.width, particleCanvas.height, true));
  }

  state.particlesHero = state.particlesHero.filter(p => {
    p.update();
    p.draw(pCtx);
    return !p.isDead();
  });
}

/* ════════════════════════════════════════
   CTA AMBIENT PARTICLES
════════════════════════════════════════ */
const ctaCanvas = document.getElementById('cta-particle-canvas');
const ctaCtx = ctaCanvas && ctaCanvas.getContext('2d');
let ctaRAF = null;
let ctaParticles = [];
let ctaObserved = false;

class CtaParticle {
  constructor(w, h) {
    this.w = w;
    this.h = h;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.w;
    this.y = Math.random() * this.h;
    this.size = Math.random() * 2 + 0.3;
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.speedY = -(Math.random() * 0.4 + 0.1);
    this.alpha = Math.random() * 0.5 + 0.1;
    this.decay = Math.random() * 0.002 + 0.001;
    this.twinkle = Math.random() * Math.PI * 2;
    this.twinkleSpeed = Math.random() * 0.03;
    const g = ['rgba(201,168,76,', 'rgba(228,201,110,', 'rgba(181,69,26,'];
    this.color = g[Math.floor(Math.random() * g.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.twinkle += this.twinkleSpeed;
    this.alpha -= this.decay;
    if (this.alpha <= 0 || this.y < 0) this.reset();
  }

  draw(ctx) {
    const a = Math.max(0, this.alpha * (0.5 + 0.5 * Math.sin(this.twinkle)));
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = `${this.color} ${a})`;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

function setupCtaParticles() {
  if (!ctaCanvas) return;
  const section = document.getElementById('cta');
  ctaCanvas.width = section.offsetWidth;
  ctaCanvas.height = section.offsetHeight;

  ctaParticles = [];
  for (let i = 0; i < CONFIG.PARTICLE_COUNT_CTA; i++) {
    ctaParticles.push(new CtaParticle(ctaCanvas.width, ctaCanvas.height));
  }
}

function animateCtaParticles() {
  ctaRAF = requestAnimationFrame(animateCtaParticles);
  ctaCtx.clearRect(0, 0, ctaCanvas.width, ctaCanvas.height);
  ctaParticles.forEach(p => { p.update(); p.draw(ctaCtx); });
}

function startCtaParticles() {
  if (ctaObserved) return;
  ctaObserved = true;
  setupCtaParticles();
  animateCtaParticles();
}

/* ════════════════════════════════════════
   SIGNATURE HORIZONTAL DRAG SCROLL
════════════════════════════════════════ */
function setupSignatureHorizontalScroll() {
  const wrapper = document.getElementById('signature-track-wrapper');
  const track = document.getElementById('signature-track');
  if (!wrapper || !track) return;

  const ds = state.dragState;

  wrapper.addEventListener('mousedown', (e) => {
    ds.isDragging = true;
    ds.startX = e.pageX - wrapper.offsetLeft;
    ds.scrollLeft = wrapper.scrollLeft;
    wrapper.style.cursor = 'grabbing';
  });

  wrapper.addEventListener('mouseleave', () => {
    ds.isDragging = false;
    wrapper.style.cursor = 'grab';
  });

  wrapper.addEventListener('mouseup', () => {
    ds.isDragging = false;
    wrapper.style.cursor = 'grab';
  });

  wrapper.addEventListener('mousemove', (e) => {
    if (!ds.isDragging) return;
    e.preventDefault();
    const x = e.pageX - wrapper.offsetLeft;
    const walk = (x - ds.startX) * 1.5;
    wrapper.scrollLeft = ds.scrollLeft - walk;
  });

  // Touch
  wrapper.addEventListener('touchstart', (e) => {
    ds.startX = e.touches[0].pageX - wrapper.offsetLeft;
    ds.scrollLeft = wrapper.scrollLeft;
  }, { passive: true });

  wrapper.addEventListener('touchmove', (e) => {
    const x = e.touches[0].pageX - wrapper.offsetLeft;
    const walk = (x - ds.startX) * 1.5;
    wrapper.scrollLeft = ds.scrollLeft - walk;
  }, { passive: true });

  // Overflow scroll
  wrapper.style.overflowX = 'auto';
  wrapper.style.scrollbarWidth = 'none';
  wrapper.style.msOverflowStyle = 'none';
}

/* ════════════════════════════════════════
   ANIMATED COUNTERS
════════════════════════════════════════ */
function formatNumber(n) {
  if (n >= 100000) return (n / 1000).toFixed(0) + 'K';
  if (n >= 10000) return (n / 1000).toFixed(0) + 'K';
  return n.toLocaleString('en-IN');
}

function animateCounter(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  const duration = 2200;
  const start = performance.now();

  const tick = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = formatNumber(current);
    if (progress < 1) requestAnimationFrame(tick);
    else el.textContent = formatNumber(target);
  };

  requestAnimationFrame(tick);
}

/* ════════════════════════════════════════
   INTERSECTION OBSERVER — REVEAL
════════════════════════════════════════ */
function setupRevealObserver() {
  const revealItems = document.querySelectorAll(
    '.reveal-block, .reveal-card, .reveal-image, .reveal-line, .reveal-pillar, .reveal-stat'
  );

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');

        // Counter animation for stats
        if (entry.target.classList.contains('reveal-stat')) {
          const counter = entry.target.querySelector('.stat-count');
          if (counter && !counter.getAttribute('data-animated')) {
            counter.setAttribute('data-animated', 'true');
            animateCounter(counter);
          }
        }

        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -60px 0px',
  });

  revealItems.forEach(el => observer.observe(el));

  // CTA particles observer
  const ctaSection = document.getElementById('cta');
  if (ctaSection) {
    const ctaObserver = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        startCtaParticles();
        ctaObserver.disconnect();
      }
    }, { threshold: 0.1 });
    ctaObserver.observe(ctaSection);
  }
}

/* ════════════════════════════════════════
   GSAP PARALLAX EFFECTS
════════════════════════════════════════ */
function setupGSAPParallax() {
  // Craft image parallax
  gsap.to('.craft-img', {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: {
      trigger: '.craft-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // About bg text parallax
  gsap.to('.about-bg-text', {
    yPercent: 20,
    ease: 'none',
    scrollTrigger: {
      trigger: '.about-section',
      start: 'top bottom',
      end: 'bottom top',
      scrub: 1,
    }
  });

  // Signature cards subtle float
  gsap.utils.toArray('.sig-card').forEach((card, i) => {
    gsap.to(card, {
      y: -12 + i * 3,
      ease: 'none',
      scrollTrigger: {
        trigger: '.signature-section',
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1.5 + i * 0.2,
      }
    });
  });

  // CTA title dramatic reveal
  gsap.from('.cta-title', {
    y: 60,
    opacity: 0,
    duration: 1.4,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.cta-section',
      start: 'top 80%',
    }
  });
}

/* ════════════════════════════════════════
   NAVIGATION SCROLL BEHAVIOR
════════════════════════════════════════ */
function setupNavigation() {
  const nav = document.getElementById('luxury-nav');
  const hamburger = document.getElementById('nav-hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  }, { passive: true });

  // Hamburger
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });
  }

  // Close on link click
  document.querySelectorAll('.mobile-menu a').forEach(a => {
    a.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Smooth scroll for nav links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
}

/* ════════════════════════════════════════
   RESIZE HANDLER
════════════════════════════════════════ */
function setupResizeHandler() {
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resizeCanvas();
      setupParticleCanvas();
      ScrollTrigger.refresh();
    }, 200);
  });
}

/* ════════════════════════════════════════
   MAIN INIT
════════════════════════════════════════ */
function init() {
  injectLoadingScreen();
  resizeCanvas();
  setupParticleCanvas();
  setupNavigation();

  const loadingScreen = document.getElementById('loading-screen');
  const heroCanvas = document.getElementById('hero-canvas');
  let firstFrameDrawn = false;

  preloadFrames(
    // Progress callback
    (progress) => {
      if (!firstFrameDrawn && state.frames[0]) {
        drawFrame(0);
        heroCanvas.classList.add('is-blurred');
        firstFrameDrawn = true;
      }
    },
    // Complete callback
    (phase) => {
      if (phase === 'partial') {
        state.isLoaded = true;

        if (loadingScreen) {
          setTimeout(() => {
            loadingScreen.classList.add('hidden');
            setTimeout(() => {
              if (loadingScreen.parentNode) {
                loadingScreen.parentNode.removeChild(loadingScreen);
              }
            }, 1200);
          }, 800);
        }

        heroCanvas.classList.remove('is-blurred');
        heroCanvas.classList.add('is-sharp');

        revealHeroText();
        setupHeroScroll();
        setupRevealObserver();
        setupGSAPParallax();
        setupSignatureHorizontalScroll();
        setupResizeHandler();
      }
    }
  );
}

/* ════════════════════════════════════════
   BOOT
════════════════════════════════════════ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
