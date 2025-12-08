import 'dotenv/config';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

import { generatePinContent, generateSpotPinContent, generateFishPinContent, PINTEREST_BOARDS } from './pinterest-content-generator.js';
import { generatePinImage } from './pinterest-image-generator.js';
import { searchUnsplashPhotos } from './unsplash-service.js';
import { uploadImage } from './cloudinary-service.js';
import { publishPinToBoard, verifyToken } from './pinterest-api.js';
import { getLatestArticles, getArticleBySlug } from './sanity-helpers.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// PINTEREST AUTOMATION PIPELINE
// Genera e pubblica pin automaticamente
// ============================================

/**
 * Pipeline completa per un singolo articolo
 */
export async function runPinterestPipeline(articleSlug, options = {}) {
  console.log('\n📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌');
  console.log('PINTEREST AUTOMATION PIPELINE');
  console.log('📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌📌\n');

  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  const dryRun = options.dryRun || false;

  // 1. Verifica token (se non in dry-run)
  if (!dryRun) {
    if (!accessToken) {
      throw new Error('❌ PINTEREST_ACCESS_TOKEN non configurato!');
    }
    
    console.log('🔑 Verifica token Pinterest...');
    const isValid = await verifyToken(accessToken);
    if (!isValid) {
      throw new Error('❌ Token Pinterest non valido!');
    }
    console.log('   ✅ Token valido!\n');
  }

  // 2. Recupera articolo
  console.log(`📝 Recupero articolo: ${articleSlug}`);
  const article = await getArticleBySlug(articleSlug);
  
  if (!article) {
    throw new Error(`❌ Articolo non trovato: ${articleSlug}`);
  }
  console.log(`   ✅ Trovato: ${article.title}\n`);

  // 3. Genera contenuto pin
  const pinContent = await generatePinContent({
    title: article.title,
    excerpt: article.excerpt,
    category: article.categories?.[0]?.slug || 'pesca',
    slug: article.slug
  });

  // 4. Cerca immagine su Unsplash
  console.log('\n🖼️ Ricerca immagine su Unsplash...');
  const keywords = Array.isArray(pinContent.imageKeywords) 
    ? pinContent.imageKeywords 
    : ['fishing', 'sea'];
  const photos = await searchUnsplashPhotos(keywords.slice(0, 3).join(' '), 1);
  
  if (!photos || photos.length === 0) {
    throw new Error('❌ Nessuna immagine trovata su Unsplash');
  }
  const photoUrl = photos[0];
  console.log(`   ✅ Immagine trovata: ${photoUrl.substring(0, 50)}...`);

  // 5. Genera immagine pin
  const outputDir = path.join(__dirname, '../data/pinterest-images');
  const imagePath = path.join(outputDir, `pin-${Date.now()}.png`);
  
  await generatePinImage({
    overlayText: pinContent.overlayText,
    imageUrl: photoUrl,
    location: 'Italia'
  }, imagePath, 'default');

  // 6. Upload su Cloudinary
  console.log('\n☁️ Upload su Cloudinary...');
  const cloudinaryUrl = await uploadImage(imagePath, 'pinterest-pins');
  console.log(`   ✅ URL: ${cloudinaryUrl.substring(0, 50)}...`);

  // 7. Pubblica su Pinterest (se non dry-run)
  if (dryRun) {
    console.log('\n🔄 DRY RUN - Pin NON pubblicato');
    console.log('\n📊 Riepilogo:');
    console.log(`   📌 Titolo: ${pinContent.title}`);
    console.log(`   📋 Bacheca: ${pinContent.boardName}`);
    console.log(`   🔗 Link: ${pinContent.link}`);
    console.log(`   🖼️ Immagine: ${cloudinaryUrl}`);
    
    return {
      success: true,
      dryRun: true,
      pinContent,
      imageUrl: cloudinaryUrl
    };
  }

  console.log('\n📌 Pubblicazione su Pinterest...');
  const result = await publishPinToBoard(
    accessToken,
    pinContent.boardName,
    pinContent,
    cloudinaryUrl
  );

  console.log('\n✅✅✅ PIN PUBBLICATO CON SUCCESSO! ✅✅✅');
  console.log(`   📌 Pin ID: ${result.pin.id}`);
  console.log(`   📋 Bacheca: ${result.board.name}`);
  console.log(`   🔗 Link: ${pinContent.link}`);

  // Pulizia file locale
  if (fs.existsSync(imagePath)) {
    fs.unlinkSync(imagePath);
  }

  return {
    success: true,
    pin: result.pin,
    board: result.board,
    pinContent,
    imageUrl: cloudinaryUrl
  };
}

/**
 * Genera pin per gli ultimi N articoli
 */
