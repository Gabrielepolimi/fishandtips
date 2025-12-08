/**
 * 🚀 FishandTips - Instagram Pipeline Completa
 * 
 * Pipeline end-to-end: Articolo → Carousel → Instagram
 * 
 * Flusso:
 * 1. Legge articolo da Sanity
 * 2. AI genera contenuto carousel
 * 3. Unsplash cerca foto pertinenti
 * 4. Genera immagini HTML → PNG
 * 5. Upload su Cloudinary
 * 6. Pubblica su Instagram
 * 
 * Uso:
 *   node scripts/instagram-pipeline.js "slug-articolo"
 *   node scripts/instagram-pipeline.js --test
 */

import { generateFromSlug, generateCarouselContent, formatCarouselPreview } from './instagram-carousel-generator.js';
import { searchFishingPhotos, trackDownload } from './unsplash-service.js';
import { generateAllSlideHTML } from './carousel-templates.js';
import { generateCarouselImages } from './image-generator.js';
import { publishCarouselPost, checkConfig as checkInstagramConfig } from './instagram-api.js';
import { uploadToCloudinary, uploadMultipleImages, checkConfig as checkCloudinaryConfig } from './cloudinary-service.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIGURAZIONE =====
const CONFIG = {
  dryRun: false, // Se true, non pubblica su Instagram
  saveLocal: true, // Salva le immagini localmente
  outputDir: path.join(__dirname, '..', 'data', 'instagram-output')
};

/**
 * Pipeline completa: Articolo → Instagram
 * @param {string} articleSlug - Slug dell'articolo
 * @param {Object} options - Opzioni pipeline
 */
export async function runPipeline(articleSlug, options = {}) {
  const { dryRun = CONFIG.dryRun, saveLocal = CONFIG.saveLocal } = options;
  
  console.log('\n' + '🚀'.repeat(30));
  console.log('INSTAGRAM PIPELINE - AVVIO');
  console.log('🚀'.repeat(30));
  console.log(`\n📝 Articolo: ${articleSlug}`);
  console.log(`🔧 Dry Run: ${dryRun ? 'SÌ (no pubblicazione)' : 'NO (pubblica)'}`);
  console.log('\n');
  
  const startTime = Date.now();
  const result = {
    articleSlug,
    success: false,
    steps: {}
  };
  
  try {
    // ===== STEP 1: Genera contenuto carousel =====
    console.log('═'.repeat(60));
    console.log('STEP 1: Generazione contenuto AI');
    console.log('═'.repeat(60));
    
    const carousel = await generateFromSlug(articleSlug);
    result.steps.contentGeneration = { success: true, slidesCount: carousel.slides.length };
    
    console.log(formatCarouselPreview(carousel));
    
    // ===== STEP 2: Cerca foto su Unsplash =====
    console.log('\n' + '═'.repeat(60));
    console.log('STEP 2: Ricerca foto Unsplash');
    console.log('═'.repeat(60) + '\n');
    
    const photos = await searchFishingPhotos(carousel.photoKeywords);
    result.steps.photoSearch = { success: true, photosFound: photos.length };
    
    console.log(`✅ ${photos.length} foto trovate`);
    photos.forEach((p, i) => {
      console.log(`   ${i + 1}. ${p.description || 'No description'} (by ${p.author?.name})`);
    });
    
    // ===== STEP 3: Genera HTML slide =====
    console.log('\n' + '═'.repeat(60));
    console.log('STEP 3: Generazione HTML templates');
    console.log('═'.repeat(60) + '\n');
    
    const slidesHTML = generateAllSlideHTML(carousel, photos);
    result.steps.htmlGeneration = { success: true, slidesGenerated: slidesHTML.length };
    
    console.log(`✅ ${slidesHTML.length} template HTML generati`);
    
    // ===== STEP 4: Genera immagini PNG =====
    console.log('\n' + '═'.repeat(60));
    console.log('STEP 4: Rendering immagini PNG');
    console.log('═'.repeat(60) + '\n');
    
    const carouselId = `carousel-${articleSlug}-${Date.now()}`;
    const imagePaths = await generateCarouselImages(slidesHTML, carouselId);
    result.steps.imageGeneration = { success: true, imagesGenerated: imagePaths.length, localPaths: imagePaths };
    
    // ===== STEP 5: Upload su Cloudinary =====
    console.log('\n' + '═'.repeat(60));
    console.log('STEP 5: Upload Cloudinary');
    console.log('═'.repeat(60) + '\n');
    
    if (!checkCloudinaryConfig()) {
      console.log('⚠️ Cloudinary non configurato - skip upload');
      result.steps.cloudinaryUpload = { success: false, reason: 'not_configured' };
    } else {
      const cloudinaryUrls = await uploadMultipleImages(imagePaths, `fishandtips/instagram/${carouselId}`);
      result.steps.cloudinaryUpload = { success: true, urls: cloudinaryUrls };
      
      console.log(`✅ ${cloudinaryUrls.length} immagini caricate su Cloudinary`);
    }
    
    // ===== STEP 6: Pubblica su Instagram =====
    console.log('\n' + '═'.repeat(60));
    console.log('STEP 6: Pubblicazione Instagram');
    console.log('═'.repeat(60) + '\n');
    
    if (dryRun) {
      console.log('⏭️ DRY RUN - Pubblicazione saltata');
      result.steps.instagramPublish = { success: true, dryRun: true };
    } else if (!checkInstagramConfig()) {
      console.log('⚠️ Instagram non configurato - skip pubblicazione');
      result.steps.instagramPublish = { success: false, reason: 'not_configured' };
    } else if (!result.steps.cloudinaryUpload?.urls) {
      console.log('⚠️ Nessun URL Cloudinary - impossibile pubblicare');
      result.steps.instagramPublish = { success: false, reason: 'no_urls' };
    } else {
      // Prepara caption completa con hashtag
      const fullCaption = `${carousel.caption}\n\n${carousel.hashtags.map(h => `#${h}`).join(' ')}`;
      
      const igResult = await publishCarouselPost(result.steps.cloudinaryUpload.urls, fullCaption);
      result.steps.instagramPublish = { success: true, mediaId: igResult.mediaId };
    }
    
    // Track downloads Unsplash (ToS)
    for (const photo of photos) {
      if (photo.downloadLink) {
        await trackDownload(photo.downloadLink);
      }
    }
    
    // ===== RISULTATO FINALE =====
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    result.success = true;
    result.duration = elapsed;
    
    console.log('\n' + '🎉'.repeat(30));
    console.log('PIPELINE COMPLETATA CON SUCCESSO!');
    console.log('🎉'.repeat(30));
    console.log(`\n⏱️ Tempo totale: ${elapsed}s`);
    console.log('\nRiepilogo:');
    console.log(`   📝 Contenuto: ${carousel.slides.length} slide generate`);
    console.log(`   📸 Foto: ${photos.length} da Unsplash`);
    console.log(`   🖼️ Immagini: ${imagePaths.length} PNG create`);
    
    if (result.steps.instagramPublish?.mediaId) {
      console.log(`   📱 Instagram: Pubblicato (ID: ${result.steps.instagramPublish.mediaId})`);
    } else if (dryRun) {
      console.log(`   📱 Instagram: Dry run (non pubblicato)`);
    }
    
    // Salva risultato
    if (saveLocal) {
      const outputPath = path.join(CONFIG.outputDir, `${carouselId}-result.json`);
      if (!fs.existsSync(CONFIG.outputDir)) {
        fs.mkdirSync(CONFIG.outputDir, { recursive: true });
      }
      fs.writeFileSync(outputPath, JSON.stringify({ ...result, carousel }, null, 2));
      console.log(`\n💾 Risultato salvato: ${outputPath}`);
    }
    
    return result;
    
  } catch (error) {
    console.error('\n❌ ERRORE PIPELINE:', error.message);
    result.success = false;
    result.error = error.message;
    return result;
  }
}

