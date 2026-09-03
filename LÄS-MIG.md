# Rimligt — designutkast

En körbar demo av matteappen, uppdelad i **fem separata mini-appar** under två ingångar —
**Elev** och **Personal** (Lärare / Rektor & mentor / Kommun) — precis som en riktig
inloggning skulle separera dem. Byggd för att testa känslan och skruva på den, inte för
att lanseras. Inget byggsteg, inga beroenden.

## Starta

```bash
python -m http.server 5177
```

Gå till `http://localhost:5177/rimligt/` — en liten växlare med två kort: **Elev** och
**Personal**. Personal leder vidare till en egen växlare med **Lärare**, **Rektor & mentor**
och **Kommun**. I en riktig version avgörs vilken vy du ser av inloggningen, inte av ett
val på en startsida.

Kör via servern (inte bara dubbelklick på `index.html`) om du vill testa flöden som går
mellan apparna — t.ex. att en lärare publicerar ett prov och eleven ser det — eftersom de
delar `localStorage` bara när de körs från samma origin.

## Struktur

```
rimligt/
  index.html                     rollväxlare: Elev / Personal
  personal/index.html             personal-växlare: Lärare / Rektor & mentor / Kommun
  css/stil.css                    allt utseende, delas av alla apparna
  js/
    innehall.js                     läromedelsträdet, årskurstaggning, kommun-demodata
    delat.js                        DOM-hjälp, lagring, ljud, talformatering, bråk-/
                                     tallinjegrafik, delade klasstabeller, Elevprofil
    ikoner.js                       eget SVG-ikonset, inga emoji, inga externa beroenden
  elev/    index.html, elev-app.js         karta, lär, träna, prov, framsteg, socialt
  larare/  index.html, larare-app.js       klass, uppgifter & prov, lektionsläge, profil
  rektor/  index.html, rektor-app.js       en skola, namngivna elever, elevprofil
  kommun/  index.html, kommun-app.js       hela kommunen, aldrig namngivna elever
```

## Vad som är nytt sedan förra rundan

**Bugfix**
- Sidan "hoppade" ibland vid scroll i lektion/träning — två sticky-headers krockade.
  Fixat med en uppmätt CSS-variabel (`--topp-h`) så de staplas rätt.

**Årskurs 7/8/9**
- Varje färdighet har nu en årskurstagg, sekvenserad efter Matteboken.se:s kapitelordning
  (vår egen tolkning av *ordningen* — Lgr22 delar inte upp innehållet år för år).
- Kartan har filterchips **Alla / Åk 7 / Åk 8 / Åk 9 / Extra repetition**.

**Historik**
- Varenda gjord uppgift, någonsin, med antal försök — `#/historik`, länkad från Framsteg.

**Prov ombyggt**
- "Prov" visar nu bara det din lärare faktiskt publicerat till klassen (eller låst upp med
  kod) — inga hårdkodade nationella-stiliserade prov längre.
- De gamla delprov B/D lever kvar som **Övningspass** på Kartan, med full återkoppling
  (ledtrådar, rättning direkt) — det är övning, inte ett skarpt prov.
- Lärare → Uppgifter har nu även **Skapa & publicera ett prov**: välj en mall eller kryssa
  ihop egna uppgifter, sätt tid/hjälpmedel/kod, publicera.

**Personal vs Elev, + Rektor & mentor**
- Rollerna är omstrukturerade: Elev för sig, Personal samlar Lärare/Rektor & mentor/Kommun.
- Ny **Rektor & mentor**-vy: som kommunens tabeller, men scopad till en skola och **med**
  riktiga elevnamn (till skillnad från kommunen, som aldrig visar namn).
- Ny **Elevprofil** (delad komponent): klicka ett elevnamn i lärarens eller rektorns
  klasstabell → nivåer, förmågor, och (bara för "Du" i din egen webbläsare) senaste försöken.
- Läraren kan nu ändra sitt visningsnamn under en ny **Profil**-flik.

