/* =========================================================
   Presentation controller: breadcrumb, sidebar, modals, keys
   ========================================================= */
(function () {
  'use strict';

  const slides      = Array.prototype.slice.call(document.querySelectorAll('.slide'));
  const tocLinks    = Array.prototype.slice.call(document.querySelectorAll('#toc a'));
  const crumb       = document.getElementById('crumbCurrent');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const progressBar = document.getElementById('progressBar');
  const sidebar     = document.getElementById('sidebar');
  const sidebarBtn  = document.getElementById('sidebarToggle');
  const backdrop    = document.getElementById('sidebarBackdrop');
  const overlay     = document.getElementById('modalOverlay');
  const modalTitle  = document.getElementById('modalTitle');
  const modalBody   = document.getElementById('modalBody');
  const modalClose  = document.getElementById('modalClose');

  let current = 0;
  let lastFocused = null;

  /* ---------------- Active slide state ---------------- */
  function setActive(index) {
    if (index < 0) index = 0;
    if (index > slides.length - 1) index = slides.length - 1;
    current = index;

    crumb.textContent = slides[current].getAttribute('data-title') || '';

    tocLinks.forEach(function (link, i) {
      const on = (i === current);
      link.classList.toggle('active', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    prevBtn.disabled = (current === 0);
    nextBtn.disabled = (current === slides.length - 1);
    progressi === current);
      link.classList.toggle('active', on);
      if (on) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    });

    prevBtn.disabled = (current === 0);
    nextBtn.disabled = (current === slides.length - 1);
    progressBar.style.width = ((current + 1) / slides.length * 100) + '%';
  }

  function goTo(index) {ersectionObserver(function (entries) {
    let best = null;
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      if (!best || e.intersectionRatio > best.intersectionRatio) best = e;
    });
    if (best) {
      const i = slides.indexOf(best.target);
      if (i !== -1 && i !== current) setActive(i);
    }
  }, { rootMargin: '-25% 0px -55% 0px', threshold: ---------------- Sidebar ---------------- */0.75] });

  slides.forEach(function (s) { spy.observe(s); });

  /* ---------------- Sidebar ---------------- */
  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.hidden = false;
    sidebarBtn.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    if (!sidebar.classList.contains('open')) return;
    sidebar.classList.remove('open');
    backdrop.hidden = true;
    sidebarBtn.setAttribute('aria-expanded', 'false');
  }
  sidebarBtn.addEventListener('click', function () {
    if (sidebar.classList.contains('open')) closeSidebar();
    else openSidebar();
  });
  backdrop.addEventListener('click', closeSidebar);

  tocLinks.forEach(function (link) {
    link.addEventListener('click', function (ev) {
      ev.preventDefault();
      goTo(parseInt(link.getAttribute('data-index'), 10));
    });
  });

  /* ---------------- Nav buttons ---------------- */
  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });

  /* ---------------- Modals ---------------- */
  function buildBody(raw) {
    modalBody.textContent = '';
    const parts = String(raw || '').split('||')
      .map(function (s) { return s.trim(); })
      .filter(function (s) { return s.length > 0; });

    if (parts.length > 1) {
      const ul = document.createElement('ul');
      parts.forEach(function (p) {
        const li = document.createElement('li');
        li.textContent = p;
        ul.appendChild(li);
      });
      modalBody.appendChild(ul);
    } else {
      const p = document.createElement('p');
      p.textContent = parts[0] || '';
      modalBody.appendChild(p);
    }
  }

  function openModal(title, body) {
    lastFocused = document.activeElement;
    modalTitle.textContent = title;
    buildBody(body);
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise([modalBody]).catch(function () {});
    }
  }

  function closeModal() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.addEventListener('click', function (ev) {
    const btn = ev.target.closest ? ev.target.closest('.popup-btn') : null;
    if (btn) {
      openModal(btn.getAttribute('data-modal-title') || '',
                btn.getAttribute('data-modal-body') || '');
    }
  });

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', function (ev) {
    if (ev.target === overlay) closeModal();
  });

  /* Focus trap */
  overlay.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Tab') return;
    const f = overlay.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
    if (!f.length) return;
    const first = f[0], last = f[f.length - 1];
    if (ev.shiftKey && document.activeElement === first) { ev.preventDefault(); last.focus(); }
    else if (!ev.shiftKey && document.activeElement === last) { ev.preventDefault(); first.focus(); }
  });

  /* ---------------- Keyboard ---------------- */
  document.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') {
      if (!overlay.hidden) { closeModal(); return; }
      closeSidebar();
      return;
    }

    if (!overlay.hidden) return;

    const tag = (document.activeElement && document.activeElement.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    /* RTL: ArrowLeft => next, ArrowRight => previous */
    switch (ev.key) {
      case 'ArrowLeft':
      case 'PageDown':
      case 'ArrowDown':
        ev.preventDefault(); goTo(current + 1); break;
      case 'ArrowRight':
      case 'PageUp':
      case 'ArrowUp':
        ev.preventDefault(); goTo(current - 1); break;
      case 'Home':
        ev.preventDefault(); goTo(0); break;
      case 'End':
        ev.preventDefault(); goTo(slides.length - 1); break;
      case ' ':
      case 'Enter':
        if (document.activeElement === document.body) { ev.preventDefault(); goTo(current + 1); }
        break;
    }
  });

  /* ---------------- Init ---------------- */
  function init() {
    const hash = window.location.hash;
    let start = 0;
    if (hash) {
      const target = document.querySelector(hash);
      const i = slides.indexOf(target);
      if (i !== -1) start = i;
    }
    setActive(start);
    if (start > 0) {
      slides[start].scrollIntoView({ behavior: 'auto', block: 'start' });
    }
  }

  init();
})();
