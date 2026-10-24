/* Agendamento (e remarcação) e página de confirmação. */

FM.pages.booking = (function () {
  const { icon, esc, money, avatar, ymd, parseYmd, addDays, startOfDay, longDay, monthYear, WEEK_SHORT } = FM.ui;
  const C = FM.components;
  const S = FM.store;

  function render(ctx) {
    const psy = S.getPsychologist(ctx.params.id);
    if (!psy) return '<div class="container narrow">' + C.emptyState('calendar', 'Profissional não encontrado', 'Volte para a busca e escolha outro perfil.', '<a class="btn btn--primary" href="#/buscar">Ir para a busca</a>') + '</div>';
    const re = ctx.query.reagendar && S.getAppointment(ctx.query.reagendar);

    return '<div class="container booking-page">' +
      C.backLink(re ? '/consultas' : '/psicologo/' + psy.id, re ? 'Voltar para Minhas consultas' : 'Voltar para o perfil') +
      '<h1 class="page-title">' + (re ? 'Escolha o novo horário' : 'Agende sua sessão') + '</h1>' +
      '<div class="booking-layout">' +
        '<div class="booking-main">' +
          '<section class="panel" aria-labelledby="calTitle">' +
            '<h2 class="panel-title" id="calTitle">Dia</h2>' +
            '<div class="cal" id="cal"></div>' +
          '</section>' +
          '<section class="panel" aria-labelledby="slotTitle">' +
            '<h2 class="panel-title" id="slotTitle">Horário</h2>' +
            '<div id="slots" class="slot-grid"></div>' +
          '</section>' +
          (re ? '' :
          '<section class="panel" aria-labelledby="modTitle">' +
            '<h2 class="panel-title" id="modTitle">Formato</h2>' +
            '<div class="mod-row" id="mods">' +
              ['online', 'presencial'].map((m) => {
                const ok = psy.modalities.includes(m);
                return '<label class="mod' + (ok ? '' : ' is-disabled') + '">' +
                  '<input type="radio" name="mod" value="' + m + '"' + (ok ? '' : ' disabled') + '>' +
                  icon(m === 'online' ? 'video' : 'pin') +
                  '<b>' + (m === 'online' ? 'Online' : 'Presencial') + '</b>' +
                  '<small>' + (ok ? (m === 'online' ? 'Videochamada pelo navegador' : 'Consultório em ' + esc(psy.city)) : 'Não disponível com este profissional') + '</small>' +
                '</label>';
              }).join('') +
            '</div>' +
          '</section>' +
          '<section class="panel" aria-labelledby="noteTitle">' +
            '<h2 class="panel-title" id="noteTitle">Quer adiantar algo? <span class="optional">Opcional</span></h2>' +
            '<textarea id="note" class="input" rows="3" maxlength="500" placeholder="Por exemplo: é minha primeira vez fazendo terapia."></textarea>' +
            '<p class="fine">Só ' + (psy.gender === 'f' ? 'a psicóloga' : 'o psicólogo') + ' vê esta mensagem.</p>' +
          '</section>') +
        '</div>' +

        '<aside class="booking-aside">' +
          '<div class="summary" id="summary">' +
            '<div class="summary-psy">' + avatar(psy, 'md') + '<div><b>' + esc(psy.name) + '</b><span>CRP ' + psy.crp + '</span></div></div>' +
            '<dl class="summary-list" id="summaryList"></dl>' +
            '<p class="form-error" id="bookError" role="alert" hidden></p>' +
            '<button type="button" class="btn btn--primary btn--block btn--lg" id="confirmBtn" disabled></button>' +
            '<p class="fine">' + (re ? 'A remarcação é gratuita até ' : 'Cancelamento e remarcação grátis até ') + FM.config.cancelFreeHours + ' horas antes.</p>' +
          '</div>' +
        '</aside>' +
      '</div>' +
    '</div>';
  }

  function mount(ctx, root) {
    const psy = S.getPsychologist(ctx.params.id);
    if (!psy) return;
    const re = ctx.query.reagendar && S.getAppointment(ctx.query.reagendar);

    const today = startOfDay(new Date());
    const last = addDays(today, FM.config.bookingDaysAhead);
    const first = S.nextAvailable(psy);
    const st = {
      date: ctx.query.d && S.hasSlots(psy, ctx.query.d) ? ctx.query.d : (first ? first.date : null),
      time: null,
      modality: re ? re.modality : (ctx.query.m && psy.modalities.includes(ctx.query.m) ? ctx.query.m : psy.modalities[0])
    };
    if (st.date && ctx.query.t && S.slotsFor(psy, st.date).some((s) => s.time === ctx.query.t && s.available)) st.time = ctx.query.t;
    let month = st.date ? parseYmd(st.date) : new Date(today);
    month = new Date(month.getFullYear(), month.getMonth(), 1);

    function drawCal() {
      const y = month.getFullYear(), m = month.getMonth();
      const days = new Date(y, m + 1, 0).getDate();
      const offset = new Date(y, m, 1).getDay();
      const canPrev = new Date(y, m, 1) > today;
      const canNext = new Date(y, m + 1, 1) <= last;
      let cells = '';
      for (let i = 0; i < offset; i++) cells += '<span></span>';
      for (let d = 1; d <= days; d++) {
        const date = new Date(y, m, d);
        const id = ymd(date);
        const avail = S.hasSlots(psy, id);
        const cls = ['cal-day', avail ? 'has-slots' : '', id === st.date ? 'is-selected' : '', id === ymd(today) ? 'is-today' : ''].filter(Boolean).join(' ');
        cells += '<button type="button" class="' + cls + '" data-date="' + id + '"' + (avail ? '' : ' disabled') +
          ' aria-pressed="' + (id === st.date) + '" aria-label="' + longDay(date) + (avail ? '' : ', sem horários') + '">' + d + '</button>';
      }
      root.querySelector('#cal').innerHTML =
        '<div class="cal-nav">' +
          '<button type="button" class="icon-btn" data-nav="-1" aria-label="Mês anterior"' + (canPrev ? '' : ' disabled') + '>' + icon('left') + '</button>' +
          '<p class="cal-month" aria-live="polite">' + monthYear(month) + '</p>' +
          '<button type="button" class="icon-btn" data-nav="1" aria-label="Próximo mês"' + (canNext ? '' : ' disabled') + '>' + icon('right') + '</button>' +
        '</div>' +
        '<div class="cal-grid">' + WEEK_SHORT.map((w) => '<span class="cal-dow">' + w + '</span>').join('') + cells + '</div>';
    }

    function drawSlots() {
      const box = root.querySelector('#slots');
      if (!st.date) { box.innerHTML = '<p class="muted">Sem horários livres nos próximos ' + FM.config.bookingDaysAhead + ' dias.</p>'; return; }
      const slots = S.slotsFor(psy, st.date);
      const free = slots.filter((s) => s.available).length;
      box.innerHTML = '<p class="slot-day">' + longDay(parseYmd(st.date)) + ' <span class="muted">' + free + (free === 1 ? ' horário livre' : ' horários livres') + '</span></p>' +
        '<div class="slot-row">' +
        slots.map((s) => '<button type="button" class="slot' + (s.time === st.time ? ' is-selected' : '') + '" data-time="' + s.time + '"' +
          (s.available ? ' aria-pressed="' + (s.time === st.time) + '"' : ' disabled aria-label="' + s.time + ', ocupado"') + '>' + s.time + '</button>').join('') +
        '</div>';
    }

    function drawSummary() {
      const btn = root.querySelector('#confirmBtn');
      const row = (k, v) => '<div><dt>' + k + '</dt><dd>' + v + '</dd></div>';
      root.querySelector('#summaryList').innerHTML =
        (re ? row('Horário atual', longDay(parseYmd(re.date)) + ', ' + re.time) : '') +
        row(re ? 'Novo dia' : 'Dia', st.date ? longDay(parseYmd(st.date)) : '<span class="muted">Escolha no calendário</span>') +
        row('Horário', st.time ? st.time + ' (' + psy.duration + ' min)' : '<span class="muted">Escolha um horário</span>') +
        row('Formato', st.modality === 'online' ? 'Online' : 'Presencial') +
        (re ? '' : '<div class="summary-total"><dt>Total</dt><dd>' + money(psy.price) + '</dd></div>');
      btn.disabled = !(st.date && st.time);
      const logged = !!S.currentUser();
      btn.textContent = re ? 'Confirmar novo horário' : (logged ? 'Confirmar agendamento' : 'Entrar e confirmar');
      const mods = root.querySelector('#mods');
      if (mods) mods.querySelectorAll('input').forEach((i) => { i.checked = i.value === st.modality; });
    }

    const draw = () => { drawCal(); drawSlots(); drawSummary(); };

    root.querySelector('#cal').addEventListener('click', (e) => {
      const nav = e.target.closest('[data-nav]');
      if (nav) { month = new Date(month.getFullYear(), month.getMonth() + Number(nav.dataset.nav), 1); drawCal(); return; }
      const day = e.target.closest('[data-date]');
      if (day && !day.disabled) { st.date = day.dataset.date; st.time = null; draw(); root.querySelector('#slots .slot:not([disabled])')?.focus(); }
    });
    root.querySelector('#slots').addEventListener('click', (e) => {
      const b = e.target.closest('[data-time]');
      if (b && !b.disabled) { st.time = b.dataset.time; drawSlots(); drawSummary(); }
    });
    root.querySelector('#mods')?.addEventListener('change', (e) => { st.modality = e.target.value; drawSummary(); });

    root.querySelector('#confirmBtn').addEventListener('click', () => {
      const err = root.querySelector('#bookError');
      err.hidden = true;
      if (!S.currentUser()) {
        const back = '/agendar/' + psy.id + '?d=' + st.date + '&t=' + st.time + '&m=' + st.modality;
        FM.go('/entrar?next=' + encodeURIComponent(back) + '&motivo=agendar');
        return;
      }
      const res = re
        ? S.reschedule(re.id, st.date, st.time)
        : S.book({ psyId: psy.id, date: st.date, time: st.time, modality: st.modality, note: root.querySelector('#note').value });
      if (!res.ok) { err.textContent = res.error; err.hidden = false; st.time = null; draw(); return; }
      if (re) { FM.ui.toast('Sessão remarcada para ' + FM.ui.relDay(parseYmd(st.date)).toLowerCase() + ', ' + st.time); FM.go('/consultas'); }
      else FM.go('/confirmado/' + res.appt.id);
    });

    draw();
  }

  return { title: 'Agendar sessão — FitMind', render, mount };
})();

