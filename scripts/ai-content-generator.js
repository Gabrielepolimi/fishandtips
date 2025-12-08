/**
 * 🤖 FishandTips - AI Content Generator con Unsplash
 * 
 * Genera articoli completi usando Gemini AI con immagini da Unsplash
 * 
 * Funzionalità:
 * - Generazione testo con Google Gemini
 * - Immagine principale da Unsplash
 * - SEO ottimizzato automaticamente
 * - Pubblicazione diretta su Sanity CMS
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@sanity/client';
import { searchPhotos, trackDownload } from './unsplash-service.js';
import {
  getDefaultAuthorId,
  getCategoryIdBySlug,
  articleExistsBySlug,
  markdownToBlockContent,
  slugify,
  validatePostDocument
} from './sanity-helpers.js';
import { checkSemanticDuplicate } from './semantic-duplicate-checker.js';

// ===== CONFIGURAZIONE =====
const CONFIG = {
  geminiModel: 'gemini-2.0-flash',
  maxTokens: 8000,
  temperature: 0.7,
  amazonAffiliateTag: process.env.AMAZON_AFFILIATE_TAG || 'fishandtips-21',
  publishImmediately: true, // Se true pubblica subito, altrimenti crea bozza
  readingTimeMin: 5,
  readingTimeMax: 12,
  initialLikesMin: 15,
  initialLikesMax: 45
};

// Sanity Client
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3nnnl6gi',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

// Gemini AI
let genAI = null;

function getGeminiAI() {
  if (!genAI) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY non configurata');
    }
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI;
}

// ===== PROMPT TEMPLATE =====
const ARTICLE_PROMPT = `Sei un esperto pescatore italiano e copywriter SEO. 
Scrivi un articolo completo e dettagliato su: "{keyword}"

REQUISITI OBBLIGATORI:
1. TITOLO: Massimo 55 caratteri, accattivante e SEO-friendly (senza virgolette)
2. EXCERPT: Descrizione di 150-155 caratteri per meta description
3. CONTENUTO: 
   - Minimo 1500 parole, massimo 2500
   - Struttura con H2 e H3
   - Paragrafi brevi (3-4 frasi)
   - Almeno 5 sezioni principali
   - Consigli pratici basati su esperienza reale
   - Linguaggio coinvolgente in prima persona plurale (noi pescatori)

4. SEO:
   - 5-7 keyword correlate (separate da virgola)
   - Inserisci la keyword principale naturalmente nel testo
   - Usa sinonimi e variazioni della keyword

5. PRODOTTI AMAZON (IMPORTANTE):
   - Suggerisci 2-3 prodotti correlati (attrezzatura, esche, accessori)
   - Per ogni prodotto: nome, breve descrizione (max 80 car), prezzo indicativo
   - I prodotti devono essere realistici e acquistabili su Amazon.it

6. FORMATO OUTPUT (RISPETTA ESATTAMENTE QUESTA STRUTTURA):
---TITOLO---
[Il titolo qui]
---EXCERPT---
[La meta description qui]
---KEYWORDS---
[keyword1, keyword2, keyword3, ...]
---PRODOTTI---
PRODOTTO1: Nome prodotto | Descrizione breve | €XX
PRODOTTO2: Nome prodotto | Descrizione breve | €XX
PRODOTTO3: Nome prodotto | Descrizione breve | €XX
---CONTENUTO---
[Il contenuto markdown qui con ## per H2 e ### per H3]
---FINE---

CATEGORIA ARTICOLO: {category}
STAGIONE CORRENTE: {season}

Scrivi contenuto originale, utile e basato su vera esperienza di pesca. 
Non inventare statistiche o dati. Usa il "noi" per creare connessione con il lettore.`;

// ===== FUNZIONE PRINCIPALE =====
export async function generateArticle(keyword, categorySlug = 'consigli', options = {}) {
  const { skipDuplicateCheck = false, verbose = true } = options;
  
  const log = (msg) => verbose && console.log(msg);
  
  log('\n' + '🎣'.repeat(25));
  log(`GENERAZIONE ARTICOLO: "${keyword}"`);
  log('🎣'.repeat(25) + '\n');

  // 1. Check duplicati semantici (se non saltato)
  if (!skipDuplicateCheck) {
    log('🔍 Controllo duplicati semantici...');
    try {
      const duplicateAnalysis = await checkSemanticDuplicate(keyword, { verbose: false });
      
      if (duplicateAnalysis.isDuplicate || duplicateAnalysis.recommendation === 'skip') {
        log(`❌ SKIP: Keyword troppo simile a "${duplicateAnalysis.mostSimilarArticle?.title}"`);
        log(`   Similarità: ${duplicateAnalysis.maxSimilarity}%`);
        return {
          skipped: true,
          reason: 'duplicate',
          similarTo: duplicateAnalysis.mostSimilarArticle?.title,
          similarity: duplicateAnalysis.maxSimilarity
        };
      }
      log(`✅ Nessun duplicato trovato (max ${duplicateAnalysis.maxSimilarity}% similarità)`);
    } catch (error) {
      log(`⚠️ Errore check duplicati: ${error.message} - Procedo comunque`);
    }
  }

  // 2. Verifica slug non esistente
  const baseSlug = slugify(keyword);
  log(`🔗 Slug generato: ${baseSlug}`);
  
  const slugExists = await articleExistsBySlug(baseSlug);
  if (slugExists) {
    log('⚠️ Slug già esistente, aggiungo timestamp...');
  }
  const finalSlug = slugExists ? `${baseSlug}-${Date.now()}` : baseSlug;

  // 3. Genera contenuto con Gemini
  log('🤖 Generazione contenuto con Gemini AI...');
  const season = getCurrentSeason();
  const prompt = ARTICLE_PROMPT
    .replace('{keyword}', keyword)
    .replace('{category}', categorySlug)
    .replace('{season}', season);

  let articleContent;
  try {
    const ai = getGeminiAI();
    const model = ai.getGenerativeModel({ model: CONFIG.geminiModel });
    
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: CONFIG.temperature,
        maxOutputTokens: CONFIG.maxTokens
      }
    });

    articleContent = result.response.text();
    log('✅ Contenuto generato con successo');
  } catch (error) {
    console.error('❌ Errore Gemini:', error.message);
    throw new Error(`Errore generazione Gemini: ${error.message}`);
  }

  // 4. Parsa il contenuto generato
  log('📝 Parsing contenuto...');
  const parsed = parseGeneratedContent(articleContent);
  
  if (!parsed.title || !parsed.content) {
    throw new Error('Contenuto generato non valido - titolo o contenuto mancante');
  }
  
  log(`   Titolo: "${parsed.title}"`);
  log(`   Excerpt: ${parsed.excerpt?.length || 0} caratteri`);
  log(`   Keywords: ${parsed.keywords?.length || 0}`);
  log(`   Prodotti: ${parsed.products?.length || 0}`);

  // 5. Cerca immagine su Unsplash
  log('📸 Ricerca immagine su Unsplash...');
  let mainImage = null;
  let unsplashCredit = null;
  
  try {
    // Estrai keyword per ricerca immagine
    const imageKeywords = extractImageKeywords(keyword, categorySlug);
    log(`   Query: "${imageKeywords}"`);
    
    const photos = await searchPhotos(imageKeywords, {
      perPage: 5,
      orientation: 'landscape'
    });
    
    if (photos && photos.length > 0) {
      const photo = photos[0];
      mainImage = {
        url: photo.url,
        alt: parsed.title,
        credit: `Foto di ${photo.author.name} su Unsplash`
      };
      unsplashCredit = photo.author;
      
      // Traccia download (richiesto da Unsplash ToS)
      await trackDownload(photo.downloadLink);
      
      log(`✅ Immagine trovata: ${photo.description || 'No description'}`);
      log(`   📷 by ${photo.author.name}`);
    } else {
      log('⚠️ Nessuna immagine trovata, articolo senza immagine principale');
    }
  } catch (error) {
    log(`⚠️ Errore Unsplash: ${error.message}`);
  }

  // 6. Prepara documento Sanity
  log('📄 Preparazione documento Sanity...');
  
  // Recupera IDs necessari
  const authorId = await getDefaultAuthorId();
  const categoryId = await getCategoryIdBySlug(categorySlug);
  
  if (!authorId) {
    throw new Error('Nessun autore trovato in Sanity. Crea prima un autore.');
  }

  // Converti markdown in block content
  const bodyBlocks = markdownToBlockContent(parsed.content);

  // Calcola reading time e likes random
  const wordCount = parsed.content.split(/\s+/).length;
  const readingTime = Math.max(
    CONFIG.readingTimeMin,
    Math.min(CONFIG.readingTimeMax, Math.ceil(wordCount / 200))
  );
  const initialLikes = Math.floor(
    Math.random() * (CONFIG.initialLikesMax - CONFIG.initialLikesMin + 1)
  ) + CONFIG.initialLikesMin;

  // Costruisci prodotti affiliati
  const affiliateProducts = (parsed.products || []).map((p, i) => ({
    _key: `product-${i}`,
    _type: 'affiliateProduct',
    name: p.name,
    description: p.description,
    price: p.price,
    amazonUrl: `https://www.amazon.it/s?k=${encodeURIComponent(p.name)}&tag=${CONFIG.amazonAffiliateTag}`,
    badge: i === 0 ? 'Consigliato' : null
  }));

  // Documento completo
  const sanityDocument = {
    _type: 'post',
    title: parsed.title,
    slug: { current: finalSlug },
    excerpt: parsed.excerpt || parsed.title,
    author: { _type: 'reference', _ref: authorId },
    categories: categoryId ? [{ _type: 'reference', _ref: categoryId }] : [],
    body: bodyBlocks,
    readingTime,
    likes: initialLikes,
    seoTitle: parsed.title,
    seoDescription: parsed.excerpt,
    seoKeywords: parsed.keywords || [],
    affiliateProducts,
    publishedAt: CONFIG.publishImmediately ? new Date().toISOString() : null
  };

  // Aggiungi immagine se disponibile (come URL esterno)
  if (mainImage) {
    // Aggiungi credito Unsplash alla fine del body
    const creditBlock = {
      _type: 'block',
      _key: 'unsplash-credit',
      style: 'normal',
      markDefs: [],
      children: [{
        _type: 'span',
        _key: 'credit-span',
        text: `📷 Immagine: ${mainImage.credit}`,
        marks: []
      }]
    };
    sanityDocument.body.push(creditBlock);
    
    // Salva URL immagine in un campo custom (se il tuo schema lo supporta)
    sanityDocument.mainImageUrl = mainImage.url;
    sanityDocument.mainImageAlt = mainImage.alt;
    sanityDocument.mainImageCredit = mainImage.credit;
  }

  // 7. Valida documento
  const validation = validatePostDocument(sanityDocument);
  if (!validation.valid) {
    console.error('❌ Validazione fallita:', validation.errors);
    throw new Error(`Documento non valido: ${validation.errors.join(', ')}`);
  }

  // 8. Crea in Sanity
  log('💾 Creazione articolo in Sanity...');
  
  try {
    const created = await sanityClient.create(sanityDocument);
    
    log('\n' + '✅'.repeat(25));
    log('ARTICOLO CREATO CON SUCCESSO!');
    log('✅'.repeat(25));
    log(`   📝 Titolo: ${parsed.title}`);
    log(`   🔗 Slug: ${finalSlug}`);
    log(`   📊 Parole: ~${wordCount}`);
    log(`   ⏱️ Lettura: ${readingTime} min`);
    log(`   ❤️ Likes: ${initialLikes}`);
    log(`   🛒 Prodotti: ${affiliateProducts.length}`);
    if (mainImage) {
      log(`   📸 Immagine: ✅ (${unsplashCredit?.name || 'Unsplash'})`);
    }
    log(`   📅 Stato: ${CONFIG.publishImmediately ? 'Pubblicato' : 'Bozza'}`);
    log(`   🆔 ID: ${created._id}`);
    
    return {
      ...created,
      wordCount,
      hasImage: !!mainImage
    };
  } catch (error) {
    console.error('❌ Errore Sanity:', error.message);
    throw error;
  }
}

// ===== HELPER FUNCTIONS =====

/**
 * Parsa il contenuto generato da Gemini
 */
