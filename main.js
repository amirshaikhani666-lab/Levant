/* ===========================
   LEVANT LAW FIRM — main.js
   =========================== */

'use strict';

// ── Page Navigation ──────────────────────────────────────────────────────────

/**
 * Show a page by id and update active nav link.
 * @param {string} id - page key: 'home' | 'about' | 'services' | 'team' | 'news' | 'contact'
 */
function showPage(id) {
  // Hide all pages
  document.querySelectorAll('.page').forEach(function (p) {
    p.classList.remove('active');
  });

  // Show target page
  var target = document.getElementById('page-' + id);
  if (target) target.classList.add('active');

  // Update nav link active state
  document.querySelectorAll('.nav-link').forEach(function (a) {
    a.classList.remove('active');
    if (a.dataset.page === id) a.classList.add('active');
  });

  // Scroll to top
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ── Mobile Menu ───────────────────────────────────────────────────────────────

function toggleMobile() {
  var menu = document.getElementById('navMobile');
  if (menu) menu.classList.toggle('open');
}

function closeMobile() {
  var menu = document.getElementById('navMobile');
  if (menu) menu.classList.remove('open');
}

// Close mobile menu when clicking outside
document.addEventListener('click', function (e) {
  var menu   = document.getElementById('navMobile');
  var toggle = document.getElementById('navToggle');
  if (menu && toggle && !menu.contains(e.target) && !toggle.contains(e.target)) {
    menu.classList.remove('open');
  }
});

// ── Responsive Stats Grid ────────────────────────────────────────────────────

function updateStatsGrid() {
  var grid = document.querySelector('.stats-grid');
  if (!grid) return;
  if (window.innerWidth < 600) {
    grid.style.gridTemplateColumns = '1fr 1fr';
  } else {
    grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
  }
}

window.addEventListener('resize', updateStatsGrid);

// ── Contact Form ──────────────────────────────────────────────────────────────

function initContactForm() {
  var btn = document.getElementById('submitBtn');
  if (!btn) return;

  btn.addEventListener('click', function (e) {
    e.preventDefault();

    var name    = document.getElementById('fieldName');
    var email   = document.getElementById('fieldEmail');
    var phone   = document.getElementById('fieldPhone');
    var service = document.getElementById('fieldService');
    var message = document.getElementById('fieldMessage');

    // Simple validation
    var valid = true;

    [name, email, message].forEach(function (field) {
      if (!field) return;
      if (!field.value.trim()) {
        field.style.borderColor = '#c0392b';
        valid = false;
      } else {
        field.style.borderColor = '';
      }
    });

    if (email && email.value && !email.value.includes('@')) {
      email.style.borderColor = '#c0392b';
      valid = false;
    }

    if (!valid) {
      showFormMessage('يرجى ملء جميع الحقول المطلوبة بشكل صحيح.', 'error');
      return;
    }

    // Simulate sending (replace with real fetch to your backend)
    btn.disabled = true;
    btn.textContent = 'جارٍ الإرسال…';

    setTimeout(function () {
      showFormMessage('تم إرسال طلبك بنجاح. سنتواصل معك قريباً.', 'success');
      btn.disabled   = false;
      btn.textContent = 'إرسال الاستفسار';
      if (name)    name.value    = '';
      if (email)   email.value   = '';
      if (phone)   phone.value   = '';
      if (service) service.value = '';
      if (message) message.value = '';
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
    'padding: 12px 16px',
    'font-size: 13px',
    'margin-top: 0.5rem',
    'border-right: 3px solid ' + (type === 'success' ? '#1b4332' : '#c0392b'),
    'background: ' + (type === 'success' ? 'rgba(27,67,50,0.06)' : 'rgba(192,57,43,0.06)'),
    'color: ' + (type === 'success' ? '#1b4332' : '#c0392b'),
    'transition: opacity 0.3s',
  ].join(';');

  var form = document.querySelector('.contact-form');
  if (form) form.appendChild(msg);

  // Auto-hide after 5 seconds
  setTimeout(function () {
    if (msg.parentNode) {
      msg.style.opacity = '0';
      setTimeout(function () { if (msg.parentNode) msg.remove(); }, 300);
    }
  }, 5000);
}

// ── Nav link data-page wiring ─────────────────────────────────────────────────

function initNavLinks() {
  document.querySelectorAll('[data-page]').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      var page = el.dataset.page;
      showPage(page);
      closeMobile();
    });
  });
}

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  updateStatsGrid();
  initContactForm();
  initNavLinks();
});

// ── Animated Number Counters ─────────────────────────────────────────────────

function animateCounters(scope) {
  var els = (scope || document).querySelectorAll('.animate-count .stat-num[data-target]');
  els.forEach(function (el) {
    var target  = parseInt(el.dataset.target, 10);
    var prefix  = el.dataset.prefix || '';
    var duration = 1400;
    var start   = null;

    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      // Ease out cubic
      var ease = 1 - Math.pow(1 - progress, 3);
      var current = Math.floor(ease * target);
      el.textContent = prefix + current;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = prefix + target;
    }

    requestAnimationFrame(step);
  });
}

// ── Intersection Observer for counters ───────────────────────────────────────

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

// ── Re-trigger stagger on page change ────────────────────────────────────────

var _origShowPage = showPage;
showPage = function (id) {
  _origShowPage(id);
  // Re-trigger stagger by forcing reflow
  var page = document.getElementById('page-' + id);
  if (!page) return;
  var staggerEls = page.querySelectorAll('.stagger-in');
  staggerEls.forEach(function (el) {
    el.style.animation = 'none';
    el.offsetHeight; // reflow
    el.style.animation = '';
  });
  // Re-trigger counters on about and home pages
  setTimeout(function () { animateCounters(page); }, 200);
};

// ── Init ──────────────────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', function () {
  updateStatsGrid();
  initContactForm();
  initNavLinks();
  initCounterObserver();
});
