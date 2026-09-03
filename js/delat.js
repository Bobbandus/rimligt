/* ==========================================================================
   DELAT — allt som elev-, lärar- och kommunappen delar.
   Ingen av apparna vet något om matematik här; det är ren infrastruktur.
   Ladda ALLTID denna fil efter innehall.js och ikoner.js, före app-specifika filer.
   ========================================================================== */

/* --------------------------------------------------------------- DOM-HJÄLP */
const $  = (sel, rot = document) => rot.querySelector(sel);
const $$ = (sel, rot = document) => [...rot.querySelectorAll(sel)];

function el(tagg, attr = {}, ...barn) {
  const n = document.createElement(tagg);
  for (const [k, v] of Object.entries(attr)) {
    if (v === null || v === undefined || v === false) continue;
    if (k === 'html') n.innerHTML = v;
    else if (k === 'klass') n.className = v;
    else if (k.startsWith('on')) n.addEventListener(k.slice(2), v);
    else n.setAttribute(k, v);
  }
  barn.flat().forEach(b => { if (b != null) n.append(b.nodeType ? b : document.createTextNode(b)); });
  return n;
}

/* Enkel matterendering: ^2 → upphöjt, * → gångertecken. */
function matte(text) {
  return String(text)
    .replace(/\^(-?\d+)/g, (_, e) => '<sup>' + e + '</sup>')
    .replace(/\*/g, '·');
}

/* --------------------------------------------------------------- SVENSK TALFORMATERING */
/* Används varhelst ett BERÄKNAT tal (inte författad text) visas för användaren:
   komma som decimaltecken, mellanslag som tusentalsavgränsare. */
function sv(tal, decimaler = null) {
  if (tal === null || tal === undefined || Number.isNaN(tal)) return '–';
  const n = Number(tal);
  const str = decimaler === null
    ? (Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, '').replace(/\.$/, ''))
    : n.toFixed(decimaler);
  const [heltal, decimal] = str.replace('-', '−').split('.');
  const medMellanslag = heltal.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decimal ? `${medMellanslag},${decimal}` : medMellanslag;
}

/* Icke-brytande mellanslag mellan tal och enhet, t.ex. svMedEnhet(250,'kr') → "250 kr" (nbsp). */
function svMedEnhet(tal, enhet, decimaler = null) {
  return `${sv(tal, decimaler)} ${enhet}`;
}

function normalisera(v) {
  return String(v).toLowerCase().trim()
    .replace(/\s+/g, '')
    .replace(/×/g, '*').replace(/·/g, '*')
    .replace(/−/g, '-').replace(/–/g, '-');
}

function tolkaTal(v) {
  const t = String(v).trim().replace(/\s/g, '').replace(',', '.');
  const n = Number(t);
  return Number.isFinite(n) ? n : NaN;
}

/* --------------------------------------------------------------- LAGRING */
/* Generell localStorage-hjälpare. Varje app skapar sin egen lagring med
   ett eget tomt-state-objekt; elev-appen och lärar/kommun-appen skriver
   till OLIKA nycklar, men om de körs från samma origin (samma server)
   kan de läsa VARANDRAS nyckel för att simulera delad skoldata — se
   SKOLA-lagringen som skapas i respektive app.js. */
function skapaLagring(nyckel, tomtObjekt) {
  function las() {
    try {
      const rå = localStorage.getItem(nyckel);
      if (rå) return Object.assign(structuredClone(tomtObjekt), JSON.parse(rå));
    } catch (e) { /* privat läge, blockerad lagring — kör vidare i minnet */ }
    return structuredClone(tomtObjekt);
  }
  function spara(data) {
    try { localStorage.setItem(nyckel, JSON.stringify(data)); }
    catch (e) { /* strunt samma, appen fungerar ändå denna session */ }
  }
  return { las, spara };
}

function idag() { return new Date().toISOString().slice(0, 10); }

/* --------------------------------------------------------------- LJUD */
/* Rena toner genererade med Web Audio API — inga ljudfiler. Anropande app
   avgör om ljud är påslaget och skickar in det som `aktiverat`. */
