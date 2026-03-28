#!/usr/bin/env python3
"""
Expand fishing-calendar-regional.json with richer, SEO-friendly Italian content.
Each entry gets expanded regionalNote, conditions, localTip, plus new expertAdvice and weatherContext fields.
"""
import json
import random
import os

random.seed(42)

REGIONS = {
    "sardegna": {
        "coasts": ["le scogliere granitiche della Gallura", "le falesie calcaree del Golfo di Orosei", "le coste selvagge del Sulcis-Iglesiente", "le spiagge bianche del sud"],
        "landmarks": ["Capo Testa", "Buggerru", "Villasimius", "Stintino", "Porto Torres", "Alghero", "Cala Gonone", "Arbatax"],
        "lagoons": ["gli stagni costieri di Cabras e Calich", "le lagune di Tortolì e San Teodoro"],
        "wind_dominant": "Maestrale",
        "winds_all": ["Maestrale", "Ponente", "Scirocco", "Levante"],
        "geography": "coste granitiche e calcaree con fondali tra i più limpidi del Mediterraneo",
        "water_note": "acque cristalline e ricche di posidonia",
        "rivers": ["Flumendosa", "Tirso", "Coghinas"],
        "deep_features": "secche granitiche sommerse e praterie di posidonia",
        "uniqueness": "la varietà di ambienti marini dell'isola, dalle lagune ai canyon sottomarini",
    },
    "sicilia": {
        "coasts": ["la costa tirrenica settentrionale", "le scogliere ioniche di Catania e Siracusa", "la costa sud del Canale di Sicilia", "le isole Eolie e le Egadi"],
        "landmarks": ["Capo San Vito", "Isola delle Correnti", "Marzamemi", "Portopalo", "Mondello", "Cefalù", "Taormina", "Favignana"],
        "lagoons": ["le saline di Trapani", "la laguna di Marsala"],
        "wind_dominant": "Scirocco",
        "winds_all": ["Scirocco", "Libeccio", "Tramontana", "Grecale"],
        "geography": "tre coste diverse — tirrenica, ionica e mediterranea — con fondali vulcanici e sabbiosi",
        "water_note": "acque calde influenzate dalle correnti del Canale di Sicilia",
        "rivers": ["Simeto", "Alcantara", "Belice"],
        "deep_features": "fondali vulcanici, secche coralligene e praterie di posidonia",
        "uniqueness": "la posizione strategica tra Tirreno e Canale di Sicilia, crocevia di correnti e migrazioni",
    },
    "liguria": {
        "coasts": ["le scogliere a picco della Riviera di Ponente", "le calette profonde del Tigullio", "il promontorio di Portofino", "le Cinque Terre"],
        "landmarks": ["Portofino", "Camogli", "Arenzano", "Varazze", "le Cinque Terre", "Capo Noli", "Bergeggi", "Lerici"],
        "lagoons": [],
        "wind_dominant": "Tramontana",
        "winds_all": ["Tramontana", "Libeccio", "Scirocco", "Maestrale"],
        "geography": "costa stretta e ripida con fondali profondi a pochi metri dalla riva",
        "water_note": "acque profonde e ricche di nutrienti grazie alle correnti liguri",
        "rivers": ["Magra", "Entella", "Polcevera"],
        "deep_features": "fondali rocciosi che digradano rapidamente oltre i 20 metri a poca distanza dalla costa",
        "uniqueness": "la profondità raggiunta a pochi passi dalla riva, ideale per pesci di taglia",
    },
    "puglia": {
        "coasts": ["le scogliere del Gargano", "la costa barese con le sue piattaforme rocciose", "le basse scogliere del Salento", "la costa ionica sabbiosa"],
        "landmarks": ["Vieste", "Polignano a Mare", "Otranto", "Gallipoli", "Santa Maria di Leuca", "Monopoli", "Porto Cesareo", "Punta Prosciutto"],
        "lagoons": ["le lagune di Lesina e Varano", "le paludi salmastre del Salento"],
        "wind_dominant": "Tramontana",
        "winds_all": ["Tramontana", "Grecale", "Scirocco", "Levante"],
        "geography": "la costa più lunga d'Italia con ambienti che spaziano dalle falesie del Gargano alle sabbie ioniche",
        "water_note": "acque adriatiche trasparenti sul versante orientale e calde correnti ioniche a sud",
        "rivers": ["Ofanto", "Bradano"],
        "deep_features": "piattaforme calcaree sommerse, praterie di posidonia e fondi sabbiosi",
        "uniqueness": "la doppia esposizione adriatica e ionica che garantisce sempre un lato pescabile",
    },
    "toscana": {
        "coasts": ["la Maremma selvaggia", "la Versilia sabbiosa", "il promontorio dell'Argentario", "le isole dell'Arcipelago Toscano"],
        "landmarks": ["Argentario", "Isola d'Elba", "Castiglione della Pescaia", "Piombino", "Forte dei Marmi", "Marina di Cecina", "Giglio", "Capraia"],
        "lagoons": ["la laguna di Orbetello", "le zone umide della foce dell'Ombrone"],
        "wind_dominant": "Libeccio",
        "winds_all": ["Libeccio", "Maestrale", "Tramontana", "Grecale"],
        "geography": "costa variegata dalla Versilia sabbiosa alla Maremma rocciosa, con l'Arcipelago Toscano a largo",
        "water_note": "acque influenzate dalla corrente tirrenica con fondali ricchi di posidonia",
        "rivers": ["Arno", "Ombrone", "Serchio"],
        "deep_features": "secche rocciose, fondali misti sabbia-roccia e le pareti sommerse dell'Argentario",
        "uniqueness": "la presenza dell'Arcipelago Toscano che crea ambienti pelagici a breve distanza dalla costa",
    },
    "campania": {
        "coasts": ["il Golfo di Napoli", "la Costiera Amalfitana", "il Cilento", "le isole di Ischia, Capri e Procida"],
        "landmarks": ["Ischia", "Capri", "Li Galli", "Punta Campanella", "Marina di Camerota", "Acciaroli", "Procida", "Baia"],
        "lagoons": ["il Lago di Fusaro", "il Lago Lucrino"],
        "wind_dominant": "Grecale",
        "winds_all": ["Grecale", "Libeccio", "Scirocco", "Ponente"],
        "geography": "golfi, penisole e isole vulcaniche con fondali che alternano roccia lavica e sabbia",
        "water_note": "acque termali e vulcaniche che creano microhabitat unici per le specie marine",
        "rivers": ["Volturno", "Sele", "Sarno"],
        "deep_features": "canyon sottomarini vulcanici, secche coralligene e fondali di origine lavica",
        "uniqueness": "l'origine vulcanica dei fondali che crea tane e anfratti perfetti per i predatori",
    },
    "lazio": {
        "coasts": ["le spiagge lunghe e sabbiose da Montalto a Nettuno", "il promontorio del Circeo", "le coste rocciose di Gaeta e Sperlonga", "le isole Ponziane"],
        "landmarks": ["Ponza", "il Circeo", "Gaeta", "Sperlonga", "Fiumicino", "Santa Marinella", "Anzio", "Ventotene"],
        "lagoons": ["i laghi costieri di Sabaudia e Fogliano"],
        "wind_dominant": "Ponente",
        "winds_all": ["Ponente", "Libeccio", "Scirocco", "Tramontana"],
        "geography": "prevalentemente sabbioso con importanti eccezioni rocciose al Circeo, a Gaeta e alle isole Ponziane",
        "water_note": "acque tirreniche temperate con influenza delle foci del Tevere e del Garigliano",
        "rivers": ["Tevere", "Garigliano", "Mignone"],
        "deep_features": "fondali sabbiosi interrotti da secche rocciose e dalla barriera corallina fossile del Circeo",
        "uniqueness": "il contrasto tra le lunghe spiagge e le scogliere del Circeo e di Gaeta, con le Ponziane a un'ora di navigazione",
    },
    "calabria": {
        "coasts": ["la costa tirrenica rocciosa e scoscesa", "la costa ionica sabbiosa e più dolce", "lo Stretto di Messina", "la Costa degli Dei e la Costa Viola"],
        "landmarks": ["Tropea", "Scilla", "Capo Rizzuto", "Soverato", "Pizzo Calabro", "Roccella Ionica", "Bagnara Calabra", "Diamante"],
        "lagoons": [],
        "wind_dominant": "Grecale",
        "winds_all": ["Grecale", "Libeccio", "Scirocco", "Maestrale"],
        "geography": "doppia costa — tirrenica e ionica — con lo Stretto di Messina che genera correnti uniche",
        "water_note": "acque influenzate dalle correnti dello Stretto di Messina, ricche di nutrienti e ossigeno",
        "rivers": ["Crati", "Neto", "Lao"],
        "deep_features": "fondali che precipitano in profondità lungo la Costa Viola e l'area dello Stretto",
        "uniqueness": "le correnti potentissime dello Stretto di Messina che attraggono pelagici di taglia durante le migrazioni",
    },
    "veneto": {
        "coasts": ["la laguna di Venezia", "il Delta del Po", "le spiagge sabbiose del litorale", "le tegnùe — scogliere sommerse naturali"],
        "landmarks": ["Venezia", "Chioggia", "Caorle", "Jesolo", "Porto Tolle", "Sottomarina", "Pellestrina", "Bibione"],
        "lagoons": ["la Laguna di Venezia", "le valli da pesca del Delta del Po", "le barene"],
        "wind_dominant": "Bora",
        "winds_all": ["Bora", "Scirocco", "Tramontana", "Levante"],
        "geography": "costa bassa e sabbiosa con la laguna di Venezia e il Delta del Po che creano ambienti unici",
        "water_note": "acque adriatiche poco profonde arricchite dagli apporti fluviali del Po e dei fiumi veneti",
        "rivers": ["Po", "Adige", "Brenta", "Piave", "Tagliamento"],
        "deep_features": "le tegnùe — affioramenti rocciosi naturali che emergono dai fondali sabbiosi — e le secche del Delta",
        "uniqueness": "la Laguna di Venezia e il Delta del Po, ambienti di transizione dove si mescolano acqua dolce e salata",
    },
    "emilia-romagna": {
        "coasts": ["le spiagge sabbiose della Riviera Romagnola", "le dighe foranee dei porti", "le piattaforme offshore", "le foci dei canali e dei fiumi"],
        "landmarks": ["Cesenatico", "Rimini", "Cattolica", "Marina di Ravenna", "Comacchio", "Porto Garibaldi", "Cervia", "Riccione"],
        "lagoons": ["le Valli di Comacchio", "le zone umide del ravennate"],
        "wind_dominant": "Bora",
        "winds_all": ["Bora", "Scirocco", "Tramontana", "Levante"],
        "geography": "costa bassa e sabbiosa con dighe foranee, piattaforme e i canali delle Valli di Comacchio",
        "water_note": "acque adriatiche ricche di plancton grazie agli apporti del Po e dei fiumi romagnoli",
        "rivers": ["Reno", "Lamone", "Savio", "Marecchia"],
        "deep_features": "piattaforme offshore, barriere artificiali sommerse e i fondali molli del litorale",
        "uniqueness": "le dighe foranee e le piattaforme offshore che funzionano come reef artificiali, concentrando il pesce",
    },
}

