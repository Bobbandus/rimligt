/* ==========================================================================
   IKONER — eget litet streckikonset. Samma visuella idiom som vanliga fria
   ikonbibliotek (24×24, 2px stroke, rundade hörn) men ritat från grunden här,
   så det inte finns någon licens- eller korrekthetsrisk med att återge någon
   annans exakta path-data. Byggt av enkla primitiver (circle/line/rect/path
   med raka segment) snarare än komplexa kurvor, för att garanterat rendera rätt.

   Användning:  mal.append(ikon('eld', 18))
   ========================================================================== */

const IKON_SVG = {
  /* navigering */
  karta:      `<circle cx="12" cy="12" r="9"/><polygon points="12,6.5 15,12 12,17.5 9,12"/>`,
  bok:        `<path d="M12 6.2C10.3 4.8 7.5 4.3 4 4.7V18.2c3.5-.4 6.3.1 8 1.5 1.7-1.4 4.5-1.9 8-1.5V4.7c-3.5-.4-6.3.1-8 1.5Z"/><line x1="12" y1="6.2" x2="12" y2="19.7"/>`,
  blixt:      `<polygon points="13,2 5,13 11,13 9,22 19,10 13,10"/>`,
  mal:        `<circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/>`,
  eld:        `<path d="M12 21c3.6 0 6-2.2 6-5.6 0-2.7-1.7-4.2-2.4-6-.3 1.7-1.3 2.4-1.3 2.4.4-3.4-1.6-5.6-3.3-7.3.3 2.6-.6 4.4-2 5.9C7.6 11.9 6 13.3 6 15.4 6 18.8 8.4 21 12 21Z"/>`,
  pokal:      `<path d="M7 4h10v4a5 5 0 0 1-5 5 5 5 0 0 1-5-5V4Z"/><path d="M7 5H4v2a3 3 0 0 0 3 3"/><path d="M17 5h3v2a3 3 0 0 1-3 3"/><line x1="12" y1="13" x2="12" y2="17"/><line x1="8" y1="20" x2="16" y2="20"/><line x1="12" y1="17" x2="12" y2="20"/>`,
  kugghjul:   `<circle cx="12" cy="12" r="3.2"/><path d="M12 3.5v2.3M12 18.2v2.3M20.5 12h-2.3M5.8 12H3.5M17.8 6.2l-1.6 1.6M7.8 16.2l-1.6 1.6M17.8 17.8l-1.6-1.6M7.8 7.8 6.2 6.2"/>`,
  kryss:      `<line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/>`,
  bock:       `<polyline points="5,13 10,18 19,7"/>`,
  plus:       `<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>`,
  nal:        `<path d="M12 3c-3 0-5.5 2.3-5.5 5.6 0 3.9 5.5 12.4 5.5 12.4s5.5-8.5 5.5-12.4C17.5 5.3 15 3 12 3Z"/><circle cx="12" cy="8.6" r="2.2" fill="currentColor" stroke="none"/>`,
  anvandare:  `<circle cx="12" cy="8" r="3.3"/><path d="M5 20c0-3.6 3.1-6.3 7-6.3s7 2.7 7 6.3"/>`,
  anvandare2: `<circle cx="8.5" cy="8" r="3"/><path d="M2.5 19.5c0-3.3 2.7-5.8 6-5.8s6 2.5 6 5.8"/><circle cx="17" cy="9" r="2.4"/><path d="M15 14c2.6.4 4.5 2.3 4.5 5"/>`,
  byggnad:    `<rect x="5" y="3.5" width="14" height="17" rx="1"/><line x1="9" y1="7.5" x2="9" y2="7.5"/><line x1="9" y1="11" x2="9" y2="11"/><line x1="9" y1="14.5" x2="9" y2="14.5"/><line x1="15" y1="7.5" x2="15" y2="7.5"/><line x1="15" y1="11" x2="15" y2="11"/><line x1="15" y1="14.5" x2="15" y2="14.5"/><rect x="10" y="16.5" width="4" height="4"/>`,
  stapel:     `<line x1="4" y1="20" x2="20" y2="20"/><rect x="6" y="13" width="3.4" height="7"/><rect x="10.3" y="8" width="3.4" height="12"/><rect x="14.6" y="4.5" width="3.4" height="15.5"/>`,
  glodlampa:  `<path d="M9 18h6"/><path d="M10 21h4"/><path d="M12 3a6 6 0 0 0-3.4 10.9c.6.5.9 1.1.9 1.9v.2h5v-.2c0-.8.3-1.4.9-1.9A6 6 0 0 0 12 3Z"/>`,
  upprepa:    `<path d="M4 12a8 8 0 0 1 14.5-4.7"/><polyline points="18.5,3 18.5,7.3 14.2,7.3"/><path d="M20 12a8 8 0 0 1-14.5 4.7"/><polyline points="5.5,21 5.5,16.7 9.8,16.7"/>`,
  klocka:     `<circle cx="12" cy="12" r="8.5"/><polyline points="12,7.5 12,12 15.5,14"/>`,
  volym:      `<path d="M4 9.5v5h3.5L13 18V6L7.5 9.5Z"/><path d="M16.5 9a4 4 0 0 1 0 6"/><path d="M19 6.5a7.5 7.5 0 0 1 0 11"/>`,
  volymAv:    `<path d="M4 9.5v5h3.5L13 18V6L7.5 9.5Z"/><line x1="16" y1="9.5" x2="21" y2="14.5"/><line x1="21" y1="9.5" x2="16" y2="14.5"/>`,
  mane:       `<path d="M20 13.5A8.5 8.5 0 1 1 10.5 4a7 7 0 0 0 9.5 9.5Z"/>`,
  sol:        `<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.3M12 19.2v2.3M21.5 12h-2.3M4.8 12H2.5M18.5 5.5l-1.6 1.6M7.1 16.9l-1.6 1.6M18.5 18.5l-1.6-1.6M7.1 7.1 5.5 5.5"/>`,
  loggaUt:    `<path d="M9 3.5H5.5A1.5 1.5 0 0 0 4 5v14a1.5 1.5 0 0 0 1.5 1.5H9"/><line x1="20" y1="12" x2="10" y2="12"/><polyline points="16,7.5 20.5,12 16,16.5"/>`,
  penna:      `<path d="M4 20l1-4.3L15.4 5.3a2 2 0 0 1 2.8 0l.5.5a2 2 0 0 1 0 2.8L8.3 19l-4.3 1Z"/><line x1="13.7" y1="7" x2="17" y2="10.3"/>`,
  skicka:     `<line x1="4" y1="20" x2="20" y2="4"/><polygon points="20,4 13,20 10,13 4,10"/>`,
  oga:        `<path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z"/><circle cx="12" cy="12" r="3"/>`,
  gnistra:    `<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18"/><circle cx="12" cy="12" r="2" fill="currentColor" stroke="none"/>`,
  pilHoger:   `<line x1="4" y1="12" x2="18" y2="12"/><polyline points="12,6 18,12 12,18"/>`,
  pilVanster: `<line x1="20" y1="12" x2="6" y2="12"/><polyline points="12,6 6,12 12,18"/>`,
  filter:     `<polygon points="4,4 20,4 14,12.5 14,19 10,21 10,12.5"/>`,
  info:       `<circle cx="12" cy="12" r="8.5"/><line x1="12" y1="11" x2="12" y2="16"/><circle cx="12" cy="7.6" r="1" fill="currentColor" stroke="none"/>`,
  papperskorg:`<path d="M5 6.5h14"/><path d="M9.5 6.5V4.8a1 1 0 0 1 1-1h3a1 1 0 0 1 1 1v1.7"/><path d="M7 6.5 7.8 19a1.5 1.5 0 0 0 1.5 1.4h5.4A1.5 1.5 0 0 0 16.2 19l.8-12.5"/><line x1="12" y1="10" x2="12" y2="16"/>`,
  lager:      `<polygon points="12,3 21,8 12,13 3,8"/><polyline points="3,13 12,18 21,13"/><polyline points="3,17.5 12,22.5 21,17.5"/>`
};

function ikon(namn, storlek = 20, klass = '') {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('width', storlek);
  svg.setAttribute('height', storlek);
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.9');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.style.flex = 'none';
  if (klass) svg.setAttribute('class', klass);
  svg.innerHTML = IKON_SVG[namn] || IKON_SVG.info;
  return svg;
}
