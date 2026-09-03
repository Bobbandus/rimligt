# Rimligt — designutkast

En körbar demo av matteappen, uppdelad i **tre separata mini-appar** — en för elever, en för
lärare, en för kommunen — precis som en riktig inloggning skulle separera dem. Byggd för att
testa känslan och skruva på den, inte för att lanseras. Inget byggsteg, inga beroenden.

## Starta

**Lokalt (rekommenderat):** kör en enkel server i mappen, annars delar inte elev-, lärar- och
kommunappen samma `localStorage` (det är så "lärare publicerar en uppgift → eleven ser den"
kan vara på riktigt klickbart i demon).

```bash
python -m http.server 5177
```

Gå sedan till `http://localhost:5177/rimligt/` — du landar på en liten växlare med tre kort:
**Elev**, **Lärare**, **Kommun**. I en riktig version avgörs vilken av dem du ser av inloggningen,
inte av ett val på en startsida — den finns bara för att kunna visa alla tre sida vid sida.

Rent dubbelklick på `index.html` fungerar också för att titta runt, men cross-role-flödet
(lärare pinnar → elev ser det) kan bete sig olika mellan webbläsare på `file://`.

## Struktur

```
rimligt/
  index.html                 rollväxlare (bara en demo-startsida, tre länkar)
  css/stil.css                allt utseende, delas av alla tre apparna
  js/
    innehall.js                 läromedelsträdet: alla uppgifter, lektioner, kommun-demodata
    delat.js                     delad infrastruktur: DOM-hjälp, lagring, ljud, talformatering,
                                  bråk-/tallinjegrafik, de återanvända klasstabellerna
    ikoner.js                    eget litet SVG-ikonset (inga emoji, inga externa beroenden)
  elev/    index.html, elev-app.js      karta, lär, träna, prov, framsteg
  larare/  index.html, larare-app.js    klassöversikt, skapa & pinna uppgifter, lektionsläge
  kommun/  index.html, kommun-app.js    aggregerat läge per skola/lärare — inga elevnamn
```

`elev/`, `larare/` och `kommun/` är tre helt separata sidor med egen, kort meny — en elev
laddar aldrig kod som ens innehåller en lärarflik. De körs från samma origin/server, vilket
gör att de delar `localStorage` och kan simulera "riktig" skoldata utan en backend.

## Vad som finns

| Del | Var | Kommentar |
|---|---|---|
| Karta med nivåringar per färdighet | Elev → Karta | |
| **Lär** — guidad genomgång, kontrollfrågor | 📖-knappen i färdighetsarket | inkl. en **interaktiv** genomgång i Uppställning där du fyller i själv, kolumn för kolumn |
| **Träna** — ledtrådsstege, rätta-om-fel | ⚡-knappen | efter första ledtråden erbjuds även "se ett liknande, genomgånget exempel" |
| Rimlighetssteget | utvalda uppgifter | gissa storleken innan du räknar |
| Riktiga bråk-/tallinjegrafiker | Lär-läget i Bråkform & Rimlighet | ett riktigt streck i mitten för 1/2, inte text — proof-of-concept i två färdigheter |
| **Uppställningsverktyget** | Stödspår → Uppställning | egen knappsats, minnessiffror, **klicka på en siffra för att stryka över den och skriva ett justerat värde ovanför** (t.ex. vid lån) |
| Prov | Elev → Prov | timer, ingen återkoppling, E/C/A-poäng + resultat per förmåga |
| XP / streak / veckomål | överallt | |
| **Skapa & pinna en uppgift** | Lärare → Uppgifter | publicerar direkt till elevens karta ("Från din lärare") |
| Klassöversikt, per område/förmåga | Lärare → Klass | |
| Lektionsläge | Lärare → Lektion | projicerbar klassdiskussion med (påhittad) svarsfördelning |
| **Kommun-översikt** | Kommun → Översikt | aggregerat snitt för hela kommunen |
| **Skolor & lärare, anonymiserad drill-in** | Kommun → Skolor & lärare | klicka in på en klass → elever visas som "Elev 1", "Elev 2" …, aldrig med namn |
| Komma istället för punkt | sifferfält överallt | byts live medan du skriver, inte bara vid rättning |
| Mörkt/ljust tema, ljud av/på | ⚙ i elevappen | |

**Testa särskilt detta:**

1. **Lärare → Uppgifter**: publicera en uppgift, gå till elev-appen (samma server) och se den
   dyka upp pinnad överst på kartan — hela flödet fungerar på riktigt inom demon.
2. **Elev → Stödspår → Uppställning → Lär**: den guidade genomgången där du själv fyller i
   entalen, minnessiffran, tiotalen osv, en kolumn i taget.
3. **Elev → Stödspår → Uppställning → Träna**: klicka på en siffra i det övre talet för att
   stryka över den och skriva ett justerat värde ovanför.
4. **Kommun → Skolor & lärare**: klicka in på en lärare — kontrollera att inga riktiga elevnamn
   någonsin syns.

## Så skruvar du på den

**Färgtema** — `css/stil.css`, de ~40 första raderna. Byt `--primar` så följer hela appen med.

**Ikoner** — `js/ikoner.js`. Eget handritat set (samma idiom som fria strecikonbibliotek,
men ritat från grunden för att slippa licens-/korrekthetsrisk). Lägg till fler i `IKON_SVG`.

**Lägg till en uppgift** — `js/innehall.js`. Kopiera en befintlig uppgift i valfri färdighet.

**Lägg till fler bråk-/tallinjegrafiker** — sätt `visual: {typ:'brak', taljare, namnare}` eller
`visual: {typ:'tallinje', fran, till, punkt}` på valfritt lektionssteg i `innehall.js`.

## Innehållet

Ca 60 uppgifter över 12 färdigheter, kalibrerade mot de frisläppta nationella proven i
matematik åk 9 från 2016/17 och 2018/19 (Skolverket / PRIM-gruppen) — omskrivna, inte
kopierade. `kalla`-fältet visar vilken np-uppgift varje övning är byggd efter. Förmågekoderna
**P B M R K** och **E/C/A**-poängen följer PRIM-gruppens egen kodning i bedömningsanvisningarna.

## Vad som medvetet INTE finns

Riktiga konton/inloggning (rollväxlaren är bara en demoväxlare) · databas (allt sparas i
webbläsarens `localStorage`) · auto-genererade uppgifter (knappen finns, avsiktligt
inaktiverad — "kommande uppdatering") · AI-funktioner · geometri- och statistikområdena ·
flerspråkighet · uppställning för division och tvåsiffrig multiplikation · bråk-/tallinje-
grafik utanför de två färdigheter som har det.

Det här är ett designutkast. Ingenting här är byggt för att tåla riktiga elever eller
riktig elevdata — se avsnittet om GDPR/datalagring i produktspecifikationen för vad som
faktiskt krävs innan en skarp version kan hantera elevdata.

## Tillgänglighet

Tangentbordsnavigering genom hela flödet, `aria-label` på varje ruta i uppställningen,
`aria-live` på responsraden, synlig fokusmarkering, stöd för `prefers-reduced-motion`.
Siffrorna 1–9 väljer svarsalternativ. Kvarstår för WCAG 2.1 AA: fullständig
kontrastgranskning, riktig MathML-rendering, textbeskrivningar för figurer.
