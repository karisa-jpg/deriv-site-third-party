// ==================== SHARED UTILITIES ====================

// LOADER
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hide');
      // Only start counters if we are on the home page or where they exist
      if (typeof startCounters === 'function') startCounters();
    }, 2700);
  }
});

// NAVBAR SCROLL EFFECT
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) {
    if (window.scrollY > 50) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  }
});

// MOBILE NAV TOGGLE
function toggleNav() {
  const links = document.getElementById('navLinks');
  if (links) links.classList.toggle('open');
}

// STAR CANVAS BACKGROUND
function initStars() {
  const canvas = document.getElementById('starCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let stars = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();

  for (let i = 0; i < 150; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2,
      speed: Math.random() * 0.5 + 0.2
    });
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#f0b429';
    stars.forEach(s => {
      ctx.globalAlpha = Math.random() * 0.5 + 0.3;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fill();
      s.y -= s.speed;
      if (s.y < 0) s.y = canvas.height;
    });
    requestAnimationFrame(draw);
  }
  draw();
}
initStars();

// SCROLL REVEAL
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
          // Start stat numbers if the section is the stats section
          if (entry.target.closest('.stats-section') && typeof animateStatNumbers === 'function') {
             animateStatNumbers();
          }
        }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));
}
document.addEventListener('DOMContentLoaded', initReveal);

// FAQ TOGGLE
function toggleFaq(btn) {
  const item = btn.parentElement;
  if (!item) return;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// SMOOTH SCROLL
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const navLinks = document.getElementById('navLinks');
      if (navLinks) navLinks.classList.remove('open');
    }
  });
});

// LIVE TICKER (Shared if present)
function initTicker() {
  const tickerItems = document.querySelectorAll('.ticker-item .change');
  if (tickerItems.length === 0) return;

  setInterval(() => {
    tickerItems.forEach(el => {
      const isUp = Math.random() > 0.45;
      const pct = (Math.random() * 2).toFixed(2);
      el.textContent = `${isUp ? '▲' : '▼'} ${isUp ? '+' : '-'}\${pct}%`;
      el.className = `change \${isUp ? 'up' : 'down'}`;
    });
  }, 4000);
}
initTicker();
