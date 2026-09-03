/* ==========================================================================
   RIMLIGT — LÄRARAPPEN
   Egen liten app, separat från elevappen. Delar innehall.js och delat.js
   (samma origin/server delar localStorage, se "skoladata" nedan).
   ========================================================================== */

const app = $('#app');

/* Delad skoldata — SAMMA nyckel som elevappen läser. Lärarappen både
   läser och SKRIVER hit; elevappen läser bara. */
const TOM_SKOLA = { pinnadeUppgifter: [] };
const SKOLALAGRING = skapaLagring('rimligt.skola.v1', TOM_SKOLA);
let SKOLA = SKOLALAGRING.las();
function sparaSkola() { SKOLALAGRING.spara(SKOLA); }

/* Läser (men ändrar aldrig) den inloggade webbläsarens elevdata, om den
   finns, så att "Du"-raden i klasstabellen visar riktig progress istället
   för påhittad demodata — samma trick som i original-demon. */
const TOMT_ELEVSTATE = { xp: 0, fardigheter: {}, formagor: { P: 0, B: 0, M: 0, R: 0, K: 0 } };
function lasEgenElevdata() { return skapaLagring('rimligt.elev.v1', TOMT_ELEVSTATE).las(); }

function beraknaMinaNivaer(elevState) {
  const niv = {};
  OMRADEN.forEach(o => {
    const nivåer = o.fardigheter.map(f => {
      const st = elevState.fardigheter[f.id];
      if (!st) return 0;
      return Math.min(5, Math.round((st.gjorda.length / f.uppgifter.length) * 5));
    });
    niv[o.id] = nivåer.length ? Math.round(nivåer.reduce((a, b) => a + b, 0) / nivåer.length) : 0;
  });
  return niv;
}
function beraknaMinaFormagor(elevState) {
  const maxPerFormaga = {};
  allaFardigheter().forEach(f => f.uppgifter.forEach(u => (u.formagor || []).forEach(k => maxPerFormaga[k] = (maxPerFormaga[k] || 0) + 1)));
  const form = {};
  ['P', 'B', 'M', 'R', 'K'].forEach(k => form[k] = Math.round(((elevState.formagor[k] || 0) / (maxPerFormaga[k] || 1)) * 100));
  return form;
}

/* ================================================================ ROUTER */
let flik = 'klass';
let klassUnderflik = 'omraden';

function gå(f) { flik = f; rita(); }
function rita() {
  app.replaceChildren();
  app.append(topprad());
  const sida = el('div', { klass: 'sida bred' });
  sida.append(flikar());
  if (flik === 'klass') sida.append(klassvy());
  else if (flik === 'uppgifter') sida.append(uppgiftsvy());
  else if (flik === 'lektion') sida.append(lektionslage());
  app.append(sida);
}

function topprad() {
  return el('header', { klass: 'topp' },
    el('div', { klass: 'topp-inner bred' },
      el('a', { klass: 'markesnamn', href: '../', style: 'text-decoration:none' }, 'Rimligt', el('i', {}, '.'), el('span', { style: 'font-weight:400;color:var(--text-3);font-size:.8rem;margin-left:.5rem' }, 'lärare')),
      el('span', { klass: 'statchip' }, ikon('byggnad', 14), ' Klass 9C')
    ));
}

function flikar() {
  return el('div', { klass: 'flikar', role: 'tablist' },
    [['klass', 'anvandare2', 'Klass'], ['uppgifter', 'penna', 'Uppgifter'], ['lektion', 'stapel', 'Lektion']].map(([id, ik, namn]) =>
      el('button', { klass: 'flik', role: 'tab', 'aria-selected': flik === id ? 'true' : 'false', onclick: () => gå(id) }, ikon(ik, 15), ' ' + namn)));
}

/* ================================================================ KLASS */
function klassvy() {
  const egen = lasEgenElevdata();
  const elever = [
    ...DEMOKLASS.elever,
    { namn: 'Du', niv: beraknaMinaNivaer(egen), form: beraknaMinaFormagor(egen), senast: 'nu', jag: true }
  ];

  const underflikar = el('div', { klass: 'flikar', style: 'margin-top:0' },
    [['omraden', 'Per område'], ['formagor', 'Per förmåga']].map(([id, namn]) =>
      el('button', { klass: 'flik', onclick: () => { klassUnderflik = id; rita(); } , style: klassUnderflik === id ? '' : 'opacity:.6' }, namn)));

  return el('div', {},
    el('div', { klass: 'larartopp' },
      el('div', {},
        el('span', { klass: 'etikett' }, 'Klass 9C'),
        el('h1', {}, `${elever.length} elever`),
        el('p', { style: 'color:var(--text-3);font-size:.88rem;margin:.2rem 0 0' }, `${elever.filter(e => e.senast === 'idag' || e.jag).length} aktiva idag`)),
      el('div', { style: 'margin-left:auto;text-align:right' },
        el('span', { klass: 'etikett', style: 'display:block;margin-bottom:.25rem' }, 'Anslutningskod'),
        el('span', { klass: 'kodruta' }, DEMOKLASS.kod))),
    el('div', { klass: 'notis' }, el('b', {}, 'Demodata. '), 'Eleverna nedan är påhittade. Raden "Du" visar din egen progress i elevappen på den här datorn.'),
    underflikar,
    klassUnderflik === 'omraden' ? tabellOmraden(elever) : tabellFormagor(elever));
}

