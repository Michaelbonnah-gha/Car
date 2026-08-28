'use strict';

/* ============================================================
   APEX — main.js  v3.0
   GSAP + ScrollTrigger + Lenis Smooth Scroll
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Lenis Smooth Scroll ──────────────────────────────
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    wheelMultiplier: 0.85,
  });

  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);


  // ── 2. Custom Cursor ────────────────────────────────────
  const cursorRing = document.getElementById('cursor-ring');

  if (cursorRing) {
    let mouseX = 0, mouseY = 0;
    let curX = 0, curY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function animateCursor() {
      curX += (mouseX - curX) * 0.12;
      curY += (mouseY - curY) * 0.12;
      cursorRing.style.left = curX + 'px';
      cursorRing.style.top  = curY + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover states
    document.querySelectorAll('a, button, .magnetic-link, .plat-card, .bcard, .rfaq-item').forEach((el) => {
      el.addEventListener('mouseenter', () => cursorRing.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursorRing.classList.remove('is-hovering'));
    });

    window.addEventListener('mousedown', () => cursorRing.classList.add('is-clicking'));
    window.addEventListener('mouseup',   () => cursorRing.classList.remove('is-clicking'));
  }


  // ── 3. Navbar — scroll + hero mode ─────────────────────
  const navbar = document.getElementById('navbar');
  const hero   = document.getElementById('hero');

  if (navbar && hero) {
    // Start in hero-mode (white text on dark video)
    navbar.classList.add('hero-mode');
    document.body.classList.add('in-hero');

    ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      onUpdate: (self) => {
        if (self.progress < 0.05) {
          navbar.classList.add('hero-mode');
          document.body.classList.add('in-hero');
        } else {
          navbar.classList.remove('hero-mode');
          document.body.classList.remove('in-hero');
        }
      },
    });

    ScrollTrigger.create({
      trigger: 'body',
      start: '60px top',
      onEnter:     () => navbar.classList.add('scrolled'),
      onLeaveBack: () => navbar.classList.remove('scrolled'),
    });
  }


  // ── 4. Blue Sports Car Cinematic Entrance & Interactivity ────
  const heroHeadline = document.getElementById('hero-headline');
  const heroVideo = document.getElementById('hero-video');

  if (heroHeadline) {
    // Split headline text into characters for 3D perspective reveal
    const rawText = heroHeadline.textContent.trim();
    heroHeadline.innerHTML = rawText
      .split('')
      .map(ch => ch === ' ' ? '<span class="h-space" style="display:inline-block;width:0.32em"> </span>' :
           `<span class="h-ch" style="display:inline-block;overflow:hidden;vertical-align:bottom;"><span class="h-ch-in" style="display:inline-block;">${ch}</span></span>`)
      .join('');

    const heroTl = gsap.timeline({ delay: 0.5 });

    // 1. Background Video & Grid Reveal
    if (heroVideo) {
      heroTl.fromTo(heroVideo,
        { scale: 1.08, filter: 'contrast(1.1) brightness(0.6) blur(6px)' },
        { scale: 1.02, filter: 'contrast(1.05) brightness(0.95) blur(0px)', duration: 3.0, ease: 'power2.out' },
        0
      );
    }

    heroTl.fromTo('.hero-grid-lines',
      { opacity: 0, scale: 0.96 },
      { opacity: 1, scale: 1, duration: 2.4, ease: 'power2.out' },
      0.2
    );

    // 2. Navbar Entrance
    heroTl
      .fromTo('.nav-brand',
        { opacity: 0, x: -24 },
        { opacity: 1, x: 0, duration: 1.1, ease: 'power3.out' },
        0.3
      )
      .fromTo('.nav-link',
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.9, stagger: 0.09, ease: 'power3.out' },
        0.5
      )
      .fromTo('.nav-cta',
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1.0, ease: 'back.out(1.4)' },
        0.8
      );

    // 3. Eyebrow & Heading Stagger
    heroTl
      .fromTo('.eyebrow-line',
        { scaleX: 0 },
        { scaleX: 1, duration: 1.1, ease: 'power3.inOut' },
        0.7
      )
      .fromTo('#hero-eyebrow span:last-child',
        { opacity: 0, x: -14, letterSpacing: '0.45em' },
        { opacity: 1, x: 0, letterSpacing: '0.24em', duration: 1.2, ease: 'power3.out' },
        0.9
      )
      .fromTo('.h-ch-in',
        { yPercent: 120, rotateX: 65, opacity: 0 },
        { yPercent: 0, rotateX: 0, opacity: 1, duration: 1.6, stagger: 0.065, ease: 'power4.out' },
        1.2
      );

    // 4. Caption & Specs Dividers
    heroTl
      .fromTo('#hero-caption',
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        2.0
      )
      .fromTo('.h-spec-divider',
        { scaleY: 0, opacity: 0 },
        { scaleY: 1, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power2.out' },
        2.2
      )
      .fromTo('.h-spec',
        { opacity: 0, y: 18 },
        { opacity: 1, y: 0, duration: 1.1, stagger: 0.1, ease: 'power3.out' },
        2.2
      );

    // 5. Spec Numbers Dynamic Count-Up
    const speedEl = document.getElementById('hero-spec-speed');
    const accelEl = document.getElementById('hero-spec-accel');
    const rangeEl = document.getElementById('hero-spec-range');
    const powerEl = document.getElementById('hero-spec-power');

    function countUp(el, target, isDecimal = false) {
      if (!el) return;
      const counter = { val: 0 };
      gsap.to(counter, {
        val: target,
        duration: 2.6,
        ease: 'power2.out',
        delay: 2.3,
        onUpdate: () => {
          el.textContent = isDecimal
            ? counter.val.toFixed(1)
            : Math.round(counter.val).toLocaleString();
        },
      });
    }

    countUp(speedEl, 345);
    countUp(accelEl, 1.8, true);
    countUp(rangeEl, 620);
    countUp(powerEl, 1150);

    // 6. Action Buttons Entrance
    heroTl
      .fromTo('#hero-cta-btn',
        { opacity: 0, y: 20, scale: 0.92 },
        { opacity: 1, y: 0, scale: 1, duration: 1.1, ease: 'back.out(1.3)' },
        2.6
      )
      .fromTo('#hero-audio-btn',
        { opacity: 0, scale: 0.5, rotate: -20 },
        { opacity: 1, scale: 1, rotate: 0, duration: 1.0, ease: 'back.out(1.5)' },
        2.8
      );
  }

  // 3D Mouse Parallax on Hero elements
  if (hero && window.matchMedia('(pointer: fine)').matches) {
    let targetTiltX = 0, targetTiltY = 0;
    let currentTiltX = 0, currentTiltY = 0;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      targetTiltX = relX * 14;
      targetTiltY = relY * -10;
    });

    hero.addEventListener('mouseleave', () => {
      targetTiltX = 0;
      targetTiltY = 0;
    });

    function renderParallax() {
      currentTiltX += (targetTiltX - currentTiltX) * 0.07;
      currentTiltY += (targetTiltY - currentTiltY) * 0.07;

      const header = document.querySelector('.hero-header');
      const specs = document.querySelector('.hero-specs');

      if (header) {
        header.style.transform = `perspective(1000px) rotateY(${currentTiltX * 0.3}deg) rotateX(${currentTiltY * 0.3}deg)`;
      }
      if (specs) {
        specs.style.transform = `perspective(1000px) rotateY(${currentTiltX * 0.2}deg) rotateX(${currentTiltY * 0.2}deg)`;
      }

      requestAnimationFrame(renderParallax);
    }
    renderParallax();
  }

  // ── Web Audio Hypercar Sound Synth Engine ─────────────────
  const audioBtn = document.getElementById('hero-audio-btn');
  let audioCtx = null;
  let synthOsc1 = null;
  let synthOsc2 = null;
  let synthGain = null;
  let synthFilter = null;
  let isSoundActive = false;

  function initAudioSynth() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContext();

      synthGain = audioCtx.createGain();
      synthGain.gain.setValueAtTime(0.001, audioCtx.currentTime);

      synthFilter = audioCtx.createBiquadFilter();
      synthFilter.type = 'lowpass';
      synthFilter.frequency.setValueAtTime(220, audioCtx.currentTime);
      synthFilter.Q.setValueAtTime(3, audioCtx.currentTime);

      synthOsc1 = audioCtx.createOscillator();
      synthOsc1.type = 'sawtooth';
      synthOsc1.frequency.setValueAtTime(55, audioCtx.currentTime);

      synthOsc2 = audioCtx.createOscillator();
      synthOsc2.type = 'sine';
      synthOsc2.frequency.setValueAtTime(110, audioCtx.currentTime);

      synthOsc1.connect(synthFilter);
      synthOsc2.connect(synthFilter);
      synthFilter.connect(synthGain);
      synthGain.connect(audioCtx.destination);

      synthOsc1.start();
      synthOsc2.start();
    } catch (err) {
      console.warn('Web Audio not supported:', err);
    }
  }

  if (audioBtn) {
    audioBtn.addEventListener('click', () => {
      if (!audioCtx) {
        initAudioSynth();
      }
      if (!audioCtx) return;

      if (audioCtx.state === 'suspended') {
        audioCtx.resume();
      }

      isSoundActive = !isSoundActive;

      if (isSoundActive) {
        audioBtn.classList.add('playing');
        const now = audioCtx.currentTime;
        synthGain.gain.cancelScheduledValues(now);
        synthGain.gain.setValueAtTime(synthGain.gain.value, now);
        synthGain.gain.exponentialRampToValueAtTime(0.06, now + 0.4);
        synthFilter.frequency.exponentialRampToValueAtTime(700, now + 1.0);
      } else {
        audioBtn.classList.remove('playing');
        const now = audioCtx.currentTime;
        synthGain.gain.cancelScheduledValues(now);
        synthGain.gain.setValueAtTime(synthGain.gain.value, now);
        synthGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);
      }
    });
  }

  // Hero video subtle parallax on scroll
  gsap.to('#hero-video', {
    yPercent: 10,
    ease: 'none',
    scrollTrigger: {
      trigger: '#hero',
      start: 'top top',
      end: 'bottom top',
      scrub: 1.5,
    },
  });


  // ── 5. Platform Section ─────────────────────────────────
  gsap.fromTo('#platform-headline',
    { opacity: 0, y: 36 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#platform-headline', start: 'top 85%' },
    }
  );

  gsap.fromTo('#platform-desc',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger: '#platform-desc', start: 'top 88%' },
    }
  );

  gsap.fromTo('#pc-1, #pc-2, #pc-3',
    { opacity: 0, y: 40, scale: 0.97 },
    {
      opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '#platform-cards', start: 'top 85%' },
    }
  );


  // ── 6. Roadster Section ─────────────────────────────────
  gsap.fromTo('#roadster-eyebrow, #roadster-name',
    { opacity: 0, y: 28 },
    {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#roadster', start: 'top 85%' },
    }
  );

  gsap.fromTo('#roadster-img',
    { opacity: 0, y: 48 },
    {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#roadster-img', start: 'top 88%' },
    }
  );

  gsap.fromTo('#roadster-specs .rspec',
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#roadster-specs', start: 'top 88%' },
    }
  );

  // Watermark fade in
  gsap.fromTo('.roadster-watermark',
    { opacity: 0, scale: 0.95 },
    {
      opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out',
      scrollTrigger: { trigger: '.roadster-section', start: 'top 70%' },
    }
  );


  // ── 7. Charging Section ─────────────────────────────────
  gsap.fromTo('#charging-text > *',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#charging-text', start: 'top 82%' },
    }
  );

  gsap.fromTo('#charging-media',
    { opacity: 0, x: 36 },
    {
      opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#charging-media', start: 'top 82%' },
    }
  );


  // ── 8. Impact Section ───────────────────────────────────
  gsap.fromTo('#impact-left > *',
    { opacity: 0, y: 30 },
    {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '#impact-left', start: 'top 82%' },
    }
  );

  gsap.fromTo('.istat',
    { opacity: 0, y: 20 },
    {
      opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '.impact-stats', start: 'top 85%' },
    }
  );

  gsap.fromTo('#impact-img',
    { opacity: 0, y: 32 },
    {
      opacity: 1, y: 0, duration: 0.9, ease: 'power3.out',
      scrollTrigger: { trigger: '#impact-img', start: 'top 88%' },
    }
  );


  // ── 9. Built For Section ────────────────────────────────
  gsap.fromTo('#built-header > *',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
      scrollTrigger: { trigger: '#built-header', start: 'top 85%' },
    }
  );

  gsap.fromTo('#bcard-1, #bcard-2, #bcard-3',
    { opacity: 0, y: 48, scale: 0.97 },
    {
      opacity: 1, y: 0, scale: 1, duration: 0.85, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.built-grid', start: 'top 82%' },
    }
  );


  // ── 10. Why APEX Section ─────────────────────────────────
  gsap.fromTo('#why-left > *',
    { opacity: 0, y: 32 },
    {
      opacity: 1, y: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '#why-left', start: 'top 82%' },
    }
  );

  gsap.fromTo('#why-right',
    { opacity: 0, x: 40 },
    {
      opacity: 1, x: 0, duration: 1.0, ease: 'power3.out',
      scrollTrigger: { trigger: '#why-right', start: 'top 82%' },
    }
  );


  // ── 11. Reserve Section ─────────────────────────────────
  gsap.fromTo('#reserve-content > *',
    { opacity: 0, y: 36 },
    {
      opacity: 1, y: 0, duration: 0.85, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '#reserve-content', start: 'top 80%' },
    }
  );

  gsap.fromTo('.rfaq-item',
    { opacity: 0, y: 16 },
    {
      opacity: 1, y: 0, duration: 0.6, stagger: 0.08, ease: 'power3.out',
      scrollTrigger: { trigger: '.reserve-faq', start: 'top 85%' },
    }
  );


  // ── 12. Footer entrance ─────────────────────────────────
  gsap.fromTo('.footer-top, .footer-mid, .footer-bottom',
    { opacity: 0, y: 24 },
    {
      opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: 'power3.out',
      scrollTrigger: { trigger: '.site-footer', start: 'top 90%' },
    }
  );


  // ── 13. FAQ accordion toggle ────────────────────────────
  document.querySelectorAll('.rfaq-item').forEach((item) => {
    item.style.cursor = 'pointer';
    const answer = item.querySelector('.rfaq-a');
    if (!answer) return;
    gsap.set(answer, { height: 0, opacity: 0, overflow: 'hidden', marginTop: 0 });
    let open = false;

    item.addEventListener('click', () => {
      if (!open) {
        gsap.to(answer, { height: 'auto', opacity: 1, marginTop: 8, duration: 0.4, ease: 'power2.out' });
        open = true;
      } else {
        gsap.to(answer, { height: 0, opacity: 0, marginTop: 0, duration: 0.3, ease: 'power2.in' });
        open = false;
      }
    });
  });


  // ── 14. Magnetic links ──────────────────────────────────
  document.querySelectorAll('.magnetic-link').forEach((el) => {
    el.addEventListener('mousemove', (e) => {
      const rect = el.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width  / 2) * 0.18;
      const dy = (e.clientY - rect.top  - rect.height / 2) * 0.18;
      gsap.to(el, { x: dx, y: dy, duration: 0.35, ease: 'power2.out' });
    });
    el.addEventListener('mouseleave', () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.5, ease: 'elastic.out(1, 0.5)' });
    });
  });


  // ── 15. Smooth anchor scroll ─────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (target) {
        e.preventDefault();
        lenis.scrollTo(target, { offset: -68, duration: 1.4, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) });
      }
    });
  });

});