function parseGeneratedContent(content) {
  const result = {
    title: '',
    excerpt: '',
    keywords: [],
    products: [],
    content: ''
  };

  try {
    // Estrai titolo
    const titleMatch = content.match(/---TITOLO---\s*([\s\S]*?)(?=---EXCERPT---|$)/);
    if (titleMatch) {
      result.title = titleMatch[1].trim().replace(/^["']|["']$/g, '').substring(0, 60);
    }

    // Estrai excerpt
    const excerptMatch = content.match(/---EXCERPT---\s*([\s\S]*?)(?=---KEYWORDS---|$)/);
    if (excerptMatch) {
      result.excerpt = excerptMatch[1].trim().substring(0, 160);
    }

    // Estrai keywords
    const keywordsMatch = content.match(/---KEYWORDS---\s*([\s\S]*?)(?=---PRODOTTI---|$)/);
    if (keywordsMatch) {
      result.keywords = keywordsMatch[1]
        .trim()
        .split(/[,\n]/)
        .map(k => k.trim())
        .filter(k => k.length > 0)
        .slice(0, 10);
    }

    // Estrai prodotti
    const productsMatch = content.match(/---PRODOTTI---\s*([\s\S]*?)(?=---CONTENUTO---|$)/);
    if (productsMatch) {
      const productLines = productsMatch[1].trim().split('\n').filter(l => l.includes('|'));
      result.products = productLines.map(line => {
        const parts = line.replace(/^PRODOTTO\d*:\s*/i, '').split('|').map(p => p.trim());
        return {
          name: parts[0] || 'Prodotto Pesca',
          description: parts[1] || '',
          price: parts[2] || '€29'
        };
      }).slice(0, 4);
    }

    // Estrai contenuto
    const contentMatch = content.match(/---CONTENUTO---\s*([\s\S]*?)(?=---FINE---|$)/);
    if (contentMatch) {
      result.content = contentMatch[1].trim();
    } else {
      // Fallback: prendi tutto dopo ---CONTENUTO---
      const fallbackMatch = content.match(/---CONTENUTO---\s*([\s\S]*)/);
      if (fallbackMatch) {
        result.content = fallbackMatch[1].trim().replace(/---FINE---[\s\S]*$/, '');
      }
    }

    // Se non trova i marcatori, usa euristica
    if (!result.title && !result.content) {
      const lines = content.split('\n').filter(l => l.trim());
      result.title = lines[0]?.replace(/^#\s*/, '').substring(0, 60) || 'Articolo di Pesca';
      result.content = lines.slice(1).join('\n');
    }

  } catch (error) {
    console.error('Errore parsing:', error.message);
  }

  return result;
}

/**
 * Estrai keyword per ricerca immagine
 */
function extractImageKeywords(keyword, category) {
  // Parole chiave per ricerca immagine ottimizzata
  const categoryImages = {
    'tecniche-di-pesca': 'fishing technique',
    'attrezzature': 'fishing gear equipment',
    'consigli': 'fishing tips',
    'spot-di-pesca': 'fishing spot sea'
  };
  
  // Estrai parole principali dalla keyword
  const mainWords = keyword
    .toLowerCase()
    .replace(/come|guida|completa|migliori|consigli|tecniche|per|la|il|di|da|in|con|a/gi, '')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 3)
    .join(' ');
  
  const categoryKeyword = categoryImages[category] || 'fishing';
  
  // Combina per query ottimale
  return `${mainWords} ${categoryKeyword} mediterranean`.trim();
}

/**
 * Restituisce la stagione corrente
 */
function getCurrentSeason() {
  const month = new Date().getMonth();
  if (month >= 2 && month <= 4) return 'primavera';
  if (month >= 5 && month <= 7) return 'estate';
  if (month >= 8 && month <= 10) return 'autunno';
  return 'inverno';
}

// ===== EXPORT =====
export default generateArticle;
