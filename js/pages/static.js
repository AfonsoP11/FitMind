/* Páginas de conteúdo: para psicólogos, documentos legais e 404. */

FM.pages.pros = (function () {
  const { icon } = FM.ui;
  const S = FM.store;

  function render() {
    return '' +
    '<section class="hero hero--pro">' +
      '<div class="container hero-grid hero-grid--pro">' +
        '<div class="hero-copy">' +
          '<h1>Sua agenda cheia de pacientes que já sabem como você trabalha.</h1>' +
          '<p class="lead">Na FitMind, as pessoas escolhem pelo tema, pela abordagem e pelo seu jeito de atender. Você cuida da clínica; a gente cuida da vitrine, da agenda e dos lembretes.</p>' +
          '<a class="btn btn--primary btn--lg" href="#/para-psicologos?s=cadastro">Enviar meu cadastro</a>' +
        '</div>' +
        '<ul class="pro-points">' +
          '<li>' + icon('calendar') + '<div><h3>Agenda que se organiza sozinha</h3><p>Você define dias e horários. Agendamentos, remarcações e lembretes acontecem sem troca de mensagens.</p></div></li>' +
          '<li>' + icon('shield') + '<div><h3>Perfil verificado</h3><p>Conferimos seu CRP e exibimos o selo no perfil. Pacientes confiam mais e chegam mais preparados.</p></div></li>' +
          '<li>' + icon('video') + '<div><h3>Online e presencial</h3><p>Atenda por vídeo, no consultório ou nos dois formatos, cada um com sua própria agenda.</p></div></li>' +
        '</ul>' +
      '</div>' +
    '</section>' +

    '<section class="section" id="cadastro" aria-labelledby="leadTitle">' +
      '<div class="container split">' +
        '<div class="split-head">' +
          '<h2 class="section-title" id="leadTitle">Quero atender pela FitMind</h2>' +
          '<p class="lead">Deixe seus dados. Nossa equipe confere seu registro e entra em contato com os próximos passos.</p>' +
        '</div>' +
        '<form class="panel form" id="leadForm" novalidate>' +
          '<div class="field"><label for="pName">Nome completo</label><input class="input" id="pName" autocomplete="name" required></div>' +
          '<div class="field"><label for="pEmail">E-mail profissional</label><input class="input" id="pEmail" type="email" autocomplete="email" required></div>' +
          '<div class="form-row">' +
            '<div class="field"><label for="pCrp">Número do CRP</label><input class="input" id="pCrp" placeholder="06/123456" required></div>' +
            '<div class="field"><label for="pCity">Cidade</label><input class="input" id="pCity" autocomplete="address-level2"></div>' +
          '</div>' +
          '<p class="form-error" id="leadErr" role="alert" hidden></p>' +
          '<button class="btn btn--primary btn--lg" type="submit">Enviar cadastro</button>' +
        '</form>' +
      '</div>' +
    '</section>';
  }

  function mount(ctx, root) {
    const form = root.querySelector('#leadForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (id) => root.querySelector('#' + id).value.trim();
      const err = root.querySelector('#leadErr');
      if (!v('pName') || !/^\S+@\S+\.\S+$/.test(v('pEmail')) || !/^\d{2}\/\d{4,6}$/.test(v('pCrp'))) {
        err.textContent = 'Preencha nome, e-mail e o CRP no formato 06/123456.';
        err.hidden = false;
        return;
      }
      S.addLead({ name: v('pName'), email: v('pEmail'), crp: v('pCrp'), city: v('pCity') });
      form.innerHTML = '<div class="lead-done">' + icon('check') + '<h3>Cadastro recebido</h3><p>Vamos conferir seu CRP e responder no e-mail ' + FM.ui.esc(v('pEmail')) + ' em até 3 dias úteis.</p></div>';
    });
  }

  return { title: 'Para psicólogos — FitMind', render, mount };
})();

FM.pages.legal = {
  title: (ctx) => (ctx.path === '/termos' ? 'Termos de uso' : 'Política de privacidade') + ' — FitMind',
  render(ctx) {
    const terms = ctx.path === '/termos';
    return '<div class="container narrow legal">' +
      '<h1 class="page-title">' + (terms ? 'Termos de uso' : 'Política de privacidade') + '</h1>' +
      '<p class="lead">Este documento está sendo finalizado com nossa assessoria jurídica e será publicado aqui antes do lançamento.</p>' +
      '<p>Dúvidas enquanto isso? Escreva para <a href="mailto:' + FM.config.supportEmail + '">' + FM.config.supportEmail + '</a>.</p>' +
    '</div>';
  }
};

FM.pages.notFound = {
  title: 'Página não encontrada — FitMind',
  render() {
    return '<div class="container narrow">' + FM.components.emptyState('search', 'Essa página não existe', 'O endereço pode ter mudado. Volte para o início ou procure um psicólogo.',
      '<a class="btn btn--primary" href="#/">Ir para o início</a>') + '</div>';
  }
};