/**
 * Pipeline di test con articolo fittizio
 */
export async function runTestPipeline() {
  console.log('\n🧪 MODALITÀ TEST - Pipeline con articolo di esempio\n');
  
  // Simula un articolo
  const testArticle = {
    _id: 'test-123',
    title: 'Come pescare la spigola: tecniche e consigli',
    excerpt: 'Guida completa alla pesca della spigola',
    bodyText: `La spigola è il predatore più ambito. 
    Tecniche: spinning, surfcasting, pesca a fondo.
    Esche migliori: muriddu, americano, artificiali.
    Periodi: autunno e primavera.
    Errori comuni: lanciare troppo lontano, ferrarsi subito.`,
    category: 'Tecniche',
    seoKeywords: ['pesca spigola', 'tecniche spigola']
  };
  
  // Genera contenuto
  const { generateCarouselContent } = await import('./instagram-carousel-generator.js');
  const carousel = await generateCarouselContent(testArticle);
  
  console.log(formatCarouselPreview(carousel));
  
  // Cerca foto
  const photos = await searchFishingPhotos(carousel.photoKeywords);
  console.log(`\n📸 ${photos.length} foto trovate per test`);
  
  // Genera HTML
  const slidesHTML = generateAllSlideHTML(carousel, photos);
  console.log(`📄 ${slidesHTML.length} template HTML generati`);
  
  // Genera immagini
  console.log('\n🖼️ Generazione immagini di test...');
  const imagePaths = await generateCarouselImages(slidesHTML, 'test-carousel');
  
  console.log('\n✅ Test completato!');
  console.log(`📁 Immagini salvate in: data/carousel-images/test-carousel/`);
  
  return { carousel, photos, imagePaths };
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🚀 FishandTips Instagram Pipeline
===================================

Pipeline completa: Articolo Sanity → Carousel Instagram

Uso:
  node scripts/instagram-pipeline.js "slug-articolo"
  node scripts/instagram-pipeline.js "slug-articolo" --dry-run
  node scripts/instagram-pipeline.js --test

Opzioni:
  --dry-run    Genera tutto ma non pubblica su Instagram
  --test       Esegui con articolo di test

Passaggi automatici:
  1. 📝 Legge articolo da Sanity
  2. 🤖 AI genera contenuto carousel (7 slide)
  3. 📸 Unsplash cerca foto pertinenti
  4. 🖼️ Genera immagini PNG (1080x1350)
  5. ☁️ Upload su Cloudinary
  6. 📱 Pubblica su Instagram

Prerequisiti:
  - GEMINI_API_KEY
  - SANITY_API_TOKEN
  - UNSPLASH_ACCESS_KEY
  - CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
  - INSTAGRAM_ACCESS_TOKEN, INSTAGRAM_ACCOUNT_ID
`);
    return;
  }
  
  if (args[0] === '--test') {
    await runTestPipeline();
    return;
  }
  
  const articleSlug = args[0];
  const dryRun = args.includes('--dry-run');
  
  await runPipeline(articleSlug, { dryRun });
}

// Solo esegui main() se questo file è il punto di ingresso
const isMainModule = process.argv[1]?.includes('instagram-pipeline.js');
if (isMainModule) {
  main().catch(console.error);
}

export default {
  runPipeline,
  runTestPipeline
};

