/* Utilitários de interface: escape de HTML, ícones, datas, dinheiro, toast. */

FM.ui = (function () {
  const ICONS = {
    search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
    sliders: '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
    heart: '<path d="M12 20s-7-4.4-9.2-9A5 5 0 0 1 12 6a5 5 0 0 1 9.2 5C19 15.6 12 20 12 20Z"/>',
    calendar: '<rect x="3.5" y="5" width="17" height="15" rx="2.5"/><path d="M3.5 10h17M8 3v4M16 3v4"/>',
    clock: '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
    video: '<rect x="3" y="6.5" width="12.5" height="11" rx="2.5"/><path d="m15.5 10.5 5-3v9l-5-3"/>',
    pin: '<path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z"/><circle cx="12" cy="10" r="2.3"/>',
    check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
    x: '<path d="M6 6l12 12M18 6 6 18"/>',
    left: '<path d="m14.5 6-6 6 6 6"/>',
    right: '<path d="m9.5 6 6 6-6 6"/>',
    user: '<circle cx="12" cy="8.5" r="3.8"/><path d="M4.5 20c1.2-3.6 4-5.5 7.5-5.5s6.3 1.9 7.5 5.5"/>',
    home: '<path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1Z"/>',
    star: '<path d="m12 3.8 2.5 5.1 5.6.8-4 4 1 5.6-5.1-2.7-5 2.7.9-5.6-4-4 5.6-.8Z"/>',
    shield: '<path d="M12 3.5 5 6v5.5c0 4.3 3 7.8 7 9 4-1.2 7-4.7 7-9V6Z"/><path d="m9 12 2.2 2.2L15.5 10"/>',
    lock: '<rect x="5" y="10.5" width="14" height="10" rx="2.5"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>',
    logout: '<path d="M14 4h4a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-4M10 16l-4-4 4-4M6 12h10"/>',
    download: '<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>',
    chat: '<path d="M5 18.5V6.5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H8.5Z"/>',
    phone: '<path d="M6.5 4h3l1.5 4-2 1.3a10 10 0 0 0 5.7 5.7L16 13l4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 4.5 6.2 2 2 0 0 1 6.5 4Z"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    globe: '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.4 2.4 3.5 5.2 3.5 8.5s-1.1 6.1-3.5 8.5c-2.4-2.4-3.5-5.2-3.5-8.5S9.6 5.9 12 3.5Z"/>',
    edit: '<path d="M4.5 19.5h4l10-10a2.8 2.8 0 0 0-4-4l-10 10Z"/>',
    trash: '<path d="M5 7h14M10 7V5h4v2M7 7l1 12.5h8L17 7"/>',
    eye: '<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="2.8"/>',
    eyeOff: '<path d="M4 4l16 16M10 6c.6-.1 1.3-.2 2-.2 6 0 9.5 6.5 9.5 6.5a17 17 0 0 1-3 3.6M6.6 7.4C3.9 9.2 2.5 12 2.5 12S6 18.5 12 18.5c1.4 0 2.7-.3 3.8-.9"/>'
  };

  function icon(name, cls) {
    return '<svg class="ico' + (cls ? ' ' + cls : '') + '" viewBox="0 0 24 24" aria-hidden="true">' + (ICONS[name] || '') + '</svg>';
  }

  function esc(s) {
    return String(s == null ? '' : s)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
  }

  const money = (n) => 'R$ ' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits: 0 });

  /* ---------- datas (sempre em horário local) ---------- */
  const pad = (n) => String(n).padStart(2, '0');
  const ymd = (d) => d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  function parseYmd(s) { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); }
  function at(dateStr, time) { const d = parseYmd(dateStr); const [h, m] = time.split(':').map(Number); d.setHours(h, m, 0, 0); return d; }
  function startOfDay(d) { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }
  function addDays(d, n) { const x = new Date(d); x.setDate(x.getDate() + n); return x; }

  const WEEK = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
  const WEEK_SHORT = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
  const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];

  function dayDiff(d) { return Math.round((startOfDay(d) - startOfDay(new Date())) / 864e5); }

  function relDay(d) {
    const diff = dayDiff(d);
    if (diff === 0) return 'Hoje';
    if (diff === 1) return 'Amanhã';
    return WEEK_SHORT[d.getDay()] + ', ' + d.getDate() + '/' + pad(d.getMonth() + 1);
  }
  function longDay(d) { return WEEK[d.getDay()] + ', ' + d.getDate() + ' de ' + MONTHS[d.getMonth()]; }
  function monthYear(d) { return MONTHS[d.getMonth()] + ' de ' + d.getFullYear(); }

  /* ---------- catálogo ---------- */
  const topicLabel = (id) => (FM.topics.find((t) => t.id === id) || { label: id }).label;
  const approach = (id) => FM.approaches.find((a) => a.id === id) || { label: id, full: id };

  function initials(name) {
    const p = name.split(' ').filter(Boolean);
    return (p[0][0] + (p.length > 1 ? p[p.length - 1][0] : '')).toUpperCase();
  }

  function avatar(psy, size) {
    return '<span class="avatar avatar--' + (size || 'md') + '" style="--av:' + psy.color + '" aria-hidden="true">' + initials(psy.name) + '</span>';
  }

  function rating(psy) {
    return '<span class="rating">' + icon('star', 'ico--fill') + '<b>' + psy.rating.toFixed(1).replace('.', ',') + '</b><span class="muted">(' + psy.reviewCount + ')</span></span>';
  }

  function modalityText(mods) {
    if (mods.length === 2) return 'Online e presencial';
    return mods[0] === 'online' ? 'Só online' : 'Só presencial';
  }

  /* ---------- toast ---------- */
  let toastTimer;
  function toast(msg, kind) {
    const el = document.getElementById('toast');
    el.innerHTML = icon(kind === 'error' ? 'x' : 'check') + '<span>' + esc(msg) + '</span>';
    el.className = 'toast show' + (kind === 'error' ? ' toast--error' : '');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { el.className = 'toast'; }, 3200);
  }

  /* Baixa um arquivo .ics para adicionar a consulta ao calendário. */
  function downloadIcs(appt, psy) {
    const start = at(appt.date, appt.time);
    const end = new Date(start.getTime() + psy.duration * 60000);
    const f = (d) => d.getUTCFullYear() + pad(d.getUTCMonth() + 1) + pad(d.getUTCDate()) + 'T' + pad(d.getUTCHours()) + pad(d.getUTCMinutes()) + '00Z';
    const ics = [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//FitMind//PT-BR', 'BEGIN:VEVENT',
      'UID:' + appt.id + '@fitmind',
      'DTSTAMP:' + f(new Date()),
      'DTSTART:' + f(start), 'DTEND:' + f(end),
      'SUMMARY:Sessão com ' + psy.name,
      'DESCRIPTION:' + (appt.modality === 'online' ? 'Sessão online. O link aparece em Minhas consultas.' : 'Sessão presencial em ' + psy.city + '.'),
      'BEGIN:VALARM', 'TRIGGER:-PT1H', 'ACTION:DISPLAY', 'DESCRIPTION:Sua sessão começa em 1 hora', 'END:VALARM',
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
    const url = URL.createObjectURL(new Blob([ics], { type: 'text/calendar' }));
    const a = document.createElement('a');
    a.href = url; a.download = 'sessao-fitmind.ics';
    document.body.appendChild(a); a.click(); a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  return {
    icon, esc, money, pad, ymd, parseYmd, at, startOfDay, addDays, dayDiff, relDay, longDay, monthYear,
    WEEK_SHORT, topicLabel, approach, initials, avatar, rating, modalityText, toast, downloadIcs
  };
})();