MONTHS = {
    "gennaio": {
        "season": "inverno",
        "temp_air": "5-10°C",
        "daylight": "corte",
        "general_weather": "freddo intenso con frequenti perturbazioni atlantiche",
        "sea_state": "spesso mosso con mareggiate",
        "bio_event": "le spigole si avvicinano alla costa per la riproduzione, i calamari sono al picco della stagione",
        "best_period": "le pause tra le perturbazioni e le giornate di calma dopo le mareggiate",
        "fishing_mood": "pochi pescatori ma chi esce viene ricompensato",
    },
    "febbraio": {
        "season": "inverno",
        "temp_air": "6-11°C",
        "daylight": "in allungamento",
        "general_weather": "ancora freddo ma con le prime giornate più miti",
        "sea_state": "variabile, con alternanza di calme e mareggiate",
        "bio_event": "le spigole continuano l'attività riproduttiva, le seppie iniziano a muoversi verso costa",
        "best_period": "le giornate di sole tra una perturbazione e l'altra",
        "fishing_mood": "mese di transizione con sorprese per i più costanti",
    },
    "marzo": {
        "season": "primavera",
        "temp_air": "8-14°C",
        "daylight": "in netto aumento",
        "general_weather": "instabile con alternanza di giornate primaverili e ritorni di freddo",
        "sea_state": "in miglioramento progressivo",
        "bio_event": "le seppie si avvicinano per la riproduzione, i saraghi tornano attivi, la spigola chiude la stagione riproduttiva",
        "best_period": "le mattine di sole dopo notti fredde stimolano l'attività dei pesci",
        "fishing_mood": "il risveglio primaverile porta entusiasmo e prime catture di stagione",
    },
    "aprile": {
        "season": "primavera",
        "temp_air": "12-18°C",
        "daylight": "lunghe",
        "general_weather": "mite con piogge primaverili alternale a belle giornate",
        "sea_state": "generalmente calmo con occasionali sciroccate",
        "bio_event": "le seppie sono nel pieno della migrazione riproduttiva, le orate iniziano ad avvicinarsi, i cefali sono in piena attività",
        "best_period": "tutto il mese è produttivo, con picchi all'alba e al tramonto",
        "fishing_mood": "mese ricchissimo, la primavera piena porta abbondanza sotto costa",
    },
    "maggio": {
        "season": "primavera",
        "temp_air": "16-22°C",
        "daylight": "molto lunghe",
        "general_weather": "caldo gradevole con rare perturbazioni",
        "sea_state": "prevalentemente calmo",
        "bio_event": "esplosione di attività: orate sotto costa, primi pelagici, saraghi in frega, lecce e barracuda attivi",
        "best_period": "le prime ore del mattino e il tardo pomeriggio sono le finestre migliori",
        "fishing_mood": "uno dei mesi più completi dell'anno, con moltissime specie in attività",
    },
    "giugno": {
        "season": "estate",
        "temp_air": "20-28°C",
        "daylight": "massima",
        "general_weather": "caldo e soleggiato, rare piogge",
        "sea_state": "calmo, con bonacce frequenti",
        "bio_event": "i pelagici si avvicinano alla costa, le ricciole sono attive, le orate stazionano sui fondali poco profondi",
        "best_period": "alba e tramonto sono imprescindibili, la notte offre sorprese con calamari e totani",
        "fishing_mood": "la stagione estiva entra nel vivo con abbondanza di specie e giornate lunghissime",
    },
    "luglio": {
        "season": "estate",
        "temp_air": "24-32°C",
        "daylight": "massima",
        "general_weather": "caldo intenso, cielo sereno, rari temporali estivi",
        "sea_state": "calmo, spesso piatto con bonacce prolungate",
        "bio_event": "il picco dei pelagici — tonnetti, lampughe, lecce — e dei predatori di superficie",
        "best_period": "le ore centrali sono da evitare: pescare all'alba, nel tardo pomeriggio o di notte",
        "fishing_mood": "grande varietà di specie ma il caldo impone orari strategici",
    },
    "agosto": {
        "season": "estate",
        "temp_air": "25-33°C",
        "daylight": "ancora molto lunghe",
        "general_weather": "massimo caldo dell'anno, occasionali temporali pomeridiani",
        "sea_state": "prevalentemente calmo con improvvise sciroccate",
        "bio_event": "pelagici al massimo, acque calde attirano specie tropicali, i pesci stanziali si riparano in profondità",
        "best_period": "la pesca notturna e le prime luci dell'alba sono i momenti d'oro",
        "fishing_mood": "mese turistico per eccellenza ma chi pesca negli orari giusti trova abbondanza",
    },
    "settembre": {
        "season": "autunno",
        "temp_air": "19-26°C",
        "daylight": "in accorciamento",
        "general_weather": "ancora caldo ma con le prime perturbazioni autunnali",
        "sea_state": "variabile, con le prime mareggiate della stagione",
        "bio_event": "il mese migliore per molte regioni: i pesci mangiano voracemente prima dell'inverno, le ricciole sono al picco",
        "best_period": "tutto il giorno è produttivo, con punte eccezionali all'alba e dopo le prime mareggiate",
        "fishing_mood": "il mese d'oro della pesca in mare, abbondanza di prede e condizioni ideali",
    },
    "ottobre": {
        "season": "autunno",
        "temp_air": "14-20°C",
        "daylight": "in rapido accorciamento",
        "general_weather": "fresco con piogge autunnali e prime giornate fredde",
        "sea_state": "spesso mosso con frequenti libecciate e sciroccate",
        "bio_event": "le spigole tornano in attività sotto costa, le orate si spostano verso i porti, i cefalopodi iniziano la stagione",
        "best_period": "le scadute dopo le mareggiate sono momenti magici per i predatori",
        "fishing_mood": "ottimo mese per chi ama il surfcasting e la pesca in scogliera con mare formato",
    },
    "novembre": {
        "season": "autunno",
        "temp_air": "9-15°C",
        "daylight": "corte",
        "general_weather": "freddo umido con frequenti perturbazioni",
        "sea_state": "spesso agitato con mareggiate importanti",
        "bio_event": "le spigole sono voracissime, i calamari si avvicinano, le mormore mangiano nella risacca",
        "best_period": "le finestre di bel tempo tra una perturbazione e l'altra sono da non perdere",
        "fishing_mood": "mese sottovalutato che regala catture memorabili a chi non teme il freddo",
    },
    "dicembre": {
        "season": "inverno",
        "temp_air": "5-11°C",
        "daylight": "minima",
        "general_weather": "freddo con perturbazioni frequenti e possibili nevicate sulle coste",
        "sea_state": "spesso mosso o molto mosso",
        "bio_event": "le spigole iniziano la fase pre-riproduttiva, i calamari sono al picco notturno, le sogliole si avvicinano",
        "best_period": "le rare giornate di calma invernale sono le più produttive dell'anno",
        "fishing_mood": "per veri appassionati: il freddo tiene lontano la folla e le catture possono essere straordinarie",
    },
}

