/**
 * 🗓️ FishandTips Weekly Batch Generator
 * 
 * Genera batch di articoli settimanali automaticamente
 * Legge keyword da file o le genera automaticamente
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
  skipDuplicateCheck: false // Se true, salta il pre-check dei duplicati
};

// ===== KEYWORD AUTOMATICHE PER STAGIONE =====
function getSeasonalKeywords() {
  const month = new Date().getMonth();
  
  // Keyword stagionali basate sul mese
  const seasonalKeywords = {
    // Inverno (Dic, Gen, Feb)
    winter: [
      { keyword: "pesca alla spigola in inverno tecniche e consigli", category: "tecniche-di-pesca" },
      { keyword: "migliori esche per pesca invernale", category: "attrezzature" },
      { keyword: "surfcasting invernale come pescare col freddo", category: "consigli" },
      { keyword: "pesca al calamaro di notte consigli", category: "tecniche-di-pesca" },
      { keyword: "abbigliamento pesca invernale cosa indossare", category: "attrezzature" },
      { keyword: "pesca alla seppia da riva in inverno", category: "tecniche-di-pesca" },
      { keyword: "migliori totanare per calamaro inverno", category: "attrezzature" }
    ],
    // Primavera (Mar, Apr, Mag)
    spring: [
      { keyword: "pesca primaverile tecniche e specie", category: "tecniche-di-pesca" },
      { keyword: "migliori artificiali per spigola primavera", category: "attrezzature" },
      { keyword: "surfcasting primaverile orata e mormore", category: "tecniche-di-pesca" },
      { keyword: "spinning dalla scogliera in primavera", category: "tecniche-di-pesca" },
      { keyword: "esche naturali primavera quali usare", category: "consigli" },
      { keyword: "pesca alla seppia in primavera", category: "tecniche-di-pesca" },
      { keyword: "traina costiera primaverile dentice", category: "tecniche-di-pesca" }
    ],
    // Estate (Giu, Lug, Ago)
    summer: [
      { keyword: "pesca estiva orari migliori e tecniche", category: "consigli" },
      { keyword: "spinning alla lampuga in estate", category: "tecniche-di-pesca" },
      { keyword: "pesca al serra tecniche e artificiali", category: "tecniche-di-pesca" },
      { keyword: "traina alla ricciola estate mediterraneo", category: "tecniche-di-pesca" },
      { keyword: "pesca notturna estate consigli sicurezza", category: "consigli" },
      { keyword: "migliori popper per spinning estate", category: "attrezzature" },
      { keyword: "vertical jigging estate ricciola e dentice", category: "tecniche-di-pesca" }
    ],
    // Autunno (Set, Ott, Nov)
    autumn: [
      { keyword: "pesca autunnale specie e tecniche migliori", category: "tecniche-di-pesca" },
      { keyword: "surfcasting autunno spigola e orata", category: "tecniche-di-pesca" },
      { keyword: "eging autunnale seppie e calamari", category: "tecniche-di-pesca" },
      { keyword: "migliori esche autunno surfcasting", category: "attrezzature" },
      { keyword: "pesca alla spigola autunno artificiali", category: "tecniche-di-pesca" },
      { keyword: "spinning autunnale dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "pesca al dentice autunno bolentino", category: "tecniche-di-pesca" }
    ]
  };
  
  // Determina la stagione
  let season;
  if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 7) season = 'summer';
  else if (month >= 8 && month <= 10) season = 'autumn';
  else season = 'winter';
  
  console.log(`📅 Stagione corrente: ${season}`);
  
  return seasonalKeywords[season];
}

// ===== KEYWORD EVERGREEN =====
const EVERGREEN_KEYWORDS = [
  { keyword: "come scegliere la canna da pesca guida completa", category: "attrezzature" },
  { keyword: "migliori mulinelli da spinning guida acquisto", category: "attrezzature" },
  { keyword: "nodi da pesca essenziali tutorial", category: "consigli" },
  { keyword: "licenza pesca in mare come ottenerla", category: "consigli" },
  { keyword: "montatura surfcasting classica come fare", category: "tecniche-di-pesca" },
  { keyword: "montatura bolognese scorrevole tutorial", category: "tecniche-di-pesca" },
  { keyword: "come conservare le esche vive", category: "consigli" },
  { keyword: "pesca dalla scogliera tecniche base", category: "tecniche-di-pesca" },
  { keyword: "come leggere il mare per pescare meglio", category: "consigli" },
  { keyword: "attrezzatura pesca per principianti cosa comprare", category: "attrezzature" }
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
  let keywords;
  
  if (keywordsFile) {
    // Carica da file
    const filePath = path.join(__dirname, '..', 'data', keywordsFile);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      keywords = data.keywords || data;
      console.log(`📂 Keyword caricate da: ${keywordsFile}`);
    } else {
      console.error(`❌ File non trovato: ${filePath}`);
      return;
    }
  } else {
    // Mix di keyword stagionali + evergreen
    const seasonal = getSeasonalKeywords();
    const mixed = [...seasonal.slice(0, Math.ceil(count * 0.7)), ...EVERGREEN_KEYWORDS.slice(0, Math.floor(count * 0.3))];
    
    // Shuffle e prendi le prime 'count'
    keywords = shuffleArray(mixed).slice(0, count);
    console.log('🎲 Keyword generate automaticamente (stagionali + evergreen)');
  }
  
  console.log(`\n📝 Keyword candidate: ${keywords.length}`);
  keywords.forEach((k, i) => {
    console.log(`   ${i + 1}. "${k.keyword}" [${k.category}]`);
  });

  // 1.5 PRE-FILTRA KEYWORD PER DUPLICATI (NUOVO!)
  let safeKeywords = keywords;
  
  if (!skipDuplicateCheck && !dryRun) {
    console.log('\n' + '🔍'.repeat(20));
    console.log('FASE 1: PRE-CHECK DUPLICATI SEMANTICI');
    console.log('🔍'.repeat(20) + '\n');
    
    const duplicateResults = {
      safe: [],
      skipped: [],
      modified: []
    };
    
    for (let i = 0; i < keywords.length; i++) {
      const kw = keywords[i];
      console.log(`[${i + 1}/${keywords.length}] Verifico: "${kw.keyword}"`);
      
      try {
        const analysis = await checkSemanticDuplicate(kw.keyword, { verbose: false });
        
        if (analysis.recommendation === 'skip' || analysis.isDuplicate) {
          console.log(`   🔴 SKIP - Duplicato di: "${analysis.mostSimilarArticle?.title}"`);
          duplicateResults.skipped.push({ ...kw, analysis });
        } else if (analysis.recommendation === 'modify_angle') {
          console.log(`   🟡 ATTENZIONE - Sovrapposizione parziale (${analysis.maxSimilarity}%)`);
          console.log(`      Suggerimento: ${analysis.suggestedAngle}`);
          duplicateResults.modified.push({ ...kw, analysis });
          duplicateResults.safe.push(kw); // Procedi comunque ma con attenzione
        } else {
          console.log(`   ✅ OK - Nessun duplicato (${analysis.maxSimilarity}% max)`);
          duplicateResults.safe.push(kw);
        }
        
        // Pausa tra check
        if (i < keywords.length - 1) {
          await new Promise(r => setTimeout(r, CONFIG.pauseBetweenDuplicateChecks));
        }
      } catch (error) {
        console.log(`   ⚠️ Errore check: ${error.message} - Procedo comunque`);
        duplicateResults.safe.push(kw);
      }
    }
    
    safeKeywords = duplicateResults.safe;
    log.duplicateCheck = {
      total: keywords.length,
      safe: duplicateResults.safe.length,
      skipped: duplicateResults.skipped.length,
      modified: duplicateResults.modified.length,
      skippedKeywords: duplicateResults.skipped.map(k => ({
        keyword: k.keyword,
        similarTo: k.analysis?.mostSimilarArticle?.title
      }))
    };
    
    console.log('\n' + '='.repeat(50));
    console.log('📊 RISULTATO PRE-CHECK');
    console.log('='.repeat(50));
    console.log(`✅ Keyword sicure: ${duplicateResults.safe.length}`);
    console.log(`🔴 Keyword saltate (duplicati): ${duplicateResults.skipped.length}`);
    if (duplicateResults.skipped.length > 0) {
      duplicateResults.skipped.forEach(k => {
        console.log(`   - "${k.keyword}" (simile a: "${k.analysis?.mostSimilarArticle?.title}")`);
      });
    }
    console.log('='.repeat(50) + '\n');
    
    if (safeKeywords.length === 0) {
      console.log('⚠️ Nessuna keyword sicura trovata! Tutte sono duplicati.');
      console.log('💡 Suggerimento: genera keyword più specifiche o diverse.\n');
      return log;
    }
  } else if (skipDuplicateCheck) {
    console.log('\n⏭️ Pre-check duplicati saltato (--skip-check)\n');
  }
  
  if (dryRun) {
    console.log('\n⚠️ DRY RUN - Nessun articolo verrà creato\n');
    console.log('Keyword che verrebbero generate:');
    safeKeywords.forEach((k, i) => {
      console.log(`   ${i + 1}. "${k.keyword}" [${k.category}]`);
    });
    return { keywords: safeKeywords, log };
  }
  
  console.log('\n' + '📝'.repeat(20));
  console.log('FASE 2: GENERAZIONE ARTICOLI');
  console.log('📝'.repeat(20) + '\n');
  console.log(`Articoli da generare: ${safeKeywords.length}`);
  
  // 2. Genera articoli (solo keyword sicure)
  for (let i = 0; i < safeKeywords.length; i++) {
    const { keyword, category } = safeKeywords[i];
    const articleNum = i + 1;
    
    console.log(`\n[${articleNum}/${safeKeywords.length}] Generazione: "${keyword}"`);
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
  
  // 3. Report finale
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const successful = log.results.filter(r => r.success).length;
  const failed = log.results.filter(r => !r.success).length;
  
  log.completedAt = new Date().toISOString();
  log.summary = {
    total: keywords.length,
    successful,
    failed,
    durationMinutes: parseFloat(elapsed)
  };
  
  console.log('\n' + '='.repeat(60));
  console.log('📊 REPORT FINALE');
  console.log('='.repeat(60));
  console.log(`✅ Successi: ${successful}`);
  console.log(`❌ Errori: ${failed}`);
  console.log(`⏱️ Durata: ${elapsed} minuti`);
  console.log('\nArticoli creati:');
  log.results.filter(r => r.success).forEach(r => {
    console.log(`  ✅ "${r.keyword}"`);
    console.log(`     -> ${r.slug}`);
  });
  if (failed > 0) {
    console.log('\nArticoli falliti:');
    log.results.filter(r => !r.success).forEach(r => {
      console.log(`  ❌ "${r.keyword}": ${r.error}`);
    });
  }
  console.log('='.repeat(60) + '\n');
  
  // 4. Salva log
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
Include sistema ANTI-DUPLICATI per evitare keyword cannibalization.

Uso:
  node scripts/generate-weekly-batch.js [opzioni]

Opzioni:
  --count <n>        Numero di articoli da generare (default: 3)
  --file <nome.json> Usa file keyword personalizzato dalla cartella data/
  --dry-run          Mostra keyword senza generare articoli
  --skip-check       Salta il pre-check dei duplicati semantici
  --help             Mostra questo messaggio

Esempi:
  node scripts/generate-weekly-batch.js
  node scripts/generate-weekly-batch.js --count 5
  node scripts/generate-weekly-batch.js --file keywords-2024-12-06.json
  node scripts/generate-weekly-batch.js --count 10 --dry-run
  node scripts/generate-weekly-batch.js --count 5 --skip-check

Sistema Anti-Duplicati:
  Prima di generare, verifica ogni keyword per evitare duplicati semantici.
  Le keyword troppo simili ad articoli esistenti vengono automaticamente
  saltate per proteggere la SEO del sito.
  
  Fasi:
  1. PRE-CHECK: Analizza tutte le keyword per duplicati
  2. GENERAZIONE: Crea articoli solo per keyword sicure

Prerequisiti:
  - GEMINI_API_KEY configurata
  - SANITY_API_TOKEN con permessi Editor
  - Almeno un autore creato in Sanity

Le keyword vengono selezionate automaticamente in base alla stagione corrente,
con un mix di argomenti stagionali e evergreen per massimizzare l'engagement.
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

