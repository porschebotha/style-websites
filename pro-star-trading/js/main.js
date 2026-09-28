// Pro-Star Trading – site interactions
(function () {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  const backToTop = document.getElementById('backToTop');
  const navLinks = document.querySelectorAll('.nav-link');

  // Footer year
  document.getElementById('year').textContent = new Date().getFullYear();

  // Mobile menu
  function closeMenu() {
    navMenu.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
  navToggle.addEventListener('click', function () {
    const open = navMenu.classList.toggle('open');
    navToggle.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navMenu.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', closeMenu);
  });

  // Navbar shadow + back-to-top visibility
  function onScroll() {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 10);
    backToTop.classList.toggle('show', y > 600);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Fade-in on scroll
  const faders = document.querySelectorAll('.fade-in');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.remove('pending');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.hero-center > .fade-in').forEach(function (el, i) {
      el.style.transitionDelay = (i * 0.12) + 's';
    });

    // Only hide elements that start below the fold, so the first screen is complete at rest
    faders.forEach(function (el) {
      if (el.getBoundingClientRect().top > window.innerHeight) {
        el.classList.add('pending');
        io.observe(el);
      }
    });
  }

  // Quote form: keep the WhatsApp link in sync with what the visitor types
  const quoteForm = document.getElementById('quoteForm');
  const quoteSend = document.getElementById('quoteSend');
  if (quoteForm && quoteSend) {
    const baseUrl = 'https://wa.me/27833564891?text=';
    const fields = [
      ['qName', 'Name'], ['qCompany', 'Company'], ['qProducts', 'Products'],
      ['qQty', 'Quantity'], ['qDate', 'Needed by']
    ];
    function buildLink() {
      let msg = "Hi Karen, I'd like to request a quote from Pro-Star Trading.";
      const lines = [];
      fields.forEach(function (f) {
        const v = document.getElementById(f[0]).value.trim();
        if (v) lines.push(f[1] + ': ' + v);
      });
      if (lines.length) msg += '\n\n' + lines.join('\n');
      quoteSend.href = baseUrl + encodeURIComponent(msg);
    }
    quoteForm.addEventListener('input', buildLink);
    quoteForm.addEventListener('submit', function (e) { e.preventDefault(); quoteSend.click(); });
  }

  // Active nav link on scroll
  const sections = ['home', 'what-we-sell', 'contact']
    .map(function (id) { return document.getElementById(id); });

  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (link) {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }
})();