SPECIES = {
    "spigola": {
        "name_it": "spigola",
        "habitat": ["foci dei fiumi", "scogliere battute", "porti", "moli", "zone di risacca"],
        "depth": "1-8 metri",
        "bottom": "roccioso con sabbia, piedi di scogliera",
        "best_time": "alba e tramonto, specialmente con mare in scaduta",
        "behavior_winter": "si avvicina sotto costa per la riproduzione, caccia attivamente nelle zone di turbolenza",
        "behavior_spring": "in fase post-riproduttiva, si nutre voracemente per recuperare energie",
        "behavior_summer": "si sposta in zone più profonde e ombreggiate, attiva soprattutto di notte",
        "behavior_autumn": "torna sotto costa seguendo le prede, molto aggressiva sugli artificiali",
        "feeding": "predatore opportunista che caccia cefali, gamberetti e piccoli pesci nella schiuma delle onde",
        "practical_tips": ["usare minnow da 9-12cm in acque mosse", "la schiuma bianca delle onde è il punto esatto dove cercarla", "dopo una mareggiata le spigole si concentrano nelle foci"],
    },
    "orata": {
        "name_it": "orata",
        "habitat": ["fondali sabbiosi", "praterie di posidonia", "zone portuali", "canali di laguna"],
        "depth": "2-12 metri",
        "bottom": "sabbia e posidonia, vicino a rocce sparse",
        "best_time": "dall'alba alle prime ore del mattino",
        "behavior_winter": "si ritira in acque più profonde e tiepide, meno attiva",
        "behavior_spring": "inizia ad avvicinarsi alla costa, cerca cibo tra la posidonia",
        "behavior_summer": "staziona sui fondali poco profondi, attiva all'alba e al tramonto",
        "behavior_autumn": "fase di alimentazione intensa prima dell'inverno, si trova sotto riva",
        "feeding": "scava nel fondale sabbioso alla ricerca di mitili, vermi e piccoli crostacei",
        "practical_tips": ["il verme americano è l'esca regina per l'orata", "cercarla sulle zone di transizione sabbia-posidonia", "la pasturazione con formaggio e sarde è micidiale nei porti"],
    },
    "sarago": {
        "name_it": "sarago",
        "habitat": ["scogliere sommerse", "reef naturali", "posidonia densa", "piedi di scogliera"],
        "depth": "3-18 metri",
        "bottom": "roccioso con alghe e posidonia",
        "best_time": "prime ore del mattino e tardo pomeriggio",
        "behavior_winter": "meno attivo, si rifugia nelle tane rocciose",
        "behavior_spring": "torna in attività con la frega primaverile, aggressivo sulle esche",
        "behavior_summer": "attivo in branchi lungo le scogliere, si nutre all'alba",
        "behavior_autumn": "alimentazione intensa, si avvicina a riva seguendo i crostacei",
        "feeding": "onnivoro che si nutre di ricci, crostacei, molluschi e alghe tra le rocce",
        "practical_tips": ["light rock fishing con piccoli jig head è la tecnica più efficace", "cercare le zone dove la scogliera incontra la sabbia", "il gamberetto vivo innescato leggero fa la differenza"],
    },
    "mormora": {
        "name_it": "mormora",
        "habitat": ["spiagge sabbiose", "zone di risacca", "fondali sabbiosi vicino alle scogliere"],
        "depth": "1-5 metri nella zona di frangente",
        "bottom": "sabbia fine nella zona del frangente",
        "best_time": "alba e notte, specialmente in condizioni di mare mosso",
        "behavior_winter": "si avvicina alla battigia in branchi, attiva nelle ore più fredde",
        "behavior_spring": "in piena attività nel surf, si nutre lungo le canalette",
        "behavior_summer": "si sposta in acque leggermente più profonde per il caldo",
        "behavior_autumn": "torna nella risacca con le prime mareggiate, brancheggia in gruppo",
        "feeding": "setaccia la sabbia del frangente alla ricerca di arenicole, vermi e piccoli crostacei",
        "practical_tips": ["pescare subito dopo una mareggiata quando il fondale è smosso", "il verme coreano a filo d'acqua è l'innesco classico", "le canalette tra i banchi di sabbia sono i punti chiave"],
    },
    "calamaro": {
        "name_it": "calamaro",
        "habitat": ["acque aperte vicino alla costa", "zone illuminate dei porti", "bocche dei porti", "fondali sabbiosi-fangosi"],
        "depth": "5-25 metri",
        "bottom": "sabbia e fango, vicino a zone illuminate",
        "best_time": "dal tramonto a notte inoltrata, specialmente con luna nuova",
        "behavior_winter": "al picco della stagione, si avvicina alla costa per la riproduzione",
        "behavior_spring": "ancora presente ma in fase calante, ultimi esemplari di taglia",
        "behavior_summer": "in acque profonde, raro sotto costa",
        "behavior_autumn": "inizia ad avvicinarsi, primi esemplari dalla barca",
        "feeding": "predatore notturno che caccia piccoli pesci e gamberetti attratti dalla luce",
        "practical_tips": ["le totanare luminose funzionano meglio nelle notti senza luna", "i porti illuminati sono i punti migliori", "eging leggero con jig da 2.5-3.0 è molto efficace"],
    },
    "seppia": {
        "name_it": "seppia",
        "habitat": ["fondali sabbiosi poco profondi", "praterie di posidonia", "zone vicino alle foci"],
        "depth": "2-12 metri",
        "bottom": "sabbia e posidonia",
        "best_time": "mattino presto e sera, anche di giorno con acqua torbida",
        "behavior_winter": "in acque più profonde, poco accessibile dalla riva",
        "behavior_spring": "migra verso costa per la riproduzione, facilmente accessibile",
        "behavior_summer": "presente ma in acque leggermente più profonde",
        "behavior_autumn": "ancora presente in zone costiere, ultimi esemplari di taglia",
        "feeding": "caccia gamberi, granchi e piccoli pesci sui fondali sabbiosi e nelle praterie",
        "practical_tips": ["gli artificiali imitazioni di gamberetto sono i più efficaci", "cercare le zone dove la sabbia incontra la posidonia", "la mattina presto con acqua calma è il momento migliore"],
    },
    "cefalo": {
        "name_it": "cefalo",
        "habitat": ["foci dei fiumi", "canali portuali", "lagune", "zone di acqua salmastra"],
        "depth": "0-5 metri, spesso in superficie",
        "bottom": "qualsiasi, preferisce zone con corrente",
        "best_time": "mattino presto, attivo tutto il giorno",
        "behavior_winter": "si rifugia nelle zone più riparate di porti e lagune",
        "behavior_spring": "tornano in piena attività, grandi branchi nelle foci",
        "behavior_summer": "molto attivo in superficie, spesso visibile a vista",
        "behavior_autumn": "ancora attivo, si concentra nelle foci prima dell'inverno",
        "feeding": "si nutre filtrando alghe, detriti organici e piccoli invertebrati dal fondale",
        "practical_tips": ["la bolognese leggera con pane in superficie è classica", "nelle foci dei fiumi i cefali si concentrano all'alba", "la pasturazione è fondamentale per tenerli in zona"],
    },
    "sogliola": {
        "name_it": "sogliola",
        "habitat": ["fondali sabbiosi", "zone di risacca", "acque basse vicino alla battigia"],
        "depth": "1-5 metri, spesso nella risacca",
        "bottom": "sabbia fine, preferibilmente smossa dalle onde",
        "best_time": "notte, specialmente nelle prime ore dopo il tramonto",
        "behavior_winter": "al picco dell'attività, si avvicina molto alla riva",
        "behavior_spring": "ancora presente ma in fase calante",
        "behavior_summer": "in acque più profonde, raramente sotto costa",
        "behavior_autumn": "inizia a riavvicinarsi con il calo delle temperature",
        "feeding": "si mimetizza nella sabbia e attacca piccoli vermi, gamberetti e pesci di passaggio",
        "practical_tips": ["il surfcasting notturno con verme coreano è la tecnica classica", "cercare le zone dove le onde creano buche nella sabbia", "usare terminali sottili e piombi a perdere"],
    },
    "dentice": {
        "name_it": "dentice",
        "habitat": ["secche rocciose profonde", "pareti sommerse", "cadute di roccia"],
        "depth": "10-35 metri",
        "bottom": "roccioso con cadute di quota",
        "best_time": "prime ore del mattino, momento dell'alba",
        "behavior_winter": "in profondità, poco accessibile",
        "behavior_spring": "inizia a salire sulle secche, primi esemplari dalla barca",
        "behavior_summer": "attivo sulle secche al mattino presto, caccia in branchi",
        "behavior_autumn": "fase vorace, risale sui plateau rocciosi per cacciare",
        "feeding": "predatore apicale che caccia cefalopodi, pesci di branco e crostacei sui fondali rocciosi",
        "practical_tips": ["la traina con rapala o il vivo sono le tecniche più produttive", "cercare le secche con cadute di quota intorno ai 15-25 metri", "l'alba è il momento in cui sale a cacciare"],
    },
    "ricciola": {
        "name_it": "ricciola",
        "habitat": ["acque aperte vicino alla costa", "secche e reef", "zone con corrente"],
        "depth": "5-40 metri",
        "bottom": "qualsiasi, preferisce zone con corrente e strutture sommerse",
        "best_time": "mattino presto, momenti di corrente",
        "behavior_winter": "in acque profonde al largo, raramente accessibile",
        "behavior_spring": "inizia ad avvicinarsi seguendo i branchi di sugarelli",
        "behavior_summer": "molto attiva, caccia in superficie, visibile dai birds",
        "behavior_autumn": "al picco dell'attività, esemplari di taglia sotto costa",
        "feeding": "predatore veloce che caccia sugarelli, aguglie e cefalopodi in acque aperte",
        "practical_tips": ["il popper in superficie al mattino presto è emozionante", "seguire i gabbiani in caccia per localizzare le mangianze", "gli artificiali da 15-20cm funzionano per gli esemplari di taglia"],
    },
    "polpo": {
        "name_it": "polpo",
        "habitat": ["fondali rocciosi con tane", "scogliere basse", "massi sommersi", "banchine portuali"],
        "depth": "1-15 metri",
        "bottom": "roccioso con anfratti e cavità naturali",
        "best_time": "mattino e sera, anche di giorno con acqua torbida",
        "behavior_winter": "meno attivo, si rifugia nelle tane più profonde",
        "behavior_spring": "torna in attività, esplora i fondali costieri",
        "behavior_summer": "molto attivo, si avvicina sotto le scogliere",
        "behavior_autumn": "fase vorace, esemplari di taglia vicino alla riva",
        "feeding": "caccia crostacei, mitili e piccoli pesci tra le rocce, usando l'intelligenza per aprire le prede",
        "practical_tips": ["le esche bianche a polpara sono le più efficaci", "cercare le tane tra i massi con la canna corta", "portare sempre un secchio: il polpo tende a scappare verso le rocce"],
    },
    "occhiata": {
        "name_it": "occhiata",
        "habitat": ["scogliere superficiali", "reef costieri", "zone con corrente moderata"],
        "depth": "1-12 metri",
        "bottom": "roccioso con alghe",
        "best_time": "mattino e tardo pomeriggio",
        "behavior_winter": "meno presente sotto costa",
        "behavior_spring": "torna in branchi lungo le scogliere",
        "behavior_summer": "molto presente in superficie, in branchi numerosi",
        "behavior_autumn": "ancora attiva, si avvicina alle scogliere",
        "feeding": "si nutre di alghe, piccoli invertebrati e plancton in branchi lungo le scogliere",
        "practical_tips": ["la bolognese leggera con pane e formaggio è l'approccio classico", "pastugliare con sarda e pane per tenere il branco in zona", "montature sottilissime: 0.14mm massimo di terminale"],
    },
    "salpa": {
        "name_it": "salpa",
        "habitat": ["scogliere con alghe", "zone costiere rocciose", "piedi di scogliera"],
        "depth": "1-8 metri",
        "bottom": "roccioso coperto di alghe",
        "best_time": "mattino presto, spesso visibile a vista",
        "behavior_winter": "presente ma meno attiva",
        "behavior_spring": "in piena attività, pascola sulle alghe",
        "behavior_summer": "molto attiva in superficie tra le alghe",
        "behavior_autumn": "ancora presente, brancheggia lungo le scogliere",
        "feeding": "erbivora, si nutre di alghe che cresce sulle rocce — è una delle poche specie vegetariane del Mediterraneo",
        "practical_tips": ["usare pane raffermo come esca e come pastura", "la bolognese con galleggiante scorrevole è la tecnica ideale", "cercare le zone dove le alghe sono più fitte sulla scogliera"],
    },
    "sugarello": {
        "name_it": "sugarello",
        "habitat": ["acque aperte", "zone costiere con corrente", "vicino alle dighe e ai moli"],
        "depth": "3-20 metri, spesso a mezzacqua",
        "bottom": "qualsiasi, pesce pelagico di branco",
        "best_time": "mattino e sera, momenti di corrente",
        "behavior_winter": "in acque profonde al largo",
        "behavior_spring": "si avvicina alla costa in branchi",
        "behavior_summer": "in piena attività sotto costa, in grandi branchi",
        "behavior_autumn": "ancora presente, fase di alimentazione intensa",
        "feeding": "caccia in branco piccoli pesci e gamberetti a mezzacqua",
        "practical_tips": ["lo spinning leggero con piccoli jig metallici è micidiale", "cercare i branchi vicino alle dighe foranee", "quando si trova il branco, ogni lancio è una cattura"],
    },
    "palamita": {
        "name_it": "palamita",
        "habitat": ["acque aperte", "zone con corrente", "vicino alle secche"],
        "depth": "5-30 metri, in superficie quando caccia",
        "bottom": "pelagico, zone con corrente e strutture sommerse",
        "best_time": "mattino presto, durante le mangianze",
        "behavior_winter": "al largo in acque profonde",
        "behavior_spring": "si avvicina alla costa durante le migrazioni",
        "behavior_summer": "presente sotto costa, caccia in branchi veloci",
        "behavior_autumn": "al picco, branchi enormi sotto costa",
        "feeding": "predatore velocissimo che caccia sardine, acciughe e piccoli pesci in superficie",
        "practical_tips": ["artificiali metallici da 20-40g lanciati nelle mangianze sono devastanti", "seguire i gabbiani per trovare le cacce in superficie", "la traina costiera con rapala è molto produttiva"],
    },
    "tonnetto-alletterato": {
        "name_it": "tonnetto alletterato",
        "habitat": ["acque aperte", "zone con forte corrente", "vicino a secche profonde"],
        "depth": "5-50 metri",
        "bottom": "pelagico puro, segue le correnti e le prede",
        "best_time": "mattino presto durante le mangianze in superficie",
        "behavior_winter": "al largo o migrato verso acque più calde",
        "behavior_spring": "inizia ad avvicinarsi alla costa",
        "behavior_summer": "presente in branchi, caccia in superficie",
        "behavior_autumn": "al picco, branchi enormi vicino alla costa",
        "feeding": "caccia in gruppo ad alta velocità, attacca sardine e acciughe dal basso verso la superficie",
        "practical_tips": ["lo spinning pesante con jig da 40-60g è la tecnica principale", "quando il branco è in caccia ogni artificiale metallico funziona", "attenzione: combattono fortissimo e rovinano l'attrezzatura leggera"],
    },
    "aguglia": {
        "name_it": "aguglia",
        "habitat": ["superficie costiera", "zone aperte vicino alla riva", "bocche dei porti"],
        "depth": "0-3 metri, strettamente in superficie",
        "bottom": "pelagico di superficie, spesso visibile a vista",
        "best_time": "dal mattino al pomeriggio nelle giornate di sole",
        "behavior_winter": "assente sotto costa",
        "behavior_spring": "arriva in grandi branchi, uno dei primi pelagici della stagione",
        "behavior_summer": "presente ovunque vicino alla costa in superficie",
        "behavior_autumn": "ancora presente ma in fase calante",
        "feeding": "caccia piccoli pesci e avannotti in superficie, spesso visibile mentre salta fuori dall'acqua",
        "practical_tips": ["bombarda con striscia di pesce o piccoli artificiali", "è visibile a occhio nudo: cercare le bolle in superficie", "si prende anche con galleggiante e striscia di sarda"],
    },
    "leccia": {
        "name_it": "leccia",
        "habitat": ["zone costiere con corrente", "vicino a strutture sommerse", "scogliere con acqua profonda"],
        "depth": "3-25 metri",
        "bottom": "zone con corrente e strutture rocciose",
        "best_time": "alba e crepuscolo, durante i cambi di marea",
        "behavior_winter": "al largo in acque profonde",
        "behavior_spring": "si avvicina alla costa",
        "behavior_summer": "molto attiva sotto costa, caccia in superficie",
        "behavior_autumn": "ancora presente, fase vorace prima della migrazione",
        "feeding": "predatore veloce che caccia cefali, sugarelli e piccoli pesci lungo le coste",
        "practical_tips": ["walking the dog in superficie con grossi stickbait è spettacolare", "cercare le zone dove la corrente accelera tra le rocce", "gli artificiali da 15-25cm funzionano per i grossi esemplari"],
    },
    "serra": {
        "name_it": "serra",
        "habitat": ["zone costiere", "porti", "foci dei fiumi", "scogliere basse"],
        "depth": "1-10 metri",
        "bottom": "qualsiasi, predatore aggressivo che si avvicina a riva",
        "best_time": "alba e tramonto, molto attivo in condizioni di luce bassa",
        "behavior_winter": "meno presente, migra verso sud",
        "behavior_spring": "inizia a comparire lungo le coste",
        "behavior_summer": "molto attivo, caccia in branchi nelle acque poco profonde",
        "behavior_autumn": "al picco della voracità, attacca tutto ciò che si muove",
        "feeding": "predatore ferocissimo con denti affilati, attacca branchi di cefali e sarde con violenza",
        "practical_tips": ["terminale in acciaio obbligatorio per i suoi denti taglienti", "gli artificiali da topwater al tramonto sono devastanti", "attenzione alle dita quando si slama: morde anche fuori dall'acqua"],
    },
    "barracuda-mediterraneo": {
        "name_it": "barracuda mediterraneo",
        "habitat": ["zone costiere con acqua limpida", "reef e secche", "zone portuali"],
        "depth": "2-15 metri",
        "bottom": "zone con strutture e acqua cristallina",
        "best_time": "mattino con luce radente, predatore visivo",
        "behavior_winter": "si sposta in acque più profonde",
        "behavior_spring": "torna sotto costa con il riscaldamento",
        "behavior_summer": "molto presente e attivo nelle acque limpide e calde",
        "behavior_autumn": "ancora presente, predatore opportunista",
        "feeding": "predatore da agguato che attacca con scatti fulminei prede di passaggio",
        "practical_tips": ["spinning con minnow lunghi e stretti imita le sue prede naturali", "cercare le zone con acqua limpida e fondale visibile", "il terminale in fluorocarbon grosso è essenziale"],
    },
    "ombrina": {
        "name_it": "ombrina",
        "habitat": ["fondali sabbiosi vicino a scogliere", "zone di transizione", "risacca"],
        "depth": "2-10 metri",
        "bottom": "sabbia vicino a scogli sommersi",
        "best_time": "notte e alba, specialmente dopo le mareggiate",
        "behavior_winter": "attiva nella risacca, cerca cibo tra la sabbia smossa",
        "behavior_spring": "presente lungo le coste con fondale misto",
        "behavior_summer": "in acque leggermente più profonde",
        "behavior_autumn": "torna sotto costa, attiva di notte nella risacca",
        "feeding": "cerca vermi, crostacei e piccoli pesci tra i fondali sabbiosi vicino alle rocce",
        "practical_tips": ["il surfcasting pesante dopo le mareggiate è la tecnica regina", "usare verme americano o bibi come esca", "le notti di luna nuova sono le più produttive"],
    },
    "pagello-fragolino": {
        "name_it": "pagello fragolino",
        "habitat": ["fondali sabbiosi-fangosi", "zone con detrito organico", "praterie rade di posidonia"],
        "depth": "10-30 metri",
        "bottom": "sabbia e fango, zona costiera profonda",
        "best_time": "mattino e tardo pomeriggio dalla barca",
        "behavior_winter": "in acque profonde, meno accessibile",
        "behavior_spring": "risale sui fondali costieri",
        "behavior_summer": "attivo su fondali sabbiosi tra 15-25 metri",
        "behavior_autumn": "ancora presente, fase di alimentazione",
        "feeding": "si nutre di vermi, piccoli crostacei e molluschi sui fondali molli",
        "practical_tips": ["paternoster a due ami con gamberetto è la montatura classica", "dalla barca sui fondali tra 15-25 metri", "il fasciame leggero è fondamentale per sentire le tocche delicate"],
    },
    "cernia": {
        "name_it": "cernia",
        "habitat": ["fondali rocciosi profondi", "grotte e anfratti", "cadute di parete"],
        "depth": "10-40 metri",
        "bottom": "roccioso con tane e cavità naturali",
        "best_time": "alba, periodo di caccia attiva",
        "behavior_winter": "si rifugia nelle tane profonde",
        "behavior_spring": "inizia ad esplorare fuori dalla tana",
        "behavior_summer": "più attiva, si avvicina a fondali accessibili",
        "behavior_autumn": "in fase di accumulo pre-invernale",
        "feeding": "predatore da agguato che si lancia dalle tane su pesci e cefalopodi di passaggio",
        "practical_tips": ["rispettare le misure minime e le zone di divieto — è specie protetta in molte aree", "dalla barca con vivo o artificiali affondanti", "una volta agganciata si infila nella tana: agire con decisione"],
    },
    "lampuga": {
        "name_it": "lampuga",
        "habitat": ["acque aperte", "oggetti galleggianti", "zone con corrente"],
        "depth": "0-15 metri, spesso in superficie sotto oggetti galleggianti",
        "bottom": "pelagico, segue oggetti galleggianti e correnti",
        "best_time": "mattino e pomeriggio con sole",
        "behavior_winter": "assente, in acque tropicali",
        "behavior_spring": "raramente presente",
        "behavior_summer": "inizia a comparire a fine estate",
        "behavior_autumn": "al picco, branchi sotto oggetti galleggianti",
        "feeding": "predatore veloce di superficie che caccia sotto FAD naturali e artificiali",
        "practical_tips": ["cercare tronchi, cassette o oggetti galleggianti al largo", "spinning con artificiali colorati sotto i galleggianti", "la traina con rapala piccoli è molto efficace quando sono presenti"],
    },
    "rombo": {
        "name_it": "rombo",
        "habitat": ["fondali sabbiosi", "zone poco profonde", "vicino alle foci"],
        "depth": "3-15 metri",
        "bottom": "sabbia fine, si mimetizza perfettamente",
        "best_time": "mattino presto e notte",
        "behavior_winter": "al picco dell'attività sotto costa",
        "behavior_spring": "ancora presente, fase riproduttiva",
        "behavior_summer": "in acque più profonde",
        "behavior_autumn": "inizia a riavvicinarsi alla costa",
        "feeding": "predatore da agguato mimetizzato nella sabbia che attacca pesci piatti e gamberetti di passaggio",
        "practical_tips": ["il vivo è l'esca migliore: piccoli cefali o latterini", "pescare sul fondo sabbioso vicino a zone di transizione", "montature con terminale lungo per naturale presentazione dell'esca"],
    },
    "passera": {
        "name_it": "passera",
        "habitat": ["fondali sabbiosi-fangosi", "foci dei fiumi", "zone lagunari"],
        "depth": "2-10 metri",
        "bottom": "sabbia e fango, predilige le zone estuarine",
        "best_time": "notte e prime ore del mattino",
        "behavior_winter": "attiva nelle zone costiere poco profonde",
        "behavior_spring": "fase riproduttiva, si avvicina alle foci",
        "behavior_summer": "meno attiva, in zone più profonde",
        "behavior_autumn": "torna nelle zone costiere",
        "feeding": "si nutre di vermi e piccoli invertebrati scavando nel fondale molle",
        "practical_tips": ["surfcasting leggero con verme coreano è l'approccio classico", "cercare le zone fangose vicino alle foci", "usare piombi leggeri per non affondare troppo nel fango"],
    },
    "totano": {
        "name_it": "totano",
        "habitat": ["acque aperte profonde", "zone con corrente notturna", "canyon sottomarini"],
        "depth": "20-80 metri",
        "bottom": "pelagico profondo, si avvicina alla superficie di notte",
        "best_time": "notte fonda, specialmente con luna nuova",
        "behavior_winter": "presente in profondità, accessibile dalla barca",
        "behavior_spring": "meno presente sotto costa",
        "behavior_summer": "in acque profonde al largo",
        "behavior_autumn": "al picco, si avvicina dalla barca con le luci",
        "feeding": "predatore notturno di profondità che risale verso la superficie per cacciare",
        "practical_tips": ["la pesca con le luci dalla barca è la tecnica tradizionale", "totanare rosse e bianche alterne", "le notti senza luna con mare calmo sono ideali"],
    },
    "anguilla": {
        "name_it": "anguilla",
        "habitat": ["foci dei fiumi", "lagune", "canali", "zone salmastre"],
        "depth": "1-5 metri",
        "bottom": "fangoso, zone di transizione acqua dolce-salata",
        "best_time": "notte, specialmente durante le piogge autunnali",
        "behavior_winter": "rifugiata nel fango, meno attiva",
        "behavior_spring": "inizia a muoversi con il riscaldamento",
        "behavior_summer": "attiva nelle lagune e nei canali",
        "behavior_autumn": "al picco: migra verso il mare per la riproduzione",
        "feeding": "predatore notturno opportunista che si nutre di vermi, piccoli pesci e crostacei nel fango",
        "practical_tips": ["pesca a fondo con verme nelle notti piovose d'autunno", "le foci dei fiumi durante le piene sono il punto migliore", "usare lenza robusta: si attorciglia a qualsiasi ostacolo"],
    },
}

