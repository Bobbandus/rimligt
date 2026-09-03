/* ==========================================================================
   RIMLIGT — KOMMUNAPPEN
   Aggregerat läge ovanför lärarnivån. Visar ALDRIG elevnamn — bara snitt
   per lärare/skola, och vid nedborrning anonymiserade rader ("Elev 1",
   "Elev 2" …). Återanvänder tabellOmraden()/tabellFormagor() från delat.js
   rakt av genom att anonymisera eleverna innan de skickas in.
   ========================================================================== */

const app = $('#app');
let flik = 'oversikt';
let vaeldLarare = null;   // {skola, larare, klass, elever} — satt vid nedborrning

function gå(f) { flik = f; vaeldLarare = null; rita(); }
function borraNer(rad) { vaeldLarare = rad; rita(); }

function rita() {
  app.replaceChildren();
  app.append(topprad());
  const sida = el('div', { klass: 'sida bred' });
  if (!vaeldLarare) {
    sida.append(flikar());
    sida.append(flik === 'oversikt' ? oversiktsvy() : skolorvy());
  } else {
    sida.append(drillIn(vaeldLarare));
  }
  app.append(sida);
}

function topprad() {
  return el('header', { klass: 'topp' },
    el('div', { klass: 'topp-inner bred' },
      el('a', { klass: 'markesnamn', href: '../', style: 'text-decoration:none' },
        'Rimligt', el('i', {}, '.'), el('span', { style: 'font-weight:400;color:var(--text-3);font-size:.8rem;margin-left:.5rem' }, 'kommun')),
      el('span', { klass: 'statchip' }, ikon('byggnad', 14), ' ' + KOMMUN_DEMO.namn)));
}
function flikar() {
  return el('div', { klass: 'flikar', role: 'tablist' },
    [['oversikt', 'stapel', 'Översikt'], ['skolor', 'byggnad', 'Skolor & lärare']].map(([id, ik, namn]) =>
      el('button', { klass: 'flik', role: 'tab', 'aria-selected': flik === id ? 'true' : 'false', onclick: () => gå(id) }, ikon(ik, 15), ' ' + namn)));
}

/* ============================================================ ÖVERSIKT */
function oversiktsvy() {
  const klasser = allaKlasser();
  const allaElever = klasser.flatMap(k => k.elever);
  const antalSkolor = KOMMUN_DEMO.skolor.length;
  const antalLarare = klasser.length;

  const snittOmr = snittPerOmrade(allaElever);
  const snittForm = snittPerFormaga(allaElever);

  const omrRader = OMRADEN.filter(o => !o.stodsspar).map(o => {
    const v = snittOmr[o.id];
    return el('div', { klass: 'stapel' }, el('span', {}, o.kort),
      el('span', { klass: 'stapel-spar' }, el('span', { klass: 'stapel-fyll', style: `width:${(v / 5) * 100}%` })),
      el('b', {}, `${sv(v, 1)} / 5`));
  });
  const formRader = ['P', 'B', 'M', 'R', 'K'].map(k => el('div', { klass: 'stapel' }, el('span', {}, FORMAGOR[k].namn),
    el('span', { klass: 'stapel-spar' }, el('span', { klass: 'stapel-fyll', style: `width:${snittForm[k]}%` })), el('b', {}, `${snittForm[k]}%`)));

  return el('div', {},
    el('div', { klass: 'larartopp' }, el('div', {}, el('span', { klass: 'etikett' }, 'Hela kommunen'), el('h1', {}, KOMMUN_DEMO.namn))),
    el('div', { klass: 'notis' }, el('b', {}, 'Ingen elevdata visas här. '),
      'Kommunvyn visar bara snitt per lärare och skola. Vill du se enskilda elevers nivå finns det under "Skolor & lärare" — anonymiserat, aldrig med namn.'),
    el('div', { klass: 'grid two', style: 'margin-bottom:1rem' },
      el('div', { klass: 'cell' }, el('span', { klass: 'etikett' }, 'Skolor'), el('h3', { style: 'font-size:1.7rem;margin-top:.2rem' }, String(antalSkolor))),
      el('div', { klass: 'cell' }, el('span', { klass: 'etikett' }, 'Lärare / klasser'), el('h3', { style: 'font-size:1.7rem;margin-top:.2rem' }, String(antalLarare))),
      el('div', { klass: 'cell' }, el('span', { klass: 'etikett' }, 'Elever totalt'), el('h3', { style: 'font-size:1.7rem;margin-top:.2rem' }, String(allaElever.length)))),
    el('div', { klass: 'kort' }, el('span', { klass: 'etikett' }, 'Snitt per område (nivå 0–5)'), el('div', { klass: 'stapelrad', style: 'margin-top:.6rem' }, omrRader)),
    el('div', { klass: 'kort', style: 'margin-top:.7rem' }, el('span', { klass: 'etikett' }, 'Snitt per förmåga'), el('div', { klass: 'stapelrad', style: 'margin-top:.6rem' }, formRader)));
}

