# Buurtjes tussen de Kerken · Winterfeest op 20 december

De naam van de website is **Buurtjes tussen de Kerken** en de datumregel in de header luidt **20 december · Alem**. Deze website is alleen voor de buurtborrel in Hart van Alem. De actuele live vormgeving combineert donker dennengroen en bordeaux met warme gouden kerstlampjes, vallende sneeuw, sterren en de foto van het besneeuwde kerkje. De effecten schakelen uit bij verminderde beweging. De eerdere sobere 'Winteravond'-richtlijnen hieronder vormen de basis voor leesbaarheid, niet een verbod op feestelijke accenten.

# Oorspronkelijke Winteravond-basis

De basisstijl van de website is een sobere, donkere uitnodiging voor mensen die samen iets organiseren. De decemberse sfeer zit in de kleuren, niet in animaties en decoraties. De ervaring moet vertrouwd en eenvoudig aanvoelen, alsof je een nette uitnodiging van een buur ontvangt.

## Visuele uitgangspunten

- **Rustig en eenvoudig:** vlakke achtergronden, duidelijke typografie, ingetogen kleuren, nauwelijks schaduw, geen kleurverlopen of glows.
- **Feestelijk zonder kerstclichés:** nachtdonker groen, warm crème, gedempt goud en een bordeaux datumkaart. Voorkom dat decoraties tekst of bediening overlappen.
- **Echte buurtcommunicatie:** korte, gewone Nederlandse teksten zonder reclamekreten. Duidelijke knop: 'Ik neem iets mee'.
- **De taak staat centraal:** bekijk bestaande hapjes en voeg er zonder account een toe. Verder niets verplicht.

## Kleuren

| Toepassing | CSS-variabele | Waarde |
| --- | --- | --- |
| Achtergrond | `--paper` | `#111915` |
| Kaarten | `--white` | `#1c2922` |
| Tekst | `--ink` | `#f0eee6` |
| Secundaire tekst | `--muted` | `#b8c0b8` |
| Actieknoppen | `--green` | `#315e48` |
| Lichte accenten | `--holiday-gold` | `#c5ad82` |
| Borderranden | `--line` | `#43534a` |
| Datumkaart | `--holiday-wine` | `#503a3d` |

Typografie blijft DM Sans voor leesbare interface-tekst en Libre Caslon Display voor de uitnodigingskoppen.

## Componenten

De donkere header heeft een gewone scheidingslijn. De hero gebruikt een gelijkmatig dennengroen vlak. De bordeaux datumkaart is recht geplaatst, zonder schaduw of scheefstand. De hapjeskaarten en de aanmeldmodal hebben scherpe, subtiel afgeronde hoeken. Knoppen zijn vlak en worden bij hover alleen iets lichter. De verdeling van de hapjes is een rustig groen paneel, de drankinformatie een bordeaux paneel.

Alle pagina's delen deze afwerking, waaronder de startpagina, persoonlijke lijst, nieuwe bijeenkomst en beheerformulier.

## Implementatie

De bestaande applicatie gebruikt `src/app/globals.css`, gevolgd door `src/app/holiday-theme.css`. De bovenste dark-mode regels blijven de brede compatibiliteitsbasis; de laatste sectie onder de kop **Winteravond** is de definitieve, ingetogen vormgeving. Nieuwe ontwerpwijzigingen moeten op termijn in één samenhangende themalaag worden samengebracht. Functionaliteit of API's zijn niet gewijzigd.

## Controleren

1. `npm ci && npm test && npm run build && npm run typecheck`.
2. Bekijk desktop, tablet en telefoons van 390 en 320 px.
3. Open aanmelden, filters, Mijn overzicht, nieuwe bijeenkomst en beheer.
4. Controleer de toetsenbordfocus, contrast, foutmeldingen en `prefers-reduced-motion`.
5. Bevestig op Netlify dat zowel de site als de gedeelde PostgreSQL-lijst werkt.
