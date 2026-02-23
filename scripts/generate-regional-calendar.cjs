const fs = require('fs');
const path = require('path');

const spots = require('../data/fishing-spots.json');
const calendar = require('../data/fishing-calendar.json');
const fishEnc = require('../data/fish-encyclopedia.json');

const MONTHS = ['gennaio','febbraio','marzo','aprile','maggio','giugno','luglio','agosto','settembre','ottobre','novembre','dicembre'];
const MONTH_NAMES = ['Gennaio','Febbraio','Marzo','Aprile','Maggio','Giugno','Luglio','Agosto','Settembre','Ottobre','Novembre','Dicembre'];

const fishSlugMap = {};
fishEnc.fish.forEach(f => { fishSlugMap[f.name.toLowerCase()] = f.slug; });
fishSlugMap['barracuda'] = 'barracuda-mediterraneo';
fishSlugMap['pagello'] = 'pagello-fragolino';
fishSlugMap['tonno'] = 'tonnetto-alletterato';

const TECHNIQUE_SLUG_MAP = {
  'spinning': 'spinning', 'surfcasting': 'surfcasting', 'eging': 'eging',
  'bolognese': 'bolognese', 'light rock fishing': 'light-rock-fishing',
  'rockfishing': 'light-rock-fishing', 'feeder': 'feeder', 'jigging': 'jigging',
  'traina': 'traina', 'bolentino': 'bolentino', 'beach ledgering': 'beach-ledgering',
  'shore jigging': 'jigging', 'light jigging': 'jigging', 'vertical jigging': 'jigging',
  'traina leggera': 'traina', 'traina lenta': 'traina', 'traina col vivo': 'traina',
  'bolentino leggero': 'bolentino', 'bolentino profondo': 'bolentino',
  'popping': 'spinning', 'rock fishing': 'light-rock-fishing',
};

const WATER_TEMP_OFFSETS = {
  'sardegna': [0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0],
  'sicilia': [1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1],
  'liguria': [-1, -1, 0, 0, 0, 0, 0, 0, 0, 0, -1, -1],
  'puglia': [0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 0, 0],
  'toscana': [-1, -1, 0, 0, 0, 0, 1, 1, 0, 0, -1, -1],
  'campania': [0, 0, 0, 1, 1, 1, 2, 2, 1, 1, 0, 0],
  'lazio': [-1, -1, 0, 0, 0, 1, 1, 1, 1, 0, -1, -1],
  'calabria': [1, 1, 1, 1, 1, 2, 2, 2, 2, 1, 1, 1],
  'veneto': [-2, -2, -1, -1, 0, 0, 0, 0, 0, -1, -2, -2],
  'emilia-romagna': [-2, -2, -1, -1, 0, 0, 0, 0, 0, -1, -2, -2],
};

function adjustWaterTemp(baseTemp, regionId, monthIdx) {
  const match = baseTemp.match(/(\d+)-(\d+)/);
  if (!match) return baseTemp;
  const offset = (WATER_TEMP_OFFSETS[regionId] || [])[monthIdx] || 0;
  return `${parseInt(match[1]) + offset}-${parseInt(match[2]) + offset}°C`;
}

const REGIONAL_GEO = {
  'sardegna': {
    features: ['fondali cristallini', 'scogliere granitiche', 'posidonia oceanica'],
    landmarks: ['Capo Testa', 'Arcipelago della Maddalena', 'Capo Caccia', 'Costa Verde', 'Villasimius', 'Isola di San Pietro'],
    waters: 'tra i più puliti del Mediterraneo',
    character: 'selvaggia e incontaminata',
  },
  'sicilia': {
    features: ['tre mari (Tirreno, Mediterraneo, Ionio)', 'fondali vulcanici', 'correnti ricchissime'],
    landmarks: ['Stretto di Messina', 'Isole Egadi', 'San Vito Lo Capo', 'Capo Passero', 'Isole Eolie', 'Lampedusa'],
    waters: 'crocevia di correnti mediterranee',
    character: 'varietà ittica eccezionale',
  },
  'liguria': {
    features: ['fondali rocciosi profondi', 'scogliere a picco', 'promontori'],
    landmarks: ['Portofino', 'Cinque Terre', 'Capo Mele', 'Promontorio di Bergeggi', 'Portovenere', 'Imperia'],
    waters: 'profondità a pochi metri da riva',
    character: 'pesca tecnica su roccia',
  },
  'puglia': {
    features: ['800 km di costa', 'Gargano roccioso', 'fondali ionici bassi'],
    landmarks: ['Gargano', 'Santa Maria di Leuca', 'Polignano a Mare', 'Otranto', 'Isole Tremiti', 'Torre dell\'Orso'],
    waters: 'due mari con caratteristiche diverse',
    character: 'varietà di ambienti costieri',
  },
  'toscana': {
    features: ['spiagge sabbiose e promontori rocciosi', 'arcipelago toscano', 'fondali misti'],
    landmarks: ['Monte Argentario', 'Isola d\'Elba', 'Isola del Giglio', 'Capraia', 'Follonica', 'Castiglione della Pescaia'],
    waters: 'acque temperate del Tirreno',
    character: 'mix perfetto riva e profondità',
  },
  'campania': {
    features: ['fondali ricchi e correnti nutrienti', 'isole del Golfo', 'costiera'],
    landmarks: ['Penisola Sorrentina', 'Ischia', 'Capri', 'Procida', 'Palinuro', 'Cilento'],
    waters: 'Golfo di Napoli e Tirreno meridionale',
    character: 'biomassa eccezionale',
  },
  'lazio': {
    features: ['foci fluviali', 'isole pontine', 'fondali sabbiosi'],
    landmarks: ['Ponza', 'Ventotene', 'Circeo', 'Fiumicino', 'Gaeta', 'Sperlonga'],
    waters: 'Tirreno centrale',
    character: 'pesca variegata riva e largo',
  },
  'calabria': {
    features: ['due mari (Tirreno e Ionio)', 'fondali ricchissimi', 'costa alta e drammatica'],
    landmarks: ['Tropea', 'Scilla', 'Capo Vaticano', 'Isola di Capo Rizzuto', 'Diamante', 'Soverato'],
    waters: 'tra i fondali più ricchi del Mediterraneo',
    character: 'scenari spettacolari e pesci di taglia',
  },
  'veneto': {
    features: ['Laguna di Venezia', 'fondali bassi adriatici', 'valli da pesca'],
    landmarks: ['Laguna di Venezia', 'Chioggia', 'Caorle', 'Pellestrina', 'Rosolina', 'Lido di Venezia'],
    waters: 'alto Adriatico con fondali bassi',
    character: 'ecosistema lagunare unico',
  },
  'emilia-romagna': {
    features: ['fondali sabbiosi', 'valli di Comacchio', 'riviera romagnola'],
    landmarks: ['Comacchio', 'Cervia', 'Cattolica', 'Cesenatico', 'Porto Garibaldi', 'Marina di Ravenna'],
    waters: 'Adriatico occidentale',
    character: 'pesca accessibile e produttiva',
  },
};

