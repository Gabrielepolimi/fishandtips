/**
 * 🔍 FishandTips - Semantic Duplicate Checker
 * 
 * Analizza semanticamente le keyword per evitare:
 * - Keyword Cannibalization (articoli che competono per le stesse keyword)
 * - Contenuti duplicati (stesso argomento con titoli diversi)
 * - Sprechi di risorse AI
 * 
 * Usa Google Gemini per analisi semantica intelligente
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { getAllArticlesForDuplicateCheck } from './sanity-helpers.js';

// ===== CONFIGURAZIONE =====
const CONFIG = {
  // Soglia per skip (duplicato): >= 75% similarità
  similarityThreshold: 75,
  // Soglia per modify_angle: tra 60% e 75%
  modifyAngleThreshold: 60,
  // Numero massimo di articoli da confrontare con Gemini
  maxArticlesToCompare: 150,
  verbose: true
};

// Stopword italiane complete: articoli, preposizioni, congiunzioni + parole che Gemini usa per far sembrare titoli diversi (stesso articolo)
const STOPWORDS_IT = new Set([
  'di', 'del', 'della', 'dello', 'dei', 'degli', 'delle', 'a', 'al', 'allo', 'ai', 'agli', 'all', 'alla', 'alle',
  'da', 'dal', 'dallo', 'dai', 'dagli', 'dall', 'dalla', 'dalle', 'in', 'con', 'su', 'per', 'tra', 'fra',
  'la', 'il', 'lo', 'le', 'gli', 'i', 'un', 'uno', 'una', 'un\'', 'questo', 'questa', 'questi', 'queste',
  'quello', 'quella', 'quelli', 'quelle', 'come', 'quale', 'quali', 'cosa', 'che', 'cui', 'chi', 'quando',
  'dove', 'perché', 'poiché', 'se', 'ma', 'e', 'ed', 'o', 'oppure', 'né', 'sia', 'che', 'né',
  'guida', 'completa', 'definitiva', 'migliori', 'top', 'perfetta', 'perfetto', 'vincente', 'vincenti',
  'consigli', 'tecnica', 'tecniche', 'pratici', 'pratico', 'tutto', 'tutta', 'tutti', 'tutte', 'altro', 'altra', 'altri', 'altre',
  'pesca', 'pescare' // troppo generici: quasi tutti gli articoli li contengono, evitano falsi positivi su keyword corte
]);

let genAI;
let model;

/**
 * Inizializza il client Gemini
 */
function initGemini() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('❌ GEMINI_API_KEY non configurata!');
  }
  genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

/**
 * Estrae parole significative dalla keyword (rimuove stopword)
 */
