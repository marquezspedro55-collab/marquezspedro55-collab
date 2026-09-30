/* TMS Advogados Associados · interações (v3) */
(function () {
  var C = window.SITE || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileMQ = matchMedia('(max-width: 760px)');
  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var $ = function (s) { return document.getElementById(s); };
  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };

  /* ---------- dados do escritório (config.js) ---------- */
  var WA = 'https://wa.me/' + (C.whatsapp || '');
  each('[data-cfg]', function (el) { var v = C[el.getAttribute('data-cfg')]; if (v) el.textContent = v; else if (v === '') el.setAttribute('data-cfg-empty', ''); });
  each('[data-cfg-row]', function (el) { if (!C[el.getAttribute('data-cfg-row')]) el.setAttribute('data-cfg-empty', ''); });
  each('[data-wa]', function (a) { if (C.whatsapp) a.href = WA; });
  each('[data-mail]', function (a) { if (C.email) a.href = 'mailto:' + C.email; });
  if (C.endereco) $('mapsLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.endereco + ', ' + (C.cidadeUF || ''));
  var EUA_NOTA = C.parceiroEUA ? 'Em atuação conjunta com ' + C.parceiroEUA + ', escritório licenciado nos EUA.' : 'Quando exigido, a representação perante as autoridades dos EUA é feita por advogado licenciado lá.';
  if (C.parceiroEUA) each('[data-eua]', function (el) { el.textContent = EUA_NOTA; });
  $('year').textContent = new Date().getFullYear();
  var regs = [C.registroSociedadeOAB && 'Registro ' + C.registroSociedadeOAB, C.cnpj && 'CNPJ ' + C.cnpj].filter(Boolean);
  if (regs.length) $('regs').textContent = ' · ' + regs.join(' · ');

  var SOC = C.socios || [];
  function sub(s) { return [s.cargo, s.oab].filter(Boolean).join(' · '); }
  $('people').innerHTML = SOC.map(function (s, i) {
    return '<div class="person rv"><div class="ph"><span class="mono-i" aria-hidden="true">' + esc(s.iniciais || '') + '</span>' +
      (s.foto ? '<img src="' + esc(s.foto) + '" alt="' + esc((s.titulo ? s.titulo + ' ' : '') + s.nome) + '" loading="lazy" onerror="this.remove()">' : '') +
      '</div><b>' + esc((s.titulo ? s.titulo + ' ' : '') + s.nome) + '</b><span>' + esc(sub(s)) + '</span></div>';
  }).join('');

  /* ---------- rolagem suave (Lenis) ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) {
    lenis = new Lenis({ duration: 1.15, easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); }, autoRaf: false });
  }
  function scrollToEl(el) {
    if (!el) return;
    if (lenis) lenis.scrollTo(el, { offset: 0 }); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' });
  }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var t = document.querySelector(a.getAttribute('href'));
    if (!t) return;
    e.preventDefault(); scrollToEl(t);
    if (history.replaceState) history.replaceState(null, '', a.getAttribute('href'));
  });

  /* ---------- JORNADA: fotos (ou vídeos) controlados pela rolagem ---------- */
  var jr = $('jornada'), scenes = Array.prototype.slice.call(jr.querySelectorAll('.scene')), N = scenes.length;
  var rail = jr.querySelectorAll('.rail li'), railCodes = Array.prototype.map.call(rail, function (li) { return li.textContent; });
  jr.style.setProperty('--n', N);
  var DIR = C.imagens || 'assets/img/cenas/';
  var S = scenes.map(function (el, i) {
    var name = el.getAttribute('data-img');
    var media = document.createElement('div'); media.className = 'media';
    var fb = document.createElement('div'); fb.className = 'fb'; fb.setAttribute('aria-hidden', 'true');
    fb.innerHTML = '<b>' + esc(el.getAttribute('data-city') || el.getAttribute('data-fb') || '') + '</b>' + (el.getAttribute('data-coord') ? '<span>' + esc(el.getAttribute('data-coord')) + '</span>' : '');
    el.insertBefore(fb, el.firstChild); el.insertBefore(media, el.firstChild);
    var code = el.getAttribute('data-code'), railIdx = -1;
    for (var k = i; k >= 0 && railIdx < 0; k--) railIdx = railCodes.indexOf(scenes[k].getAttribute('data-code'));
    return { el: el, media: media, copy: el.querySelector('.copy'), name: name, alt: el.getAttribute('data-alt') || '', loaded: false, video: null, seeking: false, rail: railIdx, code: code };
  });
  function loadScene(s) {
    if (s.loaded) return; s.loaded = true;
    var img = new Image(), m = mobileMQ.matches, tried = 0;
    var srcs = m ? [DIR + s.name + '-m.jpg', DIR + s.name + '.jpg'] : [DIR + s.name + '.jpg'];
    if (s.el.getAttribute('data-fallback')) srcs.push(s.el.getAttribute('data-fallback'));
    img.alt = s.alt; img.decoding = 'async';
    img.onerror = function () { tried++; if (tried < srcs.length) img.src = srcs[tried]; else s.el.classList.add('no-img'); };
    img.onload = function () { s.el.classList.remove('no-img'); };
    s.el.classList.add('no-img');
    img.src = srcs[0];
    s.media.appendChild(img);
    if (C.videos && !reduce) loadVideo(s, m);
  }
  function loadVideo(s, m) {
    var url = 'assets/video/' + s.name + (m ? '-m' : '') + '.mp4';
    fetch(url).then(function (r) { if (!r.ok) throw 0; return r.blob(); }).then(function (b) {
      var v = document.createElement('video');
      v.muted = true; v.playsInline = true; v.preload = 'auto'; v.setAttribute('playsinline', ''); v.setAttribute('aria-hidden', 'true');
      v.src = URL.createObjectURL(b);
      v.addEventListener('loadeddata', function () { v.classList.add('ready'); s.video = v; });
      v.addEventListener('seeked', function () { s.seeking = false; });
      s.media.appendChild(v);
    }).catch(function () { if (m) loadVideo(s, false); });
  }
  loadScene(S[0]); loadScene(S[1]);

  var jrTop = 0, jrLen = 1, vh = innerHeight, lastW = innerWidth;
  function measure() {
    vh = innerHeight;
    jrTop = jr.getBoundingClientRect().top + (window.scrollY || pageYOffset);
    jrLen = Math.max(1, jr.offsetHeight - vh);
    stepsTop = stepsEl.getBoundingClientRect().top + (window.scrollY || pageYOffset);
    stepsH = stepsEl.offsetHeight;
  }
  var bar = $('jrBar'), header = $('top'), fab = $('fab'), lastY = -1, lastRail = -2, lastF = -1;
  function renderJourney(y) {
    var p = cl((y - jrTop) / jrLen), f = p * (N - 1);
    if (Math.abs(f - lastF) < 0.0004) return; lastF = f;
    bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    var cur = Math.round(f);
    for (var i = 0; i < N; i++) {
      var s = S[i], d = f - i;
      if (Math.abs(d) < 1.6) loadScene(s);
      var visible = d > -0.75 && d < 0.75;
      s.el.classList.toggle('is-on', visible || i === 0 && f < 0.75);
      if (!visible && i !== 0) continue;
      var op = d < 0 ? cl(1 - (-d - 0.25) / 0.45) : 1;
      s.el.style.opacity = op.toFixed(3);
      var life = cl((d + 0.75) / 1.5);
      if (s.video) {
        s.media.style.transform = 'none';
        if (!s.seeking && s.video.duration) { var tt = life * (s.video.duration - 0.05); if (Math.abs(s.video.currentTime - tt) > 0.02) { s.seeking = true; s.video.currentTime = tt; } }
      } else if (!reduce) {
        s.media.style.transform = 'scale(' + (1.02 + life * 0.12).toFixed(4) + ') translate3d(0,' + ((0.5 - life) * 2).toFixed(2) + '%,0)';
      }
      if (s.copy) {
        var cp = reduce ? (Math.abs(d) < 0.5 ? 1 : 0) : cl(1 - (Math.abs(d) - 0.16) / 0.3);
        s.copy.style.opacity = cp.toFixed(3);
        s.copy.style.transform = 'translate3d(0,' + (d * -60).toFixed(1) + 'px,0)';
        var live = cp > 0.6;
        if (s.copy.inert !== !live) s.copy.inert = !live;
      }
    }
    var r = S[cur].rail;
    if (r !== lastRail) { lastRail = r; for (var k = 0; k < rail.length; k++) rail[k].classList.toggle('on', k === r); }
  }

  /* ---------- como funciona: linha de progresso ---------- */
  var stepsEl = $('steps'), stepsFill = $('stepsFill'), stepsTop = 0, stepsH = 1;
  function renderSteps(y) {
    var k = cl((y + vh * 0.6 - stepsTop) / stepsH);
    stepsFill.style.transform = 'scaleY(' + k.toFixed(4) + ')';
  }

  function tick(y) {
    if (y === lastY) return;
    var down = y > lastY; lastY = y;
    var afterJr = y > jrTop + jrLen + vh * 0.2;
    if (y < jrTop + jrLen + vh) renderJourney(y);
    renderSteps(y);
    header.classList.toggle('solid', y > jrTop + jrLen - 10 || y > 40 && afterJr);
    header.classList.toggle('hide', afterJr && down && y > 200 && !menuOpen);
    fab.classList.toggle('on', afterJr);
  }
  function loop(t) {
    if (lenis) lenis.raf(t);
    tick(lenis ? lenis.scroll : (window.scrollY || pageYOffset));
    requestAnimationFrame(loop);
  }
  measure(); tick(window.scrollY || 0); requestAnimationFrame(loop);
  addEventListener('resize', function () {
    if (('ontouchstart' in window) && innerWidth === lastW) return; // ignora a barra de endereço do celular
    lastW = innerWidth; measure(); lastF = -1; lastY = -1;
  });
  addEventListener('load', function () { measure(); lastY = -1; });
  $('skipFilm').addEventListener('click', function () { scrollToEl($('destinos')); $('destinos').focus({ preventScroll: true }); });

  /* ---------- revelar seções ao entrar na tela ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -12% 0px' });
    each('.rv', function (el) { io.observe(el); });
  } else each('.rv', function (el) { el.classList.add('in'); });

  /* ---------- destinos ---------- */
  var D = [
    { nome: 'Portugal', cidade: 'Lisboa', img: '04-lisboa', vistos: [['D1', 'Trabalho subordinado', 'Contrato de trabalho com empresa portuguesa.'], ['D2', 'Empreendedor', 'Negócio próprio ou investimento em Portugal.'], ['D3', 'Alta qualificação', 'Formação superior e oferta de trabalho.'], ['D4', 'Estudo', 'Graduação, mestrado e doutorado.'], ['D7', 'Rendimentos próprios', 'Aposentadoria, aluguéis e outros rendimentos.'], ['D8', 'Nômade digital', 'Trabalho remoto para empresa de fora.']], cid: ['Nacionalidade portuguesa por descendência', 'Reagrupamento familiar'], che: ['NIF e NISS', 'Acompanhamento na AIMA'], nota: '' },
    { nome: 'Espanha', cidade: 'Madri', img: '05-madri', vistos: [['NL', 'Residência não lucrativa', 'Para quem vive de renda própria, sem trabalhar lá.'], ['ND', 'Nômade digital', 'Trabalho remoto para empresa fora da Espanha.'], ['PAC', 'Profissional qualificado', 'Oferta de emprego para perfil de alta qualificação.'], ['EST', 'Estudos', 'Graduação, pós e cursos longos.'], ['RF', 'Reagrupamento familiar', 'Cônjuge, filhos e pais de residentes.']], cid: ['Nacionalidade por residência, com 2 anos de residência legal para brasileiros', 'Nacionalidade por descendência'], che: ['NIE e TIE', 'Empadronamiento'], nota: '' },
    { nome: 'Irlanda', cidade: 'Dublin', img: '06-dublin', vistos: [['Stamp 2', 'Estudo', 'Inglês ou ensino superior, com trabalho parcial.'], ['CSEP', 'Critical Skills', 'Profissões em falta, com caminho para residência.'], ['GEP', 'General Employment', 'Oferta de emprego em ocupação elegível.'], ['JF', 'Reagrupamento familiar', 'Família de residentes e titulares de permissão.']], cid: ['Cidadania irlandesa por descendência (Foreign Births Register)'], che: ['Registro de imigração (IRP)', 'PPS Number'], nota: '' },
    { nome: 'Estados Unidos', cidade: 'Nova York', img: '07-nova-york', vistos: [['F-1', 'Estudante', 'Graduação, pós e cursos em instituição aprovada.'], ['L-1', 'Transferência intracompanhia', 'Executivos e especialistas de empresa com filial nos EUA.'], ['O-1', 'Habilidade extraordinária', 'Reconhecimento comprovado na área.'], ['E-2', 'Investidor por tratado', 'Exige nacionalidade de país com tratado, como Portugal ou Itália.'], ['EB-2 NIW', 'Green card por interesse nacional', 'Profissional qualificado, sem precisar de empregador.'], ['EB-5', 'Green card por investimento', 'Investimento em negócio que gere empregos.']], cid: ['Planejamento de cidadania europeia para quem mira o E-2'], che: ['Orientação nas primeiras providências'], nota: EUA_NOTA }
  ];
  var tabs = $('tabs'), destMedia = $('destMedia'), sel = -1;
  D.forEach(function (d, k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'destPanel'); b.textContent = d.nome;
    b.addEventListener('click', function () { pick(k); }); tabs.appendChild(b);
  });
  destMedia.innerHTML = '<figcaption><b id="dmName"></b><span id="dmCity"></span></figcaption>';
  function pick(k) {
    if (k === sel) return; sel = k; var d = D[k];
    Array.prototype.forEach.call(tabs.children, function (b, i) { b.setAttribute('aria-selected', i === k ? 'true' : 'false'); b.tabIndex = i === k ? 0 : -1; });
    $('dmName').textContent = d.nome; $('dmCity').textContent = d.cidade.toUpperCase();
    var old = destMedia.querySelector('img'), img = new Image();
    img.alt = d.cidade + ', ' + d.nome; img.className = 'out'; img.decoding = 'async';
    img.onload = function () { destMedia.insertBefore(img, destMedia.firstChild); requestAnimationFrame(function () { img.classList.remove('out'); }); if (old) { old.classList.add('out'); setTimeout(function () { old.remove(); }, 800); } };
    img.onerror = function () { if (old) { old.classList.add('out'); setTimeout(function () { old.remove(); }, 800); } };
    img.src = DIR + d.img + '.jpg';
    $('destPanel').setAttribute('aria-label', 'Vistos para ' + d.nome);
    $('vg').innerHTML = d.vistos.map(function (v) { return '<div><b>' + v[0] + '</b><strong>' + v[1] + '</strong><span>' + v[2] + '</span></div>'; }).join('');
    $('side').innerHTML = '<div><h3>Cidadania</h3><ul>' + d.cid.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul></div><div><h3>Na chegada</h3><ul>' + d.che.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul></div>' +
      '<div class="foot"><a class="btn" href="#formulario" data-dest="' + d.nome + '">Analisar meu caso</a>' + (d.nota ? '<span class="note">' + esc(d.nota) + '</span>' : '') + '</div>';
  }
  pick(0);
  tabs.addEventListener('keydown', function (e) {
    var to = { ArrowRight: sel + 1, ArrowLeft: sel - 1, Home: 0, End: D.length - 1 }[e.key];
    if (to == null) return; e.preventDefault(); to = (to + D.length) % D.length; pick(to); tabs.children[to].focus();
  });
  each('[data-country]', function (a) { a.addEventListener('click', function () { pick(+a.getAttribute('data-country')); }); });
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-dest]'); if (a) $('fDestino').value = a.getAttribute('data-dest'); });

  /* ---------- menu (celular) ---------- */
  var menu = $('menu'), mb = $('menuBtn'), menuOpen = false;
  function setMenu(o) {
    menuOpen = o; mb.setAttribute('aria-expanded', o ? 'true' : 'false');
    if (o) { menu.hidden = false; requestAnimationFrame(function () { menu.classList.add('open'); }); if (lenis) lenis.stop(); setTimeout(function () { menu.querySelector('.mclose').focus(); }, 50); }
    else { menu.classList.remove('open'); if (lenis) lenis.start(); setTimeout(function () { if (!menuOpen) menu.hidden = true; }, 350); if (menu.contains(document.activeElement)) mb.focus(); }
  }
  mb.addEventListener('click', function () { setMenu(!menuOpen); });
  each('#menu [data-close]', function (e) { e.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') { setMenu(false); return; }
    if (e.key !== 'Tab') return;
    var f = menu.querySelectorAll('a,button'), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- formulário de análise ---------- */
  var form = $('leadForm'), msg = $('fMsg');
  function say(t, c) { msg.textContent = t; msg.className = 'fmsg ' + (c || ''); }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var fd = new FormData(form);
    if (fd.get('_gotcha')) return;
    var bad = Array.prototype.filter.call(form.elements, function (el) { return el.willValidate && !el.checkValidity(); });
    if (bad.length) { bad[0].focus(); say(bad[0].name === 'lgpd' ? 'Marque a autorização de uso dos dados para enviar.' : 'Preencha os campos obrigatórios.', 'err'); return; }
    var tel = String(fd.get('telefone')).replace(/\D/g, '');
    if (tel.length < 10) { form.telefone.focus(); say('Confira o número de WhatsApp, com DDD.', 'err'); return; }
    var txt = 'Olá! Quero uma análise do meu caso.\n\n' +
      '*Nome:* ' + fd.get('nome') + '\n*WhatsApp:* ' + fd.get('telefone') + (fd.get('email') ? '\n*E-mail:* ' + fd.get('email') : '') +
      '\n*Destino:* ' + fd.get('destino') + '\n*Objetivo:* ' + fd.get('objetivo') + (fd.get('mensagem') ? '\n\n' + fd.get('mensagem') : '');
    if (C.formEndpoint) fetch(C.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }).catch(function () {});
    var url = WA + '?text=' + encodeURIComponent(txt);
    var win = window.open(url, '_blank');
    if (win) win.opener = null; else location.href = url;
    say('Pronto! Abrimos o WhatsApp com a sua mensagem. É só tocar em enviar.', 'ok');
  });
})();