let _ljudkontext = null;
function ton(frekvenser, langd = 0.09, aktiverat = true) {
  if (!aktiverat) return;
  try {
    if (!_ljudkontext) _ljudkontext = new (window.AudioContext || window.webkitAudioContext)();
    frekvenser.forEach((f, i) => {
      const o = _ljudkontext.createOscillator();
      const g = _ljudkontext.createGain();
      o.type = 'sine'; o.frequency.value = f;
      const t = _ljudkontext.currentTime + i * langd;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.12, t + 0.012);
      g.gain.exponentialRampToValueAtTime(0.0001, t + langd);
      o.connect(g); g.connect(_ljudkontext.destination);
      o.start(t); o.stop(t + langd + 0.02);
    });
  } catch (e) { /* ljud är en bonus, aldrig ett krav */ }
}

/* --------------------------------------------------------------- TEMA */
function satTema(installningar) {
  const t = installningar.tema;
  if (t === 'auto') document.documentElement.removeAttribute('data-tema');
  else document.documentElement.setAttribute('data-tema', t);
}

/* --------------------------------------------------------------- MODAL/ARK */
function visaArk(innehall) {
  stangArk();
  const overlagg = el('div', {
    klass: 'overlagg', id: 'overlagg', role: 'dialog', 'aria-modal': 'true',
    onclick: e => { if (e.target.id === 'overlagg') stangArk(); }
  }, el('div', { klass: 'ark' }, innehall));
  document.body.append(overlagg);
  document.addEventListener('keydown', _arkEsc);
  const f = overlagg.querySelector('button, input, textarea');
  if (f) f.focus();
}
function _arkEsc(e) { if (e.key === 'Escape') stangArk(); }
function stangArk() {
  const o = $('#overlagg');
  if (o) o.remove();
  document.removeEventListener('keydown', _arkEsc);
}

/* --------------------------------------------------------------- DELADE TABELLER */
/* Används av både lärar- och kommunappen. `elever` har formen
   { namn, niv:{omradeId:0-5}, form:{P,B,M,R,K procent}, senast, jag? }.
   Kräver att OMRADEN och FORMAGOR (från innehall.js) redan är laddade. */
function nivKlass(n) { return `niv n${n}`; }

function tabellOmraden(elever) {
  const tabell = el('table', { klass: 'klass' },
    el('thead', {}, el('tr', {},
      el('th', {}, 'Elev'),
      OMRADEN.map(o => el('th', {}, o.kort)),
      el('th', {}, 'Senast aktiv'))),
    el('tbody', {}, elever.map(e => el('tr', { klass: e.jag ? 'jag' : '' },
      el('td', { klass: 'namn' },
        el('button', { klass: 'knapp tyst liten', style: 'padding:.2rem .5rem', onclick: () => visaElevprofil(e, { historik: e.historik }) }, e.namn)),
      OMRADEN.map(o => el('td', {},
        el('span', { klass: nivKlass(e.niv[o.id] ?? 0), title: `Nivå ${e.niv[o.id] ?? 0} av 5` },
          String(e.niv[o.id] ?? 0)))),
      el('td', { klass: 'senast' }, e.senast)
    ))));

  return el('div', {},
    el('div', { klass: 'tabellrullare' }, tabell),
    el('p', { klass: 'hjalptext', style: 'margin-top:.7rem' },
      'Siffran är nivå 0–5 per område. Rött = under 3, gult = 3, grönt = 4–5.'));
}