function extractKeywords(text) {
  const normalized = (text || '')
    .toLowerCase()
    .replace(/[^\w\sàèéìòùç]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
  return normalized.filter((w) => w.length > 1 && !STOPWORDS_IT.has(w));
}

/**
 * Pre-check deterministico: blocca duplicati ovvi senza chiamare Gemini.
 * Se un articolo esistente contiene 3 su 4 (o 2 su 3) delle parole chiave estratte dalla keyword, è duplicato.
 */
function deterministicDuplicateCheck(newKeyword, existingArticles) {
  const keywords = extractKeywords(newKeyword);
  if (keywords.length < 2) return null;

  const minMatch = keywords.length >= 4 ? 3 : keywords.length >= 3 ? 2 : 2;
  const keywordSet = new Set(keywords);

  for (const article of existingArticles) {
    const titleNorm = (article.title || '')
      .toLowerCase()
      .replace(/[^\w\sàèéìòùç]/g, ' ')
      .split(/\s+/)
      .filter(Boolean);
    const titleSet = new Set(titleNorm);
    let matches = 0;
    for (const kw of keywordSet) {
      if (titleSet.has(kw)) matches++;
    }
    if (matches >= minMatch) {
      return {
        isDuplicate: true,
        maxSimilarity: 95,
        recommendation: 'skip',
        mostSimilarArticle: {
          title: article.title,
          slug: article.slug,
          similarity: 95,
          reason: `Pre-check deterministico: ${matches} parole chiave in comune ("${keywords.slice(0, 4).join('", "')}")`
        },
        analysis: 'Duplicato rilevato dal pre-check (overlap parole chiave). Nessuna chiamata Gemini.',
        deterministic: true
      };
    }
  }
  return null;
}

/**
 * Prompt per l'analisi semantica dei duplicati
 */
const DUPLICATE_CHECK_PROMPT = (newKeyword, existingArticles) => `
Sei un esperto SEO italiano specializzato nella nicchia della pesca sportiva.
Devi analizzare se una NUOVA KEYWORD è semanticamente duplicata rispetto ad articoli esistenti.

=== NUOVA KEYWORD DA ANALIZZARE ===
"${newKeyword}"

=== ARTICOLI ESISTENTI SUL SITO ===
${existingArticles.map((a, i) => `
${i + 1}. Titolo: "${a.title}"
   Slug: ${a.slug}
   Excerpt: ${a.excerpt || 'N/A'}
   Keywords SEO: ${(a.seoKeywords || []).join(', ') || 'N/A'}
`).join('\n')}

=== ANALISI RICHIESTA ===
Per ogni articolo esistente, valuta:
1. TOPIC OVERLAP: La nuova keyword tratta lo stesso argomento principale?
2. SEARCH INTENT: L'utente che cerca la nuova keyword troverebbe soddisfacente l'articolo esistente?
3. KEYWORD CANNIBALIZATION: I due contenuti competerebbero per le stesse query su Google?

=== REGOLE DI DECISIONE ===
- Similarità >= 75%: DUPLICATO → recommendation: "skip"
- Similarità 60-74%: OVERLAP → recommendation: "modify_angle" con angolo alternativo
- Similarità < 60%: PROCEED

REGOLA FONDAMENTALE: Se due articoli rispondono alla STESSA DOMANDA dell'utente anche con parole diverse, sono duplicati. In quel caso blocca (skip). Esempio: "Fluorocarbon Invernale: Terminali Invisibili" e "Come scegliere il fluorocarbon per i terminali invernali?" = stesso argomento = skip.

ESEMPI DI NON-DUPLICATI (PROCEDI):
- "pesca spigola inverno" vs "pesca spigola estate" = DIVERSI (stagione diversa)
- "spinning spigola" vs "surfcasting spigola" = DIVERSI (tecnica diversa)
- "pesca orata" vs "pesca spigola" = DIVERSI (pesce diverso)
- "pesca Sicilia" vs "pesca Sardegna" = DIVERSI (luogo diverso)

ESEMPI DI DUPLICATI (BLOCCA):
- "come pescare la spigola guida" vs "guida pesca alla spigola" = STESSO ARTICOLO
- "fluorocarbon invernale terminali" vs "come scegliere fluorocarbon terminali invernali" = STESSO ARGOMENTO

Rispondi SOLO con questo JSON (senza markdown code blocks):
{
  "isDuplicate": boolean,
  "maxSimilarity": number (0-100),
  "mostSimilarArticle": {
    "title": "titolo articolo più simile",
    "slug": "slug",
    "similarity": number (0-100),
    "reason": "spiegazione breve del perché è simile"
  },
  "recommendation": "proceed" | "modify_angle" | "skip",
  "suggestedAngle": "se recommendation è modify_angle, suggerisci un angolo diverso per differenziare l'articolo",
  "analysis": "breve analisi SEO (max 100 parole)"
}
`;

/**
 * Analizza se una keyword è semanticamente duplicata
 * @param {string} newKeyword - La nuova keyword da verificare
 * @param {Object} options - Opzioni aggiuntive
 * @returns {Promise<Object>} Risultato dell'analisi
 */
export async function checkSemanticDuplicate(newKeyword, options = {}) {
  const { verbose = CONFIG.verbose, skipCheck = false } = options;

  if (skipCheck) {
    if (verbose) console.log('⏭️ Check duplicati saltato (skipCheck=true)');
    return {
      isDuplicate: false,
      maxSimilarity: 0,
      recommendation: 'proceed',
      skipped: true
    };
  }

  if (verbose) {
    console.log('\n' + '🔍'.repeat(20));
    console.log('ANALISI SEMANTICA DUPLICATI');
    console.log('🔍'.repeat(20));
    console.log(`\n📝 Keyword: "${newKeyword}"\n`);
  }

  // 1. Recupera articoli esistenti da Sanity
  const existingArticles = await getAllArticlesForDuplicateCheck();

  if (existingArticles.length === 0) {
    if (verbose) console.log('✅ Nessun articolo esistente - procedi liberamente\n');
    return {
      isDuplicate: false,
      maxSimilarity: 0,
      recommendation: 'proceed',
      analysis: 'Nessun articolo esistente nel database.'
    };
  }

  // 2. Pre-check deterministico (risparmia Gemini, blocca duplicati ovvi)
  const deterministicResult = deterministicDuplicateCheck(newKeyword, existingArticles);
  if (deterministicResult) {
    if (verbose) {
      console.log('\n🔴 DUPLICATO (pre-check deterministico)');
      console.log(`   Articolo simile: "${deterministicResult.mostSimilarArticle?.title}"`);
      console.log(`   Motivo: ${deterministicResult.mostSimilarArticle?.reason}\n`);
    }
    return deterministicResult;
  }

  // 3. Limita il numero di articoli da confrontare con Gemini
  const articlesToCompare = existingArticles.slice(0, CONFIG.maxArticlesToCompare);
  if (verbose) console.log(`📊 Confronto con ${articlesToCompare.length} articoli esistenti (Gemini)...`);

  // 4. Inizializza Gemini e analizza con retry
  initGemini();

  const maxRetries = 2;
  let content;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const startTime = Date.now();
      const result = await model.generateContent(
        DUPLICATE_CHECK_PROMPT(newKeyword, articlesToCompare)
      );
      const response = await result.response;
      content = response.text();
      
      const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
      if (verbose) console.log(`⏱️ Analisi completata in ${elapsed}s`);
      break; // Successo
      
    } catch (retryError) {
      const isRateLimit = retryError.message.includes('429');
      if (isRateLimit && attempt < maxRetries) {
        console.log(`   ⏳ Rate limit - attendo 20s e riprovo...`);
        await new Promise(r => setTimeout(r, 20000));
      } else {
        throw retryError;
      }
    }
  }

  try {
    // 4. Parsa la risposta JSON
    const cleanContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.warn('⚠️ Risposta non in formato JSON');
      return {
        isDuplicate: false,
        maxSimilarity: 0,
        recommendation: 'error',
        error: 'Parse error - risposta Gemini non in formato JSON'
      };
    }

    const analysis = JSON.parse(jsonMatch[0]);

    // Applicazione soglie server-side (skip >= 75%, modify_angle 60-74%)
    const sim = analysis.maxSimilarity ?? 0;
    if (sim >= CONFIG.similarityThreshold) {
      analysis.isDuplicate = true;
      analysis.recommendation = 'skip';
      analysis.mostSimilarArticle = analysis.mostSimilarArticle || {};
      analysis.mostSimilarArticle.reason =
        analysis.mostSimilarArticle.reason ||
        `Similarità ${sim}% >= soglia skip ${CONFIG.similarityThreshold}%`;
    } else if (sim >= CONFIG.modifyAngleThreshold) {
      analysis.recommendation = 'modify_angle';
      analysis.isDuplicate = false;
    }

    // 5. Logga risultato
    if (verbose) {
      console.log('\n' + '='.repeat(50));
      console.log('📊 RISULTATO ANALISI');
      console.log('='.repeat(50));
      
      if (analysis.isDuplicate) {
        console.log(`\n🔴 DUPLICATO RILEVATO!`);
        console.log(`   Similarità: ${analysis.maxSimilarity}%`);
        console.log(`   Articolo simile: "${analysis.mostSimilarArticle?.title}"`);
        console.log(`   Motivo: ${analysis.mostSimilarArticle?.reason}`);
      } else if (analysis.recommendation === 'modify_angle') {
        console.log(`\n🟡 SOVRAPPOSIZIONE PARZIALE`);
        console.log(`   Similarità: ${analysis.maxSimilarity}%`);
        console.log(`   Suggerimento: ${analysis.suggestedAngle}`);
      } else {
        console.log(`\n🟢 NESSUN DUPLICATO`);
        console.log(`   Similarità massima: ${analysis.maxSimilarity}%`);
      }

      console.log(`\n📝 Raccomandazione: ${analysis.recommendation.toUpperCase()}`);
      console.log(`💡 Analisi: ${analysis.analysis}`);
      console.log('='.repeat(50) + '\n');
    }

    return analysis;

  } catch (error) {
    console.error('❌ Errore nell\'analisi semantica:', error.message);
    return {
      isDuplicate: false,
      maxSimilarity: 0,
      recommendation: 'error',
      error: error.message
    };
  }
}

