/* Minha conta: dados pessoais, favoritos, sair e apagar conta. */

FM.pages.account = (function () {
  const { icon, esc } = FM.ui;
  const C = FM.components;
  const S = FM.store;

  function render() {
    const u = S.currentUser();
    const favs = S.getPsychologists().filter((p) => S.isFav(p.id));
    const upcoming = S.myAppointments().filter((a) => a.status === 'confirmed' && FM.ui.at(a.date, a.time) > Date.now()).length;

    return '<div class="container narrow account-page">' +
      '<header class="account-head">' +
        '<span class="avatar avatar--xl" style="--av:var(--green-600)" aria-hidden="true">' + esc(FM.ui.initials(u.name)) + '</span>' +
        '<div><h1 class="page-title">' + esc(u.name) + '</h1><p class="muted">' + esc(u.email) + '</p></div>' +
      '</header>' +

      '<a class="account-shortcut" href="#/consultas">' + icon('calendar') +
        '<span><b>Minhas consultas</b><small>' + (upcoming ? upcoming + (upcoming === 1 ? ' sessão marcada' : ' sessões marcadas') : 'Nenhuma sessão marcada') + '</small></span>' + icon('right') +
      '</a>' +

      '<section class="panel" aria-labelledby="dataTitle">' +
        '<h2 class="panel-title" id="dataTitle">Seus dados</h2>' +
        '<form class="form" id="profileForm" novalidate>' +
          '<div class="field"><label for="aName">Nome</label><input class="input" id="aName" value="' + esc(u.name) + '" autocomplete="name" required></div>' +
          '<div class="field"><label for="aEmail">E-mail</label><input class="input" id="aEmail" value="' + esc(u.email) + '" disabled><p class="field-hint">Para trocar o e-mail, fale com o suporte.</p></div>' +
          '<div class="field"><label for="aPhone">Celular</label><input class="input" id="aPhone" type="tel" value="' + esc(u.phone || '') + '" autocomplete="tel" placeholder="(11) 90000-0000"></div>' +
          '<button class="btn btn--primary" type="submit">Salvar alterações</button>' +
        '</form>' +
      '</section>' +

      '<section class="account-favs" aria-labelledby="favTitle">' +
        '<h2 class="panel-title" id="favTitle">Favoritos</h2>' +
        (favs.length ? '<div class="results-list">' + favs.map((p) => C.psyCard(p)).join('') + '</div>'
          : '<p class="muted">Toque no coração de um perfil para guardar aqui e comparar depois.</p>') +
      '</section>' +

      '<section class="panel" aria-labelledby="privTitle">' +
        '<h2 class="panel-title" id="privTitle">Privacidade</h2>' +
        '<p class="muted">Você pode apagar sua conta e todo o histórico de consultas a qualquer momento, como garante a LGPD.</p>' +
        '<div class="account-danger">' +
          '<button type="button" class="btn btn--outline" id="logout">' + icon('logout') + 'Sair da conta</button>' +
          '<button type="button" class="btn btn--danger-quiet" id="delete">' + icon('trash') + 'Apagar minha conta</button>' +
        '</div>' +
      '</section>' +

      '<dialog class="dialog" id="delDialog" aria-labelledby="delTitle"><form method="dialog">' +
        '<h2 id="delTitle">Apagar sua conta?</h2>' +
        '<p>Seus dados e o histórico de consultas serão apagados e não dá para desfazer. Sessões futuras serão canceladas.</p>' +
        '<div class="dialog-actions"><button class="btn btn--outline" value="keep">Manter conta</button><button class="btn btn--danger" value="confirm">Apagar conta</button></div>' +
      '</form></dialog>' +
    '</div>';
  }

  function mount(ctx, root) {
    root.querySelector('#profileForm').addEventListener('submit', (e) => {
      e.preventDefault();
      const name = root.querySelector('#aName').value;
      if (name.trim().length < 2) { FM.ui.toast('Digite seu nome para salvar.', 'error'); return; }
      S.updateProfile({ name, phone: root.querySelector('#aPhone').value });
      root.querySelector('.account-head h1').textContent = name.trim();
      FM.ui.toast('Alterações salvas');
    });
    root.querySelector('#logout').addEventListener('click', () => { S.logout(); FM.ui.toast('Você saiu da conta'); FM.go('/'); });
    const dlg = root.querySelector('#delDialog');
    root.querySelector('#delete').addEventListener('click', () => dlg.showModal());
    dlg.addEventListener('close', () => {
      if (dlg.returnValue !== 'confirm') return;
      S.deleteAccount();
      FM.ui.toast('Sua conta foi apagada');
      FM.go('/');
    });
  }

  return { title: 'Minha conta — FitMind', render, mount };
})();
