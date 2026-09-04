/* ==========================================================================
   RIMLIGT — ELEVAPPEN
   Bygger på delat.js (DOM-hjälp, lagring, ljud, formatering, visualiseringar)
   och innehall.js (läromedelsträdet). Vet ingenting om lärar- eller
   kommunvyerna — de körs som helt separata appar.
   ========================================================================== */

/* ---------------------------------------------------------------- STATE */
const TOMT_ELEVSTATE = {
  version: 1,
  xp: 0,
  streak: { dagar: 0, sistaDag: null, frysningar: 2 },
  veckomal: 5,
  dagarKlara: [],
  fardigheter: {},
  formagor: { P: 0, B: 0, M: 0, R: 0, K: 0 },
  provresultat: [],
  historik: [],
  settPinnade: [],
  provKlara: [],
  installningar: { ljud: true, animationer: true, tema: 'auto' }
};
const ELEVLAGRING = skapaLagring('rimligt.elev.v1', TOMT_ELEVSTATE);
let S = ELEVLAGRING.las();
function sparaState() { ELEVLAGRING.spara(S); }

/* Skoldata delad med lärarappen (samma origin/server → samma localStorage).
   Elevappen läser den här, men skriver aldrig till den. */
const TOM_SKOLA = { pinnadeUppgifter: [], publiceradeProv: [] };
const SKOLALAGRING = skapaLagring('rimligt.skola.v1', TOM_SKOLA);
function lasSkola() { return SKOLALAGRING.las(); }

function fState(id) {
  if (!S.fardigheter[id]) S.fardigheter[id] = { gjorda: [], niva: 0 };
  return S.fardigheter[id];
}
function niva(fardighet) {
  const st = fState(fardighet.id);
  const andel = st.gjorda.length / fardighet.uppgifter.length;
  return Math.min(5, Math.round(andel * 5));
}
const XP_FOR = { E: 10, C: 20, A: 35 };
/* Ljudpalett — bara syntetiserade toner, inga filer. Varje "stund som betyder
   något" får sin egen igenkännbara lilla melodi, istället för klickljud på
   varenda knapp (som sliter ut sig snabbt och stör mer än det belönar). */
const ljudRatt         = () => ton([660, 880], 0.08, S.installningar.ljud);
const ljudFel          = () => ton([220], 0.16, S.installningar.ljud);
const ljudNiva         = () => ton([523, 659, 784, 1047, 1319], 0.1, S.installningar.ljud);         // nivå upp — femtonigt uppåt
const ljudStreak       = () => ton([880, 698, 880, 1109], 0.075, S.installningar.ljud);              // streak-dag — pigg liten stig
const ljudProvKlart    = () => ton([784, 988], 0.11, S.installningar.ljud);                          // prov publicerat/upplåst
const ljudPinnad       = () => ton([932, 1245], 0.07, S.installningar.ljud);                         // pinnad uppgift dyker upp
const ljudPassKlart    = () => ton([523, 659, 784, 1047, 1319, 1568], 0.085, S.installningar.ljud);  // helt pass — rikare arpeggio
const ljudSkickat      = () => ton([740], 0.06, S.installningar.ljud);
const ljudSvarMottaget = () => ton([587, 880], 0.08, S.installningar.ljud);

const BEROM = ['Rimligt. 🔥', 'Där satt den.', 'Du kokar.', 'Snyggt.', 'Exakt så.', 'Ren teknik.'];
const TROST  = ['Nja. Kolla en gång till.', 'Nära — men inte riktigt.', 'Inte den här gången.', 'Testa igen.'];
const slump = arr => arr[Math.floor(Math.random() * arr.length)];

function registreraDag() {
  const d = idag();
  if (S.dagarKlara.includes(d)) return false;
  S.dagarKlara.push(d);
  const igår = new Date(Date.now() - 864e5).toISOString().slice(0, 10);
  if (S.streak.sistaDag === igår || S.streak.sistaDag === null) S.streak.dagar++;
  else if (S.streak.sistaDag !== d) S.streak.dagar = 1;
  S.streak.sistaDag = d;
  sparaState();
  return true;
}

/* ============================================================== ROUTER */
const app = $('#app');
function gå(hash) { location.hash = hash; }

