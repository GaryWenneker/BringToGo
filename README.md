# BringToGo

Samen iets lekkers. Een Nederlandse potluckplanner die voorkomt dat alle buren met hetzelfde schaaltje aankomen.

[![CI](https://github.com/GaryWenneker/BringToGo/actions/workflows/ci.yml/badge.svg)](https://github.com/GaryWenneker/BringToGo/actions/workflows/ci.yml)

## Deelnemen zoals bij een datumprikker

1. Open de uitnodigingslink.
2. Vul je naam en je hapje in.
3. Klik op **Ik neem dit mee**.

Geen account, wachtwoord of verplicht e-mailadres. Extra details staan ingeklapt: categorie, aantallen, dieetlabels en opmerkingen. Standaard wordt uitgegaan van twaalf hapjes en één persoon; dit staat bij de bevestigingsknop en is aanpasbaar.

Op hetzelfde apparaat worden deelnemers herkend met een beveiligde cookie. Na aanmelding kun je een **persoonlijke toegangskoppeling** downloaden. Daarmee krijg je op een ander apparaat toegang tot dezelfde bijdragen en zelf aangemaakte bijeenkomsten. Deel deze persoonlijke link alleen met jezelf; gebruik voor de buurt de gewone uitnodigingslink. Bewaar hem vóór je cookies wist.

## Wat werkt

- Gedeelde, blijvend opgeslagen hapjeslijst voor alle apparaten.
- Controle op dubbele gerechten, inclusief hoofdletters, accenten en leestekens. Een unieke databasebeperking voorkomt gelijktijdige dubbele inschrijvingen.
- Waarschuwing als een gerecht lijkt op een bestaande bijdrage. Andere benamingen en recepten blijven een menselijke afweging.
- Categorieën en richtaantallen voor een gevarieerd buffet.
- Meerdere gerechten per huishouden; personen worden één keer geteld.
- Vegetarisch, vegan, glutenvrij en lactosevrij, met optionele dieetwensen en opmerkingen.
- Eigen bijdragen aanpassen en verwijderen. Organisatoren kunnen ook bijdragen van gasten beheren.
- Nieuwe bijeenkomsten aanmaken, eigen bijeenkomsten bewerken en inschrijving sluiten.
- **Mijn overzicht** met bijeenkomsten die je organiseert of waaraan je bijdraagt.
- Link delen via de apparaatdeelknop (bijvoorbeeld WhatsApp), met klembord als alternatief.
- Agenda-download met een herinnering één dag vooraf. De agenda-app bepaalt of die melding wordt getoond.
- CSV-export, zoekfunctie en filters op categorie, vega en eigen bijdragen.
- Responsive layout, toegankelijk formulier met toetsenbordbediening en zichtbare foutmeldingen.

De startpagina is vooraf ingevuld voor **20 december 2026, vanaf 16.00 uur bij Hart van Alem**. Drankjes worden ter plekke tegen inkoopprijs afgerekend. Het jaar 2026 is afgeleid van de eerstvolgende 20 december. De richtaantallen zijn startwaarden, geen afspraak uit de uitnodiging. Er staan geen fictieve deelnemers of reserveringen in de database.

## Netlify

Importeer de bestaande repository **GaryWenneker/BringToGo** via **Add new project → Import an existing project**. Kies `main` als productiebranch. De instellingen staan al in `netlify.toml`:

| Instelling | Waarde |
| --- | --- |
| Framework | Next.js, App Router |
| Build | `npm run build` |
| Publish | `.next` |
| Node | 22 |
| Opslag | Netlify Database / PostgreSQL |
| Migraties | `netlify/database/migrations/` |

Netlify detecteert de Next.js-adapter automatisch. De geïnstalleerde `@netlify/database`-package en SQL-migratie zijn voorbereid voor automatische databaseprovisioning en migratie tijdens deployment op een geschikt Netlify-account. Controleer na de eerste deploy **Data & Storage → Database**. De gedeelde lijst vereist een werkende database; zonder verbinding laat de app een foutmelding zien en worden bijdragen niet schijnbaar lokaal opgeslagen.

Je hebt een Netlify-account nodig waarop Netlify Database beschikbaar is. Een bestaande PostgreSQL-database kan ook via de servervariabele `DATABASE_URL` (Functions en Builds). Netlify gebruikt normaal `NETLIFY_DB_URL`. Zet databasegegevens nooit in `NEXT_PUBLIC_*` of in Git. Voor een eigen database pas je de meegeleverde migratie zelf toe met je eigen migratiebeheer; laat Netlify-hosted migraties door Netlify uitvoeren.

De vaste buurtborrel wordt als seed aangemaakt. De gegevens daarvan wijzigen via een nieuwe SQL-migratie; er is bewust geen openbare knop waarmee de eerste bezoeker de organisatie kan overnemen. Bijeenkomsten die je via **Nieuwe bijeenkomst** maakt hebben direct een eigen organisator en kunnen in de app beheerd worden.

## Lokaal ontwikkelen

```sh
npm ci
npx netlify-cli dev
```

Voer tijdens lokale ontwikkeling met een draaiende Netlify-database eenmalig uit:

```sh
npx netlify-cli database migrations apply
```

Of stel in `.env.local` een lokale `DATABASE_URL` in, pas de migratie op die lokale PostgreSQL-database toe en start `npm run dev`.

```sh
npm test
npm run build
npm run typecheck
```

De integratietests draaien de echte PostgreSQL-migratie en repositoryqueries in een geïsoleerde PGlite-database. Ze hebben geen productieverbinding of secrets nodig. CI draait deze controles op iedere push naar `main` en iedere pull request.

## Onderzoek en grenzen

Zie [functioneel onderzoek](docs/functioneel-onderzoek.md) voor de vergelijking met Datumprikker, PerfectPotluck, Meal Train en SignUpGenius en de gemaakte keuzes.

De applicatie verstuurt geen automatische e-mails of sms-berichten en verwerkt geen betalingen. De herinnering zit in het agenda-bestand. Uitnodigingslinks geven lees- en aanmeldtoegang; ze vormen geen identiteitscontrole van een buur. Nieuwe bijeenkomsten hebben een willekeurige uitnodigings-ID en er is geen openbare evenementencatalogus. De vaste buurtborrel staat op de startpagina. Dieetlabels zijn door deelnemers opgegeven informatie; bespreek allergieën onderling.

Voor deze eerste oplevering zijn build, typecontrole en database-integratietests uitgevoerd. Een live Netlify-deploy en visuele browsertest zijn afzonderlijke verificaties en worden niet door deze tests bewezen.
