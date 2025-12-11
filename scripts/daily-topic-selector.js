/**
 * 📅 FishandTips - Daily Topic Selector
 * 
 * Seleziona automaticamente topic diversi ogni giorno
 * Evita ripetizioni e mantiene varietà
 */

// ===== BANCA TOPIC PER TIPO =====
const TOPICS = {
  tutorial: [
    'tecniche di lancio nello spinning',
    'come scegliere il mulinello perfetto',
    'nodi essenziali per la pesca',
    'montature per surfcasting',
    'pesca alla bolognese setup',
    'come leggere le maree',
    'terminali per orata',
    'pesca a fondo dalla scogliera',
    'come innestare esche vive',
    'spinning dalla spiaggia',
    'pesca con il vivo',
    'attrezzatura per principianti',
    'come scegliere la canna',
    'pesca in notturna consigli',
    'recupero artificiali tecnica',
    'pesca al calamaro eging',
    'light rock fishing',
    'pesca alla trota torrente',
    'surfcasting invernale',
    'pesca estiva consigli'
  ],
  
  mistakes: [
    'pesca alla spigola',
    'surfcasting',
    'spinning',
    'pesca all orata',
    'scelta del mulinello',
    'esche artificiali',
    'pesca notturna',
    'pesca dalla scogliera',
    'pesca con il vivo',
    'nodi da pesca',
    'ferrata del pesce',
    'lancio surfcasting',
    'recupero spinning',
    'scelta dello spot',
    'attrezzatura pesca'
  ],
  
  quiz: [
    'pesci del mediterraneo',
    'tecniche di pesca',
    'nodi da pesca',
    'attrezzatura',
    'esche naturali',
    'regolamenti pesca',
    'specie ittiche italiane',
    'mulinelli e canne',
    'ami e terminali',
    'stagionalità pesci'
  ],
  
  comparison: [
    ['Spinning', 'Surfcasting'],
    ['Mulinello frontale', 'Mulinello rotante'],
    ['Esche naturali', 'Artificiali'],
    ['Canna telescopica', 'Canna due pezzi'],
    ['Trecciato', 'Nylon'],
    ['Pesca da riva', 'Pesca in barca'],
    ['Alba', 'Tramonto'],
    ['Mare calmo', 'Mare mosso'],
    ['Amo a paletta', 'Amo ad occhiello'],
    ['Piombo scorrevole', 'Piombo fisso']
  ],
  
  toplist: [
    'esche per spigola',
    'spot pesca Italia',
    'mulinelli economici',
    'canne da spinning',
    'pesci combattivi mediterraneo',
    'tecniche per principianti',
    'accessori indispensabili',
    'artificiali per spinning',
    'pesci più buoni da mangiare',
    'errori da evitare'
  ],
  
  meme: [
    'vita da pescatore',
    'sveglia alle 4',
    'pescatori vs fidanzate',
    'il pesce che scappa',
    'meteo del pescatore',
    'aspettative vs realtà',
    'solo 5 minuti di pesca',
    'il pescatore e il portafoglio',
    'quando abbocca il pesce grosso',
    'la scusa per andare a pesca'
  ],
  
  story: [
    'la mia prima cattura',
    'il pesce che ho perso',
    'una giornata indimenticabile',
    'il consiglio del nonno pescatore',
    'quando la pesca mi ha insegnato pazienza',
    'la cattura della vita',
    'pesca in tempesta',
    'il mio spot segreto',
    'la prima volta in barca',
    'quella mattina all alba'
  ]
};

/**
 * Seleziona topic basato su giorno dell'anno
 * Garantisce rotazione senza ripetizioni ravvicinate
 */
function selectTopic(contentType, seed = null) {
  const dayOfYear = seed || Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  
  if (contentType === 'comparison') {
    const items = TOPICS.comparison;
    const index = dayOfYear % items.length;
    const [item1, item2] = items[index];
    return { topic: `${item1} vs ${item2}`, item1, item2 };
  }
  
  const topics = TOPICS[contentType] || TOPICS.tutorial;
  const index = dayOfYear % topics.length;
  return { topic: topics[index] };
}

/**
 * Ottieni configurazione per oggi
 */
function getTodayConfig() {
  const dayOfWeek = new Date().getDay(); // 0=Dom, 1=Lun, ..., 6=Sab
  
  const config = {
    0: { type: 'story', tone: 'storytelling' },      // Domenica
    1: { type: 'tutorial', tone: 'expert' },         // Lunedì
    2: { type: 'meme', tone: 'funny' },              // Martedì
    3: { type: 'mistakes', tone: 'provocative' },    // Mercoledì
    4: { type: 'quiz', tone: 'friendly' },           // Giovedì
    5: { type: 'comparison', tone: 'expert' },       // Venerdì
    6: { type: 'toplist', tone: 'friendly' }         // Sabato
  };
  
  const dayConfig = config[dayOfWeek];
  const topicData = selectTopic(dayConfig.type);
  
  return {
    ...dayConfig,
    ...topicData,
    dayOfWeek,
    dayName: ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'][dayOfWeek]
  };
}

// CLI
if (process.argv[1]?.includes('daily-topic-selector')) {
  const config = getTodayConfig();
  
  console.log(`📅 Configurazione per oggi (${config.dayName}):`);
  console.log(`   📊 Tipo: ${config.type}`);
  console.log(`   🎭 Tono: ${config.tone}`);
  console.log(`   📝 Topic: ${config.topic}`);
  
  if (config.item1) {
    console.log(`   🆚 ${config.item1} vs ${config.item2}`);
  }
  
  // Output per GitHub Actions
  console.log('\n--- GitHub Actions Output ---');
  console.log(`type=${config.type}`);
  console.log(`tone=${config.tone}`);
  console.log(`topic=${config.topic}`);
}

export { TOPICS, selectTopic, getTodayConfig };
export default { TOPICS, selectTopic, getTodayConfig };


