/* TMS Advogados Associados · interações (v4) */
(function () {
  var C = window.SITE || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobileMQ = matchMedia('(max-width: 760px)');
  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var sm = function (x) { x = cl(x); return x * x * (3 - 2 * x); };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
  var $ = function (s) { return document.getElementById(s); };
  var each = function (sel, fn) { Array.prototype.forEach.call(document.querySelectorAll(sel), fn); };
  var esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  var IMG = C.imagens || 'assets/img/';

  /* ---------- dados do escritório ---------- */
  var WA = 'https://wa.me/' + (C.whatsapp || '') + (C.whatsappMensagem ? '?text=' + encodeURIComponent(C.whatsappMensagem) : '');
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

  /* ---------- carregamento de foto com reserva (celular usa -m.jpg se existir) ---------- */
  function photo(name, onok, onfail) {
    var list = (mobileMQ.matches ? [IMG + name + '-m.jpg'] : []).concat([IMG + name + '.jpg']), i = 0, im = new Image();
    im.decoding = 'async';
    im.onload = function () { onok(im); };
    im.onerror = function () { i++; if (i < list.length) im.src = list[i]; else if (onfail) onfail(); };
    im.src = list[0];
    return im;
  }

  /* ---------- rolagem suave ---------- */
  var lenis = null;
  if (!reduce && window.Lenis) lenis = new Lenis({ lerp: 0.075, wheelMultiplier: 0.9, smoothWheel: true, autoRaf: false });
  if (lenis) lenis.stop();
  function scrollToEl(el) { if (!el) return; if (lenis) lenis.scrollTo(el); else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[href^="#"]');
    if (!a || a.getAttribute('href').length < 2) return;
    var t = document.querySelector(a.getAttribute('href')); if (!t) return;
    e.preventDefault(); scrollToEl(t);
  });

  /* ---------- INTRO: "Somos" + nome letra por letra ---------- */
  var intro = $('intro'), nameEl = $('introName'), started = false;
  (function buildIntro() {
    var txt = C.nome || nameEl.textContent, html = '', first = true;
    txt.split(' ').forEach(function (word, wi) {
      html += (wi ? ' ' : '') + word.split('').map(function (ch) { return '<span class="ch' + (wi === 0 ? ' g' : '') + '">' + esc(ch) + '</span>'; }).join('');
    });
    nameEl.innerHTML = html;
  })();
  function endIntro() {
    if (started) return; started = true;
    intro.classList.add('out');
    document.body.classList.remove('is-intro');
    if (lenis) lenis.start();
    setTimeout(function () { intro.remove(); }, 1200);
  }
  if (reduce || sessionStorageGet('tmsIntro')) { intro.remove(); document.body.classList.remove('is-intro'); started = true; if (lenis) lenis.start(); }
  else {
    var chars = nameEl.querySelectorAll('.ch'), somos = intro.querySelector('.intro-somos'), line = intro.querySelector('.intro-line');
    setTimeout(function () { somos.classList.add('on'); }, 250);
    Array.prototype.forEach.call(chars, function (c, i) { setTimeout(function () { c.classList.add('on'); }, 800 + i * 70); });
    var tEnd = 800 + chars.length * 70;
    setTimeout(function () { line.classList.add('on'); }, tEnd);
    setTimeout(endIntro, tEnd + 1100);
    intro.addEventListener('click', endIntro);
    addEventListener('keydown', function k() { endIntro(); removeEventListener('keydown', k); });
    sessionStorageSet('tmsIntro', '1');
  }
  function sessionStorageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function sessionStorageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) {} }

  /* ---------- quadros (cidades e tour): foto que abre como uma janela e avança ---------- */
  function Frames(section, opts) {
    var frames = Array.prototype.slice.call(section.querySelectorAll('.frame'));
    var F = frames.map(function (el) {
      var media = document.createElement('div'); media.className = 'media';
      var city = el.getAttribute('data-city');
      if (city) el.setAttribute('data-tone', city.toLowerCase().replace(/ /g, '-'));
      if (city) { var fb = document.createElement('div'); fb.className = 'fb'; fb.setAttribute('aria-hidden', 'true'); fb.textContent = city; el.insertBefore(fb, el.firstChild); }
      el.insertBefore(media, el.firstChild);
      return { el: el, media: media, img: null, copy: el.querySelector('.copy'), name: el.getAttribute('data-img'), alt: el.getAttribute('data-alt') || '', city: city, loaded: false };
    });
    function load(f) {
      if (f.loaded) return; f.loaded = true;
      photo(f.name, function (im) { im.alt = f.alt; f.media.appendChild(im); f.img = im; f.el.classList.add('has-img'); f.last = -1; });
    }
    load(F[0]); if (F[1]) load(F[1]);
    return { F: F, n: F.length, render: function (p) {
      var n = F.length, f = p * (n - 1) + 0.0001;
      for (var i = 0; i < n; i++) {
        var s = F[i], d = f - i;
        if (Math.abs(d) < 2) load(s);
        var on = d > -1 && d < 1.05;
        if (s.el.classList.contains('on') !== on) s.el.classList.toggle('on', on);
        if (!on) continue;
        // entrada: a próxima foto nasce como janela no centro e se abre (entrando na cidade)
        var open = i === 0 ? 1 : sm((d + 0.55) / 0.5);
        var ins = (1 - open) * 34;
        s.media.style.clipPath = open >= 1 ? 'none' : 'inset(' + ins.toFixed(2) + '% ' + (ins * 0.8).toFixed(2) + '% round ' + ((1 - open) * 18).toFixed(1) + 'px)';
        // câmera avançando: a foto cresce durante toda a vida do quadro
        var life = cl((d + 1) / 2);
        if (s.img && !reduce) s.img.style.transform = 'scale(' + (1.02 + life * 0.28).toFixed(4) + ')';
        if (s.copy) {
          var cp = reduce ? (Math.abs(d) < 0.5 ? 1 : 0) : cl((0.5 - Math.abs(d)) / 0.14);
          s.copy.style.opacity = cp.toFixed(3);
          s.copy.style.transform = 'translate3d(0,' + (d * -70).toFixed(1) + 'px,0)';
          var live = cp > 0.6; if (s.copy.inert !== !live) s.copy.inert = !live;
        }
      }
      if (opts && opts.after) opts.after(f, Math.round(f), F);
    } };
  }

  /* cidades */
  var railLis = $('cidades').querySelectorAll('.rail li'), railNames = Array.prototype.map.call(railLis, function (l) { return l.textContent; }), lastRail = -1;
  var cities = Frames($('cidades'), { after: function (f, k, F) {
    var r = railNames.indexOf(F[Math.min(F.length - 1, k)].city);
    if (r !== lastRail) { lastRail = r; for (var i = 0; i < railLis.length; i++) railLis[i].classList.toggle('on', i === r); }
  } });

  /* tour: como fazemos */
  var steps = Array.prototype.slice.call(document.querySelectorAll('.tour-step')), dots = document.querySelectorAll('.tour-dots li'), lastDot = -1;
  var tour = Frames($('como-fazemos'), { after: function (f, k) {
    for (var i = 0; i < steps.length; i++) {
      var d = f - i, o = reduce ? (k === i ? 1 : 0) : cl((0.5 - Math.abs(d)) / 0.14);
      steps[i].style.opacity = o.toFixed(3);
      steps[i].style.transform = 'translate3d(0,' + (d * -48).toFixed(1) + 'px,0)';
    }
    if (k !== lastDot) { lastDot = k; for (var j = 0; j < dots.length; j++) dots[j].classList.toggle('on', j === k); }
  } });

  /* ---------- ABERTURA: notebook 3D ---------- */
  var rig = $('rig'), lid = $('lid'), openCopy = $('openCopy'), screenImg = $('screenImg'), screenFill = $('screenFill');
  photo('cidades/lisboa-1', function (im) {
    screenImg.style.backgroundImage = 'url(' + im.src + ')'; screenImg.classList.add('has-img');
    screenFill.style.backgroundImage = 'url(' + im.src + ')';
  });
  function renderOpening(p, t) {
    var idle = reduce ? 0 : t * 24;                       // giro contínuo em graus
    var settle = sm(p / 0.3);                             // para de girar e fica de frente
    var target = Math.round(idle / 360) * 360;
    var ry = lerp(idle, target, settle) + (reduce ? 0 : Math.sin(t * 0.8) * 4 * (1 - settle));
    var rx = lerp(58, 14, sm(p / 0.4));                   // de cima (vê a logo) para a frente
    var lidA = lerp(-90, 12, sm((p - 0.28) / 0.34));      // tampa abre
    var zoom = sm((p - 0.66) / 0.3);                      // entra na tela
    var W = innerWidth >= 1800 ? Math.min(680, innerWidth * 0.4) : Math.min(520, innerWidth * 0.74, innerHeight * 1.05), Dp = W * 0.66;
    var sc = lerp(1, Math.max(innerWidth / (W * 0.9), innerHeight / (Dp * 0.9)), zoom * zoom);
    var ty = zoom * (sc * Dp * 0.5 + vh * 0.11);                       // centraliza a tela, que fica acima do teclado
    rx = lerp(rx, 0, zoom);
    var bob = reduce ? 0 : Math.sin(t * 1.4) * 6 * (1 - settle);
    rig.style.transform = 'translate3d(0,' + (bob * vh / 100 + ty).toFixed(1) + 'px,0) scale(' + sc.toFixed(3) + ') rotateX(' + (-rx).toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg)';
    lid.style.transform = 'translate3d(0,-9px,calc(var(--D) / -2)) rotateX(' + lidA.toFixed(2) + 'deg)';
    var co = 1 - sm((p - 0.12) / 0.2);
    openCopy.style.opacity = co.toFixed(3); openCopy.style.transform = 'translate3d(0,' + ((1 - co) * 30).toFixed(1) + 'px,0)';

  }

  /* ---------- profundidade: fotos acompanham levemente o mouse ---------- */
  var px = 0, py = 0, tpx = 0, tpy = 0, root = document.documentElement;
  if (!reduce && matchMedia('(pointer: fine)').matches) addEventListener('pointermove', function (e) { tpx = e.clientX / innerWidth - 0.5; tpy = e.clientY / innerHeight - 0.5; }, { passive: true });

  /* ---------- faixa de cidades ---------- */
  var mq = $('mq'), mqX = 0, mqV = 0;

  /* ---------- laço único de animação ---------- */
  var secs = [$('abertura'), $('cidades'), $('como-fazemos')], geo = [], vh = innerHeight, lastW = innerWidth, fab = $('fab'), prevY = 0, t0 = performance.now();
  function measure() {
    vh = innerHeight;
    var y = window.scrollY || pageYOffset;
    geo = secs.map(function (s) { return { top: s.getBoundingClientRect().top + y, len: Math.max(1, s.offsetHeight - vh) }; });
    mqTop = $('mq').parentNode.getBoundingClientRect().top + y;
    finTop = $('contato').getBoundingClientRect().top + y; finH = $('contato').offsetHeight;
  }
  var finTop = 0, finH = 0, mqTop = 0, lastP = [-1, -1, -1];
  function prog(i, y) { return cl((y - geo[i].top) / geo[i].len); }
  function loop(now) {
    if (lenis) lenis.raf(now);
    var y = lenis ? lenis.scroll : (window.scrollY || pageYOffset), t = (now - t0) / 1000;
    // abertura (renderiza sempre enquanto visível, porque o notebook gira sozinho)
    if (y < geo[0].top + geo[0].len + vh) renderOpening(prog(0, y), t);
    var pc = prog(1, y); if (pc !== lastP[1] && y > geo[1].top - vh && y < geo[1].top + geo[1].len + vh) { lastP[1] = pc; cities.render(pc); $('citiesBar').style.transform = 'scaleX(' + pc.toFixed(4) + ')'; }
    var pt = prog(2, y); if (pt !== lastP[2] && y > geo[2].top - vh && y < geo[2].top + geo[2].len + vh) { lastP[2] = pt; tour.render(pt); }
    // faixa: anda sozinha e acelera com a rolagem
    if (!reduce && y > mqTop - vh * 1.2 && y < mqTop + vh) { mqV = lerp(mqV, (y - prevY) * 0.6, 0.1); mqX -= 0.6 + Math.abs(mqV); var w = mq.scrollWidth / 2; if (-mqX > w) mqX += w; mq.style.transform = 'translate3d(' + mqX.toFixed(1) + 'px,0,0)'; }
    fab.classList.toggle('on', started && y > geo[0].top + geo[0].len * 0.5 && !(y + vh > finTop + finH * 0.35 && y < finTop + finH * 0.8));
    if (Math.abs(tpx - px) > 0.001 || Math.abs(tpy - py) > 0.001) { px = lerp(px, tpx, 0.06); py = lerp(py, tpy, 0.06); root.style.setProperty('--px', px.toFixed(3)); root.style.setProperty('--py', py.toFixed(3)); }
    prevY = y;
    requestAnimationFrame(loop);
  }
  measure(); cities.render(0); tour.render(0); requestAnimationFrame(loop);
  addEventListener('resize', function () { if (('ontouchstart' in window) && innerWidth === lastW) return; lastW = innerWidth; measure(); lastP = [-1, -1, -1]; });
  addEventListener('load', function () { measure(); lastP = [-1, -1, -1]; });

  /* ---------- revelar seções ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    each('.rv', function (el) { io.observe(el); });
  } else each('.rv', function (el) { el.classList.add('in'); });

  /* ---------- vistos por país: a foto da cidade abre em círculo ---------- */
  var D = [
    { nome: 'Portugal', cidade: 'Lisboa', img: 'cidades/lisboa-2', vistos: [['D1', 'Trabalho subordinado', 'Contrato de trabalho com empresa portuguesa.'], ['D2', 'Empreendedor', 'Negócio próprio ou investimento em Portugal.'], ['D3', 'Alta qualificação', 'Formação superior e oferta de trabalho.'], ['D4', 'Estudo', 'Graduação, mestrado e doutorado.'], ['D7', 'Rendimentos próprios', 'Aposentadoria, aluguéis e outros rendimentos.'], ['D8', 'Nômade digital', 'Trabalho remoto para empresa de fora.']], cid: ['Nacionalidade portuguesa por descendência', 'Reagrupamento familiar'], che: ['NIF e NISS', 'Acompanhamento na AIMA'], nota: '' },
    { nome: 'Espanha', cidade: 'Madri', img: 'cidades/madri-2', vistos: [['NL', 'Residência não lucrativa', 'Para quem vive de renda própria, sem trabalhar lá.'], ['ND', 'Nômade digital', 'Trabalho remoto para empresa fora da Espanha.'], ['PAC', 'Profissional qualificado', 'Oferta de emprego para perfil de alta qualificação.'], ['EST', 'Estudos', 'Graduação, pós e cursos longos.'], ['RF', 'Reagrupamento familiar', 'Cônjuge, filhos e pais de residentes.']], cid: ['Nacionalidade por residência, com 2 anos de residência legal para brasileiros', 'Nacionalidade por descendência'], che: ['NIE e TIE', 'Empadronamiento'], nota: '' },
    { nome: 'Irlanda', cidade: 'Dublin', img: 'cidades/dublin-2', vistos: [['Stamp 2', 'Estudo', 'Inglês ou ensino superior, com trabalho parcial.'], ['CSEP', 'Critical Skills', 'Profissões em falta, com caminho para residência.'], ['GEP', 'General Employment', 'Oferta de emprego em ocupação elegível.'], ['JF', 'Reagrupamento familiar', 'Família de residentes e titulares de permissão.']], cid: ['Cidadania irlandesa por descendência (Foreign Births Register)'], che: ['Registro de imigração (IRP)', 'PPS Number'], nota: '' },
    { nome: 'Estados Unidos', cidade: 'Nova York', img: 'cidades/nova-york-2', vistos: [['F-1', 'Estudante', 'Graduação, pós e cursos em instituição aprovada.'], ['L-1', 'Transferência intracompanhia', 'Executivos e especialistas de empresa com filial nos EUA.'], ['O-1', 'Habilidade extraordinária', 'Reconhecimento comprovado na área.'], ['E-2', 'Investidor por tratado', 'Exige nacionalidade de país com tratado, como Portugal ou Itália.'], ['EB-2 NIW', 'Green card por interesse nacional', 'Profissional qualificado, sem precisar de empregador.'], ['EB-5', 'Green card por investimento', 'Investimento em negócio que gere empregos.']], cid: ['Planejamento de cidadania europeia para quem mira o E-2'], che: ['Orientação nas primeiras providências'], nota: EUA_NOTA }
  ];
  var tabs = $('tabs'), destMedia = $('destMedia'), sel = -1;
  D.forEach(function (d, k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'tab'; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'destPanel'); b.textContent = d.nome;
    b.addEventListener('click', function (e) { pick(k, e); }); tabs.appendChild(b);
  });
  function pick(k, ev) {
    if (k === sel) return; sel = k; var d = D[k];
    Array.prototype.forEach.call(tabs.children, function (b, i) { b.setAttribute('aria-selected', i === k ? 'true' : 'false'); b.tabIndex = i === k ? 0 : -1; });
    destMedia.setAttribute('data-tone', d.cidade.toLowerCase().replace(/ /g, '-')); $('dmName').textContent = d.nome; $('dmCity').textContent = d.cidade.toUpperCase();
    // o círculo nasce do lado do botão clicado
    var r = destMedia.getBoundingClientRect(), cx = 50, cy = 50;
    if (ev && ev.clientX && r.width) { cx = cl((ev.clientX - r.left) / r.width) * 100; cy = ev.clientY < r.top ? 0 : 50; }
    destMedia.style.setProperty('--cx', cx.toFixed(0) + '%'); destMedia.style.setProperty('--cy', cy.toFixed(0) + '%');
    var mine = k;
    photo(d.img, function (im) {
      if (mine !== sel) return;
      im.alt = d.cidade + ', ' + d.nome;
      var olds = destMedia.querySelectorAll('img');
      destMedia.insertBefore(im, destMedia.querySelector('figcaption'));
      requestAnimationFrame(function () { requestAnimationFrame(function () { im.classList.add('open'); }); });
      setTimeout(function () { Array.prototype.forEach.call(olds, function (o) { o.remove(); }); }, 1200);
    }, function () { if (mine === sel) each('#destMedia img', function (o) { o.remove(); }); });
    $('destPanel').setAttribute('aria-label', 'Vistos para ' + d.nome);
    $('vg').innerHTML = d.vistos.map(function (v) { return '<div><b>' + v[0] + '</b><strong>' + v[1] + '</strong><span>' + v[2] + '</span></div>'; }).join('');
    $('side').innerHTML = '<div><h3>Cidadania</h3><ul>' + d.cid.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul></div><div><h3>Na chegada</h3><ul>' + d.che.map(function (c) { return '<li>' + c + '</li>'; }).join('') + '</ul></div>' + (d.nota ? '<p class="note">' + esc(d.nota) + '</p>' : '');
  }
  pick(0);
  tabs.addEventListener('keydown', function (e) {
    var to = { ArrowRight: sel + 1, ArrowLeft: sel - 1, Home: 0, End: D.length - 1 }[e.key];
    if (to == null) return; e.preventDefault(); to = (to + D.length) % D.length; pick(to); tabs.children[to].focus();
  });

  /* ---------- menu ---------- */
  var menu = $('menu'), mb = $('menuBtn'), menuOpen = false;
  function setMenu(o) {
    menuOpen = o; mb.setAttribute('aria-expanded', o ? 'true' : 'false'); mb.setAttribute('aria-label', o ? 'Fechar menu' : 'Abrir menu');
    if (o) { menu.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add('open'); }); }); if (lenis) lenis.stop(); setTimeout(function () { var a = menu.querySelector('a'); if (a) a.focus(); }, 300); }
    else { menu.classList.remove('open'); if (lenis && started) lenis.start(); setTimeout(function () { if (!menuOpen) menu.hidden = true; }, 800); }
  }
  mb.addEventListener('click', function () { setMenu(!menuOpen); });
  each('#menu [data-close]', function (e) { e.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') { setMenu(false); mb.focus(); return; }
    if (e.key !== 'Tab') return;
    var f = [mb].concat(Array.prototype.slice.call(menu.querySelectorAll('a'))), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
