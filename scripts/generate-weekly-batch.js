/**
 * 🗓️ FishandTips Weekly Batch Generator
 * 
 * Genera batch di articoli settimanali automaticamente
 * Con sistema anti-duplicati e retry automatico
 * 
 * Uso:
 *   node scripts/generate-weekly-batch.js                    # Genera 3 articoli automatici
 *   node scripts/generate-weekly-batch.js --count 5          # Genera 5 articoli
 *   node scripts/generate-weekly-batch.js --file keywords.json # Usa file keyword
 *   node scripts/generate-weekly-batch.js --dry-run          # Simula senza creare
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateArticle } from './ai-content-generator.js';
import { checkSemanticDuplicate } from './semantic-duplicate-checker.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIGURAZIONE =====
const CONFIG = {
  defaultArticleCount: 3,
  pauseBetweenArticles: 5000, // 5 secondi (rate limit Gemini: 15 req/min)
  pauseBetweenDuplicateChecks: 2000, // 2 secondi tra check duplicati
  logFile: path.join(__dirname, '..', 'data', 'generation-log.json'),
  skipDuplicateCheck: false, // Se true, salta il pre-check dei duplicati
  maxRetryAttempts: 3 // Quante volte provare a trovare keyword non duplicate
};

// ===== KEYWORD POOL ESTESO PER STAGIONE =====
function getSeasonalKeywords() {
  const month = new Date().getMonth();
  
  // Pool ESTESO di keyword stagionali
  const seasonalKeywords = {
    // Inverno (Dic, Gen, Feb)
    winter: [
      { keyword: "pesca alla spigola in inverno tecniche e consigli", category: "tecniche-di-pesca" },
      { keyword: "migliori esche per pesca invernale mare", category: "attrezzature" },
      { keyword: "surfcasting invernale come pescare col freddo", category: "consigli" },
      { keyword: "pesca al calamaro di notte consigli esperti", category: "tecniche-di-pesca" },
      { keyword: "abbigliamento pesca invernale cosa indossare", category: "attrezzature" },
      { keyword: "pesca alla seppia da riva in inverno", category: "tecniche-di-pesca" },
      { keyword: "migliori totanare per calamaro inverno", category: "attrezzature" },
      { keyword: "come pescare le mormore in inverno", category: "tecniche-di-pesca" },
      { keyword: "pesca al sarago in inverno dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "eging invernale seppie tecniche avanzate", category: "tecniche-di-pesca" },
      { keyword: "pesca notturna invernale cosa sapere", category: "consigli" },
      { keyword: "montature invernali surfcasting", category: "attrezzature" },
      { keyword: "come trovare le orate in inverno", category: "consigli" },
      { keyword: "bolognese invernale in porto", category: "tecniche-di-pesca" },
      { keyword: "pesca alle occhiate inverno mediterraneo", category: "tecniche-di-pesca" },
      { keyword: "guanti pesca invernale quali scegliere", category: "attrezzature" },
      { keyword: "esche vive inverno come conservarle", category: "consigli" },
      { keyword: "spinning invernale dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "pesca ai polpi in inverno", category: "tecniche-di-pesca" },
      { keyword: "condizioni meteo ideali pesca invernale", category: "consigli" },
      { keyword: "rock fishing invernale tecniche", category: "tecniche-di-pesca" },
      { keyword: "terminali fluorocarbon pesca invernale", category: "attrezzature" },
      { keyword: "pesca al cefalo inverno tecniche", category: "tecniche-di-pesca" },
      { keyword: "lampade frontali pesca notturna", category: "attrezzature" },
      { keyword: "orari migliori pesca invernale mare", category: "consigli" }
    ],
    // Primavera (Mar, Apr, Mag)
    spring: [
      { keyword: "pesca primaverile tecniche e specie target", category: "tecniche-di-pesca" },
      { keyword: "migliori artificiali per spigola primavera", category: "attrezzature" },
      { keyword: "surfcasting primaverile orata e mormore", category: "tecniche-di-pesca" },
      { keyword: "spinning dalla scogliera in primavera", category: "tecniche-di-pesca" },
      { keyword: "esche naturali primavera quali usare", category: "consigli" },
      { keyword: "pesca alla seppia in primavera tecniche", category: "tecniche-di-pesca" },
      { keyword: "traina costiera primaverile dentice", category: "tecniche-di-pesca" },
      { keyword: "pesca al sarago fasciato primavera", category: "tecniche-di-pesca" },
      { keyword: "come pescare le lecce stella primavera", category: "tecniche-di-pesca" },
      { keyword: "bolognese primaverile sparidi", category: "tecniche-di-pesca" },
      { keyword: "eging seppie grandi primavera", category: "tecniche-di-pesca" },
      { keyword: "pesca a fondo primavera dalla spiaggia", category: "tecniche-di-pesca" },
      { keyword: "migliori spot pesca primaverile", category: "consigli" },
      { keyword: "attrezzatura light spinning primavera", category: "attrezzature" },
      { keyword: "pesca al barracuda mediterraneo primavera", category: "tecniche-di-pesca" },
      { keyword: "pastura per orate primavera ricetta", category: "consigli" },
      { keyword: "pesca alle aguglie primavera", category: "tecniche-di-pesca" },
      { keyword: "montatura scorrevole primavera orate", category: "attrezzature" },
      { keyword: "come pescare i saraghi a primavera", category: "tecniche-di-pesca" },
      { keyword: "pesca al sugarello primavera", category: "tecniche-di-pesca" },
      { keyword: "artificiali top water primavera", category: "attrezzature" },
      { keyword: "pesca alla trota lago primavera", category: "tecniche-di-pesca" },
      { keyword: "terminali light rock fishing", category: "attrezzature" },
      { keyword: "innesco americano primavera surfcasting", category: "consigli" },
      { keyword: "pesca notturna primavera spigola", category: "tecniche-di-pesca" }
    ],
    // Estate (Giu, Lug, Ago)
    summer: [
      { keyword: "pesca estiva orari migliori e tecniche", category: "consigli" },
      { keyword: "spinning alla lampuga in estate tecniche", category: "tecniche-di-pesca" },
      { keyword: "pesca al serra tecniche e artificiali", category: "tecniche-di-pesca" },
      { keyword: "traina alla ricciola estate mediterraneo", category: "tecniche-di-pesca" },
      { keyword: "pesca notturna estate consigli sicurezza", category: "consigli" },
      { keyword: "migliori popper per spinning estate", category: "attrezzature" },
      { keyword: "vertical jigging estate ricciola e dentice", category: "tecniche-di-pesca" },
      { keyword: "pesca al tonno alletterato estate", category: "tecniche-di-pesca" },
      { keyword: "come pescare la palamita in estate", category: "tecniche-di-pesca" },
      { keyword: "pesca al leccia amia estate", category: "tecniche-di-pesca" },
      { keyword: "shore jigging estate tecniche", category: "tecniche-di-pesca" },
      { keyword: "pesca dalla barca estate consigli", category: "consigli" },
      { keyword: "migliori ore pesca estiva mare", category: "consigli" },
      { keyword: "pesca al pesce pappagallo estate", category: "tecniche-di-pesca" },
      { keyword: "artificiali metallici estate quali usare", category: "attrezzature" },
      { keyword: "pesca al tombarello tecniche", category: "tecniche-di-pesca" },
      { keyword: "come affrontare il caldo in pesca", category: "consigli" },
      { keyword: "pesca al calamaro estate notte", category: "tecniche-di-pesca" },
      { keyword: "traina col vivo estate ricciole", category: "tecniche-di-pesca" },
      { keyword: "pesca al bonito tecniche e attrezzatura", category: "tecniche-di-pesca" },
      { keyword: "snorkeling fishing estate", category: "tecniche-di-pesca" },
      { keyword: "pesca alle occhiate estate bolognese", category: "tecniche-di-pesca" },
      { keyword: "artificiali per serra estate", category: "attrezzature" },
      { keyword: "pesca alba estate migliori spot", category: "consigli" },
      { keyword: "attrezzatura pesca estate cosa portare", category: "attrezzature" }
    ],
    // Autunno (Set, Ott, Nov)
    autumn: [
      { keyword: "pesca autunnale specie e tecniche migliori", category: "tecniche-di-pesca" },
      { keyword: "surfcasting autunno spigola e orata", category: "tecniche-di-pesca" },
      { keyword: "eging autunnale seppie e calamari", category: "tecniche-di-pesca" },
      { keyword: "migliori esche autunno surfcasting", category: "attrezzature" },
      { keyword: "pesca alla spigola autunno artificiali", category: "tecniche-di-pesca" },
      { keyword: "spinning autunnale dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "pesca al dentice autunno bolentino", category: "tecniche-di-pesca" },
      { keyword: "come pescare le orate in autunno", category: "tecniche-di-pesca" },
      { keyword: "pesca al calamaro autunno tecniche", category: "tecniche-di-pesca" },
      { keyword: "migliori artificiali autunno spinning", category: "attrezzature" },
      { keyword: "pesca al sarago autunno scogliera", category: "tecniche-di-pesca" },
      { keyword: "esche arenicola autunno surfcasting", category: "consigli" },
      { keyword: "pesca alla seppia autunno da riva", category: "tecniche-di-pesca" },
      { keyword: "bolognese autunnale porto e scogliera", category: "tecniche-di-pesca" },
      { keyword: "montature autunno pesca fondo", category: "attrezzature" },
      { keyword: "pesca al luccio autunno lago", category: "tecniche-di-pesca" },
      { keyword: "condizioni meteo pesca autunnale", category: "consigli" },
      { keyword: "pesca notturna autunno calamari", category: "tecniche-di-pesca" },
      { keyword: "come pescare con vento forte", category: "consigli" },
      { keyword: "pesca alla trota torrente autunno", category: "tecniche-di-pesca" },
      { keyword: "artificiali sinking autunno", category: "attrezzature" },
      { keyword: "pesca al cefalo autunno tecniche", category: "tecniche-di-pesca" },
      { keyword: "totanare fosforescenti autunno", category: "attrezzature" },
      { keyword: "pesca al black bass autunno", category: "tecniche-di-pesca" },
      { keyword: "orari migliori pesca autunnale mare", category: "consigli" }
    ]
  };
  
  // Determina la stagione
  let season;
  if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 7) season = 'summer';
  else if (month >= 8 && month <= 10) season = 'autumn';
  else season = 'winter';
  
  console.log(`📅 Stagione corrente: ${season}`);
  
  return { keywords: seasonalKeywords[season], season };
}

// ===== KEYWORD EVERGREEN ESTESE =====
const EVERGREEN_KEYWORDS = [
  { keyword: "come scegliere la canna da pesca guida completa", category: "attrezzature" },
  { keyword: "migliori mulinelli da spinning guida acquisto", category: "attrezzature" },
  { keyword: "nodi da pesca essenziali tutorial illustrato", category: "consigli" },
  { keyword: "licenza pesca in mare come ottenerla Italia", category: "consigli" },
  { keyword: "montatura surfcasting classica come fare", category: "tecniche-di-pesca" },
  { keyword: "montatura bolognese scorrevole tutorial", category: "tecniche-di-pesca" },
  { keyword: "come conservare le esche vive correttamente", category: "consigli" },
  { keyword: "pesca dalla scogliera tecniche base principianti", category: "tecniche-di-pesca" },
  { keyword: "come leggere il mare per pescare meglio", category: "consigli" },
  { keyword: "attrezzatura pesca per principianti cosa comprare", category: "attrezzature" },
  { keyword: "differenza trecciato e nylon quando usarli", category: "consigli" },
  { keyword: "come regolare la frizione del mulinello", category: "consigli" },
  { keyword: "manutenzione canna da pesca consigli", category: "consigli" },
  { keyword: "errori comuni pesca principianti evitare", category: "consigli" },
  { keyword: "come scegliere gli ami da pesca", category: "attrezzature" },
  { keyword: "pesca catch and release come fare", category: "consigli" },
  { keyword: "come fotografare le catture pesca", category: "consigli" },
  { keyword: "sicurezza pesca dalla scogliera", category: "consigli" },
  { keyword: "come pulire e sfilettare il pesce", category: "consigli" },
  { keyword: "regolamento pesca sportiva Italia 2024", category: "consigli" },
  { keyword: "migliori app per pescatori smartphone", category: "consigli" },
  { keyword: "come scegliere il fluorocarbon giusto", category: "attrezzature" },
  { keyword: "guida girelle e moschettoni pesca", category: "attrezzature" },
  { keyword: "pasturazione mare tecniche e ricette", category: "consigli" },
  { keyword: "come interpretare le fasi lunari pesca", category: "consigli" },
  { keyword: "migliori marche attrezzatura pesca", category: "attrezzature" },
  { keyword: "pesca in kayak guida completa", category: "tecniche-di-pesca" },
  { keyword: "come scegliere la barca per pesca", category: "consigli" },
  { keyword: "elettronica pesca ecoscandaglio guida", category: "attrezzature" },
  { keyword: "abbigliamento tecnico pesca cosa scegliere", category: "attrezzature" }
];

// ===== FUNZIONE PRINCIPALE =====
async function generateWeeklyBatch(options = {}) {
  const {
    count = CONFIG.defaultArticleCount,
    keywordsFile = null,
    dryRun = false,
    skipDuplicateCheck = CONFIG.skipDuplicateCheck
  } = options;
  
  console.log('\n' + '🗓️'.repeat(30));
  console.log('GENERAZIONE BATCH SETTIMANALE');
  console.log('🗓️'.repeat(30) + '\n');
  
  const startTime = Date.now();
  const log = {
    startedAt: new Date().toISOString(),
    options,
    duplicateCheck: null,
    results: []
  };
  
  // 1. Determina le keyword da usare
  let allKeywords;
  
  if (keywordsFile) {
    // Carica da file
    const filePath = path.join(__dirname, '..', 'data', keywordsFile);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      allKeywords = data.keywords || data;
      console.log(`📂 Keyword caricate da: ${keywordsFile}`);
    } else {
      console.error(`❌ File non trovato: ${filePath}`);
      return;
    }
  } else {
    // Mix di keyword stagionali + evergreen (POOL GRANDE)
    const { keywords: seasonal } = getSeasonalKeywords();
    allKeywords = [...seasonal, ...EVERGREEN_KEYWORDS];
    console.log('🎲 Keyword pool automatico (stagionali + evergreen)');
    console.log(`   Pool totale: ${allKeywords.length} keyword disponibili`);
  }

  // Shuffle tutto il pool
  allKeywords = shuffleArray(allKeywords);
  
  // 2. Trova keyword non duplicate (con retry)
  let safeKeywords = [];
  let checkedCount = 0;
  let skippedKeywords = [];
  
  if (!skipDuplicateCheck && !dryRun) {
    console.log('\n' + '🔍'.repeat(20));
    console.log('FASE 1: RICERCA KEYWORD NON DUPLICATE');
    console.log('🔍'.repeat(20) + '\n');
    console.log(`Obiettivo: trovare ${count} keyword uniche\n`);
    
    for (const kw of allKeywords) {
      // Stop se abbiamo abbastanza keyword
      if (safeKeywords.length >= count) break;
      
      // Limita il numero di check per evitare rate limit
      if (checkedCount >= count * 3) {
        console.log(`⚠️ Raggiunti ${checkedCount} check, uso keyword rimanenti senza check`);
        break;
      }
      
      checkedCount++;
      console.log(`[${checkedCount}] Verifico: "${kw.keyword.substring(0, 50)}..."`);
      
      try {
        const analysis = await checkSemanticDuplicate(kw.keyword, { verbose: false });
        
        // SOLO skip se similarità >= 90% (duplicato quasi identico)
        // Altrimenti procedi anche con sovrapposizioni parziali
        const isRealDuplicate = analysis.isDuplicate && analysis.maxSimilarity >= 90;
        
        if (isRealDuplicate) {
          console.log(`   🔴 SKIP - Duplicato (${analysis.maxSimilarity}%): "${analysis.mostSimilarArticle?.title?.substring(0, 40)}..."`);
          skippedKeywords.push({ ...kw, similarTo: analysis.mostSimilarArticle?.title });
        } else if (analysis.maxSimilarity >= 70) {
          console.log(`   🟡 OK (${analysis.maxSimilarity}% correlato ma diverso)`);
          safeKeywords.push(kw);
        } else {
          console.log(`   ✅ OK - Unica! (${analysis.maxSimilarity}% max)`);
          safeKeywords.push(kw);
        }
        
        // Pausa tra check per rate limit
        await new Promise(r => setTimeout(r, CONFIG.pauseBetweenDuplicateChecks));
        
      } catch (error) {
        // In caso di errore (es: rate limit), aggiungi comunque la keyword
        console.log(`   ⚠️ Errore check: ${error.message.substring(0, 50)} - Aggiungo comunque`);
        safeKeywords.push(kw);
      }
    }
    
    // Se ancora non abbiamo abbastanza, prendi dal pool senza check
    if (safeKeywords.length < count) {
      const remaining = allKeywords
        .filter(kw => !safeKeywords.find(s => s.keyword === kw.keyword))
        .filter(kw => !skippedKeywords.find(s => s.keyword === kw.keyword))
        .slice(0, count - safeKeywords.length);
      
      console.log(`\n📥 Aggiungo ${remaining.length} keyword extra senza check duplicati`);
      safeKeywords.push(...remaining);
    }
    
    log.duplicateCheck = {
      totalChecked: checkedCount,
      safe: safeKeywords.length,
      skipped: skippedKeywords.length
    };
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RISULTATO RICERCA KEYWORD');
    console.log('='.repeat(50));
    console.log(`✅ Keyword pronte: ${safeKeywords.length}`);
    console.log(`🔴 Keyword saltate: ${skippedKeywords.length}`);
    console.log('='.repeat(50) + '\n');
    
  } else {
    // Skip check, prendi le prime N keyword
    safeKeywords = allKeywords.slice(0, count);
    if (skipDuplicateCheck) {
      console.log('\n⏭️ Check duplicati saltato\n');
    }
  }
  
  // Mostra keyword selezionate
  console.log(`📝 Keyword da generare (${safeKeywords.length}):`);
  safeKeywords.forEach((k, i) => {
    console.log(`   ${i + 1}. "${k.keyword.substring(0, 60)}..." [${k.category}]`);
  });
  
  if (dryRun) {
    console.log('\n⚠️ DRY RUN - Nessun articolo verrà creato\n');
    return { keywords: safeKeywords, log };
  }
  
  if (safeKeywords.length === 0) {
    console.log('\n⚠️ Nessuna keyword disponibile! Pool esaurito.\n');
    return log;
  }
  
  console.log('\n' + '📝'.repeat(20));
  console.log('FASE 2: GENERAZIONE ARTICOLI');
  console.log('📝'.repeat(20) + '\n');
  
  // 3. Genera articoli
  for (let i = 0; i < safeKeywords.length; i++) {
    const { keyword, category } = safeKeywords[i];
    const articleNum = i + 1;
    
    console.log(`\n[${articleNum}/${safeKeywords.length}] Generazione: "${keyword.substring(0, 50)}..."`);
    console.log('-'.repeat(50));
    
    try {
      // Salta il check duplicati nella generazione (già fatto sopra)
      const result = await generateArticle(keyword, category, { skipDuplicateCheck: true });
      
      if (result?.skipped) {
        log.results.push({
          keyword,
          category,
          success: false,
          skipped: true,
          reason: result.reason,
          generatedAt: new Date().toISOString()
        });
      } else {
        log.results.push({
          keyword,
          category,
          success: true,
          articleId: result._id,
          slug: result.slug?.current,
          hasImage: result.hasImage,
          generatedAt: new Date().toISOString()
        });
      }
      
    } catch (error) {
      console.error(`❌ Errore: ${error.message}`);
      log.results.push({
        keyword,
        category,
        success: false,
        error: error.message,
        generatedAt: new Date().toISOString()
      });
    }
    
    // Pausa tra articoli (tranne l'ultimo)
    if (i < safeKeywords.length - 1) {
      console.log(`\n⏳ Pausa ${CONFIG.pauseBetweenArticles / 1000}s per rate limiting...`);
      await new Promise(r => setTimeout(r, CONFIG.pauseBetweenArticles));
    }
  }
  
  // 4. Report finale
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const successful = log.results.filter(r => r.success).length;
  const withImages = log.results.filter(r => r.success && r.hasImage).length;
  const failed = log.results.filter(r => !r.success).length;
  
  log.completedAt = new Date().toISOString();
  log.summary = {
    requested: count,
    successful,
    withImages,
    failed,
    durationMinutes: parseFloat(elapsed)
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 REPORT FINALE');
  console.log('='.repeat(60));
  console.log(`✅ Successi: ${successful}`);
  console.log(`📸 Con immagine: ${withImages}`);
  console.log(`❌ Errori: ${failed}`);
  console.log(`⏱️ Durata: ${elapsed} minuti`);
  
  if (successful > 0) {
    console.log('\nArticoli creati:');
    log.results.filter(r => r.success).forEach(r => {
      const imgIcon = r.hasImage ? '📸' : '📝';
      console.log(`  ${imgIcon} "${r.keyword.substring(0, 45)}..."`);
      console.log(`     -> ${r.slug}`);
    });
  }
  
  if (failed > 0) {
    console.log('\nArticoli falliti:');
    log.results.filter(r => !r.success).forEach(r => {
      console.log(`  ❌ "${r.keyword.substring(0, 40)}...": ${r.error?.substring(0, 50) || r.reason}`);
    });
  }
  console.log('='.repeat(60) + '\n');
  
  // 5. Salva log
  saveLog(log);
  
  return log;
}

// ===== HELPER FUNCTIONS =====

function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function saveLog(log) {
  try {
    // Crea directory se non esiste
    const logDir = path.dirname(CONFIG.logFile);
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir, { recursive: true });
    }
    
    // Carica log esistenti
    let logs = [];
    if (fs.existsSync(CONFIG.logFile)) {
      logs = JSON.parse(fs.readFileSync(CONFIG.logFile, 'utf-8'));
    }
    
    // Aggiungi nuovo log
    logs.push(log);
    
    // Mantieni solo gli ultimi 50 log
    if (logs.length > 50) {
      logs = logs.slice(-50);
    }
    
    fs.writeFileSync(CONFIG.logFile, JSON.stringify(logs, null, 2), 'utf-8');
    console.log(`💾 Log salvato in: ${CONFIG.logFile}`);
  } catch (error) {
    console.warn('⚠️ Impossibile salvare log:', error.message);
  }
}

// ===== FUNZIONE PER CREARE FILE KEYWORD PERSONALIZZATO =====
export async function createKeywordsFile(keywords, filename = 'custom-keywords.json') {
  const filePath = path.join(__dirname, '..', 'data', filename);
  const data = {
    createdAt: new Date().toISOString(),
    description: 'Keyword personalizzate per generazione batch',
    keywords
  };
  
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`✅ File keyword creato: ${filename}`);
  return filePath;
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  const options = {
    count: CONFIG.defaultArticleCount,
    keywordsFile: null,
    dryRun: false,
    skipDuplicateCheck: false
  };
  
  // Parse argomenti
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      options.count = parseInt(args[i + 1]);
      i++;
    } else if (args[i] === '--file' && args[i + 1]) {
      options.keywordsFile = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--skip-check') {
      options.skipDuplicateCheck = true;
    } else if (args[i] === '--help') {
      console.log(`
🗓️ FishandTips Weekly Batch Generator
======================================

Genera automaticamente un batch di articoli per la settimana.
Include sistema ANTI-DUPLICATI con retry automatico.

Uso:
  node scripts/generate-weekly-batch.js [opzioni]

Opzioni:
  --count <n>        Numero di articoli da generare (default: 3)
  --file <nome.json> Usa file keyword personalizzato dalla cartella data/
  --dry-run          Mostra keyword senza generare articoli
  --skip-check       Salta il check dei duplicati semantici
  --help             Mostra questo messaggio

Esempi:
  node scripts/generate-weekly-batch.js
  node scripts/generate-weekly-batch.js --count 5
  node scripts/generate-weekly-batch.js --file keywords-custom.json
  node scripts/generate-weekly-batch.js --count 10 --dry-run
  node scripts/generate-weekly-batch.js --count 5 --skip-check

Sistema Anti-Duplicati:
  Cerca automaticamente keyword uniche dal pool di 55+ keyword.
  Se trova duplicati, prova altre keyword fino a trovarne abbastanza.
  Le immagini vengono cercate automaticamente su Unsplash.
`);
      return;
    }
  }
  
  try {
    await generateWeeklyBatch(options);
  } catch (error) {
    console.error('\n❌ ERRORE FATALE:', error.message);
    process.exit(1);
  }
}

main();