FM.pages.confirmed = (function () {
  const { icon, esc, money, avatar, parseYmd, longDay } = FM.ui;
  const C = FM.components;
  const S = FM.store;

  function render(ctx) {
    const a = S.getAppointment(ctx.params.id);
    if (!a) return '<div class="container narrow">' + C.emptyState('calendar', 'Consulta não encontrada', 'Veja todas as suas sessões em Minhas consultas.', '<a class="btn btn--primary" href="#/consultas">Minhas consultas</a>') + '</div>';
    const psy = S.getPsychologist(a.psyId);
    const first = S.currentUser().name.split(' ')[0];

    return '<div class="container narrow confirm-page">' +
      '<div class="confirm-mark" aria-hidden="true"><svg viewBox="0 0 52 52"><path d="m14 27 8 8 16-17"/></svg></div>' +
      '<h1>Tudo certo, ' + esc(first) + '. Sua sessão está marcada.</h1>' +
      '<p class="lead">' + (a.modality === 'online'
        ? 'O link da videochamada aparece em Minhas consultas ' + FM.config.joinWindowMinutes + ' minutos antes do horário.'
        : 'O endereço do consultório está nos detalhes da consulta.') + '</p>' +
      '<div class="ticket">' +
        '<div class="ticket-psy">' + avatar(psy, 'md') + '<div><b>' + esc(psy.name) + '</b><span>' + psy.approaches.map((x) => FM.ui.approach(x).label).join(' e ') + ', CRP ' + psy.crp + '</span></div></div>' +
        '<dl class="ticket-list">' +
          '<div><dt>Dia</dt><dd>' + longDay(parseYmd(a.date)) + '</dd></div>' +
          '<div><dt>Horário</dt><dd>' + a.time + ', ' + psy.duration + ' min</dd></div>' +
          '<div><dt>Formato</dt><dd>' + (a.modality === 'online' ? 'Online' : 'Presencial, ' + esc(psy.city)) + '</dd></div>' +
          '<div><dt>Valor</dt><dd>' + money(a.price) + '</dd></div>' +
        '</dl>' +
      '</div>' +
      '<div class="confirm-actions">' +
        '<button type="button" class="btn btn--outline" id="ics">' + icon('download') + 'Adicionar ao calendário</button>' +
        '<a class="btn btn--primary" href="#/consultas">Ver minhas consultas</a>' +
      '</div>' +
      '<p class="fine">Precisa mudar? Remarque ou cancele grátis até ' + FM.config.cancelFreeHours + ' horas antes, em Minhas consultas.</p>' +
    '</div>';
  }

  function mount(ctx, root) {
    const a = S.getAppointment(ctx.params.id);
    if (!a) return;
    root.querySelector('#ics').addEventListener('click', () => FM.ui.downloadIcs(a, S.getPsychologist(a.psyId)));
  }

  return { title: 'Sessão marcada — FitMind', render, mount };
})();
