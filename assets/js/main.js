(() => {
  'use strict';
  function init() {
    const header = document.getElementById('site-header');
    const nav = document.getElementById('primary-nav');
    const toggle = document.querySelector('.nav-toggle');
    const year = document.getElementById('current-year');
    const mobile = window.matchMedia('(max-width: 900px)');
    if (year) year.textContent = new Date().getFullYear();

    function setMenu(open, restoreFocus = false) {
      if (!nav || !toggle) return;
      open = open && mobile.matches;
      nav.classList.toggle('open', open);
      document.body.classList.toggle('nav-open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
      const icon = toggle.querySelector('i');
      if (icon) {
        icon.classList.toggle('bi-list', !open);
        icon.classList.toggle('bi-x', open);
        icon.setAttribute('aria-hidden', 'true');
      }
      if (restoreFocus) toggle.focus();
    }
    if (nav && toggle) {
      setMenu(false);
      toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
      nav.addEventListener('click', event => {
        const link = event.target.closest('a[href]');
        if (!link) return;
        const wasOpen = nav.classList.contains('open');
        setMenu(false);
        const target = link.hash && document.getElementById(link.hash.slice(1));
        if (wasOpen && target) {
          const temporary = !target.hasAttribute('tabindex');
          if (temporary) target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          if (temporary) target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
        }
      });
      document.addEventListener('keydown', event => {
        if (event.key === 'Escape' && nav.classList.contains('open')) setMenu(false, true);
      });
      function closeOutside(event) {
        if (nav.classList.contains('open') && !nav.contains(event.target) && !toggle.contains(event.target)) setMenu(false);
      }
      document.addEventListener('click', closeOutside);
      document.addEventListener('focusin', closeOutside);
      mobile.addEventListener('change', () => setMenu(false, mobile.matches && nav.contains(document.activeElement)));
    }

    const items = nav ? Array.from(nav.querySelectorAll('a[href^="#"]')).map(link => ({
      link, section: document.getElementById(link.hash.slice(1))
    })).filter(item => item.section) : [];
    function update() {
      header?.classList.toggle('scrolled', window.scrollY > 20);
      const marker = (header?.offsetHeight || 76) + 32;
      let current = null;
      let closest = -Infinity;
      items.forEach(item => {
        const top = item.section.getBoundingClientRect().top;
        if (top <= marker && top > closest) {
          current = item.link;
          closest = top;
        }
      });
      items.forEach(({ link }) => {
        const active = link === current;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }
    let scheduled = false;
    function schedule() {
      if (scheduled) return;
      scheduled = true;
      window.requestAnimationFrame(() => { scheduled = false; update(); });
    }
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('load', schedule);
    update();

    const reveals = document.querySelectorAll('.reveal');
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
      reveals.forEach(element => element.classList.add('visible'));
    } else {
      const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.08 });
      reveals.forEach(element => observer.observe(element));
      document.addEventListener('focusin', event => {
        const element = event.target.closest('.reveal');
        if (element) { element.classList.add('visible'); observer.unobserve(element); }
      });
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
