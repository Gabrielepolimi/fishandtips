/**
 * 🤖 FishandTips - AI Content Generator con Unsplash + Fallback
 * 
 * Genera articoli completi usando Gemini AI con immagini da Unsplash
 * e fallback su cartella locale se Unsplash non disponibile
 * 
 * Funzionalità:
 * - Generazione testo con Google Gemini
 * - Immagine principale da Unsplash (con fallback locale)
 * - Auto-linking prodotti Amazon nel testo
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
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Per ottenere __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIGURAZIONE =====
const CONFIG = {
  geminiModel: 'gemini-2.0-flash',
  maxTokens: 8000,
  temperature: 0.7,
  amazonAffiliateTag: process.env.AMAZON_AFFILIATE_TAG || 'fishandtips-21',
  publishImmediately: true,
  readingTimeMin: 5,
  readingTimeMax: 12,
  initialLikesMin: 750,
  initialLikesMax: 2500,
  // Cartella immagini fallback
  fallbackImagesDir: path.join(__dirname, '..', 'public', 'images', 'fallback-fishing'),
  // Retry config per Unsplash
  unsplashMaxRetries: 2,
  unsplashRetryDelay: 2000 // 2 secondi
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

// ===== GESTIONE IMMAGINI =====

/**
 * Scarica immagine da URL e la carica su Sanity come asset
 */
async function uploadImageToSanity(imageUrl, filename, alt) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status}`);
    }
    
    const buffer = Buffer.from(await response.arrayBuffer());
    
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: `${filename}.jpg`,
      contentType: 'image/jpeg'
    });
    
    console.log(`   ☁️ Immagine caricata su Sanity: ${asset._id}`);
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      alt: alt
    };
  } catch (error) {
    console.error(`   ❌ Errore upload immagine da URL: ${error.message}`);
    return null;
  }
}

/**
 * Carica immagine da file locale su Sanity
 */
async function uploadLocalImageToSanity(localPath, filename, alt) {
  try {
    if (!fs.existsSync(localPath)) {
      throw new Error(`File non trovato: ${localPath}`);
    }
    
    const buffer = fs.readFileSync(localPath);
    
    const asset = await sanityClient.assets.upload('image', buffer, {
      filename: `${filename}.jpg`,
      contentType: 'image/jpeg'
    });
    
    console.log(`   ☁️ Immagine locale caricata su Sanity: ${asset._id}`);
    
    return {
      _type: 'image',
      asset: {
        _type: 'reference',
        _ref: asset._id
      },
      alt: alt
    };
  } catch (error) {
    console.error(`   ❌ Errore upload immagine locale: ${error.message}`);
    return null;
  }
}

/**
 * Ottiene lista immagini fallback dalla cartella locale
 */
function getFallbackImages() {
  try {
    if (!fs.existsSync(CONFIG.fallbackImagesDir)) {
      console.log(`   ⚠️ Cartella fallback non trovata: ${CONFIG.fallbackImagesDir}`);
      return [];
    }
    
    const files = fs.readdirSync(CONFIG.fallbackImagesDir);
    const imageFiles = files.filter(f => 
      /\.(jpg|jpeg|png|webp)$/i.test(f) && !f.startsWith('.')
    );
    
    return imageFiles.map(f => path.join(CONFIG.fallbackImagesDir, f));
  } catch (error) {
    console.error(`   ❌ Errore lettura cartella fallback: ${error.message}`);
    return [];
  }
}

/**
 * Seleziona immagine fallback random
 */
function getRandomFallbackImage() {
  const images = getFallbackImages();
  if (images.length === 0) {
    return null;
  }
  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}

/**
 * Ottiene immagine con fallback: prima Unsplash, poi locale
 */
function pickRandom(list) {
  return list[Math.floor(Math.random() * list.length)];
}

async function getImageWithFallback(keyword, categorySlug, finalSlug, articleTitle, log) {
  let mainImageAsset = null;
  let imageCredit = null;
  let imageSource = null;
  
  // 1. Prova Unsplash con retry
  for (let attempt = 1; attempt <= CONFIG.unsplashMaxRetries; attempt++) {
    try {
      const imageKeywords = extractImageKeywords(keyword, categorySlug);
      log(`   🔍 Tentativo ${attempt}/${CONFIG.unsplashMaxRetries} - Query: "${imageKeywords}"`);
      
      const photos = await searchPhotos(imageKeywords, {
        perPage: 8,
        orientation: 'landscape'
      });
      
      if (photos && photos.length > 0) {
        const photo = pickRandom(photos.filter(p => p?.url) || photos);
        
        // Verifica che non sia un placeholder
        if (photo.id && !photo.id.startsWith('placeholder')) {
          imageCredit = photo.author;
          
          // Traccia download (ToS Unsplash)
          if (photo.downloadLink) {
            await trackDownload(photo.downloadLink);
          }
          
          log(`   ✅ Unsplash: ${photo.description || 'Immagine trovata'}`);
          log(`   📷 by ${photo.author?.name || 'Unknown'}`);
          
          // Upload su Sanity
          mainImageAsset = await uploadImageToSanity(
            photo.url,
            finalSlug,
            `${articleTitle} - Foto di ${photo.author?.name || 'Unsplash'} su Unsplash`
          );
          
          if (mainImageAsset) {
            imageSource = 'unsplash';
            break;
          }
        }
      }
      
      // Se arriviamo qui, non abbiamo trovato nulla di valido
      if (attempt < CONFIG.unsplashMaxRetries) {
        log(`   ⏳ Nessuna immagine valida, retry tra ${CONFIG.unsplashRetryDelay/1000}s...`);
        await new Promise(r => setTimeout(r, CONFIG.unsplashRetryDelay));
      }
      
    } catch (error) {
      log(`   ⚠️ Errore Unsplash (tentativo ${attempt}): ${error.message}`);
      if (attempt < CONFIG.unsplashMaxRetries) {
        await new Promise(r => setTimeout(r, CONFIG.unsplashRetryDelay));
      }
    }
  }
  
  // 2. Fallback su immagini locali
  if (!mainImageAsset) {
    log('   📁 Fallback su immagini locali...');
    const fallbackImage = getRandomFallbackImage();
    
    if (fallbackImage) {
      log(`   📸 Usando: ${path.basename(fallbackImage)}`);
      
      mainImageAsset = await uploadLocalImageToSanity(
        fallbackImage,
        finalSlug,
        `${articleTitle} - FishandTips`
      );
      
      if (mainImageAsset) {
        imageSource = 'fallback';
        imageCredit = { name: 'FishandTips', username: 'fishandtips' };
      }
    } else {
      log('   ⚠️ Nessuna immagine fallback disponibile');
      log('   💡 Aggiungi immagini in: public/images/fallback-fishing/');
    }
  }
  
  return { mainImageAsset, imageCredit, imageSource };
}

// ===== AUTO-LINKING PRODOTTI AMAZON =====

/**
 * Genera URL Amazon affiliato per un prodotto
 */
function generateAmazonUrl(productName) {
  const searchQuery = productName
    .replace(/[^\w\s]/g, '') // Rimuovi caratteri speciali
    .trim();
  return `https://www.amazon.it/s?k=${encodeURIComponent(searchQuery)}&tag=${CONFIG.amazonAffiliateTag}`;
}

