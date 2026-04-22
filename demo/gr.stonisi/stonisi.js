/* ============================================================
   stonisi.gr — Phase 3 prototype JS (iteration 3)
   Hero slider · TTS (pause/resume) · Reader mode · Reading focus · Mobile menu
   ============================================================ */
(function () {
  'use strict';

  const prefersReducedMotion =
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- MOBILE MENU (native <dialog> modal, focus-trap included) ---------- */
  const menuOpen  = document.getElementById('menu-open');
  const menuClose = document.getElementById('menu-close');
  const menu      = document.getElementById('mobile-menu');
  if (menuOpen && menu && menuClose) {
    const open = () => {
      if (typeof menu.showModal === 'function') {
        menu.showModal();
      } else {
        menu.setAttribute('open', '');
      }
      menuOpen.setAttribute('aria-expanded', 'true');
      const firstLink = menu.querySelector('a');
      if (firstLink) firstLink.focus();
    };
    const close = () => {
      if (menu.open && typeof menu.close === 'function') {
        menu.close();
      } else {
        menu.removeAttribute('open');
      }
      menuOpen.setAttribute('aria-expanded', 'false');
      menuOpen.focus();
    };
    menuOpen.addEventListener('click', open);
    menuClose.addEventListener('click', close);
    menu.addEventListener('close', () => menuOpen.setAttribute('aria-expanded', 'false'));
    menu.addEventListener('click', (e) => { if (e.target === menu) close(); });
  }

  /* ---------- HERO SLIDER (wrapped in a nested IIFE so early-exit is scoped) ---------- */
  (function initHeroSlider () {
    const slider = document.querySelector('[data-hero-slider]');
    if (!slider) return;
    const slides = Array.from(slider.querySelectorAll('.hero-slide'));
    const dots   = Array.from(slider.querySelectorAll('.hero-dot'));
    const prev   = slider.querySelector('[data-hero-prev]');
    const next   = slider.querySelector('[data-hero-next]');
    const count  = slider.querySelector('[data-hero-count]');
    const controls = slider.querySelector('.hero-controls');
    // Full-bleed image backdrops — sit outside the centred wrap, crossfaded in sync.
    const backdrops = Array.from(document.querySelectorAll('.hero__backdrop'));
    let index = 0;
    let timer = null;
    const AUTOPLAY_MS = 7000;

    // If the CMS only returned one hero story, hide all the rotation chrome.
    if (slides.length < 2) {
      if (controls) controls.hidden = true;
      if (slides[0]) slides[0].setAttribute('aria-hidden', 'false');
      return; // no autoplay, no keyboard handlers
    }

    const show = (i) => {
      index = (i + slides.length) % slides.length;
      slides.forEach((s, idx) => {
        s.setAttribute('aria-hidden', idx === index ? 'false' : 'true');
      });
      dots.forEach((d, idx) => {
        d.setAttribute('aria-current', idx === index ? 'true' : 'false');
      });
      backdrops.forEach((b, idx) => {
        b.setAttribute('data-active', idx === index ? 'true' : 'false');
      });
      if (count) count.textContent = (index + 1) + ' / ' + slides.length;
    };
    const advance = () => show(index + 1);
    const retreat = () => show(index - 1);
    const start = () => {
      if (prefersReducedMotion) return;
      if (timer) return;
      timer = setInterval(advance, AUTOPLAY_MS);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    if (prev) prev.addEventListener('click', () => { retreat(); stop(); });
    if (next) next.addEventListener('click', () => { advance(); stop(); });
    dots.forEach((d, idx) => d.addEventListener('click', () => { show(idx); stop(); }));

    // Autoplay pauses on hover/focus (satisfies 2.2.2 via the arrow controls and focus-pause)
    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);

    // Keyboard arrows while focus is inside the slider
    document.addEventListener('keydown', (e) => {
      if (!document.activeElement || !slider.contains(document.activeElement)) return;
      if (e.key === 'ArrowLeft')  { retreat(); stop(); }
      if (e.key === 'ArrowRight') { advance(); stop(); }
    });

    show(0);
    start();
  })();

  /* ---------- TEXT-TO-SPEECH (Web Speech API — open, browser-native) ----------
     Three states: not speaking → playing → paused. Pause/Resume preserves position.
     Note: Chrome has a long-standing quirk where synthesis silently stops after
     ~15 seconds of continuous speech; the ping() hack below works around it.
  ------------------------------------------------------------------------------- */
  const tts = document.querySelector('[data-tts]');
  if (tts && 'speechSynthesis' in window) {
    const targetSel = tts.getAttribute('data-tts-target') || '.article__body';
    const target = document.querySelector(targetSel);
    const labelEl = tts.querySelector('.tts__label');
    let utterance = null;
    let chromeKeepAlive = null;

    const setLabel = (text) => { if (labelEl) labelEl.textContent = text; };
    const setState = (state) => {
      // state: 'idle' | 'playing' | 'paused'
      // Short labels to keep the button compact; aria-label carries the fuller meaning.
      switch (state) {
        case 'playing':
          tts.setAttribute('aria-pressed', 'true');
          setLabel('Παύση');
          tts.setAttribute('aria-label', 'Παύση ανάγνωσης άρθρου');
          break;
        case 'paused':
          tts.setAttribute('aria-pressed', 'true');
          setLabel('Συνέχεια');
          tts.setAttribute('aria-label', 'Συνέχεια ανάγνωσης άρθρου');
          break;
        default: // idle
          tts.setAttribute('aria-pressed', 'false');
          setLabel('Ανάγνωση');
          tts.setAttribute('aria-label', 'Ακούστε την ανάγνωση του άρθρου');
      }
    };

    const stopKeepAlive = () => {
      if (chromeKeepAlive) { clearInterval(chromeKeepAlive); chromeKeepAlive = null; }
    };
    const startKeepAlive = () => {
      stopKeepAlive();
      chromeKeepAlive = setInterval(() => {
        // Chrome quirk: if speaking but no pause in ~14 s, synthesis silently stops.
        // pause/resume combo keeps the queue alive without skipping.
        if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
          window.speechSynthesis.pause();
          window.speechSynthesis.resume();
        }
      }, 12000);
    };

    const hardStop = () => {
      stopKeepAlive();
      window.speechSynthesis.cancel();
      setState('idle');
    };

    const collectText = () => {
      if (!target) return '';
      const title = document.querySelector('.article__title');
      const stand = document.querySelector('.article__standfirst');
      const parts = [];
      if (title) parts.push(title.textContent.trim());
      if (stand) parts.push(stand.textContent.trim());
      target.querySelectorAll('p, h2, h3, blockquote').forEach((el) => {
        if (!el.closest('.ad')) parts.push(el.textContent.trim());
      });
      return parts.filter(Boolean).join('. ');
    };

    const startSpeaking = () => {
      const text = collectText();
      if (!text) return;
      utterance = new SpeechSynthesisUtterance(text);
      utterance.lang  = 'el-GR';
      utterance.rate  = 1.0;
      utterance.pitch = 1.0;
      const voices = window.speechSynthesis.getVoices();
      const greek = voices.find((v) => v.lang && v.lang.toLowerCase().startsWith('el'));
      if (greek) utterance.voice = greek;

      utterance.onend   = () => { stopKeepAlive(); setState('idle'); };
      utterance.onerror = () => { stopKeepAlive(); setState('idle'); };

      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
      startKeepAlive();
      setState('playing');
    };

    tts.addEventListener('click', () => {
      const synth = window.speechSynthesis;
      if (!synth.speaking) {
        // Fresh start
        startSpeaking();
      } else if (synth.paused) {
        // Resume from where we paused
        synth.resume();
        startKeepAlive();
        setState('playing');
      } else {
        // Pause (preserves position)
        stopKeepAlive();
        synth.pause();
        setState('paused');
      }
    });

    // Make sure voices are loaded before first click in Chromium
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.onvoiceschanged = () => {};
    }

    // Stop cleanly when the user navigates away
    window.addEventListener('pagehide', hardStop);
    window.addEventListener('beforeunload', hardStop);
  } else if (tts) {
    tts.style.display = 'none';
  }

  /* ---------- READER MODE (in-site clean view) ---------- */
  const readerBtn = document.querySelector('[data-reader-toggle]');
  if (readerBtn) {
    const label = readerBtn.querySelector('.reader-btn__label');
    const apply = (on) => {
      document.body.classList.toggle('reader-mode', on);
      readerBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (label) label.textContent = on ? 'Έξοδος από ανάγνωση' : 'Λειτουργία ανάγνωσης';
      if (on) window.scrollTo({ top: 0, behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    };
    readerBtn.addEventListener('click', () => {
      apply(!document.body.classList.contains('reader-mode'));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('reader-mode')) apply(false);
    });
  }

  /* ---------- READING FOCUS (hover dim, now filter-based + excludes masthead) ---------- */
  const articleBody = document.querySelector('.article__body');
  if (articleBody && !prefersReducedMotion) {
    const supportsHover = window.matchMedia('(hover: hover)').matches;
    if (supportsHover) {
      // Apply to the whole article container, not just the body text,
      // so the focus state turns on/off predictably.
      const article = articleBody.closest('.article') || articleBody;
      let raf = null;
      const enter = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => document.body.classList.add('reading-focus'));
      };
      const leave = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(() => document.body.classList.remove('reading-focus'));
      };
      article.addEventListener('mouseenter', enter);
      article.addEventListener('mouseleave', leave);
    }
  }
})();
