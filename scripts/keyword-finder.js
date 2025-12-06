/**
 * 🔍 FishandTips Keyword Finder
 * 
 * Genera keyword profittevoli per la nicchia pesca
 * usando Google Gemini API (GRATUITO)
 * 
 * Uso:
 *   node scripts/keyword-finder.js                    # Genera 20 keyword generiche
 *   node scripts/keyword-finder.js --focus surfcasting # Focus su una nicchia specifica
 *   node scripts/keyword-finder.js --commercial       # Solo keyword commerciali
 *   node scripts/keyword-finder.js --save            # Salva risultati su file
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIGURAZIONE =====
const CONFIG = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash'
  }
};

// ===== MESE CORRENTE IN ITALIANO =====
function getCurrentMonthItalian() {
  const months = [
    'gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno',
    'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'
  ];
  return months[new Date().getMonth()];
}

// ===== STAGIONE CORRENTE =====
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'primavera';
  if (month >= 5 && month <= 7) return 'estate';
  if (month >= 8 && month <= 10) return 'autunno';
  return 'inverno';
}

// ===== PROMPT TEMPLATE =====
const KEYWORD_PROMPT = (options = {}) => {
  const { focus, commercialOnly } = options;
  const month = getCurrentMonthItalian();
  const season = getCurrentSeason();

  let focusInstruction = '';
  if (focus) {
    focusInstruction = `\nFOCUS SPECIFICO: Concentrati principalmente sulla nicchia "${focus}" e argomenti correlati.`;
  }

  let intentInstruction = '';
  if (commercialOnly) {
    intentInstruction = '\nIMPORTANTE: Genera SOLO keyword con intent commerciale (persone pronte a comprare prodotti).';
  }

  return `
Sei un esperto SEO specializzato nella nicchia pesca in Italia.
Siamo nel mese di ${month} (${season}).

Genera 20 keyword long-tail profittevoli per un blog italiano di pesca, considerando:
${focusInstruction}
${intentInstruction}

1. INTENT COMMERCIALE (persone pronte a comprare):
   - "migliori [prodotto] per [tecnica/specie]"
   - "recensione [marca] [prodotto] [anno]"
   - "[prodotto] economico vs professionale"
   - "quale [prodotto] comprare per [situazione]"

2. INTENT INFORMATIVO (alto volume):
   - "come pescare [specie] in ${season}"
   - "montatura per [tecnica]"
   - "guida completa [tecnica]"
   - "quando pescare [specie]"

3. STAGIONALITÀ (siamo in ${season}):
   - Specie pescabili in questo periodo
   - Tecniche appropriate alla stagione
   - Condizioni meteo tipiche

4. LOCALITÀ ITALIA:
   - Spot famosi (Liguria, Sardegna, Adriatico, Sicilia, etc.)
   - Regolamentazioni italiane
   - Pesci tipici delle coste italiane

5. TREND EMERGENTI:
   - Nuove tecniche
   - Attrezzature innovative
   - Tendenze social (YouTube, TikTok pesca)

CATEGORIE TARGET:
- tecniche-di-pesca: spinning, surfcasting, bolognese, feeder, traina, vertical jigging, etc.
- attrezzature: canne, mulinelli, esche, fili, accessori, abbigliamento
- consigli: sicurezza, meteo, nodi, conservazione pescato, licenze
- spot-di-pesca: luoghi generici (no coordinate precise), tipi di fondale

OUTPUT (JSON array valido, senza markdown):
[
  {
    "keyword": "keyword esatta in italiano",
    "intent": "commercial" | "informational",
    "difficulty": "low" | "medium" | "high",
    "category": "tecniche-di-pesca" | "attrezzature" | "consigli" | "spot-di-pesca",
    "seasonality": "tutto-anno" | "primavera" | "estate" | "autunno" | "inverno",
    "estimatedMonthlySearches": 100,
    "affiliatePotential": "high" | "medium" | "low",
    "suggestedProducts": ["prodotto1", "prodotto2"],
    "priority": 1,
    "notes": "Breve nota su perché questa keyword è interessante"
  }
]

Ordina per priorità (1 = massima priorità).
La priorità considera: alto volume + bassa difficoltà + alto potenziale affiliato + rilevanza stagionale.
`;
};

// ===== FUNZIONE PRINCIPALE =====
export async function findKeywords(options = {}) {
  console.log('\n' + '='.repeat(60));
  console.log('🔍 KEYWORD FINDER - FishandTips');
  console.log('='.repeat(60));
  console.log(`📅 Mese: ${getCurrentMonthItalian()} (${getCurrentSeason()})`);
  if (options.focus) console.log(`🎯 Focus: ${options.focus}`);
  if (options.commercialOnly) console.log('💰 Solo keyword commerciali');
  console.log('='.repeat(60) + '\n');

  // Inizializza Gemini
  if (!CONFIG.gemini.apiKey) {
    throw new Error('❌ GEMINI_API_KEY non configurata!');
  }
  const genAI = new GoogleGenerativeAI(CONFIG.gemini.apiKey);
  const model = genAI.getGenerativeModel({ model: CONFIG.gemini.model });

  // Genera keyword
  console.log('📝 Generazione keyword con Gemini...');
  const startTime = Date.now();

  try {
    const result = await model.generateContent(KEYWORD_PROMPT(options));
    const response = await result.response;
    const content = response.text();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Risposta ricevuta in ${elapsed}s\n`);

    // Parsa JSON
    const cleanContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const jsonMatch = cleanContent.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Risposta non in formato JSON array');
    }

    const keywords = JSON.parse(jsonMatch[0]);

    // Mostra risultati
    printKeywordReport(keywords);

    // Salva se richiesto
    if (options.save) {
      await saveKeywords(keywords, options);
    }

    return keywords;

  } catch (error) {
    console.error('❌ Errore:', error.message);
    throw error;
  }
}

// ===== STAMPA REPORT =====
function printKeywordReport(keywords) {
  console.log('📊 TOP 20 KEYWORD PER PRIORITÀ\n');
  console.log('-'.repeat(80));

  keywords.slice(0, 20).forEach((kw, i) => {
    const intentIcon = kw.intent === 'commercial' ? '💰' : '📖';
    const difficultyIcon = { low: '🟢', medium: '🟡', high: '🔴' }[kw.difficulty] || '⚪';
    const affiliateIcon = { high: '⭐⭐⭐', medium: '⭐⭐', low: '⭐' }[kw.affiliatePotential] || '';

    console.log(`\n${i + 1}. "${kw.keyword}"`);
    console.log(`   ${intentIcon} Intent: ${kw.intent} | ${difficultyIcon} Difficoltà: ${kw.difficulty}`);
    console.log(`   📁 Categoria: ${kw.category} | 📅 Stagionalità: ${kw.seasonality}`);
    console.log(`   📈 Ricerche stimate: ${kw.estimatedMonthlySearches}/mese`);
    console.log(`   ${affiliateIcon} Potenziale affiliato: ${kw.affiliatePotential}`);
    if (kw.suggestedProducts?.length > 0) {
      console.log(`   🛒 Prodotti: ${kw.suggestedProducts.join(', ')}`);
    }
    if (kw.notes) {
      console.log(`   💡 ${kw.notes}`);
    }
  });

  console.log('\n' + '-'.repeat(80));

  // Statistiche
  const commercial = keywords.filter(k => k.intent === 'commercial').length;
  const informational = keywords.filter(k => k.intent === 'informational').length;
  const highAffiliate = keywords.filter(k => k.affiliatePotential === 'high').length;

  console.log('\n📈 STATISTICHE:');
  console.log(`   💰 Commerciali: ${commercial} | 📖 Informative: ${informational}`);
  console.log(`   ⭐ Alto potenziale affiliato: ${highAffiliate}`);

  // Keywords per categoria
  const byCategory = {};
  keywords.forEach(k => {
    byCategory[k.category] = (byCategory[k.category] || 0) + 1;
  });
  console.log('\n   Per categoria:');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   - ${cat}: ${count}`);
  });

  console.log('\n' + '='.repeat(60) + '\n');
}

// ===== SALVA KEYWORDS =====
async function saveKeywords(keywords, options) {
  const timestamp = new Date().toISOString().split('T')[0];
  const suffix = options.focus ? `-${options.focus}` : '';
  const filename = `keywords-${timestamp}${suffix}.json`;
  const filepath = path.join(__dirname, '..', 'data', filename);

  // Crea cartella data se non esiste
  const dataDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  // Prepara dati con metadata
  const data = {
    generatedAt: new Date().toISOString(),
    month: getCurrentMonthItalian(),
    season: getCurrentSeason(),
    options: {
      focus: options.focus || null,
      commercialOnly: options.commercialOnly || false
    },
    keywords
  };

  fs.writeFileSync(filepath, JSON.stringify(data, null, 2), 'utf-8');
  console.log(`💾 Keywords salvate in: ${filename}`);

  return filepath;
}

// ===== FUNZIONE PER GENERARE PIANO SETTIMANALE =====
export async function generateWeeklyPlan(keywords) {
  // Seleziona le migliori keyword per un piano settimanale
  const plan = {
    week: getWeekNumber(),
    articles: []
  };

  // Priorità: commerciali con alto potenziale affiliato prima
  const sorted = [...keywords].sort((a, b) => {
    // Prima commerciali
    if (a.intent === 'commercial' && b.intent !== 'commercial') return -1;
    if (b.intent === 'commercial' && a.intent !== 'commercial') return 1;
    // Poi per potenziale affiliato
    const affOrder = { high: 0, medium: 1, low: 2 };
    if (affOrder[a.affiliatePotential] !== affOrder[b.affiliatePotential]) {
      return affOrder[a.affiliatePotential] - affOrder[b.affiliatePotential];
    }
    // Poi per difficoltà
    const diffOrder = { low: 0, medium: 1, high: 2 };
    return diffOrder[a.difficulty] - diffOrder[b.difficulty];
  });

  // Prendi top 5 per la settimana
  const weeklyKeywords = sorted.slice(0, 5);

  console.log('\n📅 PIANO ARTICOLI SETTIMANALE\n');
  console.log('='.repeat(60));

  const days = ['Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì'];
  weeklyKeywords.forEach((kw, i) => {
    console.log(`\n${days[i]}: "${kw.keyword}"`);
    console.log(`   Categoria: ${kw.category}`);
    console.log(`   Prodotti da includere: ${kw.suggestedProducts?.join(', ') || 'N/A'}`);
    plan.articles.push({
      day: days[i],
      keyword: kw.keyword,
      category: kw.category,
      products: kw.suggestedProducts
    });
  });

  console.log('\n' + '='.repeat(60));

  return plan;
}

function getWeekNumber() {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 1);
  const diff = now - start;
  const oneWeek = 604800000;
  return Math.ceil(diff / oneWeek);
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  const options = {
    focus: null,
    commercialOnly: false,
    save: false,
    plan: false
  };

  // Parse argomenti
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--focus' && args[i + 1]) {
      options.focus = args[i + 1];
      i++;
    } else if (args[i] === '--commercial') {
      options.commercialOnly = true;
    } else if (args[i] === '--save') {
      options.save = true;
    } else if (args[i] === '--plan') {
      options.plan = true;
    } else if (args[i] === '--help') {
      console.log(`
🔍 FishandTips Keyword Finder
=============================

Uso:
  node scripts/keyword-finder.js [opzioni]

Opzioni:
  --focus <nicchia>   Focus su una nicchia specifica (es: surfcasting, spinning)
  --commercial        Genera solo keyword con intent commerciale
  --save              Salva risultati in data/keywords-YYYY-MM-DD.json
  --plan              Genera anche un piano articoli settimanale
  --help              Mostra questo messaggio

Esempi:
  node scripts/keyword-finder.js
  node scripts/keyword-finder.js --focus surfcasting --save
  node scripts/keyword-finder.js --commercial --plan
  node scripts/keyword-finder.js --focus "esche artificiali" --commercial --save

Variabili ambiente richieste:
  GEMINI_API_KEY      La tua API key di Google Gemini (gratuita)
`);
      process.exit(0);
    }
  }

  try {
    const keywords = await findKeywords(options);

    if (options.plan) {
      await generateWeeklyPlan(keywords);
    }
  } catch (error) {
    console.error('\n❌ ERRORE:', error.message);
    process.exit(1);
  }
}

main();