/**
 * Inserisce link Amazon nel testo markdown per ogni prodotto menzionato
 * Trasforma "Shimano Sedona FI 2500" in "[Shimano Sedona FI 2500](amazon-url)"
 */
function insertAmazonLinksInContent(content, products) {
  if (!products || products.length === 0) {
    return content;
  }
  
  let linkedContent = content;
  const linkedProducts = [];
  
  for (const product of products) {
    const productName = product.name;
    if (!productName || productName.length < 5) continue;
    
    // Crea pattern per trovare il nome del prodotto (case insensitive)
    // Evita di linkare se già dentro un link markdown
    const escapedName = productName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const pattern = new RegExp(
      `(?<!\\[)(?<!\\]\\()\\b(${escapedName})\\b(?!\\])(?!\\))`,
      'i'
    );
    
    // Verifica se il prodotto è menzionato nel testo
    if (pattern.test(linkedContent)) {
      const amazonUrl = generateAmazonUrl(productName);
      
      // Sostituisci solo la PRIMA occorrenza con il link
      linkedContent = linkedContent.replace(
        pattern,
        `[$1](${amazonUrl})`
      );
      
      linkedProducts.push(productName);
    }
  }
  
  if (linkedProducts.length > 0) {
    console.log(`   🔗 Auto-linked ${linkedProducts.length} prodotti: ${linkedProducts.join(', ')}`);
  }
  
  return linkedContent;
}

