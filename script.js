/* ==========================================================================
   EEW Presentation SPA — script.js
   ========================================================================== */

(() => {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────────────── */
  const menuToggle   = document.getElementById('menuToggle');
  const scrim        = document.getElementById('scrim');
  const sidebar      = document.getElementById('sidebar');
  const sidebarNav   = document.getElementById('sidebarNav');
  const breadcrumb   = document.getElementById('breadcrumb');
  const progressBar  = document.getElementById('progressBar');
  const slidesWrap   = document.getElementById('slides');
  const prevBtn      = document.getElementById('prevBtn');
  const nextBtn      = document.getElementById('nextBtn');
  const slideCounter = document.getElementById('slideCounter');
  const modal        = document.getElementById('modal');
  const modalTitle   = document.getElementById('modalTitle');
  const modalBody    = document.getElementById('modalBody');
  const modalClose   = document.getElementById('modalClose');
  const modalStore   = document.getElementById('modalStore');

  /* ── State ────────────────────────────────────────────────────── */
  const slides = Array.from(slidesWrap.querySelectorAll('.slide'));
  let current  = 0;

  /* ── Persian numerals ─────────────────────────────────────────── */
  const toPersian = n =>
    String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

  /* ── Build sidebar nav ────────────────────────────────────────── */
  slides.forEach((slide, i) => {
    const label = slide.dataset.nav || `اسلاید ${toPersian(i + 1)}`;
    const btn   = document.createElement('button');
    btn.type      = 'button';
    btn.className = 'nav-item';
    btn.innerHTML = `
      <span class="nav-item__num">${toPersian(i + 1)}</span>
      <span class="nav-item__label">${label}</span>
    `;
    btn.addEventListener('click', () => {
      goTo(i);
      closeSidebar();
    });
    sidebarNav.appendChild(btn);
  });

  /* ── Go to slide ──────────────────────────────────────────────── */
  function goTo(index) {
    slides[current].classList.remove('is-active');
    sidebarNav.children[current].classList.remove('is-active');

    current = Math.max(0, Math.min(index, slides.length - 1));

    slides[current].classList.add('is-active');
    sidebarNav.children[current].classList.add('is-active');

    updateMeta();
    slides[current].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  /* ── Update breadcrumb / progress / counter / buttons ────────── */
  function updateMeta() {
    const total   = slides.length;
    const pct     = Math.round(((current + 1) / total) * 100);

    /* progress bar */
    progressBar.style.width = pct + '%';
    document.getElementById('progress')
      .setAttribute('aria-valuenow', pct);

    /* counter */
    slideCounter.textContent =
      `${toPersian(current + 1)} / ${toPersian(total)}`;

    /* buttons */
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === total - 1;

    /* breadcrumb */
    const crumb = slides[current].dataset.crumb || '';
    breadcrumb.innerHTML = `
      <span class="breadcrumb__item">ارائه</span>
      <span class="breadcrumb__sep">›</span>
      <span class="breadcrumb__item is-current">${crumb}</span>
    `;
  }

  /* ── Prev / Next buttons ──────────────────────────────────────── */
  prevBtn.addEventListener('click', () => goTo(current - 1));
  nextBtn.addEventListener('click', () => goTo(current + 1));

  /* ── Keyboard navigation ──────────────────────────────────────── */
  document.addEventListener('keydown', e => {
    if (modal.classList.contains('is-open')) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp')   goTo(current - 1);
    if (e.key === 'ArrowLeft'  || e.key === 'ArrowDown')  goTo(current + 1);
  });

  /* ── Sidebar toggle ───────────────────────────────────────────── */
  function openSidebar() {
    sidebar.classList.add('is-open');
    scrim.hidden = false;
    scrim.classList.add('is-open');
    menuToggle.setAttribute('aria-expanded', 'true');
    // scroll active item into view
    sidebarNav.children[current]?.scrollIntoView({ block: 'nearest' });
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    scrim.hidden = true;
    scrim.classList.remove('is-open');
    menuToggle.setAttribute('aria-expanded', 'false');
  }

  menuToggle.addEventListener('click', () => {
    sidebar.classList.contains('is-open') ? closeSidebar() : openSidebar();
  });

  scrim.addEventListener('click', closeSidebar);

  /* ── Modal ────────────────────────────────────────────────────── */
  function openModal(id) {
    const tpl = modalStore.querySelector(`[data-modal-id="${id}"]`);
    if (!tpl) return;
    modalTitle.textContent = tpl.dataset.modalTitle || '';
    modalBody.innerHTML    = '';
    modalBody.appendChild(tpl.content.cloneNode(true));
    modal.classList.add('is-open');
    modalClose.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  /* delegate info-btn clicks inside slides */
  slidesWrap.addEventListener('click', e => {
    const btn = e.target.closest('[data-modal]');
    if (btn) openModal(btn.dataset.modal);
  });

  modalClose.addEventListener('click', closeModal);

  /* click outside dialog closes modal */
  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  /* Escape key */
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && modal.classList.contains('is-open')) {
      closeModal();
    }
  });

  /* ── Init ─────────────────────────────────────────────────────── */
  goTo(0);

})();
