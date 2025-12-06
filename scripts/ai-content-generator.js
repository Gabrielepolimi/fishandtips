/**
 * 🎣 FishandTips AI Content Generator
 * 
 * Genera articoli ottimizzati SEO con prodotti Amazon affiliati
 * usando Google Gemini API (GRATUITO) + Sanity CMS
 * 
 * Uso:
 *   node scripts/ai-content-generator.js "keyword da cercare" "categoria"
 *   node scripts/ai-content-generator.js "migliori esche per spigola" "attrezzature"
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import {
  getDefaultAuthorId,
  getCategoryIdBySlug,
  articleExistsBySlug,
  createDocument,
  validatePostDocument,
  markdownToBlockContent,
  slugify
} from './sanity-helpers.js';

// ===== CONFIGURAZIONE =====
const CONFIG = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash' // Veloce e gratuito
  },
  amazon: {
    affiliateTag: process.env.AMAZON_AFFILIATE_TAG || 'fishandtips-21',
    searchUrl: 'https://www.amazon.it/s?k='
  }
};

// ===== INIZIALIZZAZIONE GEMINI =====
let genAI;
let model;

function initGemini() {
  if (!CONFIG.gemini.apiKey) {
    throw new Error('❌ GEMINI_API_KEY non configurata! Aggiungi la variabile ambiente.');
  }
  genAI = new GoogleGenerativeAI(CONFIG.gemini.apiKey);
  model = genAI.getGenerativeModel({ model: CONFIG.gemini.model });
}

// ===== PROMPT TEMPLATE =====
const ARTICLE_PROMPT = (keyword, existingCategories) => `
Sei un esperto pescatore italiano con oltre 20 anni di esperienza nelle acque italiane.
Scrivi un articolo completo e dettagliato per il blog FishandTips.it sulla keyword: "${keyword}"

TONO E STILE:
- Scrivi in prima persona, come se stessi parlando a un amico pescatore
- Usa un tono amichevole ma autorevole
- Condividi aneddoti ed esperienze personali quando rilevante
- Usa termini tecnici ma spiega i concetti per i principianti

STRUTTURA ARTICOLO:
1. Introduzione accattivante (spiega perché questo argomento è importante)
2. Almeno 4-6 sezioni con titoli H2
3. Sottosezioni H3 dove necessario
4. Liste puntate per i consigli pratici
5. Conclusione con un consiglio finale

REQUISITI SEO:
- Titolo: massimo 60 caratteri, includi la keyword principale
- Excerpt: massimo 160 caratteri, deve invogliare a leggere
- Usa la keyword principale 3-5 volte nel testo in modo naturale
- Includi 5-7 keywords long-tail correlate nel testo

CONTENUTO:
- Lunghezza: 1500-2500 parole (articolo completo e approfondito)
- Includi consigli pratici basati su esperienza reale
- Menziona condizioni meteo ideali, stagioni, orari migliori
- Aggiungi avvertenze di sicurezza se rilevanti
- Se parli di spot, mantieni indicazioni generiche (non coordinate precise)

PRODOTTI DA CONSIGLIARE (3-5 prodotti REALI trovabili su Amazon.it):
Per ogni prodotto fornisci:
- Nome prodotto specifico e reale (marca + modello esatto)
- Fascia di prezzo approssimativa in EUR
- Recensione breve e onesta (2-3 frasi, pro e contro)
- Livello esperienza consigliato: "beginner", "intermediate" o "expert"
- Badge appropriato: "best-value", "pro-choice", "beginner-friendly", "best-seller" o "budget-friendly"

Categorie disponibili per questo sito: ${existingCategories}

FORMATO OUTPUT - Rispondi ESCLUSIVAMENTE con questo JSON valido (senza markdown code blocks):

{
  "title": "Titolo articolo (max 60 caratteri)",
  "slug": "titolo-in-formato-slug-senza-accenti",
  "excerpt": "Descrizione SEO accattivante max 160 caratteri",
  "seoTitle": "Titolo SEO | FishandTips.it",
  "seoDescription": "Meta description ottimizzata per Google max 160 caratteri",
  "seoKeywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "readingTime": 8,
  "body": "Contenuto completo dell'articolo in formato MARKDOWN. Usa ## per H2, ### per H3, - per liste puntate, **grassetto** per enfasi, > per citazioni. NON usare H1. Scrivi un articolo lungo e dettagliato.",
  "products": [
    {
      "name": "Nome Prodotto Reale Completo",
      "brand": "Marca",
      "price": 99.99,
      "quickReview": "Recensione onesta in 2-3 frasi con pro e contro",
      "experienceLevel": "beginner",
      "badge": "best-value",
      "searchQuery": "query esatta per trovarlo su amazon italia"
    }
  ],
  "suggestedCategory": "slug-categoria-suggerita"
}
`;

// ===== FUNZIONE PRINCIPALE =====
export async function generateArticle(keyword, categorySlug = null) {
  console.log('\n' + '='.repeat(60));
  console.log(`🎣 GENERAZIONE ARTICOLO: "${keyword}"`);
  console.log('='.repeat(60) + '\n');

  // Inizializza Gemini
  initGemini();

  // 1. Prepara le categorie disponibili per il prompt
  const categoriesText = 'tecniche-di-pesca, attrezzature, consigli, spot-di-pesca';

  // 2. Genera contenuto con Gemini
  console.log('📝 Chiamata Gemini API (gratuito!)...');
  const startTime = Date.now();

  let articleData;
  try {
    const result = await model.generateContent(ARTICLE_PROMPT(keyword, categoriesText));
    const response = await result.response;
    const content = response.text();

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Risposta ricevuta in ${elapsed}s`);

    // 3. Parsa la risposta JSON
    const cleanContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();

    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.log('⚠️ Risposta raw:', content.substring(0, 500));
      throw new Error('Risposta non in formato JSON valido');
    }

    articleData = JSON.parse(jsonMatch[0]);
    console.log(`📰 Articolo generato: "${articleData.title}"`);

  } catch (error) {
    console.error('❌ Errore Gemini:', error.message);
    throw error;
  }

  // 4. Verifica se l'articolo esiste già
  const slugToUse = articleData.slug || slugify(articleData.title);
  const exists = await articleExistsBySlug(slugToUse);
  if (exists) {
    console.log(`⚠️ Articolo con slug "${slugToUse}" esiste già!`);
    // Aggiungi timestamp per renderlo unico
    articleData.slug = `${slugToUse}-${Date.now()}`;
    console.log(`   Nuovo slug: ${articleData.slug}`);
  }

  // 5. Recupera riferimenti Sanity
  console.log('\n🔗 Recupero riferimenti Sanity...');
  const authorId = await getDefaultAuthorId();
  if (!authorId) {
    throw new Error('Nessun autore trovato in Sanity. Crea almeno un autore prima di generare articoli.');
  }

  // Usa la categoria specificata o quella suggerita dall'AI
  const finalCategorySlug = categorySlug || articleData.suggestedCategory || 'consigli';
  const categoryId = await getCategoryIdBySlug(finalCategorySlug);

  // 6. Converti body in Sanity Block Content
  console.log('📄 Conversione markdown -> Sanity blocks...');
  const bodyBlocks = markdownToBlockContent(articleData.body);
  console.log(`   ${bodyBlocks.length} blocchi creati`);

  // 7. Prepara prodotti con link affiliati
  const products = (articleData.products || []).map((p, index) => ({
    _key: `product-${index}`,
    _type: 'object',
    productId: slugify(p.name),
    name: p.name,
    brand: p.brand,
    price: p.price,
    quickReview: p.quickReview,
    experienceLevel: p.experienceLevel || 'intermediate',
    badge: p.badge || 'best-value',
    affiliateLink: `${CONFIG.amazon.searchUrl}${encodeURIComponent(p.searchQuery || p.name)}&tag=${CONFIG.amazon.affiliateTag}`
  }));
  console.log(`🛒 ${products.length} prodotti con link affiliati preparati`);

  // 8. Costruisci documento Sanity
  const doc = {
    _type: 'post',
    title: articleData.title.substring(0, 60),
    slug: { 
      _type: 'slug', 
      current: articleData.slug || slugify(articleData.title) 
    },
    excerpt: (articleData.excerpt || '').substring(0, 160),
    seoTitle: (articleData.seoTitle || articleData.title).substring(0, 60),
    seoDescription: (articleData.seoDescription || articleData.excerpt || '').substring(0, 160),
    seoKeywords: articleData.seoKeywords || [],
    readingTime: Math.floor(Math.random() * 3) + 3, // Random 3-5 minuti
    body: bodyBlocks,
    author: { _type: 'reference', _ref: authorId },
    categories: categoryId ? [{ _type: 'reference', _ref: categoryId }] : [],
    publishedAt: new Date().toISOString(),
    status: 'published', // Pubblicazione automatica
    showFishingRodComparison: products.length > 0,
    fishingRodComparisonTitle: products.length > 0 ? `Prodotti consigliati per ${keyword}` : null,
    selectedProducts: products,
    featured: false,
    initialLikes: Math.floor(Math.random() * 800) + 1300 // 1300-2100 like iniziali
  };

  // 9. Valida documento
  const validation = validatePostDocument(doc);
  if (!validation.valid) {
    console.log('⚠️ Avvisi di validazione:');
    validation.errors.forEach(e => console.log(`   - ${e}`));
  }

  // 10. Crea in Sanity
  console.log('\n📤 Pubblicazione automatica su Sanity...');
  const result = await createDocument(doc);

  // 11. Report finale
  console.log('\n' + '='.repeat(60));
  console.log('✅ ARTICOLO CREATO CON SUCCESSO!');
  console.log('='.repeat(60));
  console.log(`📰 Titolo: ${doc.title}`);
  console.log(`🔗 Slug: ${doc.slug.current}`);
  console.log(`📁 Categoria: ${finalCategorySlug}`);
  console.log(`🛒 Prodotti: ${products.length}`);
  console.log(`📝 Status: PUBBLICATO ✅`);
  console.log(`\n🔗 Modifica su Sanity Studio:`);
  console.log(`   https://fishandtips.sanity.studio/structure/post;${result._id}`);
  console.log('='.repeat(60) + '\n');

  return result;
}

// ===== GENERAZIONE BATCH =====
export async function generateBatch(keywords) {
  console.log('\n' + '🚀'.repeat(30));
  console.log(`GENERAZIONE BATCH: ${keywords.length} articoli`);
  console.log('🚀'.repeat(30) + '\n');

  const results = [];
  const startTime = Date.now();

  for (let i = 0; i < keywords.length; i++) {
    const { keyword, category } = keywords[i];
    console.log(`\n[${i + 1}/${keywords.length}] Elaborazione: "${keyword}"`);

    try {
      const result = await generateArticle(keyword, category);
      results.push({ 
        keyword, 
        success: true, 
        id: result._id,
        slug: result.slug.current 
      });
    } catch (error) {
      console.error(`❌ Errore per "${keyword}":`, error.message);
      results.push({ 
        keyword, 
        success: false, 
        error: error.message 
      });
    }

    // Pausa tra richieste (rispetta rate limit Gemini: 15 req/min)
    if (i < keywords.length - 1) {
      console.log('⏳ Pausa 5 secondi per rate limiting...');
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  // Report finale
  const elapsed = ((Date.now() - startTime) / 1000 / 60).toFixed(1);
  const successful = results.filter(r => r.success).length;

  console.log('\n' + '='.repeat(60));
  console.log('📊 REPORT BATCH');
  console.log('='.repeat(60));
  console.log(`✅ Successi: ${successful}/${keywords.length}`);
  console.log(`❌ Errori: ${keywords.length - successful}`);
  console.log(`⏱️ Tempo totale: ${elapsed} minuti`);
  console.log('\nDettagli:');
  results.forEach(r => {
    if (r.success) {
      console.log(`  ✅ "${r.keyword}" -> ${r.slug}`);
    } else {
      console.log(`  ❌ "${r.keyword}" -> ${r.error}`);
    }
  });
  console.log('='.repeat(60) + '\n');

  return results;
}

// ===== ESECUZIONE DA CLI =====
async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log(`
🎣 FishandTips AI Content Generator
=====================================

Uso:
  node scripts/ai-content-generator.js "keyword" [categoria]

Esempi:
  node scripts/ai-content-generator.js "migliori esche per spigola" "attrezzature"
  node scripts/ai-content-generator.js "come pescare il sarago" "tecniche-di-pesca"
  node scripts/ai-content-generator.js "pesca notturna consigli" "consigli"

Categorie disponibili:
  - tecniche-di-pesca
  - attrezzature
  - consigli
  - spot-di-pesca

Variabili ambiente richieste:
  - GEMINI_API_KEY: La tua API key di Google Gemini
  - SANITY_API_TOKEN: Token Sanity con permessi Editor
  - AMAZON_AFFILIATE_TAG: Il tuo tag affiliato Amazon (opzionale)
`);
    process.exit(0);
  }

  const keyword = args[0];
  const category = args[1] || null;

  try {
    await generateArticle(keyword, category);
  } catch (error) {
    console.error('\n❌ ERRORE FATALE:', error.message);
    process.exit(1);
  }
}

// Esegui se chiamato direttamente
main();