/* ====================================================== SKOLOR & LÄRARE */
function skolorvy() {
  const rader = allaKlasser().map(k => {
    const snittOmr = snittPerOmrade(k.elever);
    const helhet = Object.values(snittOmr).reduce((a, b) => a + b, 0) / Object.values(snittOmr).length;
    return { ...k, helhet };
  });

  const tabell = el('table', { klass: 'klass' },
    el('thead', {}, el('tr', {}, el('th', {}, 'Skola'), el('th', {}, 'Lärare'), el('th', {}, 'Klass'), el('th', {}, 'Elever'), el('th', {}, 'Snitt (0–5)'), el('th', {}))),
    el('tbody', {}, rader.map(r => el('tr', {},
      el('td', {}, r.skola), el('td', { klass: 'namn' }, r.larare), el('td', {}, r.klass), el('td', {}, String(r.elever.length)),
      el('td', {}, el('span', { klass: nivKlass(Math.round(r.helhet)) }, sv(r.helhet, 1))),
      el('td', {}, el('button', { klass: 'knapp tyst liten', onclick: () => borraNer(r) }, 'Öppna ', ikon('pilHoger', 14)))
    ))));

  return el('div', {},
    el('div', { klass: 'larartopp' }, el('h1', {}, 'Skolor & lärare')),
    el('div', { klass: 'tabellrullare' }, tabell),
    el('p', { klass: 'hjalptext', style: 'margin-top:.7rem' }, 'Klicka på en rad för att se den klassens siffror per område och förmåga — elever visas som "Elev 1", "Elev 2" …, aldrig med namn.'));
}

/* ==================================================================== DRILL-IN */
let drillUnderflik = 'omraden';
function anonymisera(elever) { return elever.map((e, i) => ({ ...e, namn: `Elev ${i + 1}` })); }

function drillIn(rad) {
  const anonyma = anonymisera(rad.elever);
  const underflikar = el('div', { klass: 'flikar', style: 'margin-top:0' },
    [['omraden', 'Per område'], ['formagor', 'Per förmåga']].map(([id, namn]) =>
      el('button', { klass: 'flik', onclick: () => { drillUnderflik = id; rita(); }, style: drillUnderflik === id ? '' : 'opacity:.6' }, namn)));

  return el('div', {},
    el('button', { klass: 'knapp tyst liten', style: 'margin-bottom:.9rem', onclick: () => { vaeldLarare = null; rita(); } }, ikon('pilVanster', 14), ' Tillbaka'),
    el('div', { klass: 'larartopp' },
      el('div', {}, el('span', { klass: 'etikett' }, `${rad.skola} · ${rad.klass}`), el('h1', {}, rad.larare))),
    el('div', { klass: 'notis' }, el('b', {}, 'Anonymiserat. '), 'Elevernas riktiga namn visas aldrig i kommunvyn.'),
    underflikar,
    drillUnderflik === 'omraden' ? tabellOmraden(anonyma) : tabellFormagor(anonyma));
}

/* ================================================================ START */
rita();