/* ============================================================= UPPGIFTER */
const FORMAGE_KODER = ['P', 'B', 'M', 'R', 'K'];

function uppgiftsvy() {
  let valdaFormagor = new Set();
  let svarstyp = 'number';

  const formulär = el('div', { klass: 'kort' });
  const lista = el('div', { klass: 'stig', style: 'margin-top:1rem' });

  function ritaLista() {
    lista.replaceChildren();
    const aktiva = (SKOLA.pinnadeUppgifter || []).filter(p => p.aktiv);
    if (!aktiva.length) { lista.append(el('p', { klass: 'tomtext' }, 'Inget pinnat just nu.')); return; }
    aktiva.slice().reverse().forEach(p => {
      lista.append(el('div', { klass: 'facitrad ok', style: 'display:flex;align-items:center;gap:.8rem;border-left-color:var(--primar)' },
        el('div', { style: 'flex:1' },
          el('b', {}, p.titel || 'Namnlös uppgift'),
          el('small', { style: 'display:block;margin-top:.15rem' }, p.fraga.slice(0, 90) + (p.fraga.length > 90 ? '…' : '')),
          el('small', { style: 'display:block;margin-top:.2rem;color:var(--text-3)' }, `Publicerad ${p.skapad} · ${(p.formagor || []).join(' ') || 'ingen förmåga vald'}`)),
        el('button', {
          klass: 'knapp tyst liten', style: 'color:var(--fel)',
          onclick: () => { p.aktiv = false; sparaSkola(); ritaLista(); }
        }, ikon('papperskorg', 15))));
    });
  }

  function ritaFormular() {
    formulär.replaceChildren();
    const titelInp = el('input', { type: 'text', placeholder: 'T.ex. "Extra träning: procentenheter"' });
    const fragaInp = el('textarea', { rows: '3', placeholder: 'Skriv frågan eleven ska se…', style: 'width:100%;font-family:inherit;font-size:.95rem;padding:.6rem .7rem;border:2px solid var(--linje);border-radius:var(--radie-s);background:var(--yta);color:var(--text);resize:vertical' });
    const svarInp = el('input', { type: 'text', placeholder: svarstyp === 'flerval' ? 'Alternativ, kommaseparerade' : 'Rätt svar' });
    const alt2Wrap = el('div', { klass: 'dold' });
    const rattIndexInp = el('input', { type: 'number', min: '0', placeholder: 'Index på rätt alternativ (0 = första)' });
    const ledtradInp = el('input', { type: 'text', placeholder: 'En kort ledtråd (valfritt)' });
    const losningInp = el('input', { type: 'text', placeholder: 'Kort lösningsrad (valfritt)' });

    const svarstypVal = el('div', { style: 'display:flex;gap:.4rem;margin-top:.3rem;flex-wrap:wrap' },
      [['number', 'Tal'], ['text', 'Text/bråk'], ['flerval', 'Flerval']].map(([v, n]) =>
        el('button', {
          klass: 'knapp liten' + (svarstyp === v ? '' : ' tyst'),
          onclick: () => { svarstyp = v; ritaFormular(); }
        }, n)));

    const formageChips = el('div', { style: 'display:flex;gap:.4rem;flex-wrap:wrap;margin-top:.3rem' },
      FORMAGE_KODER.map(k => el('button', {
        klass: 'knapp liten' + (valdaFormagor.has(k) ? '' : ' tyst'), type: 'button',
        onclick: e => { valdaFormagor.has(k) ? valdaFormagor.delete(k) : valdaFormagor.add(k); e.currentTarget.classList.toggle('tyst'); }
      }, `${k} · ${FORMAGOR[k].namn}`)));

    formulär.append(
      el('span', { klass: 'etikett' }, 'Skapa & pinna en uppgift'),
      el('h3', { style: 'margin-bottom:.7rem' }, 'Ny uppgift till klassen'),
      el('div', { style: 'display:grid;gap:.7rem' },
        felt('Titel (visas som rubrik på elevens kort)', titelInp),
        felt('Fråga', fragaInp),
        felt('Svarstyp', svarstypVal),
        felt(svarstyp === 'flerval' ? 'Alternativ (kommaseparerade)' : 'Rätt svar', svarInp),
        svarstyp === 'flerval' ? felt('Index på rätt alternativ', rattIndexInp) : null,
        felt('Vilka förmågor tränar uppgiften?', formageChips),
        felt('Ledtråd (valfritt)', ledtradInp),
        felt('Lösning (valfritt)', losningInp)
      ),
      el('div', { style: 'display:flex;gap:.6rem;margin-top:1rem;flex-wrap:wrap' },
        el('button', {
          klass: 'knapp', onclick: () => {
            if (!fragaInp.value.trim() || !svarInp.value.trim()) { alert('Fråga och svar krävs.'); return; }
            const post = {
              id: 'p' + Date.now(), titel: titelInp.value.trim() || 'Uppgift från läraren',
              fraga: fragaInp.value.trim(), typ: svarstyp,
              alternativ: svarstyp === 'flerval' ? svarInp.value.split(',').map(s => s.trim()).filter(Boolean) : undefined,
              ratt: svarstyp === 'flerval' ? Number(rattIndexInp.value || 0) : (svarstyp === 'number' ? tolkaTal(svarInp.value) : [svarInp.value.trim()]),
              svarsform: svarstyp === 'text' ? 'text' : undefined,
              formagor: [...valdaFormagor], ledtrad: ledtradInp.value.trim() || null, losning: losningInp.value.trim() || null,
              skapad: idag(), aktiv: true
            };
            SKOLA.pinnadeUppgifter = SKOLA.pinnadeUppgifter || [];
            SKOLA.pinnadeUppgifter.push(post);
            sparaSkola();
            valdaFormagor = new Set(); svarstyp = 'number';
            ritaFormular(); ritaLista();
          }
        }, ikon('skicka', 16), ' Publicera & pinna'),
        el('button', {
          klass: 'knapp tyst', disabled: true, title: 'Kommer i en framtida uppdatering'
        }, ikon('gnistra', 16), ' Auto-generera uppgifter')
      ),
      el('p', { klass: 'hjalptext', style: 'margin-top:.5rem' },
        'Auto-generera kommer i en framtida uppdatering — den ska föreslå uppgifter automatiskt utifrån vilka områden klassen är svagast i.')
    );
  }

  function felt(etikett, fältnod) {
    return el('label', { style: 'display:block' },
      el('span', { style: 'display:block;font-size:.82rem;color:var(--text-2);margin-bottom:.3rem;font-weight:600' }, etikett),
      fältnod);
  }

  ritaFormular(); ritaLista();
  return el('div', {},
    el('div', { klass: 'larartopp' }, el('h1', {}, 'Uppgifter')),
    formulär,
    el('div', { klass: 'omradesrubrik' }, el('h2', {}, 'Pinnat just nu'), el('span', { klass: 'strec' })),
    lista);
}