const SEASON_CONDITIONS = {
  'sardegna': {
    1: 'Maestrale frequente, mare spesso mosso. Giornate corte ma produttive nelle pause.', 2: 'Venti ancora forti, prime schiarite. Le giornate iniziano ad allungarsi.', 3: 'Primavera in arrivo, temperature in salita. Ottime condizioni dopo le ultime mareggiate.', 4: 'Mare calmo, temperature gradevoli. Inizia la stagione delle grandi catture.', 5: 'Condizioni ideali, mare calmo e trasparente. Giornate lunghe e pesci attivi.', 6: 'Estate piena, mare piatto, acqua limpidissima. Pescare alba e tramonto.', 7: 'Caldo intenso, mare molto calmo. I pesci si rifugiano in profondità nelle ore centrali.', 8: 'Temperature massime, visibilità eccezionale. Pelagici in piena attività.', 9: 'Il mese migliore: temperature ancora alte, primi venti, pesci in frenesia alimentare.', 10: 'Autunno mite, le prime mareggiate portano pesci sotto costa. Condizioni eccellenti.', 11: 'Temperature in calo, mare mosso frequente. Ottime sessioni nelle pause di bel tempo.', 12: 'Inverno mite rispetto al continente. Maestrale dominante, ma le giornate di calma regalano catture.'
  },
  'sicilia': {
    1: 'Inverno mite, mare spesso agitato. Le zone sottovento sono produttive.', 2: 'Scirocco frequente, mare mosso ma acque temperate. Buone finestre di pesca.', 3: 'Primavera precoce, temperature in risalita rapida. Correnti ricche di nutrimento.', 4: 'Condizioni eccellenti, mare calmo e acque tiepide. Inizio della stagione pelagica.', 5: 'Mare stabile, temperature in salita. I grandi predatori iniziano ad avvicinarsi alla costa.', 6: 'Estate, mare calmo e caldo. Ricciole e dentici in piena attività sulle secche.', 7: 'Caldo intenso, acque molto calde. Pesca d\'alba e notturna le più produttive.', 8: 'Mese d\'oro per i pelagici. Mare piatto, visibilità perfetta, lampughe in arrivo.', 9: 'Ancora caldo, primi venti autunnali. I pesci iniziano la frenesia pre-invernale.', 10: 'Autunno eccezionale: temperature ancora alte, prime mareggiate, pesci affamati.', 11: 'Mare spesso mosso ma produttivo. Le spigole iniziano ad avvicinarsi alla costa.', 12: 'Inverno mite, buone giornate tra una perturbazione e l\'altra. Calamari in piena stagione.'
  },
  'liguria': {
    1: 'Tramontana e libeccio frequenti, mare spesso mosso. Porti e moli riparati sono la scelta migliore.', 2: 'Clima rigido ma buone finestre. Le scogliere profonde offrono riparo ai pesci.', 3: 'Primavera in arrivo, i pesci si riattivano. Prime sessioni produttive di spinning.', 4: 'Condizioni buone, mare calmo frequente. I saraghi iniziano a salire dalle profondità.', 5: 'Mese eccellente: temperature ideali, mare calmo, pesci attivi tutto il giorno.', 6: 'Inizio estate, condizioni stabili. Spinning e bolognese al top.', 7: 'Caldo, mare calmo. Pescare le ore fresche, alba e tramonto sono imperdibili.', 8: 'Temperature massime, mare piatto. Eging notturno eccezionale.', 9: 'Il mese TOP: temperature perfette, primi venti, pesci in attività frenetica.', 10: 'Autunno ligure splendido: mareggiate produttive alternate a giornate calme.', 11: 'Temperature in calo, libeccio frequente. Le scogliere riparate restano produttive.', 12: 'Inverno: condizioni difficili ma la spigola a spinning ripaga ogni uscita al freddo.'
  },
  'puglia': {
    1: 'Inverno fresco, grecale dominante. La costa ionica è spesso più riparata del Gargano.', 2: 'Clima fresco, mari mossi. Le orate iniziano a farsi sentire nel basso Adriatico.', 3: 'Primavera precoce in Puglia, temperature gradevoli. Le mormore invadono le spiagge.', 4: 'Condizioni eccellenti, mare calmo. Le spiagge ioniche sono un paradiso per il surfcasting.', 5: 'Temperature ideali, acque tiepide. I predatori si avvicinano alla costa.', 6: 'Estate: mare calmo, acque limpide. Spinning sulle scogliere del Gargano eccezionale.', 7: 'Caldo intenso, pescare alba e tramonto. Le notti regalano calamari e totani.', 8: 'Temperature massime, mare calmo. Pelagici attivi al largo, eging notturno sulla costa.', 9: 'Ancora caldo, le orate tornano sotto costa. Le prime piogge portano spigole alle foci.', 10: 'Autunno pugliese: mare ancora caldo, surfcasting eccezionale per orate e mormore.', 11: 'Temperature in calo, le orate sono al picco. Le mareggiate portano pesce sotto costa.', 12: 'Inverno mite al sud: spigole e calamari sono i protagonisti. Le giornate corte ma produttive.'
  },
  'toscana': {
    1: 'Inverno toscano: libeccio frequente, mare mosso. Le foci fluviali sono produttive per le spigole.', 2: 'Ancora freddo, ma le giornate si allungano. Le orate iniziano a muoversi.', 3: 'Primavera in arrivo: temperature in risalita, ottime condizioni per surfcasting e bolognese.', 4: 'Condizioni ideali: mare calmo, acque in riscaldamento. Le isole dell\'arcipelago diventano accessibili.', 5: 'Mese eccellente: temperatura perfetta, mare stabile. Inizio stagione Elba e Argentario.', 6: 'Estate: mare calmo e caldo. Le spiagge si affollano ma l\'alba resta per i pescatori.', 7: 'Caldo intenso, acque trasparenti. Pesca notturna e alle prime luci del mattino.', 8: 'Temperature massime, mare piatto. Buon mese per traina e bolentino dall\'Elba.', 9: 'Settembre toscano è perfetto: temperature ideali, primi venti, pesci in attività.', 10: 'Autunno: le mareggiate portano nutrimento, le orate invadono le spiagge. Surfcasting al top.', 11: 'Mare mosso frequente, temperature in calo. Le spigole entrano in scena alle foci.', 12: 'Inverno: condizioni variabili. Le pause dal maltempo regalano sessioni memorabili di spinning.'
  },
  'campania': {
    1: 'Inverno mite grazie al Golfo. Mare mosso ma le zone riparate sono produttive.', 2: 'Temperature in risalita precoce, prime giornate stabili. Le isole proteggono dalla corrente.', 3: 'Primavera campana: il Golfo di Napoli si risveglia. Ottimo per bolognese e spinning.', 4: 'Condizioni eccellenti: mare calmo, acque temperate. Le secche del Golfo diventano attive.', 5: 'Mese splendido: temperature ideali, mare stabile. I pelagici si avvicinano alle isole.', 6: 'Estate piena: correnti nutrienti, pelagici in caccia. Le secche di Ischia sono un paradiso.', 7: 'Caldo intenso, acque molto calde. Alba e tramonto sono i momenti d\'oro.', 8: 'Temperature massime: ricciole e dentici sulle secche. Traina costiera eccezionale.', 9: 'Ancora caldo, primi venti. I pesci iniziano a mangiare con frenesia pre-autunnale.', 10: 'Autunno campano: temperature perfette, prima mareggiate produttive. Mese eccellente.', 11: 'Mare spesso mosso ma le pause sono redditizie. Spigole in avvicinamento alla costa.', 12: 'Inverno mite nel Golfo: calamari nei porti, spigole alle foci. Buone giornate tra le perturbazioni.'
  },
  'lazio': {
    1: 'Inverno romano: tramontana frequente, mare mosso. Le foci del Tevere sono produttive.', 2: 'Ancora freddo, mare agitato. Le giornate di calma regalano buone uscite da Fiumicino.', 3: 'Primavera in arrivo: le temperature salgono, le orate iniziano a farsi sentire a Ponza.', 4: 'Condizioni buone: mare calmo, acque in riscaldamento. Le pontine diventano accessibili.', 5: 'Mese ottimo: temperature ideali per tutte le tecniche. Le isole pontine al meglio.', 6: 'Estate: mare calmo, acque calde. Ponza e Ventotene offrono pesca d\'eccezione.', 7: 'Caldo intenso, mare piatto. Pesca notturna lungo la costa e giornate a Ponza.', 8: 'Temperature massime: pelagici attivi intorno alle pontine. Traina e jigging eccellenti.', 9: 'Ancora caldo, primi venti settentrionali. I pesci di rientrano sotto costa.', 10: 'Autunno: le mareggiate portano le orate sulle spiagge laziali. Surfcasting al top.', 11: 'Mare mosso, temperature in calo. Le foci tornano produttive per le spigole.', 12: 'Inverno: le foce del Tevere e i canali portuali sono i rifugi dei pescatori laziali.'
  },
  'calabria': {
    1: 'Inverno mite, mare spesso mosso. Le zone dello Stretto sono riparate e produttive.', 2: 'Temperature in risalita, prime schiarite. Lo Stretto di Messina resta attivo.', 3: 'Primavera precoce: la costa tirrenica si risveglia. Ottime condizioni a Tropea.', 4: 'Condizioni eccellenti: mare calmo, acque temperate. I pelagici iniziano a farsi sentire.', 5: 'Mese splendido: temperature ideali, mare stabile. Le secche dello Stretto brulicano di vita.', 6: 'Estate: correnti forti nello Stretto, ricciole e dentici in piena attività.', 7: 'Caldo intenso, acque molto calde. Lo Stretto è un paradiso per il jigging.', 8: 'Temperature massime: mese d\'oro per i pelagici. Tropea e Scilla al loro meglio.', 9: 'Ancora caldo, primi venti. I pesci iniziano la frenesia alimentare pre-autunnale.', 10: 'Autunno calabrese: temperature perfette, mare misto. Eccellente per spinning e surfcasting.', 11: 'Temperature in calo, mare mosso. Le giornate calme regalano sessioni memorabili.', 12: 'Inverno mite: lo Stretto resta produttivo, i porti offrono eging eccezionale.'
  },
  'veneto': {
    1: 'Inverno adriatico rigido: bora e grecale, mare spesso mosso. La laguna offre riparo.', 2: 'Ancora freddo, ma le giornate si allungano. Le valli da pesca iniziano a produrre.', 3: 'Primavera tardiva: le temperature salgono lentamente. Le orate entrano in laguna.', 4: 'Condizioni in miglioramento: mare più calmo, acque in riscaldamento. Bolognese dai moli.', 5: 'Mese buono: temperature gradevoli, le orate invadono i bassi fondali.', 6: 'Estate: mare calmo, acque calde. La laguna è al suo meglio.', 7: 'Caldo, acque lagunari molto calde. Pescare alba e tramonto nei canali.', 8: 'Temperature massime: buon mese per la laguna e le spiagge. Orate e spigole attive.', 9: 'Settembre è il mese migliore: temperature perfette, pesci in piena attività.', 10: 'Autunno adriatico: primi venti, le orate sono al massimo nelle valli.', 11: 'Temperature in calo rapido, mare mosso. Le spigole entrano in laguna.', 12: 'Inverno: condizioni difficili, ma la laguna resta produttiva per spigole e anguille.'
  },
  'emilia-romagna': {
    1: 'Inverno romagnolo: freddo e mare mosso. Le valli di Comacchio sono il rifugio dei pescatori.', 2: 'Ancora rigido, ma le giornate si allungano. Le mormore iniziano a muoversi.', 3: 'Primavera in arrivo: le orate tornano sui fondali sabbiosi. Surfcasting produttivo.', 4: 'Condizioni buone: mare più calmo, temperature in salita. Le spiagge si animano.', 5: 'Mese eccellente: fondali bassi riscaldati, le orate sono ovunque.', 6: 'Estate: mare calmo, acque tiepide. Spiagge affollate ma l\'alba resta per i pescatori.', 7: 'Caldo intenso, mare piatto. Pescare nelle prime ore del mattino o la sera tardi.', 8: 'Temperature massime: rombi e sogliole attivi sui fondali sabbiosi. Beach ledgering al top.', 9: 'Settembre romagnolo: temperature ancora alte, primi venti, pesci in frenesia.', 10: 'Autunno: le mareggiate portano orate e mormore sotto costa. Surfcasting eccezionale.', 11: 'Temperature in calo, mare mosso. Le orate fanno le ultime abbuffate prima dell\'inverno.', 12: 'Inverno: condizioni difficili. Comacchio resta produttivo per spigole e anguille.'
  },
};