function tabellFormagor(elever) {
  const koder = ['P', 'B', 'M', 'R', 'K'];
  const tabell = el('table', { klass: 'klass' },
    el('thead', {}, el('tr', {},
      el('th', {}, 'Elev'),
      koder.map(k => el('th', { title: FORMAGOR[k].namn }, `${k} · ${FORMAGOR[k].namn}`)))),
    el('tbody', {}, elever.map(e => el('tr', { klass: e.jag ? 'jag' : '' },
      el('td', { klass: 'namn' },
        el('button', { klass: 'knapp tyst liten', style: 'padding:.2rem .5rem', onclick: () => visaElevprofil(e, { historik: e.historik }) }, e.namn)),
      koder.map(k => {
        const v = e.form[k] ?? 0;
        const n = v >= 75 ? 5 : v >= 55 ? 4 : v >= 40 ? 3 : v >= 20 ? 2 : v > 0 ? 1 : 0;
        return el('td', {}, el('span', { klass: nivKlass(n) }, `${v}%`));
      })
    ))));

  return el('div', {},
    el('div', { klass: 'tabellrullare' }, tabell),
    el('div', { klass: 'kort', style: 'margin-top:.8rem' },
      el('span', { klass: 'etikett' }, 'Vad kolumnerna betyder'),
      el('ul', { style: 'margin:.5rem 0 0;padding-left:1.15rem;font-size:.88rem;color:var(--text-2)' },
        koder.map(k => el('li', {}, el('b', {}, `${k} — ${FORMAGOR[k].namn}: `), FORMAGOR[k].text)))));
}

/* --------------------------------------------------------------- ELEVPROFIL */
/* Delad av lärar- och rektorappen. `elev` har formen {namn, niv:{omradeId:0-5},
   form:{P,B,M,R,K procent}}. `opts.historik` (frivilligt) är en array av försök i
   samma form som elevappens S.historik — bara tillgänglig för "Du" i lärarens egen
   webbläsare, eftersom demoelever inte har någon riktig historik. */
function visaElevprofil(elev, opts = {}) {
  const koder = ['P', 'B', 'M', 'R', 'K'];
  const ringar = OMRADEN.filter(o => !o.stodsspar).map(o => {
    const n = elev.niv[o.id] ?? 0;
    return el('div', { style: 'display:flex;flex-direction:column;align-items:center;gap:.35rem' },
      el('span', { klass: 'ring', style: `--p:${n * 20}` }, el('b', {}, `${n}/5`)),
      el('small', { style: 'font-size:.74rem;color:var(--text-3);text-align:center' }, o.kort));
  });
  const staplar = koder.map(k => {
    const pct = elev.form[k] ?? 0;
    return el('div', { klass: 'formagestapel' },
      el('span', { klass: 'kod' }, k), el('span', { klass: 'namn' }, FORMAGOR[k].namn),
      el('span', { klass: 'varde' }, `${pct}%`),
      el('span', { klass: 'stapel-spar', style: 'grid-column:1/-1;margin-top:-.2rem' }, el('span', { klass: 'stapel-fyll', style: `width:${pct}%` })));
  });

  let historikBlock;
  if (opts.historik && opts.historik.length) {
    const senaste = [...opts.historik].reverse().slice(0, 8);
    historikBlock = el('div', { klass: 'facit' }, senaste.map(h => el('div', { klass: 'facitrad' + (h.ratt ? ' ok' : '') },
      el('b', {}, `${h.ratt ? '✓' : '✗'} ${h.fraga.slice(0, 60)}${h.fraga.length > 60 ? '…' : ''}`),
      el('small', {}, `försök ${h.forsokNr} · ${h.datum}`))));
  } else {
    historikBlock = el('p', { klass: 'tomtext', style: 'padding:1rem' }, 'Ingen historik tillgänglig för den här demoeleven.');
  }

  visaArk(el('div', {},
    el('span', { klass: 'etikett' }, 'Elevprofil'),
    el('h2', {}, elev.namn),
    el('div', { style: 'display:flex;gap:1.1rem;flex-wrap:wrap;margin:1rem 0' }, ringar),
    el('div', { klass: 'kort', style: 'margin-bottom:1rem' },
      el('span', { klass: 'etikett' }, 'Förmågor'), el('div', { style: 'margin-top:.5rem' }, staplar)),
    el('span', { klass: 'etikett' }, 'Senaste försöken'),
    el('div', { style: 'margin-top:.5rem' }, historikBlock)
  ));
}

/* --------------------------------------------------------------- VISUALISERINGAR */
/* Riktiga grafiker istället för text som "1/2". Rena SVG-noder, temafärgade
   via currentColor + CSS-variabler så de fungerar i både ljust och mörkt läge. */

