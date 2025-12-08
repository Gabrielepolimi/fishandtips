import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

import { generatePinContent } from './pinterest-content-generator.js';
import { generatePinImage } from './pinterest-image-generator.js';
import { searchPhotos } from './unsplash-service.js';
import { uploadToCloudinary } from './cloudinary-service.js';
import { getLatestArticles, getArticleBySlug } from './sanity-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// PINTEREST RSS GENERATOR
// Genera pin e li salva per il feed RSS
// ============================================

const PINS_DATA_PATH = path.join(__dirname, '../data/pinterest-pins.json');

/**
 * Carica i pin esistenti
 */
function loadPins() {
  try {
    if (fs.existsSync(PINS_DATA_PATH)) {
      const data = fs.readFileSync(PINS_DATA_PATH, 'utf-8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('⚠️ Errore caricamento pin:', error.message);
  }
  return { pins: [], lastUpdated: new Date().toISOString() };
}

/**
 * Salva i pin
 */
function savePins(data) {
  data.lastUpdated = new Date().toISOString();
  fs.writeFileSync(PINS_DATA_PATH, JSON.stringify(data, null, 2));
  console.log(`✅ Pin salvati: ${data.pins.length} totali`);
}

/**
 * Verifica se un pin per l'articolo esiste già
 */
function pinExistsForArticle(pins, articleSlug) {
  return pins.some(p => p.articleSlug === articleSlug);
}

/**
 * Genera un pin per un articolo e lo salva
 */
export async function generatePinForArticle(articleSlug) {
  console.log('\n📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌');
  console.log('PINTEREST RSS GENERATOR');
  console.log('📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌\n');

  // Carica pin esistenti
  const data = loadPins();
  
  // Verifica se esiste già
  if (pinExistsForArticle(data.pins, articleSlug)) {
    console.log(`⚠️ Pin già esistente per: ${articleSlug}`);
    return { success: false, reason: 'Pin già esistente' };
  }

  // 1. Recupera articolo
  console.log(`📝 Recupero articolo: ${articleSlug}`);
  const article = await getArticleBySlug(articleSlug);
  
  if (!article) {
    throw new Error(`❌ Articolo non trovato: ${articleSlug}`);
  }
  console.log(`   ✅ Trovato: ${article.title}\n`);

  // 2. Genera contenuto pin
  const pinContent = await generatePinContent({
    title: article.title,
    excerpt: article.excerpt,
    category: article.categories?.[0]?.slug || 'pesca',
    slug: article.slug
  });

  // 3. Cerca immagine su Unsplash
  console.log('\n🖼️ Ricerca immagine su Unsplash...');
  const keywords = Array.isArray(pinContent.imageKeywords) 
    ? pinContent.imageKeywords 
    : ['fishing', 'sea'];
  const photosResult = await searchPhotos(keywords.slice(0, 3).join(' '), { perPage: 1 });
  const photos = photosResult.map(p => p.url);
  
  if (!photos || photos.length === 0) {
    throw new Error('❌ Nessuna immagine trovata su Unsplash');
  }
  const photoUrl = photos[0];
  console.log(`   ✅ Immagine trovata`);

  // 4. Genera immagine pin
  const outputDir = path.join(__dirname, '../data/pinterest-images');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  const imagePath = path.join(outputDir, `pin-${Date.now()}.png`);
  
  await generatePinImage({
    overlayText: pinContent.overlayText,
    imageUrl: photoUrl,
    location: 'Italia'
  }, imagePath, 'default');

  // 5. Upload su Cloudinary
  console.log('\n☁️ Upload su Cloudinary...');
  const cloudinaryResult = await uploadToCloudinary(imagePath, 'pinterest-pins');
  const cloudinaryUrl = cloudinaryResult.url;
  console.log(`   ✅ URL: ${cloudinaryUrl.substring(0, 50)}...`);

  // 6. Crea oggetto pin
  const newPin = {
    id: `pin-${Date.now()}`,
    title: pinContent.title,
    description: pinContent.description,
    imageUrl: cloudinaryUrl,
    link: pinContent.link,
    board: pinContent.boardName,
    category: article.categories?.[0]?.slug || 'pesca',
    createdAt: new Date().toISOString(),
    articleSlug: article.slug
  };

  // 7. Salva pin
  data.pins.unshift(newPin); // Aggiungi in cima
  savePins(data);

  // 8. Pulizia file locale
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  console.log('\n✅✅✅ PIN GENERATO E SALVATO! ✅✅✅');
  console.log(`   📌 ID: ${newPin.id}`);
  console.log(`   📋 Bacheca: ${newPin.board}`);
  console.log(`   🔗 Link: ${newPin.link}`);
  console.log(`   🖼️ Immagine: ${newPin.imageUrl}`);
  console.log('\n📡 Il pin sarà disponibile nel feed RSS!');

  return {
    success: true,
    pin: newPin
  };
}

/**
 * Genera pin per gli ultimi N articoli
 */
export async function generatePinsForLatestArticles(count = 3) {
  console.log(`\n📚 Recupero ultimi ${count} articoli...`);
  
  const articles = await getLatestArticles(count);
  
  if (!articles || articles.length === 0) {
    console.log('❌ Nessun articolo trovato');
    return [];
  }

  console.log(`   ✅ Trovati ${articles.length} articoli\n`);

  const data = loadPins();
  const results = [];
  
  for (const article of articles) {
    // Skip se pin già esiste
    if (pinExistsForArticle(data.pins, article.slug)) {
      console.log(`⏭️ Skip: ${article.slug} (pin esistente)`);
      results.push({ article: article.slug, success: false, reason: 'Pin già esistente' });
      continue;
    }

    try {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      const result = await generatePinForArticle(article.slug);
      results.push({ article: article.slug, ...result });
      
      // Ricarica dati dopo ogni pin
      Object.assign(data, loadPins());
      
      // Pausa tra i pin
      if (articles.indexOf(article) < articles.length - 1) {
        console.log('\n⏳ Pausa 10 secondi...');
        await new Promise(resolve => setTimeout(resolve, 10000));
      }
    } catch (error) {
      console.error(`❌ Errore per ${article.slug}:`, error.message);
      results.push({ article: article.slug, success: false, error: error.message });
    }
  }

  // Report finale
  console.log('\n📊 REPORT FINALE');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  const successful = results.filter(r => r.success).length;
  const skipped = results.filter(r => r.reason === 'Pin già esistente').length;
  const failed = results.filter(r => !r.success && r.error).length;
  console.log(`✅ Generati: ${successful}`);
  console.log(`⏭️ Skippati: ${skipped}`);
  console.log(`❌ Falliti: ${failed}`);
  console.log(`📌 Pin totali nel feed: ${loadPins().pins.length}`);

  return results;
}

/**
 * Mostra stato attuale del feed
 */
export function showFeedStatus() {
  const data = loadPins();
  console.log('\n📊 STATO FEED PINTEREST');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📌 Pin totali: ${data.pins.length}`);
  console.log(`🕐 Ultimo aggiornamento: ${data.lastUpdated}`);
  
  if (data.pins.length > 0) {
    console.log('\n📋 Ultimi 5 pin:');
    data.pins.slice(0, 5).forEach((pin, i) => {
      console.log(`   ${i + 1}. ${pin.title.substring(0, 50)}...`);
    });
  }
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
📌 Pinterest RSS Generator - FishandTips

Uso:
  node pinterest-rss-generator.js [opzioni]

Opzioni:
  --article <slug>    Genera pin per un articolo specifico
  --latest <n>        Genera pin per gli ultimi N articoli (default: 3)
  --status            Mostra stato del feed
  --help              Mostra questo aiuto

Esempi:
  node pinterest-rss-generator.js --article come-pescare-spigola
  node pinterest-rss-generator.js --latest 5
  node pinterest-rss-generator.js --status
    `);
    return;
  }

  if (args.includes('--status')) {
    showFeedStatus();
    return;
  }
  
  if (args.includes('--article')) {
    const slugIndex = args.indexOf('--article') + 1;
    const slug = args[slugIndex];
    
    if (!slug) {
      console.error('❌ Specifica lo slug dell\'articolo');
      process.exit(1);
    }
    
    await generatePinForArticle(slug);
  } 
  else {
    const countIndex = args.indexOf('--latest');
    const count = countIndex !== -1 ? parseInt(args[countIndex + 1]) || 3 : 3;
    
    await generatePinsForLatestArticles(count);
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

