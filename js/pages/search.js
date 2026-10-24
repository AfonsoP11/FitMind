/* Busca com filtros. O estado dos filtros fica na URL, então dá para compartilhar o link. */

FM.pages.search = (function () {
  const { icon, esc, money } = FM.ui;
  const C = FM.components;
  const S = FM.store;
  const PRICE_MAX = 300;

  const SORTS = [
    { id: 'relevancia', label: 'Mais relevantes' },
    { id: 'horario', label: 'Horário mais cedo' },
    { id: 'avaliacao', label: 'Melhor avaliados' },
    { id: 'preco', label: 'Menor preço' }
  ];

  function fromQuery(q) {
    const list = (v) => (v ? v.split(',').filter(Boolean) : []);
    return {
      q: q.q || '',
      temas: list(q.temas),
      abordagem: list(q.abordagem),
      modalidade: q.modalidade || '',
      genero: q.genero || '',
      preco: Math.min(PRICE_MAX, Number(q.preco) || PRICE_MAX),
      em48h: q.em48h === '1',
      ordem: q.ordem || 'relevancia'
    };
  }

  function toQuery(f) {
    const p = new URLSearchParams();
    if (f.q) p.set('q', f.q);
    if (f.temas.length) p.set('temas', f.temas.join(','));
    if (f.abordagem.length) p.set('abordagem', f.abordagem.join(','));
    if (f.modalidade) p.set('modalidade', f.modalidade);
    if (f.genero) p.set('genero', f.genero);
    if (f.preco < PRICE_MAX) p.set('preco', f.preco);
    if (f.em48h) p.set('em48h', '1');
    if (f.ordem !== 'relevancia') p.set('ordem', f.ordem);
    const s = p.toString().replace(/%2C/g, ',');
    return s ? '?' + s : '';
  }

  const norm = (s) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  function apply(f) {
    const q = norm(f.q.trim());
    const limit48 = Date.now() + 48 * 36e5;
    return S.getPsychologists()
      .map((p) => {
        const next = S.nextAvailable(p);
        return { p, nextTs: next ? FM.ui.at(next.date, next.time).getTime() : Infinity, score: p.topics.filter((t) => f.temas.includes(t)).length };
      })
      .filter(({ p, nextTs }) => {
        if (q) {
          const hay = norm([p.name, p.city, p.headline, p.topics.map(FM.ui.topicLabel).join(' '), p.approaches.map((a) => FM.ui.approach(a).full).join(' ')].join(' '));
          if (!q.split(/\s+/).every((w) => hay.includes(w))) return false;
        }
        if (f.temas.length && !p.topics.some((t) => f.temas.includes(t))) return false;
        if (f.abordagem.length && !p.approaches.some((a) => f.abordagem.includes(a))) return false;
        if (f.modalidade && !p.modalities.includes(f.modalidade)) return false;
        if (f.genero && p.gender !== f.genero) return false;
        if (p.price > f.preco) return false;
        if (f.em48h && nextTs > limit48) return false;
        return true;
      })
      .sort((a, b) => {
        if (f.ordem === 'horario') return a.nextTs - b.nextTs;
        if (f.ordem === 'avaliacao') return b.p.rating - a.p.rating || b.p.reviewCount - a.p.reviewCount;
        if (f.ordem === 'preco') return a.p.price - b.p.price;
        return b.score - a.score || a.nextTs - b.nextTs || b.p.rating - a.p.rating;
      });
  }

  function activeCount(f) {
    return f.temas.length + f.abordagem.length + (f.modalidade ? 1 : 0) + (f.genero ? 1 : 0) + (f.preco < PRICE_MAX ? 1 : 0) + (f.em48h ? 1 : 0);
  }

  const priceLabel = (v) => (v >= PRICE_MAX ? 'Qualquer valor' : 'Até ' + money(v));

  function filtersForm(f) {
    const radio = (name, items, val) => C.checkChips(name, items, [val], { radio: true, small: true });
    return '<form class="filters" id="filters" aria-label="Filtros">' +
      '<div class="filters-head">' +
        '<h2>Filtros</h2>' +
        '<button type="button" class="link-btn" id="clearFilters">Limpar</button>' +
        '<button type="button" class="icon-btn filters-close" id="closeFilters" aria-label="Fechar filtros">' + icon('x') + '</button>' +
      '</div>' +
      '<div class="filters-body">' +
        '<fieldset><legend>Temas</legend><div class="chips">' + C.checkChips('temas', FM.topics, f.temas, { small: true }) + '</div></fieldset>' +
        '<fieldset><legend>Formato</legend><div class="chips">' +
          radio('modalidade', [{ id: '', label: 'Tanto faz' }, { id: 'online', label: 'Online' }, { id: 'presencial', label: 'Presencial' }], f.modalidade) +
        '</div></fieldset>' +
        '<fieldset><legend>Valor por sessão</legend>' +
          '<div class="range"><output id="priceOut" for="preco">' + priceLabel(f.preco) + '</output>' +
          '<input type="range" name="preco" id="preco" min="100" max="' + PRICE_MAX + '" step="10" value="' + f.preco + '" aria-label="Valor máximo por sessão"></div>' +
        '</fieldset>' +
        '<fieldset><legend>Abordagem</legend><div class="chips">' + C.checkChips('abordagem', FM.approaches, f.abordagem, { small: true }) + '</div></fieldset>' +
        '<fieldset><legend>Prefiro ser atendido por</legend><div class="chips">' +
          radio('genero', [{ id: '', label: 'Tanto faz' }, { id: 'f', label: 'Uma psicóloga' }, { id: 'm', label: 'Um psicólogo' }], f.genero) +
        '</div></fieldset>' +
        '<label class="switch"><input type="checkbox" name="em48h"' + (f.em48h ? ' checked' : '') + '><span class="switch-track" aria-hidden="true"></span>' +
          '<span><b>Com horário nas próximas 48 horas</b><small>Para quem quer começar logo</small></span></label>' +
      '</div>' +
      '<div class="filters-foot"><button type="button" class="btn btn--primary" id="applyFilters">Ver resultados</button></div>' +
    '</form>';
  }

  function render(ctx) {
    const f = fromQuery(ctx.query);
    return '<div class="container search-page">' +
      '<div class="search-top">' +
        '<h1 class="page-title">Encontre seu psicólogo</h1>' +
        '<div class="search-bar">' +
          '<label class="search-input">' + icon('search') +
            '<input type="search" id="q" value="' + esc(f.q) + '" placeholder="Nome, tema ou cidade" aria-label="Buscar por nome, tema ou cidade" autocomplete="off">' +
          '</label>' +
          '<button type="button" class="btn btn--outline filters-open" id="openFilters" aria-controls="filters">' + icon('sliders') + 'Filtros<span class="count" id="filterCount"></span></button>' +
        '</div>' +
      '</div>' +
      '<div class="search-layout">' +
        filtersForm(f) +
        '<section class="results" aria-labelledby="resultCount">' +
          '<div class="results-bar">' +
            '<p id="resultCount" class="result-count" aria-live="polite"></p>' +
            '<label class="sort">Ordenar por <select id="sort">' +
              SORTS.map((s) => '<option value="' + s.id + '"' + (s.id === f.ordem ? ' selected' : '') + '>' + s.label + '</option>').join('') +
            '</select></label>' +
          '</div>' +
          '<div class="results-list" id="results"></div>' +
        '</section>' +
      '</div>' +
      '<div class="sheet-scrim" id="scrim"></div>' +
    '</div>';
  }

  function mount(ctx, root) {
    const form = root.querySelector('#filters');
    let f = fromQuery(ctx.query);

    function read() {
      const fd = new FormData(form);
      return {
        q: root.querySelector('#q').value,
        temas: fd.getAll('temas'),
        abordagem: fd.getAll('abordagem'),
        modalidade: fd.get('modalidade') || '',
        genero: fd.get('genero') || '',
        preco: Number(fd.get('preco')),
        em48h: fd.get('em48h') === 'on',
        ordem: root.querySelector('#sort').value
      };
    }

    function update() {
      const list = apply(f);
      const n = list.length;
      root.querySelector('#resultCount').textContent = n ? n + (n === 1 ? ' profissional encontrado' : ' profissionais encontrados') : 'Nenhum profissional encontrado';
      const c = activeCount(f);
      root.querySelector('#filterCount').textContent = c ? c : '';
      root.querySelector('#results').innerHTML = n
        ? list.map((x) => C.psyCard(x.p, f.temas)).join('')
        : C.emptyState('search', 'Nenhum psicólogo com esses filtros', 'Tente tirar algum filtro ou aumentar o valor máximo. Quanto menos filtros, mais opções aparecem.',
            '<button type="button" class="btn btn--outline" data-clear>Limpar filtros</button>');
      history.replaceState(null, '', '#/buscar' + toQuery(f));
    }

    const onChange = () => {
      f = read();
      root.querySelector('#priceOut').textContent = priceLabel(f.preco);
      update();
    };

    function clearAll() {
      form.reset();
      form.querySelectorAll('input[type=checkbox]').forEach((i) => { i.checked = false; });
      form.querySelectorAll('input[type=radio][value=""]').forEach((i) => { i.checked = true; });
      form.querySelector('#preco').value = PRICE_MAX;
      root.querySelector('#q').value = '';
      onChange();
    }

    const open = () => { document.body.classList.add('sheet-open'); form.querySelector('fieldset input')?.focus(); };
    const close = () => { document.body.classList.remove('sheet-open'); root.querySelector('#openFilters').focus(); };

    form.addEventListener('input', onChange);
    form.addEventListener('submit', (e) => e.preventDefault());
    root.querySelector('#sort').addEventListener('change', onChange);
    let t;
    root.querySelector('#q').addEventListener('input', () => { clearTimeout(t); t = setTimeout(onChange, 160); });
    root.querySelector('#clearFilters').addEventListener('click', clearAll);
    root.querySelector('#results').addEventListener('click', (e) => { if (e.target.closest('[data-clear]')) clearAll(); });
    root.querySelector('#openFilters').addEventListener('click', open);
    root.querySelector('#closeFilters').addEventListener('click', close);
    root.querySelector('#applyFilters').addEventListener('click', close);
    root.querySelector('#scrim').addEventListener('click', close);
    const onKey = (e) => { if (e.key === 'Escape' && document.body.classList.contains('sheet-open')) close(); };
    document.addEventListener('keydown', onKey);

    update();
    return () => { document.body.classList.remove('sheet-open'); document.removeEventListener('keydown', onKey); };
  }

  return { title: 'Encontre seu psicólogo — FitMind', render, mount };
})();
