/* TMS Advogados Associados — interações do site */
(function () {
  var C = window.SITE || {};
  var reduce = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var cl = function (x) { return x < 0 ? 0 : x > 1 ? 1 : x; };
  var sm = function (x) { x = cl(x); return x * x * (3 - 2 * x); };
  var lerp = function (a, b, k) { return a + (b - a) * k; };
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
  if (C.parceiroEUA) each('[data-eua]', function (el) { el.textContent = 'Em atuação conjunta com ' + C.parceiroEUA + ', escritório licenciado nos EUA.'; });
  $('year').textContent = new Date().getFullYear();
  var regs = [C.registroSociedadeOAB && 'Registro ' + C.registroSociedadeOAB, C.cnpj && 'CNPJ ' + C.cnpj].filter(Boolean);
  if (regs.length) $('regs').textContent = ' · ' + regs.join(' · ');
  var SOC = C.socios || [];
  function sub(s) { return [s.cargo, s.oab].filter(Boolean).join(' · '); }
  function portrait(s) { return '<div class="ph"><span class="mono-i" aria-hidden="true">' + esc(s.iniciais || '') + '</span>' + (s.foto ? '<img src="' + esc(s.foto) + '" alt="' + esc((s.titulo ? s.titulo + ' ' : '') + s.nome) + '" loading="lazy" onerror="this.remove()">' : '') + '</div>'; }
  $('people').innerHTML = SOC.map(function (s) { return '<div class="person">' + portrait(s) + '<b>' + esc(s.nome) + '</b><span>' + esc(sub(s)) + '</span></div>'; }).join('');
  $('cardBack').insertAdjacentHTML('afterbegin', SOC.map(function (s) { return '<div><b>' + esc((s.titulo ? s.titulo + ' ' : '') + s.nome) + '</b><span>' + esc(sub(s).toUpperCase()) + '</span></div>'; }).join(''));

  /* ---------- pontos de terra (globo e mapas dos vistos) ---------- */
  var LAND = [];
  (function () {
    var G = window.GLOBE; if (!G) return;
    var raw = atob(G.bits), N = G.N, runs = G.cls.split(','), cls = [];
    runs.forEach(function (rn) { var ch = +rn.charAt(0), c = +rn.slice(1); for (var z = 0; z < c; z++) cls.push(ch); });
    var ga = Math.PI * (3 - Math.sqrt(5)), ci = 0;
    for (var n = 0; n < N; n++) {
      if (!((raw.charCodeAt(n >> 3) >> (7 - (n & 7))) & 1)) continue;
      var y = 1 - 2 * (n + 0.5) / N;
      LAND.push([Math.asin(y) * 180 / Math.PI, ((n * ga) % (2 * Math.PI)) * 180 / Math.PI - 180, cls[ci++] || 0]);
    }
  })();

  /* ---------- títulos palavra por palavra ---------- */
  function split(el) {
    var walk = function (node) {
      Array.prototype.slice.call(node.childNodes).forEach(function (c) {
        if (c.nodeType === 3) {
          var parts = c.textContent.split(/(\s+)/), frag = document.createDocumentFragment();
          parts.forEach(function (pt) {
            if (!pt) return;
            if (/^\s+$/.test(pt)) frag.appendChild(document.createTextNode(pt));
            else { var s = document.createElement('span'); s.className = 'w'; s.textContent = pt; frag.appendChild(s); }
          });
          node.replaceChild(frag, c);
        } else if (c.nodeType === 1 && !c.classList.contains('w')) walk(c);
      });
    };
    walk(el);
  }
  each('[data-split]', split);
  var SCRIBBLE = '<svg viewBox="0 0 240 16" preserveAspectRatio="none" aria-hidden="true"><path d="M3 9 C 40 3, 70 14, 118 8 S 196 3, 237 10"/></svg>';
  var RING = '<svg viewBox="0 0 240 60" preserveAspectRatio="none" aria-hidden="true"><path d="M30 12 C 90 -2, 210 2, 232 26 C 246 46, 170 58, 100 56 C 30 54, 2 40, 10 24 C 16 12, 60 6, 120 8"/></svg>';
  each('.mk', function (m) { m.insertAdjacentHTML('beforeend', m.classList.contains('ring') ? RING : SCRIBBLE); });

  function item(el) { return { el: el, words: el.querySelectorAll('.w'), fades: el.querySelectorAll('.fd'), marks: el.querySelectorAll('.mk'), last: -1 }; }
  var chaps = []; for (var j = 0; j < 8; j++) chaps.push(item($('ch' + j)));
  var rws = Array.prototype.map.call(document.querySelectorAll('.rw, .nums'), item);
  function reveal(it, pr, isChap) {
    if (Math.abs(it.last - pr) < 0.001) return; it.last = pr;
    if (isChap) { it.el.style.opacity = cl(pr * 2.5).toFixed(3); it.el.style.pointerEvents = pr > 0.6 ? 'auto' : 'none'; it.el.setAttribute('aria-hidden', pr > 0.6 ? 'false' : 'true'); if ('inert' in it.el) it.el.inert = pr <= 0.6; }
    var n = it.words.length, r = cl(pr * 1.25);
    for (var i = 0; i < n; i++) {
      var w = reduce ? (pr > 0.3 ? 1 : 0) : cl(r * (n + 1) - i), s = it.words[i].style;
      s.opacity = w.toFixed(3);
      s.transform = 'translateY(' + ((1 - w) * 24).toFixed(1) + 'px) rotate(' + ((1 - w) * (i % 2 ? 4 : -3)).toFixed(2) + 'deg)';
    }
    var f = reduce ? (pr > 0.3 ? 1 : 0) : cl((pr - 0.45) * 2.2);
    if (it.el.classList.contains('nums')) f = reduce ? 1 : cl(pr * 1.6);
    for (var k = 0; k < it.fades.length; k++) { it.fades[k].style.opacity = f.toFixed(3); it.fades[k].style.transform = 'translateY(' + ((1 - f) * 14).toFixed(1) + 'px)'; }
    if (it.el.classList.contains('nums')) { it.el.style.opacity = f.toFixed(3); it.el.style.transform = 'translateY(' + ((1 - f) * 14).toFixed(1) + 'px)'; }
    for (var q = 0; q < it.marks.length; q++) it.marks[q].classList.toggle('on', pr > 0.92);
  }

  /* ---------- texturas geradas no navegador (papel e couro) ---------- */
  function noiseTex(w, h, base, spots, alpha) {
    var c = document.createElement('canvas'); c.width = w; c.height = h; var g = c.getContext('2d');
    g.fillStyle = base; g.fillRect(0, 0, w, h);
    for (var i = 0; i < spots; i++) { g.fillStyle = 'rgba(' + (Math.random() < 0.5 ? '90,60,20' : '255,250,235') + ',' + (Math.random() * alpha).toFixed(3) + ')'; var r = Math.random() * 3 + 0.4; g.beginPath(); g.arc(Math.random() * w, Math.random() * h, r, 0, 7); g.fill(); }
    var gr = g.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.75); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(90,60,20,0.28)'); g.fillStyle = gr; g.fillRect(0, 0, w, h);
    return c.toDataURL('image/jpeg', 0.8);
  }
  var PARCH = noiseTex(600, 800, '#E6DAC0', 5000, 0.12);
  var LEATHER = noiseTex(400, 560, '#1F2E24', 9000, 0.18);
  var sheet = document.createElement('style');
  sheet.textContent = '.mpage,.minner,.pp-inner,.pass,.tag,.pg,.cf.back,.pc:not(.has-img){background-image:url(' + PARCH + ')}.mfront,.pp-front,.pp-back{background-image:url(' + LEATHER + ')}';
  document.head.appendChild(sheet);

  /* ---------- desenho dos vistos (modelos ilustrativos) ---------- */
  var shieldImg = new Image(); shieldImg.src = 'assets/img/escudo.jpg';
  var V = [
    { pais: 'PORTUGAL', sub: 'REPÚBLICA PORTUGUESA', tipo: 'D7 · RESIDÊNCIA', code: 'LIS', tint: '#2F6B4F', acc: '#B23A2E', paper: '#E7E4D1' },
    { pais: 'ESPAÑA', sub: 'REINO DE ESPAÑA', tipo: 'NO LUCRATIVA', code: 'MAD', tint: '#A8322B', acc: '#D9A62E', paper: '#F1E4C6' },
    { pais: 'IRELAND', sub: 'ÉIRE', tipo: 'STAMP 2 · STUDY', code: 'DUB', tint: '#1F7A4D', acc: '#E08A2E', paper: '#E1EAD8' },
    { pais: 'UNITED STATES', sub: 'OF AMERICA', tipo: 'F-1 · STUDENT', code: 'JFK', tint: '#274B8A', acc: '#A8322D', paper: '#E2E6EE' }
  ];
  function worldDots(g, x0, y0, w, h, col) {
    g.fillStyle = col;
    for (var i = 0; i < LAND.length; i += 2) { var p = LAND[i]; g.fillRect(x0 + (p[1] + 180) / 360 * w, y0 + (90 - p[0]) / 180 * h, 1.6, 1.6); }
  }
  function guil(g, x0, y0, w, h, col, rows) {
    g.strokeStyle = col; g.lineWidth = 1;
    for (var j = 0; j < rows; j++) { g.beginPath(); for (var x = 0; x <= w; x += 5) { var y = y0 + (j + 0.5) * h / rows + Math.sin(x / 26 + j * 0.9) * 7 + Math.sin(x / 71 + j) * 5; if (x === 0) g.moveTo(x0 + x, y); else g.lineTo(x0 + x, y); } g.stroke(); }
  }
  function rosette(g, cx, cy, R, col) {
    g.strokeStyle = col; g.lineWidth = 0.8;
    for (var i = 0; i < 36; i++) { g.save(); g.translate(cx, cy); g.rotate(i * Math.PI / 18); g.beginPath(); g.ellipse(0, 0, R, R * 0.32, 0, 0, 7); g.stroke(); g.restore(); }
  }
  function stamp(g, x, y, rot, code, label, col) {
    g.save(); g.translate(x, y); g.rotate(rot); g.strokeStyle = col; g.fillStyle = col; g.globalAlpha = 0.85; g.lineWidth = 4;
    g.beginPath(); g.arc(0, 0, 60, 0, 7); g.stroke(); g.lineWidth = 1.5; g.beginPath(); g.arc(0, 0, 50, 0, 7); g.stroke();
    g.textAlign = 'center'; g.font = '700 28px Cinzel, serif'; g.fillText(code, 0, 10);
    g.font = '500 10px "DM Mono", monospace'; g.fillText(label, 0, -26); g.fillText('ENTRADA', 0, 34);
    g.restore();
  }
  function drawVisa(cv, k, big) {
    var g = cv.getContext('2d'), W = cv.width, H = cv.height, v = V[k];
    g.clearRect(0, 0, W, H);
    if (big) {
      var gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, v.paper); gr.addColorStop(1, '#F4EEDC'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
      worldDots(g, 0, 40, W, H - 80, hexA(v.tint, 0.16));
      guil(g, 0, 0, W, H, hexA(v.tint, 0.18), 22);
      rosette(g, W * 0.8, H * 0.42, 190, hexA(v.acc, 0.22));
      g.fillStyle = v.tint; g.fillRect(0, 0, W, 88);
      g.fillStyle = hexA(v.acc, 1); g.fillRect(0, 88, W, 8);
      g.fillStyle = '#F6EFDB'; g.font = '600 42px Cinzel, serif'; g.textAlign = 'left'; g.fillText(v.pais, 44, 60);
      g.textAlign = 'right'; g.font = '500 18px "DM Mono", monospace'; g.fillText('TMS · VISTO · VISA', W - 44, 56);
      g.fillStyle = hexA(v.tint, 0.18); roundRect(g, 44, 130, 250, 320, 10); g.fill();
      g.fillStyle = hexA(v.tint, 0.45); g.beginPath(); g.arc(169, 250, 60, 0, 7); g.fill(); g.beginPath(); g.ellipse(169, 420, 100, 70, 0, Math.PI, 0); g.fill();
      g.textAlign = 'left'; var rows = [['TIPO / TYPE', v.tipo], ['NOME / NAME', 'SEU NOME AQUI'], ['VALIDADE / VALID', 'EM BREVE'], ['Nº', 'TMS-000' + (k + 1)]];
      for (var i = 0; i < rows.length; i++) { var ry = 160 + i * 78; g.fillStyle = hexA(v.tint, 0.9); g.font = '500 15px "DM Mono", monospace'; g.fillText(rows[i][0], 340, ry); g.fillStyle = '#17130D'; g.font = '600 30px Cinzel, serif'; g.fillText(rows[i][1], 340, ry + 36); }
      var hg = g.createLinearGradient(W - 300, 0, W - 150, 0); hg.addColorStop(0, 'rgba(255,210,140,0.35)'); hg.addColorStop(0.5, 'rgba(150,215,255,0.35)'); hg.addColorStop(1, 'rgba(255,180,230,0.3)');
      g.fillStyle = hg; g.fillRect(W - 300, 110, 150, 390);
      if (shieldImg.complete && shieldImg.naturalWidth) { g.globalAlpha = 0.5; g.drawImage(shieldImg, W - 285, 220, 120, 135); g.globalAlpha = 1; }
      g.fillStyle = '#17130D'; g.font = '500 30px "DM Mono", monospace';
      g.fillText('V<' + v.code + 'SEU<<NOME<<AQUI<<<<<<<<<<<<<<<<<<', 44, H - 110);
      g.fillText('TMS0000' + (k + 1) + '<0BRA<<<<<<<<<<<ESPECIME<<<<<<<<', 44, H - 66);
      g.save(); g.translate(W * 0.52, H * 0.5); g.rotate(-0.33); g.textAlign = 'center'; g.fillStyle = hexA(v.acc, 0.14); g.font = '700 70px Cinzel, serif'; g.fillText('ESPÉCIME', 0, 0); g.restore();
    } else {
      g.fillStyle = '#E8DDC3'; g.fillRect(0, 0, W, H);
      worldDots(g, 0, 40, W, H - 60, 'rgba(90,70,40,0.12)');
      guil(g, 0, 0, W, H, 'rgba(110,90,50,0.14)', 16);
      if (k < 4) {
        g.save(); g.translate(24, 36);
        var sw = W - 48, sh = 300; g.fillStyle = v.paper; roundRect(g, 0, 0, sw, sh, 8); g.fill();
        g.fillStyle = v.tint; g.fillRect(0, 0, sw, 46); g.fillStyle = v.acc; g.fillRect(0, 46, sw, 5);
        g.fillStyle = '#F6EFDB'; g.font = '600 22px Cinzel, serif'; g.textAlign = 'left'; g.fillText(v.pais, 14, 31);
        guil(g, 0, 56, sw, sh - 56, hexA(v.tint, 0.2), 8);
        g.fillStyle = hexA(v.tint, 0.3); roundRect(g, 14, 66, 96, 124, 6); g.fill();
        g.fillStyle = '#17130D'; g.font = '600 17px Cinzel, serif'; g.fillText(v.tipo, 124, 92); g.fillText('SEU NOME AQUI', 124, 132);
        g.font = '500 11px "DM Mono", monospace'; g.fillStyle = hexA(v.tint, 1); g.fillText('TIPO', 124, 74); g.fillText('NOME', 124, 114); g.fillText('TMS · MODELO ILUSTRATIVO', 124, 176);
        g.fillStyle = '#17130D'; g.font = '500 12px "DM Mono", monospace'; g.fillText('V<' + v.code + 'SEU<<NOME<<AQUI<<<<<<<<<<', 14, 262); g.fillText('TMS000' + (k + 1) + '<0BRA<<<<<<<<<<<<<<<<', 14, 282);
        g.restore();
        stamp(g, 330, 520, -0.22, v.code, v.pais.length > 9 ? v.pais.slice(0, 9) : v.pais, '#1F3A6B');
        stamp(g, 130, 560, 0.16, 'GRU', 'BRASIL', '#7A2A22');
      } else {
        stamp(g, 130, 150, -0.2, 'LIS', 'PORTUGAL', '#2F6B4F'); stamp(g, 340, 250, 0.18, 'MAD', 'ESPAÑA', '#A8322B');
        stamp(g, 140, 400, 0.1, 'DUB', 'IRELAND', '#1F7A4D'); stamp(g, 340, 540, -0.14, 'JFK', 'USA', '#274B8A');
      }
    }
  }
  function hexA(h, a) { var n = parseInt(h.slice(1), 16); return 'rgba(' + (n >> 16) + ',' + ((n >> 8) & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function roundRect(g, x, y, w, h, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  var visaBig = $('visaBig'), ppCanvas = $('ppCanvas'), lastPP = -9;
  function redrawAll() { drawVisa(visaBig, 0, true); lastPP = -9; }
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(function () { if (shieldImg.complete) redrawAll(); else shieldImg.onload = redrawAll; });
  drawVisa(visaBig, 0, true);

  /* ---------- globo 3D: three.js só é baixado quando o visitante começa a rolar ---------- */
  var three = null, threeState = 0;
  function loadThree() {
    if (threeState) return; threeState = 1;
    var s = document.createElement('script');
    s.src = 'assets/vendor/three.min.js';
    s.onload = function () { try { three = buildGlobe(); } catch (e) { console.error(e); } threeState = 2; };
    s.onerror = function () { threeState = 3; };
    document.head.appendChild(s);
  }
  function buildGlobe() {
    if (!window.THREE) return null;
    var T = THREE, cv = $('gl');
    var renderer = new T.WebGLRenderer({ canvas: cv, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio || 1, innerWidth < 760 ? 1.5 : 2));
    renderer.outputEncoding = T.sRGBEncoding;
    var scene = new T.Scene(), camera = new T.PerspectiveCamera(35, 1, 1, 3000);
    var tilt = new T.Group(), spin = new T.Group(); tilt.add(spin); scene.add(tilt);
    var L = new T.TextureLoader();
    var dayT = L.load('assets/img/terra-dia.jpg'), nightT = L.load('assets/img/terra-noite.jpg'), cloudT = L.load('assets/img/terra-nuvens.jpg');
    dayT.encoding = T.sRGBEncoding; nightT.encoding = T.sRGBEncoding;
    var earthMat = new T.MeshPhongMaterial({ map: dayT, color: 0x8a8f99, emissiveMap: nightT, emissive: 0xffd9a0, emissiveIntensity: 1.35, specular: 0x333028, shininess: 14, transparent: true, opacity: 0 });
    var earth = new T.Mesh(new T.SphereGeometry(100, 96, 64), earthMat); spin.add(earth);
    var cloudMat = new T.MeshPhongMaterial({ alphaMap: cloudT, color: 0xf3ead6, transparent: true, opacity: 0, depthWrite: false });
    var clouds = new T.Mesh(new T.SphereGeometry(101.4, 96, 64), cloudMat); spin.add(clouds);
    var atm = new T.Mesh(new T.SphereGeometry(110, 64, 48), new T.ShaderMaterial({
      uniforms: { c: { value: new T.Color(0xd9b270) }, k: { value: 0.0 } },
      vertexShader: 'varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }',
      fragmentShader: 'uniform vec3 c; uniform float k; varying vec3 vN; void main(){ float i = pow(max(0.0, 0.66 - dot(vN, vec3(0.0,0.0,1.0))), 3.0); gl_FragColor = vec4(c * i * k, 1.0); }',
      side: T.BackSide, blending: T.AdditiveBlending, transparent: true, depthWrite: false
    }));
    scene.add(atm);
    var D2R = Math.PI / 180;
    function ll(lat, lon, R) { var phi = (90 - lat) * D2R, th = (lon + 180) * D2R; return new T.Vector3(-R * Math.sin(phi) * Math.cos(th), R * Math.cos(phi), R * Math.sin(phi) * Math.sin(th)); }
    var hp = [], hc = [], gold = new T.Color(0xe8c987), hot = new T.Color(0xfff1c4);
    LAND.forEach(function (p) { var v = ll(p[0], p[1], 100.8); hp.push(v.x, v.y, v.z); var c = p[2] ? hot : gold; hc.push(c.r, c.g, c.b); });
    var hg = new T.BufferGeometry(); hg.setAttribute('position', new T.Float32BufferAttribute(hp, 3)); hg.setAttribute('color', new T.Float32BufferAttribute(hc, 3));
    var holoMat = new T.PointsMaterial({ size: 1.3, vertexColors: true, transparent: true, opacity: 1, blending: T.AdditiveBlending, depthWrite: false });
    spin.add(new T.Points(hg, holoMat));
    var gl = [];
    for (var la = -75; la <= 75; la += 15) for (var lo = 0; lo < 360; lo += 4) { var a = ll(la, lo - 180, 101.5), b = ll(la, lo - 176, 101.5); gl.push(a.x, a.y, a.z, b.x, b.y, b.z); }
    for (var lo2 = -180; lo2 < 180; lo2 += 20) for (var la2 = -88; la2 < 88; la2 += 4) { var a2 = ll(la2, lo2, 101.5), b2 = ll(la2 + 4, lo2, 101.5); gl.push(a2.x, a2.y, a2.z, b2.x, b2.y, b2.z); }
    var gg = new T.BufferGeometry(); gg.setAttribute('position', new T.Float32BufferAttribute(gl, 3));
    var gridMat = new T.LineBasicMaterial({ color: 0xc9ae78, transparent: true, opacity: 0.22, blending: T.AdditiveBlending, depthWrite: false });
    spin.add(new T.LineSegments(gg, gridMat));
    var core = new T.Mesh(new T.SphereGeometry(99, 64, 48), new T.MeshBasicMaterial({ color: 0x0b0a08, transparent: true, opacity: 0.85 })); spin.add(core);
    var SP = [-23.55, -46.63], DEST = [[38.72, -9.14], [40.42, -3.7], [53.35, -6.26], [40.71, -74.0]];
    var spV = ll(SP[0], SP[1], 101), arcs = [], marks = [], arcMat = new T.MeshBasicMaterial({ color: 0xffe2a0, transparent: true, opacity: 1, depthWrite: false });
    DEST.forEach(function (d) {
      var b = ll(d[0], d[1], 101), m = spV.clone().add(b).multiplyScalar(0.5); m.normalize().multiplyScalar(100 + spV.distanceTo(b) * 0.3);
      var tg = new T.TubeGeometry(new T.QuadraticBezierCurve3(spV, m, b), 90, 0.5, 6, false); tg.setDrawRange(0, 0);
      spin.add(new T.Mesh(tg, arcMat)); arcs.push(tg);
      var mk = new T.Mesh(new T.RingGeometry(1.6, 2.4, 32), new T.MeshBasicMaterial({ color: 0xfff1c4, side: T.DoubleSide, transparent: true }));
      mk.position.copy(b); mk.lookAt(b.clone().multiplyScalar(2)); mk.scale.setScalar(0.001); spin.add(mk); marks.push(mk);
    });
    var home = new T.Mesh(new T.CircleGeometry(1.7, 24), new T.MeshBasicMaterial({ color: 0xe8c987, side: T.DoubleSide })); home.position.copy(spV); home.lookAt(spV.clone().multiplyScalar(2)); spin.add(home);
    var sp = []; for (var s = 0; s < 1600; s++) { var t1 = Math.random() * Math.PI * 2, p1 = (Math.random() - 0.5) * Math.PI, R = 1200; sp.push(Math.cos(t1) * Math.cos(p1) * R, Math.sin(p1) * R, Math.sin(t1) * Math.cos(p1) * R); }
    var sg = new T.BufferGeometry(); sg.setAttribute('position', new T.Float32BufferAttribute(sp, 3));
    scene.add(new T.Points(sg, new T.PointsMaterial({ color: 0xf2e6c8, size: 1.3, sizeAttenuation: false, transparent: true, opacity: 0.6 })));
    scene.add(new T.AmbientLight(0x6a6258, 0.55));
    var sun = new T.DirectionalLight(0xfff0d6, 0.9); sun.position.set(-300, 180, 260); scene.add(sun);
    var labs = [$('l0'), $('l1'), $('l2'), $('l3'), $('l4')], labPts = [spV].concat(DEST.map(function (d) { return ll(d[0], d[1], 102); }));
    var tmp = new T.Vector3(), lw = 0, lh = 0;
    function lonShort(a, b, k) { var d = ((b - a + 540) % 360) - 180; return a + d * k; }
    return {
      render: function (st) {
        var w = cv.clientWidth, h = cv.clientHeight; if (!w || !h) return;
        if (w !== lw || h !== lh) { lw = w; lh = h; renderer.setSize(w, h, false); camera.aspect = w / h; }
        var f0 = ll(0, st.lon, 100);
        spin.rotation.y = Math.atan2(-f0.x, f0.z) + st.t * 0.004; tilt.rotation.x = st.lat * D2R;
        clouds.rotation.y = st.t * 0.01;
        camera.position.set(0, 0, st.dist); camera.lookAt(0, 0, 0);
        if (w < 760) camera.setViewOffset(w, h, 0, h * 0.14, w, h); else camera.setViewOffset(w, h, -w * st.ox, 0, w, h);
        camera.updateProjectionMatrix();
        holoMat.opacity = 1 - st.real; gridMat.opacity = 0.22 * (1 - st.real) + 0.04; core.material.opacity = 0.85 * (1 - st.real);
        earthMat.opacity = st.real; cloudMat.opacity = st.real * 0.55 * (st.cl == null ? 1 : st.cl); arcMat.opacity = st.ao == null ? 1 : st.ao; atm.material.uniforms.k.value = 0.5 + st.real * 0.6;
        for (var k = 0; k < 4; k++) { arcs[k].setDrawRange(0, Math.floor(arcs[k].index.count * st.arc[k] / 3) * 3); marks[k].scale.setScalar(st.arc[k] >= 1 ? (1 + 0.35 * Math.sin(st.t * 4 + k)) * (st.ao == null ? 1 : 0.35 + 0.65 * st.ao) : 0.001); }
        scene.updateMatrixWorld();
        for (var li = 0; li < 5; li++) {
          tmp.copy(labPts[li]).applyMatrix4(spin.matrixWorld);
          var front = tmp.z > 25; tmp.project(camera);
          labs[li].style.opacity = front ? (st.labs[li]).toFixed(3) : '0';
          labs[li].style.transform = 'translate(' + ((tmp.x + 1) / 2 * w + 12).toFixed(1) + 'px,' + ((1 - tmp.y) / 2 * h - 14).toFixed(1) + 'px)';
        }
        renderer.render(scene, camera);
      },
      lonShort: lonShort
    };
  }
  addEventListener('scroll', function () { if (scrollY > 40) loadThree(); }, { passive: true });
  if ('requestIdleCallback' in window) requestIdleCallback(loadThree, { timeout: 4000 }); else setTimeout(loadThree, 2500);

  /* ---------- filme controlado pela rolagem ---------- */
  var film = $('film'), heroImg = $('heroImg'), heroLayer = $('heroLayer'), air = $('airport'), visaWrap = $('visaWrap'), holo = $('holo'), gl = $('gl'), bar = $('bar');
  var ppWrap = $('ppWrap'), pp = $('pp'), ppCover = $('ppCover'), cityCard = $('cityCard'), pc = $('pc'), fab = $('fab');
  var CITY = [['Lisboa', '38°43′N · 9°08′O', 'lisboa'], ['Madri', '40°25′N · 3°42′O', 'madri'], ['Dublin', '53°21′N · 6°15′O', 'dublin'], ['Nova York', '40°42′N · 74°00′O', 'nova-york']];
  var cityImg = {};
  CITY.forEach(function (c) { var im = new Image(); im.onload = function () { cityImg[c[2]] = im.src; if (lastCity >= 0 && CITY[lastCity][2] === c[2]) setCity(lastCity); }; im.src = 'assets/img/cidades/' + c[2] + '.jpg'; });
  function setCity(k) { var c = CITY[k], src = cityImg[c[2]]; $('pcCity').textContent = c[0]; $('pcCoord').textContent = c[1]; pc.classList.toggle('has-img', !!src); pc.style.backgroundImage = src ? 'url(' + src + ')' : ''; }
  var STN = [[38.72, -9.14, 175], [40.42, -3.7, 175], [53.35, -6.26, 175], [40.71, -74.0, 175], [-23.55, -46.63, 200]];
  var cur = 0, t0 = performance.now(), lastCity = -1, mx = 0, my = 0, cardEl = $('card'), cardStage = $('cardStage');
  function frame(now) {
    requestAnimationFrame(frame);
    var t = (now - t0) / 1000, vh = innerHeight, rect = film.getBoundingClientRect();
    var target = cl(-rect.top / Math.max(1, rect.height - vh));
    cur += reduce ? (target - cur) : (target - cur) * 0.085; if (Math.abs(target - cur) < 0.00002) cur = target;
    var p = cur, inView = rect.bottom > -40 && rect.top < vh + 40;
    fab.classList.toggle('on', rect.bottom < vh * 0.5);
    if (inView) {
      bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
      var hz = sm(p / 0.1);
      heroImg.style.transform = 'scale(' + (1.02 + hz * 0.55 + (reduce ? 0 : Math.sin(t * 0.3) * 0.006)).toFixed(4) + ')';
      heroLayer.style.opacity = (1 - sm((p - 0.06) / 0.035)).toFixed(3);
      var ao = Math.min(sm((p - 0.06) / 0.03), 1 - sm((p - 0.215) / 0.025));
      air.style.opacity = ao.toFixed(3);
      var z = sm((p - 0.15) / 0.07), bob = reduce ? 0 : Math.sin(t * 1.2) * 8;
      var sc = lerp(0.92, 5.5, z * z), rx = lerp(10, 0, z), ry = lerp(-24, 0, z), rz = lerp(-6, 0, z), tx = lerp(0, -12, z);
      visaWrap.style.transform = 'translate(-50%,-50%) translate(' + tx.toFixed(1) + '%,' + (bob * (1 - z)).toFixed(1) + 'px) perspective(1400px) rotateX(' + rx.toFixed(2) + 'deg) rotateY(' + ry.toFixed(2) + 'deg) rotateZ(' + rz.toFixed(2) + 'deg) scale(' + sc.toFixed(3) + ')';
      holo.style.backgroundPosition = ((t * 12) % 250 + p * 900).toFixed(1) + '% 0';
      var go = sm((p - 0.195) / 0.035); gl.style.opacity = go.toFixed(3);
      var x = -0.6 + cl((p - 0.40) / 0.60) * 4.8, kNear = Math.max(0, Math.min(4, Math.round(x)));
      if (go > 0 && !threeState) loadThree();
      if (three && go > 0) {
        var st = { t: t, arc: [0, 0, 0, 0], labs: [0, 0, 0, 0, 0], real: 0, ox: 0.18 };
        if (p < 0.40) {
          var g2 = cl((p - 0.20) / 0.20), kk = sm(g2);
          st.lat = lerp(-12, 26, kk); st.lon = lerp(-55, -28, kk) + (reduce ? 0 : Math.sin(t * 0.2) * 2); st.dist = lerp(360, 310, kk);
          st.real = sm((g2 - 0.35) / 0.3);
          for (var a = 0; a < 4; a++) st.arc[a] = cl((g2 - (0.45 + 0.1 * a)) / 0.12);
          st.labs[0] = cl((g2 - 0.1) / 0.1); for (var b = 1; b < 5; b++) st.labs[b] = cl((g2 - (0.45 + 0.1 * (b - 1)) - 0.1) / 0.05);
        } else {
          st.real = 1; st.arc = [1, 1, 1, 1]; st.ox = 0.2; st.ao = 1 - sm((p - 0.40) / 0.03); st.cl = lerp(1, 0.45, sm((p - 0.40) / 0.04));
          var A, B, e, i;
          if (x < 0) { A = [26, -28, 310]; B = STN[0]; e = sm((x + 0.6) / 0.6); }
          else if (x >= 4) { A = STN[4]; B = STN[4]; e = 1; }
          else { i = Math.floor(x); var ff = x - i; e = sm((ff - 0.18) / 0.64); A = STN[i]; B = STN[i + 1]; }
          st.lat = lerp(A[0], B[0], e); st.lon = three.lonShort(A[1], B[1], e);
          st.dist = lerp(A[2], B[2], e) + Math.sin(e * Math.PI) * (x < 0 ? 0 : 150);
          for (var c = 0; c < 5; c++) st.labs[c] = c === (kNear === 4 ? 0 : kNear + 1) ? 1 : 0.35;
        }
        three.render(st);
      } else { for (var q = 0; q < 5; q++) $('l' + q).style.opacity = '0'; }
      var pr = [];
      var intro = reduce ? 1 : cl((t - 0.2) / 1.2);
      pr[0] = Math.min(intro, 1 - cl((p - 0.008) / 0.03));
      pr[1] = cl(Math.min((p - 0.085) / 0.02, (0.15 - p) / 0.015));
      pr[2] = cl(Math.min((p - 0.26) / 0.03, (0.395 - p) / 0.02));
      for (var k = 0; k < 5; k++) pr[3 + k] = p < 0.40 ? 0 : cl(1 - Math.abs(x - k) / 0.3);
      if (p > 0.995) pr[7] = 1;
      for (var j = 0; j < 8; j++) reveal(chaps[j], pr[j], true);
      var dist = Math.abs(x - kNear), ppVis = p < 0.40 ? 0 : cl((p - 0.40) / 0.02), open = p < 0.40 ? 0 : sm(1 - dist / 0.2);
      if (kNear !== lastPP) { lastPP = kNear; drawVisa(ppCanvas, kNear, false); }
      ppWrap.style.opacity = ppVis.toFixed(3);
      pp.style.transform = 'translateX(' + (open * 50).toFixed(2) + '%) translateY(' + (reduce ? 0 : Math.sin(t * 1.3) * 6).toFixed(1) + 'px) rotateX(8deg) rotateY(' + (x * 360).toFixed(1) + 'deg) rotateZ(-3deg)';
      ppCover.style.transform = 'rotateY(' + (-open * 170).toFixed(1) + 'deg)';
      var cardPr = kNear < 4 ? pr[3 + kNear] : 0;
      cityCard.style.opacity = cl(cardPr * 1.6).toFixed(3);
      cityCard.style.transform = 'rotate(' + (-4 + (kNear % 2) * 7) + 'deg) translateY(' + ((1 - cardPr) * 30).toFixed(1) + 'px)';
      if (kNear !== lastCity && kNear < 4) { lastCity = kNear; setCity(kNear); }
      var act = p < 0.40 ? 0 : kNear + 1;
      for (var r = 0; r < 6; r++) $('r' + r).setAttribute('data-on', r === act ? '1' : '0');
    }
    for (var w = 0; w < rws.length; w++) {
      var it = rws[w], rr = it.el.getBoundingClientRect();
      if (rr.top > vh * 1.1 || rr.bottom < -vh * 0.2) continue;
      reveal(it, cl((vh * 0.9 - rr.top) / (vh * 0.4)), false);
    }
    var cs = cardStage.getBoundingClientRect();
    if (cs.top < vh && cs.bottom > 0) {
      var cp = cl((vh - cs.top) / (vh + cs.height));
      var spinY = lerp(-40, 360 + 20, sm(cp)) + mx * 14, tiltX = 10 - my * 10;
      cardEl.style.transform = 'rotateX(' + tiltX.toFixed(2) + 'deg) rotateY(' + spinY.toFixed(1) + 'deg) rotateZ(-3deg)';
    }
  }
  addEventListener('pointermove', function (e) { mx = e.clientX / innerWidth - 0.5; my = e.clientY / innerHeight - 0.5; }, { passive: true });
  requestAnimationFrame(frame);
  $('skipFilm').addEventListener('click', function () { var d = $('destinos'); d.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); d.focus({ preventScroll: true }); });

  /* ---------- abas acessíveis (setas do teclado) ---------- */
  function tabKeys(list, go) {
    list.addEventListener('keydown', function (e) {
      var n = list.children.length, i = Array.prototype.indexOf.call(list.children, document.activeElement);
      if (i < 0) return;
      var to = { ArrowRight: i + 1, ArrowDown: i + 1, ArrowLeft: i - 1, ArrowUp: i - 1, Home: 0, End: n - 1 }[e.key];
      if (to == null) return;
      e.preventDefault(); to = (to + n) % n; go(to); list.children[to].focus();
    });
  }
  function roving(list, k) { Array.prototype.forEach.call(list.children, function (b, i) { b.setAttribute('aria-selected', i === k ? 'true' : 'false'); b.tabIndex = i === k ? 0 : -1; }); }

  /* ---------- destinos: cartões de embarque ---------- */
  var EUA_NOTA = C.parceiroEUA ? 'Em atuação conjunta com ' + C.parceiroEUA + ', licenciado nos EUA.' : 'Quando exigido, a representação perante as autoridades dos EUA é feita por advogado licenciado lá.';
  var D = [
    { code: 'LIS', nome: 'Portugal', band: '#2F6B4F', vistos: [['D1', 'Trabalho subordinado', 'Contrato de trabalho com empresa portuguesa.'], ['D2', 'Empreendedor', 'Negócio próprio ou investimento em Portugal.'], ['D3', 'Alta qualificação', 'Formação superior e oferta de trabalho.'], ['D4', 'Estudo', 'Graduação, mestrado e doutorado.'], ['D7', 'Rendimentos próprios', 'Aposentadoria, aluguéis e outros rendimentos.'], ['D8', 'Nômade digital', 'Trabalho remoto para empresa de fora.']], cid: ['Nacionalidade portuguesa por descendência', 'Reagrupamento familiar'], che: ['NIF e NISS', 'Acompanhamento na AIMA'], nota: '' },
    { code: 'MAD', nome: 'Espanha', band: '#A8322B', vistos: [['NL', 'Residência não lucrativa', 'Para quem vive de renda própria, sem trabalhar lá.'], ['ND', 'Nômade digital', 'Trabalho remoto para empresa fora da Espanha.'], ['PAC', 'Profissional qualificado', 'Oferta de emprego para perfil de alta qualificação.'], ['EST', 'Estudos', 'Graduação, pós e cursos longos.'], ['RF', 'Reagrupamento familiar', 'Cônjuge, filhos e pais de residentes.']], cid: ['Nacionalidade por residência, com 2 anos de residência legal para brasileiros', 'Nacionalidade por descendência'], che: ['NIE e TIE', 'Empadronamiento'], nota: '' },
    { code: 'DUB', nome: 'Irlanda', band: '#1F7A4D', vistos: [['STAMP 2', 'Estudo', 'Inglês ou ensino superior, com trabalho parcial.'], ['CSEP', 'Critical Skills', 'Profissões em falta, com caminho para residência.'], ['GEP', 'General Employment', 'Oferta de emprego em ocupação elegível.'], ['JF', 'Reagrupamento familiar', 'Família de residentes e titulares de permissão.']], cid: ['Cidadania irlandesa por descendência (Foreign Births Register)'], che: ['Registro de imigração (IRP)', 'PPS Number'], nota: '' },
    { code: 'JFK', nome: 'Estados Unidos', band: '#274B8A', vistos: [['F-1', 'Estudante', 'Graduação, pós e cursos em instituição aprovada.'], ['L-1', 'Transferência intracompanhia', 'Executivos e especialistas de empresa com filial nos EUA.'], ['O-1', 'Habilidade extraordinária', 'Reconhecimento comprovado na área.'], ['E-2', 'Investidor por tratado', 'Exige nacionalidade de país com tratado, como Portugal ou Itália.'], ['EB-2 NIW', 'Green card por interesse nacional', 'Profissional qualificado, sem precisar de empregador.'], ['EB-5', 'Green card por investimento', 'Investimento em negócio que gere empregos.']], cid: ['Planejamento de cidadania europeia para quem mira o E-2'], che: ['Orientação nas primeiras providências'], nota: EUA_NOTA }
  ];
  var passes = $('passes'), sel = 0;
  var FAN = [[0, 30, -7], [23, 8, -2], [46, 26, 3], [66, 4, 7]];
  D.forEach(function (d, k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'pass'; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'destPanel');
    b.setAttribute('aria-label', d.nome);
    b.innerHTML = '<i class="band" style="background:' + d.band + '"></i><div class="main" aria-hidden="true"><span class="route2">GRU  ›  ' + d.code + '</span><span class="cty">' + d.nome + '</span><span class="meta"><span>VOO TMS 0' + (k + 1) + '</span><span>PASSAGEIRO: VOCÊ</span></span></div><div class="stub" aria-hidden="true"><span class="code">' + d.code + '</span><span class="barc"></span></div><span class="seal" aria-hidden="true">' + d.code + '</span>';
    b.addEventListener('click', function () { pick(k); });
    passes.appendChild(b);
  });
  function layoutPasses() {
    Array.prototype.forEach.call(passes.children, function (b, k) {
      var f = FAN[k], on = k === sel;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (innerWidth > 760) { b.style.left = f[0] + '%'; b.style.transform = on ? 'translateY(-34px) rotate(0deg) scale(1.05)' : 'translateY(' + f[1] + 'px) rotate(' + f[2] + 'deg)'; b.style.zIndex = on ? 9 : k + 1; }
      else { b.style.left = ''; b.style.transform = ''; b.style.zIndex = ''; }
    });
    roving(passes, sel);
    var d = D[sel];
    $('destPanel').setAttribute('aria-label', 'Vistos para ' + d.nome);
    $('vg').innerHTML = d.vistos.map(function (v) { return '<div><b>' + v[0] + '</b><strong>' + v[1] + '</strong><span>' + v[2] + '</span></div>'; }).join('');
    $('side').innerHTML = '<h3>Cidadania</h3>' + d.cid.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '<h3>Na chegada</h3>' + d.che.map(function (c) { return '<span>' + c + '</span>'; }).join('') + '<a class="btn" href="#formulario" data-dest="' + d.nome + '">Analisar meu caso</a>' + (d.nota ? '<span style="font-size:15px;color:var(--mute)">' + esc(d.nota) + '</span>' : '');
  }
  function pick(k) { sel = k; layoutPasses(); }
  layoutPasses(); addEventListener('resize', layoutPasses);
  tabKeys(passes, pick);
  each('[data-country]', function (a) { a.addEventListener('click', function () { pick(+a.getAttribute('data-country')); }); });
  document.addEventListener('click', function (e) { var a = e.target.closest && e.target.closest('[data-dest]'); if (a) $('fDestino').value = a.getAttribute('data-dest'); });

  /* ---------- perguntas: o livro ---------- */
  var FAQ = [
    ['Quanto tempo leva um visto para Portugal?', 'Depende do tipo de visto e da agenda do consulado. D7 e D8 costumam levar alguns meses entre juntar documentos, agendar e receber a decisão. Na análise inicial estimamos o seu prazo com base no seu caso, sem chute.', 0],
    ['Preciso mesmo de advogado para pedir visto?', 'A lei não obriga. Mas um documento errado ou uma tradução fora do padrão pode custar a negativa e meses de espera. O advogado define a estratégia, revisa tudo antes do protocolo e acompanha até a decisão.', 1],
    ['Tenho direito à cidadania europeia?', 'Depende da sua linha familiar e das regras de cada país, que mudam com frequência. Você manda o que tem de certidões e dizemos com clareza se existe caminho, qual é e o que falta.', 0],
    ['Vocês atendem quem não mora em São Paulo?', 'Sim. O atendimento é 100% remoto para todo o Brasil, com reuniões por vídeo e documentos pelo WhatsApp e e-mail. Se preferir, recebemos você no Edifício Metrópolis, em Alphaville, com hora marcada.', 1],
    ['E se o visto for negado?', 'Primeiro entendemos o motivo da negativa. Depois avaliamos recurso ou um novo pedido corrigido. Nenhum escritório sério promete aprovação. O que garantimos é um pedido bem feito.', 0],
    ['Quanto custa?', 'Depende do destino e do tipo de processo. Depois da análise inicial você recebe uma proposta por escrito, com tudo o que está incluso e o que é taxa do governo.', 1]
  ];
  var binder = $('binder'), fsel = 0, pgL = $('pgL'), pgR = $('pgR'), bk = $('bk');
  FAQ.forEach(function (f, k) {
    var b = document.createElement('button'); b.type = 'button'; b.className = 'btab'; b.setAttribute('role', 'tab'); b.setAttribute('aria-controls', 'bk'); b.textContent = f[0];
    b.addEventListener('click', function () { openFaq(k); }); binder.appendChild(b);
  });
  function leftHTML(k) { var s = SOC[FAQ[k][2]] || SOC[0] || { nome: '', iniciais: '' }; return portrait(s) + '<div class="who">' + esc((s.titulo ? s.titulo + ' ' : '') + s.nome) + '<small>' + esc(sub(s).toUpperCase()) + '</small></div>'; }
  var ROM = ['I', 'II', 'III', 'IV', 'V', 'VI'];
  function rightHTML(k) { return '<span class="num">PERGUNTA ' + ROM[k] + '</span><h3>' + FAQ[k][0] + '</h3><p class="ans">' + FAQ[k][1] + '</p>'; }
  function openFaq(k) {
    if (k === fsel && pgR.innerHTML) return;
    var oldR = pgR.innerHTML;
    roving(binder, k);
    if (oldR && !reduce && innerWidth > 760) {
      var leaf = document.createElement('div'); leaf.className = 'leaf'; leaf.setAttribute('aria-hidden', 'true');
      leaf.innerHTML = '<div class="pg r">' + oldR + '</div><div class="pg l b">' + leftHTML(k) + '</div>';
      bk.appendChild(leaf);
      pgR.innerHTML = rightHTML(k);
      setTimeout(function () { pgL.innerHTML = leftHTML(k); }, 450);
      setTimeout(function () { leaf.remove(); }, 920);
    } else { pgL.innerHTML = leftHTML(k); pgR.innerHTML = rightHTML(k); }
    fsel = k;
  }
  pgL.innerHTML = leftHTML(0); pgR.innerHTML = rightHTML(0);
  roving(binder, 0);
  tabKeys(binder, openFaq);

  /* ---------- menu passaporte (com foco preso dentro do diálogo) ---------- */
  var menu = $('menu'), mb = $('menuBtn');
  function setMenu(o) {
    menu.classList.toggle('open', o); menu.setAttribute('aria-hidden', o ? 'false' : 'true'); mb.setAttribute('aria-expanded', o ? 'true' : 'false');
    each('.minner a', function (a) { a.tabIndex = o ? 0 : -1; });
    if (o) setTimeout(function () { menu.querySelector('.mclose').focus(); }, 60); else if (menu.contains(document.activeElement)) mb.focus();
  }
  mb.addEventListener('click', function () { setMenu(!menu.classList.contains('open')); });
  each('#menu [data-close]', function (e) { e.addEventListener('click', function () { setMenu(false); }); });
  addEventListener('keydown', function (e) {
    if (!menu.classList.contains('open')) return;
    if (e.key === 'Escape') { setMenu(false); return; }
    if (e.key !== 'Tab') return;
    var f = Array.prototype.filter.call(menu.querySelectorAll('a,button'), function (el) { return el.tabIndex >= 0; });
    var first = f[0], last = f[f.length - 1];
    if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });

  /* ---------- formulário de análise ---------- */
  var form = $('leadForm'), msg = $('fMsg');
  function say(t, cls) { msg.textContent = t; msg.className = 'fmsg ' + (cls || ''); }
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
    if (C.formEndpoint) {
      fetch(C.formEndpoint, { method: 'POST', body: fd, headers: { Accept: 'application/json' } }).catch(function () {});
    }
    var url = WA + '?text=' + encodeURIComponent(txt);
    var win = window.open(url, '_blank');
    if (win) win.opener = null; else location.href = url;
    say('Pronto! Abrimos o WhatsApp com a sua mensagem. É só tocar em enviar.', 'ok');
    if (typeof gtag === 'function') gtag('event', 'generate_lead');
  });
})();
