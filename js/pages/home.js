/* Página inicial: escolha de temas com resultado ao vivo, como funciona, confiança, dúvidas. */

FM.pages.home = (function () {
  const { icon, esc, money, avatar, relDay, parseYmd, topicLabel } = FM.ui;
  const C = FM.components;
  const S = FM.store;

  const APPROACH_GUIDE = [
    { id: 'tcc', text: 'Foco no presente e em mudar padrões de pensamento e comportamento. Costuma ter tarefas entre as sessões.' },
    { id: 'psicanalise', text: 'Você fala livremente e, aos poucos, entende o que se repete na sua história. Processo mais longo e profundo.' },
    { id: 'humanista', text: 'A relação com o terapeuta é o centro. Ajuda a se ouvir e se aceitar, sem roteiro fixo.' },
    { id: 'sistemica', text: 'Olha para as relações: casal, família, grupos. Indicada quando o problema envolve mais de uma pessoa.' }
  ];

  /* Ordena por quantos temas batem e, no empate, por quem tem horário mais cedo. */
  function rank(topics) {
    return S.getPsychologists()
      .map((p) => {
        const next = S.nextAvailable(p);
        return { p, score: p.topics.filter((t) => topics.includes(t)).length, next: next ? FM.ui.at(next.date, next.time).getTime() : Infinity };
      })
      .filter((x) => !topics.length || x.score > 0)
      .sort((a, b) => b.score - a.score || a.next - b.next || b.p.rating - a.p.rating);
  }

  function matchTitle(topics, total) {
    if (!topics.length) return 'Com horário livre mais cedo';
    const names = topics.map((t) => topicLabel(t).toLowerCase());
    const list = names.length > 2 ? names.slice(0, 2).join(', ') + ' e mais ' + (names.length - 2) : names.join(' e ');
    return total + (total === 1 ? ' psicólogo atende ' : ' psicólogos atendem ') + list;
  }

  function matchItem(p, topics) {
    const n = S.nextAvailable(p);
    const hits = p.topics.filter((t) => topics.includes(t));
    return '<li class="match-item" data-id="' + p.id + '">' +
      avatar(p, 'md') +
      '<div class="match-main">' +
        '<a class="stretched match-name" href="#/psicologo/' + p.id + '">' + esc(p.name) + '</a>' +
        '<span class="match-sub">' + (hits.length ? hits.map(topicLabel).join(', ') : p.approaches.map((a) => FM.ui.approach(a).label).join(' e ')) + '</span>' +
      '</div>' +
      '<div class="match-side">' +
        (n ? '<span class="match-slot' + (FM.ui.dayDiff(parseYmd(n.date)) <= 1 ? ' is-soon' : '') + '">' + relDay(parseYmd(n.date)) + ', ' + n.time + '</span>' : '') +
        '<span class="match-price">' + money(p.price) + '</span>' +
      '</div>' +
    '</li>';
  }

  function renderMatches(root, topics) {
    const ranked = rank(topics);
    const list = root.querySelector('#matchList');
    root.querySelector('#matchTitle').textContent = matchTitle(topics, ranked.length);

    // Anima a reordenação (FLIP): guarda posições antigas, redesenha e desliza até as novas.
    const before = {};
    list.querySelectorAll('.match-item').forEach((el) => { before[el.dataset.id] = el.getBoundingClientRect().top; });
    list.innerHTML = ranked.slice(0, 4).map((x) => matchItem(x.p, topics)).join('');
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce) {
      list.querySelectorAll('.match-item').forEach((el) => {
        const old = before[el.dataset.id];
        if (old == null) { el.animate([{ opacity: 0, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' }); return; }
        const dy = old - el.getBoundingClientRect().top;
        if (dy) el.animate([{ transform: 'translateY(' + dy + 'px)' }, { transform: 'none' }], { duration: 320, easing: 'cubic-bezier(.3,.7,.2,1)' });
      });
    }

    const qs = topics.length ? '?temas=' + topics.join(',') : '';
    const more = root.querySelector('#matchMore');
    more.href = '#/buscar' + qs;
    more.textContent = ranked.length > 4 ? 'Ver os ' + ranked.length + ' perfis' : 'Ver perfis com filtros';
    root.querySelector('#heroCta').href = '#/buscar' + qs;
  }

  function render() {
    const topics = S.getTopics();
    return '' +
    '<section class="hero">' +
      '<div class="container hero-grid">' +
        '<div class="hero-copy">' +
          '<h1>Encontre alguém para conversar sobre o que está pesando.</h1>' +
          '<p class="lead">Psicólogos com CRP conferido, horários livres de verdade e agendamento em poucos minutos, online ou presencial.</p>' +
          '<fieldset class="topic-picker">' +
            '<legend>O que você quer trabalhar na terapia?</legend>' +
            '<div class="chips" id="heroTopics">' + C.checkChips('topic', FM.topics.slice(0, 10), topics) + '</div>' +
            '<p class="hint">Pode marcar mais de um. Se ainda não sabe, tudo bem: dá para começar sem escolher.</p>' +
          '</fieldset>' +
          '<div class="hero-actions">' +
            '<a class="btn btn--primary btn--lg" id="heroCta" href="#/buscar">Ver psicólogos</a>' +
            '<a class="btn btn--quiet btn--lg" href="#/?s=como-funciona">Como funciona</a>' +
          '</div>' +
        '</div>' +
        '<div class="match-panel" aria-live="polite">' +
          '<div class="match-head">' +
            '<p class="match-title" id="matchTitle"></p>' +
            '<p class="match-note">Horários atualizados agora</p>' +
          '</div>' +
          '<ul class="match-list" id="matchList"></ul>' +
          '<a class="match-more" id="matchMore" href="#/buscar"></a>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="band band--forest" id="como-funciona" aria-labelledby="howTitle">' +
      '<div class="container">' +
        '<h2 class="section-title" id="howTitle">Do primeiro clique à primeira sessão</h2>' +
        '<ol class="steps">' +
          '<li><span class="step-n" aria-hidden="true">1</span><h3>Conte o que procura</h3><p>Escolha os temas, a faixa de preço e se prefere online ou presencial. Nada disso é obrigatório.</p></li>' +
          '<li><span class="step-n" aria-hidden="true">2</span><h3>Escolha pelo perfil e pela agenda</h3><p>Leia como cada profissional trabalha, veja avaliações de pacientes e os horários que estão livres.</p></li>' +
          '<li><span class="step-n" aria-hidden="true">3</span><h3>Converse na hora marcada</h3><p>A confirmação chega na hora. Nas sessões online, o link aparece em Minhas consultas 15 minutos antes.</p></li>' +
        '</ol>' +
      '</div>' +
    '</section>' +

    '<section class="section" aria-labelledby="trustTitle">' +
      '<div class="container split">' +
        '<div class="split-head">' +
          '<h2 class="section-title" id="trustTitle">Feito para você se sentir seguro desde o começo</h2>' +
          '<p class="lead">Começar terapia já é um passo grande. A parte prática não precisa ser mais um peso.</p>' +
        '</div>' +
        '<ul class="trust-list">' +
          '<li>' + icon('shield') + '<div><h3>Registro conferido</h3><p>Antes de aparecer na busca, todo psicólogo tem o CRP checado no cadastro do Conselho. O número fica visível no perfil.</p></div></li>' +
          '<li>' + icon('lock') + '<div><h3>Sigilo de verdade</h3><p>As sessões não são gravadas e a FitMind não tem acesso ao que é conversado. Seus dados seguem a LGPD.</p></div></li>' +
          '<li>' + icon('calendar') + '<div><h3>Sem fidelidade</h3><p>Você paga por sessão. Remarcar ou cancelar é gratuito até 24 horas antes, direto no site.</p></div></li>' +
        '</ul>' +
      '</div>' +
    '</section>' +

    '<section class="section section--tint" aria-labelledby="apTitle">' +
      '<div class="container">' +
        '<div class="section-head">' +
          '<h2 class="section-title" id="apTitle">Não sabe qual abordagem escolher?</h2>' +
          '<p class="lead">Cada linha da psicologia trabalha de um jeito. Um resumo rápido das mais procuradas:</p>' +
        '</div>' +
        '<div class="approach-grid">' +
          APPROACH_GUIDE.map((g) => {
            const a = FM.ui.approach(g.id);
            const n = S.getPsychologists().filter((p) => p.approaches.includes(g.id)).length;
            return '<a class="approach" href="#/buscar?abordagem=' + g.id + '">' +
              '<h3>' + esc(a.full) + '</h3><p>' + esc(g.text) + '</p>' +
              '<span class="approach-link">' + n + (n === 1 ? ' profissional' : ' profissionais') + icon('right') + '</span>' +
            '</a>';
          }).join('') +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section" id="duvidas" aria-labelledby="faqTitle">' +
      '<div class="container split">' +
        '<div class="split-head">' +
          '<h2 class="section-title" id="faqTitle">Dúvidas frequentes</h2>' +
          '<p class="lead">Não achou o que procurava? Escreva para <a href="mailto:' + FM.config.supportEmail + '">' + FM.config.supportEmail + '</a>.</p>' +
        '</div>' +
        '<div class="faq">' +
          FM.faq.map((f) => '<details><summary>' + esc(f.q) + icon('right') + '</summary><p>' + esc(f.a) + '</p></details>').join('') +
        '</div>' +
      '</div>' +
    '</section>' +

    '<section class="section section--pro" aria-labelledby="proTitle">' +
      '<div class="container pro-cta">' +
        '<div>' +
          '<h2 class="section-title" id="proTitle">É psicólogo? Atenda pela FitMind.</h2>' +
          '<p>Agenda online, perfil com CRP verificado e pacientes que chegam sabendo como você trabalha.</p>' +
        '</div>' +
        '<a class="btn btn--light btn--lg" href="#/para-psicologos">Conhecer o programa</a>' +
      '</div>' +
    '</section>';
  }

  function mount(ctx, root) {
    const picker = root.querySelector('#heroTopics');
    const read = () => Array.from(picker.querySelectorAll('input:checked')).map((i) => i.value);
    renderMatches(root, read());
    picker.addEventListener('change', () => {
      const topics = read();
      S.setTopics(topics);
      renderMatches(root, topics);
    });
  }

  return { title: 'FitMind — Encontre seu psicólogo e agende sua sessão', render, mount };
})();
