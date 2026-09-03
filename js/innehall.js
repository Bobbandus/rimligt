/* ==========================================================================
   INNEHÅLL — allt läromedelsinnehåll ligger här, separerat från koden.
   Du kan lägga till uppgifter utan att röra app.js.

   Varje uppgift ska ha:
     typ        number | text | flerval | flersvar | uppstallning
     niva       1–5   (styr när uppgiften dyker upp i träningen)
     eca        'E' | 'C' | 'A'   → styr XP (10 / 20 / 35)
     poang      {e,c,a}           → provets notation, t.ex. (1/2/0)
     formagor   ['P','B','M','R','K']
     centralt   vilken punkt i centralt innehåll uppgiften hör till
     ledtradar  3 st, från mjuk knuff till nästan hela lösningen
     losning    rad för rad, visas efter två fel i rad
     kalla      valfri referens till frisläppt nationellt prov
   ========================================================================== */

const FORMAGOR = {
  P: { kod: 'P', namn: 'Problemlösning', elevord: 'lösa problem',
       text: 'formulera och lösa problem samt värdera valda strategier' },
  B: { kod: 'B', namn: 'Begrepp', elevord: 'fatta begrepp',
       text: 'använda och analysera matematiska begrepp och samband mellan begrepp' },
  M: { kod: 'M', namn: 'Metod', elevord: 'välja metod',
       text: 'välja och använda lämpliga metoder för beräkningar och rutinuppgifter' },
  R: { kod: 'R', namn: 'Resonemang', elevord: 'resonera',
       text: 'föra och följa matematiska resonemang' },
  K: { kod: 'K', namn: 'Kommunikation', elevord: 'förklara hur du tänker',
       text: 'använda matematikens uttrycksformer för att samtala om och redogöra för frågeställningar, beräkningar och slutsatser' }
};

const KURS = {
  id: 'lgr22-ma-79',
  laroplan: 'Lgr22',
  amne: 'Matematik',
  namn: 'Matematik åk 7–9'
};

