/* Componentes reutilizados entre páginas. */

FM.pages = {};

FM.components = (function () {
  const { icon, esc, money, avatar, rating, relDay, parseYmd, topicLabel, approach, modalityText } = FM.ui;
  const S = FM.store;

  function nextSlotChip(psy) {
    const n = S.nextAvailable(psy);
    if (!n) return '<span class="slot-chip slot-chip--none">Sem horários nos próximos 30 dias</span>';
    const d = parseYmd(n.date);
    const soon = FM.ui.dayDiff(d) <= 1;
    return '<span class="slot-chip' + (soon ? ' slot-chip--soon' : '') + '">' + icon('clock') +
      'Próximo horário: <b>' + relDay(d) + ', ' + n.time + '</b></span>';
  }

  function favButton(psy) {
    const on = S.isFav(psy.id);
    return '<button type="button" class="fav' + (on ? ' is-on' : '') + '" data-fav="' + psy.id + '" aria-pressed="' + on + '" aria-label="Salvar ' + esc(psy.name) + ' nos favoritos">' + icon('heart') + '</button>';
  }

  /* Card completo, usado na busca e nos favoritos. `topics` destaca os temas que a pessoa escolheu. */
  function psyCard(psy, topics) {
    topics = topics || [];
    const matched = psy.topics.filter((t) => topics.includes(t));
    const others = psy.topics.filter((t) => !topics.includes(t));
    const tags = matched.map((t) => '<li class="tag tag--match">' + icon('check') + esc(topicLabel(t)) + '</li>')
      .concat(others.slice(0, Math.max(0, 3 - matched.length)).map((t) => '<li class="tag">' + esc(topicLabel(t)) + '</li>'))
      .join('');

    return '<article class="psy-card">' +
      avatar(psy, 'lg') +
      '<div class="psy-card-body">' +
        '<div class="psy-card-top">' +
          '<div>' +
            '<h3 class="psy-card-name"><a class="stretched" href="#/psicologo/' + psy.id + '">' + esc(psy.name) + '</a></h3>' +
            '<p class="psy-card-meta">' + psy.approaches.map((a) => esc(approach(a).label)).join(' e ') + ' <span aria-hidden="true">/</span> CRP ' + psy.crp + '</p>' +
          '</div>' +
          favButton(psy) +
        '</div>' +
        '<p class="psy-card-headline">' + esc(psy.headline) + '</p>' +
        '<ul class="tags" aria-label="Temas que atende">' + tags + '</ul>' +
        '<div class="psy-card-foot">' +
          nextSlotChip(psy) +
          '<div class="psy-card-facts">' +
            rating(psy) +
            '<span class="muted">' + modalityText(psy.modalities) + '</span>' +
            '<span class="price">' + money(psy.price) + '<small> / ' + psy.duration + ' min</small></span>' +
          '</div>' +
        '</div>' +
      '</div>' +
    '</article>';
  }

  /* Chips de múltipla escolha acessíveis (checkbox de verdade por baixo). */
  function checkChips(name, items, selected, opts) {
    opts = opts || {};
    return items.map((it) =>
      '<label class="chip' + (opts.small ? ' chip--sm' : '') + '">' +
        '<input type="' + (opts.radio ? 'radio' : 'checkbox') + '" name="' + name + '" value="' + it.id + '"' + (selected.includes(it.id) ? ' checked' : '') + '>' +
        '<span>' + esc(it.label) + '</span>' +
      '</label>'
    ).join('');
  }

  function emptyState(ic, title, text, action) {
    return '<div class="empty">' +
      '<div class="empty-icon">' + icon(ic) + '</div>' +
      '<h2>' + esc(title) + '</h2>' +
      '<p>' + esc(text) + '</p>' +
      (action || '') +
    '</div>';
  }

  function backLink(href, label) {
    return '<a class="back-link" href="#' + href + '">' + icon('left') + esc(label) + '</a>';
  }

  return { nextSlotChip, favButton, psyCard, checkChips, emptyState, backLink };
})();
