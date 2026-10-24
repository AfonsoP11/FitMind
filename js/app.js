/* Roteador por hash (#/rota?x=y), cabeçalho, rodapé e barra de abas do celular. */

(function () {
  const { icon, esc } = FM.ui;
  const S = FM.store;

  const routes = [
    { path: '/',                  page: 'home' },
    { path: '/buscar',            page: 'search' },
    { path: '/psicologo/:id',     page: 'profile' },
    { path: '/agendar/:id',       page: 'booking' },
    { path: '/confirmado/:id',    page: 'confirmed', auth: true },
    { path: '/entrar',            page: 'auth' },
    { path: '/consultas',         page: 'appointments', auth: true },
    { path: '/conta',             page: 'account', auth: true },
    { path: '/para-psicologos',   page: 'pros' },
    { path: '/termos',            page: 'legal' },
    { path: '/privacidade',       page: 'legal' }
  ];

  function parseHash() {
    const raw = location.hash.replace(/^#/, '') || '/';
    const [path, qs] = raw.split('?');
    return { path: path || '/', query: Object.fromEntries(new URLSearchParams(qs || '')) };
  }

  function match(path) {
    for (const r of routes) {
      const keys = [];
      const re = new RegExp('^' + r.path.replace(/:(\w+)/g, (_, k) => { keys.push(k); return '([^/]+)'; }) + '/?$');
      const m = path.match(re);
      if (m) {
        const params = {};
        keys.forEach((k, i) => { params[k] = decodeURIComponent(m[i + 1]); });
        return { route: r, params };
      }
    }
    return { route: { page: 'notFound' }, params: {} };
  }

  FM.go = function (to) {
    if (location.hash === '#' + to) render(); else location.hash = to;
  };

  FM.currentPath = () => parseHash().path;

  let cleanup = null;

  function render() {
    const { path, query } = parseHash();
    const { route, params } = match(path);
    const main = document.getElementById('main');

    if (route.auth && !S.currentUser()) {
      FM.go('/entrar?next=' + encodeURIComponent(path + (location.hash.includes('?') ? '?' + location.hash.split('?')[1] : '')));
      return;
    }

    if (cleanup) { cleanup(); cleanup = null; }
    const page = FM.pages[route.page] || FM.pages.notFound;
    const ctx = { params, query, path };

    main.innerHTML = page.render(ctx);
    document.title = (typeof page.title === 'function' ? page.title(ctx) : page.title) || 'FitMind';
    document.body.dataset.page = route.page;
    if (page.mount) cleanup = page.mount(ctx, main) || null;

    renderHeader(path);
    renderTabbar(path);

    if (query.s) {
      const target = document.getElementById(query.s);
      if (target) { target.scrollIntoView(); return; }
    }
    window.scrollTo(0, 0);
    main.focus({ preventScroll: true });
  }

  /* ---------- cabeçalho ---------- */
  function renderHeader(path) {
    const u = S.currentUser();
    const link = (href, label, active) =>
      '<a href="#' + href + '"' + (active ? ' aria-current="page"' : '') + '>' + label + '</a>';

    document.getElementById('siteHeader').innerHTML =
      '<div class="container header-inner">' +
        '<a class="brand" href="#/" aria-label="FitMind, página inicial">' +
          '<img src="assets/icon.svg" alt="" width="34" height="34"><span>FitMind</span>' +
        '</a>' +
        '<nav class="header-nav" aria-label="Seções">' +
          link('/buscar', 'Encontrar psicólogo', path.startsWith('/buscar') || path.startsWith('/psicologo')) +
          link('/?s=como-funciona', 'Como funciona', false) +
          link('/para-psicologos', 'Para psicólogos', path === '/para-psicologos') +
        '</nav>' +
        '<div class="header-actions">' +
          (u
            ? link('/consultas', 'Minhas consultas', path === '/consultas').replace('<a ', '<a class="header-link" ') +
              '<a class="user-chip" href="#/conta" aria-label="Minha conta">' +
                '<span class="user-chip-av">' + esc(FM.ui.initials(u.name)) + '</span>' +
                '<span class="user-chip-name">' + esc(u.name.split(' ')[0]) + '</span>' +
              '</a>'
            : '<a class="header-link" href="#/entrar">Entrar</a>' +
              '<a class="btn btn--primary btn--sm" href="#/entrar?tab=cadastro">Criar conta</a>') +
        '</div>' +
      '</div>';
  }

  /* ---------- barra de abas (celular) ---------- */
  function renderTabbar(path) {
    const u = S.currentUser();
    const soon = S.myAppointments().some((a) => {
      const diff = FM.ui.at(a.date, a.time) - Date.now();
      return a.status === 'confirmed' && diff > 0 && diff < 864e5;
    });
    const tab = (href, ic, label, active, badge) =>
      '<a href="#' + href + '"' + (active ? ' aria-current="page"' : '') + '>' +
        icon(ic) + '<span>' + label + '</span>' + (badge ? '<i class="tab-badge" aria-label="consulta nas próximas 24 horas"></i>' : '') +
      '</a>';

    document.getElementById('tabbar').innerHTML =
      tab('/', 'home', 'Início', path === '/') +
      tab('/buscar', 'search', 'Buscar', path.startsWith('/buscar') || path.startsWith('/psicologo') || path.startsWith('/agendar')) +
      tab('/consultas', 'calendar', 'Consultas', path === '/consultas' || path.startsWith('/confirmado'), soon) +
      tab(u ? '/conta' : '/entrar', 'user', u ? 'Conta' : 'Entrar', path === '/conta' || path === '/entrar');
  }

  /* ---------- rodapé ---------- */
  function renderFooter() {
    document.getElementById('siteFooter').innerHTML =
      '<div class="container">' +
        '<aside class="crisis" aria-label="Ajuda imediata">' +
          '<div class="crisis-icon">' + icon('phone') + '</div>' +
          '<p><strong>Precisa de ajuda agora?</strong> Ligue <a href="tel:188">188</a> para o CVV, de graça e a qualquer hora, ou procure o pronto-socorro mais perto. A FitMind não atende emergências.</p>' +
        '</aside>' +
        '<div class="footer-grid">' +
          '<div class="footer-brand">' +
            '<a class="brand brand--light" href="#/"><img src="assets/icon.svg" alt="" width="30" height="30"><span>FitMind</span></a>' +
            '<p>Psicólogos com registro conferido, horários reais e agendamento em poucos minutos.</p>' +
          '</div>' +
          '<nav aria-label="Para você"><h2>Para você</h2>' +
            '<a href="#/buscar">Encontrar psicólogo</a><a href="#/?s=como-funciona">Como funciona</a><a href="#/?s=duvidas">Dúvidas frequentes</a>' +
          '</nav>' +
          '<nav aria-label="Para profissionais"><h2>Para psicólogos</h2>' +
            '<a href="#/para-psicologos">Atender pela FitMind</a><a href="#/para-psicologos?s=cadastro">Enviar cadastro</a>' +
          '</nav>' +
          '<nav aria-label="Institucional"><h2>FitMind</h2>' +
            '<a href="#/termos">Termos de uso</a><a href="#/privacidade">Privacidade</a><a href="mailto:' + FM.config.supportEmail + '">Fale com a gente</a>' +
          '</nav>' +
        '</div>' +
        '<p class="footer-legal">© ' + new Date().getFullYear() + ' FitMind. Os atendimentos são realizados por psicólogos independentes, inscritos nos Conselhos Regionais de Psicologia.</p>' +
      '</div>';
  }

  /* Delegação global: favoritar em qualquer card. */
  document.addEventListener('click', (e) => {
    const fav = e.target.closest('[data-fav]');
    if (!fav) return;
    e.preventDefault();
    e.stopPropagation();
    const on = S.toggleFav(fav.dataset.fav);
    fav.classList.toggle('is-on', on);
    fav.setAttribute('aria-pressed', on);
    FM.ui.toast(on ? 'Salvo nos favoritos' : 'Removido dos favoritos');
  });

  S.onChange(() => { const { path } = parseHash(); renderHeader(path); renderTabbar(path); });

  document.getElementById('demoBar').hidden = !FM.config.demo;
  renderFooter();
  window.addEventListener('hashchange', render);
  render();
})();
