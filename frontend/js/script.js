/* ==========================================================================
   KAMLA GANGA INTERPRISES — Site Script
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loader ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader && loader.classList.add('hidden'), 500);
  });
  // fallback in case 'load' already fired
  setTimeout(() => loader && loader.classList.add('hidden'), 2500);

  /* ---------- Sticky Nav ---------- */
  const nav = document.getElementById('siteNav');
  const onScrollNav = () => {
    if (window.scrollY > 60) { nav.classList.add('scrolled'); document.body.classList.add('scrolled-nav'); }
    else { nav.classList.remove('scrolled'); document.body.classList.remove('scrolled-nav'); }
  };
  window.addEventListener('scroll', onScrollNav);
  onScrollNav();

  /* ---------- Mobile Drawer ---------- */
  const drawer = document.getElementById('mobileDrawer');
  document.getElementById('navToggle')?.addEventListener('click', () => drawer.classList.add('open'));
  document.getElementById('closeDrawer')?.addEventListener('click', () => drawer.classList.remove('open'));
  drawer?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

  /* ---------- Dark Mode Toggle ---------- */
  const themeBtn = document.getElementById('themeToggle');
  const applyTheme = (t) => {
    document.documentElement.setAttribute('data-theme', t);
    if (themeBtn) themeBtn.textContent = t === 'dark' ? '☀' : '☾';
  };
  let savedTheme = 'light';
  try { savedTheme = window.__kg_theme || 'light'; } catch (e) {}
  applyTheme(savedTheme);
  themeBtn?.addEventListener('click', () => {
    const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    applyTheme(cur);
    try { window.__kg_theme = cur; } catch (e) {}
  });

  /* ---------- Scroll Reveal ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); } });
  }, { threshold: 0.14 });
  document.querySelectorAll('.reveal, .reveal-stagger').forEach(el => io.observe(el));

  /* ---------- Scroll to top ---------- */
  const topBtn = document.getElementById('scrollTop');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 700) topBtn.classList.add('show'); else topBtn.classList.remove('show');
  });
  topBtn?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Tabs (Design sections) ---------- */
  document.querySelectorAll('[data-tabs]').forEach(group => {
    const btns = group.querySelectorAll('.tab-btn');
    const panels = document.querySelectorAll(`[data-tab-panel][data-tab-group="${group.dataset.tabs}"]`);
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        btns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        panels.forEach(p => p.classList.toggle('active', p.dataset.tabPanel === btn.dataset.tab));
      });
    });
  });

  /* ---------- Project Filtering ---------- */
  const filterBtns = document.querySelectorAll('.filter-row .tab-btn');
  const projCards = document.querySelectorAll('.proj-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      projCards.forEach(c => {
        c.style.display = (f === 'all' || c.dataset.cat === f) ? '' : 'none';
      });
    });
  });

  /* ---------- Gallery Filtering + Lightbox ---------- */
  const galBtns = document.querySelectorAll('.gal-filters .tab-btn');
  const galItems = document.querySelectorAll('.gal-item');
  galBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      galBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const f = btn.dataset.filter;
      galItems.forEach(item => {
        item.classList.toggle('hide', !(f === 'all' || item.dataset.cat === f));
      });
    });
  });

  const lightbox = document.getElementById('lightbox');
  const lbCap = document.getElementById('lightboxCap');
  const lbPh = document.getElementById('lightboxPh');
  galItems.forEach(item => {
    item.addEventListener('click', () => {
      lbCap.textContent = item.dataset.caption || '';
      lbPh.textContent = item.querySelector('.ph')?.textContent.trim() || '';
      lightbox.classList.add('open');
    });
  });
  document.getElementById('lightboxClose')?.addEventListener('click', () => lightbox.classList.remove('open'));
  lightbox?.addEventListener('click', (e) => { if (e.target === lightbox) lightbox.classList.remove('open'); });

  /* ---------- Testimonials Slider ---------- */
  const track = document.getElementById('testiTrack');
  const dots = document.querySelectorAll('.testi-dot');
  let testiIndex = 0;
  const perView = () => window.innerWidth <= 760 ? 1 : window.innerWidth <= 1080 ? 2 : 3;
  const slideCount = document.querySelectorAll('.testi-card').length;
  const updateSlider = () => {
    const max = Math.max(0, slideCount - perView());
    if (testiIndex > max) testiIndex = max;
    const pct = (100 / perView()) * testiIndex;
    if (track) track.style.transform = `translateX(-${pct}%)`;
    dots.forEach((d, i) => d.classList.toggle('active', i === testiIndex));
  };
  dots.forEach((d, i) => d.addEventListener('click', () => { testiIndex = i; updateSlider(); }));
  let testiTimer = setInterval(() => {
    testiIndex = (testiIndex + 1) % dots.length;
    updateSlider();
  }, 4500);
  window.addEventListener('resize', updateSlider);
  updateSlider();

  /* ---------- FAQ Accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    q.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(o => {
        o.classList.remove('open');
        o.querySelector('.faq-a').style.maxHeight = null;
      });
      if (!isOpen) {
        item.classList.add('open');
        a.style.maxHeight = a.scrollHeight + 'px';
      }
    });
  });

  /* ---------- Cost Estimator ---------- */
  const plotSize = document.getElementById('estPlot');
  const plotVal = document.getElementById('estPlotVal');
  const floors = document.getElementById('estFloors');
  const chips = document.querySelectorAll('.chip[data-group]');
  const estPrice = document.getElementById('estPrice');
  const estLow = document.getElementById('estLow');
  const estHigh = document.getElementById('estHigh');

  const state = { constructionType: 'standard', quality: 'premium' };

  const rates = { basic: 1450, standard: 1850, premium: 2400, luxury: 3200 };

  function calcEstimate() {
    const size = Number(plotSize?.value || 1200);
    const fl = Number(floors?.value || 2);
    const rate = rates[state.quality] || rates.premium;
    const total = size * fl * rate;
    const low = Math.round(total * 0.92 / 1000) * 1000;
    const high = Math.round(total * 1.1 / 1000) * 1000;
    if (estPrice) estPrice.textContent = `₹${(total / 100000).toFixed(1)}L`;
    if (estLow) estLow.textContent = `₹${(low / 100000).toFixed(1)}L`;
    if (estHigh) estHigh.textContent = `₹${(high / 100000).toFixed(1)}L`;
    document.getElementById('bdArea').textContent = `${size} sq.ft x ${fl} floor(s)`;
    document.getElementById('bdRate').textContent = `₹${rate}/sq.ft`;
  }
  plotSize?.addEventListener('input', () => { plotVal.textContent = plotSize.value; calcEstimate(); });
  floors?.addEventListener('change', calcEstimate);
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const group = chip.dataset.group;
      document.querySelectorAll(`.chip[data-group="${group}"]`).forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      state[group] = chip.dataset.value;
      calcEstimate();
    });
  });
  calcEstimate();

  /* ---------- Form Validation (Client Requirement + Contact) ---------- */
  function validateForm(form) {
    let valid = true;
    form.querySelectorAll('[required]').forEach(field => {
      const errEl = field.closest('.field')?.querySelector('.err');
      let msg = '';
      if (!field.value.trim()) msg = 'This field is required';
      else if (field.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value)) msg = 'Enter a valid email';
      else if (field.type === 'tel' && !/^[0-9+\-\s]{7,15}$/.test(field.value)) msg = 'Enter a valid phone number';
      if (msg) { valid = false; field.style.borderColor = '#B3432B'; }
      else { field.style.borderColor = ''; }
      if (errEl) errEl.textContent = msg;
    });
    return valid;
  }

  document.querySelectorAll('.js-validate').forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validateForm(form)) return;
      const successEl = form.parentElement.querySelector('.form-success');
      form.style.display = 'none';
      if (successEl) successEl.classList.add('show');
      // NOTE: connect this to POST /api/contact or /api/requirements on your backend.
      console.log('Form submitted (demo):', Object.fromEntries(new FormData(form)));
    });
  });

  /* ---------- File Upload Labels ---------- */
  document.querySelectorAll('.field.file input[type=file]').forEach(input => {
    input.addEventListener('change', () => {
      const label = input.closest('.field').querySelector('span');
      if (label) label.textContent = input.files[0]?.name || label.dataset.default;
    });
  });

  /* ---------- Search Overlay ---------- */
  const searchOverlay = document.getElementById('searchOverlay');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const searchIndex = [
    { label: 'Architectural Planning', href: '#services' },
    { label: '2D Floor Plans', href: '#design-2d' },
    { label: '3D House Modeling', href: '#design-3d' },
    { label: 'Interior Design', href: '#interior' },
    { label: 'Structural Design (STAAD Pro, ETABS)', href: '#structural' },
    { label: 'Our Projects', href: '#projects' },
    { label: 'Gallery', href: '#gallery' },
    { label: 'Cost Estimator', href: '#estimator' },
    { label: 'Government Project Consultancy', href: '#services' },
    { label: 'Contact Us', href: '#contact' },
  ];
  function openSearch() {
    searchOverlay.classList.add('open');
    setTimeout(() => searchInput.focus(), 100);
    renderSearch('');
  }
  function renderSearch(q) {
    const matches = searchIndex.filter(i => i.label.toLowerCase().includes(q.toLowerCase()));
    searchResults.innerHTML = matches.map(m => `<a href="${m.href}">${m.label}</a>`).join('') || '<a href="#services">No matches — try “design”, “structural”, “estimator”…</a>';
  }
  document.getElementById('searchToggle')?.addEventListener('click', openSearch);
  document.getElementById('searchClose')?.addEventListener('click', () => searchOverlay.classList.remove('open'));
  searchInput?.addEventListener('input', () => renderSearch(searchInput.value));
  searchResults?.addEventListener('click', (e) => { if (e.target.tagName === 'A') searchOverlay.classList.remove('open'); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { searchOverlay.classList.remove('open'); lightbox?.classList.remove('open'); } });

});
