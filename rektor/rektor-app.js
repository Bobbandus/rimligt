/* ==========================================================================
   RIMLIGT — REKTOR & MENTOR
   Samma tabellmönster som kommunappen (tabellOmraden/tabellFormagor från
   delat.js, återanvänt rakt av), men scopat till EN skola och UTAN
   anonymisering — en rektor/mentor har legitimt behov av att se sina egna
   elever vid namn, till skillnad från kommunnivån.
   ========================================================================== */

const app = $('#app');
const MIN_SKOLA = KOMMUN_DEMO.skolor.find(s => s.namn === 'Backagårdsskolan') || KOMMUN_DEMO.skolor[0];

let vaeldLarare = null;
let underflik = 'omraden';

function rita() {
  app.replaceChildren();
  app.append(topprad());
  const sida = el('div', { klass: 'sida bred' });
  sida.append(vaeldLarare ? klassvy(vaeldLarare) : oversikt());
  app.append(sida);
}

function topprad() {
  return el('header', { klass: 'topp' },
    el('div', { klass: 'topp-inner bred' },
      el('a', { klass: 'markesnamn', href: '../personal/', style: 'text-decoration:none' },
        'Rimligt', el('i', {}, '.'), el('span', { style: 'font-weight:400;color:var(--text-3);font-size:.8rem;margin-left:.5rem' }, 'rektor & mentor')),
      el('span', { klass: 'statchip' }, ikon('byggnad', 14), ' ' + MIN_SKOLA.namn)));
}

function oversikt() {
  const alla = MIN_SKOLA.larare.flatMap(l => l.elever);
  const snittOmr = snittPerOmrade(alla);

  const kpiRad = el('div', { klass: 'grid two', style: 'margin-bottom:1rem' },
    el('div', { klass: 'cell' }, el('span', { klass: 'etikett' }, 'Lärare / klasser'), el('h3', { style: 'font-size:1.7rem;margin-top:.2rem' }, String(MIN_SKOLA.larare.length))),
    el('div', { klass: 'cell' }, el('span', { klass: 'etikett' }, 'Elever totalt'), el('h3', { style: 'font-size:1.7rem;margin-top:.2rem' }, String(alla.length))));

  const omrRader = OMRADEN.filter(o => !o.stodsspar).map(o => {
    const v = snittOmr[o.id];
    return el('div', { klass: 'stapel' }, el('span', {}, o.kort),
      el('span', { klass: 'stapel-spar' }, el('span', { klass: 'stapel-fyll', style: `width:${(v / 5) * 100}%` })),
      el('b', {}, `${sv(v, 1)} / 5`));
  });

  const larareTabell = el('table', { klass: 'klass' },
    el('thead', {}, el('tr', {}, el('th', {}, 'Lärare'), el('th', {}, 'Klass'), el('th', {}, 'Ämne'), el('th', {}, 'Elever'), el('th', {}))),
    el('tbody', {}, MIN_SKOLA.larare.map(l => el('tr', {},
      el('td', { klass: 'namn' }, l.namn), el('td', {}, l.klass), el('td', {}, l.amne || 'Matematik'), el('td', {}, String(l.elever.length)),
      el('td', {}, el('button', { klass: 'knapp tyst liten', onclick: () => { vaeldLarare = l; rita(); } }, 'Öppna klass ', ikon('pilHoger', 14)))))));

  return el('div', {},
    el('div', { klass: 'larartopp' }, el('div', {}, el('span', { klass: 'etikett' }, 'Din skola'), el('h1', {}, MIN_SKOLA.namn))),
    el('div', { klass: 'notis' }, el('b', {}, 'Namngiven vy. ' ),
      'Till skillnad från kommunens läge ser du här riktiga elevnamn — men bara för din egen skola.'),
    kpiRad,
    el('div', { klass: 'kort' }, el('span', { klass: 'etikett' }, 'Snitt per område, hela skolan'), el('div', { klass: 'stapelrad', style: 'margin-top:.6rem' }, omrRader)),
    el('div', { klass: 'omradesrubrik' }, el('h2', {}, 'Klasser'), el('span', { klass: 'strec' })),
    el('div', { klass: 'tabellrullare' }, larareTabell));
}

function klassvy(l) {
  const underflikar = el('div', { klass: 'flikar', style: 'margin-top:0' },
    [['omraden', 'Per område'], ['formagor', 'Per förmåga']].map(([id, namn]) =>
      el('button', { klass: 'flik', onclick: () => { underflik = id; rita(); }, style: underflik === id ? '' : 'opacity:.6' }, namn)));

  return el('div', {},
    el('button', { klass: 'knapp tyst liten', style: 'margin-bottom:.9rem', onclick: () => { vaeldLarare = null; rita(); } }, ikon('pilVanster', 14), ' Tillbaka'),
    el('div', { klass: 'larartopp' }, el('div', {}, el('span', { klass: 'etikett' }, `${MIN_SKOLA.namn} · ${l.klass}`), el('h1', {}, l.namn))),
    el('p', { klass: 'hjalptext', style: 'margin-bottom:.8rem' }, 'Klicka på ett elevnamn för att öppna elevprofilen.'),
    underflikar,
    underflik === 'omraden' ? tabellOmraden(l.elever) : tabellFormagor(l.elever));
}

rita();
