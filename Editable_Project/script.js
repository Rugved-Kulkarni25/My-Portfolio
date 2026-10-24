(() => {
  const root = document.documentElement;
  root.classList.add('js');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const progress = document.getElementById('scrollProgress');
  const header = document.getElementById('siteHeader');
  const menuToggle = document.getElementById('menuToggle');
  const mobileNav = document.getElementById('mobileNav');
  const themeToggle = document.getElementById('themeToggle');
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
  const onScroll = () => {
    const available = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (available > 0 ? (window.scrollY / available) * 100 : 0) + '%';
    header?.classList.toggle('is-scrolled', window.scrollY > 28);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, {passive: true});
  const closeMenu = () => {
    mobileNav?.classList.remove('open');
    menuToggle?.setAttribute('aria-expanded', 'false');
    menuToggle?.setAttribute('aria-label', 'Open navigation');
  };
  menuToggle?.addEventListener('click', () => {
    const open = !mobileNav.classList.contains('open');
    mobileNav.classList.toggle('open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  });
  mobileNav?.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  window.addEventListener('resize', () => { if (innerWidth > 720) closeMenu(); });

  try { if (localStorage.getItem('rugved-portfolio-theme') === 'light') root.classList.add('light-mode'); }
  catch (_) { /* localStorage may be blocked on file:// */ }
  themeToggle?.addEventListener('click', () => {
    const light = root.classList.toggle('light-mode');
    themeToggle.setAttribute('aria-label', light ? 'Switch to dark theme' : 'Switch to light theme');
    try { localStorage.setItem('rugved-portfolio-theme', light ? 'light' : 'dark'); } catch (_) { }
  });

  const revealElements = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reducedMotion) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); revealObserver.unobserve(entry.target); }
      });
    }, {threshold: 0.075, rootMargin: '0px 0px -22px 0px'});
    revealElements.forEach(el => revealObserver.observe(el));
  } else revealElements.forEach(el => el.classList.add('visible'));

  const role = document.getElementById('typingText');
  const roles = ['intelligent experiences', 'computer vision systems', 'AI-powered solutions', 'things that make an impact'];
  if (role && !reducedMotion) {
    let roleIndex = 0, length = roles[0].length, deleting = false;
    const typeLoop = () => {
      const phrase = roles[roleIndex];
      role.textContent = phrase.slice(0, length);
      let delay = deleting ? 38 : 73;
      if (!deleting && length >= phrase.length) { deleting = true; delay = 1800; }
      else if (deleting && length <= 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 340; }
      length += deleting ? -1 : 1;
      window.setTimeout(typeLoop, delay);
    };
    setTimeout(typeLoop, 1600);
  }

  const filters = document.querySelectorAll('.filter-button');
  const projectCards = document.querySelectorAll('.project-card');
  filters.forEach(btn => btn.addEventListener('click', () => {
    const chosen = btn.dataset.filter;
    filters.forEach(b => { const active = b === btn; b.classList.toggle('active', active); b.setAttribute('aria-pressed', String(active)); });
    projectCards.forEach(card => {
      const tags = (card.dataset.categories || '').split(' ');
      const show = chosen === 'all' || tags.includes(chosen);
      card.classList.toggle('is-hidden', !show);
      card.setAttribute('aria-hidden', String(!show));
    });
  }));

  const sections = document.querySelectorAll('main section[id]');
  const navLinks = document.querySelectorAll('.desktop-nav a');
  if ('IntersectionObserver' in window) {
    const sectionsObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => { if (entry.isIntersecting) navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id)); });
    }, {rootMargin:'-25% 0px -55% 0px'});
    sections.forEach(section => sectionsObserver.observe(section));
  }

  const cursorHalo = document.getElementById('cursorHalo');
  if (cursorHalo && !reducedMotion && matchMedia('(pointer:fine)').matches) {
    window.addEventListener('pointermove', e => { cursorHalo.style.transform = `translate(${e.clientX - 180}px, ${e.clientY - 180}px)`; }, {passive:true});
  }
  const toast = document.getElementById('toast');
  let toastTimer;
  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  document.getElementById('copyEmail')?.addEventListener('click', async () => {
    const email = 'kulkarnirugved47@gmail.com';
    try { await navigator.clipboard.writeText(email); showToast('Email copied to clipboard'); }
    catch (_) {
      const field = document.createElement('textarea');
      field.value = email; field.setAttribute('readonly', '');
      field.style.position = 'fixed'; field.style.opacity = '0';
      document.body.appendChild(field); field.select();
      const ok = document.execCommand('copy'); field.remove();
      showToast(ok ? 'Email copied to clipboard' : 'Please copy the email shown on the page');
    }
  });
})();