def get_season(mese):
    seasons = {
        "gennaio": "winter", "febbraio": "winter", "marzo": "spring",
        "aprile": "spring", "maggio": "spring", "giugno": "summer",
        "luglio": "summer", "agosto": "summer", "settembre": "autumn",
        "ottobre": "autumn", "novembre": "autumn", "dicembre": "winter",
    }
    return seasons[mese]

def get_season_it(mese):
    seasons = {
        "gennaio": "inverno", "febbraio": "inverno", "marzo": "primavera",
        "aprile": "primavera", "maggio": "primavera", "giugno": "estate",
        "luglio": "estate", "agosto": "estate", "settembre": "autunno",
        "ottobre": "autunno", "novembre": "autunno", "dicembre": "inverno",
    }
    return seasons[mese]

def fix_articles(text):
    """Fix Italian articles before specific consonant clusters."""
    import re
    replacements = [
        (r'\bil Scirocco\b', 'lo Scirocco'),
        (r'\bdel Scirocco\b', 'dello Scirocco'),
        (r'\bal Scirocco\b', 'allo Scirocco'),
        (r'\bil Stretto\b', 'lo Stretto'),
        (r'\bdel Stretto\b', 'dello Stretto'),
    ]
    for pattern, repl in replacements:
        text = re.sub(pattern, repl, text)
    return text

