# Buurtjes tussen de Kerken · 20 december 2026

De website voor de **buurtjes tussen de kerken van Alem** en hun gezamenlijke pré-kerstborrel. Een eenvoudige Nederlandstalige hapjeslijst voor **één bijeenkomst**: zondag **20 december 2026**, vanaf **16.00 uur**, bij **Hart van Alem**.

[![CI](https://github.com/GaryWenneker/BringToGo/actions/workflows/ci.yml/badge.svg)](https://github.com/GaryWenneker/BringToGo/actions/workflows/ci.yml)

**Website:** https://bringtogo.netlify.app (de bestaande technische domeinnaam blijft behouden om uitnodigingslinks en sessies niet te verbreken).

## Wat kunnen de buurtjes doen?

- Bekijk wat er al op tafel komt en voeg zonder account je eigen hapje toe.
- Gebruik alleen je naam en een gerecht. Categorie, aantal porties, dieetlabels en opmerkingen zijn optioneel beschikbaar.
- Krijg een waarschuwing als iets lijkt op een al bestaand hapje; identieke gerechten worden in de database tegengehouden.
- Pas uitsluitend je eigen hapjes aan of verwijder ze. Ook de organisator kan andermans hapjes niet wijzigen.
- Bewaar je naam, aantal personen, huishoudelijke dieetwensen en gebruikelijke porties lokaal in de browser, zodat je deze niet steeds opnieuw hoeft in te voeren.
- Deel de uitnodiging, download je eigen persoonlijke toegangskoppeling en gebruik die om je bijdragen op een ander apparaat te beheren.
- Filter de lijst, bekijk de verdeling van gerechten en exporteer naar CSV of agenda.

De site is ingericht voor deze buurtborrel en heeft **geen publiek evenementenoverzicht of functie om nieuwe bijeenkomsten aan te maken**. De bestaande URL `/e/buurtborrel-alem-2026` blijft bruikbaar voor gedeelde uitnodigingslinks; de startpagina gebruikt dezelfde hapjeslijst.

De pagina `/mijn` biedt uitleg over je eigen bijdragen en het herstellen van je persoonlijke toegang. De URL `/nieuw` verwijst terug naar de startpagina. De oude API om bijeenkomsten aan te maken en het multi-evenementenoverzicht zijn verwijderd. API-verzoeken voor een andere event-ID geven een 404-fout.

## Privacy en toegang

Je sessie wordt in een HttpOnly-cookie bewaard. De server controleert bij bewerken en verwijderen of die sessie eigenaar van het hapje is; alleen het aanpassen van een naam biedt geen toegang tot bijdragen van iemand anders. Je bewaart en deelt persoonlijke toegangskoppelingen alleen met jezelf.

De gegevens van je huishouden worden in de lokale browseropslag onthouden. Gerechten, opmerkingen en dieetlabels worden niet automatisch hergebruikt voor een nieuw gerecht, omdat die per bijdrage kunnen verschillen. Na wissen van cookies kun je eigenaarschap herstellen via je persoonlijke toegangskoppeling.

## Sfeer

De site heeft een donkere kerststijl met lampjes, sterren en vallende sneeuw. De eigen foto van het besneeuwde kerkje in Alem staat op de homepage. Bij `prefers-reduced-motion` worden animaties uitgeschakeld.

## Techniek

- Next.js App Router, TypeScript, Node 22, Netlify
- Netlify Database / PostgreSQL
- De migratie in `netlify/database/migrations` bevat de vooraf aangemaakte bijeenkomst.
- Geen nieuwe databasemigratie voor de omzetting naar één evenement. Bestaande bijdragen blijven bewaard.
- De repository bevat nog enkele interne repository-methoden voor geïsoleerde integratietests; via de publieke site en API kunnen geen andere bijeenkomsten worden aangemaakt of opgevraagd.

### Lokaal controleren

```bash
npm ci
npm test
npm run build
npm run typecheck
```

Voor lokale ontwikkeling met Netlify en een database:

```bash
npx netlify-cli dev
```

Controleer bij een nieuwe productiepublicatie of de hapjeslijst vanaf verschillende browsers zichtbaar is en of eigen bijdragen werkelijk kunnen worden toegevoegd, gewijzigd en verwijderd. Gebruik geen willekeurige testbijdragen in het publieke buurtbuffet.