// ===== PROMPT TEMPLATE =====
const ARTICLE_PROMPT = `Sei un esperto pescatore italiano e copywriter SEO.
Scrivi un articolo informativo e query-driven su: "{keyword}"

OBIETTIVO: rispondere in modo pratico a una domanda/problema di pesca. Niente brand nel titolo.

REQUISITI:
1) TITOLO (max 60 caratteri): forma di domanda/problema, senza virgolette, senza brand.
2) EXCERPT/meta description: 150-160 caratteri, informativa.
3) LUNGHEZZA: 900-1500 parole.
4) STRUTTURA (un solo H1 = il titolo; nel corpo usa solo H2/H3):
   - Intro breve (problema/domanda + promessa)
   - Perché conta / quando usarla
   - Attrezzatura/setup consigliato
   - Passi operativi o tecnica (step-by-step)
   - Errori comuni
   - Checklist rapida
   - FAQ (3-5 Q&A)
   - Conclusione/actionable takeaway
5) STILE: paragrafi brevi (3-4 frasi), tono pratico, “noi pescatori”, zero fluff, esempi concreti.
6) SEO: 5-7 keyword correlate (virgola), inserisci la keyword principale naturalmente, usa sinonimi.
7) PRODOTTI: se non pertinenti lascia vuota la sezione PRODOTTI.

FORMATO OUTPUT (rispetta esattamente):
---TITOLO---
[titolo qui]
---EXCERPT---
[meta description qui]
---KEYWORDS---
[keyword1, keyword2, keyword3, ...]
---PRODOTTI---
[Lascia vuoto se non hai prodotti da suggerire]
---CONTENUTO---
[contenuto markdown con ## per H2 e ### per H3, senza H1 nel corpo]
---FINE---

CATEGORIA ARTICOLO: {category}
STAGIONE CORRENTE: {season}

Scrivi contenuto originale, utile e basato su vera esperienza di pesca.
Non inventare statistiche o dati. Usa “noi” per creare connessione.`;

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
  const maxRetries = 3;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
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
      break;
      
    } catch (error) {
      const isRateLimit = error.message.includes('429') || error.message.includes('Too Many Requests');
      
      if (isRateLimit && attempt < maxRetries) {
        const waitTime = attempt * 30;
        log(`⏳ Rate limit (429) - Attendo ${waitTime}s prima del retry ${attempt + 1}/${maxRetries}...`);
        await new Promise(r => setTimeout(r, waitTime * 1000));
      } else if (attempt === maxRetries) {
        console.error('❌ Errore Gemini dopo tutti i tentativi:', error.message);
        throw new Error(`Errore generazione Gemini: ${error.message}`);
      } else {
        console.error('❌ Errore Gemini:', error.message);
        throw new Error(`Errore generazione Gemini: ${error.message}`);
      }
    }
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

  // 5. AUTO-LINK: Inserisci link Amazon nel contenuto
  log('🔗 Inserimento link Amazon nel testo...');
  const contentWithLinks = insertAmazonLinksInContent(parsed.content, parsed.products);

  // 5b. TL;DR e freshness
  const tldrBlock = buildTldrBlock(keyword, parsed.excerpt);
  const freshnessBlock = buildFreshnessBlock();
  const contentWithSignals = `${tldrBlock}\n\n${contentWithLinks}\n\n${freshnessBlock}`;

  // 5c. Internal linking: aggiungi blocco "Approfondisci" con link interni
  log('🔗 Internal linking verso articoli correlati...');
  const internalLinks = await getInternalLinks(categorySlug, finalSlug, 3);
  const contentWithInternalLinks = appendInternalLinks(contentWithSignals, internalLinks);

  // 6. Cerca immagine (Unsplash + fallback locale)
  log('📸 Ricerca immagine...');
  const { mainImageAsset, imageCredit, imageSource } = await getImageWithFallback(
    keyword, 
    categorySlug, 
    finalSlug, 
    parsed.title,
    log
  );

  // 7. Prepara documento Sanity
  log('📄 Preparazione documento Sanity...');
  
  const authorId = await getDefaultAuthorId();
  const categoryId = await getCategoryIdBySlug(categorySlug);
  
  if (!authorId) {
    throw new Error('Nessun autore trovato in Sanity. Crea prima un autore.');
  }

  // Converti markdown (con link Amazon + internal) in block content
  const bodyBlocks = markdownToBlockContent(contentWithInternalLinks);

  // Calcola reading time e likes random
  const wordCount = parsed.content.split(/\s+/).length;
  const readingTime = Math.max(
    CONFIG.readingTimeMin,
    Math.min(CONFIG.readingTimeMax, Math.ceil(wordCount / 200))
  );
  const initialLikes = Math.floor(
    Math.random() * (CONFIG.initialLikesMax - CONFIG.initialLikesMin + 1)
  ) + CONFIG.initialLikesMin;

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
    initialLikes,
    seoTitle: parsed.title,
    seoDescription: parsed.excerpt,
    seoKeywords: parsed.keywords || [],
    status: 'published',
    publishedAt: CONFIG.publishImmediately ? new Date().toISOString() : null
  };

  // Aggiungi immagine se disponibile
  if (mainImageAsset) {
    sanityDocument.mainImage = mainImageAsset;
    
    // Aggiungi credito immagine alla fine del body
    if (imageCredit && imageSource === 'unsplash') {
      const creditBlock = {
        _type: 'block',
        _key: 'image-credit',
        style: 'normal',
        markDefs: [],
        children: [{
          _type: 'span',
          _key: 'credit-span',
          text: `📷 Foto di ${imageCredit.name} su Unsplash`,
          marks: []
        }]
      };
      sanityDocument.body.push(creditBlock);
    }
  }

  // 8. Valida documento
  const validation = validatePostDocument(sanityDocument);
  if (!validation.valid) {
    console.error('❌ Validazione fallita:', validation.errors);
    throw new Error(`Documento non valido: ${validation.errors.join(', ')}`);
  }

  // 9. Crea in Sanity
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
    log(`   🛒 Prodotti linkati: ${parsed.products?.length || 0}`);
    if (mainImageAsset) {
      log(`   📸 Immagine: ✅ (${imageSource === 'unsplash' ? 'Unsplash' : 'Fallback locale'})`);
    } else {
      log(`   📸 Immagine: ❌ (nessuna disponibile)`);
    }
    log(`   📅 Stato: ${CONFIG.publishImmediately ? 'Pubblicato' : 'Bozza'}`);
    log(`   🆔 ID: ${created._id}`);
    
    return {
      ...created,
      wordCount,
      hasImage: !!mainImageAsset,
      imageSource,
      linkedProducts: parsed.products?.length || 0
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
  const categoryImages = {
    'tecniche-di-pesca': ['fishing technique', 'angler casting', 'how to fish'],
    'attrezzature': ['fishing gear closeup', 'rod reel detail', 'tackle box'],
    'consigli': ['fishing tips', 'angler learning', 'fishing guide'],
    'spot-di-pesca': ['fishing spot sea', 'shore angler', 'coastline fishing']
  };
  const fallbacks = ['fishing action', 'angler outdoors', 'shore fishing', 'boat fishing', 'mediterranean fishing'];
  
  const mainWords = keyword
    .toLowerCase()
    .replace(/come|guida|completa|migliori|consigli|tecniche|per|la|il|di|da|in|con|a/gi, '')
    .trim()
    .split(/\s+/)
    .filter(w => w.length > 3)
    .slice(0, 3)
    .join(' ');
  
  const pool = [
    ...(categoryImages[category] || fallbacks),
    mainWords || keyword,
    'fishing'
  ].filter(Boolean);
  
  const primary = pickRandom(pool);
  const secondary = pickRandom(pool);
  return `${primary} ${secondary}`.trim();
}