const SPECIES_LOCAL_TIPS = {
  'sardegna': {
    'Spigola': ['Le spigole sarde si concentrano nelle foci dei fiumi e negli stagni costieri', 'Nella costa orientale le spigole amano le scogliere di Arbatax e Orosei', 'Le lagune del Sinis sono un habitat perfetto per le spigole di taglia'],
    'Orata': ['Le orate sarde adorano le praterie di posidonia di Villasimius', 'Le spiagge di Is Arutas e la costa occidentale sono paradiso delle orate', 'Le orate si concentrano nei bassi fondali tra San Teodoro e Budoni'],
    'Sarago': ['I saraghi sardi di taglia si trovano sulle scogliere granitiche del nord', 'Le secche della Maddalena ospitano saraghi record', 'I fondali di Capo Testa sono famosi per i saraghi maggiori'],
    'Ricciola': ['Le ricciole sarde cacciano sulle secche tra Maddalena e Caprera', 'Lo stretto di Bonifacio è un corridoio eccezionale per le ricciole', 'Le secche di Capo Carbonara attraggono ricciole di grande taglia'],
    'Dentice': ['I dentici sardi stazionano sulle secche profonde di Tavolara', 'Le cadute di fondale attorno a Carloforte sono paradiso dei dentici', 'I cappelli rocciosi della costa orientale ospitano dentici tutto l\'anno'],
    'Calamaro': ['I calamari sardi si concentrano nei porti di Alghero e Porto Torres', 'Le notti senza luna a Castelsardo regalano calamari eccezionali', 'I fondali misti di Bosa Marina sono spot top per l\'eging'],
    'Seppia': ['Le seppie sarde abbondano nelle praterie di posidonia del golfo di Oristano', 'Le baie riparate della Gallura sono ricche di seppie in primavera', 'I fondali sabbiosi di Villasimius ospitano seppie di taglia'],
    'Tonno': ['I tonni passano al largo della Sardegna durante le migrazioni estive', 'Le tonnare storiche di Carloforte testimoniano il passaggio annuale dei tonni', 'Le secche offshore della costa occidentale attirano tonni in estate'],
  },
  'sicilia': {
    'Spigola': ['Le spigole siciliane si concentrano nelle foci dei fiumi della costa settentrionale', 'La zona di Milazzo è famosa per le spigole di taglia', 'Le foci dell\'Alcantara e del Simeto sono spot produttivi per le spigole'],
    'Orata': ['Le orate siciliane raggiungono taglie record nelle lagune di Marsala', 'Le spiagge di Agrigento sono un paradiso per le orate in autunno', 'I bassi fondali del golfo di Castellammare ospitano orate tutto l\'anno'],
    'Ricciola': ['Le ricciole siciliane cacciano sulle secche delle Egadi', 'Lo Stretto di Messina è il corridoio più famoso d\'Italia per le ricciole', 'Le secche di San Vito Lo Capo attraggono ricciole dai 10 kg in su'],
    'Dentice': ['I dentici siciliani stazionano sulle secche vulcaniche delle Eolie', 'Le cadute di fondale attorno a Ustica sono paradiso dei dentici', 'I cappelli rocciosi dello Stretto ospitano dentici tutto l\'anno'],
    'Calamaro': ['I calamari siciliani si concentrano nei porti di Palermo e Siracusa', 'Le notti di eging a Cefalù sono leggendarie', 'I moli illuminati di Trapani regalano calamari eccezionali'],
    'Lampuga': ['Le lampughe arrivano in Sicilia in estate seguendo gli oggetti galleggianti', 'Il canale di Sicilia è il corridoio preferito dalle lampughe', 'Tra le Egadi e Pantelleria le lampughe raggiungono taglie eccezionali'],
    'Tonno': ['I tonni passano nello Stretto di Messina durante le migrazioni', 'Le tonnare di Favignana sono storia della pesca siciliana', 'Le secche al largo di San Vito attirano tonni in estate'],
    'Sarago': ['I saraghi siciliani raggiungono taglie importanti sulle scogliere ioniche', 'Le grotte di Taormina ospitano saraghi record', 'I fondali di Capo Passero sono ricchi di saraghi tutto l\'anno'],
    'Palamita': ['Le palamite siciliane cacciano al largo dello Stretto in estate', 'Le secche delle Eolie attraggono branchi enormi di palamite', 'Il canale di Sicilia è una rotta migratoria per le palamite'],
    'Seppia': ['Le seppie siciliane abbondano nei fondali sabbiosi della costa sud', 'I porti di Augusta e Siracusa sono spot eccellenti per le seppie', 'Le praterie del golfo di Gela ospitano seppie di taglia'],
  },
  'liguria': {
    'Spigola': ['Le spigole liguri si trovano tra le scogliere di Portofino e Sestri', 'Le foci del Magra e del Vara sono produttive per le spigole invernali', 'I promontori di Capo Mele e Capo Noli concentrano le spigole'],
    'Sarago': ['I saraghi liguri raggiungono taglie record sulle scogliere di Bergeggi', 'I fondali rocciosi delle Cinque Terre ospitano saraghi tutto l\'anno', 'Le secche di Portofino sono famose per i saraghi maggiori'],
    'Orata': ['Le orate liguri frequentano i fondali misti tra Alassio e Laigueglia', 'Le baie riparate del Tigullio ospitano orate di taglia', 'I fondali sabbiosi di Andora sono paradiso delle orate in autunno'],
    'Calamaro': ['I calamari liguri si concentrano nei porti di Genova e La Spezia', 'Le notti di eging a Rapallo sono eccezionali', 'I moli di Portofino regalano calamari di taglia in inverno'],
    'Dentice': ['I dentici liguri stazionano sulle secche profonde del Tigullio', 'Le cadute di fondale di Portofino ospitano dentici record', 'Le secche al largo di Bergeggi attraggono dentici in estate'],
    'Occhiata': ['Le occhiate liguri sono presenti in massa su tutte le scogliere', 'I moli di Genova e Savona regalano occhiate tutto l\'anno', 'Le scogliere delle Cinque Terre brulicano di occhiate di taglia'],
    'Seppia': ['Le seppie liguri frequentano i fondali misti del golfo di La Spezia', 'Le baie di Lerici e Portovenere sono ricche di seppie in primavera', 'I fondali sabbiosi del ponente ligure ospitano seppie in autunno'],
  },
  'puglia': {
    'Orata': ['Le orate pugliesi raggiungono taglie eccezionali sulle spiagge ioniche', 'Le lagune del Gargano ospitano orate tutto l\'anno', 'I fondali di Torre Canne sono famosi per le orate da surfcasting'],
    'Spigola': ['Le spigole pugliesi si concentrano a Santa Maria di Leuca', 'Le foci del Fortore e dell\'Ofanto sono produttive per le spigole', 'I canali portuali di Taranto ospitano spigole di taglia'],
    'Mormora': ['Le mormore pugliesi invadono le spiagge ioniche in primavera', 'I fondali sabbiosi di Margherita di Savoia sono paradiso delle mormore', 'Le spiagge del Gargano meridionale regalano mormore record'],
    'Sarago': ['I saraghi pugliesi si trovano sulle scogliere del Gargano', 'Le grotte di Castro e Otranto ospitano saraghi di taglia', 'I fondali rocciosi delle Tremiti sono famosi per i saraghi maggiori'],
    'Ricciola': ['Le ricciole pugliesi cacciano al largo delle Tremiti', 'Le secche del Gargano attraggono ricciole in estate', 'Otranto e Santa Maria di Leuca sono corridoi per le ricciole'],
    'Calamaro': ['I calamari pugliesi si concentrano nei porti di Bari e Brindisi', 'Le notti di eging a Otranto sono leggendarie', 'I moli di Monopoli regalano calamari eccezionali'],
    'Seppia': ['Le seppie pugliesi abbondano nelle lagune di Lesina e Varano', 'I fondali misti del golfo di Taranto sono ricchi di seppie', 'Le baie del Salento ospitano seppie di taglia in autunno'],
  },
  'toscana': {
    'Orata': ['Le orate toscane raggiungono taglie record a Castiglione della Pescaia', 'I fondali dell\'Argentario sono famosi per le orate', 'Le spiagge di Follonica e Piombino sono paradiso del surfcasting'],
    'Spigola': ['Le spigole toscane si concentrano alle foci dell\'Arno e del Serchio', 'Le scogliere dell\'Elba ospitano spigole di taglia tutto l\'anno', 'I canali di Orbetello sono produttivi per le spigole invernali'],
    'Dentice': ['I dentici toscani stazionano sulle secche dell\'Argentario', 'Le cadute di fondale dell\'Elba ospitano dentici record', 'Le secche di Capraia attraggono dentici di grande taglia'],
    'Ricciola': ['Le ricciole toscane cacciano attorno all\'Isola del Giglio', 'Le secche dell\'Elba attraggono ricciole in estate', 'L\'Argentario è un corridoio eccezionale per le ricciole'],
    'Sarago': ['I saraghi toscani raggiungono taglie importanti sulle secche del Giglio', 'Le scogliere dell\'Elba ospitano saraghi tutto l\'anno', 'I fondali di Capraia sono ricchi di saraghi maggiori'],
    'Calamaro': ['I calamari toscani si concentrano nei porti di Livorno e Piombino', 'Le notti di eging nell\'arcipelago toscano sono eccezionali', 'I moli di Porto Santo Stefano regalano calamari di taglia'],
    'Seppia': ['Le seppie toscane frequentano la laguna di Orbetello', 'I fondali sabbiosi di Marina di Grosseto sono ricchi di seppie', 'Le baie dell\'Elba ospitano seppie in primavera e autunno'],
  },
  'campania': {
    'Ricciola': ['Le ricciole campane cacciano sulle secche di Ischia e Capri', 'Il banco d\'Ischia è uno degli spot più famosi d\'Italia per le ricciole', 'Le secche di Li Galli attirano ricciole da oltre 20 kg'],
    'Dentice': ['I dentici campani stazionano sulle secche del Golfo di Napoli', 'Le cadute di fondale di Capri ospitano dentici record', 'Le secche di Palinuro attraggono dentici tutto l\'anno'],
    'Spigola': ['Le spigole campane si concentrano nella Penisola Sorrentina', 'Le foci del Volturno e del Sele sono produttive per le spigole', 'I porti di Procida e Ischia ospitano spigole di taglia'],
    'Orata': ['Le orate campane frequentano le baie del Cilento', 'I fondali di Agropoli e Acciaroli sono famosi per le orate', 'Le spiagge del golfo di Salerno regalano orate record'],
    'Calamaro': ['I calamari campani si concentrano nei porti del Golfo di Napoli', 'Le notti di eging a Mergellina sono leggendarie', 'I moli di Pozzuoli regalano calamari eccezionali'],
    'Tonno': ['I tonni passano al largo delle isole del Golfo in estate', 'Le secche offshore di Capri attirano tonni in migrazione', 'Il canyon sottomarino del Golfo di Napoli è un corridoio per i tonni'],
    'Lampuga': ['Le lampughe campane arrivano seguendo le correnti del Tirreno', 'Tra Capri e le secche al largo si trovano lampughe in estate', 'Gli oggetti galleggianti al largo del Cilento attraggono lampughe'],
    'Sarago': ['I saraghi campani raggiungono taglie eccellenti a Li Galli', 'Le grotte di Capri ospitano saraghi record', 'I fondali rocciosi di Sorrento sono ricchi di saraghi tutto l\'anno'],
  },
  'lazio': {
    'Spigola': ['Le spigole laziali si concentrano alle foci del Tevere e dell\'Arrone', 'I canali di Fiumicino sono leggendari per le spigole invernali', 'Le scogliere del Circeo ospitano spigole di taglia'],
    'Orata': ['Le orate laziali frequentano le spiagge di Anzio e Nettuno', 'I fondali di Sabaudia sono famosi per le orate da surfcasting', 'Le spiagge laziali dopo le mareggiate regalano orate record'],
    'Dentice': ['I dentici laziali stazionano sulle secche di Ponza e Ventotene', 'Le cadute di fondale delle pontine ospitano dentici record', 'I cappelli rocciosi al largo del Circeo attraggono dentici'],
    'Ricciola': ['Le ricciole laziali cacciano attorno a Ponza e Zannone', 'Le secche tra le pontine sono un paradiso per le ricciole', 'Il banco di Santa Lucia attira ricciole di grande taglia'],
    'Calamaro': ['I calamari laziali si concentrano nel porto di Gaeta', 'Le notti di eging a Sperlonga sono eccezionali', 'I moli di Civitavecchia regalano calamari tutto l\'inverno'],
    'Sarago': ['I saraghi laziali raggiungono taglie importanti sulle secche pontine', 'Le scogliere del Circeo ospitano saraghi tutto l\'anno', 'I fondali di Gaeta sono ricchi di saraghi maggiori'],
    'Seppia': ['Le seppie laziali frequentano i fondali sabbiosi di Anzio', 'Le baie del Circeo sono ricche di seppie in primavera', 'I fondali misti di Terracina ospitano seppie di taglia'],
  },
  'calabria': {
    'Ricciola': ['Le ricciole calabresi cacciano nello Stretto di Messina con potenza', 'Le secche di Tropea attraggono ricciole da oltre 30 kg', 'Lo Stretto con le sue correnti è il paradiso delle ricciole'],
    'Dentice': ['I dentici calabresi stazionano sulle secche dello Stretto', 'Le cadute di fondale di Scilla ospitano dentici record', 'Le secche di Capo Vaticano attraggono dentici tutto l\'anno'],
    'Spigola': ['Le spigole calabresi si trovano lungo la costa tirrenica', 'Le foci dei torrenti calabresi sono produttive per le spigole', 'Le scogliere di Palmi ospitano spigole di taglia'],
    'Orata': ['Le orate calabresi frequentano le spiagge ioniche di Catanzaro', 'I fondali di Soverato sono famosi per le orate', 'Le spiagge calabresi dell\'Ionio regalano orate record in autunno'],
    'Palamita': ['Le palamite calabresi cacciano nello Stretto in branchi enormi', 'Le correnti dello Stretto concentrano le palamite in estate', 'Le secche tra Scilla e Bagnara attraggono palamite di taglia'],
    'Calamaro': ['I calamari calabresi si concentrano nei porti tirrenici', 'Le notti di eging a Tropea sono eccezionali', 'I moli di Pizzo regalano calamari di taglia in autunno'],
    'Tonno': ['I tonni attraversano lo Stretto durante le migrazioni estive', 'Le correnti dello Stretto canalizzano i tonni in corridoi stretti', 'Le secche offshore tirreniche attirano tonni in estate'],
  },
  'veneto': {
    'Orata': ['Le orate venete entrano in laguna da aprile a novembre', 'Le valli da pesca di Comacchio ospitano orate di taglia', 'I bassi fondali di Chioggia sono paradiso delle orate'],
    'Spigola': ['Le spigole venete si concentrano nei canali della laguna', 'Le bocche di porto di Venezia sono spot leggendari per le spigole', 'I canali di Pellestrina ospitano spigole tutto l\'anno'],
    'Mormora': ['Le mormore venete invadono le spiagge adriatiche in primavera', 'I fondali di Rosolina e Sottomarina sono famosi per le mormore', 'Le spiagge di Caorle regalano mormore record'],
    'Cefalo': ['I cefali veneti abbondano in tutta la laguna di Venezia', 'I canali lagunari sono ricchi di cefali di taglia', 'Le valli da pesca mantengono cefali tutto l\'anno'],
    'Calamaro': ['I calamari veneti si concentrano nei porti di Chioggia e Venezia', 'Le notti di eging a Pellestrina sono produttive', 'I moli di Caorle regalano calamari in autunno'],
    'Seppia': ['Le seppie venete frequentano i fondali misti dell\'alto Adriatico', 'Le baie di Chioggia sono ricche di seppie in primavera', 'I fondali lagunari ospitano seppie di taglia'],
    'Sarago': ['I saraghi veneti si trovano sulle difese costiere e moli', 'Le scogliere artificiali del litorale veneziano ospitano saraghi', 'I moli dei porti adriatici regalano saraghi tutto l\'anno'],
  },
  'emilia-romagna': {
    'Orata': ['Le orate romagnole invadono le spiagge dopo le mareggiate autunnali', 'I fondali di Cervia e Milano Marittima sono famosi per le orate', 'Le spiagge di Cattolica regalano orate record da surfcasting'],
    'Mormora': ['Le mormore romagnole sono le regine delle spiagge estive', 'I fondali sabbiosi di Rimini e Riccione ospitano mormore abbondanti', 'Le spiagge di Cesenatico sono paradiso delle mormore'],
    'Spigola': ['Le spigole romagnole si concentrano nelle valli di Comacchio', 'Le foci del Reno e del Po sono produttive per le spigole', 'I canali portuali di Ravenna ospitano spigole di taglia'],
    'Rombo': ['I rombi romagnoli si trovano sui fondali sabbiosi al largo', 'Le zone di Goro e Porto Garibaldi sono famose per i rombi', 'I fondali profondi al largo di Cattolica ospitano rombi di taglia'],
    'Sogliola': ['Le sogliole romagnole abbondano sui fondali sabbiosi', 'Le zone al largo di Rimini sono famose per le sogliole', 'I fondali di Cesenatico ospitano sogliole tutto l\'anno'],
    'Cefalo': ['I cefali romagnoli frequentano le valli di Comacchio', 'I canali di Porto Garibaldi sono ricchi di cefali', 'Le foci del Po regalano cefali di taglia'],
    'Calamaro': ['I calamari romagnoli si concentrano nei porti di Rimini e Cattolica', 'Le notti di eging a Cesenatico sono produttive', 'I moli di Porto Garibaldi regalano calamari in autunno'],
    'Seppia': ['Le seppie romagnole frequentano i fondali misti al largo', 'Le zone di Comacchio sono ricche di seppie in primavera', 'I fondali sabbiosi di Cervia ospitano seppie di taglia'],
  },
};

