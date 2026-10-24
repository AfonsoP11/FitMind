/* Estado do app e "API" local.
   Tudo que um backend faria (contas, agenda, consultas) passa por aqui, salvo no
   localStorage. Para ir ao ar de verdade, troque o corpo destas funções por chamadas
   a um backend (ex.: Supabase ou Firebase) mantendo as mesmas assinaturas. */

FM.store = (function () {
  const { ymd, parseYmd, at, addDays, startOfDay } = FM.ui;
  const KEY = FM.config.storageKey;
  const MIN_LEAD_HOURS = 2; // antecedência mínima para agendar

  const empty = () => ({ users: [], session: null, favorites: [], appointments: [], topics: [], leads: [] });

  let state = load();
  const listeners = [];

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? Object.assign(empty(), JSON.parse(raw)) : empty();
    } catch (e) {
      return empty();
    }
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* modo privado: segue em memória */ }
    listeners.forEach((fn) => fn());
  }
  const onChange = (fn) => listeners.push(fn);
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);

  /* Hash simples só para não guardar a senha em texto puro na demonstração.
     Autenticação real precisa ficar no servidor. */
  function hash(s) {
    let h = 5381;
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
    return 'h' + (h >>> 0).toString(36);
  }

  /* ---------- conta ---------- */
  function currentUser() {
    if (!state.session) return null;
    return state.users.find((u) => u.email === state.session) || null;
  }

  function register({ name, email, phone, password }) {
    email = email.trim().toLowerCase();
    if (state.users.some((u) => u.email === email)) {
      return { ok: false, error: 'Já existe uma conta com este e-mail. Entre com sua senha.' };
    }
    state.users.push({ name: name.trim(), email, phone: (phone || '').trim(), pass: hash(password), createdAt: Date.now() });
    state.session = email;
    save();
    return { ok: true };
  }

  function login(email, password) {
    email = email.trim().toLowerCase();
    const u = state.users.find((x) => x.email === email);
    if (!u || u.pass !== hash(password)) return { ok: false, error: 'E-mail ou senha incorretos. Confira e tente de novo.' };
    state.session = email;
    save();
    return { ok: true };
  }

  function logout() { state.session = null; save(); }

  function updateProfile(fields) {
    const u = currentUser();
    if (!u) return;
    Object.assign(u, { name: fields.name.trim(), phone: (fields.phone || '').trim() });
    save();
  }

  function deleteAccount() {
    const u = currentUser();
    if (!u) return;
    state.users = state.users.filter((x) => x.email !== u.email);
    state.appointments = state.appointments.filter((a) => a.user !== u.email);
    state.session = null;
    save();
  }

  /* ---------- favoritos e preferências ---------- */
  const isFav = (id) => state.favorites.includes(id);
  function toggleFav(id) {
    state.favorites = isFav(id) ? state.favorites.filter((x) => x !== id) : state.favorites.concat(id);
    save();
    return isFav(id);
  }
  const getTopics = () => state.topics.slice();
  function setTopics(list) { state.topics = list.slice(); save(); }

  /* ---------- catálogo ---------- */
  const getPsychologists = () => FM.psychologists;
  const getPsychologist = (id) => FM.psychologists.find((p) => p.id === id) || null;

  /* ---------- agenda ---------- */
  // Ocupação simulada e estável: o mesmo horário aparece sempre livre ou ocupado.
  function simulatedTaken(psyId, date, time) {
    const s = psyId + date + time;
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
    h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13;
    return (h >>> 0) % 100 < 38;
  }

  function slotsFor(psy, dateStr) {
    const day = parseYmd(dateStr);
    const today = startOfDay(new Date());
    const limit = addDays(today, FM.config.bookingDaysAhead);
    if (day < today || day > limit || !psy.weekdays.includes(day.getDay())) return [];
    const minTime = Date.now() + MIN_LEAD_HOURS * 36e5;
    return psy.hours.map((time) => {
      const booked = state.appointments.some((a) => a.psyId === psy.id && a.date === dateStr && a.time === time && a.status === 'confirmed');
      const past = at(dateStr, time).getTime() < minTime;
      return { time, available: !booked && !past && !simulatedTaken(psy.id, dateStr, time) };
    });
  }

  const hasSlots = (psy, dateStr) => slotsFor(psy, dateStr).some((s) => s.available);

  function nextAvailable(psy) {
    const today = startOfDay(new Date());
    for (let i = 0; i <= FM.config.bookingDaysAhead; i++) {
      const d = ymd(addDays(today, i));
      const s = slotsFor(psy, d).find((x) => x.available);
      if (s) return { date: d, time: s.time };
    }
    return null;
  }

  // Próximos N horários livres, atravessando dias.
  function upcomingSlots(psy, n) {
    const out = [];
    const today = startOfDay(new Date());
    for (let i = 0; i <= FM.config.bookingDaysAhead && out.length < n; i++) {
      const d = ymd(addDays(today, i));
      slotsFor(psy, d).forEach((s) => { if (s.available && out.length < n) out.push({ date: d, time: s.time }); });
    }
    return out;
  }

  /* ---------- consultas ---------- */
  function myAppointments() {
    const u = currentUser();
    if (!u) return [];
    return state.appointments
      .filter((a) => a.user === u.email)
      .sort((a, b) => at(a.date, a.time) - at(b.date, b.time));
  }
  const getAppointment = (id) => myAppointments().find((a) => a.id === id) || null;

  function book({ psyId, date, time, modality, note }) {
    const u = currentUser();
    const psy = getPsychologist(psyId);
    if (!u) return { ok: false, error: 'Entre na sua conta para agendar.' };
    const slot = slotsFor(psy, date).find((s) => s.time === time);
    if (!slot || !slot.available) return { ok: false, error: 'Esse horário acabou de ser ocupado. Escolha outro.' };
    const appt = {
      id: uid(), user: u.email, psyId, date, time, modality,
      price: psy.price, note: (note || '').trim(), status: 'confirmed', createdAt: Date.now()
    };
    state.appointments.push(appt);
    save();
    return { ok: true, appt };
  }

  function cancel(id) {
    const a = state.appointments.find((x) => x.id === id);
    if (a) { a.status = 'cancelled'; a.cancelledAt = Date.now(); save(); }
  }

  function reschedule(id, date, time) {
    const a = state.appointments.find((x) => x.id === id);
    if (!a) return { ok: false, error: 'Consulta não encontrada.' };
    const psy = getPsychologist(a.psyId);
    const slot = slotsFor(psy, date).find((s) => s.time === time);
    if (!slot || !slot.available) return { ok: false, error: 'Esse horário acabou de ser ocupado. Escolha outro.' };
    a.date = date; a.time = time;
    save();
    return { ok: true, appt: a };
  }

  function canCancelFree(appt) {
    return at(appt.date, appt.time).getTime() - Date.now() >= FM.config.cancelFreeHours * 36e5;
  }

  /* ---------- profissionais interessados ---------- */
  function addLead(lead) { state.leads.push(Object.assign({ at: Date.now() }, lead)); save(); }

  return {
    onChange, currentUser, register, login, logout, updateProfile, deleteAccount,
    isFav, toggleFav, getTopics, setTopics, getPsychologists, getPsychologist,
    slotsFor, hasSlots, nextAvailable, upcomingSlots,
    myAppointments, getAppointment, book, cancel, reschedule, canCancelFree, addLead
  };
})();