def get_behavior(species_slug, mese):
    sp = SPECIES.get(species_slug, None)
    if not sp:
        return ""
    season = get_season(mese)
    key = f"behavior_{season}"
    return sp.get(key, "")

def pick(lst, seed_str, n=1):
    rng = random.Random(seed_str)
    if n == 1:
        return rng.choice(lst) if lst else ""
    return rng.sample(lst, min(n, len(lst)))

def expand_regional_note(entry):
    reg = REGIONS.get(entry["regione"], {})
    mo = MONTHS.get(entry["mese"], {})
    season = get_season(entry["mese"])
    region_name = entry["regionName"]
    mese_name = entry["meseName"]
    seed = f"{entry['regione']}_{entry['mese']}"

    species_names = [s["name"] for s in entry["species"][:4]]
    species_list = ", ".join(species_names[:-1]) + f" e {species_names[-1]}" if len(species_names) > 1 else species_names[0] if species_names else ""

    coast = pick(reg.get("coasts", [f"le coste della {region_name}"]), seed)
    landmark = pick(reg.get("landmarks", [region_name]), seed)
    wind = reg.get("wind_dominant", "il vento")

    bio = mo.get("bio_event", "varie specie sono attive")
    best_p = mo.get("best_period", "le ore migliori sono alba e tramonto")
    mood = mo.get("fishing_mood", "un buon mese per pescare")

    top_sp = entry["species"][0] if entry["species"] else None
    top_behavior = get_behavior(top_sp["slug"], entry["mese"]) if top_sp else ""

    templates = [
        f"{mese_name} in {region_name} è un mese in cui {bio}. Le acque lungo {coast} raggiungono temperature di {entry['waterTemp']}, influenzando profondamente il comportamento delle specie presenti. Le specie più attive — {species_list} — si distribuiscono tra le zone costiere vicino a {landmark} e le strutture sommerse della regione. {best_p.capitalize()}, quando {top_behavior if top_behavior else 'i pesci sono più propensi ad alimentarsi'}. È {mood}: con le condizioni giuste e {reg.get('water_note', 'acque tipiche della zona')}, ogni sessione può riservare sorprese.",
        f"In {region_name} a {mese_name.lower()}, {bio}. La temperatura dell'acqua si attesta sui {entry['waterTemp']}, e lungo {coast} si concentrano {species_list}. La zona di {landmark} offre condizioni particolarmente favorevoli in questo periodo. {top_behavior.capitalize() if top_behavior else 'Le specie principali si concentrano nei punti riparati'}. {best_p.capitalize()}, ma è {mood}. Chi conosce {reg.get('uniqueness', 'le caratteristiche della costa')} sa che questo mese può regalare giornate indimenticabili grazie a {reg.get('deep_features', 'la varietà dei fondali')}.",
        f"A {mese_name.lower()} le acque della {region_name} registrano {entry['waterTemp']}: un dato fondamentale perché {bio}. Lungo {coast} e nei pressi di {landmark}, {species_list} sono le specie da insidiare. Il {wind} è il vento dominante e influenza le condizioni di pesca significativamente. {top_behavior.capitalize() if top_behavior else 'Le principali specie stanziali cercano riparo nelle strutture sommerse'}. {best_p.capitalize()}, e chi frequenta {reg.get('geography', 'queste coste')} lo sa bene: è {mood}.",
    ]
    rng = random.Random(seed)
    return fix_articles(rng.choice(templates))