const OMRADEN = [

/* ======================================================================
   OMRÅDE 1 — TALUPPFATTNING
   ====================================================================== */
{
  id: 'tal',
  namn: 'Taluppfattning',
  kort: 'Tal',
  farg: 'lila',
  fardigheter: [

  /* ---------------------------------------------------------------- */
  {
    id: 'prioritering',
    namn: 'Prioriteringsregler',
    beskrivning: 'Vilket räknesätt går först?',
    centralt: 'Metoder för beräkningar med tal i bråk- och decimalform vid huvudräkning och skriftlig beräkning.',
    lektion: {
      steg: [
        { rubrik: 'Ordningen är inte från vänster till höger',
          text: 'Många räknar 4 + 3 · 6 som (4 + 3) · 6 = 42. Det är fel. Multiplikation och division går alltid <b>före</b> addition och subtraktion.',
          exempel: ['4 + 3 · 6', '= 4 + 18   ← multiplikationen först', '= 22'] },
        { rubrik: 'Hela ordningen',
          text: 'Parenteser → potenser → multiplikation och division → addition och subtraktion. Inom samma nivå räknar du från vänster till höger.',
          exempel: ['20 − 5 · 2 + 3', '= 20 − 10 + 3', '= 10 + 3', '= 13'],
          fraga: { fraga: 'Vad är 2 + 5 · 4?', alternativ: ['28', '22', '11'], ratt: 1 } },
        { rubrik: 'Decimaler ändrar ingenting',
          text: 'Samma regler gäller även med kommatecken. Ett vanligt provsätt är att gömma en multiplikation med 0,5 — som ju är samma sak som att halvera.',
          exempel: ['36 − 6 · 0,5', '= 36 − 3', '= 33'],
          fraga: { fraga: 'Vad är 10 − 4 · 0,5?', alternativ: ['3', '8', '7'], ratt: 1 } }
      ]
    },
    uppgifter: [
      { id: 'pri-1', typ: 'number', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        fraga: 'Beräkna  36 − 6 · 0,5',
        ratt: 33,
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 1',
        rimlighet: { fraga: 'Innan du räknar — ungefär hur stort blir svaret?',
                     alternativ: ['Runt 15', 'Runt 33', 'Runt 150'], ratt: 1,
                     forklaring: 'Du drar bort något litet från 36, så svaret ligger strax under 36.' },
        ledtradar: ['Vilket räknesätt måste du göra först?',
                    'Multiplikation går före subtraktion. Räkna ut 6 · 0,5 först.',
                    '6 · 0,5 = 3. Sedan 36 − 3.'],
        losning: ['36 − 6 · 0,5', '= 36 − 3', '= 33'] },

      { id: 'pri-2', typ: 'number', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        fraga: 'Beräkna  20 − 5 · 2 + 3',
        ratt: 13,
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 1',
        ledtradar: ['Leta upp multiplikationen först.',
                    '5 · 2 = 10. Nu har du 20 − 10 + 3.',
                    'Räkna sedan från vänster: 20 − 10 = 10, och 10 + 3 = 13.'],
        losning: ['20 − 5 · 2 + 3', '= 20 − 10 + 3', '= 10 + 3', '= 13'] },

      { id: 'pri-3', typ: 'number', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        fraga: 'Beräkna  (7 + 3) · 4 − 12',
        ratt: 28,
        ledtradar: ['Parentesen först.',
                    '(7 + 3) = 10. Nu har du 10 · 4 − 12.',
                    '10 · 4 = 40, sedan 40 − 12.'],
        losning: ['(7 + 3) · 4 − 12', '= 10 · 4 − 12', '= 40 − 12', '= 28'] },

      { id: 'pri-4', typ: 'flerval', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M','B'],
        fraga: 'Vilket uttryck ger samma värde som  8 + 2 · 5 ?',
        alternativ: ['(8 + 2) · 5', '8 + (2 · 5)', '(8 · 2) + 5'],
        ratt: 1,
        ledtradar: ['Var sätter du parentesen om du vill visa vad som räknas först?',
                    'Multiplikationen görs först — parentesen ska ligga runt den.',
                    '8 + 2 · 5 betyder alltså 8 + (2 · 5) = 18.'],
        losning: ['8 + 2 · 5', 'Multiplikationen går först, alltså 8 + (2 · 5)', '= 8 + 10 = 18'] },

      { id: 'pri-5', typ: 'number', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M'],
        fraga: 'Beräkna  50 − 3 · (8 − 2)² ∶ 9',
        ratt: 38,
        ledtradar: ['Börja innerst — vad står i parentesen?',
                    '(8 − 2) = 6, och 6² = 36. Nu har du 50 − 3 · 36 ∶ 9.',
                    'Multiplikation och division tas från vänster: 3 · 36 = 108, sedan 108 ∶ 9 = 12.'],
        losning: ['50 − 3 · (8 − 2)² ∶ 9', '= 50 − 3 · 6² ∶ 9', '= 50 − 3 · 36 ∶ 9',
                  '= 50 − 108 ∶ 9', '= 50 − 12', '= 38'] }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'brak',
    namn: 'Bråkform',
    beskrivning: 'Addera, multiplicera och förenkla bråk',
    centralt: 'Reella tal och deras egenskaper samt beräkningar med tal i bråkform.',
    lektion: {
      steg: [
        { rubrik: 'Samma nämnare först',
          text: 'Du kan bara addera bråk som är delade i lika stora bitar. Har de olika nämnare måste du först skriva om dem så att nämnarna blir lika. Så här ser till exempel 1/2 ut — inte som text, utan som en yta delad på mitten:',
          visual: { typ: 'brak', taljare: 1, namnare: 2 },
          exempel: ['1/2 + 1/3', '= 3/6 + 2/6   ← båda skrivs i sjättedelar', '= 5/6'] },
        { rubrik: 'Hitta en gemensam nämnare',
          text: 'Enklast: multiplicera nämnarna med varandra. Det ger alltid en fungerande gemensam nämnare, även om den inte alltid är den minsta.',
          exempel: ['1/7 + 1/5', 'Gemensam nämnare: 7 · 5 = 35', '= 5/35 + 7/35', '= 12/35'],
          fraga: { fraga: 'Vilken gemensam nämnare fungerar för 1/4 + 1/6?', alternativ: ['10', '24', '2'], ratt: 1 } },
        { rubrik: 'Multiplikation är enklare än addition',
          text: 'Vid multiplikation behöver du ingen gemensam nämnare. Du multiplicerar täljare med täljare och nämnare med nämnare.',
          exempel: ['1/7 · 1/5', '= (1 · 1) / (7 · 5)', '= 1/35'],
          fraga: { fraga: 'Vad är 2/3 · 1/4?', alternativ: ['2/12', '3/7', '2/7'], ratt: 0 } }
      ]
    },
    uppgifter: [
      { id: 'brk-1', typ: 'text', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        fraga: 'Beräkna och svara i bråkform:  1/7 + 1/5',
        ratt: ['12/35'], svarsform: 'brak',
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 9a',
        ledtradar: ['Nämnarna är olika. Vad måste du göra först?',
                    'Gör om båda till trettiofemtedelar: 7 · 5 = 35.',
                    '1/7 = 5/35 och 1/5 = 7/35. Addera täljarna.'],
        losning: ['1/7 + 1/5', 'Gemensam nämnare: 7 · 5 = 35', '= 5/35 + 7/35', '= 12/35'] },

      { id: 'brk-2', typ: 'text', niva: 2, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M'],
        fraga: 'Beräkna och svara i bråkform:  1/7 · 1/5',
        ratt: ['1/35'], svarsform: 'brak',
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 9b',
        ledtradar: ['Behöver du gemensam nämnare vid multiplikation?',
                    'Nej. Multiplicera täljarna för sig och nämnarna för sig.',
                    '1 · 1 = 1 och 7 · 5 = 35.'],
        losning: ['1/7 · 1/5', '= (1 · 1) / (7 · 5)', '= 1/35'] },

      { id: 'brk-3', typ: 'text', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['B','M'],
        fraga: 'Vad är hälften av 1/9? Svara med ett tal i bråkform.',
        ratt: ['1/18'], svarsform: 'brak',
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 3',
        ledtradar: ['Hälften av något är samma sak som att multiplicera med 1/2.',
                    'Alltså 1/9 · 1/2.',
                    'Täljare: 1 · 1 = 1. Nämnare: 9 · 2 = 18.'],
        losning: ['Hälften av 1/9 = 1/9 · 1/2', '= 1/18',
                  'Kontroll: 1/18 + 1/18 = 2/18 = 1/9 ✓'] },

      { id: 'brk-4', typ: 'text', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M'],
        fraga: 'Beräkna och svara i enklaste bråkform:  3/4 − 2/3',
        ratt: ['1/12'], svarsform: 'brak',
        kalla: 'Np åk 9 2016/17, delprov C, uppgift 23b',
        ledtradar: ['Gemensam nämnare först.',
                    '4 · 3 = 12. Skriv om båda bråken i tolftedelar.',
                    '3/4 = 9/12 och 2/3 = 8/12.'],
        losning: ['3/4 − 2/3', 'Gemensam nämnare: 12', '= 9/12 − 8/12', '= 1/12'] },

      { id: 'brk-5', typ: 'flerval', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['B','R'],
        fraga: 'Bråken i subtraktionerna är byggda på ett särskilt sätt: nämnaren är 1 större än täljaren, och det första bråkets täljare har samma värde som det andra bråkets nämnare. Vilken subtraktion stämmer med beskrivningen?',
        alternativ: ['4/5 − 3/4', '4/3 − 5/4', '3/4 − 4/5', '5/4 − 4/3'],
        ratt: 0,
        kalla: 'Np åk 9 2016/17, delprov C, uppgift 23c',
        ledtradar: ['Kolla först villkoret "nämnaren är 1 större än täljaren" på båda bråken.',
                    'I 4/5 är 5 = 4 + 1 ✓ och i 3/4 är 4 = 3 + 1 ✓. Stämmer det för de andra?',
                    'Sedan: första bråkets täljare (4) ska vara lika med andra bråkets nämnare (4). ✓'],
        losning: ['Villkor 1: nämnare = täljare + 1.',
                  '4/5 ✓ (5 = 4+1) och 3/4 ✓ (4 = 3+1)',
                  'Villkor 2: första täljaren = andra nämnaren.',
                  'Första täljaren är 4, andra nämnaren är 4 ✓',
                  'Svar: 4/5 − 3/4'] },

      { id: 'brk-6', typ: 'text', niva: 4, eca: 'A', poang: {e:0,c:0,a:1}, formagor: ['B','R','K'],
        fraga: 'Fortsätt mönstret från förra uppgiften. Vad blir  a/(a+1) − (a−1)/a  förenklat? Svara på formen 1/uttryck (skriv nämnaren med a).',
        ratt: ['1/(a(a+1))','1/(a*(a+1))','1/(a²+a)','1/(a^2+a)','1/a(a+1)'], svarsform: 'text',
        kalla: 'Np åk 9 2016/17, delprov C, uppgift 23g',
        ledtradar: ['Sätt båda bråken på gemensam nämnare a(a+1).',
                    'Täljarna blir a · a och (a−1)(a+1).',
                    'a² − (a² − 1) = 1. Nämnaren blir a(a+1).'],
        losning: ['a/(a+1) − (a−1)/a',
                  'Gemensam nämnare: a(a+1)',
                  '= a·a / (a(a+1))  −  (a−1)(a+1) / (a(a+1))',
                  '= (a² − (a² − 1)) / (a(a+1))',
                  '= 1 / (a(a+1))',
                  'Sambandet gäller alltså alltid — täljaren blir alltid 1.'] }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'potens',
    namn: 'Potenser & grundpotensform',
    beskrivning: 'Stora och små tal, tiopotenser',
    centralt: 'Potensform för att uttrycka små och stora tal samt användning av prefix.',
    lektion: {
      steg: [
        { rubrik: 'Grundpotensform',
          text: 'Ett tal i grundpotensform skrivs som ett tal mellan 1 och 10, gånger en tiopotens. Antalet steg du flyttar kommatecknet blir exponenten.',
          exempel: ['46 000 000', '= 4,6 · 10 000 000', '= 4,6 · 10⁷'] },
        { rubrik: 'Räkna stegen',
          text: 'Flytta kommat tills bara en siffra står kvar före det. Räkna hur många steg du flyttade — det är exponenten.',
          exempel: ['4 6 0 0 0 0 0 0,', '← 7 steg', '= 4,6 · 10⁷'],
          fraga: { fraga: 'Hur skrivs 520 000 i grundpotensform?', alternativ: ['52 · 10⁴', '5,2 · 10⁵', '5,2 · 10⁶'], ratt: 1 } },
        { rubrik: 'Potens av potens',
          text: 'När du höjer en potens till en ny potens multiplicerar du exponenterna.',
          exempel: ['(10²)³ = 10^(2·3) = 10⁶', '100¹² = (10²)¹² = 10²⁴'],
          fraga: { fraga: 'Vad är (10³)²?', alternativ: ['10⁵', '10⁶', '10⁹'], ratt: 1 } }
      ]
    },
    uppgifter: [
      { id: 'pot-1', typ: 'text', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['B','M'],
        fraga: 'Skriv talet 46 000 000 i grundpotensform.',
        ratt: ['4,6·10^7','4,6*10^7','4.6·10^7','4.6*10^7','4,6 · 10^7','4,6x10^7'], svarsform: 'text',
        hjalptext: 'Skriv som  4,6·10^7',
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 3',
        ledtradar: ['Var ska kommatecknet stå? Bara en siffra före kommat.',
                    '4,6 — hur många steg flyttade du kommat?',
                    'Sju steg. Alltså 4,6 · 10⁷.'],
        losning: ['46 000 000', 'Flytta kommat till 4,6 — det är 7 steg', '= 4,6 · 10⁷'] },

      { id: 'pot-2', typ: 'text', niva: 2, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['B','M'],
        fraga: 'Vilket tal är dubbelt så stort som 2,4 · 10⁸? Svara i grundpotensform.',
        ratt: ['4,8·10^8','4,8*10^8','4.8·10^8','4.8*10^8','4,8 · 10^8'], svarsform: 'text',
        hjalptext: 'Skriv som  4,8·10^8',
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 14',
        ledtradar: ['Dubbelt så stort betyder gånger 2.',
                    'Multiplicera bara talet framför tiopotensen: 2,4 · 2.',
                    '4,8 ligger fortfarande mellan 1 och 10, så exponenten ändras inte.'],
        losning: ['2 · (2,4 · 10⁸)', '= 4,8 · 10⁸',
                  '4,8 ligger mellan 1 och 10 → redan i grundpotensform ✓'] },

      { id: 'pot-3', typ: 'flerval', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['B'],
        fraga: 'Vilket tal är störst?',
        alternativ: ['2⁴', '√35', '2π', '3²', '√80'],
        ratt: 4,
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 12',
        ledtradar: ['Räkna ut ungefär hur stort varje alternativ är.',
                    '2⁴ = 16, 3² = 9, 2π ≈ 6,3, √35 ≈ 5,9.',
                    '√80 ≈ 8,9 … men jämför noga med 2⁴ = 16. Vilket är egentligen störst?'],
        losning: ['2⁴ = 16', '√35 ≈ 5,9', '2π ≈ 6,28', '3² = 9', '√80 ≈ 8,94',
                  'Störst är 2⁴ = 16.'],
        rattJustering: 0 },

      { id: 'pot-4', typ: 'number', niva: 4, eca: 'A', poang: {e:0,c:0,a:1}, formagor: ['B'],
        fraga: 'Ange ett värde på x så att likheten stämmer:  100¹² = 10ˣ',
        ratt: 24,
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 20',
        ledtradar: ['Kan du skriva 100 som en tiopotens?',
                    '100 = 10². Alltså 100¹² = (10²)¹².',
                    'När du höjer en potens till en potens multiplicerar du exponenterna.'],
        losning: ['100¹² = (10²)¹²', '= 10^(2 · 12)', '= 10²⁴', 'x = 24'] },

      { id: 'pot-5', typ: 'text', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['B','M'],
        fraga: 'Skriv 0,00042 i grundpotensform.',
        ratt: ['4,2·10^-4','4,2*10^-4','4.2·10^-4','4.2*10^-4','4,2 · 10^-4'], svarsform: 'text',
        hjalptext: 'Skriv som  4,2·10^-4',
        ledtradar: ['Små tal ger negativ exponent.',
                    'Flytta kommat åt höger tills du får 4,2. Hur många steg?',
                    'Fyra steg åt höger → exponenten är −4.'],
        losning: ['0,00042', 'Flytta kommat 4 steg åt höger → 4,2', 'Åt höger ger negativ exponent',
                  '= 4,2 · 10⁻⁴'] }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'rimlighet',
    namn: 'Rimlighet & överslag',
    beskrivning: 'Är svaret ens möjligt?',
    centralt: 'Rimlighetsbedömning vid uppskattningar och beräkningar i vardagliga och matematiska situationer.',
    lektion: {
      steg: [
        { rubrik: 'Gissa innan du räknar',
          text: 'Det här är den vanligaste anledningen till onödiga fel: eleven räknar rätt men märker inte att svaret är orimligt. Vänj dig vid att uppskatta storleken <b>först</b> — landa ungefär på en punkt på tallinjen innan du räknar exakt.',
          visual: { typ: 'tallinje', fran: 0, till: 40, punkt: 30 },
          exempel: ['13 ∶ 0,432', 'Nämnaren är ungefär 0,4 — alltså mindre än 1', 'Att dela med något under 1 gör svaret STÖRRE', 'Svaret måste vara större än 13'] },
        { rubrik: 'Avrunda till enkla tal',
          text: 'Byt ut talen mot närmaste enkla tal och räkna i huvudet. Du behöver inte exakt svar — du behöver veta storleksordningen.',
          exempel: ['13 ∶ 0,432 ≈ 12 ∶ 0,4', '= 120 ∶ 4', '= 30'],
          fraga: { fraga: '198 · 0,52 är ungefär…', alternativ: ['ca 10', 'ca 100', 'ca 400'], ratt: 1 } },
        { rubrik: 'Enheter är också rimlighet',
          text: 'En liter är 10 dl och 100 cl. Ett svar i fel enhet är ofta 10 eller 100 gånger fel — ett klassiskt provfel.',
          exempel: ['0,4 dl = 4 cl', '40 cl = 4 dl', 'De är alltså INTE lika stora'],
          fraga: { fraga: 'Hur många cl är 0,4 liter?', alternativ: ['4 cl', '40 cl', '400 cl'], ratt: 1 } }
      ]
    },
    uppgifter: [
      { id: 'rim-1', typ: 'flerval', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['R','M'],
        fraga: 'Vilket av följande tal är det bästa närmevärdet till  13 ∶ 0,432 ?',
        alternativ: ['0,03', '0,3', '3', '30', '300'],
        ratt: 3,
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 4',
        ledtradar: ['Du delar med ett tal som är mindre än 1. Blir svaret större eller mindre än 13?',
                    'Att dela med ett tal under 1 gör svaret större. Alltså mer än 13.',
                    'Avrunda: 13 ∶ 0,4 ≈ 12 ∶ 0,4 = 30.'],
        losning: ['0,432 ≈ 0,4', '13 ∶ 0,4', '= 130 ∶ 4', '≈ 32,5', 'Bästa närmevärdet: 30'] },

      { id: 'rim-2', typ: 'number', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M','P'],
        fraga: 'Till hur många tvättar räcker 1 liter tvättmedel om hushållet använder 0,04 liter per tvätt?',
        ratt: 25, enhet: 'tvättar',
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 5',
        rimlighet: { fraga: 'Ungefär hur många tvättar blir det?',
                     alternativ: ['Under 10', 'Mellan 10 och 50', 'Över 100'], ratt: 1,
                     forklaring: '0,04 liter är ungefär 1/25 liter, så det räcker till ett par tiotal tvättar.' },
        ledtradar: ['Hur många gånger går 0,04 i 1?',
                    'Det är en division: 1 ∶ 0,04.',
                    'Förläng med 100: 100 ∶ 4 = 25.'],
        losning: ['1 ∶ 0,04', '= 100 ∶ 4', '= 25 tvättar'] },

      { id: 'rim-3', typ: 'flersvar', niva: 3, eca: 'A', poang: {e:0,c:0,a:1}, formagor: ['B','R'],
        fraga: 'Vilka mått är lika stora? Markera alla som hör ihop.',
        alternativ: ['40 cl', '0,4 dl', '4 dm³', '40 cm³', '0,4 l'],
        ratt: [0, 4],
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 19',
        ledtradar: ['Skriv om allt till samma enhet — till exempel liter.',
                    '1 liter = 10 dl = 100 cl = 1 dm³ = 1000 cm³.',
                    '40 cl = 0,4 l. Och 0,4 dl = 0,04 l. Vilka två blir lika?'],
        losning: ['40 cl = 0,4 l  ✓', '0,4 dl = 0,04 l', '4 dm³ = 4 l', '40 cm³ = 0,04 l',
                  '0,4 l = 0,4 l  ✓', 'Lika stora: 40 cl och 0,4 l'] },

      { id: 'rim-4', typ: 'number', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M','B'],
        fraga: 'Hur många timmar och minuter är 8,4 h? Ange antalet minuter (utöver de 8 hela timmarna).',
        ratt: 24, enhet: 'min',
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 7',
        ledtradar: ['0,4 timmar är INTE 40 minuter. Varför inte?',
                    'En timme har 60 minuter, inte 100.',
                    'Räkna 0,4 · 60.'],
        losning: ['8,4 h = 8 h + 0,4 h', '0,4 · 60 = 24 min', 'Svar: 8 h 24 min',
                  'Vanligt fel: att svara 40 min.'] },

      { id: 'rim-5', typ: 'number', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M','P'],
        fraga: 'En vattenkran läcker en droppe varannan sekund. En droppe är 0,05 ml. Hur många liter läcker kranen på ett dygn?',
        ratt: 2.16, enhet: 'liter', tolerans: 0.01,
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 23',
        rimlighet: { fraga: 'Ungefär hur mycket blir det på ett dygn?',
                     alternativ: ['Några droppar', 'Ett par liter', 'Hundratals liter'], ratt: 1,
                     forklaring: 'Droppen är pytteliten, men det blir tiotusentals droppar på ett dygn.' },
        ledtradar: ['Hur många sekunder går det på ett dygn?',
                    '24 · 60 · 60 = 86 400 sekunder. En droppe varannan sekund ger 43 200 droppar.',
                    '43 200 · 0,05 ml = 2 160 ml. Gör om till liter.'],
        losning: ['Sekunder per dygn: 24 · 60 · 60 = 86 400',
                  'Droppar: 86 400 ∶ 2 = 43 200',
                  'Volym: 43 200 · 0,05 = 2 160 ml',
                  '2 160 ml = 2,16 liter'] }
    ]
  },

  /* ---------------------------------------------------------------- */
  {
    id: 'procent',
    namn: 'Procent & procentenheter',
    beskrivning: 'Förändring, förändringsfaktor och den klassiska fällan',
    centralt: 'Procent för att uttrycka förändring och förändringsfaktor samt beräkningar med procent i vardagliga situationer.',
    lektion: {
      steg: [
        { rubrik: 'Procent av vad?',
          text: 'Procent är alltid en andel av något. När något ändras måste du veta vad du utgår ifrån — det är där nästan alla fel uppstår.',
          exempel: ['Räntan går från 4 % till 6 %', 'Skillnaden är 2 procentenheter', 'Men ökningen är 2/4 = 50 %'] },
        { rubrik: 'Procent ≠ procentenheter',
          text: '<b>Procentenheter</b> är skillnaden i själva procenttalen. <b>Procent</b> är hur mycket det ökat i förhållande till startvärdet. Provet testar detta nästan varje år.',
          exempel: ['4 % → 6 %', 'Procentenheter: 6 − 4 = 2', 'Procent: 2 ∶ 4 = 0,5 = 50 %'],
          fraga: { fraga: 'Priset ökar från 20 % till 25 %. Hur många procentenheter är det?', alternativ: ['5 procentenheter', '25 procentenheter', '5 procent'], ratt: 0 } },
        { rubrik: 'Förändringsfaktor',
          text: 'Multiplicera med förändringsfaktorn istället för att räkna ut ökningen separat. En höjning med 3 % ger faktorn 1,03. En sänkning med 10 % ger faktorn 0,90.',
          exempel: ['3 500 kr höjs 3 % och sänks sedan 10 %', '= 3 500 · 1,03 · 0,90'],
          fraga: { fraga: 'Vilken förändringsfaktor motsvarar en sänkning med 25 %?', alternativ: ['0,25', '0,75', '1,25'], ratt: 1 } }
      ]
    },
    uppgifter: [
      { id: 'pro-1', typ: 'number', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        fraga: 'Ett år regnade det 350 av årets 365 dagar. Hur många procent av årets dagar regnade det? Avrunda till hela procent.',
        ratt: 96, enhet: '%', tolerans: 0.5,
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 22b',
        ledtradar: ['Andelen är delen delat med det hela.',
                    '350 ∶ 365 = ?',
                    'Multiplicera resultatet med 100 för att få procent.'],
        losning: ['350 ∶ 365 ≈ 0,9589', '0,9589 · 100 ≈ 95,9 %', '≈ 96 %'] },

      { id: 'pro-2', typ: 'flersvar', niva: 2, eca: 'C', poang: {e:1,c:1,a:0}, formagor: ['B','R'],
        fraga: 'Räntesatsen ökar från 4 % till 6 %. Vilket eller vilka påståenden stämmer? Markera alla rätta.',
        alternativ: ['Ökning med 2 %', 'Ökning med 2 procentenheter', 'Ökning med 33 %',
                     'Ökning med 50 %', 'Ökning med 50 procentenheter', 'Ökning med 67 %'],
        ratt: [1, 3],
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 13',
        ledtradar: ['Två olika saker frågas: skillnaden i procentenheter, och den procentuella ökningen.',
                    'Skillnaden 6 − 4 = 2. Det är 2 procentenheter.',
                    'Den procentuella ökningen: 2 ∶ 4 = 0,5 = 50 %.'],
        losning: ['Skillnad i procentenheter: 6 − 4 = 2 procentenheter ✓',
                  'Procentuell ökning: (6 − 4) ∶ 4 = 2 ∶ 4 = 0,5 = 50 % ✓',
                  'Fel: "2 %" — 2 är antalet procentenheter, inte procent.',
                  'Fel: "33 %" — det vore om man räknade 2 ∶ 6 (fel utgångsvärde).'] },

      { id: 'pro-3', typ: 'flerval', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['B','K'],
        fraga: 'Priset på en vara är 3 500 kr. Det höjs först med 3 % och sänks sedan med 10 %. Vilket uttryck beskriver det nya priset?',
        alternativ: ['0,03 · 0,10 · 3 500', '1,03 · 0,10 · 3 500', '1,03 · 1,10 · 3 500',
                     '0,07 · 0,10 · 3 500', '1,03 · 0,90 · 3 500'],
        ratt: 4,
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 10',
        ledtradar: ['Vilken förändringsfaktor hör till en höjning med 3 %?',
                    'Höjning 3 % → faktor 1,03. Sänkning 10 % → faktor 0,90.',
                    'Multiplicera priset med båda faktorerna i tur och ordning.'],
        losning: ['Höjning 3 % → förändringsfaktor 1,03',
                  'Sänkning 10 % → förändringsfaktor 0,90',
                  'Nytt pris = 3 500 · 1,03 · 0,90',
                  '≈ 3 244,50 kr'] },

      { id: 'pro-4', typ: 'number', niva: 3, eca: 'C', poang: {e:0,c:2,a:0}, formagor: ['M','P'],
        fraga: 'På Vattenlandet säljs tröjor för 120 kr styck. Inköpspriset är 40 kr. Hur många procent dyrare är försäljningspriset jämfört med inköpspriset?',
        ratt: 200, enhet: '%',
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 27c',
        rimlighet: { fraga: 'Är svaret större eller mindre än 100 %?',
                     alternativ: ['Mindre än 100 %', 'Exakt 100 %', 'Mer än 100 %'], ratt: 2,
                     forklaring: 'Priset är tre gånger så högt — mer än en fördubbling, alltså över 100 % dyrare.' },
        ledtradar: ['Jämför skillnaden med inköpspriset, inte med försäljningspriset.',
                    'Skillnaden är 120 − 40 = 80 kr.',
                    '80 ∶ 40 = 2 = 200 %.'],
        losning: ['Skillnad: 120 − 40 = 80 kr',
                  'Jämför med inköpspriset: 80 ∶ 40 = 2',
                  '2 = 200 %',
                  'Vanligt fel: 80 ∶ 120 ≈ 67 % — då jämför man med fel tal.'] },

      { id: 'pro-5', typ: 'number', niva: 4, eca: 'A', poang: {e:1,c:1,a:1}, formagor: ['P','M'],
        fraga: 'En familj med två vuxna och tre ungdomar besöker Vattenlandet. Vuxna betalar fullt pris, ungdomar får 30 % rabatt på det priset. Tillsammans betalar alla fem 1 025 kr. Vad kostar en biljett för en vuxen?',
        ratt: 250, enhet: 'kr',
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 26',
        ledtradar: ['Kalla vuxenbiljetten x. Vad kostar en ungdomsbiljett uttryckt i x?',
                    'Ungdom betalar 70 % av x, alltså 0,7x.',
                    'Ställ upp: 2x + 3 · 0,7x = 1 025.'],
        losning: ['Låt x = pris för vuxen',
                  'Ungdom: 0,7x  (30 % rabatt)',
                  '2x + 3 · 0,7x = 1 025',
                  '2x + 2,1x = 1 025',
                  '4,1x = 1 025',
                  'x = 250 kr'] },

      { id: 'pro-6', typ: 'number', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M','P'],
        fraga: 'På en skolfest äter 460 personer. 60 % väljer hamburgare och 150 personer väljer varmkorv. Resten väljer pastasallad. Hur många väljer pastasallad?',
        ratt: 34, enhet: 'personer',
        kalla: 'Np åk 9 2016/17, delprov D, uppgift 24',
        ledtradar: ['Räkna först ut hur många som väljer hamburgare.',
                    '60 % av 460 = 0,6 · 460 = 276.',
                    'Dra bort både hamburgare och varmkorv från 460.'],
        losning: ['Hamburgare: 0,60 · 460 = 276 personer',
                  'Varmkorv: 150 personer',
                  'Pastasallad: 460 − 276 − 150',
                  '= 34 personer'] }
    ]
  }
  ]
},

/* ======================================================================
   OMRÅDE 2 — ALGEBRA
   ====================================================================== */
{
  id: 'algebra',
  namn: 'Algebra',
  kort: 'Algebra',
  farg: 'blaa',
  fardigheter: [

  {
    id: 'variabel',
    namn: 'Variabler & uttrycksvärde',
    beskrivning: 'Vad betyder bokstaven?',
    centralt: 'Innebörden av variabelbegreppet och dess användning i algebraiska uttryck, formler och ekvationer.',
    lektion: {
      steg: [
        { rubrik: 'En bokstav är ett tal som kan variera',
          text: 'x, a och m är inte magi — de är platshållare för tal. När du får veta vilket tal bokstaven står för byter du bara ut den.',
          exempel: ['Uttrycket 3x, då x = 5', '= 3 · 5', '= 15'] },
        { rubrik: 'Sätt in med parentes',
          text: 'Sätt alltid talet inom parentes när du byter ut en bokstav — särskilt vid negativa tal. Annars tappar du minustecken.',
          exempel: ['2ab − b, då a = 4 och b = −6', '= 2 · 4 · (−6) − (−6)', '= −48 + 6', '= −42'],
          fraga: { fraga: 'Vad är 5 − x om x = −3?', alternativ: ['2', '8', '−8'], ratt: 1 } },
        { rubrik: 'Bokstaven kan ta ut sig själv',
          text: 'Ibland förenklas ett uttryck till ett tal oavsett vilket värde bokstaven har. Det är precis vad ett samband betyder.',
          exempel: ['m · 1/m', '= m/m', '= 1  (för alla m ≠ 0)'],
          fraga: { fraga: 'Vad är m · 1/m om m = 4?', alternativ: ['1', '4', '16'], ratt: 0 } }
      ]
    },
    uppgifter: [
      { id: 'var-1', typ: 'number', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['B','M'],
        fraga: 'Beräkna värdet av uttrycket  m · 1/m  då m = 4.',
        ratt: 1,
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 6',
        ledtradar: ['Sätt in 4 istället för m på båda ställena.',
                    '4 · 1/4 — vad blir det?',
                    'Ett tal gånger sitt eget inverterade tal blir alltid 1.'],
        losning: ['m · 1/m med m = 4', '= 4 · 1/4', '= 4/4', '= 1',
                  'Det blir 1 för alla m utom m = 0.'] },

      { id: 'var-2', typ: 'number', niva: 3, eca: 'C', poang: {e:0,c:2,a:0}, formagor: ['B','M'],
        fraga: 'Beräkna värdet av uttrycket  2ab − b  då a = 4 och b = −6.',
        ratt: -42,
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 18',
        ledtradar: ['Sätt in värdena med parentes runt de negativa talen.',
                    '2 · 4 · (−6) − (−6)',
                    'Minus minus blir plus: −48 + 6.'],
        losning: ['2ab − b, a = 4, b = −6',
                  '= 2 · 4 · (−6) − (−6)',
                  '= −48 + 6',
                  '= −42'] },

      { id: 'var-3', typ: 'number', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['B','M'],
        fraga: 'Beräkna värdet av  4x + 7  då x = −2.',
        ratt: -1,
        ledtradar: ['Sätt in −2 istället för x.',
                    '4 · (−2) + 7',
                    '−8 + 7 = ?'],
        losning: ['4x + 7 med x = −2', '= 4 · (−2) + 7', '= −8 + 7', '= −1'] },

      { id: 'var-4', typ: 'flerval', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['B','K'],
        fraga: 'En vara ökar i pris från a kr till b kr. Vilket uttryck visar hur den procentuella ökningen kan bestämmas?',
        alternativ: ['a/b', '(b − a)/a', '(b − a)/b', '(a − b)/a', '(b + a)/b'],
        ratt: 1,
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 17',
        ledtradar: ['Procentuell ökning = ökningen delat med utgångsvärdet.',
                    'Ökningen är b − a. Vilket är utgångsvärdet?',
                    'Utgångsvärdet är det gamla priset a.'],
        losning: ['Ökningen i kronor: b − a',
                  'Procentuell ökning jämförs alltid med det ursprungliga värdet, alltså a',
                  '= (b − a)/a'] },

      { id: 'var-5', typ: 'number', niva: 4, eca: 'A', poang: {e:0,c:1,a:1}, formagor: ['B','M'],
        fraga: 'Beräkna värdet av  (a + b)² − a² − b²  då a = 3 och b = 5.',
        ratt: 30,
        ledtradar: ['Sätt in talen och räkna parentesen först.',
                    '(3 + 5)² = 8² = 64. Sedan 64 − 9 − 25.',
                    'Lägg märke till att svaret blir 2ab = 2 · 3 · 5.'],
        losning: ['(3 + 5)² − 3² − 5²', '= 64 − 9 − 25', '= 30',
                  'Genvägen: (a+b)² − a² − b² = 2ab = 2 · 3 · 5 = 30'] }
    ]
  },

  {
    id: 'forenkla',
    namn: 'Förenkla uttryck',
    beskrivning: 'Dra ihop termer som hör ihop',
    centralt: 'Algebraiska uttryck, formler och ekvationer i situationer som är relevanta för eleven.',
    lektion: {
      steg: [
        { rubrik: 'Bara lika termer kan slås ihop',
          text: '5x och 2x är lika termer — båda handlar om x. 5x och 2x² är det inte. Du kan bara addera det som är av samma sort.',
          exempel: ['5x + 2x − x', '= (5 + 2 − 1)x', '= 6x'] },
        { rubrik: 'Bråkstreck betyder division',
          text: 'När hela täljaren och hela nämnaren är uttryck måste du förenkla var och en först — sedan dividera.',
          exempel: ['(6x + 3x)/(6x − 3x)', '= 9x / 3x', '= 3'],
          fraga: { fraga: 'Vad blir (4x + 4x)/(4x)?', alternativ: ['2', '8x', '2x'], ratt: 0 } },
        { rubrik: 'Var noga med minustecken',
          text: 'Ett minustecken framför en parentes byter tecken på allt inuti.',
          exempel: ['7a − (3a − 2)', '= 7a − 3a + 2', '= 4a + 2'],
          fraga: { fraga: 'Vad blir 5b − (2b − 4)?', alternativ: ['3b − 4', '3b + 4', '7b − 4'], ratt: 1 } }
      ]
    },
    uppgifter: [
      { id: 'for-1', typ: 'text', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        fraga: 'Förenkla  5x + 2x − x  så långt som möjligt.',
        ratt: ['6x'], svarsform: 'text',
        ledtradar: ['Alla termer innehåller x — de kan slås ihop.',
                    'Räkna koefficienterna: 5 + 2 − 1.',
                    '5 + 2 − 1 = 6, alltså 6x.'],
        losning: ['5x + 2x − x', '= (5 + 2 − 1)x', '= 6x'] },

      { id: 'for-2', typ: 'number', niva: 2, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M','B'],
        fraga: 'Förenkla uttrycket  (6x + 3x)/(6x − 3x)  så långt som möjligt.',
        ratt: 3,
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 14',
        ledtradar: ['Förenkla täljaren och nämnaren var för sig först.',
                    'Täljare: 6x + 3x = 9x. Nämnare: 6x − 3x = 3x.',
                    '9x ∶ 3x — x tar ut sig självt.'],
        losning: ['(6x + 3x)/(6x − 3x)', '= 9x / 3x', '= 3',
                  'x försvinner eftersom det finns i både täljare och nämnare.'] },

      { id: 'for-3', typ: 'text', niva: 2, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M'],
        fraga: 'Förenkla  7a − (3a − 2). Skriv svaret på formen 4a+2 (utan mellanslag).',
        ratt: ['4a+2','2+4a'], svarsform: 'text',
        ledtradar: ['Minustecknet framför parentesen gäller allt inuti.',
                    '7a − 3a + 2 (tecknet på −2 vänder till +2).',
                    'Slå ihop a-termerna.'],
        losning: ['7a − (3a − 2)', '= 7a − 3a + 2', '= 4a + 2'] },

      { id: 'for-4', typ: 'text', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M','B'],
        fraga: 'Förenkla  3(2x + 4) − 2x. Skriv svaret på formen 4x+12 (utan mellanslag).',
        ratt: ['4x+12','12+4x'], svarsform: 'text',
        ledtradar: ['Multiplicera in 3:an i parentesen först.',
                    '3 · 2x = 6x och 3 · 4 = 12.',
                    'Sedan 6x + 12 − 2x.'],
        losning: ['3(2x + 4) − 2x', '= 6x + 12 − 2x', '= 4x + 12'] },

      { id: 'for-5', typ: 'number', niva: 4, eca: 'A', poang: {e:0,c:1,a:1}, formagor: ['B','M'],
        fraga: 'Förenkla  (10x² · 4x³)/(8x⁴)  och ange koefficienten framför x.',
        ratt: 5,
        ledtradar: ['Multiplicera ihop täljaren först: potenslagar gäller.',
                    '10x² · 4x³ = 40x⁵.',
                    '40x⁵ ∶ 8x⁴ = 5x. Koefficienten är alltså 5.'],
        losning: ['(10x² · 4x³)/(8x⁴)', '= 40x⁵ / 8x⁴', '= 5x¹', '= 5x',
                  'Koefficienten är 5.'] }
    ]
  },

  {
    id: 'ekvation',
    namn: 'Ekvationer',
    beskrivning: 'Hitta det okända talet',
    centralt: 'Metoder för ekvationslösning.',
    lektion: {
      steg: [
        { rubrik: 'Balansvågen',
          text: 'En ekvation är en våg i balans. Det du gör på ena sidan måste du göra på andra sidan — annars tippar den.',
          exempel: ['x + 8 = 20', 'Dra bort 8 från BÅDA sidor', 'x = 12'] },
        { rubrik: 'Isolera x',
          text: 'Målet är att få x ensamt på ena sidan. Ta bort det som står i vägen, ett steg i taget.',
          exempel: ['5 − x = −1', '−x = −1 − 5', '−x = −6', 'x = 6'],
          fraga: { fraga: 'Lös 3x = 21', alternativ: ['x = 7', 'x = 18', 'x = 63'], ratt: 0 } },
        { rubrik: 'Från text till ekvation',
          text: 'De svåraste provuppgifterna handlar inte om att lösa ekvationen — de handlar om att skriva upp den. Namnge det du söker, uttryck resten i samma bokstav.',
          exempel: ['Amira har dubbelt så mycket som Kevin', 'Låt Kevin = k', 'Amira = 2k'],
          fraga: { fraga: 'Simon har 50 kr mindre än Amira (2k). Hur skrivs Simons pengar?', alternativ: ['2k + 50', '2k − 50', '50 − 2k'], ratt: 1 } }
      ]
    },
    uppgifter: [
      { id: 'ekv-1', typ: 'number', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        fraga: 'Lös ekvationen  x + 8 = 20',
        ratt: 12,
        ledtradar: ['Vad står i vägen för x?',
                    'Talet 8. Dra bort 8 från båda sidor.',
                    '20 − 8 = 12.'],
        losning: ['x + 8 = 20', 'x + 8 − 8 = 20 − 8', 'x = 12'] },

      { id: 'ekv-2', typ: 'number', niva: 2, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M'],
        fraga: 'Vilket värde har x i ekvationen  5 − x = −1 ?',
        ratt: 6,
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 16',
        ledtradar: ['Flytta över 5:an till högersidan.',
                    '−x = −1 − 5 = −6.',
                    'Om −x = −6, vad är då x?'],
        losning: ['5 − x = −1', '−x = −1 − 5', '−x = −6', 'x = 6',
                  'Kontroll: 5 − 6 = −1 ✓'] },

      { id: 'ekv-3', typ: 'number', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['M'],
        fraga: 'Lös ekvationen  4x − 7 = 2x + 9',
        ratt: 8,
        ledtradar: ['Samla alla x på ena sidan och alla tal på den andra.',
                    'Dra bort 2x från båda sidor: 2x − 7 = 9.',
                    'Lägg till 7: 2x = 16.'],
        losning: ['4x − 7 = 2x + 9', '4x − 2x = 9 + 7', '2x = 16', 'x = 8',
                  'Kontroll: 4·8 − 7 = 25 och 2·8 + 9 = 25 ✓'] },

      { id: 'ekv-4', typ: 'number', niva: 4, eca: 'A', poang: {e:0,c:2,a:2}, formagor: ['P','M','R'],
        fraga: 'En affär säljer stora och små flaskor vatten. En stor flaska kostar 15 kr och en liten 9 kr. En dag har affären sålt 93 flaskor för totalt 1 065 kr. Hur många stora flaskor har affären sålt?',
        ratt: 38, enhet: 'stora flaskor',
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 32',
        rimlighet: { fraga: 'Om alla 93 flaskor vore små skulle intäkten bli 837 kr. Vad säger det?',
                     alternativ: ['Det saknas 228 kr, så en del måste vara stora',
                                  'Alla flaskor måste vara små',
                                  'Det går inte att avgöra'], ratt: 0,
                     forklaring: 'Skillnaden 1 065 − 837 = 228 kr kommer från att vissa flaskor är stora — 6 kr dyrare styck.' },
        ledtradar: ['Kalla antalet stora flaskor x. Hur många små blir det då?',
                    'Små flaskor: 93 − x. Ställ upp intäkten: 15x + 9(93 − x) = 1 065.',
                    '15x + 837 − 9x = 1 065 → 6x = 228.'],
        losning: ['Låt x = antal stora flaskor',
                  'Antal små: 93 − x',
                  '15x + 9(93 − x) = 1 065',
                  '15x + 837 − 9x = 1 065',
                  '6x = 228',
                  'x = 38 stora flaskor',
                  'Kontroll: 38 · 15 + 55 · 9 = 570 + 495 = 1 065 ✓'] },

      { id: 'ekv-5', typ: 'number', niva: 4, eca: 'A', poang: {e:0,c:1,a:1}, formagor: ['P','M'],
        fraga: 'Till en fest har ett antal vuxna anmält sig. Om varje vuxen betalar 125 kr i inträde saknas 2 225 kr för att täcka utgifterna. Om varje vuxen betalar 170 kr blir det 970 kr över. Hur många vuxna har anmält sig?',
        ratt: 71, enhet: 'vuxna',
        kalla: 'Np åk 9 2016/17, delprov D, uppgift 33',
        ledtradar: ['Kalla antalet vuxna n och utgifterna U. Skriv upp två uttryck för U.',
                    '125n + 2 225 = U  och  170n − 970 = U.',
                    'Sätt uttrycken lika: 125n + 2 225 = 170n − 970.'],
        losning: ['Låt n = antal vuxna, U = utgifterna',
                  '125n + 2 225 = U',
                  '170n − 970 = U',
                  '125n + 2 225 = 170n − 970',
                  '2 225 + 970 = 170n − 125n',
                  '3 195 = 45n',
                  'n = 71 vuxna'] },

      { id: 'ekv-6', typ: 'number', niva: 3, eca: 'C', poang: {e:1,c:1,a:0}, formagor: ['P','M'],
        fraga: 'Amira har dubbelt så mycket pengar som Kevin. Simon har 50 kr mindre än Amira. Johan har 3 gånger så mycket som Simon. Tillsammans har de 735 kr. Hur mycket pengar har Johan?',
        ratt: 375, enhet: 'kr',
        kalla: 'Np åk 9 2016/17, delprov D, uppgift 30',
        ledtradar: ['Låt Kevin = k. Uttryck alla andra i k.',
                    'Amira = 2k, Simon = 2k − 50, Johan = 3(2k − 50) = 6k − 150.',
                    'Summan: k + 2k + (2k − 50) + (6k − 150) = 735.'],
        losning: ['Kevin = k', 'Amira = 2k', 'Simon = 2k − 50', 'Johan = 3(2k − 50) = 6k − 150',
                  'k + 2k + 2k − 50 + 6k − 150 = 735',
                  '11k − 200 = 735',
                  '11k = 935',
                  'k = 85',
                  'Johan = 6 · 85 − 150 = 510 − 150 = 375 kr'] }
    ]
  },

  {
    id: 'monster',
    namn: 'Mönster & generalisering',
    beskrivning: 'Från figur 3 till figur n',
    centralt: 'Algebraiska uttryck och formler för att beskriva mönster och samband.',
    lektion: {
      steg: [
        { rubrik: 'Leta efter vad som ändras',
          text: 'Jämför två figurer i rad. Hur mycket ökar det? Den ökningen blir talet framför n.',
          exempel: ['Figur 1: 5 stickor', 'Figur 2: 8 stickor', 'Figur 3: 11 stickor', 'Ökar med 3 varje gång → 3n'] },
        { rubrik: 'Justera startvärdet',
          text: 'När du vet ökningen kollar du vad som måste läggas till för att figur 1 ska stämma.',
          exempel: ['3n med n = 1 ger 3, men vi vill ha 5', 'Alltså 3n + 2', 'Kontroll n = 3: 3·3 + 2 = 11 ✓'],
          fraga: { fraga: 'Talföljden 4, 7, 10, 13 … Vilket uttryck ger tal nummer n?', alternativ: ['3n', '3n + 1', '4n'], ratt: 1 } },
        { rubrik: 'Testa alltid två värden',
          text: 'Ett uttryck som stämmer för figur 1 men inte figur 4 är fel. Kontrollera minst två fall innan du svarar.',
          exempel: ['Talföljden 2, 5, 11, 20, 32 …', 'Skillnaderna: 3, 6, 9, 12', 'Skillnaden ökar med 3 → nästa skillnad är 15', '32 + 15 = 47'] }
      ]
    },
    uppgifter: [
      { id: 'mon-1', typ: 'number', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['B','R'],
        fraga: 'Undersök talföljden och fyll i talet som saknas:  2,  5,  11,  20,  32,  ___',
        ratt: 47,
        kalla: 'Np åk 9 2016/17, delprov B, uppgift 2',
        ledtradar: ['Räkna ut skillnaden mellan varje par av tal.',
                    'Skillnaderna är 3, 6, 9, 12 — de ökar med 3 varje gång.',
                    'Nästa skillnad blir 15. Lägg till 15 på 32.'],
        losning: ['2 → 5 : +3', '5 → 11 : +6', '11 → 20 : +9', '20 → 32 : +12',
                  'Skillnaden ökar med 3 varje gång → nästa är +15',
                  '32 + 15 = 47'] },

      { id: 'mon-2', typ: 'text', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['B','M'],
        fraga: 'Fortsätt talföljden:  0,84   0,91   0,98   ___',
        ratt: ['1,05','1.05'], svarsform: 'text',
        kalla: 'Np åk 9 2018/19, delprov B, uppgift 2',
        ledtradar: ['Hur mycket ökar det mellan talen?',
                    '0,91 − 0,84 = 0,07.',
                    '0,98 + 0,07 = ?'],
        losning: ['Skillnaden: 0,91 − 0,84 = 0,07', '0,98 + 0,07 = 1,05'] },

      { id: 'mon-3', typ: 'number', niva: 3, eca: 'C', poang: {e:1,c:1,a:0}, formagor: ['P','M'],
        fraga: 'Stjärnor bildar ett mönster. En stjärna med 3 uddar har omkretsen 18 cm. Varje udd bidrar med lika mycket. Beräkna omkretsen för stjärnan med 9 uddar.',
        ratt: 54, enhet: 'cm',
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 29b',
        ledtradar: ['Hur mycket omkrets bidrar en enda udd med?',
                    '18 cm ∶ 3 uddar = 6 cm per udd.',
                    '9 uddar · 6 cm.'],
        losning: ['Per udd: 18 ∶ 3 = 6 cm', '9 uddar: 9 · 6 = 54 cm'] },

      { id: 'mon-4', typ: 'text', niva: 4, eca: 'A', poang: {e:0,c:1,a:1}, formagor: ['B','K','P'],
        fraga: 'Skriv ett algebraiskt uttryck för omkretsen av en stjärna med n uddar, om varje udd bidrar med 6 cm. Skriv utan mellanslag, t.ex. 6n.',
        ratt: ['6n','n6','6*n','6·n'], svarsform: 'text',
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 29c',
        ledtradar: ['Om en udd är 6 cm, hur mycket är n uddar?',
                    'Varje udd bidrar lika mycket, alltså multiplicerar du.',
                    'n stycken uddar · 6 cm = 6n.'],
        losning: ['En udd: 6 cm', 'n uddar: n · 6 = 6n',
                  'Kontroll n = 3: 6 · 3 = 18 cm ✓',
                  'Kontroll n = 9: 6 · 9 = 54 cm ✓'] }
    ]
  }
  ]
},

/* ======================================================================
   OMRÅDE 3 — PROBLEMLÖSNING
   ====================================================================== */
{
  id: 'problem',
  namn: 'Problemlösning',
  kort: 'Problem',
  farg: 'gron',
  fardigheter: [

  {
    id: 'vardagsproblem',
    namn: 'Vardagsproblem',
    beskrivning: 'Problem utan färdig metod',
    centralt: 'Strategier för att lösa matematiska problem i olika situationer och områden samt värdering av valda strategier och metoder.',
    lektion: {
      steg: [
        { rubrik: 'Vad frågas det egentligen efter?',
          text: 'Skriv ner med egna ord vad du ska ta reda på innan du räknar något. Halva poängen i delprov D handlar om att välja rätt väg — inte om att räkna rätt.',
          exempel: ['"Vilken flaska har lägsta priset per liter?"', 'Söker: kr per liter FÄRDIGBLANDAD saft', 'Inte: priset på flaskan'] },
        { rubrik: 'Gör storheterna jämförbara',
          text: 'Du kan inte jämföra äpplen med päron. Räkna om allt till samma enhet eller samma mängd innan du jämför.',
          exempel: ['Flaska A: 29,95 kr, blandas 1+7', 'En del saft ger 8 delar färdig dryck', 'Räkna ut pris per liter färdig dryck för båda'],
          fraga: { fraga: '1 liter saft som blandas 1+7 ger hur många liter färdig dryck?', alternativ: ['7 liter', '8 liter', '1 liter'], ratt: 1 } },
        { rubrik: 'Visa hur du tänkte',
          text: 'I delprov D ger enbart rätt svar oftast noll poäng. Poängen ligger i redovisningen — att någon annan kan läsa och förstå vad du menar.',
          exempel: ['Skriv ut vad du kallar saker', 'Visa varje beräkning', 'Avsluta med en mening som svarar på frågan'] }
      ]
    },
    uppgifter: [
      { id: 'var-p1', typ: 'number', niva: 2, eca: 'E', poang: {e:2,c:0,a:0}, formagor: ['P','M'],
        fraga: 'Det regnar i genomsnitt 450 inches per år på ett berg på Hawaii. Hur många meter motsvarar det? (1 inch = 25,4 mm)',
        ratt: 11.43, enhet: 'meter', tolerans: 0.05,
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 22a',
        rimlighet: { fraga: 'Ungefär hur många meter blir det?',
                     alternativ: ['Ungefär 1 meter', 'Ungefär 11 meter', 'Ungefär 110 meter'], ratt: 1,
                     forklaring: 'En inch är ungefär 2,5 cm, så 450 inches är ungefär 450 · 2,5 cm ≈ 1 100 cm ≈ 11 m.' },
        ledtradar: ['Räkna först ut hur många millimeter det blir totalt.',
                    '450 · 25,4 = 11 430 mm.',
                    '1 meter = 1 000 mm.'],
        losning: ['450 · 25,4 = 11 430 mm', '11 430 mm ∶ 1 000 = 11,43 m', '≈ 11,4 meter'] },

      { id: 'var-p2', typ: 'flerval', niva: 3, eca: 'C', poang: {e:1,c:2,a:0}, formagor: ['P','R','K'],
        fraga: 'Flaska A kostar 29,95 kr och blandas 1+7. Flaska B kostar 23,50 kr och blandas 1+5. Båda flaskorna innehåller 1 liter saft. Vilken flaska har lägsta priset för en liter färdigblandad saft?',
        alternativ: ['Flaska A', 'Flaska B', 'Lika dyra'],
        ratt: 0,
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 25',
        ledtradar: ['Hur mycket färdig dryck ger en hel flaska?',
                    'Blandning 1+7 betyder att 1 del saft ger 8 delar dryck. A ger 8 liter, B ger 6 liter.',
                    'Pris per liter: A = 29,95 ∶ 8, B = 23,50 ∶ 6.'],
        losning: ['Flaska A: 1 l saft blandas 1+7 → 8 liter färdig dryck',
                  '29,95 ∶ 8 ≈ 3,74 kr/liter',
                  'Flaska B: 1 l saft blandas 1+5 → 6 liter färdig dryck',
                  '23,50 ∶ 6 ≈ 3,92 kr/liter',
                  'Flaska A är billigast per liter färdigblandad saft.'] },

      { id: 'var-p3', typ: 'number', niva: 3, eca: 'C', poang: {e:1,c:1,a:0}, formagor: ['P','M'],
        fraga: 'Amira blandar bål till en fest: 12 liter juice, 30 liter cider och 21 liter mineralvatten. Hon behöver fylla på med ytterligare 27 liter bål i samma proportioner. Hur många liter mineralvatten behöver hon?',
        ratt: 9, enhet: 'liter',
        kalla: 'Np åk 9 2016/17, delprov D, uppgift 25',
        ledtradar: ['Hur många liter bål blir det totalt från början?',
                    '12 + 30 + 21 = 63 liter, varav 21 liter är mineralvatten.',
                    'Andelen mineralvatten är 21/63 = 1/3. Ta 1/3 av 27.'],
        losning: ['Totalt: 12 + 30 + 21 = 63 liter',
                  'Andel mineralvatten: 21/63 = 1/3',
                  '1/3 av 27 liter = 9 liter'] },

      { id: 'var-p4', typ: 'number', niva: 4, eca: 'A', poang: {e:1,c:2,a:0}, formagor: ['P','M','R'],
        fraga: 'Amira ska laga 240 portioner lax. Cirka 40 % av laxens vikt kastas bort när den rensas. En portion rensad lax ska väga cirka 200 g. Hur många kilogram lax behöver hon köpa?',
        ratt: 80, enhet: 'kg',
        kalla: 'Np åk 9 2016/17, delprov D, uppgift 28',
        rimlighet: { fraga: 'Blir svaret mer eller mindre än 48 kg (= 240 · 200 g)?',
                     alternativ: ['Mindre — man kastar ju bort en del', 'Mer — man måste köpa extra för svinnet', 'Exakt 48 kg'], ratt: 1,
                     forklaring: 'Eftersom 40 % försvinner måste hon köpa mer än den mängd hon vill servera.' },
        ledtradar: ['Hur mycket rensad lax behövs totalt?',
                    '240 · 200 g = 48 000 g = 48 kg rensad lax.',
                    'Om 40 % kastas är 48 kg bara 60 % av inköpet. 48 ∶ 0,6 = ?'],
        losning: ['Rensad lax som behövs: 240 · 200 g = 48 000 g = 48 kg',
                  'Efter rensning återstår 60 % av inköpt vikt',
                  '0,60 · x = 48',
                  'x = 48 ∶ 0,60 = 80 kg'] },

      { id: 'var-p5', typ: 'number', niva: 4, eca: 'A', poang: {e:1,c:1,a:1}, formagor: ['P','R','K'],
        fraga: 'Tio vänner besökte en festival. Medelvärdet är 3,4 konserter, medianen 3,5 och typvärdet 2. Sorterat ser listan ut så här: 2, 2, 2, D, 3, F, 4, 5, 5, H — där D ≤ 3, 3 ≤ F ≤ 4 och H ≥ 5. Hur många konserter var person F på?',
        ratt: 4, enhet: 'konserter',
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 28',
        ledtradar: ['Medianen av 10 tal är medelvärdet av det 5:e och 6:e talet.',
                    'Femte talet är 3 och medianen är 3,5, så sjätte talet (F) måste vara 4.',
                    'Kontrollera sedan med medelvärdet att summan blir 34.'],
        losning: ['Median av 10 värden = medelvärdet av det 5:e och 6:e',
                  '(3 + F) ∶ 2 = 3,5  →  3 + F = 7  →  F = 4',
                  'Medelvärde 3,4 ger summan 10 · 3,4 = 34',
                  'Kända värden: 2+2+2+3+4+4+5+5 = 27, alltså D + H = 7',
                  'Typvärdet 2 kräver att D = 2, vilket ger H = 5'] }
    ]
  },

  {
    id: 'modeller',
    namn: 'Formler & modeller',
    beskrivning: 'Beskriv verkligheten med ett uttryck',
    centralt: 'Enkla matematiska modeller och hur de kan användas i olika situationer.',
    lektion: {
      steg: [
        { rubrik: 'Fast avgift plus rörlig kostnad',
          text: 'Väldigt många vardagssituationer har samma form: en startkostnad som alltid finns, plus något som beror på antalet. Det ger K = fast + styckpris · antal.',
          exempel: ['5 bord kostar 650 kr', '10 bord kostar 800 kr', 'Skillnad: 150 kr för 5 bord → 30 kr/bord'] },
        { rubrik: 'Hitta den fasta avgiften',
          text: 'När du vet styckpriset räknar du baklänges från ett känt värde för att hitta det fasta.',
          exempel: ['5 bord: 650 kr', 'Rörlig del: 5 · 30 = 150 kr', 'Fast avgift: 650 − 150 = 500 kr', 'K = 500 + 30b'],
          fraga: { fraga: 'Vad kostar 20 bord med formeln K = 500 + 30b?', alternativ: ['1 100 kr', '600 kr', '1 000 kr'], ratt: 0 } },
        { rubrik: 'Modeller kan jämföras',
          text: 'Två formler kan korsa varandra. Det billigaste alternativet beror då på hur många du köper — det är precis den typen av resonemang som ger A-poäng.',
          exempel: ['Företag 1: K = 500 + 30b', 'Företag 2: K = 40b', 'Vid b = 50 kostar båda 2 000 kr'] }
      ]
    },
    uppgifter: [
      { id: 'mod-1', typ: 'number', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['B','M'],
        fraga: 'Företaget "Allt för festen" har en fast avgift plus en avgift per bord. 5 bord kostar 650 kr och 10 bord kostar 800 kr. Vad kostar det att hyra 20 bord?',
        ratt: 1100, enhet: 'kr',
        kalla: 'Np åk 9 2016/17, delprov D, uppgift 29a',
        ledtradar: ['Hur mycket ökar priset per extra bord?',
                    '800 − 650 = 150 kr för 5 extra bord → 30 kr per bord.',
                    'Fast avgift: 650 − 5 · 30 = 500 kr. Alltså K = 500 + 30b.'],
        losning: ['Prisökning: 800 − 650 = 150 kr för 5 bord',
                  'Per bord: 150 ∶ 5 = 30 kr',
                  'Fast avgift: 650 − 5 · 30 = 500 kr',
                  'K = 500 + 30b',
                  '20 bord: 500 + 30 · 20 = 1 100 kr'] },

      { id: 'mod-2', typ: 'number', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['B','P'],
        fraga: 'Samma företag. Hur stor är den fasta avgiften?',
        ratt: 500, enhet: 'kr',
        kalla: 'Np åk 9 2016/17, delprov D, uppgift 29b',
        ledtradar: ['Den fasta avgiften är det du betalar även för noll bord.',
                    'Priset per bord är 30 kr. Ta bort den rörliga delen från 650 kr.',
                    '650 − 5 · 30 = ?'],
        losning: ['Pris per bord: 30 kr',
                  'För 5 bord är den rörliga delen 5 · 30 = 150 kr',
                  'Fast avgift: 650 − 150 = 500 kr'] },

      { id: 'mod-3', typ: 'flerval', niva: 4, eca: 'A', poang: {e:1,c:1,a:1}, formagor: ['P','B','K'],
        fraga: 'Ange en formel för kostnaden K att hyra b stycken bord hos "Allt för festen".',
        alternativ: ['K = 30b', 'K = 500 + 30b', 'K = 650 + 30b', 'K = 500b + 30'],
        ratt: 1,
        kalla: 'Np åk 9 2016/17, delprov D, uppgift 29d',
        ledtradar: ['En formel av typen K = fast avgift + pris per bord · antal bord.',
                    'Fast avgift 500 kr, 30 kr per bord.',
                    'Kontrollera med b = 5: 500 + 30 · 5 = 650 ✓'],
        losning: ['Fast avgift: 500 kr', 'Per bord: 30 kr', 'K = 500 + 30b',
                  'Kontroll b = 5: 500 + 150 = 650 kr ✓',
                  'Kontroll b = 10: 500 + 300 = 800 kr ✓'] },

      { id: 'mod-4', typ: 'number', niva: 3, eca: 'C', poang: {e:0,c:1,a:0}, formagor: ['P','M'],
        fraga: 'På Vattenlandet säljs tröjor för 120 kr styck. Inköpspriset är 40 kr per tröja och man har köpt in 900 tröjor. Hur många tröjor måste man minst sälja för att täcka inköpskostnaden?',
        ratt: 300, enhet: 'tröjor',
        kalla: 'Np åk 9 2018/19, delprov D, uppgift 27b',
        ledtradar: ['Vad kostade hela inköpet?',
                    '900 · 40 = 36 000 kr.',
                    'Hur många tröjor à 120 kr behövs för att få in 36 000 kr?'],
        losning: ['Inköpskostnad: 900 · 40 = 36 000 kr',
                  'Intäkt per tröja: 120 kr',
                  '36 000 ∶ 120 = 300 tröjor'] }
    ]
  }
  ]
},

/* ======================================================================
   OMRÅDE 4 — STÖDSPÅR (diagnos, mellanstadiets innehåll)
   ====================================================================== */
{
  id: 'stod',
  namn: 'Stödspår: luckor bakåt',
  kort: 'Stöd',
  farg: 'orange',
  stodsspar: true,
  fardigheter: [

  {
    id: 'uppstallning',
    namn: 'Uppställning',
    beskrivning: 'Skriftliga räknemetoder — visa uträkningen siffra för siffra',
    centralt: 'Mellanstadiets centrala innehåll: skriftliga räknemetoder. Diagnos- och stödmaterial, ej åk 9-innehåll.',
    lektion: {
      steg: [
        { rubrik: 'Varför finns det här spåret?',
          text: 'Uppställning testas inte på nationella provet i åk 9 — det hör till åk 4–6. Men luckor här sänker eleven i allt annat. Det här spåret finns för att hitta och laga dem.',
          exempel: ['Delprov B 2018/19: 20 uppgifter', 'Antal uppställningar: 0', 'Antal uppgifter som ändå kräver säker huvudräkning: nästan alla'] },
        { rubrik: 'Ental först, sedan uppåt',
          text: 'Ställ siffrorna i kolumner efter platsvärde. Börja alltid längst till höger och arbeta åt vänster.',
          exempel: ['  3 4 7', '+ 2 8 5', '───────', '  6 3 2'] },
        { rubrik: 'Minnessiffran — testa själv',
          text: 'När en kolumn blir 10 eller mer skriver du entalet i svaret och för över tiotalet till nästa kolumn. Den lilla siffran ovanför är minnessiffran. Prova det här på riktigt, en kolumn i taget, i uppställningen nedanför.',
          uppstallningsdemo: 'upp-1' }
      ]
    },
    uppgifter: [
      { id: 'upp-1', typ: 'uppstallning', niva: 1, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        operation: 'add', a: 347, b: 285,
        fraga: 'Ställ upp och beräkna  347 + 285',
        ratt: 632,
        ledtradar: ['Börja med entalen längst till höger.',
                    '7 + 5 = 12. Skriv 2 i svaret och för över 1 som minnessiffra.',
                    'Tiotal: 4 + 8 + 1 = 13. Skriv 3, för över 1.'],
        losning: ['Ental: 7 + 5 = 12 → skriv 2, minne 1',
                  'Tiotal: 4 + 8 + 1 = 13 → skriv 3, minne 1',
                  'Hundratal: 3 + 2 + 1 = 6',
                  'Svar: 632'] },

      { id: 'upp-2', typ: 'uppstallning', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        operation: 'sub', a: 803, b: 247,
        fraga: 'Ställ upp och beräkna  803 − 247',
        ratt: 556,
        ledtradar: ['Ental: 3 − 7 går inte. Du måste låna.',
                    'Tiotalssiffran är 0, så du måste låna från hundratalen först.',
                    'Efter lånet: 13 − 7 = 6 i entalen.'],
        losning: ['Ental: 3 − 7 går inte → låna',
                  'Tiotal är 0, så låna från hundratal: 8 → 7, tiotal blir 10',
                  'Låna sedan till entalen: tiotal 10 → 9, ental blir 13',
                  'Ental: 13 − 7 = 6',
                  'Tiotal: 9 − 4 = 5',
                  'Hundratal: 7 − 2 = 5',
                  'Svar: 556'] },

      { id: 'upp-3', typ: 'uppstallning', niva: 2, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        operation: 'mul', a: 342, b: 7,
        fraga: 'Ställ upp och beräkna  342 · 7',
        ratt: 2394,
        ledtradar: ['Multiplicera 7 med entalssiffran först.',
                    '7 · 2 = 14. Skriv 4, för över 1.',
                    '7 · 4 = 28, plus minnessiffran 1 = 29. Skriv 9, för över 2.'],
        losning: ['Ental: 7 · 2 = 14 → skriv 4, minne 1',
                  'Tiotal: 7 · 4 = 28, + 1 = 29 → skriv 9, minne 2',
                  'Hundratal: 7 · 3 = 21, + 2 = 23',
                  'Svar: 2 394'] },

      { id: 'upp-4', typ: 'uppstallning', niva: 3, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        operation: 'add', a: 4968, b: 1357,
        fraga: 'Ställ upp och beräkna  4 968 + 1 357',
        ratt: 6325,
        ledtradar: ['Fyra kolumner den här gången. Börja längst till höger.',
                    '8 + 7 = 15 → skriv 5, minne 1.',
                    'Fortsätt kolumn för kolumn och glöm inte minnessiffrorna.'],
        losning: ['Ental: 8 + 7 = 15 → 5, minne 1',
                  'Tiotal: 6 + 5 + 1 = 12 → 2, minne 1',
                  'Hundratal: 9 + 3 + 1 = 13 → 3, minne 1',
                  'Tusental: 4 + 1 + 1 = 6',
                  'Svar: 6 325'] },

      { id: 'upp-5', typ: 'uppstallning', niva: 3, eca: 'E', poang: {e:1,c:0,a:0}, formagor: ['M'],
        operation: 'sub', a: 5002, b: 1876,
        fraga: 'Ställ upp och beräkna  5 002 − 1 876',
        ratt: 3126,
        ledtradar: ['Två nollor i mitten gör lånandet knepigt.',
                    'Du måste låna hela vägen från tusentalen.',
                    'Efter lånen: ental 12 − 6, tiotal 9 − 7, hundratal 9 − 8, tusental 4 − 1.'],
        losning: ['Ental: 2 − 6 går inte → låna genom nollorna',
                  'Efter lån: 12 − 6 = 6',
                  'Tiotal: 9 − 7 = 2',
                  'Hundratal: 9 − 8 = 1',
                  'Tusental: 4 − 1 = 3',
                  'Svar: 3 126'] }
    ]
  }
  ]
}

];

/* --------------------------------------------------------------------
   Provuppsättningar — används i provläget.
   -------------------------------------------------------------------- */
const PROV = [
  {
    id: 'prov-b',
    namn: 'Delprov B — utan digitala verktyg',
    beskrivning: 'Kortsvar. Miniräknare och formelblad ej tillåtna.',
    minuter: 40,
    hjalpmedel: 'Linjal',
    uppgifter: ['pri-1','pri-2','brk-1','brk-2','pot-1','pot-4','rim-1','rim-4','rim-3',
                'var-2','var-4','for-2','ekv-2','mon-1','mon-2','pro-2']
  },
  {
    id: 'prov-d',
    namn: 'Delprov D — med digitala verktyg',
    beskrivning: 'Längre uppgifter. Miniräknare och formelblad tillåtna.',
    minuter: 50,
    hjalpmedel: 'Miniräknare, formelblad, linjal',
    uppgifter: ['var-p1','rim-5','var-p2','pro-1','pro-4','pro-5','var-p3','mod-1','mod-2',
                'mod-3','ekv-4','ekv-5','var-p4','var-p5','mon-3','mon-4']
  },
  {
    id: 'prov-diagnos',
    namn: 'Startkoll åk 9',
    beskrivning: 'Bred diagnos över alla områden. Ger läraren en första bild.',
    minuter: 25,
    hjalpmedel: 'Miniräknare',
    uppgifter: ['pri-1','brk-3','pot-1','rim-1','rim-4','pro-6','var-1','for-1','ekv-1',
                'mon-1','mod-1','var-p1','upp-1','upp-2','upp-3']
  }
];

/* --------------------------------------------------------------------
   Påhittad klassdata till lärarpanelen (demo).
   Den inloggade eleven läggs till som en extra rad av app.js.
   -------------------------------------------------------------------- */
const DEMOKLASS = {
  namn: '9C',
  kod: 'K7X2QM',
  elever: [
    { namn: 'Alva N.',    niv: {tal:4, algebra:3, problem:2, stod:5}, form:{P:62,B:78,M:81,R:55,K:48}, senast:'idag' },
    { namn: 'Björn H.',   niv: {tal:2, algebra:1, problem:1, stod:3}, form:{P:31,B:40,M:44,R:22,K:19}, senast:'3 dagar sen' },
    { namn: 'Elias K.',   niv: {tal:5, algebra:5, problem:4, stod:5}, form:{P:88,B:91,M:94,R:79,K:72}, senast:'idag' },
    { namn: 'Fatima A.',  niv: {tal:4, algebra:4, problem:3, stod:5}, form:{P:70,B:74,M:80,R:66,K:61}, senast:'igår' },
    { namn: 'Hugo L.',    niv: {tal:3, algebra:2, problem:1, stod:4}, form:{P:38,B:52,M:60,R:29,K:24}, senast:'igår' },
    { namn: 'Ines P.',    niv: {tal:5, algebra:4, problem:4, stod:5}, form:{P:81,B:83,M:86,R:75,K:70}, senast:'idag' },
    { namn: 'Jakob S.',   niv: {tal:1, algebra:1, problem:0, stod:2}, form:{P:18,B:25,M:30,R:12,K:10}, senast:'2 veckor sen' },
    { namn: 'Klara M.',   niv: {tal:4, algebra:3, problem:3, stod:5}, form:{P:65,B:70,M:73,R:58,K:55}, senast:'idag' },
    { namn: 'Liam R.',    niv: {tal:3, algebra:3, problem:2, stod:4}, form:{P:49,B:58,M:64,R:41,K:37}, senast:'igår' },
    { namn: 'Maja T.',    niv: {tal:5, algebra:5, problem:5, stod:5}, form:{P:92,B:89,M:95,R:87,K:84}, senast:'idag' },
    { namn: 'Noel V.',    niv: {tal:2, algebra:2, problem:1, stod:3}, form:{P:28,B:44,M:51,R:20,K:17}, senast:'5 dagar sen' },
    { namn: 'Olivia B.',  niv: {tal:4, algebra:4, problem:4, stod:5}, form:{P:76,B:79,M:82,R:71,K:68}, senast:'idag' },
    { namn: 'Rasmus D.',  niv: {tal:3, algebra:2, problem:2, stod:4}, form:{P:44,B:55,M:62,R:35,K:31}, senast:'igår' },
    { namn: 'Selma Ö.',   niv: {tal:5, algebra:4, problem:3, stod:5}, form:{P:73,B:85,M:88,R:64,K:59}, senast:'idag' }
  ]
};

/* --------------------------------------------------------------------
   Kommun-demodata — flera skolor, flera lärare, samma elevform som
   DEMOKLASS.elever. "Erik Åström" återanvänder DEMOKLASS rakt av, så
   kommunens drill-in för hans klass visar exakt samma siffror som
   lärarappen visar när HAN loggar in — samma data, två vyer.
   -------------------------------------------------------------------- */
const KOMMUN_DEMO = {
  namn: 'Ängsjö kommun',
  skolor: [
    {
      namn: 'Backagårdsskolan',
      larare: [
        {
          namn: 'Sara Lindqvist', klass: '9A',
          elever: [
            { namn: 'Wilma S.',  niv: { tal: 2, algebra: 1, problem: 1, stod: 3 }, form: { P: 24, B: 33, M: 40, R: 15, K: 12 }, senast: 'idag' },
            { namn: 'Melvin A.', niv: { tal: 3, algebra: 2, problem: 1, stod: 4 }, form: { P: 35, B: 44, M: 52, R: 28, K: 20 }, senast: 'igår' },
            { namn: 'Ebba L.',   niv: { tal: 1, algebra: 1, problem: 0, stod: 2 }, form: { P: 15, B: 20, M: 26, R: 8,  K: 6  }, senast: '4 dagar sen' },
            { namn: 'Vincent K.',niv: { tal: 3, algebra: 3, problem: 2, stod: 4 }, form: { P: 48, B: 55, M: 60, R: 38, K: 33 }, senast: 'idag' },
            { namn: 'Alicia M.', niv: { tal: 4, algebra: 3, problem: 3, stod: 5 }, form: { P: 62, B: 68, M: 71, R: 55, K: 50 }, senast: 'idag' },
            { namn: 'Noel B.',   niv: { tal: 2, algebra: 2, problem: 1, stod: 3 }, form: { P: 29, B: 38, M: 45, R: 19, K: 14 }, senast: 'igår' },
            { namn: 'Tuva R.',   niv: { tal: 2, algebra: 1, problem: 1, stod: 3 }, form: { P: 22, B: 30, M: 37, R: 13, K: 10 }, senast: '2 dagar sen' },
            { namn: 'Elton D.',  niv: { tal: 3, algebra: 2, problem: 2, stod: 4 }, form: { P: 40, B: 47, M: 54, R: 30, K: 24 }, senast: 'idag' }
          ]
        },
        {
          namn: 'Omar Haddad', klass: '9B',
          elever: [
            { namn: 'Signe H.',  niv: { tal: 4, algebra: 4, problem: 3, stod: 5 }, form: { P: 65, B: 70, M: 75, R: 58, K: 52 }, senast: 'idag' },
            { namn: 'Casper N.', niv: { tal: 3, algebra: 3, problem: 3, stod: 4 }, form: { P: 50, B: 58, M: 63, R: 42, K: 37 }, senast: 'idag' },
            { namn: 'Iris F.',   niv: { tal: 5, algebra: 4, problem: 4, stod: 5 }, form: { P: 78, B: 82, M: 85, R: 70, K: 64 }, senast: 'idag' },
            { namn: 'Malte P.',  niv: { tal: 2, algebra: 2, problem: 1, stod: 3 }, form: { P: 27, B: 36, M: 43, R: 17, K: 13 }, senast: '3 dagar sen' },
            { namn: 'Nova W.',   niv: { tal: 3, algebra: 3, problem: 2, stod: 4 }, form: { P: 46, B: 53, M: 59, R: 35, K: 29 }, senast: 'igår' },
            { namn: 'Adrian J.', niv: { tal: 4, algebra: 3, problem: 3, stod: 5 }, form: { P: 60, B: 65, M: 69, R: 51, K: 46 }, senast: 'idag' },
            { namn: 'Freja C.',  niv: { tal: 3, algebra: 2, problem: 2, stod: 4 }, form: { P: 38, B: 46, M: 52, R: 27, K: 21 }, senast: 'igår' }
          ]
        }
      ]
    },
    {
      namn: 'Norrskolan',
      larare: [
        { namn: 'Erik Åström', klass: '9C', elever: DEMOKLASS.elever },
        {
          namn: 'Lina Berg', klass: '9D',
          elever: [
            { namn: 'Otto V.',   niv: { tal: 5, algebra: 5, problem: 4, stod: 5 }, form: { P: 82, B: 86, M: 90, R: 75, K: 69 }, senast: 'idag' },
            { namn: 'Saga E.',   niv: { tal: 4, algebra: 4, problem: 4, stod: 5 }, form: { P: 70, B: 75, M: 79, R: 62, K: 57 }, senast: 'idag' },
            { namn: 'Leon T.',   niv: { tal: 4, algebra: 3, problem: 3, stod: 4 }, form: { P: 58, B: 63, M: 68, R: 48, K: 43 }, senast: 'idag' },
            { namn: 'Ronja I.',  niv: { tal: 5, algebra: 4, problem: 4, stod: 5 }, form: { P: 76, B: 80, M: 84, R: 68, K: 62 }, senast: 'idag' },
            { namn: 'Hampus G.', niv: { tal: 3, algebra: 3, problem: 2, stod: 4 }, form: { P: 44, B: 52, M: 58, R: 33, K: 27 }, senast: 'igår' },
            { namn: 'Ellie O.',  niv: { tal: 4, algebra: 4, problem: 3, stod: 5 }, form: { P: 64, B: 69, M: 73, R: 56, K: 50 }, senast: 'idag' },
            { namn: 'Melker U.', niv: { tal: 2, algebra: 2, problem: 2, stod: 3 }, form: { P: 33, B: 41, M: 48, R: 23, K: 18 }, senast: '2 dagar sen' },
            { namn: 'Ines Å.',   niv: { tal: 5, algebra: 5, problem: 5, stod: 5 }, form: { P: 88, B: 90, M: 93, R: 80, K: 75 }, senast: 'idag' },
            { namn: 'Bruno S.',  niv: { tal: 3, algebra: 2, problem: 2, stod: 4 }, form: { P: 39, B: 47, M: 53, R: 26, K: 20 }, senast: 'igår' }
          ]
        }
      ]
    }
  ]
};

/* Alla klasser (skola + lärare + elever) som en platt lista — bekvämt för rollup. */
function allaKlasser() {
  return KOMMUN_DEMO.skolor.flatMap(skola =>
    skola.larare.map(l => ({ skola: skola.namn, larare: l.namn, klass: l.klass, elever: l.elever })));
}

/* Rent aggregerande hjälpfunktioner — ingen elevdata, bara snitt.
   Används av både kommun-vyns översikt och skolor/lärare-tabellen. */
function snittPerOmrade(elever) {
  const snitt = {};
  OMRADEN.forEach(o => {
    const varden = elever.map(e => e.niv[o.id] ?? 0);
    snitt[o.id] = varden.length ? varden.reduce((a, b) => a + b, 0) / varden.length : 0;
  });
  return snitt;
}
function snittPerFormaga(elever) {
  const snitt = {};
  ['P', 'B', 'M', 'R', 'K'].forEach(k => {
    const varden = elever.map(e => e.form[k] ?? 0);
    snitt[k] = varden.length ? Math.round(varden.reduce((a, b) => a + b, 0) / varden.length) : 0;
  });
  return snitt;
}

/* Slå upp en uppgift på id, oavsett var den ligger i trädet. */
function hittaUppgift(id) {
  for (const omr of OMRADEN) {
    for (const f of omr.fardigheter) {
      const u = f.uppgifter.find(x => x.id === id);
      if (u) return { uppgift: u, fardighet: f, omrade: omr };
    }
  }
  return null;
}

function hittaFardighet(id) {
  for (const omr of OMRADEN) {
    const f = omr.fardigheter.find(x => x.id === id);
    if (f) return { fardighet: f, omrade: omr };
  }
  return null;
}

function allaFardigheter() {
  return OMRADEN.flatMap(o => o.fardigheter.map(f => ({ ...f, omradeId: o.id, omradeNamn: o.namn })));
}
