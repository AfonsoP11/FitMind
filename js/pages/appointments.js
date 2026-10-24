/* Minhas consultas: próximas e anteriores, com entrar, remarcar, cancelar e calendário. */

FM.pages.appointments = (function () {
  const { icon, esc, money, avatar, at, parseYmd, relDay } = FM.ui;
  const C = FM.components;
  const S = FM.store;

  function split() {
    const now = Date.now();
    const all = S.myAppointments();
    return {
      upcoming: all.filter((a) => a.status === 'confirmed' && at(a.date, a.time).getTime() + 60 * 60000 > now),
      past: all.filter((a) => a.status !== 'confirmed' || at(a.date, a.time).getTime() + 60 * 60000 <= now).reverse()
    };
  }

  function countdown(a) {
    const ms = at(a.date, a.time) - Date.now();
    if (ms <= 0) return 'Acontecendo agora';
    const h = Math.floor(ms / 36e5);
    if (h < 1) return 'Começa em ' + Math.max(1, Math.round(ms / 60000)) + ' min';
    if (h < 24) return 'Começa em ' + h + (h === 1 ? ' hora' : ' horas');
    const d = Math.round(h / 24);
    return 'Daqui a ' + d + (d === 1 ? ' dia' : ' dias');
  }

  function card(a, upcoming) {
    const psy = S.getPsychologist(a.psyId);
    const start = at(a.date, a.time);
    const cancelled = a.status === 'cancelled';
    const joinOpen = start - Date.now() <= FM.config.joinWindowMinutes * 60000;

    let actions = '';
    if (upcoming) {
      const primary = a.modality === 'online'
        ? (joinOpen
            ? '<button type="button" class="btn btn--primary btn--sm" data-act="join" data-id="' + a.id + '">' + icon('video') + 'Entrar na sessão</button>'
            : '<button type="button" class="btn btn--primary btn--sm" disabled title="Libera ' + FM.config.joinWindowMinutes + ' minutos antes">' + icon('video') + 'Link libera ' + FM.config.joinWindowMinutes + ' min antes</button>')
        : '<a class="btn btn--primary btn--sm" target="_blank" rel="noopener" href="https://www.google.com/maps/search/' + encodeURIComponent('consultório ' + psy.city) + '">' + icon('pin') + 'Como chegar</a>';
      actions = '<div class="appt-actions">' + primary +
        '<button type="button" class="btn btn--outline btn--sm" data-act="ics" data-id="' + a.id + '">' + icon('download') + 'Calendário</button>' +
        '<a class="btn btn--outline btn--sm" href="#/agendar/' + psy.id + '?reagendar=' + a.id + '">Remarcar</a>' +
        '<button type="button" class="btn btn--danger-quiet btn--sm" data-act="cancel" data-id="' + a.id + '">Cancelar</button>' +
      '</div>';
    } else if (!cancelled) {
      actions = '<div class="appt-actions"><a class="btn btn--outline btn--sm" href="#/agendar/' + psy.id + '">Agendar de novo</a></div>';
    }

    return '<article class="appt' + (cancelled ? ' is-cancelled' : '') + '">' +
      '<div class="appt-date" aria-hidden="true"><b>' + parseYmd(a.date).getDate() + '</b><span>' + FM.ui.WEEK_SHORT[parseYmd(a.date).getDay()] + '</span></div>' +
      '<div class="appt-body">' +
        '<div class="appt-top">' +
          avatar(psy, 'sm') +
          '<div><h3><a href="#/psicologo/' + psy.id + '">' + esc(psy.name) + '</a></h3>' +
          '<p class="muted">' + FM.ui.longDay(parseYmd(a.date)) + ', ' + a.time + ' · ' + (a.modality === 'online' ? 'Online' : 'Presencial') + ' · ' + money(a.price) + '</p></div>' +
          (cancelled ? '<span class="status status--off">Cancelada</span>'
            : upcoming ? '<span class="status' + (start - Date.now() < 864e5 ? ' status--soon' : '') + '">' + countdown(a) + '</span>'
            : '<span class="status status--done">Realizada</span>') +
        '</div>' +
        actions +
      '</div>' +
    '</article>';
  }

  function listHtml(tab, list) {
    return list.length
      ? list.map((a) => card(a, tab === 'upcoming')).join('')
      : tab === 'upcoming'
        ? C.emptyState('calendar', 'Nenhuma sessão marcada', 'Quando você agendar, a sessão aparece aqui com o link e os lembretes.', '<a class="btn btn--primary" href="#/buscar">Encontrar psicólogo</a>')
        : C.emptyState('clock', 'Nada por aqui ainda', 'Suas sessões realizadas e canceladas ficam guardadas nesta aba.');
  }

  const tabOf = (ctx) => (ctx.query.aba === 'anteriores' ? 'past' : 'upcoming');

  function render(ctx) {
    const tab = tabOf(ctx);
    const { upcoming, past } = split();
    const list = tab === 'past' ? past : upcoming;

    return '<div class="container narrow appts-page">' +
      '<h1 class="page-title">Minhas consultas</h1>' +
      '<nav class="tabs" aria-label="Filtrar consultas">' +
        '<a href="#/consultas"' + (tab === 'upcoming' ? ' aria-current="page"' : '') + '>Próximas <span class="count">' + upcoming.length + '</span></a>' +
        '<a href="#/consultas?aba=anteriores"' + (tab === 'past' ? ' aria-current="page"' : '') + '>Anteriores <span class="count">' + past.length + '</span></a>' +
      '</nav>' +
      '<div class="appt-list" id="apptList">' + listHtml(tab, list) + '</div>' +
      '<dialog class="dialog" id="cancelDialog" aria-labelledby="cancelTitle">' +
        '<form method="dialog">' +
          '<h2 id="cancelTitle">Cancelar esta sessão?</h2>' +
          '<p id="cancelText"></p>' +
          '<div class="dialog-actions">' +
            '<button class="btn btn--outline" value="keep">Manter sessão</button>' +
            '<button class="btn btn--danger" value="confirm">Cancelar sessão</button>' +
          '</div>' +
        '</form>' +
      '</dialog>' +
    '</div>';
  }

  function mount(ctx, root) {
    const dialog = root.querySelector('#cancelDialog');
    let pending = null;

    root.querySelector('#apptList').addEventListener('click', (e) => {
      const b = e.target.closest('[data-act]');
      if (!b) return;
      const a = S.getAppointment(b.dataset.id);
      const psy = S.getPsychologist(a.psyId);
      if (b.dataset.act === 'ics') FM.ui.downloadIcs(a, psy);
      if (b.dataset.act === 'join') FM.ui.toast('A videochamada abre aqui quando a integração de vídeo estiver ativa.');
      if (b.dataset.act === 'cancel') {
        pending = a;
        root.querySelector('#cancelText').textContent = S.canCancelFree(a)
          ? 'Sua sessão de ' + relDay(parseYmd(a.date)).toLowerCase() + ', ' + a.time + ' com ' + psy.name + ' será cancelada sem custo. O horário volta a ficar livre para outras pessoas.'
          : 'Faltam menos de ' + FM.config.cancelFreeHours + ' horas para a sessão. Pela política de cancelamento, o valor de ' + money(a.price) + ' não é devolvido. Se quiser, tente remarcar com ' + psy.name + '.';
        dialog.showModal();
      }
    });

    dialog.addEventListener('close', () => {
      if (dialog.returnValue === 'confirm' && pending) {
        S.cancel(pending.id);
        FM.ui.toast('Sessão cancelada');
        FM.go('/consultas');
      }
      pending = null;
    });

    // Atualiza contagens regressivas e libera o botão de entrar sem recarregar.
    const timer = setInterval(() => {
      if (dialog.open) return;
      const tab = tabOf(ctx);
      root.querySelector('#apptList').innerHTML = listHtml(tab, split()[tab]);
    }, 60000);
    return () => clearInterval(timer);
  }

  return { title: 'Minhas consultas — FitMind', render, mount };
})();