def expand_conditions(entry):
    reg = REGIONS.get(entry["regione"], {})
    mo = MONTHS.get(entry["mese"], {})
    seed = f"cond_{entry['regione']}_{entry['mese']}"

    wind = reg.get("wind_dominant", "vento variabile")
    winds = reg.get("winds_all", ["vento variabile"])
    sec_wind = pick([w for w in winds if w != wind] or winds, seed)
    sea = mo.get("sea_state", "variabile")
    temp = mo.get("temp_air", "variabile")
    daylight = mo.get("daylight", "medie")
    general = mo.get("general_weather", "condizioni variabili")

    templates = [
        f"Il {wind} è il vento predominante con raffiche che possono influenzare la pesca, alternato al {sec_wind}. Il mare è {sea}. La temperatura percepita si aggira sui {temp} con giornate {daylight}. Condizioni generali: {general}. È consigliabile vestirsi a strati e portare protezione dal vento per sessioni prolungate.",
        f"Clima caratterizzato da {general}, con temperature tra {temp} e giornate {daylight}. Il vento dominante è il {wind}, ma non è raro il {sec_wind}. Il mare risulta {sea}: un fattore determinante per la scelta dello spot e della tecnica. Portare abbigliamento adeguato e controllare le previsioni prima di ogni uscita.",
        f"Temperature nell'ordine dei {temp} con {general}. Il {wind} e il {sec_wind} si alternano rendendo il mare {sea}. Le giornate {daylight} richiedono una buona pianificazione degli orari di pesca. È fondamentale monitorare il meteo marino nelle 24 ore precedenti per sfruttare le finestre migliori.",
    ]
    rng = random.Random(seed)
    return fix_articles(rng.choice(templates))