const REGIONAL_NOTES = {
  'sardegna': {
    1: 'Gennaio in Sardegna è il mese delle spigole: il Maestrale porta pesce sotto costa e le foci degli stagni sono il punto d\'incontro perfetto. Chi affronta il freddo viene premiato.',
    2: 'Febbraio sardo è imprevedibile: giornate di Maestrale forte alternate a pause con mare cristallino. Le seppie iniziano a muoversi e i calamari sono ancora attivi.',
    3: 'Marzo segna il risveglio della Sardegna peschereccia: le orate tornano sui fondali bassi, i saraghi salgono dalle profondità e le giornate si allungano.',
    4: 'Aprile è il mese in cui la Sardegna esplode di vita: ogni scogliera, ogni baia, ogni fondale basso brulica di pesci in attività. Le condizioni sono spesso perfette.',
    5: 'Maggio sardo è un paradiso: acque cristalline, temperature ideali, pesci in piena attività da riva e dalla barca. È il mese preferito dai pescatori locali.',
    6: 'Giugno segna l\'inizio dell\'estate sarda: i pelagici si avvicinano alla costa, le ricciole cacciano sulle secche e l\'eging notturno regala le ultime seppie.',
    7: 'Luglio in Sardegna è caldo e luminoso: i pesci si rifugiano nelle profondità durante il giorno, ma alba e tramonto regalano sessioni indimenticabili.',
    8: 'Agosto è il mese dei grandi predatori in Sardegna: ricciole, dentici e palamite sono in piena attività sulle secche. Le notti di eging regalano totani.',
    9: 'Settembre è considerato il mese migliore per pescare in Sardegna: temperature ancora estive, primi venti, pesci in frenesia alimentare pre-autunnale.',
    10: 'Ottobre sardo è eccezionale: le prime mareggiate portano nutrimento, le orate invadono le spiagge e i predatori fanno le scorte per l\'inverno.',
    11: 'Novembre in Sardegna porta le grandi spigole sotto costa, i calamari nei porti e le orate sulle spiagge. Un mese sottovalutato ma ricchissimo.',
    12: 'Dicembre sardo è mite rispetto al continente: i calamari sono in piena stagione, le spigole cacciano all\'alba e chi non teme il Maestrale viene premiato.',
  },
  'sicilia': {
    1: 'Gennaio siciliano è il regno dei cefalopodi: calamari e totani nei porti, seppie sui fondali. Le spigole sono attive lungo tutta la costa settentrionale.',
    2: 'Febbraio in Sicilia porta le prime avvisaglie di primavera: il mare è ancora fresco ma i pesci iniziano a muoversi. Buone uscite nelle giornate stabili.',
    3: 'Marzo segna l\'inizio della grande stagione siciliana: le orate tornano sotto costa, le seppie sono al picco e le giornate si allungano sensibilmente.',
    4: 'Aprile è splendido in Sicilia: temperature gradevoli, mare calmo e una varietà ittica che non ha eguali. Le secche iniziano a popolarsi di predatori.',
    5: 'Maggio siciliano è un mese d\'oro: i grandi predatori si avvicinano alla costa, le acque si scaldano e ogni tecnica è produttiva dal surfcasting al jigging.',
    6: 'Giugno in Sicilia è pesca ad alto livello: ricciole sulle secche delle Egadi, dentici nello Stretto, spinning da sogno lungo tutta la costa.',
    7: 'Luglio siciliano è intenso e caldo: le acque bollenti spingono i pesci in profondità di giorno, ma alba e notte regalano catture eccezionali.',
    8: 'Agosto è il mese d\'oro per la pesca pelagica in Sicilia: lampughe, palamite e ricciole in caccia frenetica. Le Egadi e lo Stretto sono i teatri principali.',
    9: 'Settembre siciliano combina il meglio dell\'estate con i primi segni d\'autunno: pesci ancora in superficie, acque calde, giornate lunghe e produttive.',
    10: 'Ottobre in Sicilia è eccezionale: le temperature ancora alte permettono ogni tecnica, le prime piogge portano le spigole alle foci e le orate sulle spiagge.',
    11: 'Novembre siciliano porta i calamari nei porti, le spigole sulle scogliere e le orate in frenesia. Il mare è spesso mosso ma le pause sono d\'oro.',
    12: 'Dicembre in Sicilia è mite e produttivo: i calamari sono al picco, le seppie abbondano e le giornate di calma regalano spinning eccezionale.',
  },
  'liguria': {
    1: 'Gennaio ligure è freddo ma produttivo per chi ama la spigola a spinning: le scogliere profonde offrono rifugio ai pesci e i calamari riempiono i porti.',
    2: 'Febbraio in Liguria è ancora inverno, ma le giornate che si allungano portano i primi saraghi sulle scogliere. I porti sono vivi di calamari e seppie.',
    3: 'Marzo segna il risveglio ligure: i saraghi salgono dalle profondità, le occhiate tornano in massa e la bolognese dai moli diventa produttiva.',
    4: 'Aprile ligure è il mese del risveglio completo: ogni scogliera, ogni molo, ogni porto brulica di pesci. Le condizioni sono spesso perfette per la pesca tecnica.',
    5: 'Maggio è il mese preferito dai pescatori liguri: temperature ideali, mare calmo e pesci attivi tutto il giorno. Lo spinning sulle scogliere è al massimo.',
    6: 'Giugno in Liguria porta l\'estate e con essa le sessioni infinite di spinning all\'alba. I saraghi sono in riproduzione e i predatori cacciano attivamente.',
    7: 'Luglio ligure è caldo e luminoso: le scogliere profonde offrono ombra ai pesci. Eging notturno eccezionale nei porti di Genova e La Spezia.',
    8: 'Agosto in Liguria vede mare calmo e acque limpide: i turisti occupano le spiagge ma l\'alba resta per i pescatori. Eging notturno al top.',
    9: 'Settembre è il mese TOP della pesca in Liguria: temperature perfette, primi venti, pesci in attività frenetica su tutte le scogliere.',
    10: 'Ottobre ligure è splendido: le prime mareggiate portano nutrimento sotto costa, i saraghi sono al massimo e le spigole iniziano ad avvicinarsi.',
    11: 'Novembre porta le spigole sotto le scogliere liguri: lo spinning diventa la tecnica regina. I calamari iniziano la loro stagione nei porti.',
    12: 'Dicembre ligure è il mese della spigola per eccellenza: chi affronta il freddo e il libeccio viene premiato con catture che rimangono nella memoria.',
  },
  'puglia': {
    1: 'Gennaio pugliese è fresco ma la costa ionica resta pescabile: le spigole sono attive alle foci e i calamari nei porti del Gargano.',
    2: 'Febbraio in Puglia porta le prime orate sui fondali bassi ionici. Le giornate di grecale sono fredde ma le pause regalano buone uscite.',
    3: 'Marzo segna l\'inizio della grande stagione pugliese: le mormore invadono le spiagge, le orate tornano e il surfcasting diventa produttivo.',
    4: 'Aprile pugliese è splendido: mare calmo, temperature gradevoli. Le spiagge ioniche sono un paradiso per surfcasting e beach ledgering.',
    5: 'Maggio in Puglia è un mese d\'oro: ogni tecnica funziona, dalle spiagge alle scogliere. Le orate sono in frenesia alimentare.',
    6: 'Giugno porta l\'estate pugliese: spinning sulle scogliere del Gargano, surfcasting sulle spiagge ioniche, eging nei porti al tramonto.',
    7: 'Luglio pugliese è caldo e luminoso: i pesci cercano profondità durante il giorno. Le notti regalano eging eccezionale e spinning all\'alba.',
    8: 'Agosto in Puglia è il mese dei pelagici al largo e dell\'eging notturno sulla costa. Le ricciole cacciano attorno alle Tremiti.',
    9: 'Settembre pugliese è eccezionale: le orate tornano sotto costa, i predatori sono ancora attivi e le prime piogge portano spigole alle foci.',
    10: 'Ottobre è il mese regina della pesca in Puglia: le orate sono ovunque, le mormore invadono le spiagge e il surfcasting dà il meglio.',
    11: 'Novembre pugliese porta le grandi orate: è il mese del surfcasting per eccellenza. Le mareggiate portano pesce sotto costa.',
    12: 'Dicembre in Puglia è mite al sud: le spigole a Leuca, i calamari a Otranto, le orate sulle spiagge ioniche. Un mese sottovalutato.',
  },
  'toscana': {
    1: 'Gennaio toscano è il mese delle spigole alle foci: l\'Arno, il Serchio e l\'Ombrone diventano i punti caldi per lo spinning invernale.',
    2: 'Febbraio in Toscana è ancora freddo, ma le giornate si allungano. Le spigole restano attive e le prime orate iniziano a muoversi.',
    3: 'Marzo segna il risveglio della costa toscana: le orate tornano sulle spiagge, i saraghi salgono dalle profondità dell\'arcipelago.',
    4: 'Aprile toscano è ideale: mare calmo, temperature in salita. L\'arcipelago diventa accessibile e le isole promettono catture eccezionali.',
    5: 'Maggio è il mese migliore per pescare in Toscana: ogni spot, dalla spiaggia all\'isola, è produttivo. Le condizioni sono quasi sempre perfette.',
    6: 'Giugno porta l\'estate toscana: spinning all\'alba sulle scogliere dell\'Argentario, surfcasting al tramonto sulle spiagge della Maremma.',
    7: 'Luglio toscano è caldo: le acque cristalline dell\'arcipelago offrono pesca dalla barca eccezionale. Da riva, alba e tramonto sono i momenti d\'oro.',
    8: 'Agosto in Toscana è il mese della traina e del bolentino intorno all\'Elba e al Giglio. Da riva, l\'eging notturno regala calamari.',
    9: 'Settembre toscano è perfetto: temperature ideali, primi venti, pesci in frenesia. Le scogliere dell\'Argentario sono al massimo.',
    10: 'Ottobre porta le grandi orate sulle spiagge toscane: il surfcasting in Maremma raggiunge il picco. Le mareggiate sono il segreto.',
    11: 'Novembre in Toscana è il mese delle spigole: le foci dei fiumi tornano produttive e lo spinning sulle scogliere regala catture di taglia.',
    12: 'Dicembre toscano è variabile: le pause dal maltempo regalano spigole alle foci e calamari nei porti. I pescatori locali non si fermano mai.',
  },
  'campania': {
    1: 'Gennaio campano è mite grazie al Golfo di Napoli: le spigole sono attive nei porti e le seppie abbondano nei fondali costieri.',
    2: 'Febbraio in Campania porta le prime giornate stabili: il Golfo si risveglia, le spigole cacciano all\'alba e i calamari riempiono i porti.',
    3: 'Marzo campano è promettente: le orate tornano nelle baie del Cilento, i saraghi salgono sulle scogliere e la bolognese diventa produttiva.',
    4: 'Aprile è splendido in Campania: le secche del Golfo diventano attive, le isole promettono grandi catture. Spinning e bolognese al top.',
    5: 'Maggio campano è eccezionale: i pelagici si avvicinano alle isole, le ricciole iniziano a cacciare sulle secche. Un mese da non perdere.',
    6: 'Giugno porta la grande pesca campana: ricciole a Ischia, dentici a Capri, spinning sulla Sorrentina. Il Golfo è un teatro di caccia.',
    7: 'Luglio campano è caldo e produttivo dalla barca: le secche profonde ospitano predatori in caccia. Da riva, l\'eging notturno è eccezionale.',
    8: 'Agosto è il mese dei grandi predatori in Campania: ricciole e dentici sulle secche, lampughe al largo. Il Golfo è al massimo.',
    9: 'Settembre campano combina estate e primi venti autunnali: i pesci sono in frenesia. Le sessioni di jigging sulle secche sono indimenticabili.',
    10: 'Ottobre in Campania è eccezionale: le orate tornano sulle spiagge del Cilento, le spigole si avvicinano alla costa. Mese d\'oro.',
    11: 'Novembre campano porta le spigole sotto costa e i calamari nei porti. Le giornate di calma nel Golfo regalano catture memorabili.',
    12: 'Dicembre nel Golfo di Napoli è più mite che altrove: calamari e seppie nei porti, spigole sulle scogliere. Il clima protegge i pescatori.',
  },
  'lazio': {
    1: 'Gennaio laziale è il mese delle spigole alle foci del Tevere: la tramontana porta pesce sotto costa e i canali portuali sono produttivi.',
    2: 'Febbraio nel Lazio è ancora freddo: mare spesso mosso, ma le foci restano produttive per le spigole e i calamari riempiono i porti.',
    3: 'Marzo segna il risveglio laziale: le orate iniziano a farsi sentire sulle spiagge, le pontine diventano raggiungibili nelle giornate calme.',
    4: 'Aprile laziale è promettente: mare calmo, temperature in salita. Ponza e Ventotene diventano mete possibili per giornate di pesca d\'eccezione.',
    5: 'Maggio è il mese migliore per il Lazio: le pontine offrono pesca d\'alto livello, le spiagge si animano di orate e mormore.',
    6: 'Giugno porta l\'estate laziale: Ponza e Ventotene al meglio, surfcasting sulle spiagge, spinning sulle scogliere del Circeo.',
    7: 'Luglio laziale è caldo e luminoso: le pontine regalano jigging e bolentino eccezionali. Da riva, eging notturno nei porti.',
    8: 'Agosto nel Lazio è il mese dei pelagici attorno alle pontine: traina e jigging al top. Le spiagge ospitano beach ledgering notturno.',
    9: 'Settembre laziale è ancora caldo: i pesci iniziano a rientrare sotto costa. Le pontine restano produttive per i grandi predatori.',
    10: 'Ottobre porta le grandi orate sulle spiagge laziali: Anzio, Nettuno e Sabaudia sono il teatro del surfcasting. Mareggiate produttive.',
    11: 'Novembre laziale è il ritorno delle spigole: le foci del Tevere tornano produttive e lo spinning nelle scogliere dà grandi risultati.',
    12: 'Dicembre nel Lazio è freddo ma produttivo: i calamari nei porti, le spigole alle foci, e chi va a Ponza trova ancora dentici.',
  },
  'calabria': {
    1: 'Gennaio calabrese è mite sulla costa tirrenica: lo Stretto di Messina resta attivo e le spigole cacciano lungo le scogliere.',
    2: 'Febbraio in Calabria porta le prime schiarite: le correnti dello Stretto portano nutrimento e i pesci iniziano a muoversi.',
    3: 'Marzo segna il risveglio della Calabria: la costa tirrenica si anima, i saraghi tornano sulle scogliere e le orate sui fondali ionici.',
    4: 'Aprile calabrese è eccellente: mare calmo, temperature in salita. Lo Stretto inizia a popolarsi di pelagici. Spinning al top.',
    5: 'Maggio in Calabria è splendido: le ricciole iniziano a caccianello Stretto, le orate invadono le spiagge ioniche. Un mese d\'oro.',
    6: 'Giugno porta la grande pesca calabrese: ricciole e dentici nello Stretto, spinning a Tropea, bolognese lungo tutta la costa.',
    7: 'Luglio calabrese è intenso: lo Stretto di Messina offre jigging da sogno con correnti potenti e ricciole in caccia.',
    8: 'Agosto è il mese d\'oro dello Stretto: ricciole, palamite e dentici in frenesia. Tropea e Scilla sono i teatri principali.',
    9: 'Settembre calabrese combina caldo estivo e primi venti: i pesci sono al massimo dell\'attività. Lo Stretto è un paradiso.',
    10: 'Ottobre in Calabria è eccezionale: le orate tornano sulle spiagge ioniche, le spigole sui moli tirrenici. Surfcasting al top.',
    11: 'Novembre calabrese porta le spigole sotto costa e i calamari nei porti. Le giornate di calma nello Stretto regalano ancora ricciole.',
    12: 'Dicembre in Calabria è mite: lo Stretto resta produttivo, i porti regalano eging eccezionale e le spigole non vanno in letargo.',
  },
  'veneto': {
    1: 'Gennaio veneto è rigido: la bora soffia forte, ma la laguna di Venezia offre riparo e le spigole nei canali premiano chi sfida il freddo.',
    2: 'Febbraio nel Veneto è ancora inverno, ma le giornate si allungano. Le valli da pesca iniziano a riattivarsi lentamente.',
    3: 'Marzo segna il risveglio dell\'Adriatico veneto: le orate iniziano a entrare in laguna, le mormore tornano sulle spiagge.',
    4: 'Aprile veneto è promettente: le temperature salgono, le orate entrano in laguna in massa e la bolognese dai moli diventa produttiva.',
    5: 'Maggio è un mese eccellente per il Veneto: le orate invadono i bassi fondali, le mormore sono ovunque. Bolognese e feeder al top.',
    6: 'Giugno porta l\'estate veneta: la laguna è al suo meglio, le orate sono in piena attività e le spiagge offrono surfcasting accessibile.',
    7: 'Luglio veneto è caldo: le acque lagunari sono molto calde. Pescare le ore fresche nei canali per spigole e orate.',
    8: 'Agosto nel Veneto vede le spiagge affollate ma l\'alba resta per i pescatori: orate sui fondali bassi, mormore sulla battigia.',
    9: 'Settembre è il mese migliore per pescare nel Veneto: temperature perfette, pesci in frenesia in laguna e in mare.',
    10: 'Ottobre veneto è eccezionale: le orate sono al picco in laguna, le spigole iniziano a entrare. Bolognese e feeder danno il meglio.',
    11: 'Novembre porta le grandi spigole in laguna: le acque si raffreddano e i predatori si concentrano nei canali profondi.',
    12: 'Dicembre veneto è rigido: la laguna resta l\'ultimo rifugio produttivo, con spigole nei canali e anguille nelle valli.',
  },
  'emilia-romagna': {
    1: 'Gennaio romagnolo è freddo e il mare è spesso agitato: le valli di Comacchio restano l\'opzione migliore per le spigole.',
    2: 'Febbraio in Emilia-Romagna è ancora inverno: mare mosso, temperature basse. Le mormore iniziano però a muoversi sui fondali.',
    3: 'Marzo segna il risveglio dell\'Adriatico romagnolo: le orate tornano sulle spiagge, le mormore invadono i fondali sabbiosi.',
    4: 'Aprile romagnolo è promettente: le temperature salgono, le spiagge si rianimano. Surfcasting e beach ledgering diventano produttivi.',
    5: 'Maggio è il mese d\'oro della riviera: orate e mormore ovunque, spiagge accessibili e condizioni quasi sempre favorevoli.',
    6: 'Giugno porta l\'estate romagnola: mare calmo, fondali caldi. Le spiagge la mattina presto sono un paradiso per il surfcasting.',
    7: 'Luglio romagnolo è caldo: le spiagge si affollano ma l\'alba resta per i pescatori. Mormore e orate attive nei bassi fondali.',
    8: 'Agosto in Emilia-Romagna è il mese del beach ledgering all\'alba: rombi, sogliole e mormore sui fondali sabbiosi.',
    9: 'Settembre romagnolo è eccezionale: temperature ancora alte, le orate sono in frenesia pre-autunnale. Le spiagge tornano tranquille.',
    10: 'Ottobre porta il surfcasting al massimo: le orate invadono le spiagge dopo le mareggiate, le mormore fanno le ultime abbuffate.',
    11: 'Novembre romagnolo è il mese delle ultime grandi catture: le orate sono al picco, le spigole iniziano ad avvicinarsi alla costa.',
    12: 'Dicembre in Emilia-Romagna è rigido: Comacchio resta produttivo per spigole e anguille, mentre le spiagge sono per i più coraggiosi.',
  },
};

