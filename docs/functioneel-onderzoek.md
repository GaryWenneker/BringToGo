# Functioneel onderzoek · Buurtjes tussen de Kerken

Onderzocht op 18 oktober 2026. Alleen officiële product- en hulppagina's gebruikt. Dit document vergelijkt functionaliteit, geen actuele abonnementprijzen.

| Dienst | Gecontroleerde mogelijkheden | Keuze voor deze buurtborrel |
| --- | --- | --- |
| [Datumprikker](https://support.datumprikker.nl/article/12-account-aanmaken-voor-afspraak-aanmaken) | Een afspraak aanmaken zonder account; naam en e-mail; persoonlijke beheerlink via e-mail. Een account is een afzonderlijke optie. | Geen verplichte accountregistratie. Naam en hapje volstaan. Persoonlijke toegangskoppeling om later terug te komen; voor de basis is geen mailprovider nodig. |
| [Datumprikker WhatsApp](https://datumprikker.nl/algemeen/whatsapp) | Uitnodigingslink delen zonder vooraf e-mailadressen van deelnemers te verzamelen. | Één gedeelde uitnodigingslink, apparaatdeelknop en klembordalternatief. |
| [PerfectPotluck](https://perfectpotluck.com/help.php) | Aanpasbare categorieën, aantal inschrijfplekken, direct inschrijven zonder account, bijdragen wijzigen en verwijderen, organisatorbeheer en optionele e-mailherinneringen. RSVP wordt doorgaans als categorie ingericht. | Zichtbare bijdragen, richtaantallen, wijzigen en verwijderen. Huishoudgrootte apart vastleggen zodat meerdere gerechten geen dubbele personen opleveren. |
| [Meal Train Potluck](https://www.mealtrain.com/learn/potluck/) | Eén datum en veel deelnemers; locatie; menucategorieën en gewenste aantallen; bijdragen met notities; optionele gezamenlijke geldpot. | Datum, locatie, categorieën, aantallen en notities. Drankinformatie als aparte uitleg bij de uitnodiging. |
| [Meal Train beheer](https://www.mealtrain.com/help/article/70-edit-a-potluck) | Organisator kan categorieën, eventgegevens en deelnemerslijst beheren. | Organisator kan eigen nieuwe bijeenkomsten aanpassen, sluiten en deelnemersbijdragen corrigeren. |
| [SignUpGenius Potluck](https://www.signupgenius.com/how-to-use/potluck) | Categorieën of concrete gerechten met beschikbare plekken, inschrijven zonder gastaccount, zicht op al gereserveerde gerechten, delen en herinneringen. | Alleen naam en gerecht verplicht. Zichtbare lijst plus databasecontrole op dubbele namen; zachte waarschuwing voor vergelijkbare gerechten. |

## Uitgewerkte gebruikersroutes

### De buur

Opent de link uit de buurtapp, bekijkt de bestaande hapjes en drukt op **Ik neem iets mee**. Naam en gerecht zijn de enige verplichte invoer. Onder **Extra details** kunnen aantallen, categorie, labels en opmerkingen worden aangepast. Na opslaan staat de bijdrage in het gezamenlijke overzicht. De buur kan meteen verder en hoeft niets te bevestigen via e-mail.

### Terugkomen

De sessiecookie herkent hetzelfde apparaat. **Van mij** filtert de eigen bijdragen. Een potloodknop opent het wijzigformulier; verwijderen vraagt een extra bevestiging. **Bewaar mijn persoonlijke link** downloadt een privélink voor een ander apparaat. De geheime toegangscode staat in het URL-fragment en komt niet in de normale HTTP-URL of referrer. De herstelpagina wisselt hem voor een HttpOnly-cookie en verwijdert het fragment uit de browsergeschiedenis. Deze link geeft toegang tot dezelfde sessie en is daarom persoonlijk, geen uitnodigingslink.

### De organisator

Maakt zonder account een bijeenkomst met titel, datum, tijd, locatie en uitnodiging. Richtaantallen en drankinformatie zijn extra opties. De organisator deelt de gewone uitnodigingslink en bewaart de persoonlijke link. Vanuit **Mijn overzicht** zijn eigen bijeenkomsten terug te vinden. De organisator kan informatie wijzigen, de inschrijving sluiten en bijdragen corrigeren.

## Keuzes voor deze buurtborrel

- De datum staat vast: een datumstemming voegt hier onnodige stappen toe.
- Eerst zicht op het buffet, dan een korte aanmelding.
- Categorieën met richtaantallen helpen variatie zonder een extra schaaltje onnodig te blokkeren.
- Exact gelijke genormaliseerde gerecht­namen mogen per bijeenkomst maar één keer voorkomen, ook bij gelijktijdige verzoeken.
- De naamcontrole herkent geen alle synoniemen. De vergelijkingswaarschuwing en zichtbare lijst vullen die controle aan; er wordt geen semantische garantie gegeven.
- Dieetwensen horen bij het huishouden; labels en ingrediëntenopmerkingen bij het gerecht.
- Personen worden eenmaal per huishouden geteld. Als een gedeeld apparaat voor verschillende huishoudens wordt gebruikt, gebruik je een aparte browser of persoonlijke link per huishouden.
- Drankjes worden bij Hart van Alem genoteerd en tegen inkoopprijs afgerekend. Een betaalmodule is voor deze route niet nodig.
- Agenda-export met een herinnering is beschikbaar. Automatische e-mail/sms vereist een mailprovider, afleverbeheer en aanvullende contactgegevens en valt buiten deze werkende basis.

## Technische onderbouwing

[Next.js op Netlify](https://docs.netlify.com/build/frameworks/framework-setup-guides/nextjs/overview/) ondersteunt de App Router en route handlers via de automatisch gekozen OpenNext-adapter. [Netlify Database](https://docs.netlify.com/build/data-and-storage/netlify-database/getting-started/) biedt gedeelde PostgreSQL-opslag; de [API-documentatie](https://docs.netlify.com/build/data-and-storage/netlify-database/api/) beschrijft de gebruikte databaseclient. Migraties worden met de code ingecheckt en door het deploymentproces toegepast.

De databasebeperking op `(event_id, dish_key)` is de uiteindelijke dubbelcontrole. Het maken of bijwerken van een huishouden en gerecht gebeurt in één SQL-statement. Een mislukte inschrijving verandert daardoor ook het opgegeven aantal personen niet. Eigen wijzigingen worden gekoppeld aan een gehashte, willekeurige sessiecode. De server controleert dezelfde herkomst bij schrijfacties en stuurt geen eigenaarcodes terug in de gedeelde hapjeslijst.
