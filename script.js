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
  const toFa = (n) => String(n).replace(
