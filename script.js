(function () {
  'use strict';

  const stage        = document.getElementById('stage');
  const slides       = Array.from(stage.querySelectorAll('.slide'));
  const toc          = document.getElementById('toc');
  const crumb        = document.getElementById('crumbCurrent');
  const counter      = document.getElementById('counter');
  const progressFill = document.getElementById('progressFill');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');

  const sidebar      = document.getElementById('sidebar');
  const backdrop     = document.getElementById('sidebarBackdrop');
  const menuToggle   = document.getElementById('menuToggle');

  const overlay      = document.getElementById('modalOverlay');
  const modalTitle   = document.getElementById('modalTitle');
  const modalBody    = document.getElementById('modalBody');
  const modalClose   = document.getElementById('modalClose');

  let current = 0;
  let lastFocused = null;

  /* ---------- اعداد فارسی ---------- */
  const FA_DIGITS = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
  const toFa = (n) => String(n).replace(/\d/g, (d) => FA_DIGITS[+d]);

  /* ---------- رندر MathJax ---------- */
  function typeset(nodes) {
    if (window.MathJax && window.MathJax.typesetPromise) {
      window.MathJax.typesetPromise(nodes).catch(() => {});
    }
  }

  /* ---------- ساخت فهرست سایدبار ---------- */
  slides.forEach((slide, i) => {
    const label = slide.dataset.nav || slide.dataset.title || ('اسلاید ' + (i + 1));
    const li = document.createElement('li');
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.innerHTML = '<span class="idx"></span><span class="txt"></span>';
    btn.querySelector('.idx').textContent = toFa(i + 1);
    btn.querySelector('.txt').textContent = label;
    btn.addEventListener('click', () => {
      goTo(i);
      if (window.matchMedia('(max-width: 860px)').matches) closeSidebar();
    });
    li.appendChild(btn);
    toc.appendChild(li);
  });
  const tocItems = Array.from(toc.children);

  /* ---------- جابه‌جایی اسلاید ---------- */
  function goTo(index) {
    if (index < 0 || index >= slides.length) return;
    slides[current].classList.remove('active');
    tocItems[current].classList.remove('active');

    current = index;
    const slide = slides[current];
    slide.classList.add('active');
    tocItems[current].classList.add('active');

    crumb.textContent = slide.dataset.title || slide.dataset.nav || '';
    counter.textContent = toFa(current + 1) + ' / ' + toFa(slides.length);
    progressFill.style.width = ((current + 1) / slides.length * 100) + '%';

    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;

    stage.scrollTo({ top: 0, behavior: 'smooth' });
    tocItems[current].scrollIntoView({ block: 'nearest', behavior: 'smooth' });

    typeset([slide]);
    history.replaceState(null, '', '#' + (current + 1));
  }

  const next = () => goTo(Math.min(current + 1, slides.length - 1));
  const prev = () => goTo(Math.max(current - 1, 0));

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  /* ---------- پاپ‌آپ ---------- */
  function buildBody(raw) {
    modalBody.innerHTML = '';
    const parts = String(raw)
      .split(/\n|\u2022|;/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (parts.length > 1) {
      const ul = document.createElement('ul');
      parts.forEach((p) => {
        const li = document.createElement('li');
        li.textContent = p.replace(/^[-–—]\s*/, '');
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
    modalTitle.textContent = title || '';
    buildBody(body || '');
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';
    modalClose.focus();
    typeset([modalBody, modalTitle]);
  }

  function closeModal() {
    if (overlay.hidden) return;
    overlay.hidden = true;
    document.body.style.overflow = '';
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.pop-btn');
    if (btn) {
      openModal(btn.dataset.modalTitle, btn.dataset.modalBody);
    }
  });

  modalClose.addEventListener('click', closeModal);
  overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });

  /* ---------- سایدبار موبایل ---------- */
  function openSidebar() {
    sidebar.classList.add('open');
    backdrop.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
  }
  function closeSidebar() {
    sidebar.classList.remove('open');
    backdrop.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
  }
  menuToggle.addEventListener('click', () => {
    sidebar.classList.contains('open') ? closeSidebar() : openSidebar();
  });
  backdrop.addEventListener('click', closeSidebar);

  /* ---------- کیبورد (RTL: چپ = بعدی) ---------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!overlay.hidden) { closeModal(); return; }
      if (sidebar.classList.contains('open')) { closeSidebar(); return; }
    }
    if (!overlay.hidden) return;

    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    switch (e.key) {
      case 'ArrowLeft':  e.preventDefault(); next(); break;
      case 'ArrowRight': e.preventDefault(); prev(); break;
      case 'PageDown':
      case ' ':          e.preventDefault(); next(); break;
      case 'PageUp':     e.preventDefault(); prev(); break;
      case 'Home':       e.preventDefault(); goTo(0); break;
      case 'End':        e.preventDefault(); goTo(slides.length - 1); break;
      default: break;
    }
  });

  /* ---------- سوایپ لمسی ---------- */
  let touchX = null, touchY = null;
  stage.addEventListener('touc); goTo(slides.length - 1); break;
      default: break;
    }
  });

  /* ---------- سوایپ لمسی ---------- */
  let touchX = null, touchY = null;
  stage.addEventListener('toucnst dy = e.changedTouches[0].clientY - touchY;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      dx < 0 ? next() : prev();
    }
    touchX = touchY = null;
  }, { passive: true });

  /* ---------- شروع ---------- */
  const fromHash = parseInt((location.hash || '').replace('#', ''), 10);
  goTo(Number.isInteger(fromHash) && fromHash >= 1 && fromHash <= slides.length ? fromHash - 1 : 0);
})();
