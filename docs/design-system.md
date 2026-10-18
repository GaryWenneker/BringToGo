# BringToGo · Midnight Celebration

BringToGo gebruikt voor de kerst- en nieuwjaarsperiode een vaste **dark mode**: warm en feestelijk, zonder sneeuwvlokjes overal of drukke animaties. De eenvoudigste route blijft leidend: uitnodiging openen, naam en hapje invullen, bevestigen.

## Ontwerpprincipes

- **Warmte op een donkere achtergrond.** Nachtblauw en antraciet zorgen voor rust, dennengroen voor de primaire acties, bordeaux voor de uitnodigingskaart en champagnegoud voor bijzondere details.
- **Uitnodigingsgevoel boven dashboardgevoel.** De datumkaart is het visuele middelpunt; daarna volgen het gedeelde buffet en de handige balansmeter.
- **Rustige decoratie.** Lichte sterpuntjes en heel subtiele pulserende sterren. Geen afbeeldingen, snow-canvas, JavaScript-animaties of extra dependencies.
- **Deelnemen blijft moeiteloos.** Geen nieuwe stappen, accounts, e-mailvereisten of extra velden.

## Kleuren

| Toepassing | Token | Hex |
| --- | --- | --- |
| Achtergrond | `--paper` | `#0a1119` |
| Hoge oppervlakken | `--white` | `#17242c` |
| Primaire tekst | `--ink` | `#f7f1e7` |
| Secundaire tekst | `--muted` | `#b6c1bf` |
| Primair groen | `--green` | `#286b57` |
| Subtiel groen | `--green-soft` | `#17372f` |
| Borders | `--line` | `#31434a` |
| Goudaccent | `--holiday-gold` | `#e4c68c` |
| Kerstgroen | `--holiday-pine` | `#17483d` |
| Bordeaux | `--holiday-wine` | `#592b3e` |

Typografie: **DM Sans** voor bediening, navigatie en lopende tekst; **Libre Caslon Display** voor grote koppen en warme uitnodigingsteksten. Beide stonden al in de applicatie.

## Componenten

- **Header:** donker glasachtig vlak, dun gouden scheidingslijntje, warme gouden markering bij het logo.
- **Hero:** afgeronde, diepdonkere uitnodiging met gradient in groen/bordeaux en een discreet sterrenveld.
- **Datumkaart:** bordeaux met gouden rand en champagneaccenten; blijft een opvallende 'ticket'-vorm.
- **Actieknoppen:** contrastrijk dennengroen, zachte gouden focusring en hoverglow.
- **Hapjeskaarten:** iets lichter dan de pagina voor helder onderscheid, met subtiele randverlichting bij hover.
- **Balansmeter:** donkergroene panelen met champagnekleurige voortgangsstroken.
- **Drankjes:** bordeaux accentpaneel.
- **Dialogen, formulieren en foutmeldingen:** dezelfde donkere kleuren met zichtbare tekst, labels, borders en feedback.
- **Mijn overzicht, herstelpagina en bijeenkomstbeheer:** dezelfde componentafwerking.

## Responsiviteit en toegankelijkheid

Bestaande breakpoints blijven intact: 1000, 760 en 520 px, met een enkele kolom voor de belangrijkste inhoud op smalle telefoons. Interactieve invoervelden blijven voldoende hoog, focusindicatoren zijn zichtbaar met toetsenbord en `prefers-reduced-motion` schakelt de decoratieve animatie uit. Bij Windows High Contrast/forced-colors behouden essentiële vlakken hun contouren.

## Implementatie

`src/app/holiday-theme.css` bevat alleen de seizoensgebonden overrides en staat **na** `globals.css` geïmporteerd in `src/app/layout.tsx`. Dat houdt de bestaande componentlogica en layouts gescheiden van de kerststijl. Voor een toekomstige andere campagne hoeft de applicatielogica niet herschreven te worden.

## Controles vóór publicatie

1. `npm ci && npm test && npm run build && npm run typecheck`
2. Beoordeel de startpagina, aanmeldmodal, beheerformulier, Mijn overzicht en persoonlijke-link-herstelpagina.
3. Controleer desktop, 390 px mobiel en 320 px mobiel op horizontale overflow.
4. Controleer toetsenbordfocus, foutmeldingen, ingeklapte extra velden en verminderde beweging.
5. Controleer na Netlify-deploy of Postgres-verbinding en opslaan/ophalen van hapjes werken.
