/* Perfil do psicólogo, com os próximos horários livres ao lado. */

FM.pages.profile = (function () {
  const { icon, esc, money, avatar, rating, relDay, parseYmd, topicLabel, approach } = FM.ui;
  const C = FM.components;
  const S = FM.store;

  function slotsAside(psy) {
    const slots = S.upcomingSlots(psy, 9);
    if (!slots.length) {
      return '<p class="muted">Sem horários livres nos próximos 30 dias. Salve nos favoritos para voltar depois.</p>';
    }
    const byDay = {};
    slots.forEach((s) => { (byDay[s.date] = byDay[s.date] || []).push(s.time); });
    return Object.keys(byDay).slice(0, 3).map((d) =>
      '<div class="aside-day"><p class="aside-day-label">' + relDay(parseYmd(d)) + '</p><div class="slot-row">' +
        byDay[d].map((t) => '<a class="slot" href="#/agendar/' + psy.id + '?d=' + d + '&t=' + t + '">' + t + '</a>').join('') +
      '</div></div>'
    ).join('');
  }

  function render(ctx) {
    const psy = S.getPsychologist(ctx.params.id);
    if (!psy) {
      return '<div class="container narrow">' + C.emptyState('user', 'Perfil não encontrado', 'Esse link pode estar desatualizado ou o profissional saiu da plataforma.',
        '<a class="btn btn--primary" href="#/buscar">Ver outros psicólogos</a>') + '</div>';
    }
    const stars = (n) => '<span class="stars" aria-label="' + n + ' de 5 estrelas">' + '★★★★★'.slice(0, n) + '<span class="stars-off">' + '★★★★★'.slice(n) + '</span></span>';

    return '<div class="container profile-page">' +
      C.backLink('/buscar', 'Voltar para a busca') +
      '<div class="profile-layout">' +
        '<article class="profile-main">' +
          '<header class="profile-head">' +
            avatar(psy, 'xl') +
            '<div class="profile-id">' +
              '<h1>' + esc(psy.name) + '</h1>' +
              '<p class="profile-approach">' + psy.approaches.map((a) => esc(approach(a).full)).join(' e ') + '</p>' +
              '<div class="profile-facts">' +
                '<span class="verified">' + icon('shield') + 'CRP ' + psy.crp + ' conferido</span>' +
                rating(psy) +
                '<span class="muted">' + icon('pin') + esc(psy.city) + '</span>' +
              '</div>' +
            '</div>' +
            C.favButton(psy) +
          '</header>' +

          '<blockquote class="profile-quote">' + esc(psy.headline) + '</blockquote>' +

          '<section class="profile-sec"><h2>Sobre</h2><p>' + esc(psy.bio) + '</p></section>' +

          '<section class="profile-sec"><h2>Temas que atende</h2><ul class="tags">' +
            psy.topics.map((t) => '<li class="tag"><a href="#/buscar?temas=' + t + '">' + esc(topicLabel(t)) + '</a></li>').join('') +
          '</ul></section>' +

          '<section class="profile-sec"><h2>Como é o atendimento</h2><dl class="facts">' +
            '<div><dt>Formato</dt><dd>' + FM.ui.modalityText(psy.modalities) + (psy.modalities.includes('presencial') ? ', consultório em ' + esc(psy.city) : '') + '</dd></div>' +
            '<div><dt>Duração</dt><dd>' + psy.duration + ' minutos</dd></div>' +
            '<div><dt>Valor</dt><dd>' + money(psy.price) + ' por sessão</dd></div>' +
            '<div><dt>Atende</dt><dd>' + psy.audiences.join(', ') + '</dd></div>' +
            '<div><dt>Idiomas</dt><dd>' + psy.languages.join(', ') + '</dd></div>' +
            '<div><dt>Experiência</dt><dd>' + psy.years + ' anos de clínica</dd></div>' +
          '</dl></section>' +

          '<section class="profile-sec"><h2>Formação</h2><ul class="edu">' +
            psy.education.map((e) => '<li>' + esc(e) + '</li>').join('') +
          '</ul></section>' +

          '<section class="profile-sec"><h2>O que dizem os pacientes</h2>' +
            '<p class="review-summary"><b>' + psy.rating.toFixed(1).replace('.', ',') + '</b> de 5, em ' + psy.reviewCount + ' avaliações. Só quem fez sessão pode avaliar.</p>' +
            '<ul class="reviews">' +
              psy.reviews.map((r) => '<li><div class="review-top"><b>' + esc(r.name) + '</b>' + stars(r.stars) + '<span class="muted">' + esc(r.when) + '</span></div><p>' + esc(r.text) + '</p></li>').join('') +
            '</ul>' +
          '</section>' +
        '</article>' +

        '<aside class="profile-aside" aria-label="Agendar sessão">' +
          '<div class="book-card">' +
            '<p class="book-card-price">' + money(psy.price) + ' <small>/ sessão de ' + psy.duration + ' min</small></p>' +
            '<h2>Próximos horários livres</h2>' +
            slotsAside(psy) +
            '<a class="btn btn--primary btn--block" href="#/agendar/' + psy.id + '">Ver agenda completa</a>' +
            '<p class="fine">Cancelamento grátis até ' + FM.config.cancelFreeHours + ' horas antes.</p>' +
          '</div>' +
        '</aside>' +
      '</div>' +

      '<div class="mobile-cta">' +
        '<div><b>' + money(psy.price) + '</b><small>' + psy.duration + ' min</small></div>' +
        '<a class="btn btn--primary" href="#/agendar/' + psy.id + '">Agendar sessão</a>' +
      '</div>' +
    '</div>';
  }

  return {
    title: (ctx) => { const p = S.getPsychologist(ctx.params.id); return p ? p.name + (p.gender === 'f' ? ', psicóloga' : ', psicólogo') + ' — FitMind' : 'Perfil não encontrado — FitMind'; },
    render
  };
})();
