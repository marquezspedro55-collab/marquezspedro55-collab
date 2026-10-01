/* TMS Advogados · experiência em cenas (cada rolagem, uma cena) */
(function () {
  var C = window.SITE || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var mobile = function () { return innerWidth <= 760; };
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
  if (C.endereco && $('mapsLink')) $('mapsLink').href = 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent(C.endereco + ', ' + (C.cidadeUF || ''));
  var EUA_NOTA = C.parceiroEUA ? 'Em atuação conjunta com ' + C.parceiroEUA + ', escritório licenciado nos EUA.' : 'Quando exigido, a representação perante as autoridades americanas é feita por advogado licenciado nos EUA.';
  $('year').textContent = new Date().getFullYear();
  var regs = [C.registroSociedadeOAB && 'Registro ' + C.registroSociedadeOAB, C.cnpj && 'CNPJ ' + C.cnpj].filter(Boolean);
  if (regs.length) $('regs').textContent = ' · ' + regs.join(' · ');

  /* ---------- roteiro: cada item é uma rolagem ---------- */
  var G = { mundo: { lat: 24, lon: -32, dist: 330 }, pt: { lat: 39.5, lon: -8.5, dist: 240 }, es: { lat: 40.4, lon: -3.7, dist: 240 }, ie: { lat: 53.3, lon: -6.3, dist: 240 }, us: { lat: 40.7, lon: -74, dist: 250 } };
  var CITYPOS = { pt: [38.72, -9.14], es: [40.42, -3.7], ie: [53.35, -6.26], us: [40.71, -74.0] };
  var LAB = { pt: 1, es: 2, ie: 3, us: 4 };
  function ph(img, title, text, extra) { return { type: 'photo', img: img, html: '<h2>' + title + '</h2><p>' + text + '</p>' + (extra || '') }; }
  function country(g, kick, name, text, chips) { return { type: 'country', g: g, html: '<p class="kick">' + kick + '</p><h2>' + name + '</h2><p>' + text + '</p><div class="chips">' + chips.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '</div>', cls: 'country' }; }
  function tour(n, img, title, text) { return { type: 'photo', img: img, cls: 'tour', html: '<span class="num">' + n + '</span><h2>' + title + '</h2><p>' + text + '</p>' }; }
  var STEPS = [
    { type: 'intro', chap: 'Início' },
    { type: 'laptop', cls: 'center', html: '<h1>Mudar de país é um processo jurídico. <em>Trate como um.</em></h1><p>Vistos e cidadania para Portugal, Espanha, Irlanda e Estados Unidos.</p>' },
    { type: 'globe', g: 'mundo', chap: 'Destinos', html: '<h2>Quatro destinos. <em>Um só escritório.</em></h2><p>Do Brasil para Portugal, Espanha, Irlanda e Estados Unidos, com o mesmo advogado do início ao fim.</p>' },
    country('pt', 'Destino 1 de 4', 'Portugal', 'Residência, trabalho remoto e cidadania por descendência.', ['D7 · renda própria', 'D8 · nômade digital', 'D2 · empreendedor', 'Cidadania']),
    ph('cidades/lisboa-1', 'Lisboa, <em>vista de cima.</em>', 'Para quem vive de renda, o visto D7. Para quem trabalha de longe, o D8.'),
    ph('cidades/lisboa-2', 'Agora, a rua <em>onde você vai morar.</em>', 'Residência na AIMA, NIF e NISS resolvidos antes de você precisar deles.'),
    ph('cidades/lisboa-3', 'E a cidadania, <em>se a família permitir.</em>', 'Nacionalidade portuguesa por descendência, com as certidões certas desde o início.'),
    country('es', 'Destino 2 de 4', 'Espanha', 'Residência sem trabalhar, trabalho remoto e nacionalidade.', ['Não lucrativa', 'Nômade digital', 'Estudos', 'Reagrupamento']),
    ph('cidades/madri-1', 'Madri, <em>ao entardecer.</em>', 'Residência não lucrativa para quem vive de renda e quer morar na Espanha sem trabalhar lá.'),
    ph('cidades/madri-2', 'Trabalhe daqui <em>para o mundo.</em>', 'Visto de nômade digital e de profissional qualificado, com apostila e tradução no padrão do consulado.'),
    ph('cidades/madri-3', 'Plaza Mayor, <em>endereço de quem fica.</em>', 'NIE, TIE e empadronamiento. Com 2 anos de residência legal, o caminho para a nacionalidade espanhola.'),
    country('ie', 'Destino 3 de 4', 'Irlanda', 'Estudo com trabalho, permissões de emprego e cidadania.', ['Stamp 2', 'Critical Skills', 'General Employment', 'Cidadania']),
    ph('cidades/dublin-1', 'Dublin, <em>à beira do Liffey.</em>', 'Stamp 2 para estudar inglês ou ensino superior, com permissão de trabalho parcial.'),
    ph('cidades/dublin-2', 'Uma cidade <em>que contrata.</em>', 'Critical Skills e General Employment Permit para profissões em falta, com caminho para a residência.'),
    ph('cidades/dublin-3', 'Raízes irlandesas <em>contam.</em>', 'Cidadania por descendência pelo Foreign Births Register, com a árvore documental montada por nós.'),
    country('us', 'Destino 4 de 4', 'Estados Unidos', 'Estudo, trabalho, investimento e green card.', ['F-1', 'L-1', 'O-1', 'E-2', 'EB-2 NIW', 'EB-5']),
    ph('cidades/nova-york-1', 'Nova York, <em>ao pôr do sol.</em>', 'Estudo (F-1), transferência de empresa (L-1) ou talento extraordinário (O-1).'),
    ph('cidades/nova-york-2', 'Estratégia <em>antes do formulário.</em>', 'Investidor por tratado (E-2) e green card por EB-2 NIW ou por investimento (EB-5).'),
    ph('cidades/nova-york-3', 'Com quem é <em>licenciado lá.</em>', EUA_NOTA),
    tour(1, 'tour/1-conversa', 'Conversa', 'Você conta seu objetivo e sua situação. Dizemos com clareza o que é viável e o que não é.'),
    tour(2, 'tour/2-estrategia', 'Estratégia', 'Escolhemos o visto ou a via de cidadania certa, com prazos e custos por escrito.'),
    tour(3, 'tour/3-documentos', 'Documentos e protocolo', 'Montamos e conferimos certidões, apostilas e traduções, e acompanhamos o protocolo.'),
    tour(4, 'tour/4-aeroporto', 'Embarque', 'Com o visto aprovado, você embarca com tudo em ordem e orientado para a chegada.'),
    tour(5, 'tour/5-chegada', 'Chegada', 'Seguimos com você nas primeiras providências no destino, como NIF, NIE ou PPS.'),
    { type: 'cta', chap: 'Contato' }
  ];
  // capítulos e país de cada cena
  var curG = null;
  STEPS.forEach(function (s, i) {
    if (s.g) curG = s.g;
    if (s.type === 'photo' && i < 19) s.g = curG;
    if (s.type === 'country') s.chap = { pt: 'Portugal', es: 'Espanha', ie: 'Irlanda', us: 'EUA' }[s.g];
  });
  STEPS[19].chap = 'Como fazemos';
  var LAST = STEPS.length - 1;

  /* textos */
  var copies = $('copies');
  STEPS.forEach(function (s, i) {
    if (!s.html) return;
    var d = document.createElement('div'); d.className = 'copy ' + (s.cls || ''); d.innerHTML = s.html; d.setAttribute('aria-hidden', 'true');
    copies.appendChild(d); s.copy = d;
  });
  /* capítulos */
  var chapters = $('chapters'), CH = [];
  STEPS.forEach(function (s, i) { if (s.chap) { var b = document.createElement('button'); b.type = 'button'; b.textContent = s.chap; b.addEventListener('click', function () { jump(i); }); chapters.appendChild(b); CH.push({ i: i, b: b, name: s.chap }); } });

  /* ---------- fotos ---------- */
  var imgCache = {};
  function src(name) { return IMG + name + (mobile() ? '-m' : '') + '.jpg'; }
  function preload(i) { var s = STEPS[i]; if (s && s.img && !imgCache[s.img]) { var im = new Image(); im.decoding = 'async'; im.src = src(s.img); imgCache[s.img] = im; } }
  var slots = [$('slotA'), $('slotB')], front = 0;
  function putImg(slot, step) { slot.innerHTML = '<img alt="" src="' + src(step.img) + '" decoding="async">'; }

  /* ---------- camadas ---------- */
  var L = { intro: $('L-intro'), laptop: $('L-laptop'), globe: $('L-globe'), photo: $('L-photo'), cta: $('L-cta') };
  var LAYER = { intro: 'intro', laptop: 'laptop', globe: 'globe', country: 'globe', photo: 'photo', cta: 'cta' };
  function show(name, on) { L[name].classList.toggle('vis', on); if (on) { L[name].style.opacity = ''; } }
  function only(name) { for (var k in L) show(k, k === name); }
  function A(el, kf, o) { if (reduce) o = Object.assign({}, o, { duration: 1, delay: 0 }); var a = el.animate(kf, Object.assign({ fill: 'both', easing: 'cubic-bezier(.7,0,.2,1)' }, o)); return a; }
  function clearA(el) { el.getAnimations().forEach(function (a) { a.cancel(); }); }

  /* ---------- globo 3D (three.js, carregado depois da intro) ---------- */
  var globe = null, gState = 0, gCur = { lat: 10, lon: -40, dist: 420 }, gTgt = { lat: 24, lon: -32, dist: 330 }, gActive = -1, arcK = 0, globeOn = false;
  function loadThree() {
    if (gState) return; gState = 1;
    var urls = ['assets/vendor/three.min.js', 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js'];
    (function tryLoad(k) {
      if (k >= urls.length) { gState = 3; cssGlobe(); return; }
      var s = document.createElement('script'); s.src = urls[k];
      s.onload = function () { try { globe = buildGlobe(); gState = 2; L.globe.classList.remove('fallback'); } catch (e) { console.error(e); gState = 3; cssGlobe(); } };
      s.onerror = function () { tryLoad(k + 1); };
      document.head.appendChild(s);
    })(0);
  }
  /* globo de reserva (sem WebGL): esfera com a textura da Terra girando */
  function cssGlobe() { L.globe.classList.add('fallback'); }
  setTimeout(function () { if (gState !== 2) cssGlobe(); }, 6000);
  function buildGlobe() {
    var T = THREE, cv = $('gl');
    var renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile() ? 1.5 : 2));
    renderer.outputEncoding = T.sRGBEncoding;
    var scene = new T.Scene(), camera = new T.PerspectiveCamera(35, 1, 1, 3000);
    var tiltG = new T.Group(), spinG = new T.Group(); tiltG.add(spinG); scene.add(tiltG);
    var TL = new T.TextureLoader();
    var dayT = TL.load('assets/img/terra-dia.jpg'), nightT = TL.load('assets/img/terra-noite.jpg'), cloudT = TL.load('assets/img/terra-nuvens.jpg');
    dayT.encoding = T.sRGBEncoding; nightT.encoding = T.sRGBEncoding;
    dayT.anisotropy = nightT.anisotropy = renderer.capabilities.getMaxAnisotropy();
    spinG.add(new T.Mesh(new T.SphereGeometry(100, 128, 96), new T.MeshPhongMaterial({ map: dayT, color: 0x8a8f99, emissiveMap: nightT, emissive: 0xffd9a0, emissiveIntensity: 1.35, specular: 0x333028, shininess: 14 })));
    var clouds = new T.Mesh(new T.SphereGeometry(101.2, 96, 64), new T.MeshPhongMaterial({ alphaMap: cloudT, color: 0xf3ead6, transparent: true, opacity: 0.4, depthWrite: false }));
    spinG.add(clouds);
    scene.add(new T.Mesh(new T.SphereGeometry(110, 64, 48), new T.ShaderMaterial({
      uniforms: { c: { value: new T.Color(0xd9b270) } },
      vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 c; varying vec3 vN; void main(){ float i = pow(max(0.0, 0.66 - dot(vN, vec3(0.0,0.0,1.0))), 3.0); gl_FragColor = vec4(c * i * 1.1, 1.0); }',
      side: T.BackSide, blending: T.AdditiveBlending, transparent: true, depthWrite: false
    })));
    var D2R = Math.PI / 180;
    function ll(lat, lon, R) { var phi = (90 - lat) * D2R, th = (lon + 180) * D2R; return new T.Vector3(-R * Math.sin(phi) * Math.cos(th), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(th)); }
    var SP = [-23.55, -46.63], DEST = [CITYPOS.pt, CITYPOS.es, CITYPOS.ie, CITYPOS.us];
    var spV = ll(SP[0], SP[1], 101), arcs = [], marks = [], arcMat = new T.MeshBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 0.95, depthWrite: false });
    DEST.forEach(function (d) {
      var b = ll(d[0], d[1], 101), m = spV.clone().add(b).multiplyScalar(0.5); m.normalize().multiplyScalar(100 + spV.distanceTo(b) * 0.3);
      var tg = new T.TubeGeometry(new T.QuadraticBezierCurve3(spV, m, b), 90, 0.32, 6, false); tg.setDrawRange(0, 0);
      spinG.add(new T.Mesh(tg, arcMat)); arcs.push(tg);
      var mk = new T.Mesh(new T.RingGeometry(1.1, 1.7, 32), new T.MeshBasicMaterial({ color: 0xfff1c4, side: T.DoubleSide, transparent: true }));
      mk.position.copy(b); mk.lookAt(b.clone().multiplyScalar(2)); spinG.add(mk); marks.push(mk);
    });
    var home = new T.Mesh(new T.CircleGeometry(1.6, 24), new T.MeshBasicMaterial({ color: 0xe8c987, side: T.DoubleSide })); home.position.copy(spV); home.lookAt(spV.clone().multiplyScalar(2)); spinG.add(home);
    var sp = []; for (var s = 0; s < 1800; s++) { var t1 = Math.random() * Math.PI * 2, p1 = (Math.random() - 0.5) * Math.PI, R = 1200; sp.push(Math.cos(t1) * Math.cos(p1) * R, Math.sin(p1) * R, Math.sin(t1) * Math.cos(p1) * R); }
    var sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
    scene.add(new T.Points(sg, new T.PointsMaterial({ color: 0xf2e6c8, size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0.6 })));
    scene.add(new T.AmbientLight(0x6a6258, 0.6));
    var sun = new T.DirectionalLight(0xfff0d6, 0.95); sun.position.set(-300, 180, 260); scene.add(sun);
    var labs = Array.prototype.slice.call(document.querySelectorAll('.glab')), labPts = [spV].concat(DEST.map(function (d) { return ll(d[0], d[1], 102); }));
    var tmp = new T.Vector3(), lw = 0, lh = 0;
    return function render(st, t) {
      var w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
      if (w !== lw || h !== lh) { lw = w; lh = h; renderer.setSize(w, h, false); camera.aspect = w / h; }
      var f0 = ll(0, st.lon, 100);
      spinG.rotation.y = Math.atan2(-f0.x, f0.z); tiltG.rotation.x = st.lat * D2R;
      clouds.rotation.y = t * 0.008;
      var asp = w / h, fit = Math.max(1, 0.75 / asp); camera.position.set(0, 0, st.dist * fit); camera.lookAt(0, 0, 0);
      if (w <= 760) camera.setViewOffset(w, h, 0, h * 0.16, w, h); else camera.setViewOffset(w, h, -w * 0.16, 0, w, h);
      camera.updateProjectionMatrix();
      for (var k = 0; k < 4; k++) {
        arcs[k].setDrawRange(0, Math.floor(arcs[k].index.count * Math.min(1, Math.max(0, arcK * 1.6 - k * 0.2)) / 3) * 3);
        var near = Math.max(0, Math.min(1, (st.dist - 120) / 80)); marks[k].scale.setScalar(Math.max(0.001, near * (gActive === k + 1 ? 1.3 + 0.4 * Math.sin(t * 4) : 0.9 + 0.15 * Math.sin(t * 3 + k))));
      }
      scene.updateMatrixWorld();
      for (var li = 0; li < 5; li++) {
        tmp.copy(labPts[li]).applyMatrix4(spinG.matrixWorld);
        var vis = tmp.z > 20 && st.dist < 380; tmp.project(camera);
        var o = vis ? (gActive < 0 || gActive === li || li === 0 ? 1 : 0.45) : 0;
        labs[li].style.opacity = o; labs[li].classList.toggle('on', gActive === li);
        labs[li].style.transform = 'translate(' + ((tmp.x + 1) / 2 * w + 12).toFixed(1) + 'px,' + ((1 - tmp.y) / 2 * h - 14).toFixed(1) + 'px)';
      }
      renderer.render(scene, camera);
    };
  }
  function lonShort(a, b, k) { var d = ((b - a + 540) % 360) - 180; return a + d * k; }
  function setGlobe(g, instant) {
    var t = typeof g === 'string' ? G[g] : g;
    L.globe.style.setProperty('--glon', ((180 + t.lon) / 360 * 100).toFixed(1) + '%'); L.globe.style.setProperty('--gzoom', (330 / t.dist).toFixed(2));
    gTgt = { lat: t.lat, lon: t.lon, dist: t.dist };
    if (instant) gCur = { lat: t.lat, lon: t.lon, dist: t.dist };
  }

  /* ---------- notebook ---------- */
  var cam = $('cam'), tilt = $('tilt'), spin = $('spin'), lid = $('lid');
  var LID_CLOSED = 'translate3d(0,-9px,calc(var(--D) / -2)) rotateX(-90deg)', LID_OPEN = 'translate3d(0,-9px,calc(var(--D) / -2)) rotateX(10deg)';
  function laptopRest() { [cam, tilt, spin, lid].forEach(clearA); spin.style.animation = ''; spin.style.transform = ''; }
  function spinAngle() {
    var m = getComputedStyle(spin).transform; if (!m || m === 'none') return 0;
    var v = m.match(/matrix(3d)?\(([^)]+)\)/)[2].split(',').map(parseFloat);
    var a = v.length === 16 ? Math.atan2(-v[2], v[0]) : 0; a = a * 180 / Math.PI; return (a + 360) % 360;
  }
  function screenZoom() {
    var W = Math.min(innerWidth >= 1800 ? Math.min(680, innerWidth * 0.4) : 520, innerWidth * 0.74, innerHeight * 1.05), D = W * 0.66;
    var S = Math.max(innerWidth / (W * 0.9), innerHeight / (D * 0.9));
    return 'translate3d(0,' + (D * 0.5 * S + innerHeight * 0.11).toFixed(0) + 'px,0) scale(' + S.toFixed(3) + ')';
  }

  /* ---------- intro ---------- */
  var introName = $('introName'), introDone = false;
  (function () {
    var html = '';
    introName.querySelectorAll('span').length;
    var parts = [['TMS', true], [' ', false], ['Advogados', false]];
    parts.forEach(function (p) { if (p[0] === ' ') { html += ' '; return; } html += '<span class="' + (p[1] ? 'g' : '') + '">' + p[0].split('').map(function (c) { return '<span class="ch">' + c + '</span>'; }).join('') + '</span>'; });
    introName.innerHTML = html;
  })();
  function playIntro() {
    var chars = introName.querySelectorAll('.ch');
    setTimeout(function () { $('somos').classList.add('on'); }, 200);
    Array.prototype.forEach.call(chars, function (c, i) { setTimeout(function () { c.classList.add('on'); }, 700 + i * 90); });
    var end = 700 + chars.length * 90;
    setTimeout(function () { $('introLine').classList.add('on'); }, end);
    setTimeout(function () { introDone = true; if (cur === 0 && !busy) go(1); }, end + 1300);
  }
  function introInstant() { $('somos').classList.add('on'); each('#introName .ch', function (c) { c.classList.add('on'); }); $('introLine').classList.add('on'); }

  /* ---------- máquina de cenas ---------- */
  var cur = 0, busy = false, exp = $('exp'), prog = $('prog'), fab = $('fab'), chapNow = $('chapNow'), curtain = $('curtain');
  function hideCopies(except) { STEPS.forEach(function (s, k) { if (s.copy && k !== except) { s.copy.classList.remove('on'); s.copy.setAttribute('aria-hidden', 'true'); s.copy.inert = true; } }); }
  function setCopy(i, delay) {
    hideCopies(i);
    var s = STEPS[i];
    if (s.copy) setTimeout(function () { if (cur === i) { s.copy.classList.add('on'); s.copy.setAttribute('aria-hidden', 'false'); s.copy.inert = false; } }, delay || 0);
  }
  function setChrome(i) {
    prog.style.transform = 'scaleX(' + (i / LAST).toFixed(3) + ')';
    var c = 0; CH.forEach(function (h, k) { if (h.i <= i) c = k; });
    CH.forEach(function (h, k) { h.b.classList.toggle('on', k === c); });
    chapNow.textContent = i > 0 ? CH[c].name : '';
    fab.classList.toggle('on', i >= 1 && i < LAST);
    exp.classList.toggle('free', i === LAST);
    $('prevBtn').disabled = i === 0; $('nextBtn').hidden = i === LAST;
    var g = STEPS[i].g; gActive = STEPS[i].type === 'globe' ? -1 : (g ? LAB[g] : -1);
    for (var k = 1; k <= 3; k++) preload(i + k);
  }
  /* estado estático de uma cena (usado em saltos) */
  function stateOf(i) {
    var s = STEPS[i], layer = LAYER[s.type];
    [slotA, slotB].forEach(clearA); [L.intro, L.laptop, L.globe, L.photo, L.cta].forEach(clearA);
    laptopRest();
    only(layer);
    if (layer === 'intro') introInstant();
    if (layer === 'globe') { setGlobe(s.g, true); arcK = 1; }
    if (layer === 'photo') { putImg(slots[front], s); slots[front].style.cssText = 'opacity:1'; slots[1 - front].style.cssText = 'opacity:0'; slots[1 - front].innerHTML = ''; }
  }
  var slotA = slots[0], slotB = slots[1];

  function go(n) {
    if (busy || n < 0 || n > LAST || n === cur) return;
    var from = cur, to = n, dir = to > from ? 1 : -1, a = STEPS[from], b = STEPS[to], la = LAYER[a.type], lb = LAYER[b.type];
    busy = true; cur = to; setChrome(to);
    var T = 1100, copyDelay = 450;
    hideCopies(-1);
    if (Math.abs(to - from) > 1) { // salto: cortina
      curtain.classList.add('on');
      setTimeout(function () { stateOf(to); curtain.classList.remove('on'); setCopy(to, 250); }, 380);
      return unlock(900);
    }
    if (la === 'intro' && lb === 'laptop') {
      A(L.intro, [{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'translateY(-6vh) scale(1.04)' }], { duration: 800 });
      show('laptop', true); A(L.laptop, [{ opacity: 0, transform: 'scale(.82)' }, { opacity: 1, transform: 'none' }], { duration: 1200, delay: 250, easing: 'cubic-bezier(.16,1,.3,1)' });
      setTimeout(function () { show('intro', false); clearA(L.intro); }, 900);
      T = 1300; copyDelay = 800; loadThree();
    } else if (la === 'laptop' && lb === 'intro') {
      show('intro', true); introInstant(); A(L.intro, [{ opacity: 0 }, { opacity: 1 }], { duration: 700 });
      A(L.laptop, [{ opacity: 1 }, { opacity: 0, transform: 'scale(.85)' }], { duration: 700 });
      setTimeout(function () { show('laptop', false); clearA(L.laptop); }, 750); T = 900;
    } else if (la === 'laptop' && lb === 'globe') {
      var ang = spinAngle(); spin.style.animation = 'none';
      A(spin, [{ transform: 'rotateY(' + ang + 'deg)' }, { transform: 'rotateY(360deg)' }], { duration: 750, easing: 'cubic-bezier(.3,0,.2,1)' });
      A(tilt, [{ transform: 'rotateX(-56deg)' }, { transform: 'rotateX(-8deg)' }], { duration: 850 });
      A(lid, [{ transform: LID_CLOSED }, { transform: LID_OPEN }], { duration: 750, delay: 500, easing: 'cubic-bezier(.3,0,.2,1)' });
      A(cam, [{ transform: 'none' }, { transform: screenZoom() }], { duration: 900, delay: 1150, easing: 'cubic-bezier(.7,0,.25,1)' });
      setGlobe({ lat: 20, lon: -40, dist: 460 }, true); setGlobe('mundo'); arcK = 0;
      setTimeout(function () { show('globe', true); A(L.globe, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 }); }, 1800);
      setTimeout(function () { show('laptop', false); laptopRest(); clearA(L.globe); }, 2350);
      T = 2350; copyDelay = 2100;
    } else if (la === 'globe' && lb === 'laptop') {
      show('laptop', true); spin.style.animation = 'none';
      A(cam, [{ transform: screenZoom() }, { transform: 'none' }], { duration: 900, easing: 'cubic-bezier(.3,0,.2,1)' });
      A(lid, [{ transform: LID_OPEN }, { transform: LID_CLOSED }], { duration: 700, delay: 700 });
      A(tilt, [{ transform: 'rotateX(-8deg)' }, { transform: 'rotateX(-56deg)' }], { duration: 800, delay: 900 });
      A(L.globe, [{ opacity: 1 }, { opacity: 0 }], { duration: 400 });
      setTimeout(function () { show('globe', false); clearA(L.globe); }, 420);
      setTimeout(function () { laptopRest(); }, 1750);
      T = 1750; copyDelay = 1300;
    } else if (la === 'globe' && lb === 'globe') {
      setGlobe(b.g); T = 1300; copyDelay = 700;
    } else if (la === 'globe' && lb === 'photo') { // mergulho na cidade
      var p = CITYPOS[b.g]; setGlobe({ lat: p[0], lon: p[1], dist: 128 });
      putImg(slots[1 - front], b); front = 1 - front;
      clearA(slots[front]); slots[1 - front].style.opacity = 0;
      show('photo', true);
      A(slots[front], [{ opacity: 0, transform: 'scale(.3)', filter: 'blur(16px)' }, { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }], { duration: 1400, delay: 350, easing: 'cubic-bezier(.2,.75,.2,1)' });
      A(L.globe, [{ opacity: 1 }, { opacity: 0 }], { duration: 700, delay: 700 });
      setTimeout(function () { show('globe', false); clearA(L.globe); }, 1550);
      T = 1950; copyDelay = 1400;
    } else if (la === 'photo' && lb === 'globe') { // sobe da cidade para o globo
      var q = CITYPOS[a.g] || CITYPOS.us; setGlobe({ lat: q[0], lon: q[1], dist: 150 }, true); setGlobe(b.g);
      show('globe', true);
      A(slots[front], [{ opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }, { opacity: 0, transform: 'scale(.3)', filter: 'blur(14px)' }], { duration: 1000, easing: 'cubic-bezier(.6,0,.4,1)' });
      A(L.globe, [{ opacity: 0 }, { opacity: 1 }], { duration: 700, delay: 250 });
      setTimeout(function () { show('photo', false); clearA(L.globe); }, 1050);
      T = 1700; copyDelay = 1100;
    } else if (la === 'photo' && lb === 'photo') { // entra mais fundo na cidade
      var old = slots[front]; front = 1 - front; var nw = slots[front]; clearA(nw); putImg(nw, b);
      if (dir > 0) {
        A(old, [{ opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }, { opacity: 0, transform: 'scale(1.6)', filter: 'blur(10px)' }], { duration: 1100, easing: 'cubic-bezier(.55,0,.45,1)' });
        A(nw, [{ opacity: 0, transform: 'scale(.78)', filter: 'blur(10px)' }, { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }], { duration: 1200, delay: 200, easing: 'cubic-bezier(.2,.75,.2,1)' });
      } else {
        A(old, [{ opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }, { opacity: 0, transform: 'scale(.78)', filter: 'blur(10px)' }], { duration: 1000 });
        A(nw, [{ opacity: 0, transform: 'scale(1.6)', filter: 'blur(10px)' }, { opacity: 1, transform: 'scale(1)', filter: 'blur(0px)' }], { duration: 1100, delay: 150, easing: 'cubic-bezier(.2,.75,.2,1)' });
      }
      T = 1350; copyDelay = 750;
    } else if (la === 'photo' && lb === 'cta') {
      show('cta', true);
      A(slots[front], [{ opacity: 1 }, { opacity: 0, transform: 'scale(1.15)' }], { duration: 900 });
      A(L.cta, [{ opacity: 0, transform: 'scale(.94)' }, { opacity: 1, transform: 'none' }], { duration: 1000, delay: 300, easing: 'cubic-bezier(.16,1,.3,1)' });
      setTimeout(function () { show('photo', false); }, 950); T = 1300;
    } else if (la === 'cta' && lb === 'photo') {
      clearA(slots[front]); show('photo', true);
      A(slots[front], [{ opacity: 0, transform: 'scale(1.15)' }, { opacity: 1, transform: 'none' }], { duration: 900, delay: 200 });
      A(L.cta, [{ opacity: 1 }, { opacity: 0 }], { duration: 600 });
      setTimeout(function () { show('cta', false); clearA(L.cta); }, 650); T = 1100;
    } else { stateOf(to); T = 600; }
    setCopy(to, copyDelay);
    unlock(T);
  }
  function unlock(t) { setTimeout(function () { busy = false; }, reduce ? 50 : t + 120); }
  function jump(i) {
    if (i === cur) return;
    if ((window.scrollY || 0) > 2) { window.scrollTo(0, 0); }
    if (Math.abs(i - cur) === 1) go(i); else { busy = false; go(i); }
  }

  /* ---------- entrada: roda do mouse, toque e teclado ---------- */
  var lastWheel = 0, acc = 0;
  function atTop() { return (window.scrollY || pageYOffset) <= 1; }
  function capture(dy) { return atTop() && !(cur === LAST && dy > 0); }
  addEventListener('wheel', function (e) {
    var dy = e.deltaY; if (!capture(dy)) return;
    e.preventDefault();
    var now = performance.now();
    if (busy) { lastWheel = now; acc = 0; return; }
    if (now - lastWheel > 220) acc = 0;
    lastWheel = now; acc += dy;
    if (Math.abs(acc) > 28) { var d = acc > 0 ? 1 : -1; acc = 0; go(cur + d); }
  }, { passive: false });
  var ty0 = null, tMoved = false;
  addEventListener('touchstart', function (e) { ty0 = e.touches[0].clientY; tMoved = false; }, { passive: true });
  addEventListener('touchmove', function (e) {
    if (ty0 == null) return; var dy = ty0 - e.touches[0].clientY;
    if (capture(dy) && !menuOpen) { e.preventDefault(); if (!tMoved && Math.abs(dy) > 36 && !busy) { tMoved = true; go(cur + (dy > 0 ? 1 : -1)); } }
  }, { passive: false });
  addEventListener('touchend', function () { ty0 = null; }, { passive: true });
  addEventListener('keydown', function (e) {
    if (menuOpen || /input|textarea|select/i.test(e.target.tagName)) return;
    var k = e.key, d = (k === 'ArrowDown' || k === 'PageDown' || (k === ' ' && !e.shiftKey)) ? 1 : (k === 'ArrowUp' || k === 'PageUp') ? -1 : 0;
    if (!d || !capture(d)) return; e.preventDefault(); go(cur + d);
  });
  // se a pessoa arrastar a barra de rolagem para baixo, a apresentação fica no fim
  addEventListener('scroll', function () { if (cur !== LAST && (window.scrollY || 0) > 40) { busy = false; cur = LAST; stateOf(LAST); setChrome(LAST); setCopy(LAST); } }, { passive: true });

  $('nextBtn').addEventListener('click', function () { go(cur + 1); });
  $('prevBtn').addEventListener('click', function () { go(cur - 1); });

  /* ---------- laço de animação (globo e profundidade) ---------- */
  var root = document.documentElement, px = 0, py = 0, tpx = 0, tpy = 0, t0 = performance.now(), tPrev = t0;
  if (!reduce && matchMedia('(pointer: fine)').matches) addEventListener('pointermove', function (e) { tpx = e.clientX / innerWidth - 0.5; tpy = e.clientY / innerHeight - 0.5; }, { passive: true });
  function loop(now) {
    var t = (now - t0) / 1000, dt = Math.min(0.1, (now - tPrev) / 1000); tPrev = now;
    if (globe && L.globe.classList.contains('vis')) {
      var k = reduce ? 1 : 1 - Math.exp(-dt * 3.2);
      gCur.lat += (gTgt.lat - gCur.lat) * k; gCur.lon = lonShort(gCur.lon, gTgt.lon, k); gCur.dist += (gTgt.dist - gCur.dist) * k;
      if (arcK < 1) arcK = Math.min(1, arcK + dt * 0.7);
      globe({ lat: gCur.lat, lon: gCur.lon + (STEPS[cur].type === 'globe' ? Math.sin(t * 0.25) * 3 : 0), dist: gCur.dist }, t);
    }
    if (Math.abs(tpx - px) > 0.001 || Math.abs(tpy - py) > 0.001) { px += (tpx - px) * 0.06; py += (tpy - py) * 0.06; root.style.setProperty('--px', px.toFixed(3)); root.style.setProperty('--py', py.toFixed(3)); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);

  /* início */
  setChrome(0);
  if (reduce) { introInstant(); introDone = true; } else playIntro();
  setTimeout(loadThree, 1500);
  if (location.hash && location.hash !== '#exp' && document.querySelector(location.hash)) { cur = LAST; stateOf(LAST); setChrome(LAST); }

  /* ---------- revelar seções da página ---------- */
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }); }, { rootMargin: '0px 0px -10% 0px' });
    each('.rv', function (el) { io.observe(el); });
  } else each('.rv', function (el) { el.classList.add('in'); });

  /* ---------- vistos por país: a foto da cidade abre em círculo ---------- */
  var D = [
    { nome: 'Portugal', cidade: 'Lisboa', img: 'cidades/lisboa-2', vistos: [['D1', 'Trabalho subordinado', 'Contrato de trabalho com empresa portuguesa.'], ['D2', 'Empreendedor', 'Negócio próprio ou investimento em Portugal.'], ['D3', 'Alta qualificação', 'Formação superior e oferta de trabalho.'], ['D4', 'Estudo', 'Graduação, mestrado e doutorado.'], ['D7', 'Rendimentos próprios', 'Aposentadoria, aluguéis e outros rendimentos.'], ['D8', 'Nômade digital', 'Trabalho remoto para empresa de fora.']], cid: ['Nacionalidade portuguesa por descendência', 'Reagrupamento familiar'], che: ['NIF e NISS', 'Acompanhamento na AIMA'], nota: '' },
    { nome: 'Espanha', cidade: 'Madri', img: 'cidades/madri-1', vistos: [['NL', 'Residência não lucrativa', 'Para quem vive de renda própria, sem trabalhar lá.'], ['ND', 'Nômade digital', 'Trabalho remoto para empresa fora da Espanha.'], ['PAC', 'Profissional qualificado', 'Oferta de emprego para perfil de alta qualificação.'], ['EST', 'Estudos', 'Graduação, pós e cursos longos.'], ['RF', 'Reagrupamento familiar', 'Cônjuge, filhos e pais de residentes.']], cid: ['Nacionalidade por residência, com 2 anos de residência legal para brasileiros', 'Nacionalidade por descendência'], che: ['NIE e TIE', 'Empadronamiento'], nota: '' },
    { nome: 'Irlanda', cidade: 'Dublin', img: 'cidades/dublin-1', vistos: [['Stamp 2', 'Estudo', 'Inglês ou ensino superior, com trabalho parcial.'], ['CSEP', 'Critical Skills', 'Profissões em falta, com caminho para residência.'], ['GEP', 'General Employment', 'Oferta de emprego em ocupação elegível.'], ['JF', 'Reagrupamento familiar', 'Família de residentes e titulares de permissão.']], cid: ['Cidadania irlandesa por descendência (Foreign Births Register)'], che: ['Registro de imigração (IRP)', 'PPS Number'], nota: '' },
    { nome: 'Estados Unidos', cidade: 'Nova York', img: 'cidades/nova-york-1', vistos: [['F-1', 'Estudante', 'Graduação, pós e cursos em instituição aprovada.'], ['L-1', 'Transferência intracompanhia', 'Executivos e especialistas de empresa com filial nos EUA.'], ['O-1', 'Habilidade extraordinária', 'Reconhecimento comprovado na área.'], ['E-2', 'Investidor por tratado', 'Exige nacionalidade de país com tratado, como Portugal ou Itália.'], ['EB-2 NIW', 'Green card por interesse nacional', 'Profissional qualificado, sem precisar de empregador.'], ['EB-5', 'Green card por investimento', 'Investimento em negócio que gere empregos.']], cid: ['Planejamento de cidadania europeia para quem mira o E-2'], che: ['Orientação nas primeiras providências'], nota: EUA_NOTA }
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
    var r = destMedia.getBoundingClientRect(), cx = 50, cy = 50;
    if (ev && ev.clientX && r.width) { cx = Math.max(0, Math.min(1, (ev.clientX - r.left) / r.width)) * 100; cy = ev.clientY < r.top ? 0 : 50; }
    destMedia.style.setProperty('--cx', cx.toFixed(0) + '%'); destMedia.style.setProperty('--cy', cy.toFixed(0) + '%');
    var im = new Image(), mine = k; im.decoding = 'async'; im.alt = d.cidade + ', ' + d.nome;
    im.onload = function () {
      if (mine !== sel) return;
      var olds = destMedia.querySelectorAll('img');
      destMedia.insertBefore(im, destMedia.querySelector('figcaption'));
      requestAnimationFrame(function () { requestAnimationFrame(function () { im.classList.add('open'); }); });
      setTimeout(function () { Array.prototype.forEach.call(olds, function (o) { o.remove(); }); }, 1200);
    };
    im.src = src(d.img);
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
    if (o) { menu.hidden = false; requestAnimationFrame(function () { requestAnimationFrame(function () { menu.classList.add('open'); }); }); setTimeout(function () { var a = menu.querySelector('a'); if (a) a.focus(); }, 300); }
    else { menu.classList.remove('open'); setTimeout(function () { if (!menuOpen) menu.hidden = true; }, 800); }
  }
  mb.addEventListener('click', function () { setMenu(!menuOpen); });
  each('#menu a', function (a) {
    a.addEventListener('click', function (e) {
      setMenu(false);
      var st = a.getAttribute('data-step');
      if (st != null) { e.preventDefault(); window.scrollTo(0, 0); jump(+st); return; }
      var t = document.querySelector(a.getAttribute('href'));
      if (t) { e.preventDefault(); if (cur !== LAST) { cur = LAST; stateOf(LAST); setChrome(LAST); setCopy(LAST); } t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); }
    });
  });
  addEventListener('keydown', function (e) {
    if (!menuOpen) return;
    if (e.key === 'Escape') { setMenu(false); mb.focus(); return; }
    if (e.key !== 'Tab') return;
    var f = [mb].concat(Array.prototype.slice.call(menu.querySelectorAll('a'))), first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
})();
