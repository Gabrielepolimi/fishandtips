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
import { execFile } from 'child_process';
import { promisify } from 'util';
import { checkSemanticDuplicate } from './semantic-duplicate-checker.js';
import { getUnusedApprovedTopics, getUnusedTopicsByPriority, markTopicAsUsed } from './sanity-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIGURAZIONE =====
const CONFIG = {
  defaultArticleCount: 3,
  pauseBetweenArticles: 20000, // 20 secondi (evita rate limit 429)
  pauseBetweenDuplicateChecks: 8000, // 8 secondi tra check duplicati
  logFile: path.join(__dirname, '..', 'data', 'generation-log.json'),
  skipDuplicateCheck: false, // Se true, salta il pre-check dei duplicati
  maxRetryAttempts: 3 // Quante volte provare a trovare keyword non duplicate
};

const execFileAsync = promisify(execFile);

// ===== KEYWORD POOL ESTESO PER STAGIONE (no attrezzatura generica) =====
function getSeasonalKeywords() {
  const month = new Date().getMonth();
  
  const seasonalKeywords = {
    winter: [
      { keyword: "pesca alla spigola in inverno tecniche e consigli", category: "tecniche-di-pesca" },
      { keyword: "pesca al calamaro di notte consigli esperti", category: "tecniche-di-pesca" },
      { keyword: "pesca alla seppia da riva in inverno", category: "tecniche-di-pesca" },
      { keyword: "come pescare le mormore in inverno", category: "tecniche-di-pesca" },
      { keyword: "pesca al sarago in inverno dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "eging invernale seppie tecniche avanzate", category: "tecniche-di-pesca" },
      { keyword: "pesca notturna invernale cosa sapere", category: "consigli" },
      { keyword: "come trovare le orate in inverno", category: "consigli" },
      { keyword: "bolognese invernale in porto", category: "tecniche-di-pesca" },
      { keyword: "pesca alle occhiate inverno mediterraneo", category: "tecniche-di-pesca" },
      { keyword: "spinning invernale dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "pesca ai polpi in inverno", category: "tecniche-di-pesca" },
      { keyword: "condizioni meteo ideali pesca invernale", category: "consigli" },
      { keyword: "rock fishing invernale tecniche", category: "tecniche-di-pesca" },
      { keyword: "pesca al cefalo inverno tecniche", category: "tecniche-di-pesca" },
      { keyword: "orari migliori pesca invernale mare", category: "consigli" },
      { keyword: "licenza pesca rinnovo invernale consigli", category: "consigli" },
      { keyword: "limiti cattura spigola inverno regole", category: "consigli" },
      { keyword: "esche vive inverno come conservarle", category: "consigli" },
      { keyword: "surfcasting invernale come pescare col freddo", category: "consigli" }
    ],
    spring: [
      { keyword: "pesca primaverile tecniche e specie target", category: "tecniche-di-pesca" },
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
      { keyword: "pesca al barracuda mediterraneo primavera", category: "tecniche-di-pesca" },
      { keyword: "pastura per orate primavera ricetta", category: "consigli" },
      { keyword: "pesca alle aguglie primavera", category: "tecniche-di-pesca" },
      { keyword: "come pescare i saraghi a primavera", category: "tecniche-di-pesca" },
      { keyword: "pesca al sugarello primavera", category: "tecniche-di-pesca" },
      { keyword: "pesca alla trota lago primavera", category: "tecniche-di-pesca" },
      { keyword: "pesca notturna primavera spigola", category: "tecniche-di-pesca" },
      { keyword: "regole pesca in fiume primavera Italia", category: "consigli" }
    ],
    summer: [
      { keyword: "pesca estiva orari migliori e tecniche", category: "consigli" },
      { keyword: "spinning alla lampuga in estate tecniche", category: "tecniche-di-pesca" },
      { keyword: "pesca al serra tecniche dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "traina alla ricciola estate mediterraneo", category: "tecniche-di-pesca" },
      { keyword: "pesca notturna estate consigli sicurezza", category: "consigli" },
      { keyword: "vertical jigging estate ricciola e dentice", category: "tecniche-di-pesca" },
      { keyword: "pesca al tonno alletterato estate", category: "tecniche-di-pesca" },
      { keyword: "come pescare la palamita in estate", category: "tecniche-di-pesca" },
      { keyword: "pesca al leccia amia estate", category: "tecniche-di-pesca" },
      { keyword: "shore jigging estate tecniche", category: "tecniche-di-pesca" },
      { keyword: "pesca dalla barca estate consigli", category: "consigli" },
      { keyword: "migliori ore pesca estiva mare", category: "consigli" },
      { keyword: "pesca al tombarello tecniche", category: "tecniche-di-pesca" },
      { keyword: "pesca al calamaro estate notte", category: "tecniche-di-pesca" },
      { keyword: "traina col vivo estate ricciole", category: "tecniche-di-pesca" },
      { keyword: "pesca alle occhiate estate bolognese", category: "tecniche-di-pesca" },
      { keyword: "pesca alba estate migliori spot", category: "consigli" },
      { keyword: "fermo pesca estate regole pescatori sportivi", category: "consigli" },
      { keyword: "pesca in spiaggia estate è vietata", category: "consigli" },
      { keyword: "limiti cattura tonno rosso estate Italia", category: "consigli" }
    ],
    autumn: [
      { keyword: "pesca autunnale specie e tecniche migliori", category: "tecniche-di-pesca" },
      { keyword: "surfcasting autunno spigola e orata", category: "tecniche-di-pesca" },
      { keyword: "eging autunnale seppie e calamari", category: "tecniche-di-pesca" },
      { keyword: "pesca alla spigola autunno dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "spinning autunnale dalla scogliera", category: "tecniche-di-pesca" },
      { keyword: "pesca al dentice autunno bolentino", category: "tecniche-di-pesca" },
      { keyword: "come pescare le orate in autunno", category: "tecniche-di-pesca" },
      { keyword: "pesca al calamaro autunno tecniche", category: "tecniche-di-pesca" },
      { keyword: "pesca al sarago autunno scogliera", category: "tecniche-di-pesca" },
      { keyword: "esche arenicola autunno surfcasting", category: "consigli" },
      { keyword: "pesca alla seppia autunno da riva", category: "tecniche-di-pesca" },
      { keyword: "bolognese autunnale porto e scogliera", category: "tecniche-di-pesca" },
      { keyword: "pesca al luccio autunno lago", category: "tecniche-di-pesca" },
      { keyword: "condizioni meteo pesca autunnale", category: "consigli" },
      { keyword: "pesca notturna autunno calamari", category: "tecniche-di-pesca" },
      { keyword: "come pescare con vento forte", category: "consigli" },
      { keyword: "pesca alla trota torrente autunno", category: "tecniche-di-pesca" },
      { keyword: "pesca al cefalo autunno tecniche", category: "tecniche-di-pesca" },
      { keyword: "pesca al black bass autunno", category: "tecniche-di-pesca" },
      { keyword: "orari migliori pesca autunnale mare", category: "consigli" }
    ]
  };
  
  let season;
  if (month >= 2 && month <= 4) season = 'spring';
  else if (month >= 5 && month <= 7) season = 'summer';
  else if (month >= 8 && month <= 10) season = 'autumn';
  else season = 'winter';
  
  console.log(`📅 Stagione corrente: ${season}`);
  
  return { keywords: seasonalKeywords[season], season };
}

// ===== KEYWORD EVERGREEN (normative, regole, domande — no attrezzatura generica) =====
const EVERGREEN_KEYWORDS = [
  { keyword: "licenza pesca in mare come ottenerla Italia 2026", category: "consigli" },
  { keyword: "quanto pesce si può pescare al giorno in mare Italia", category: "consigli" },
  { keyword: "taglia minima pesci Italia tabella aggiornata", category: "consigli" },
  { keyword: "pesca notturna dal porto è legale in Italia", category: "consigli" },
  { keyword: "pesca subacquea regole e licenze Italia", category: "consigli" },
  { keyword: "serve patentino per pescare in fiume Italia", category: "consigli" },
  { keyword: "pesca in area marina protetta regole e permessi", category: "consigli" },
  { keyword: "nodi da pesca essenziali tutorial illustrato", category: "consigli" },
  { keyword: "montatura surfcasting classica come fare", category: "tecniche-di-pesca" },
  { keyword: "montatura bolognese scorrevole tutorial", category: "tecniche-di-pesca" },
  { keyword: "come conservare le esche vive correttamente", category: "consigli" },
  { keyword: "pesca dalla scogliera tecniche base principianti", category: "tecniche-di-pesca" },
  { keyword: "come leggere il mare per pescare meglio", category: "consigli" },
  { keyword: "errori comuni pesca principianti evitare", category: "consigli" },
  { keyword: "pesca catch and release come fare Italia", category: "consigli" },
  { keyword: "sicurezza pesca dalla scogliera", category: "consigli" },
  { keyword: "regolamento pesca sportiva Italia 2026", category: "consigli" },
  { keyword: "pasturazione mare tecniche e ricette", category: "consigli" },
  { keyword: "come interpretare le fasi lunari pesca", category: "consigli" },
  { keyword: "pesca in kayak serve patente nautica", category: "consigli" }
];

// ===== SCHEDULING PRIORITÀ =====
// P1 = 1 articolo ogni 3 giorni, P2 = 1 ogni 2 giorni, P3 = 1 al giorno
function getPrioritySchedule() {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const schedule = { 3: 1 }; // P3 sempre 1 al giorno
  if (dayOfYear % 2 === 0) schedule[2] = 1;
  if (dayOfYear % 3 === 0) schedule[1] = 1;
  const total = Object.values(schedule).reduce((a, b) => a + b, 0);
  console.log(`📅 Giorno dell'anno: ${dayOfYear}`);
  console.log(`📋 Schedule priorità: P1=${schedule[1] || 0}, P2=${schedule[2] || 0}, P3=${schedule[3] || 0} (totale: ${total})`);
  return schedule;
}

// ===== FUNZIONE PRINCIPALE =====
async function generateWeeklyBatch(options = {}) {
  const {
    count = CONFIG.defaultArticleCount,
    keywordsFile = null,
    dryRun = false,
    skipDuplicateCheck = CONFIG.skipDuplicateCheck
  } = options;
  
  console.log('\n' + '🗓️'.repeat(30));
  console.log('GENERAZIONE BATCH GIORNALIERA');
  console.log('🗓️'.repeat(30) + '\n');
  
  const startTime = Date.now();
  const log = {
    startedAt: new Date().toISOString(),
    options,
    duplicateCheck: null,
    results: []
  };
  
  const useTopicQueue = options.useTopicQueue !== false;
  const usePrioritySchedule = options.usePrioritySchedule !== false;
  let allKeywords;
  let safeKeywords = [];
  let checkedCount = 0;
  let skippedKeywords = [];
  let sourceIsTopicQueue = false;

  if (keywordsFile) {
    const filePath = path.join(__dirname, '..', 'data', keywordsFile);
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      allKeywords = data.keywords || data;
      console.log(`📂 Keyword da file: ${keywordsFile}\n`);
    } else {
      console.error(`❌ File non trovato: ${filePath}`);
      return log;
    }
    allKeywords = shuffleArray(allKeywords);
  } else if (useTopicQueue) {
    sourceIsTopicQueue = true;

    if (usePrioritySchedule) {
      console.log('📋 Modalità PRIORITY SCHEDULE: topic approvati per priorità da Sanity\n');
      const schedule = getPrioritySchedule();

      for (const [priority, needed] of Object.entries(schedule)) {
        const pTopics = await getUnusedTopicsByPriority(Number(priority), needed);
        const mapped = pTopics
          .filter((t) => t.title && !String(t.title).trim().startsWith('-'))
          .slice(0, needed)
          .map((t) => ({
            keyword: t.title.trim(),
            category: t.categorySlug || 'consigli',
            topicId: t._id,
            priority: Number(priority)
          }));
        safeKeywords.push(...mapped);
        console.log(`   P${priority}: ${mapped.length}/${needed} topic trovati`);
      }

      if (safeKeywords.length === 0) {
        console.log('\n🛑 Topic queue vuota per tutte le priorità.');
        console.log('   Aggiungi nuovi topic approvati in Sanity (tipo approvedTopic).');
        return log;
      }
      console.log(`\n   Totale topic selezionati: ${safeKeywords.length}`);
    } else {
      console.log('📋 Modalità TOPIC QUEUE (FIFO): uso solo topic approvati da Sanity\n');
      const topics = await getUnusedApprovedTopics(count);
      safeKeywords = topics
        .slice(0, count)
        .filter((t) => t.title && !String(t.title).trim().startsWith('-'))
        .map((t) => ({
          keyword: t.title.trim(),
          category: t.categorySlug || 'consigli',
          topicId: t._id,
          priority: t.priority || 3
        }));
      if (safeKeywords.length === 0) {
        console.log('🛑 Topic queue vuota. Aggiungi nuovi topic approvati in Sanity (tipo approvedTopic).');
        return log;
      } else {
        console.log(`   Topic disponibili: ${topics.length}, ne uso ${safeKeywords.length}`);
      }
    }
  } else {
    const { keywords: seasonal } = getSeasonalKeywords();
    allKeywords = [...seasonal, ...EVERGREEN_KEYWORDS];
    console.log('🎲 Modalità POOL (--use-pool): stagionali + evergreen');
    console.log(`   Pool totale: ${allKeywords.length} keyword\n`);
    allKeywords = shuffleArray(allKeywords);
  }

  // 2. Trova keyword non duplicate (solo se pool/file, non topic queue, e check abilitato): rispetta le raccomandazioni del checker
  if (!sourceIsTopicQueue && allKeywords && !skipDuplicateCheck && !dryRun) {
    console.log('\n' + '🔍'.repeat(20));
    console.log('FASE 1: RICERCA KEYWORD NON DUPLICATE');
    console.log('🔍'.repeat(20) + '\n');
    console.log(`Obiettivo: trovare ${count} keyword (skip/modify_angle/error rispettati)\n`);
    
    for (const kw of allKeywords) {
      if (safeKeywords.length >= count) break;
      if (checkedCount >= Math.max(count * 5, 20)) break;

      checkedCount++;
      console.log(`[${checkedCount}] Verifico: "${kw.keyword.substring(0, 50)}..."`);

      try {
        const analysis = await checkSemanticDuplicate(kw.keyword, { verbose: false });

        if (analysis.recommendation === 'error') {
          console.log(`   ❌ ERRORE check - Non procedo (${analysis.error?.substring(0, 40) || 'unknown'}...)`);
          skippedKeywords.push({ ...kw, reason: 'check_error', error: analysis.error });
        } else if (analysis.recommendation === 'skip' || analysis.isDuplicate) {
          console.log(`   🔴 SKIP - Duplicato (${analysis.maxSimilarity}%): "${analysis.mostSimilarArticle?.title?.substring(0, 40)}..."`);
          skippedKeywords.push({ ...kw, similarTo: analysis.mostSimilarArticle?.title });
        } else {
          // proceed o modify_angle: aggiungi; il generatore inietterà suggestedAngle se modify_angle
          const label = analysis.recommendation === 'modify_angle' ? 'MODIFY_ANGLE' : 'OK';
          console.log(`   ✅ ${label} (${analysis.maxSimilarity}%) - procedo`);
          safeKeywords.push(kw);
        }

        await new Promise(r => setTimeout(r, CONFIG.pauseBetweenDuplicateChecks));
      } catch (error) {
        console.log(`   ❌ Errore check: ${error.message.substring(0, 50)} - Non aggiungo`);
        skippedKeywords.push({ ...kw, reason: 'check_error', error: error.message });
      }
    }

    // Nessun riempimento dal pool senza check: se non bastano, generiamo meno articoli
    if (safeKeywords.length < count) {
      console.log(`\n⚠️ Keyword sicure trovate: ${safeKeywords.length}/${count}. Nessun fill senza check.`);
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
    
  } else if (!sourceIsTopicQueue && allKeywords) {
    // Pool/file senza fase check (--skip-check o dry-run): prendi le prime N
    safeKeywords = allKeywords.slice(0, count);
    if (skipDuplicateCheck) {
      console.log('\n⏭️ Check duplicati saltato (--skip-check)\n');
    }
  }

  // Mostra keyword selezionate
  console.log(`📝 Keyword da generare (${safeKeywords.length}):`);
  safeKeywords.forEach((k, i) => {
    const kwShort = (k.keyword || '').substring(0, 60);
    console.log(`   ${i + 1}. "${kwShort}${k.keyword?.length > 60 ? '...' : ''}" [${k.category}]`);
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
      // Topic queue: check nel generatore. Pool/file: già fatto in Fase 1, evita doppia chiamata Gemini.
      const result = await generateArticle(keyword, category, {
        skipDuplicateCheck: !sourceIsTopicQueue
      });
      
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

        // Topic queue: segna il topic come usato
        if (safeKeywords[i].topicId) {
          try {
            await markTopicAsUsed(safeKeywords[i].topicId);
          } catch (err) {
            console.warn('⚠️ Impossibile segnare topic come usato:', err.message);
          }
        }

        // YouTube picker (post-step) se disponibile e se non dry-run
        if (process.env.YOUTUBE_API_KEY) {
          const slug = result.slug?.current;
          if (slug) {
            console.log('🎥 Avvio YouTube picker per', slug);
            try {
              await execFileAsync('node', [path.join(__dirname, 'youtube-video-picker.js'), slug], {
                env: {
                  ...process.env,
                  YOUTUBE_API_KEY: process.env.YOUTUBE_API_KEY,
                  SANITY_API_TOKEN: process.env.SANITY_API_TOKEN,
                  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
                },
              });
              console.log('✅ YouTube picker completato per', slug);
            } catch (err) {
              console.warn('⚠️ YouTube picker fallito per', slug, '-', err.message);
            }
          }
        } else {
          console.log('ℹ️ YOUTUBE_API_KEY mancante: salto video picker');
        }
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
    skipDuplicateCheck: false,
    useTopicQueue: true,
    usePrioritySchedule: true
  };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--count' && args[i + 1]) {
      options.count = parseInt(args[i + 1]);
      options.usePrioritySchedule = false;
      i++;
    } else if (args[i] === '--file' && args[i + 1]) {
      options.keywordsFile = args[i + 1];
      i++;
    } else if (args[i] === '--dry-run') {
      options.dryRun = true;
    } else if (args[i] === '--skip-check') {
      options.skipDuplicateCheck = true;
    } else if (args[i] === '--use-pool') {
      options.useTopicQueue = false;
      options.usePrioritySchedule = false;
    } else if (args[i] === '--use-topic-queue') {
      options.useTopicQueue = true;
    } else if (args[i] === '--no-priority-schedule') {
      options.usePrioritySchedule = false;
    } else if (args[i] === '--help') {
      console.log(`
🗓️ FishandTips Daily Batch Generator
======================================

Genera automaticamente articoli con sistema di PRIORITÀ:
  P1 — Normative/licenze: 1 articolo ogni 3 giorni
  P2 — Specie+mese+regione: 1 articolo ogni 2 giorni
  P3 — Domande ad alto intent: 1 articolo al giorno

Include sistema ANTI-DUPLICATI con retry automatico.

Uso:
  node scripts/generate-weekly-batch.js [opzioni]

Opzioni:
  --count <n>              Genera N articoli (disattiva priority schedule)
  --file <nome.json>       Usa file keyword personalizzato dalla cartella data/
  --use-topic-queue        Usa topic approvati da Sanity (DEFAULT)
  --use-pool               Usa pool stagionale + evergreen (fallback)
  --no-priority-schedule   Disattiva scheduling per priorità, usa FIFO
  --dry-run                Mostra keyword senza generare articoli
  --skip-check             Salta il check duplicati (solo con --use-pool/--file)
  --help                   Mostra questo messaggio

Esempi:
  node scripts/generate-weekly-batch.js                  # Priority schedule (default)
  node scripts/generate-weekly-batch.js --count 5        # 5 articoli FIFO
  node scripts/generate-weekly-batch.js --use-pool       # Pool stagionale
  node scripts/generate-weekly-batch.js --dry-run        # Solo simulazione
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