/* Bråkstapel: en rektangel delad i `namnare` lika stora fält, `taljare` ifyllda. */
function ritaBrak(taljare, namnare, bredd = 260, hojd = 64) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', `0 0 ${bredd} ${hojd}`);
  svg.setAttribute('class', 'visual-brak');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `${taljare} av ${namnare} delar ifyllda`);

  const ns = 'http://www.w3.org/2000/svg';
  const ram = document.createElementNS(ns, 'rect');
  ram.setAttribute('x', 1); ram.setAttribute('y', 1);
  ram.setAttribute('width', bredd - 2); ram.setAttribute('height', hojd - 2);
  ram.setAttribute('rx', 8);
  ram.setAttribute('fill', 'none'); ram.setAttribute('stroke', 'currentColor'); ram.setAttribute('stroke-width', 2);
  svg.append(ram);

  const fältBredd = (bredd - 2) / namnare;
  for (let i = 0; i < namnare; i++) {
    if (i < taljare) {
      const fyll = document.createElementNS(ns, 'rect');
      fyll.setAttribute('x', 1 + i * fältBredd + 1.5);
      fyll.setAttribute('y', 3);
      fyll.setAttribute('width', Math.max(0, fältBredd - 3));
      fyll.setAttribute('height', hojd - 6);
      fyll.setAttribute('class', 'visual-brak-fyll');
      svg.append(fyll);
    }
    if (i > 0) {
      const linje = document.createElementNS(ns, 'line');
      linje.setAttribute('x1', 1 + i * fältBredd); linje.setAttribute('x2', 1 + i * fältBredd);
      linje.setAttribute('y1', 1); linje.setAttribute('y2', hojd - 1);
      linje.setAttribute('stroke', 'currentColor'); linje.setAttribute('stroke-width', 1.5);
      linje.setAttribute('opacity', '0.5');
      svg.append(linje);
    }
  }
  return svg;
}

/* Tallinje med en markerad punkt (eller ett intervall). */
function ritaTallinje(fran, till, punkt, bredd = 300, hojd = 70) {
  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.setAttribute('viewBox', `0 0 ${bredd} ${hojd}`);
  svg.setAttribute('class', 'visual-tallinje');
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', `Tallinje från ${fran} till ${till}, markerat vid ${punkt}`);

  const pad = 20;
  const linjeY = hojd / 2 + 6;
  const skala = v => pad + ((v - fran) / (till - fran)) * (bredd - pad * 2);

  const linje = document.createElementNS(ns, 'line');
  linje.setAttribute('x1', pad); linje.setAttribute('x2', bredd - pad);
  linje.setAttribute('y1', linjeY); linje.setAttribute('y2', linjeY);
  linje.setAttribute('stroke', 'currentColor'); linje.setAttribute('stroke-width', 2);
  svg.append(linje);

  const antalMarkeringar = Math.min(11, till - fran + 1);
  const steg = (till - fran) / (antalMarkeringar - 1);
  for (let i = 0; i < antalMarkeringar; i++) {
    const v = fran + i * steg;
    const x = skala(v);
    const tick = document.createElementNS(ns, 'line');
    tick.setAttribute('x1', x); tick.setAttribute('x2', x);
    tick.setAttribute('y1', linjeY - 6); tick.setAttribute('y2', linjeY + 6);
    tick.setAttribute('stroke', 'currentColor'); tick.setAttribute('stroke-width', 1.5);
    tick.setAttribute('opacity', '0.55');
    svg.append(tick);
    const txt = document.createElementNS(ns, 'text');
    txt.setAttribute('x', x); txt.setAttribute('y', linjeY + 24);
    txt.setAttribute('text-anchor', 'middle');
    txt.setAttribute('class', 'visual-tallinje-siffra');
    txt.textContent = sv(Math.round(v * 100) / 100);
    svg.append(txt);
  }

  const px = skala(punkt);
  const prick = document.createElementNS(ns, 'circle');
  prick.setAttribute('cx', px); prick.setAttribute('cy', linjeY);
  prick.setAttribute('r', 7);
  prick.setAttribute('class', 'visual-tallinje-punkt');
  svg.append(prick);

  return svg;
}
