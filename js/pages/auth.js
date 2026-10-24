/* Entrar e criar conta. */

FM.pages.auth = (function () {
  const { icon, esc } = FM.ui;
  const S = FM.store;

  const field = (id, label, input, hint) =>
    '<div class="field"><label for="' + id + '">' + label + '</label>' + input +
    (hint ? '<p class="field-hint" id="' + id + 'Hint">' + hint + '</p>' : '') +
    '<p class="field-error" id="' + id + 'Err" hidden></p></div>';

  const passInput = (id, auto) =>
    '<div class="pass"><input class="input" type="password" id="' + id + '" name="password" autocomplete="' + auto + '" required minlength="8" aria-describedby="' + id + 'Err' + (auto === 'new-password' ? ' ' + id + 'Hint' : '') + '">' +
    '<button type="button" class="pass-toggle" data-toggle="' + id + '" aria-label="Mostrar senha">' + icon('eye') + '</button></div>';

  function render(ctx) {
    if (S.currentUser()) return '<div class="container narrow"><p>Você já entrou. <a href="#/conta">Ir para minha conta</a>.</p></div>';
    const signup = ctx.query.tab === 'cadastro';
    const why = ctx.query.motivo === 'agendar'
      ? '<p class="notice">' + icon('calendar') + 'Entre ou crie sua conta para confirmar. O dia e o horário que você escolheu ficam guardados.</p>'
      : '';

    return '<div class="auth-page">' +
      '<aside class="auth-side" aria-hidden="true">' +
        '<p class="auth-quote">Marcar a primeira sessão costuma ser a parte mais difícil. Daqui pra frente, a gente simplifica.</p>' +
      '</aside>' +
      '<div class="auth-main">' +
        '<div class="auth-box">' +
          '<h1 class="page-title">' + (signup ? 'Crie sua conta' : 'Que bom ter você de volta') + '</h1>' +
          why +
          '<div class="seg" role="tablist" aria-label="Acesso">' +
            '<button type="button" role="tab" id="tabLogin" aria-controls="formLogin" aria-selected="' + !signup + '">Entrar</button>' +
            '<button type="button" role="tab" id="tabSignup" aria-controls="formSignup" aria-selected="' + signup + '">Criar conta</button>' +
          '</div>' +

          '<form id="formLogin" class="form" role="tabpanel" aria-labelledby="tabLogin" novalidate' + (signup ? ' hidden' : '') + '>' +
            field('lEmail', 'E-mail', '<input class="input" type="email" id="lEmail" name="email" autocomplete="email" required aria-describedby="lEmailErr">') +
            field('lPass', 'Senha', passInput('lPass', 'current-password')) +
            '<p class="form-error" id="loginErr" role="alert" hidden></p>' +
            '<button class="btn btn--primary btn--block btn--lg" type="submit">Entrar</button>' +
          '</form>' +

          '<form id="formSignup" class="form" role="tabpanel" aria-labelledby="tabSignup" novalidate' + (signup ? '' : ' hidden') + '>' +
            field('sName', 'Nome', '<input class="input" type="text" id="sName" name="name" autocomplete="name" required aria-describedby="sNameErr sNameHint">', 'Pode ser só como você gosta de ser chamado.') +
            field('sEmail', 'E-mail', '<input class="input" type="email" id="sEmail" name="email" autocomplete="email" required aria-describedby="sEmailErr">') +
            field('sPhone', 'Celular <span class="optional">Opcional</span>', '<input class="input" type="tel" id="sPhone" name="phone" autocomplete="tel" inputmode="tel" placeholder="(11) 90000-0000" aria-describedby="sPhoneErr sPhoneHint">', 'Para lembretes da sessão por SMS.') +
            field('sPass', 'Senha', passInput('sPass', 'new-password') + '<div class="strength" aria-hidden="true"><span id="strengthBar"></span></div>', 'Mínimo de 8 caracteres. Misturar letras e números deixa mais segura.') +
            '<label class="check"><input type="checkbox" id="sTerms" required> <span>Li e aceito os <a href="#/termos" target="_blank">termos de uso</a> e a <a href="#/privacidade" target="_blank">política de privacidade</a>.</span></label>' +
            '<p class="field-error" id="sTermsErr" hidden></p>' +
            '<p class="form-error" id="signupErr" role="alert" hidden></p>' +
            '<button class="btn btn--primary btn--block btn--lg" type="submit">Criar conta</button>' +
          '</form>' +
        '</div>' +
      '</div>' +
    '</div>';
  }

  function mount(ctx, root) {
    if (S.currentUser()) return;
    const next = ctx.query.next ? decodeURIComponent(ctx.query.next) : '/';

    const tabs = { login: root.querySelector('#tabLogin'), signup: root.querySelector('#tabSignup') };
    const forms = { login: root.querySelector('#formLogin'), signup: root.querySelector('#formSignup') };
    function show(which) {
      Object.keys(tabs).forEach((k) => { tabs[k].setAttribute('aria-selected', k === which); forms[k].hidden = k !== which; });
      root.querySelector('.page-title').textContent = which === 'signup' ? 'Crie sua conta' : 'Que bom ter você de volta';
      forms[which].querySelector('input').focus();
    }
    tabs.login.addEventListener('click', () => show('login'));
    tabs.signup.addEventListener('click', () => show('signup'));

    root.addEventListener('click', (e) => {
      const t = e.target.closest('[data-toggle]');
      if (!t) return;
      const inp = root.querySelector('#' + t.dataset.toggle);
      const showing = inp.type === 'text';
      inp.type = showing ? 'password' : 'text';
      t.innerHTML = icon(showing ? 'eye' : 'eyeOff');
      t.setAttribute('aria-label', showing ? 'Mostrar senha' : 'Esconder senha');
    });

    function setErr(id, msg) {
      const el = root.querySelector('#' + id + 'Err');
      const inp = root.querySelector('#' + id);
      el.textContent = msg || '';
      el.hidden = !msg;
      if (inp) inp.setAttribute('aria-invalid', !!msg);
      return !msg;
    }
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

    forms.login.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = root.querySelector('#lEmail').value;
      const pass = root.querySelector('#lPass').value;
      const ok = [setErr('lEmail', emailOk(email) ? '' : 'Digite um e-mail válido, como nome@exemplo.com.'),
                  setErr('lPass', pass ? '' : 'Digite sua senha.')].every(Boolean);
      if (!ok) return root.querySelector('[aria-invalid=true]').focus();
      const res = S.login(email, pass);
      const box = root.querySelector('#loginErr');
      if (!res.ok) { box.textContent = res.error; box.hidden = false; return; }
      FM.ui.toast('Você entrou na sua conta');
      FM.go(next);
    });

    const strength = (p) => {
      let s = 0;
      if (p.length >= 8) s++;
      if (p.length >= 12) s++;
      if (/[a-z]/i.test(p) && /\d/.test(p)) s++;
      if (/[^a-z0-9]/i.test(p) || /[A-Z].*[a-z]|[a-z].*[A-Z]/.test(p)) s++;
      return s;
    };
    root.querySelector('#sPass').addEventListener('input', (e) => {
      const s = strength(e.target.value);
      const bar = root.querySelector('#strengthBar');
      bar.style.width = (s / 4) * 100 + '%';
      bar.dataset.level = s;
    });
    root.querySelector('#sPhone').addEventListener('input', (e) => {
      const d = e.target.value.replace(/\D/g, '').slice(0, 11);
      e.target.value = d.length > 6 ? '(' + d.slice(0, 2) + ') ' + d.slice(2, d.length - 4) + '-' + d.slice(-4)
        : d.length > 2 ? '(' + d.slice(0, 2) + ') ' + d.slice(2) : d;
    });

    forms.signup.addEventListener('submit', (e) => {
      e.preventDefault();
      const v = (id) => root.querySelector('#' + id).value;
      const phoneDigits = v('sPhone').replace(/\D/g, '');
      const ok = [
        setErr('sName', v('sName').trim().length >= 2 ? '' : 'Digite seu nome.'),
        setErr('sEmail', emailOk(v('sEmail')) ? '' : 'Digite um e-mail válido, como nome@exemplo.com.'),
        setErr('sPhone', !phoneDigits || phoneDigits.length >= 10 ? '' : 'Digite o celular com DDD, ou deixe em branco.'),
        setErr('sPass', v('sPass').length >= 8 ? '' : 'A senha precisa ter pelo menos 8 caracteres.'),
        setErr('sTerms', root.querySelector('#sTerms').checked ? '' : 'Para criar a conta, aceite os termos.')
      ].every(Boolean);
      if (!ok) return root.querySelector('[aria-invalid=true]')?.focus();
      const res = S.register({ name: v('sName'), email: v('sEmail'), phone: v('sPhone'), password: v('sPass') });
      const box = root.querySelector('#signupErr');
      if (!res.ok) { box.textContent = res.error; box.hidden = false; return; }
      FM.ui.toast('Conta criada. Boas-vindas à FitMind!');
      FM.go(next);
    });
  }

  return { title: 'Entrar — FitMind', render, mount };
})();