/**
 * Verifica batch di keyword per duplicati
 * @param {Array<string>} keywords - Array di keyword da verificare
 * @returns {Promise<Object>} Report con keyword sicure e da evitare
 */
export async function checkBatchDuplicates(keywords) {
  console.log('\n' + '📋'.repeat(20));
  console.log('VERIFICA BATCH DUPLICATI');
  console.log('📋'.repeat(20));
  console.log(`\n🔢 Keyword da verificare: ${keywords.length}\n`);

  const results = {
    safe: [],      // Keyword sicure da usare
    modify: [],    // Keyword che richiedono un angolo diverso
    skip: [],      // Keyword da saltare (duplicati)
    errors: []     // Keyword con errori di verifica
  };

  for (let i = 0; i < keywords.length; i++) {
    const keyword = keywords[i];
    console.log(`\n[${i + 1}/${keywords.length}] Verifico: "${keyword}"`);

    try {
      const analysis = await checkSemanticDuplicate(keyword, { verbose: false });

      if (analysis.recommendation === 'proceed') {
        results.safe.push({ keyword, analysis });
        console.log(`   ✅ SAFE (${analysis.maxSimilarity}% similarità)`);
      } else if (analysis.recommendation === 'modify_angle') {
        results.modify.push({ keyword, analysis });
        console.log(`   🟡 MODIFY (${analysis.maxSimilarity}% similarità)`);
      } else {
        results.skip.push({ keyword, analysis });
        console.log(`   🔴 SKIP (${analysis.maxSimilarity}% similarità)`);
      }

      // Pausa per rate limiting Gemini
      if (i < keywords.length - 1) {
        await new Promise(r => setTimeout(r, 2000));
      }

    } catch (error) {
      results.errors.push({ keyword, error: error.message });
      console.log(`   ❌ ERROR: ${error.message}`);
    }
  }

  // Report finale
  console.log('\n' + '='.repeat(50));
  console.log('📊 REPORT BATCH');
  console.log('='.repeat(50));
  console.log(`✅ Safe: ${results.safe.length}`);
  console.log(`🟡 Da modificare: ${results.modify.length}`);
  console.log(`🔴 Da saltare: ${results.skip.length}`);
  console.log(`❌ Errori: ${results.errors.length}`);
  console.log('='.repeat(50) + '\n');

  return results;
}

