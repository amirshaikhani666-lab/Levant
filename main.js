/* ===========================
   LEVANT LAW FIRM — main.js
   Bilingual AR / EN
   =========================== */

'use strict';

/* ── Language State ─────────────────────────────────────────────────────── */

var currentLang = 'ar';

function applyLang(lang) {
  currentLang = lang;
  var isAr = lang === 'ar';

  /* 1. html dir + lang */
  var html = document.documentElement;
  html.setAttribute('lang', isAr ? 'ar' : 'en');
  html.setAttribute('dir', isAr ? 'rtl' : 'ltr');
  html.setAttribute('data-lang', lang);

  /* 2. All [data-ar] / [data-en] spans — render innerHTML */
  document.querySelectorAll('[data-ar][data-en]').forEach(function (el) {
    el.innerHTML = isAr ? el.dataset.ar : el.dataset.en;
  });

  /* 3. Placeholders with data-placeholder-ar / en */
  document.querySelectorAll('[data-placeholder-ar]').forEach(function (el) {
    el.placeholder = isAr ? el.dataset.placeholderAr : el.dataset.placeholderEn;
  });

  /* 4. <select> options that carry data-ar / data-en */
  document.querySelectorAll('select option[data-ar]').forEach(function (opt) {
    opt.textContent = isAr ? opt.dataset.ar : opt.dataset.en;
  });

  /* 5. Lang-toggle button visibility */
  document.querySelectorAll('.lang-ar').forEach(function (el) {
    el.style.display = isAr ? '' : 'none';
  });
  document.querySelectorAll('.lang-en').forEach(function (el) {
    el.style.display = isAr ? 'none' : '';
  });

  /* 6. font — swap to Cormorant for English headings */
  document.body.classList.toggle('lang-en-active', !isAr);

  /* 7. Persist */
  try { localStorage.setItem('levant_lang', lang); } catch(e) {}
}

function toggleLang() {
  applyLang(currentLang === 'ar' ? 'en' : 'ar');
}

/* ── Page Navigation ──────────────────────────────────────────────────────── */

function showPage(id) {
  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.remove('active');
  });

  var target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(function (a) {
    a.classList.remove('active');
    if (a.dataset.page === id) a.classList.add('active');
  });

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Mobile Menu ─────────────────────────────────────────────────────────── */

function toggleMobile() {
  var menu = document.getElementById('navMobile');
  if (menu) menu.classList.toggle('open');
}

function closeMobile() {
  var menu = document.getElementById('navMobile');
  if (menu) menu.classList.remove('open');
}

document.addEventListener('click', function (e) {
  var menu   = document.getElementById('navMobile');
  var toggle = document.getElementById('navToggle');
  if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('open');
  }
});

/* ── Responsive Stats Grid ──────────────────────────────────────────────── */

function updateStatsGrid() {
  var grid = document.querySelector('.stats-grid');
  if (!grid) return;
  grid.style.gridTemplateColumns = window.innerWidth < 600 ? '1fr 1fr' : 'repeat(4,1fr)';
}

window.addEventListener('resize', updateStatsGrid);

/* ── Contact Form ────────────────────────────────────────────────────────── */

function initContactForm() {
  var btn = document.getElementById('submitBtn');
  if (!btn) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();

    var name    = document.getElementById('fieldName');
    var email   = document.getElementById('fieldEmail');
    var message = document.getElementById('fieldMessage');
    var valid   = true;

    [name, email, message].forEach(function (f) {
      if (!f) return;
      if (!f.value.trim()) { f.style.borderColor = '#c0392b'; valid = false; }
      else f.style.borderColor = '';
    });

    if (email && email.value && !email.value.includes('@')) {
      email.style.borderColor = '#c0392b'; valid = false;
    }

    if (!valid) {
      showFormMessage(
        currentLang === 'ar'
          ? 'يرجى ملء جميع الحقول المطلوبة بشكل صحيح.'
          : 'Please fill in all required fields correctly.',
        'error'
      );
      return;
    }

    btn.disabled    = true;
    btn.querySelector('[data-ar]').innerHTML =
      currentLang === 'ar' ? 'جارٍ الإرسال…' : 'Sending…';

    setTimeout(function () {
      showFormMessage(
        currentLang === 'ar'
          ? 'تم إرسال طلبك بنجاح. سنتواصل معك قريباً.'
          : 'Your enquiry has been sent. We will be in touch shortly.',
        'success'
      );
      btn.disabled = false;
      applyLang(currentLang); // restore button text
      ['fieldName','fieldEmail','fieldPhone','fieldService','fieldMessage'].forEach(function(id){
        var el = document.getElementById(id);
        if (el) el.value = '';
      });
    }, 1200);
  });
}

function showFormMessage(text, type) {
  var existing = document.getElementById('formMsg');
  if (existing) existing.remove();

  var msg = document.createElement('div');
  msg.id = 'formMsg';
  msg.textContent = text;
  msg.style.cssText = [
    'padding:12px 16px',
    'font-size:13px',
    'margin-top:0.5rem',
    'border-right:3px solid ' + (type === 'success' ? '#1b4332' : '#c0392b'),
    'background:' + (type === 'success' ? 'rgba(27,67,50,0.06)' : 'rgba(192,57,43,0.06)'),
    'color:' + (type === 'success' ? '#1b4332' : '#c0392b'),
    'transition:opacity 0.3s'
  ].join(';');

  var form = document.querySelector('.contact-form');
  if (form) form.appendChild(msg);

  setTimeout(function () {
    if (msg.parentNode) {
      msg.style.opacity = '0';
      setTimeout(function () { if (msg.parentNode) msg.remove(); }, 300);
    }
  }, 5000);
}

/* ── Nav link wiring ─────────────────────────────────────────────────────── */

function initNavLinks() {
  document.querySelectorAll('[data-page]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      showPage(el.dataset.page);
      closeMobile();
    });
  });
}

/* ── Animated Number Counters ───────────────────────────────────────────── */

function animateCounters(scope) {
  var els = (scope || document).querySelectorAll('.animate-count .stat-num[data-target]');
  els.forEach(function (el) {
    var target   = parseInt(el.dataset.target, 10);
    var prefix   = el.dataset.prefix || '';
    var duration = 1400;
    var start    = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var ease     = 1 - Math.pow(1 - progress, 3);
      el.textContent = prefix + Math.floor(ease * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target;
    }
    requestAnimationFrame(step);
  });
}

function initCounterObserver() {
  if (!window.IntersectionObserver) return;
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters(entry.target.closest('.stats-strip, .about-stat') || entry.target.parentNode);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.animate-count').forEach(function (el) {
    observer.observe(el);
  });
}

/* ── Re-trigger stagger + counters on page change ───────────────────────── */

var _origShowPage = showPage;
showPage = function (id) {
  _origShowPage(id);
  var page = document.getElementById('page-' + id);
  if (!page) return;
  page.querySelectorAll('.stagger-in').forEach(function (el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = '';
  });
  setTimeout(function () { animateCounters(page); }, 200);
};

/* ── Init ────────────────────────────────────────────────────────────────── */

document.addEventListener('DOMContentLoaded', function () {
  /* Restore saved language or default AR */
  var saved = 'ar';
  try { saved = localStorage.getItem('levant_lang') || 'ar'; } catch(e) {}
  applyLang(saved);

  updateStatsGrid();
  initContactForm();
  initNavLinks();
  initCounterObserver();
});