function getSpeciesSlug(name) {
  return fishSlugMap[name.toLowerCase()] || name.toLowerCase().replace(/\s+/g, '-');
}

function getLocalTip(regionId, speciesName, monthIdx) {
  const tips = SPECIES_LOCAL_TIPS[regionId]?.[speciesName];
  if (!tips || tips.length === 0) return `${speciesName} è attiva in questa zona nel mese di ${MONTH_NAMES[monthIdx].toLowerCase()}`;
  return tips[monthIdx % tips.length];
}

function getSpeciesActivity(speciesName, monthNum, monthData) {
  const calSpecies = monthData?.species?.find(s => s.name === speciesName);
  if (calSpecies) return calSpecies.peak ? 3 : calSpecies.rating >= 4 ? 3 : calSpecies.rating >= 3 ? 2 : 1;
  return 2;
}

function getSpeciesTechniques(speciesName, spot) {
  const techs = new Set();
  const specEntry = spot.species.find(s => s.name === speciesName);
  if (specEntry) {
    spot.techniques.forEach(t => {
      const slug = TECHNIQUE_SLUG_MAP[t.name.toLowerCase()];
      if (slug) techs.add(slug);
    });
  }
  return [...techs].slice(0, 3);
}

function generateData() {
  const result = { metadata: { lastUpdated: '2026-02-22', totalEntries: 120 }, entries: [] };

  for (const region of spots.regions) {
    for (let m = 0; m < 12; m++) {
      const monthNum = m + 1;
      const monthSlug = MONTHS[m];
      const monthName = MONTH_NAMES[m];
      const monthData = calendar.months[String(monthNum)];

      const speciesMap = {};
      const spotsByMonth = [];

      for (const spot of region.spots) {
        const activeSpecies = spot.species.filter(s => s.months.includes(monthNum));
        if (activeSpecies.length > 0) {
          spotsByMonth.push({ id: spot.id, name: spot.name, activeCount: activeSpecies.length, rating: spot.rating });
          for (const sp of activeSpecies) {
            if (!speciesMap[sp.name]) {
              speciesMap[sp.name] = { rating: sp.rating, techniques: new Set(), spotCount: 0 };
            }
            speciesMap[sp.name].spotCount++;
            if (sp.rating > speciesMap[sp.name].rating) speciesMap[sp.name].rating = sp.rating;
            spot.techniques.forEach(t => {
              const slug = TECHNIQUE_SLUG_MAP[t.name.toLowerCase()];
              if (slug) speciesMap[sp.name].techniques.add(slug);
            });
          }
        }
      }

      const speciesList = Object.entries(speciesMap)
        .sort(([, a], [, b]) => b.rating - a.rating || b.spotCount - a.spotCount)
        .map(([name, data]) => ({
          slug: getSpeciesSlug(name),
          name,
          activity: getSpeciesActivity(name, monthNum, monthData),
          techniques: [...data.techniques].slice(0, 3),
          localTip: getLocalTip(region.id, name, m),
        }));

      const topSpots = spotsByMonth
        .sort((a, b) => b.rating - a.rating || b.activeCount - a.activeCount)
        .slice(0, 4)
        .map(s => s.id);

      const allTechniques = new Set();
      speciesList.forEach(s => s.techniques.forEach(t => allTechniques.add(t)));

      const rating = speciesList.length >= 6 ? 3 : speciesList.length >= 3 ? 2 : 1;
      if (monthData?.overallRating >= 4 && rating < 3) {}

      const entry = {
        regione: region.id,
        mese: monthSlug,
        regionName: region.name,
        meseName: monthName,
        rating: Math.min(3, Math.max(1, rating)),
        waterTemp: adjustWaterTemp(monthData?.waterTemp || '15-17°C', region.id, m),
        species: speciesList,
        topSpots,
        techniques: [...allTechniques].slice(0, 5),
        conditions: SEASON_CONDITIONS[region.id]?.[monthNum] || monthData?.description || '',
        regionalNote: REGIONAL_NOTES[region.id]?.[monthNum] || '',
      };

      result.entries.push(entry);
    }
  }

  return result;
}

const data = generateData();
const outPath = path.join(__dirname, '..', 'data', 'fishing-calendar-regional.json');
fs.writeFileSync(outPath, JSON.stringify(data, null, 2), 'utf-8');
console.log(`Generated ${data.entries.length} entries for ${data.entries.length / 12} regions x 12 months`);
console.log(`Output: ${outPath}`);

const sampleEntry = data.entries.find(e => e.regione === 'sicilia' && e.mese === 'agosto');
console.log('\nSample (Sicilia + Agosto):');
console.log(`  Rating: ${sampleEntry.rating}`);
console.log(`  Species: ${sampleEntry.species.length}`);
console.log(`  Top species: ${sampleEntry.species.slice(0, 3).map(s => s.name).join(', ')}`);
console.log(`  Top spots: ${sampleEntry.topSpots.join(', ')}`);
console.log(`  Techniques: ${sampleEntry.techniques.join(', ')}`);