/**
 * Esporta funzione per log formattato del risultato
 */
export function formatDuplicateResult(analysis) {
  if (analysis.isDuplicate) {
    return `🔴 DUPLICATO (${analysis.maxSimilarity}%) - Simile a: "${analysis.mostSimilarArticle?.title}"`;
  } else if (analysis.recommendation === 'modify_angle') {
    return `🟡 MODIFICA ANGOLO (${analysis.maxSimilarity}%) - Suggerimento: ${analysis.suggestedAngle}`;
  } else {
    return `✅ OK (${analysis.maxSimilarity}% max similarità)`;
  }
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🔍 FishandTips Semantic Duplicate Checker
==========================================

Verifica se una keyword è semanticamente duplicata rispetto agli articoli esistenti.

Uso:
  node scripts/semantic-duplicate-checker.js "keyword da verificare"
  node scripts/semantic-duplicate-checker.js --batch "keyword1" "keyword2" "keyword3"

Esempi:
  node scripts/semantic-duplicate-checker.js "come pescare la spigola"
  node scripts/semantic-duplicate-checker.js --batch "esche per orata" "montatura surfcasting" "pesca notturna"

Raccomandazioni output:
  - proceed: Keyword sicura, nessun duplicato
  - modify_angle: Esiste articolo simile, considera un angolo diverso
  - skip: Duplicato certo, salta questa keyword

Prerequisiti:
  - GEMINI_API_KEY configurata
  - SANITY_API_TOKEN per leggere gli articoli esistenti
`);
    return;
  }

  // Batch mode
  if (args[0] === '--batch') {
    const keywords = args.slice(1);
    if (keywords.length === 0) {
      console.error('❌ Fornisci almeno una keyword dopo --batch');
      process.exit(1);
    }
    await checkBatchDuplicates(keywords);
    return;
  }

  // Single keyword mode
  const keyword = args[0];
  await checkSemanticDuplicate(keyword);
}

const isDirectRun = process.argv[1]?.includes('semantic-duplicate-checker');
if (isDirectRun) {
  main().catch(console.error);
}

export default {
  checkSemanticDuplicate,
  checkBatchDuplicates,
  formatDuplicateResult
};