/**
 * Recupera articoli interni per linking
 */
async function getInternalLinks(categorySlug, excludeSlug, limit = 3) {
  try {
    const posts = await sanityClient.fetch(
      `
      *[_type == "post" && status == "published" && defined(slug.current) && slug.current != $exclude && publishedAt <= now() && ($categorySlug in categories[]->slug.current)] 
      | order(publishedAt desc) [0...12] {
        title,
        "slug": slug.current,
        excerpt
      }
    `,
      { exclude: excludeSlug, categorySlug }
    );
    if (!posts || posts.length === 0) return [];
    const shuffled = [...posts].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, limit);
  } catch (error) {
    console.error('❌ Errore fetch internal links:', error.message);
    return [];
  }
}

/**
 * Appende blocco "Approfondisci" al markdown
 */
function appendInternalLinks(content, links) {
  if (!links || links.length === 0) return content;
  const lines = links.map((l) => {
    const teaser = l.excerpt ? ` – ${l.excerpt.slice(0, 120)}...` : '';
    return `- [${l.title}](https://fishandtips.it/articoli/${l.slug})${teaser}`;
  });
  return `${content}\n\n## Approfondisci\n${lines.join('\n')}\n`;
}

function buildTldrBlock(keyword, excerpt) {
  const summary = excerpt && excerpt.length > 0
    ? excerpt
    : `In questa guida su "${keyword}" trovi quando usarla, come impostare l'attrezzatura e gli errori da evitare.`;
  return `## In breve\n${summary}`;
}

function buildFreshnessBlock() {
  const now = new Date();
  const monthYear = now.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  return `> Ultimo aggiornamento: ${monthYear} – contenuti e tecniche attuali.`;
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