/* ============================================================= LEKTION */
function lektionslage() {
  const u = hittaUppgift('pro-2').uppgift;
  let avslojat = false;
  const yta = el('div', { klass: 'kort lektionsvy' });

  function rita2() {
    yta.replaceChildren();
    yta.append(el('span', { klass: 'etikett' }, 'Projicera för klassen'),
      el('p', { klass: 'fraga', style: 'margin:.6rem auto 1rem;max-width:24ch', html: matte(u.fraga) }));
    const svar = [
      { txt: 'Ökning med 2 %', andel: 41, ratt: false }, { txt: 'Ökning med 2 procentenheter', andel: 78, ratt: true },
      { txt: 'Ökning med 33 %', andel: 22, ratt: false }, { txt: 'Ökning med 50 %', andel: 36, ratt: true },
      { txt: 'Ökning med 67 %', andel: 9, ratt: false }
    ];
    yta.append(el('div', { klass: 'svarsfordelning' }, svar.map(s => el('div', { klass: 'fordelningsrad' },
      el('div', { klass: 'fordelningsstapel' },
        el('span', { klass: 'fordelningsfyll' + (avslojat && s.ratt ? ' ratt' : ''), style: `width:${s.andel}%` }),
        el('span', { klass: 'txt' }, s.txt + (avslojat && s.ratt ? '  ✓' : ''))),
      el('b', { style: 'font-family:var(--mono);font-size:.85rem' }, `${s.andel}%`)))));
    yta.append(el('p', { klass: 'hjalptext', style: 'margin-top:.9rem' },
      avslojat ? 'Diskutera varför 41 % svarade "2 %" — en begreppsförväxling värd tio minuter av lektionen.'
               : 'Alla elever har svarat på sin enhet. Diskutera fördelningen innan du visar facit.'));
    yta.append(el('div', { style: 'display:flex;gap:.5rem;justify-content:center;margin-top:1rem;flex-wrap:wrap' },
      el('button', { klass: 'knapp', onclick: () => { avslojat = !avslojat; rita2(); } }, avslojat ? 'Dölj facit' : 'Visa facit'),
      el('button', { klass: 'knapp tyst', onclick: () => alert('I en skarp version tilldelas repetition på procent till de 41 % som svarade fel.') }, 'Tilldela repetition')));
  }
  rita2();
  return el('div', {}, el('div', { klass: 'larartopp' }, el('h1', {}, 'Lektionsläge')), yta,
    el('p', { klass: 'hjalptext', style: 'margin-top:.8rem;text-align:center' }, 'Svarsfördelningen ovan är påhittad demodata.'));
}

/* ================================================================ START */
rita();
