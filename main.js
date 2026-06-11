/* ===========================
   LEVANT LAW FIRM — main.js
   =========================== */

/* ── Language ── */
let currentLang = 'ar';

function toggleLang() {
  currentLang = currentLang === 'ar' ? 'en' : 'ar';
  applyLang(currentLang);
}

function applyLang(lang) {
  const html = document.documentElement;
  const body = document.body;

  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  html.setAttribute('data-lang', lang);

  if (lang === 'en') {
    body.classList.add('lang-en-active');
  } else {
    body.classList.remove('lang-en-active');
  }

  document.querySelectorAll('[data-ar][data-en]').forEach(el => {
    const val = el.getAttribute('data-' + lang);
    if (val !== null) el.innerHTML = val;
  });

  document.querySelectorAll('[data-placeholder-ar][data-placeholder-en]').forEach(el => {
    el.placeholder = el.getAttribute('data-placeholder-' + lang);
  });

  document.querySelectorAll('select option[data-ar][data-en]').forEach(opt => {
    opt.textContent = opt.getAttribute('data-' + lang) || opt.textContent;
  });
}

/* ── Page navigation ── */
function navigateTo(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-link').forEach(a => a.classList.remove('active'));

  const target = document.getElementById('page-' + page);
  if (target) {
    target.classList.add('active');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const activeLink = document.querySelector('.nav-link[data-page="' + page + '"]');
  if (activeLink) activeLink.classList.add('active');

  const mob = document.getElementById('navMobile');
  if (mob) {
    mob.classList.remove('open');
    document.body.classList.remove('nav-open');
  }
}

function toggleMobile() {
  const mob = document.getElementById('navMobile');
  if (!mob) return;
  const isOpen = mob.classList.toggle('open');
  document.body.classList.toggle('nav-open', isOpen);
}

// Close drawer when clicking backdrop
document.addEventListener('click', function(e) {
  const mob = document.getElementById('navMobile');
  const toggle = document.querySelector('.nav-toggle');
  if (mob && mob.classList.contains('open')) {
    if (!mob.contains(e.target) && !toggle.contains(e.target)) {
      mob.classList.remove('open');
      document.body.classList.remove('nav-open');
    }
  }
});

/* ── Bind all [data-page] links ── */
function bindPageLinks() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', function(e) {
      e.preventDefault();
      const page = this.getAttribute('data-page');
      if (page) navigateTo(page);
    });
  });
}

/* ── Contact form → WhatsApp ── */
function bindForm() {
  const btn = document.getElementById('submitBtn');
  if (!btn) return;

  btn.addEventListener('click', function() {
    const name    = (document.getElementById('fieldName')?.value || '').trim();
    const email   = (document.getElementById('fieldEmail')?.value || '').trim();
    const phone   = (document.getElementById('fieldPhone')?.value || '').trim();
    const service = document.getElementById('fieldService')?.value || '';
    const message = (document.getElementById('fieldMessage')?.value || '').trim();

    if (!name || !email || !message) {
      alert(currentLang === 'ar'
        ? 'يرجى تعبئة الحقول المطلوبة: الاسم، البريد الإلكتروني، والرسالة.'
        : 'Please fill the required fields: Name, Email, and Message.');
      return;
    }

    const serviceLabel = service
      ? (currentLang === 'ar' ? 'مجال الاستشارة: ' + service : 'Practice Area: ' + service)
      : '';

    const text = currentLang === 'ar'
      ? 'مرحباً، أود طلب استشارة قانونية.\n\nالاسم: ' + name +
        '\nالبريد: ' + email +
        (phone ? '\nالهاتف: ' + phone : '') +
        (serviceLabel ? '\n' + serviceLabel : '') +
        '\n\nالرسالة:\n' + message
      : 'Hello, I would like to request a legal consultation.\n\nName: ' + name +
        '\nEmail: ' + email +
        (phone ? '\nPhone: ' + phone : '') +
        (serviceLabel ? '\n' + serviceLabel : '') +
        '\n\nMessage:\n' + message;

    window.open('https://wa.me/963956010628?text=' + encodeURIComponent(text), '_blank');
  });
}

/* ── Scroll animations ── */
function bindScrollAnimations() {
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.stagger-in, .animate-fade-up, .animate-reveal').forEach(function(el) {
    el.style.animationPlayState = 'paused';
    observer.observe(el);
  });
}

/* ── Init ── */
document.addEventListener('DOMContentLoaded', function() {
  bindPageLinks();
  bindForm();
  bindScrollAnimations();
  initReadMore();
  applyLang('ar');
});

/* ── Read More Toggle ── */
function toggleReadMore(btn) {
  const desc = btn.previousElementSibling;
  if (!desc || !desc.classList.contains('service-desc')) return;

  const isExpanded = desc.classList.contains('expanded');

  if (isExpanded) {
    desc.classList.remove('expanded');
    desc.classList.add('collapsed');
    if (currentLang === 'ar') {
      btn.querySelector('span').innerHTML = 'اقرأ المزيد ↓';
    } else {
      btn.querySelector('span').innerHTML = 'Read More ↓';
    }
  } else {
    desc.classList.remove('collapsed');
    desc.classList.add('expanded');
    if (currentLang === 'ar') {
      btn.querySelector('span').innerHTML = 'إخفاء ↑';
    } else {
      btn.querySelector('span').innerHTML = 'Show Less ↑';
    }
  }
}

/* ── Init collapsed state for long service descriptions ── */
function initReadMore() {
  document.querySelectorAll('.service-desc').forEach(function(desc) {
    desc.classList.add('collapsed');
  });
}