function router() {
  const h = location.hash.replace(/^#\/?/, '') || '';
  const del = h.split('/').filter(Boolean);
  document.body.classList.remove('provlage');
  window.scrollTo(0, 0);

  if (del.length === 0)              return visaKarta();
  if (del[0] === 'lar'   && del[1])  return visaLektion(del[1]);
  if (del[0] === 'trana' && del[1])  return visaTraning(del[1]);
  if (del[0] === 'ovning' && del[1]) return visaOvningspass(del[1]);
  if (del[0] === 'prov'  && del[1])  return visaProv(del[1]);
  if (del[0] === 'prov')             return visaProvlista();
  if (del[0] === 'framsteg')         return visaFramsteg();
  if (del[0] === 'historik')         return visaHistorik();
  if (del[0] === 'installningar')    return visaSocialt('installningar');   // alias, gammal länk
  if (del[0] === 'socialt')          return visaSocialt(del[1] || 'chatt');
  return visaKarta();
}
window.addEventListener('hashchange', router);

/* ============================================================ SKAL/NAV */
function skal(innehall, { navFlik = 'karta' } = {}) {
  app.replaceChildren();
  const topp = toppraden();
  app.append(topp);
  const sida = el('div', { klass: 'sida' });
  sida.append(...[innehall].flat());
  app.append(sida);
  app.append(bottennav(navFlik));
  /* .ovningstopp (i lektion/träning) sticky:ar under den här headern istället för
     att överlappa den — se buggen med "hoppande" sida vid scroll. */
  requestAnimationFrame(() => {
    document.documentElement.style.setProperty('--topp-h', topp.offsetHeight + 'px');
  });
}

function toppraden() {
  return el('header', { klass: 'topp' },
    el('div', { klass: 'topp-inner' },
      el('a', { klass: 'markesnamn', href: '#/' }, 'Rimligt', el('i', {}, '.')),
      el('span', { klass: 'statchip streak', title: 'Dagar i rad' }, ikon('eld', 15), String(S.streak.dagar)),
      el('span', { klass: 'statchip xp', title: 'Total XP' }, String(S.xp), ' xp')
    )
  );
}

const NAV = [
  { id: 'karta',    hash: '#/',         namn: 'Karta',    ikon: 'karta' },
  { id: 'prov',     hash: '#/prov',     namn: 'Prov',     ikon: 'penna' },
  { id: 'framsteg', hash: '#/framsteg', namn: 'Framsteg', ikon: 'stapel' },
  { id: 'socialt',  hash: '#/socialt',  namn: 'Socialt',  ikon: 'chatt' }
];
function bottennav(aktiv) {
  return el('nav', { klass: 'botten', 'aria-label': 'Huvudmeny' },
    el('div', { klass: 'botten-inner' },
      NAV.map(n => el('button', {
        klass: 'navknapp', 'aria-current': n.id === aktiv ? 'page' : null, onclick: () => gå(n.hash)
      }, ikon(n.ikon, 21), n.namn))
    )
  );
}

/* ============================================================== KARTAN */
let kartaFilter = 'alla';   // 'alla' | 7 | 8 | 9 | 'repetition'
let expanderadeOmraden = null;   // Set av omr.id — lazy-initieras i visaKarta()
const KARTA_FILTER = [
  { id: 'alla', namn: 'Alla' },
  { id: 7, namn: 'Åk 7' },
  { id: 8, namn: 'Åk 8' },
  { id: 9, namn: 'Åk 9' },
  { id: 'repetition', namn: 'Extra repetition' }
];
function matcharFilter(f) {
  if (kartaFilter === 'alla') return true;
  if (kartaFilter === 'repetition') { const st = fState(f.id); return st.gjorda.length > 0 && niva(f) < 5; }
  return f.arskurs === kartaFilter;
}

function visaKarta() {
  const delar = [];
  const klarIdag = S.dagarKlara.includes(idag());
  delar.push(el('div', { klass: 'karta-topp' },
    el('h1', { klass: 'halsning' }, klarIdag ? 'Dagens mål klart 🎉' : 'Nu kör vi.'),
    el('p', { klass: 'halsning-under' },
      klarIdag ? 'Allt härifrån är extra repetition.' : 'Fyra minuter räcker för att hålla streaken.')
  ));

  const veckansDagar = senasteSjuDagar().filter(d => S.dagarKlara.includes(d)).length;
  const procent = Math.min(100, (veckansDagar / S.veckomal) * 100);
  delar.push(el('div', { klass: 'malrad' },
    el('div', { klass: 'malring', style: `--p:${procent}` }, el('span', {}, `${veckansDagar}/${S.veckomal}`)),
    el('div', { klass: 'malrad-text' },
      el('b', {}, 'Veckomål'),
      el('small', {}, veckansDagar >= S.veckomal ? 'Klart för den här veckan.' : `${S.veckomal - veckansDagar} dagar kvar den här veckan.`)),
    el('button', { klass: 'knapp tyst liten', onclick: byggMalvaljare }, 'Ändra')
  ));

  const uppdrag = el('div', { klass: 'uppdrag' });
  const nasta = nastaFardighet();
  if (nasta) {
    const st = fState(nasta.id);
    const kvar = nasta.uppgifter.length - st.gjorda.length;
    uppdrag.append(el('button', { klass: 'uppdragskort primar', onclick: () => oppnaArk(nasta.id) },
      el('span', { klass: 'uk-ikon' }, ikon(st.gjorda.length ? 'blixt' : 'gnistra', 19)),
      el('span', { klass: 'uk-txt' },
        el('b', {}, st.gjorda.length ? `Fortsätt: ${nasta.namn}` : `Börja: ${nasta.namn}`),
        el('span', { klass: 'uk-under' }, kvar > 0 ? `${kvar} uppgifter kvar` : 'Repetera')),
      ikon('pilHoger', 18)
    ));
  }
  const rep = fardighetAttRepetera();
  if (rep) {
    uppdrag.append(el('button', { klass: 'uppdragskort', onclick: () => gå(`#/trana/${rep.id}`) },
      el('span', { klass: 'uk-ikon' }, ikon('upprepa', 19)),
      el('span', { klass: 'uk-txt' },
        el('b', {}, `Repetera: ${rep.namn}`),
        el('span', { klass: 'uk-under' }, 'Börjar blekna — ta en snabb runda')),
      ikon('pilHoger', 18)
    ));
  }

  /* Pinnade uppgifter och publicerade prov från läraren — delat state */
  const skola = lasSkola();
  const pinnade = (skola.pinnadeUppgifter || []).filter(p => p.aktiv);
  const nyaPinnade = pinnade.filter(p => !S.settPinnade.includes(p.id));
  if (nyaPinnade.length) {
    ljudPinnad();
    S.settPinnade.push(...nyaPinnade.map(p => p.id));
    sparaState();
  }
  pinnade.forEach(p => uppdrag.append(el('button', {
    klass: 'uppdragskort', onclick: () => visaPinnadUppgift(p)
  },
    el('span', { klass: 'uk-ikon' }, ikon('nal', 18)),
    el('span', { klass: 'uk-txt' },
      el('b', {}, `Från din lärare: ${p.titel || 'Ny uppgift'}`),
      el('span', { klass: 'uk-under' }, 'Pinnad · tryck för att öppna')),
    ikon('pilHoger', 18)
  )));
  const aktivaProv = (skola.publiceradeProv || []).filter(p => p.aktiv);
  if (aktivaProv.length) {
    uppdrag.append(el('button', { klass: 'uppdragskort', onclick: () => gå('#/prov') },
      el('span', { klass: 'uk-ikon' }, ikon('mal', 19)),
      el('span', { klass: 'uk-txt' },
        el('b', {}, aktivaProv.length === 1 ? `Aktivt prov: ${aktivaProv[0].namn}` : `${aktivaProv.length} aktiva prov`),
        el('span', { klass: 'uk-under' }, 'Från din lärare · se Prov-fliken')),
      ikon('pilHoger', 18)
    ));
  }
  delar.push(uppdrag);

  delar.push(el('div', { klass: 'filterrad' },
    KARTA_FILTER.map(fl => el('button', {
      klass: 'knapp liten' + (kartaFilter === fl.id ? '' : ' tyst'),
      onclick: () => { kartaFilter = fl.id; visaKarta(); }
    }, fl.namn))));

  if (!expanderadeOmraden) {
    const startOmr = nastaFardighet() ? OMRADEN.find(o => o.fardigheter.some(f => f.id === nastaFardighet().id)) : null;
    expanderadeOmraden = new Set(startOmr ? [startOmr.id] : []);
  }

  let visadeOmraden = 0;
  OMRADEN.forEach(omr => {
    const fardigheterHar = omr.fardigheter.filter(matcharFilter);
    if (!fardigheterHar.length) return;
    visadeOmraden++;
    const klaraIOmr = fardigheterHar.filter(f => niva(f) === 5).length;
    const oppen = expanderadeOmraden.has(omr.id);
    delar.push(el('button', {
      klass: 'omradesrubrik omradesrubrik-knapp', 'aria-expanded': String(oppen),
      onclick: () => { oppen ? expanderadeOmraden.delete(omr.id) : expanderadeOmraden.add(omr.id); visaKarta(); }
    },
      ikon('pilHoger', 15, 'omr-chevron' + (oppen ? ' oppen' : '')),
      el('h2', {}, omr.namn),
      el('span', { klass: 'etikett', style: 'margin-left:.3rem' }, `${klaraIOmr}/${fardigheterHar.length}`),
      el('span', { klass: 'strec' }),
      omr.stodsspar ? el('span', { klass: 'etikett' }, 'stöd') : null));
    if (!oppen) return;
    const stig = el('div', { klass: 'stig' });
    fardigheterHar.forEach(f => {
      const n = niva(f);
      const formagorIF = [...new Set(f.uppgifter.flatMap(u => u.formagor))];
      stig.append(el('button', { klass: 'nod' + (n === 5 ? ' klar' : ''), onclick: () => oppnaArk(f.id) },
        el('span', { klass: 'ring', style: `--p:${n * 20}` },
          n === 5 ? ikon('bock', 16) : el('b', {}, `${n}/5`)),
        el('span', { klass: 'nod-txt' },
          el('b', {}, f.namn), el('small', {}, f.beskrivning),
          el('span', { klass: 'nod-fm' }, formagorIF.map(k => el('span', { klass: 'fm-chip', title: FORMAGOR[k].namn }, k))))
      ));
    });
    delar.push(stig);
  });
  if (!visadeOmraden) {
    delar.push(el('p', { klass: 'tomtext' },
      kartaFilter === 'repetition' ? 'Inget att repetera än — börja en färdighet så dyker den upp här när den börjar blekna.'
                                    : 'Inget i den här årskursen än.'));
  }

  skal(delar, { navFlik: 'karta' });
}

function senasteSjuDagar() {
  return Array.from({ length: 7 }, (_, i) => new Date(Date.now() - i * 864e5).toISOString().slice(0, 10));
}
function nastaFardighet() {
  const alla = allaFardigheter().filter(f => !OMRADEN.find(o => o.id === f.omradeId)?.stodsspar);
  return alla.find(f => fState(f.id).gjorda.length < f.uppgifter.length) || alla[0];
}
function fardighetAttRepetera() {
  return allaFardigheter().find(f => {
    const st = fState(f.id);
    return st.gjorda.length > 0 && st.gjorda.length < f.uppgifter.length && niva(f) >= 2;
  });
}
function byggMalvaljare() {
  const val = [3, 5, 7];
  visaArk(el('div', {},
    el('span', { klass: 'etikett' }, 'Veckomål'),
    el('h2', {}, 'Hur många dagar i veckan?'),
    el('p', { style: 'color:var(--text-2);font-size:.92rem' },
      'Målet mäts i dagar då du klarat minst tre nya uppgifter. Du kan sänka det när du vill — inget straff.'),
    el('div', { klass: 'ark-knappar' },
      val.map(v => el('button', {
        klass: 'knapp' + (v === S.veckomal ? '' : ' tyst'),
        onclick: () => { S.veckomal = v; sparaState(); stangArk(); visaKarta(); }
      }, `${v} dagar`)))
  ));
}

function visaPinnadUppgift(p) {
  visaArk(el('div', {},
    el('span', { klass: 'etikett' }, 'Pinnad av din lärare'),
    el('h2', {}, p.titel || 'Ny uppgift'),
    el('p', { style: 'color:var(--text-2);margin:.4rem 0 0', html: matte(p.fraga) }),
    el('div', { klass: 'ark-knappar' },
      el('button', { klass: 'knapp bred', onclick: () => { stangArk(); korPinnadUppgift(p); } }, 'Gör uppgiften'))
  ));
}

function oppnaArk(fardighetsId) {
  const { fardighet: f } = hittaFardighet(fardighetsId);
  const st = fState(f.id);
  const n = niva(f);
  const formagorIF = [...new Set(f.uppgifter.flatMap(u => u.formagor))];
  visaArk(el('div', {},
    el('span', { klass: 'etikett' }, `Nivå ${n} av 5`),
    el('h2', {}, f.namn),
    el('p', { style: 'color:var(--text-2);margin:.3rem 0 0' }, f.beskrivning),
    el('div', { style: 'display:flex;gap:.3rem;flex-wrap:wrap;margin-top:.7rem' },
      formagorIF.map(k => el('span', { klass: 'fm-chip' }, `${k} · ${FORMAGOR[k].namn}`))),
    el('div', { klass: 'centralt' },
      el('b', { style: 'display:block;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:.25rem' },
        'Centralt innehåll, Lgr22'), f.centralt),
    el('p', { style: 'font-size:.85rem;color:var(--text-3)' }, `${st.gjorda.length} av ${f.uppgifter.length} uppgifter klarade`),
    el('div', { klass: 'ark-knappar' },
      el('button', { klass: 'knapp tyst', onclick: () => { stangArk(); gå(`#/lar/${f.id}`); } }, ikon('bok', 17), ' Lär mig först'),
      el('button', { klass: 'knapp', onclick: () => { stangArk(); gå(`#/trana/${f.id}`); } }, ikon('blixt', 17), ' Träna'))
  ));
}

/* ============================================================= LEKTION */
function visaLektion(fardighetsId) {
  const träff = hittaFardighet(fardighetsId);
  if (!träff) return gå('#/');
  const f = träff.fardighet;
  const steg = f.lektion?.steg || [];
  let i = 0;
  let guidadKlar = false;

  const yta = el('div', {});
  const topp = el('div', { klass: 'ovningstopp' },
    el('button', { klass: 'stangknapp', 'aria-label': 'Avsluta lektionen', onclick: () => gå('#/') }, ikon('kryss', 22)),
    el('div', { klass: 'progressspar' }, el('div', { klass: 'progressfyll', id: 'lekt-progress' })),
    el('span', { klass: 'etikett' }, 'Lär')
  );

  function rita() {
    const s = steg[i];
    guidadKlar = !s.uppstallningsdemo;
    $('#lekt-progress').style.width = `${((i + 1) / steg.length) * 100}%`;
    yta.replaceChildren();

    const kort = el('div', { klass: 'kort steg-kort' },
      el('span', { klass: 'etikett' }, `${f.namn} · steg ${i + 1} av ${steg.length}`),
      el('h3', {}, s.rubrik),
      el('p', { html: matte(s.text) })
    );

    if (s.visual) {
      const yta2 = el('div', { klass: 'visual-yta' });
      if (s.visual.typ === 'brak') yta2.append(ritaBrak(s.visual.taljare, s.visual.namnare));
      else if (s.visual.typ === 'tallinje') yta2.append(ritaTallinje(s.visual.fran, s.visual.till, s.visual.punkt));
      kort.append(yta2);
    }
    if (s.exempel) kort.append(el('div', { klass: 'exempel', html: matte(s.exempel.join('\n')) }));
    yta.append(kort);

    yta.append(el('div', { klass: 'stegprickar' },
      steg.map((_, k) => el('span', { klass: 'stegprick' + (k === i ? ' aktiv' : '') }))));

    if (s.uppstallningsdemo) {
      const träffU = hittaUppgift(s.uppstallningsdemo);
      if (träffU) {
        const demoKort = el('div', { klass: 'kort', style: 'margin-top:.4rem' });
        yta.append(demoKort);
        renderaGuidadUppstallning(träffU.uppgift, demoKort, () => {
          guidadKlar = true;
          nastaKnapp.disabled = false;
        });
      }
    }

    if (s.fraga) {
      const svarsyta = el('div', { klass: 'svarsyta' });
      let besvarad = false;
      s.fraga.alternativ.forEach((a, k) => {
        svarsyta.append(el('button', {
          klass: 'alt',
          onclick: e => {
            if (besvarad) return;
            besvarad = true;
            const ratt = k === s.fraga.ratt;
            e.currentTarget.classList.add(ratt ? 'ratt' : 'fel');
            if (!ratt) $$('.alt', svarsyta)[s.fraga.ratt].classList.add('ratt');
            ratt ? ljudRatt() : ljudFel();
            $$('.alt', svarsyta).forEach(b => b.disabled = true);
            setTimeout(() => { nastaKnapp.disabled = false; nastaKnapp.focus(); }, 250);
          }
        }, el('span', { klass: 'tangent' }, String(k + 1)), a));
      });
      yta.append(el('div', { klass: 'kort', style: 'margin-top:.4rem' },
        el('span', { klass: 'etikett' }, 'Din tur'),
        el('p', { klass: 'fraga', style: 'font-size:1.1rem;margin:.35rem 0 .8rem', html: matte(s.fraga.fraga) }),
        svarsyta));
    }

    const sista = i === steg.length - 1;
    var nastaKnapp = el('button', {
      klass: 'knapp bred stor', style: 'margin-top:1rem',
      disabled: !!s.fraga || !guidadKlar,
      onclick: () => { if (sista) gå(`#/trana/${f.id}`); else { i++; rita(); window.scrollTo(0, 0); } }
    }, sista ? 'Börja träna →' : 'Nästa →');
    yta.append(nastaKnapp);
  }

  skal([topp, yta], { navFlik: 'karta' });
  rita();
}

/* ---- guidad, interaktiv uppställningsgenomgång (återanvänder byggUppstallning) */
function genereraGuidadeSteg(u) {
  const bredd = Math.max(String(u.a).length, String(u.b).length, String(u.ratt).length);
  const A = String(u.a).padStart(bredd, '0').split('').map(Number);
  const B = String(u.b).padStart(bredd, '0').split('').map(Number);
  const steg = [];
  let bar = 0;
  for (let k = bredd - 1; k >= 0; k--) {
    const platsnamn = platsvarde(bredd - k - 1);
    let delsumma;
    if (u.operation === 'add') delsumma = A[k] + B[k] + bar;
    else if (u.operation === 'mul') delsumma = A[k] * Number(u.b) + bar;
    else delsumma = A[k] + B[k];   // enkelt fall utan lån för demo-syfte
    const svarSiffra = delsumma % 10;
    const nyttBar = Math.floor(delsumma / 10);
    const text = nyttBar > 0
      ? `${bar ? bar + ' + ' : ''}${A[k]}${u.operation === 'mul' ? ' · ' + u.b : ' + ' + B[k]} = ${delsumma}. Det är över tio, så vi skriver ${svarSiffra} i ${platsnamn} och för minnessiffran ${nyttBar} till nästa kolumn.`
      : `${bar ? bar + ' + ' : ''}${A[k]}${u.operation === 'mul' ? ' · ' + u.b : ' + ' + B[k]} = ${delsumma}. Det är under tio, så vi skriver bara ${svarSiffra} i ${platsnamn}.`;
    steg.push({ kolumnFrånVanster: k, svarSiffra, minneSiffra: nyttBar > 0 ? nyttBar : null, minneKolumn: k - 1, text });
    bar = nyttBar;
  }
  return steg;
}

function renderaGuidadUppstallning(u, mal, klarCallback) {
  const widget = byggUppstallning(u, mal);
  const guideRad = el('div', { klass: 'guidetext' });
  mal.prepend(guideRad);

  const svarsFalt = $$('.uppst input:not(.minne)', mal);
  const minnesFalt = $$('.uppst input.minne', mal);
  svarsFalt.forEach(f => { f.disabled = true; f.classList.remove('markerad'); });
  minnesFalt.forEach(f => { f.disabled = true; });
  $$('.knappsats', mal).forEach(k => k.classList.add('dold'));

  const steg = genereraGuidadeSteg(u);
  const bredd = svarsFalt.length;
  let i = 0;

  function visaSteg() {
    const s = steg[i];
    guideRad.innerHTML = '';
    guideRad.append(el('p', { html: matte(s.text.replace(/^(\S+.*?=\s*\d+)/, '<b>$1</b>')) }));
    svarsFalt.forEach((f, idx) => { f.classList.toggle('markerad', idx === s.kolumnFrånVanster); f.disabled = idx !== s.kolumnFrånVanster; });
    minnesFalt.forEach((f, idx) => { f.classList.toggle('markerad', s.minneSiffra !== null && idx === s.minneKolumn); f.disabled = !(s.minneSiffra !== null && idx === s.minneKolumn); });
    const aktivt = svarsFalt[s.kolumnFrånVanster];
    setTimeout(() => aktivt.focus(), 30);
  }

  function kontrolleraSteg() {
    const s = steg[i];
    const svarOk = svarsFalt[s.kolumnFrånVanster].value === String(s.svarSiffra);
    const minneOk = s.minneSiffra === null || minnesFalt[s.minneKolumn]?.value === String(s.minneSiffra);
    if (!svarOk || !minneOk) return;
    svarsFalt[s.kolumnFrånVanster].classList.add('ratt');
    svarsFalt[s.kolumnFrånVanster].classList.remove('markerad');
    if (s.minneSiffra !== null) { minnesFalt[s.minneKolumn].classList.add('ratt'); minnesFalt[s.minneKolumn].classList.remove('markerad'); }
    i++;
    if (i < steg.length) {
      setTimeout(visaSteg, 350);
    } else {
      guideRad.innerHTML = '';
      guideRad.append(el('p', {}, ikon('bock', 16), ' Snyggt! Du gjorde precis det en uppställning gör, en kolumn i taget.'));
      guideRad.style.background = 'var(--ratt-mjuk)';
      klarCallback();
    }
  }

  [...svarsFalt, ...minnesFalt].forEach(f => f.addEventListener('input', kontrolleraSteg));
  visaSteg();
}

/* ============================================================= TRÄNING */
function visaTraning(fardighetsId) {
  const träff = hittaFardighet(fardighetsId);
  if (!träff) return gå('#/');
  const f = träff.fardighet;
  const st = fState(f.id);
  const ogjorda = f.uppgifter.filter(u => !st.gjorda.includes(u.id));
  const kalla = ogjorda.length ? ogjorda : f.uppgifter;
  const repetition = ogjorda.length === 0;
  const pass = [...kalla].sort((a, b) => a.niva - b.niva).slice(0, 7);
  if (!pass.length) return gå('#/');
  kor({ uppgifter: pass, fardighet: f, lage: 'trana', repetition, klar: (res) => visaPassklart(f, res, repetition) });
}

function visaOvningspass(provId) {
  const p = PROV.find(x => x.id === provId && x.typ === 'ovning');
  if (!p) return gå('#/');
  const uppgifter = p.uppgifter.map(id => hittaUppgift(id)?.uppgift).filter(Boolean);
  if (!uppgifter.length) return gå('#/');
  kor({ uppgifter, lage: 'trana', repetition: false, prov: p, klar: res => visaOvningsPassKlart(p, res) });
}

function visaOvningsPassKlart(p, resultat) {
  const ratta = resultat.filter(r => r.korrekt).length;
  const totalXp = resultat.reduce((s, r) => s + (r.xp || 0), 0);
  ljudPassKlart();
  skal(el('div', { style: 'padding-top:2rem;text-align:center' },
    el('div', { style: 'display:flex;justify-content:center;color:var(--guld)' }, ikon(ratta === resultat.length ? 'pokal' : 'blixt', 52)),
    el('h1', { style: 'font-size:1.8rem;margin:.6rem 0 .3rem' }, 'Övningspass klart.'),
    el('p', { style: 'color:var(--text-2);margin:0 0 1.3rem' }, `${ratta} av ${resultat.length} rätt · ${p.namn}`),
    el('div', { klass: 'kort', style: 'text-align:left' },
      el('div', { klass: 'stapel', style: 'grid-template-columns:1fr auto' }, el('span', {}, 'XP från passet'), el('b', {}, `+${sv(totalXp)}`))),
    el('div', { style: 'display:grid;gap:.55rem;margin-top:1.2rem' },
      el('button', { klass: 'knapp bred stor', onclick: () => gå('#/') }, 'Tillbaka till kartan'))
  ), { navFlik: 'karta' });
}

function korPinnadUppgift(p) {
  const u = {
    id: 'pinnad-' + p.id, typ: p.typ || 'number', niva: 3, eca: 'C',
    poang: { e: 0, c: 1, a: 0 }, formagor: p.formagor?.length ? p.formagor : ['M'],
    fraga: p.fraga, ratt: p.ratt, alternativ: p.alternativ, svarsform: p.svarsform,
    ledtradar: p.ledtrad ? [p.ledtrad] : ['Din lärare har inte lagt till någon extra ledtråd för den här.'],
    losning: p.losning ? [p.losning] : ['Fråga din lärare om du vill se en fullständig lösning.']
  };
  const fejkFardighet = { id: '_pinnad', namn: p.titel || 'Uppgift från läraren', uppgifter: [u] };
  kor({ uppgifter: [u], fardighet: fejkFardighet, lage: 'trana', repetition: false, klar: () => gå('#/') });
}

/* ------------------------------------------------------ ÖVNINGSMOTORN */
/* ============================================================= MINIRÄKNARE
   Riktig fyrräknesätts-räknare, inte bara en text som säger "miniräknare
   tillåten". Räknar vänster-till-höger utan prioriteringsordning, precis
   som en fysisk skolräknare — inte som ett JS-uttryck. */
function byggMiniraknare() {
  let display = '0';
  let forra = null, vantandeOp = null, nyttTal = true;
  const displayEl = el('div', { klass: 'raknare-display' });
  function rita() { displayEl.textContent = display; }
  rita();

  function siffra(s) {
    if (nyttTal) { display = (s === ',') ? '0,' : s; nyttTal = false; }
    else if (s === ',') { if (!display.includes(',')) display += ','; }
    else { display = (display === '0') ? s : display + s; }
    rita();
  }
  function berakna(a, op, b) {
    if (op === '+') return a + b;
    if (op === '−') return a - b;
    if (op === '×') return a * b;
    if (op === '÷') return b === 0 ? NaN : a / b;
    return b;
  }
  function fmt(n) {
    if (!Number.isFinite(n)) return 'Fel';
    const r = Math.round(n * 1e8) / 1e8;
    return String(r).replace('.', ',');
  }
  function tryckOp(op) {
    const nu = Number(display.replace(',', '.'));
    forra = (vantandeOp && !nyttTal) ? berakna(forra, vantandeOp, nu) : nu;
    vantandeOp = op; nyttTal = true;
    display = fmt(forra); rita();
  }
  function likhet() {
    if (vantandeOp === null) return;
    const nu = Number(display.replace(',', '.'));
    forra = berakna(forra, vantandeOp, nu);
    display = fmt(forra); vantandeOp = null; nyttTal = true; rita();
  }
  function rensa() { display = '0'; forra = null; vantandeOp = null; nyttTal = true; rita(); }

  const grid = el('div', { klass: 'raknare-grid' });
  [['7', '8', '9', '÷'], ['4', '5', '6', '×'], ['1', '2', '3', '−'], ['C', '0', ',', '+']]
    .forEach(rad => rad.forEach(t => {
      const arOp = ['÷', '×', '−', '+'].includes(t);
      grid.append(el('button', {
        klass: arOp ? 'op' : '', type: 'button',
        onclick: () => { if (t === 'C') rensa(); else if (arOp) tryckOp(t); else siffra(t); }
      }, t));
    }));
  grid.append(el('button', { klass: 'likhet', type: 'button', style: 'grid-column:span 4', onclick: likhet }, '='));

  const panel = el('div', { klass: 'raknare-panel dold' }, displayEl, grid);
  const flik = el('button', { klass: 'raknare-flik', 'aria-label': 'Miniräknare', onclick: () => panel.classList.toggle('dold') }, ikon('raknare', 22));
  return { flik, panel };
}

function kor({ uppgifter, fardighet, lage, repetition = false, klar, prov = null }) {
  let i = 0;
  const resultat = [];
  let ledtradsSteg = 0;
  let felIRad = 0;
  let rimlighetKvar = false;
  let besvarad = false;
  let valdaFlersvar = new Set();
  let uppstallningsRef = null;

  const yta = el('div', { klass: 'uppgiftsyta' });
  const respons = el('div', { klass: 'respons', role: 'status', 'aria-live': 'polite' }, el('div', { klass: 'respons-inner' }));
  const progress = el('div', { klass: 'progressfyll' });
  const topp = lage === 'prov'
    ? provTopprad(prov, () => avslutaProv())
    : el('div', { klass: 'ovningstopp' },
        el('button', { klass: 'stangknapp', 'aria-label': 'Avsluta passet', onclick: () => gå('#/') }, ikon('kryss', 22)),
        el('div', { klass: 'progressspar' }, progress),
        el('span', { klass: 'etikett' }, repetition ? 'Repetition' : 'Träna'));

  function avslutaProv() { if (confirm('Lämna in provet nu?')) klar(resultat); }

  function rita() {
    besvarad = false; ledtradsSteg = 0; felIRad = 0; valdaFlersvar = new Set();
    const u = uppgifter[i];
    rimlighetKvar = !!(u.rimlighet && lage !== 'prov');
    respons.className = 'respons';
    yta.replaceChildren();

    if (lage !== 'prov') progress.style.width = `${(i / uppgifter.length) * 100}%`;
    else $('#prov-nr').textContent = `${i + 1} / ${uppgifter.length}`;

    const meta = el('div', { klass: 'uppg-meta' },
      el('span', { klass: 'eca-chip', title: 'E-, C- och A-poäng precis som på nationella provet' }, `${u.poang.e}/${u.poang.c}/${u.poang.a}`),
      (u.formagor || []).map(k => el('span', { klass: 'fm-chip', title: FORMAGOR[k].namn }, k)),
      lage !== 'prov' && !repetition ? el('span', { klass: 'etikett', style: 'margin-left:auto' }, `+${XP_FOR[u.eca]} xp`) : null
    );
    yta.append(meta);
    if (rimlighetKvar) { ritaRimlighet(u); return; }
    ritaUppgift(u);
  }

  function ritaRimlighet(u) {
    const r = u.rimlighet;
    const alt = el('div', { klass: 'svarsyta' });
    r.alternativ.forEach((a, k) => {
      alt.append(el('button', {
        klass: 'alt',
        onclick: e => {
          $$('.alt', alt).forEach(b => b.disabled = true);
          const ratt = k === r.ratt;
          e.currentTarget.classList.add(ratt ? 'ratt' : 'fel');
          if (!ratt) $$('.alt', alt)[r.ratt].classList.add('ratt');
          ratt ? ljudRatt() : ljudFel();
          alt.after(el('div', { klass: 'ledtrad' }, el('span', { klass: 'etikett' }, ratt ? 'Precis' : 'Så här ligger det till'), r.forklaring));
          setTimeout(() => {
            rimlighetKvar = false;
            yta.replaceChildren();
            yta.append(el('div', { klass: 'uppg-meta' },
              el('span', { klass: 'eca-chip' }, `${u.poang.e}/${u.poang.c}/${u.poang.a}`),
              (u.formagor || []).map(x => el('span', { klass: 'fm-chip' }, x))));
            ritaUppgift(u); window.scrollTo(0, 0);
          }, 1400);
        }
      }, el('span', { klass: 'tangent' }, String(k + 1)), a));
    });
    yta.append(el('div', { klass: 'rimlighet-ruta' },
      el('span', { klass: 'etikett' }, 'Rimlighetskoll · innan du räknar'),
      el('h3', { html: matte(r.fraga) }), alt));
  }

  function ritaUppgift(u) {
    yta.append(el('p', { klass: 'fraga', html: matte(u.fraga) }));
    const svarsyta = el('div', { klass: 'svarsyta', id: 'svarsyta' });
    yta.append(svarsyta);

    if (u.typ === 'flerval') byggFlerval(u, svarsyta);
    else if (u.typ === 'flersvar') byggFlersvar(u, svarsyta);
    else if (u.typ === 'uppstallning') uppstallningsRef = byggUppstallning(u, svarsyta);
    else byggFalt(u, svarsyta);

    const verktyg = el('div', { klass: 'verktygsrad' });
    if (lage !== 'prov') {
      verktyg.append(el('button', { klass: 'knapp tyst liten', id: 'ledtradsknapp', onclick: () => visaLedtrad(u) },
        ikon('glodlampa', 15), ' Fastnat?'));
    }
    if (u.typ !== 'flerval' && u.typ !== 'flersvar') {
      verktyg.append(el('button', { klass: 'knapp liten', onclick: () => kontrollera(u) }, 'Svara'));
    }
    yta.append(verktyg);
    if (u.kalla && lage !== 'prov') yta.append(el('p', { klass: 'kalla' }, 'Efter ' + u.kalla));

    const forsta = svarsyta.querySelector('input,button');
    if (forsta && u.typ !== 'uppstallning') forsta.focus();
  }

  function byggFlerval(u, mal) {
    u.alternativ.forEach((a, k) => {
      mal.append(el('button', { klass: 'alt', onclick: () => { if (!besvarad) kontrollera(u, k); } },
        el('span', { klass: 'tangent' }, String(k + 1)), el('span', { html: matte(a) })));
    });
  }
  function byggFlersvar(u, mal) {
    u.alternativ.forEach((a, k) => {
      mal.append(el('button', {
        klass: 'alt', 'aria-pressed': 'false',
        onclick: e => {
          if (besvarad) return;
          const b = e.currentTarget;
          if (valdaFlersvar.has(k)) { valdaFlersvar.delete(k); b.classList.remove('vald'); b.setAttribute('aria-pressed', 'false'); }
          else { valdaFlersvar.add(k); b.classList.add('vald'); b.setAttribute('aria-pressed', 'true'); }
        }
      }, el('span', { klass: 'tangent' }, String(k + 1)), el('span', { html: matte(a) })));
    });
    mal.append(el('p', { klass: 'hjalptext' }, 'Markera alla som stämmer, tryck sedan Svara.'));
    mal.append(el('button', { klass: 'knapp', style: 'justify-self:start', onclick: () => kontrollera(u) }, 'Svara'));
  }
  function byggFalt(u, mal) {
    const inp = el('input', {
      type: 'text', inputmode: u.svarsform === 'text' ? 'text' : 'decimal', autocomplete: 'off',
      id: 'svarsfalt', 'aria-label': 'Ditt svar',
      oninput: e => {
        /* QoL: punkt blir komma medan eleven skriver, aldrig bara vid rättning */
        if (u.svarsform !== 'text' && e.target.value.includes('.')) {
          const pos = e.target.selectionStart;
          e.target.value = e.target.value.replace(/\./g, ',');
          e.target.setSelectionRange(pos, pos);
        }
      },
      onkeydown: e => { if (e.key === 'Enter') { e.preventDefault(); kontrollera(u); } }
    });
    mal.append(el('div', { klass: 'svarsfalt' }, inp, u.enhet ? el('span', { klass: 'enhet' }, u.enhet) : null));
    if (u.hjalptext) mal.append(el('p', { klass: 'hjalptext' }, u.hjalptext));
  }

  function visaLedtrad(u) {
    if (ledtradsSteg >= u.ledtradar.length) return;
    const txt = u.ledtradar[ledtradsSteg];
    ledtradsSteg++;
    $('#svarsyta').after(el('div', { klass: 'ledtrad' },
      el('span', { klass: 'etikett' }, `Ledtråd ${ledtradsSteg} av ${u.ledtradar.length}`), txt));
    if (ledtradsSteg >= u.ledtradar.length) $('#ledtradsknapp').disabled = true;
    /* Efter första ledtråden: erbjud en genomgång av en LIKNANDE uppgift,
       inte bara mer ledtrådar på den här. Återanvänder lektionsstegens
       redan skrivna exempel — inget nytt innehåll behöver författas. */
    if (ledtradsSteg === 1 && !$('#liknandeknapp') && fardighet.lektion?.steg?.length) {
      $('#svarsyta').after(el('button', {
        klass: 'knapp tyst liten', id: 'liknandeknapp', style: 'margin-top:.6rem',
        onclick: () => visaLiknandeExempel(u)
      }, ikon('bok', 15), ' Se ett liknande, genomgånget exempel'));
    }
  }

  function visaLiknandeExempel(u) {
    const stegLista = fardighet.lektion.steg;
    const idx = Math.min(stegLista.length - 1, Math.floor(((u.niva - 1) / 4) * (stegLista.length - 1)));
    const s = stegLista[idx];
    const knapp = $('#liknandeknapp');
    if (knapp) knapp.remove();
    const kort = el('div', { klass: 'liknande-exempel' },
      el('span', { klass: 'etikett' }, 'Liknande uppgift, genomgången'),
      el('h4', {}, s.rubrik),
      el('p', { html: matte(s.text) }),
      s.exempel ? el('div', { klass: 'exempel', html: matte(s.exempel.join('\n')) }) : null
    );
    $('#svarsyta').after(kort);
  }

  function kontrollera(u, valtIndex = null) {
    if (besvarad && lage === 'prov') return;
    let korrekt = false, svar = null;

    if (u.typ === 'flerval') {
      svar = valtIndex; korrekt = valtIndex === u.ratt;
      const knappar = $$('.alt', $('#svarsyta'));
      knappar.forEach(b => b.disabled = true);
      if (lage !== 'prov') { knappar[valtIndex].classList.add(korrekt ? 'ratt' : 'fel'); if (!korrekt) knappar[u.ratt].classList.add('ratt'); }
      else knappar[valtIndex].classList.add('vald');
    } else if (u.typ === 'flersvar') {
      svar = [...valdaFlersvar].sort();
      korrekt = svar.length === u.ratt.length && svar.every(x => u.ratt.includes(x));
      const knappar = $$('.alt', $('#svarsyta'));
      knappar.forEach(b => b.disabled = true);
      if (lage !== 'prov') u.ratt.forEach(k => knappar[k].classList.add('ratt'));
    } else if (u.typ === 'uppstallning') {
      const res = uppstallningsRef.las();
      svar = res.svar; korrekt = res.svar === u.ratt;
      if (lage !== 'prov') uppstallningsRef.markera(korrekt);
    } else {
      const inp = $('#svarsfalt');
      svar = inp.value.trim();
      if (!svar) { inp.focus(); return; }
      if (u.svarsform === 'brak' || u.svarsform === 'text') korrekt = u.ratt.some(r => normalisera(r) === normalisera(svar));
      else { const n = tolkaTal(svar); korrekt = Math.abs(n - u.ratt) <= (u.tolerans ?? 0.001); }
      if (lage !== 'prov') inp.classList.add(korrekt ? 'ratt' : 'fel');
    }

    if (lage === 'prov') {
      besvarad = true; resultat.push({ uppgift: u, korrekt, svar });
      registreraForsok(u, fardighet, korrekt, 0, 'prov');
      nastaUppgift(); return;
    }

    /* fardighet är satt vid vanlig träning; vid övningspass/pinnade uppgifter som
       spänner över flera färdigheter slås rätt färdighet upp per uppgift istället. */
    const uFardighet = fardighet || hittaUppgift(u.id)?.fardighet;

    if (korrekt) {
      besvarad = true; felIRad = 0;
      const xp = (repetition || !uFardighet) ? 0 : tilldelaXp(u, uFardighet, ledtradsSteg);
      resultat.push({ uppgift: u, korrekt: true, ledtradar: ledtradsSteg, xp });
      registreraForsok(u, uFardighet, true, xp, lage);
      ljudRatt(); visaRespons(true, xp, u);
    } else {
      felIRad++;
      resultat.push({ uppgift: u, korrekt: false, ledtradar: ledtradsSteg });
      registreraForsok(u, uFardighet, false, 0, lage);
      ljudFel();
      if (S.installningar.animationer) {
        const box = $('#svarsyta'); box.classList.add('skaka'); setTimeout(() => box.classList.remove('skaka'), 320);
      }
      if (felIRad >= 2) visaLosning(u);
      visaRespons(false, 0, u);
    }
  }

  function visaLosning(u) {
    if ($('#losning')) return;
    $('#svarsyta').after(el('div', { klass: 'losningsruta', id: 'losning' },
      el('span', { klass: 'etikett' }, 'Så här går den'),
      el('ol', {}, u.losning.map(r => el('li', { html: matte(r) })))));
  }

  function visaRespons(ratt, xp, u) {
    const inner = $('.respons-inner', respons);
    inner.replaceChildren();
    inner.append(el('div', { klass: 'respons-txt' },
      el('b', {}, ratt ? slump(BEROM) : slump(TROST)),
      el('span', {}, ratt ? `Du övade på att ${FORMAGOR[u.formagor?.[0] || 'M'].elevord}.`
                          : (felIRad >= 2 ? 'Kolla lösningen ovanför.' : 'Prova igen — eller ta en ledtråd.'))));
    if (ratt && xp > 0) inner.append(el('span', { klass: 'xp-pop' }, `+${xp} xp`));
    if (ratt) {
      inner.append(el('button', { klass: 'knapp gron', onclick: () => nastaUppgift() },
        i === uppgifter.length - 1 ? 'Avsluta' : 'Nästa →'));
    } else {
      inner.append(el('button', {
        klass: 'knapp', onclick: () => {
          respons.classList.remove('visas');
          const inp = $('#svarsfalt'); if (inp) { inp.classList.remove('fel'); inp.value = ''; inp.focus(); }
          if (uppstallningsRef) uppstallningsRef.rensaMarkering();
          const knappar = $$('.alt', $('#svarsyta'));
          if (knappar.length && !$('#losning')) knappar.forEach(b => { b.disabled = false; b.classList.remove('fel', 'vald'); });
          valdaFlersvar = new Set();
        }
      }, 'Försök igen'));
      if (felIRad >= 2) inner.append(el('button', { klass: 'knapp tyst', onclick: () => nastaUppgift() }, 'Gå vidare'));
    }
    respons.className = 'respons visas ' + (ratt ? 'ratt' : 'fel');
    const k = inner.querySelector('.knapp'); if (k) k.focus();
  }

  function nastaUppgift() {
    respons.classList.remove('visas');
    i++;
    if (i >= uppgifter.length) { if (lage !== 'prov') progress.style.width = '100%'; return klar(resultat); }
    rita(); window.scrollTo(0, 0);
  }

  function tangent(e) {
    if (besvarad || rimlighetKvar) return;
    const n = Number(e.key);
    if (n >= 1 && n <= 9) {
      const alt = $$('#svarsyta .alt');
      if (alt[n - 1] && document.activeElement.tagName !== 'INPUT') alt[n - 1].click();
    }
  }
  document.addEventListener('keydown', tangent);
  window.addEventListener('hashchange', () => document.removeEventListener('keydown', tangent), { once: true });

  /* Miniräknaren: tillgänglig i Lär/Träna/pinnade uppgifter alltid (praktikläge),
     men respekterar raknare:false på publicerade prov/övningspass. */
  if (prov?.raknare !== false) {
    const { flik, panel } = byggMiniraknare();
    document.body.append(flik, panel);
    window.addEventListener('hashchange', () => { flik.remove(); panel.remove(); }, { once: true });
  }

  if (lage === 'prov') {
    document.body.classList.add('provlage');
    app.replaceChildren();
    const sida = el('div', { klass: 'sida' });
    sida.append(topp, yta);
    app.append(sida, respons);
  } else {
    skal([topp, yta], { navFlik: 'karta' });
    app.append(respons);
  }
  rita();
}

/* Loggar VARJE försök (rätt eller fel) — inte bara första rätt som ger XP.
   Driver #/historik-sidan i Fas 3. */
function registreraForsok(u, fardighet, ratt, xp, lage) {
  const fardighetId = fardighet?.id || hittaUppgift(u.id)?.fardighet?.id || null;
  const forsokNr = S.historik.filter(h => h.uppgiftId === u.id).length + 1;
  S.historik.push({ uppgiftId: u.id, fardighetId, fraga: u.fraga, ratt, forsokNr, xp: xp || 0, lage, datum: idag() });
  sparaState();
}

function tilldelaXp(u, fardighet, ledtradar) {
  const st = fState(fardighet.id);
  if (st.gjorda.includes(u.id)) return 0;
  let xp = XP_FOR[u.eca] ?? 15;
  xp = Math.round(xp * (1 - Math.min(0.6, ledtradar * 0.25)));
  st.gjorda.push(u.id);
  S.xp += xp;
  (u.formagor || []).forEach(k => { S.formagor[k] = (S.formagor[k] || 0) + 1; });
  const nyNiva = niva(fardighet);
  if (nyNiva > st.niva) { st.niva = nyNiva; ljudNiva(); }
  sparaState();
  return xp;
}

function visaPassklart(f, resultat, repetition) {
  const ratta = resultat.filter(r => r.korrekt).length;
  const totalXp = resultat.reduce((s, r) => s + (r.xp || 0), 0);
  const nyaUppgifter = new Set(resultat.filter(r => r.korrekt && r.xp > 0).map(r => r.uppgift.id)).size;
  const nyDag = nyaUppgifter >= 3 ? registreraDag() : false;
  const formagorTranade = [...new Set(resultat.filter(r => r.korrekt).flatMap(r => r.uppgift.formagor || []))];
  ljudPassKlart();
  if (nyDag) setTimeout(ljudStreak, 260);

  skal(el('div', { style: 'padding-top:2rem;text-align:center' },
    el('div', { style: 'display:flex;justify-content:center;color:var(--guld)' }, ikon(ratta === resultat.length ? 'pokal' : 'blixt', 52)),
    el('h1', { style: 'font-size:1.8rem;margin:.6rem 0 .3rem' }, ratta === resultat.length ? 'Allt rätt.' : 'Pass klart.'),
    el('p', { style: 'color:var(--text-2);margin:0 0 1.3rem' }, `${ratta} av ${resultat.length} rätt${repetition ? ' · repetition ger ingen XP' : ''}`),
    el('div', { klass: 'kort', style: 'text-align:left' },
      el('div', { klass: 'stapel', style: 'grid-template-columns:1fr auto;margin-bottom:.6rem' }, el('span', {}, 'XP från passet'), el('b', {}, `+${sv(totalXp)}`)),
      el('div', { klass: 'stapel', style: 'grid-template-columns:1fr auto;margin-bottom:.6rem' }, el('span', {}, 'Nivå på färdigheten'), el('b', {}, `${niva(f)} / 5`)),
      el('div', { klass: 'stapel', style: 'grid-template-columns:1fr auto' }, el('span', {}, 'Streak'), el('b', {}, `${S.streak.dagar} dagar${nyDag ? ' 🔥' : ''}`))),
    formagorTranade.length ? el('div', { klass: 'kort', style: 'text-align:left;margin-top:.7rem' },
      el('span', { klass: 'etikett' }, 'Du övade på att'),
      el('ul', { style: 'margin:.5rem 0 0;padding-left:1.1rem;color:var(--text-2)' }, formagorTranade.map(k => el('li', {}, FORMAGOR[k].elevord)))) : null,
    nyaUppgifter < 3 && !repetition ? el('div', { klass: 'notis', style: 'margin-top:.8rem;text-align:left' },
      el('b', {}, 'Räknas inte för streaken. '), 'Ett pass räknas när du klarat minst tre nya uppgifter.') : null,
    el('div', { style: 'display:grid;gap:.55rem;margin-top:1.2rem' },
      el('button', { klass: 'knapp bred stor', onclick: () => visaTraning(f.id) }, 'En till ⚡'),
      el('button', { klass: 'knapp tyst bred', onclick: () => gå('#/') }, 'Klar för idag'))
  ), { navFlik: 'karta' });
}

/* ==================================================== UPPSTÄLLNINGEN */
function byggUppstallning(u, mal) {
  const a = String(u.a), b = String(u.b), svar = String(u.ratt);
  const kolumner = Math.max(a.length, b.length, svar.length);
  const opTecken = { add: '+', sub: '−', mul: '·' }[u.operation];

  const rutnat = el('div', { klass: 'uppst', role: 'group', 'aria-label': 'Uppställning', style: `grid-template-columns:34px repeat(${kolumner},42px)` });
  const minnesFalt = [];
  const svarsFalt = [];
  const taljCeller = [];   // { wrapper, span, justInput } per kolumn — övre talet

  rutnat.append(el('span', {}));
  for (let k = 0; k < kolumner; k++) {
    const inp = el('input', {
      klass: 'minne', type: 'text', inputmode: 'numeric', maxlength: '1',
      'aria-label': `Minnessiffra, ${platsvarde(kolumner - k - 1)}`,
      oninput: e => { e.target.value = e.target.value.replace(/\D/g, ''); }
    });
    minnesFalt.push(inp); rutnat.append(inp);
  }

  /* övre talet — klickbar för att stryka & justera vid t.ex. lån */
  rutnat.append(el('span', {}));
  hogerstall(a, kolumner).forEach((s, k) => {
    const span = el('span', { klass: 'uppst-cell fast' + (s.trim() ? ' klickbar' : '') }, s);
    const cell = { wrapper: null, span, justInput: null };
    taljCeller.push(cell);
    const wrapper = el('div', {
      klass: 'uppst-taljcell',
      onclick: () => { if (s.trim()) vaxlaStrykning(k); }
    }, span);
    cell.wrapper = wrapper;
    rutnat.append(wrapper);
  });

  function vaxlaStrykning(k) {
    const c = taljCeller[k];
    if (c.justInput) {
      c.justInput.remove(); c.justInput = null;
      c.span.classList.remove('struken');
    } else {
      c.span.classList.add('struken');
      const inp = el('input', {
        klass: 'justering', type: 'text', inputmode: 'numeric', maxlength: '2',
        'aria-label': `Justerat värde ovanför ${platsvarde(kolumner - k - 1)}, t.ex. vid lån`,
        onclick: e => e.stopPropagation(),
        oninput: e => { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 2); }
      });
      c.wrapper.prepend(inp);
      c.justInput = inp;
      setTimeout(() => inp.focus(), 10);
    }
  }

  rutnat.append(el('span', { klass: 'uppst-op' }, opTecken));
  hogerstall(b, kolumner).forEach(s => rutnat.append(el('span', { klass: 'uppst-cell fast' }, s)));
  rutnat.append(el('span', { klass: 'uppst-strec', style: `grid-column:1 / span ${kolumner + 1}` }));

  rutnat.append(el('span', {}));
  for (let k = 0; k < kolumner; k++) {
    const inp = el('input', {
      type: 'text', inputmode: 'numeric', maxlength: '1',
      'aria-label': `Svar, ${platsvarde(kolumner - k - 1)}`,
      oninput: e => { e.target.value = e.target.value.replace(/\D/g, ''); if (e.target.value && k > 0) svarsFalt[k - 1].focus(); },
      onkeydown: e => {
        if (e.key === 'Backspace' && !e.target.value && k < kolumner - 1) svarsFalt[k + 1].focus();
        if (e.key === 'ArrowLeft' && k > 0) svarsFalt[k - 1].focus();
        if (e.key === 'ArrowRight' && k < kolumner - 1) svarsFalt[k + 1].focus();
        if (e.key === 'ArrowUp') minnesFalt[k].focus();
      }
    });
    svarsFalt.push(inp); rutnat.append(inp);
  }

  mal.append(el('div', { klass: 'uppst-yta' }, rutnat));

  const knappsats = el('div', { klass: 'knappsats' });
  for (let n = 9; n >= 0; n--) {
    knappsats.append(el('button', {
      type: 'button',
      onclick: () => {
        const f = document.activeElement;
        const mål = (f && f.tagName === 'INPUT' && rutnat.contains(f)) ? f : svarsFalt[kolumner - 1];
        mål.value = String(n);
        mål.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, String(n)));
  }
  knappsats.append(el('button', {
    type: 'button', klass: 'rensa',
    onclick: () => {
      [...minnesFalt, ...svarsFalt].forEach(f => { f.value = ''; f.className = f.classList.contains('minne') ? 'minne' : ''; });
      taljCeller.forEach(c => { if (c.justInput) { c.justInput.remove(); c.justInput = null; c.span.classList.remove('struken'); } });
      svarsFalt[kolumner - 1].focus();
    }
  }, 'Rensa'));
  mal.append(knappsats);

  mal.append(el('p', { klass: 'hjalptext', style: 'text-align:center' },
    'Börja längst till höger. Klicka på en siffra i det övre talet för att stryka över den och skriva ett nytt värde ovanför — praktiskt vid lån. Bara svaret (och minnessiffrorna) rättas, strykningarna är bara till för dig.'));

  setTimeout(() => svarsFalt[kolumner - 1].focus(), 60);

  return {
    las() {
      const txt = svarsFalt.map(f => f.value || '').join('').replace(/^0+/, '');
      return { svar: txt === '' ? NaN : Number(txt) };
    },
    markera(korrekt) {
      const forvantat = hogerstall(svar, kolumner);
      svarsFalt.forEach((f, k) => { if (!f.value && forvantat[k] === ' ') return; f.classList.add(f.value === forvantat[k].trim() ? 'ratt' : 'fel'); });
      if (u.operation !== 'sub') {
        const minnen = beraknaMinnen(u);
        minnesFalt.forEach((f, k) => { if (!f.value) return; f.classList.add(f.value === String(minnen[k] || '') ? 'ratt' : 'fel'); });
      }
    },
    rensaMarkering() {
      svarsFalt.forEach(f => f.classList.remove('ratt', 'fel'));
      minnesFalt.forEach(f => f.classList.remove('ratt', 'fel'));
    }
  };
}
function hogerstall(txt, bredd) { return txt.padStart(bredd, ' ').split(''); }
function platsvarde(exponent) { return ['ental', 'tiotal', 'hundratal', 'tusental', 'tiotusental'][exponent] || `10^${exponent}`; }
function beraknaMinnen(u) {
  const bredd = Math.max(String(u.a).length, String(u.b).length, String(u.ratt).length);
  const A = String(u.a).padStart(bredd, '0').split('').map(Number);
  const B = String(u.b).padStart(bredd, '0').split('').map(Number);
  const min = Array(bredd).fill('');
  let bar = 0;
  for (let k = bredd - 1; k >= 0; k--) {
    let s;
    if (u.operation === 'add') s = A[k] + B[k] + bar;
    else if (u.operation === 'mul') s = A[k] * Number(u.b) + bar;
    else { continue; }
    bar = Math.floor(s / 10);
    if (k > 0 && bar > 0) min[k - 1] = bar;
  }
  return min;
}

/* ================================================================ PROV */
let provUnderflik = 'aktiva';   // 'aktiva' | 'ovning'
function visaProvlista() {
  const flikar = el('div', { klass: 'flikar', role: 'tablist' },
    [['aktiva', 'Aktiva prov'], ['ovning', 'Övningspass']].map(([id, namn]) =>
      el('button', { klass: 'flik', role: 'tab', 'aria-selected': provUnderflik === id ? 'true' : 'false', onclick: () => { provUnderflik = id; visaProvlista(); } }, namn)));

  skal([
    el('div', { klass: 'karta-topp' }, el('h1', { klass: 'halsning' }, 'Prov')),
    flikar,
    provUnderflik === 'aktiva' ? aktivaProvVy() : ovningspassVy()
  ], { navFlik: 'prov' });
}

function aktivaProvVy() {
  const skola = lasSkola();
  const alla = skola.publiceradeProv || [];
  const aktiva = alla.filter(p => p.aktiv);

  const kort = aktiva.map(p => {
    const klart = S.provKlara.includes(p.id);
    return el('button', { klass: 'uppdragskort' + (klart ? ' gjort' : ''), onclick: () => gå(`#/prov/${p.id}`) },
      el('span', { klass: 'uk-ikon' }, ikon(klart ? 'bock' : 'penna', 18)),
      el('span', { klass: 'uk-txt' }, el('b', {}, p.namn), el('span', { klass: 'uk-under' }, klart ? 'Gjort · tryck för att göra om' : `${p.uppgiftIds.length + (p.egnaUppgifter || []).length} uppgifter · ${p.minuter} min`)),
      ikon('pilHoger', 18));
  });

  const kodFalt = el('input', { type: 'text', placeholder: 'T.ex. K7X2QM', style: 'text-transform:uppercase' });
  const kodMeddelande = el('p', { klass: 'hjalptext' });
  const kodrad = el('div', { klass: 'kort', style: 'display:flex;gap:.6rem;align-items:flex-end;flex-wrap:wrap' },
    el('label', { style: 'flex:1;min-width:160px' },
      el('span', { style: 'display:block;font-size:.82rem;color:var(--text-2);margin-bottom:.3rem;font-weight:600' }, 'Har du en kod?'),
      kodFalt),
    el('button', {
      klass: 'knapp', onclick: () => {
        const kod = kodFalt.value.trim().toUpperCase();
        const träff = alla.find(p => (p.kod || '').toUpperCase() === kod && kod);
        if (träff) { ljudProvKlart(); gå(`#/prov/${träff.id}`); }
        else { ljudFel(); kodMeddelande.textContent = 'Ingen kod matchade. Kolla att du skrev rätt.'; }
      }
    }, 'Lås upp'));

  const tidigare = S.provresultat.slice(-4).reverse().map(r => el('div', { klass: 'facitrad ok', style: 'border-left-color:var(--primar)' },
    el('b', {}, r.namn), el('small', {}, `${r.datum} · ${r.ratta}/${r.antal} rätt · ${r.e}/${r.c}/${r.a} poäng`)));

  return el('div', {},
    el('p', { klass: 'notis' }, el('b', {}, 'Så funkar det. '), 'Ingen XP, inga ledtrådar, ingen streak. Poängen anges i E/C/A precis som på nationella provet. Prov skapas och publiceras av din lärare.'),
    kodrad, kodMeddelande,
    el('div', { klass: 'omradesrubrik' }, el('h2', {}, 'Aktiva prov'), el('span', { klass: 'strec' })),
    aktiva.length ? el('div', { klass: 'uppdrag' }, kort) : el('p', { klass: 'tomtext' }, 'Din lärare har inte publicerat något prov än.'),
    tidigare.length ? el('div', {}, el('div', { klass: 'omradesrubrik' }, el('h2', {}, 'Tidigare resultat'), el('span', { klass: 'strec' })), el('div', { klass: 'facit' }, tidigare)) : null);
}

function ovningspassVy() {
  const ovningspass = PROV.filter(p => p.typ === 'ovning');
  const rad = el('div', { klass: 'uppdrag' });
  ovningspass.forEach(p => rad.append(el('button', { klass: 'uppdragskort', onclick: () => gå(`#/ovning/${p.id}`) },
    el('span', { klass: 'uk-ikon' }, ikon('lager', 18)),
    el('span', { klass: 'uk-txt' }, el('b', {}, p.namn), el('span', { klass: 'uk-under' }, `${p.uppgifter.length} uppgifter · ca ${p.minuter} min`)),
    ikon('pilHoger', 18))));
  return el('div', {},
    el('p', { klass: 'notis' }, 'Längre, kalibrerade övningsset med full återkoppling — inte ett skarpt prov.'),
    rad);
}
function provTopprad(prov, avsluta) {
  return el('div', { klass: 'provtopp' },
    el('button', { klass: 'stangknapp', 'aria-label': 'Avbryt provet', onclick: () => gå('#/prov') }, ikon('kryss', 20)),
    el('span', { klass: 'timer', id: 'prov-timer' }, '--:--'),
    el('span', { klass: 'etikett' }, prov.namn),
    el('span', { klass: 'provnummer', id: 'prov-nr' }, '1'),
    el('button', { klass: 'knapp liten', onclick: avsluta }, 'Lämna in'));
}
function visaProv(provId) {
  const skola = lasSkola();
  const p = (skola.publiceradeProv || []).find(x => x.id === provId);
  if (!p) return gå('#/prov');
  const uppgifter = p.uppgiftIds.map(id => hittaUppgift(id)?.uppgift).filter(Boolean).concat(p.egnaUppgifter || []);
  if (!uppgifter.length) return gå('#/prov');
  let sekunder = p.minuter * 60, timerId = null;
  kor({ uppgifter, lage: 'prov', prov: p, klar: res => { clearInterval(timerId); visaProvresultat(p, res); } });
  timerId = setInterval(() => {
    sekunder--;
    const t = $('#prov-timer');
    if (!t) { clearInterval(timerId); return; }
    const m = Math.floor(sekunder / 60), s = sekunder % 60;
    t.textContent = `${m}:${String(s).padStart(2, '0')}`;
    if (sekunder < 300) t.classList.add('brannande');
    if (sekunder <= 0) { clearInterval(timerId); alert('Tiden är ute.'); }
  }, 1000);
}
function visaProvresultat(p, resultat) {
  ljudProvKlart();
  const ratta = resultat.filter(r => r.korrekt).length;
  const poang = { e: 0, c: 0, a: 0 }, maxPoang = { e: 0, c: 0, a: 0 }, perFormaga = {};
  resultat.forEach(r => {
    const u = r.uppgift;
    maxPoang.e += u.poang.e; maxPoang.c += u.poang.c; maxPoang.a += u.poang.a;
    if (r.korrekt) { poang.e += u.poang.e; poang.c += u.poang.c; poang.a += u.poang.a; }
    (u.formagor || []).forEach(k => {
      if (!perFormaga[k]) perFormaga[k] = { fick: 0, max: 0 };
      const p2 = u.poang.e + u.poang.c + u.poang.a;
      perFormaga[k].max += p2; if (r.korrekt) perFormaga[k].fick += p2;
    });
  });
  S.provresultat.push({ namn: p.namn, datum: idag(), ratta, antal: resultat.length, e: poang.e, c: poang.c, a: poang.a });
  if (!S.provKlara.includes(p.id)) S.provKlara.push(p.id);
  sparaState();

  const staplar = Object.entries(perFormaga).map(([k, v]) => {
    const pct = v.max ? Math.round((v.fick / v.max) * 100) : 0;
    return el('div', { klass: 'stapel' }, el('span', {}, FORMAGOR[k].namn),
      el('span', { klass: 'stapel-spar' }, el('span', { klass: 'stapel-fyll', style: `width:${pct}%` })), el('b', {}, `${v.fick}/${v.max}`));
  });

  /* Ingen fråga-för-fråga-facit här med avsikt: annars kan man göra om samma prov
     och bara rätta det man nu vet var fel — poäng totalt och per förmåga räcker. */
  skal(el('div', { style: 'padding-top:1.5rem' },
    el('span', { klass: 'etikett' }, 'Provresultat'), el('h1', { style: 'font-size:1.7rem;margin:.2rem 0 1rem' }, p.namn),
    el('div', { klass: 'kort resultatkort' },
      el('div', { klass: 'resultat-stor' }, `${poang.e}/${poang.c}/${poang.a}`),
      el('p', { style: 'color:var(--text-3);font-size:.85rem;margin:.3rem 0 0' }, `av max ${maxPoang.e}/${maxPoang.c}/${maxPoang.a} · ${ratta} av ${resultat.length} uppgifter rätt`)),
    el('div', { klass: 'kort', style: 'margin-top:.7rem' }, el('span', { klass: 'etikett' }, 'Per förmåga'), el('div', { klass: 'stapelrad' }, staplar)),
    el('p', { klass: 'hjalptext', style: 'margin-top:.8rem' }, 'Din lärare kan se hela genomgången. Fråga om du vill veta mer om vad som gick bra eller mindre bra.'),
    el('button', { klass: 'knapp bred stor', style: 'margin-top:1.2rem', onclick: () => gå('#/prov') }, 'Tillbaka')
  ), { navFlik: 'prov' });
}

/* =========================================================== FRAMSTEG */
function visaFramsteg() {
  const maxPerFormaga = {};
  allaFardigheter().forEach(f => f.uppgifter.forEach(u => (u.formagor || []).forEach(k => maxPerFormaga[k] = (maxPerFormaga[k] || 0) + 1)));
  const staplar = ['P', 'B', 'M', 'R', 'K'].map(k => {
    const fick = S.formagor[k] || 0, max = maxPerFormaga[k] || 1, pct = Math.round((fick / max) * 100);
    return el('div', { klass: 'formagestapel' },
      el('span', { klass: 'kod' }, k), el('span', { klass: 'namn' }, FORMAGOR[k].namn, el('small', {}, 'att ' + FORMAGOR[k].elevord)),
      el('span', { klass: 'varde' }, `${pct}%`),
      el('span', { klass: 'stapel-spar', style: 'grid-column:1/-1;margin-top:-.2rem' }, el('span', { klass: 'stapel-fyll', style: `width:${pct}%` })));
  });
  const veckan = senasteSjuDagar().reverse();
  const dagnamn = ['sö', 'må', 'ti', 'on', 'to', 'fr', 'lö'];
  const klaraFardigheter = allaFardigheter().filter(f => niva(f) === 5);
  const paborjade = allaFardigheter().filter(f => { const n = niva(f); return n > 0 && n < 5; });

  skal([
    el('div', { klass: 'karta-topp' }, el('h1', { klass: 'halsning' }, 'Dina framsteg'), el('p', { klass: 'halsning-under' }, `${sv(S.xp)} XP totalt · ${S.streak.dagar} dagars streak`)),
    el('div', { klass: 'kort formageruta' },
      el('span', { klass: 'etikett' }, 'De fem förmågorna i kursplanen'), el('div', { style: 'margin-top:.6rem' }, staplar),
      el('p', { klass: 'hjalptext', style: 'margin-top:.8rem' }, 'Andelen uppgifter du klarat som tränar respektive förmåga.')),
    el('div', { klass: 'kort', style: 'margin-top:.7rem' },
      el('span', { klass: 'etikett' }, 'Senaste veckan'),
      el('div', { klass: 'veckorad' }, veckan.map(d => el('span', { klass: 'dagsruta' + (S.dagarKlara.includes(d) ? ' klar' : '') + (d === idag() ? ' idag' : ''), title: d }, dagnamn[new Date(d).getDay()]))),
      el('p', { klass: 'hjalptext', style: 'margin-top:.6rem' }, `Frysningar kvar den här månaden: ${S.streak.frysningar}`)),
    el('div', { klass: 'omradesrubrik' }, el('h2', {}, 'Färdigheter'), el('span', { klass: 'strec' })),
    el('div', { klass: 'stig' },
      [...klaraFardigheter, ...paborjade].length === 0
        ? el('p', { klass: 'tomtext' }, 'Inget klart än. Börja på kartan.')
        : [...klaraFardigheter, ...paborjade].map(f => el('button', { klass: 'nod' + (niva(f) === 5 ? ' klar' : ''), onclick: () => gå(`#/trana/${f.id}`) },
            el('span', { klass: 'ring', style: `--p:${niva(f) * 20}` }, niva(f) === 5 ? ikon('bock', 16) : el('b', {}, `${niva(f)}/5`)),
            el('span', { klass: 'nod-txt' }, el('b', {}, f.namn), el('small', {}, `${fState(f.id).gjorda.length} av ${f.uppgifter.length} uppgifter`))))),
    el('button', { klass: 'knapp tyst bred', style: 'margin-top:1rem', onclick: () => gå('#/historik') },
      ikon('lager', 16), ' Se all historik →')
  ], { navFlik: 'framsteg' });
}

/* =========================================================== HISTORIK */
let historikFilter = 'alla';   // 'alla' | 'ratt' | 'fel'
function visaHistorik() {
  const poster = [...S.historik].reverse();
  const filtrerade = poster.filter(h => historikFilter === 'alla' || (historikFilter === 'ratt' ? h.ratt : !h.ratt));

  const rader = filtrerade.map(h => {
    const f = OMRADEN.flatMap(o => o.fardigheter).find(x => x.id === h.fardighetId);
    return el('div', { klass: 'facitrad' + (h.ratt ? ' ok' : '') },
      el('b', {}, `${h.ratt ? '✓' : '✗'} ${h.fraga.slice(0, 74)}${h.fraga.length > 74 ? '…' : ''}`),
      el('small', {}, `${f ? f.namn : 'Från din lärare'} · försök ${h.forsokNr} · ${h.datum}${h.xp ? ` · +${h.xp} xp` : ''}${h.lage === 'prov' ? ' · prov' : ''}`));
  });

  skal([
    el('div', { klass: 'karta-topp' },
      el('h1', { klass: 'halsning' }, 'All din historik'),
      el('p', { klass: 'halsning-under' }, `${S.historik.length} försök totalt, på ${new Set(S.historik.map(h => h.uppgiftId)).size} olika uppgifter`)),
    el('div', { klass: 'filterrad' },
      [['alla', 'Alla'], ['ratt', 'Rätt'], ['fel', 'Fel']].map(([id, namn]) =>
        el('button', { klass: 'knapp liten' + (historikFilter === id ? '' : ' tyst'), onclick: () => { historikFilter = id; visaHistorik(); } }, namn))),
    el('div', { klass: 'facit' },
      rader.length ? rader : el('p', { klass: 'tomtext' }, 'Inget här än — gör en uppgift så dyker den upp.'))
  ], { navFlik: 'framsteg' });
}

/* ======================================================= INSTÄLLNINGAR */
/* =============================================================== SOCIALT */
function visaSocialt(underflik) {
  const flikar = el('div', { klass: 'flikar', role: 'tablist' },
    [['chatt', 'Chatt'], ['installningar', 'Inställningar']].map(([id, namn]) =>
      el('button', { klass: 'flik', role: 'tab', 'aria-selected': underflik === id ? 'true' : 'false', onclick: () => gå(`#/socialt/${id}`) }, namn)));

  skal([
    el('div', { klass: 'karta-topp' }, el('h1', { klass: 'halsning' }, 'Socialt')),
    flikar,
    underflik === 'chatt' ? chattVy() : installningarVy()
  ], { navFlik: 'socialt' });
}

/* ---- Chatt: en overkligt fungerande mockup, se anteckningen i UI:t ---- */
const CHATT_TRADAR = [
  {
    id: 't1', titel: 'Fastnat på ekvationer 😩',
    meddelanden: [
      { fran: 'Elton D.', text: 'Har typ tolv olika sätt att lösa samma ekvation, orkar inte 😭' },
      { fran: 'Alicia M.', text: 'Testa balansmetoden, funkar typ alltid — samma sak på båda sidor' },
      { fran: 'Läraren', text: 'Bra tips Alicia! Kolla gärna genomgången i Lär-läget för Ekvationer också.' }
    ]
  },
  {
    id: 't2', titel: 'Procent vs procentenheter?? 🤯',
    meddelanden: [
      { fran: 'Tuva R.', text: 'Varför är 4%→6% inte bara "2%"?? provet sa fel på mig' },
      { fran: 'Läraren', text: '2 är antalet procentENHETER (skillnaden). Den procentuella ökningen är 2/4 = 50%.' },
      { fran: 'Noel B.', text: 'oh vänta det är faktiskt inte samma sak. tack' }
    ]
  },
  {
    id: 't3', titel: 'Bra jobbat-tråden 🎉',
    meddelanden: [
      { fran: 'Alicia M.', text: 'äntligen nivå 5 på bråkform!!' },
      { fran: 'Vincent K.', text: 'snyggt 🔥' }
    ]
  }
];
const CHATT_SVAR = [
  'Bra fråga! Kolla ledtrådarna om du fastnar igen.',
  'Precis, det är ett vanligt ställe att slarva på.',
  'Skriv gärna vilken uppgift det gäller så kan vi titta på den tillsammans.',
  'Snyggt tänkt!'
];
let oppenTrad = null;
function chattVy() {
  if (oppenTrad) return chattTradVy(oppenTrad);
  return el('div', {},
    el('div', { klass: 'notis' }, el('b', {}, 'Demo. '),
      'Ingen riktig chatt än — meddelanden når ingen på riktigt. Skulle kräva moderering och en riktig backend innan det här kan vara skarpt för minderåriga.'),
    el('div', { klass: 'stig' }, CHATT_TRADAR.map(t => el('button', { klass: 'nod', onclick: () => { oppenTrad = t.id; visaSocialt('chatt'); } },
      el('span', { klass: 'ring', style: '--p:100' }, ikon('chatt', 18)),
      el('span', { klass: 'nod-txt' }, el('b', {}, t.titel), el('small', {}, `${t.meddelanden.length} meddelanden`))))));
}
function chattTradVy(tradId) {
  const t = CHATT_TRADAR.find(x => x.id === tradId);
  const lista = el('div', { klass: 'facit' });
  function ritaMeddelanden() {
    lista.replaceChildren(...t.meddelanden.map(m => el('div', { klass: 'facitrad' + (m.fran === 'Du' ? ' ok' : '') },
      el('b', {}, m.fran), el('small', { style: 'display:block;margin-top:.1rem' }, m.text))));
  }
  ritaMeddelanden();
  const inp = el('input', { type: 'text', placeholder: 'Skriv ett meddelande…' });
  const skickaknapp = el('button', { klass: 'knapp', onclick: skicka }, ikon('skicka', 16));
  function skicka() {
    const text = inp.value.trim();
    if (!text) return;
    t.meddelanden.push({ fran: 'Du', text });
    inp.value = '';
    ritaMeddelanden();
    ljudSkickat();
    setTimeout(() => {
      t.meddelanden.push({ fran: 'Läraren', text: slump(CHATT_SVAR) });
      ritaMeddelanden();
      ljudSvarMottaget();
    }, 900);
  }
  inp.onkeydown = e => { if (e.key === 'Enter') skicka(); };

  return el('div', {},
    el('button', { klass: 'knapp tyst liten', style: 'margin-bottom:.8rem', onclick: () => { oppenTrad = null; visaSocialt('chatt'); } }, ikon('pilVanster', 14), ' Alla trådar'),
    el('h3', { style: 'margin-bottom:.7rem' }, t.titel),
    lista,
    el('div', { style: 'display:flex;gap:.5rem;margin-top:.8rem' }, inp, skickaknapp));
}

/* ---- Inställningar (samma innehåll som tidigare, nu en underflik) ---- */
function installningarVy() {
  function vippa(etikett, nyckel, beskrivning) {
    const knapp = el('button', {
      klass: 'vippa', role: 'switch', 'aria-checked': String(S.installningar[nyckel]), 'aria-label': etikett,
      onclick: e => { S.installningar[nyckel] = !S.installningar[nyckel]; e.currentTarget.setAttribute('aria-checked', String(S.installningar[nyckel])); sparaState(); if (nyckel === 'ljud' && S.installningar.ljud) ljudRatt(); }
    }, el('i', {}));
    return el('div', { klass: 'installningsrad' }, el('div', {}, el('span', {}, etikett), beskrivning ? el('p', { klass: 'hjalptext', style: 'margin:.1rem 0 0' }, beskrivning) : null), knapp);
  }
  return el('div', {},
    el('div', { klass: 'kort' }, vippa('Ljud', 'ljud', 'Korta signaler vid rätt och fel.'), vippa('Animationer', 'animationer', 'Följer även systemets inställning för minskad rörelse.')),
    el('div', { klass: 'kort', style: 'margin-top:.7rem' },
      el('span', { klass: 'etikett' }, 'Tema'),
      el('div', { style: 'display:flex;gap:.4rem;margin-top:.6rem;flex-wrap:wrap' },
        [['auto', 'Följ systemet'], ['ljust', 'Ljust'], ['morkt', 'Mörkt']].map(([v, n]) =>
          el('button', { klass: 'knapp liten' + (S.installningar.tema === v ? '' : ' tyst'), onclick: () => { S.installningar.tema = v; sparaState(); satTema(S.installningar); visaSocialt('installningar'); } }, n)))),
    el('div', { klass: 'kort', style: 'margin-top:.7rem' },
      el('span', { klass: 'etikett' }, 'Demo'),
      el('p', { style: 'font-size:.9rem;color:var(--text-2);margin:.5rem 0 .8rem' }, 'All progress sparas bara i den här webbläsaren.'),
      el('div', { style: 'display:flex;gap:.5rem;flex-wrap:wrap' },
        el('button', {
          klass: 'knapp tyst liten',
          onclick: () => {
            S.xp = 620; S.streak.dagar = 12; S.dagarKlara = senasteSjuDagar().slice(0, 5);
            allaFardigheter().slice(0, 5).forEach(f => {
              const st = fState(f.id);
              st.gjorda = f.uppgifter.slice(0, Math.ceil(f.uppgifter.length * 0.7)).map(u => u.id);
              st.gjorda.forEach(id => { const u = f.uppgifter.find(x => x.id === id); (u.formagor || []).forEach(k => S.formagor[k] = (S.formagor[k] || 0) + 1); });
            });
            sparaState(); gå('#/'); router();
          }
        }, 'Fyll med exempeldata'),
        el('button', { klass: 'knapp tyst liten', style: 'color:var(--fel)', onclick: () => { if (!confirm('Nollställ all progress?')) return; S = structuredClone(TOMT_ELEVSTATE); sparaState(); gå('#/'); router(); } }, 'Nollställ allt'))),
    el('p', { klass: 'kalla', style: 'text-align:center;margin-top:1.5rem' }, 'Rimligt — designutkast. Byggt efter frisläppta nationella prov åk 9, Skolverket / PRIM-gruppen.'));
}

/* ================================================================ START */
satTema(S.installningar);
router();