def expand_local_tip(species_entry, regione, mese):
    slug = species_entry["slug"]
    sp = SPECIES.get(slug, None)
    seed = f"tip_{regione}_{mese}_{slug}"
    reg = REGIONS.get(regione, {})
    mo = MONTHS.get(mese, {})
    region_name = reg.get("coasts", ["la costa"])[0] if reg.get("coasts") else "la costa"
    landmark = pick(reg.get("landmarks", ["la zona"]), seed)
    season = get_season(mese)
    rng = random.Random(seed)

    if not sp:
        existing = species_entry.get("localTip", "")
        return f"{existing}. In questo periodo si trova lungo la costa, su fondali misti, attiva soprattutto nelle prime ore del mattino. Provare esche naturali o piccoli artificiali per le migliori possibilità di cattura."

    behavior = get_behavior(slug, mese)
    depth = sp["depth"]
    bottom = sp["bottom"]
    best_time = sp["best_time"]
    tip = rng.choice(sp["practical_tips"])
    habitat = rng.choice(sp["habitat"])

    season_it = get_season_it(mese)
    templates = [
        f"In questo periodo {sp['name_it']} {behavior}. Si trova prevalentemente su {habitat} nei pressi di {landmark}, a una profondità di {depth} su fondale {bottom}. Più attiva {best_time}. Consiglio pratico: {tip}.",
        f"A {mese} {sp['name_it']} {behavior}. La si insidia su {habitat} a {depth}, preferendo fondale {bottom}. Nella zona di {landmark} le possibilità sono ottime. Orari migliori: {best_time}. {tip.capitalize()}.",
        f"{sp['name_it'].capitalize()} frequenta {habitat} a profondità di {depth} su fondale {bottom}. In {season_it}, {behavior}. Vicino a {landmark}, {best_time} sono i momenti più produttivi. {tip.capitalize()}.",
    ]
    return fix_articles(rng.choice(templates))