**Socialt**
- Elevens fjärde flik heter nu **Socialt**, med Chatt och Inställningar som underflikar.
- Chatten är en **overkligt fungerande mockup** — påhittade trådar, skriv ett meddelande
  och få ett fördröjt påhittat svar. En tydlig notis i gränssnittet säger att det inte är
  en riktig chatt än och att den skulle behöva moderering och en backend innan den kan
  vara skarp för minderåriga.

**Kommun**
- Skolor & lärare-tabellen visar nu vilket ämne läraren undervisar i.

**Ljud**
- Fler distinkta, syntetiserade toner: streak-dag, prov publicerat/upplåst, pinnad uppgift
  (spelas bara första gången den dyker upp, inte vid varje sidladdning), helt pass klart
  (rikare arpeggio), chatt skickat/mottaget. Fortfarande bara `ton()` i `delat.js` — inga
  ljudfiler, ingen extern beroende.

## Testa särskilt detta

1. **Lärare → Uppgifter → Skapa & publicera ett prov**: välj mallen "Startkoll åk 9",
   publicera, kopiera koden. Gå till elev-appen, testa både att provet ligger listat
   automatiskt OCH att kodfältet låser upp det.
2. **Elev → Karta → Övningspass → Delprov B**: kontrollera att det ger ledtrådar och
   rättar direkt (övning), till skillnad från ett publicerat prov (ingen feedback förrän
   du lämnar in).
3. **Elev → Karta → filterchips**: byt mellan Åk 7/8/9, se att bara rätt färdigheter visas.
4. **Rektor & mentor → öppna en klass → klicka ett elevnamn**: elevprofilen öppnas med
   riktigt namn. Gör samma sak i Kommun → Skolor & lärare → drilla ner: namnen ska vara
   "Elev 1", "Elev 2" osv, aldrig riktiga.
5. **Elev → Socialt → Chatt**: öppna en tråd, skicka ett meddelande, se det påhittade svaret.
6. **Elev → Framsteg → Se all historik**: gör några uppgifter (rätt och fel) först.

## Vad som medvetet INTE finns

Riktiga konton/inloggning (växlarna är bara demoväxlare) · databas (allt sparas i
webbläsarens `localStorage`) · en riktig chatt (se notisen i appen) · auto-genererade
uppgifter (knappen finns, avsiktligt inaktiverad) · AI-funktioner · geometri- och
statistikområdena som egna färdigheter · flerspråkighet · uppställning för division och
tvåsiffrig multiplikation · serverkontroll av provkoder (se nedan).

**Värt att komma ihåg om det här någonsin blir skarpt:** kodfältet för att låsa upp prov
är helt okej nu (allt är klientsidan), men skulle behöva bli en riktig servervaliderad
kontroll innan det hanterar riktiga elever — inte bara ett objekt i webbläsaren.

## Innehållet

Ca 60 uppgifter över 12 färdigheter, kalibrerade mot de frisläppta nationella proven i
matematik åk 9 från 2016/17 och 2018/19 (Skolverket / PRIM-gruppen) — omskrivna, inte
kopierade. `kalla`-fältet visar vilken np-uppgift varje övning är byggd efter. Förmågekoderna
**P B M R K** och **E/C/A**-poängen följer PRIM-gruppens egen kodning i bedömningsanvisningarna.
Årskursordningen är inspirerad av Matteboken.se:s kapitelstruktur (Mattecentrum) — egen
tolkning av ordningen, ingen kopierad text (deras material är CC BY-NC-ND).

## Tillgänglighet

Tangentbordsnavigering genom hela flödet, `aria-label` på varje ruta i uppställningen,
`aria-live` på responsraden, synlig fokusmarkering, stöd för `prefers-reduced-motion`.
Siffrorna 1–9 väljer svarsalternativ. Kvarstår för WCAG 2.1 AA: fullständig
kontrastgranskning, riktig MathML-rendering, textbeskrivningar för figurer.
