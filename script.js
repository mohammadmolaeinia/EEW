/* ==========================================================================
   EEW Presentation SPA — script.js
   ========================================================================== */

(() => {
  'use strict';

  /* ── DOM refs ─────────────────────────────────────────────────── */
  const slidesWrap           = document.getElementById('slides');
  const presentationNav      = document.getElementById('presentationNav');
  const presentationNavItems = document.getElementById('presentationNavItems');
  const agendaList           = document.getElementById('agendaList');
  const startPresentation    = document.getElementById('startPresentation');
  const homeButton           = document.getElementById('homeButton');
  const agendaHomeButton     = document.getElementById('agendaHomeButton');
  const modal                = document.getElementById('modal');
  const modalTitle           = document.getElementById('modalTitle');
  const modalBody            = document.getElementById('modalBody');
  const modalClose           = document.getElementById('modalClose');
  const modalStore           = document.getElementById('modalStore');

  /* ── State ────────────────────────────────────────────────────── */
  const slides = Array.from(slidesWrap.querySelectorAll('.slide'));
  const cover = document.getElementById('s1');
  const agenda = document.getElementById('agenda');
  const contentSlides = slides.filter(slide => slide !== cover && slide !== agenda);
  let current = -1;

  /* ── Persian numerals ─────────────────────────────────────────── */
  const toPersian = n =>
    String(n).replace(/\d/g, d => '۰۱۲۳۴۵۶۷۸۹'[d]);

  function groupStudySections(section) {
    let group = null;

    Array.from(section.children).forEach(child => {
      if (child.matches('.slide__kicker')) {
        group = document.createElement('div');
        group.className = 'study-section';
        section.insertBefore(group, child);
      }

      if (group) group.appendChild(child);
    });
  }

  groupStudySections(document.getElementById('s3'));
  groupStudySections(document.getElementById('s4'));

  function setActiveSlide(target) {
    slides.forEach(slide => slide.classList.toggle('is-active', slide === target));
  }

  function setNavigationVisibility(isVisible) {
    presentationNav.hidden = !isVisible;
    document.body.classList.toggle('is-cover', !isVisible);
  }

  function scrollToTop(behavior = 'smooth') {
    window.scrollTo({ top: 0, behavior });
  }

  function updateContentMeta() {
    Array.from(presentationNavItems.children).forEach((item, index) => {
      const isCurrent = index === current;
      item.classList.toggle('is-active', isCurrent);
      item.setAttribute('aria-current', isCurrent ? 'page' : 'false');
    });
  }

  function showCover() {
    current = -1;
    setActiveSlide(cover);
    setNavigationVisibility(false);
    scrollToTop('auto');
  }

  function showAgenda() {
    current = -1;
    setActiveSlide(agenda);
    setNavigationVisibility(false);
    Array.from(presentationNavItems.children).forEach(item => {
      item.classList.remove('is-active');
      item.setAttribute('aria-current', 'false');
    });
    scrollToTop();
  }

  function showContent(index) {
    current = Math.max(0, Math.min(index, contentSlides.length - 1));
    setActiveSlide(contentSlides[current]);
    setNavigationVisibility(true);
    updateContentMeta();
    scrollToTop();
  }

  function buildNavigation() {
    contentSlides.forEach((slide, index) => {
      const label = slide.dataset.nav || `Slide ${index + 1}`;
      const navItem = document.createElement('button');
      navItem.type = 'button';
      navItem.className = 'presentation-nav__item';
      navItem.textContent = label;
      navItem.addEventListener('click', () => showContent(index));
      presentationNavItems.appendChild(navItem);

      const agendaItem = document.createElement('button');
      agendaItem.type = 'button';
      agendaItem.className = 'agenda__item';
      agendaItem.innerHTML = `
        <span class="agenda__number">${toPersian(index + 1)}</span>
        <span class="agenda__label"></span>
      `;
      agendaItem.querySelector('.agenda__label').textContent = label;
      agendaItem.addEventListener('click', () => showContent(index));
      agendaList.appendChild(agendaItem);
    });
  }

  buildNavigation();
  startPresentation.addEventListener('click', showAgenda);
  homeButton.addEventListener('click', showCover);
  agendaHomeButton.addEventListener('click', showCover);

  document.addEventListener('keydown', e => {
    if (modal.classList.contains('is-open') || current < 0) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      current === 0 ? showAgenda() : showContent(current - 1);
    }
    if ((e.key === 'ArrowLeft' || e.key === 'ArrowDown') && current < contentSlides.length - 1) {
      showContent(current + 1);
    }
  });

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

  document.addEventListener('click', event => {
    const button = event.target instanceof Element
      ? event.target.closest('[data-modal]')
      : null;
    if (!button) return;

    event.preventDefault();
    openModal(button.dataset.modal);
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
  showCover();

})();