def generate_expert_advice(entry):
    reg = REGIONS.get(entry["regione"], {})
    mo = MONTHS.get(entry["mese"], {})
    seed = f"expert_{entry['regione']}_{entry['mese']}"
    rng = random.Random(seed)

    region_name = entry["regionName"]
    mese_name = entry["meseName"]
    wind = reg.get("wind_dominant", "il vento")
    landmark1 = pick(reg.get("landmarks", [region_name]), seed + "a")
    landmark2 = pick(reg.get("landmarks", [region_name]), seed + "b")
    coast = pick(reg.get("coasts", [f"la costa della {region_name}"]), seed + "c")

    top_sp = entry["species"][0] if entry["species"] else None
    top_sp_data = SPECIES.get(top_sp["slug"], {}) if top_sp else {}
    top_tip = rng.choice(top_sp_data.get("practical_tips", ["prestare attenzione alle condizioni"])) if top_sp_data else ""

    best_period = mo.get("best_period", "le ore dell'alba e del tramonto")
    bio = mo.get("bio_event", "diverse specie sono attive")

    sec_sp = entry["species"][1] if len(entry["species"]) > 1 else None
    sec_sp_data = SPECIES.get(sec_sp["slug"], {}) if sec_sp else {}
    sec_behavior = get_behavior(sec_sp["slug"], entry["mese"]) if sec_sp else ""

    templates = [
        f"A {mese_name.lower()} in {region_name} il {wind} è il fattore chiave: quando scende nel pomeriggio, le zone riparate vicino a {landmark1} diventano produttive. {best_period.capitalize()}. Per {top_sp['name'] if top_sp else 'le specie principali'}, {top_tip}. Non trascurare {coast}: le strutture sommerse attirano i predatori specialmente nelle ore di luce radente. Chi arriva preparato con esche fresche e un piano B per il vento troverà soddisfazioni.",
        f"Il segreto a {mese_name.lower()} in {region_name} è leggere il mare: {best_period}. La zona di {landmark1} e {landmark2} sono i punti caldi del mese perché {bio}. {top_tip.capitalize()}. {sec_behavior.capitalize() if sec_behavior else 'Anche le specie secondarie meritano attenzione'}. Portare sempre un assortimento di esche naturali e artificiali: le condizioni cambiano in fretta e l'adattabilità fa la differenza tra una giornata vuota e una memorabile.",
        f"L'esperienza insegna che a {mese_name.lower()} in {region_name} bisogna concentrarsi sulle zone dove {bio}. Vicino a {landmark1} {best_period}, mentre lungo {coast} le condizioni favoriscono {top_sp['name'] if top_sp else 'le specie di fondo'}. {top_tip.capitalize()}. Un errore comune è sottovalutare il {wind}: può rovinare una sessione ma anche concentrare il pesce nelle zone sottovento. La chiave è pianificare in anticipo e avere sempre un punto di riserva.",
    ]
    return fix_articles(rng.choice(templates))


def generate_weather_context(entry):
    reg = REGIONS.get(entry["regione"], {})
    mo = MONTHS.get(entry["mese"], {})
    seed = f"weather_{entry['regione']}_{entry['mese']}"
    rng = random.Random(seed)

    region_name = entry["regionName"]
    mese_name = entry["meseName"]
    wind = reg.get("wind_dominant", "il vento principale")
    winds = reg.get("winds_all", ["il vento"])
    sec_wind = pick([w for w in winds if w != wind] or winds, seed)
    general = mo.get("general_weather", "condizioni variabili")
    sea = mo.get("sea_state", "variabile")
    temp = mo.get("temp_air", "variabile")

    templates = [
        f"A {mese_name.lower()} in {region_name} il clima è caratterizzato da {general}. Il {wind} e il {sec_wind} si alternano influenzando lo stato del mare che risulta {sea}. Temperature tra {temp}. Queste condizioni favoriscono la pesca nelle zone riparate e nelle pause tra le perturbazioni, quando il pesce si attiva per alimentarsi.",
        f"Il quadro meteo di {mese_name.lower()} in {region_name} prevede {general} con vento dominante da {wind}, intervallato dal {sec_wind}. Mare {sea}, temperature nell'ordine dei {temp}. Per il pescatore significa scegliere con cura lo spot in base alla direzione del vento e sfruttare le finestre di calma per le sessioni più produttive.",
        f"In {region_name} a {mese_name.lower()} le condizioni meteo-marine vedono {general}. Il {wind} è il protagonista con il {sec_wind} come alternativa. Il mare è {sea} e le temperature si attestano sui {temp}. Questo scenario influenza la distribuzione del pesce sotto costa e impone una pianificazione attenta delle uscite.",
    ]
    return fix_articles(rng.choice(templates))


def main():
    script_dir = os.path.dirname(os.path.abspath(__file__))
    json_path = os.path.join(script_dir, "..", "data", "fishing-calendar-regional.json")

    with open(json_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    updated = 0
    species_updated = 0

    for entry in data["entries"]:
        entry["regionalNote"] = expand_regional_note(entry)
        entry["conditions"] = expand_conditions(entry)
        entry["expertAdvice"] = generate_expert_advice(entry)
        entry["weatherContext"] = generate_weather_context(entry)

        for sp in entry["species"]:
            sp["localTip"] = expand_local_tip(sp, entry["regione"], entry["mese"])
            species_updated += 1

        updated += 1

    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"Updated {updated} calendar entries")
    print(f"Updated {species_updated} species localTips")
    print(f"Added expertAdvice and weatherContext to all {updated} entries")


if __name__ == "__main__":
    main()