export async function generatePinsFromLatestArticles(count = 5, options = {}) {
  console.log(`\n📚 Recupero ultimi ${count} articoli...`);
  
  const articles = await getLatestArticles(count);
  
  if (!articles || articles.length === 0) {
    console.log('❌ Nessun articolo trovato');
    return [];
  }

  console.log(`   ✅ Trovati ${articles.length} articoli\n`);

  const results = [];
  
  for (const article of articles) {
    try {
      console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
      const result = await runPinterestPipeline(article.slug, options);
      results.push({ article: article.slug, ...result });
      
      // Pausa tra i pin (Pinterest rate limit)
      if (articles.indexOf(article) < articles.length - 1) {
        console.log('\n⏳ Pausa 30 secondi (rate limit)...');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    } catch (error) {
      console.error(`❌ Errore per ${article.slug}:`, error.message);
      results.push({ article: article.slug, success: false, error: error.message });
    }
  }

  return results;
}

/**
 * Genera pin da dati di spot
 */
export async function generatePinFromSpot(spot, options = {}) {
  console.log(`\n📍 Generazione pin per spot: ${spot.name}`);
  
  const pinContent = await generateSpotPinContent(spot);
  
  // Cerca immagine
  const photos = await searchUnsplashPhotos(
    pinContent.imageKeywords?.slice(0, 3).join(' ') || 'fishing italy coast',
    1
  );
  
  const outputDir = path.join(__dirname, '../data/pinterest-images');
  const imagePath = path.join(outputDir, `pin-spot-${Date.now()}.png`);
  
  await generatePinImage({
    overlayText: pinContent.overlayText,
    imageUrl: photos[0],
    location: spot.region
  }, imagePath, 'spot');

  const cloudinaryUrl = await uploadImage(imagePath, 'pinterest-pins');

  if (options.dryRun) {
    return { success: true, dryRun: true, pinContent, imageUrl: cloudinaryUrl };
  }

  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  const result = await publishPinToBoard(accessToken, 'Spot Pesca Italia', pinContent, cloudinaryUrl);

  // Pulizia
  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

  return { success: true, ...result };
}

/**
 * Genera pin da dati di pesce
 */
export async function generatePinFromFish(fish, options = {}) {
  console.log(`\n🐟 Generazione pin per pesce: ${fish.name}`);
  
  const pinContent = await generateFishPinContent(fish);
  
  const photos = await searchUnsplashPhotos(
    pinContent.imageKeywords?.slice(0, 3).join(' ') || `${fish.name} fish mediterranean`,
    1
  );
  
  const outputDir = path.join(__dirname, '../data/pinterest-images');
  const imagePath = path.join(outputDir, `pin-fish-${Date.now()}.png`);
  
  await generatePinImage({
    overlayText: pinContent.overlayText,
    imageUrl: photos[0]
  }, imagePath, 'default');

  const cloudinaryUrl = await uploadImage(imagePath, 'pinterest-pins');

  if (options.dryRun) {
    return { success: true, dryRun: true, pinContent, imageUrl: cloudinaryUrl };
  }

  const accessToken = process.env.PINTEREST_ACCESS_TOKEN;
  const result = await publishPinToBoard(accessToken, 'Pesci del Mediterraneo', pinContent, cloudinaryUrl);

  if (fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

  return { success: true, ...result };
}

// CLI
async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help')) {
    console.log(`
📌 Pinterest Pipeline - FishandTips

Uso:
  node pinterest-pipeline.js [opzioni]

Opzioni:
  --article <slug>    Genera pin per un articolo specifico
  --latest <n>        Genera pin per gli ultimi N articoli (default: 5)
  --dry-run           Genera contenuto senza pubblicare
  --help              Mostra questo aiuto

Esempi:
  node pinterest-pipeline.js --article come-pescare-spigola
  node pinterest-pipeline.js --latest 3
  node pinterest-pipeline.js --latest 5 --dry-run
    `);
    return;
  }

  const dryRun = args.includes('--dry-run');
  
  if (args.includes('--article')) {
    const slugIndex = args.indexOf('--article') + 1;
    const slug = args[slugIndex];
    
    if (!slug) {
      console.error('❌ Specifica lo slug dell\'articolo');
      process.exit(1);
    }
    
    await runPinterestPipeline(slug, { dryRun });
  } 
  else if (args.includes('--latest')) {
    const countIndex = args.indexOf('--latest') + 1;
    const count = parseInt(args[countIndex]) || 5;
    
    await generatePinsFromLatestArticles(count, { dryRun });
  }
  else {
    // Default: genera pin per ultimi 3 articoli in dry-run
    await generatePinsFromLatestArticles(3, { dryRun: true });
  }
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

