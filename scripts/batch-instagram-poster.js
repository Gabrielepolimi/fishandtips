/**
 * 🚀 FishandTips - Batch Instagram Poster
 * 
 * Pubblica batch di carousel su Instagram
 * Supporta scheduling e posting automatico
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runPipeline } from './instagram-pipeline.js';
import { generateWeeklyPlan, generateWeeklyContent, savePlan, loadPlan } from './weekly-content-planner.js';
import { generateAdvancedCarousel } from './advanced-carousel-generator.js';
import { searchFishingPhotos } from './unsplash-service.js';
import { generateAllSlideHTML } from './carousel-templates.js';
import { generateCarouselImages } from './image-generator.js';
import { uploadMultipleImages } from './cloudinary-service.js';
import { publishCarouselPost, checkConfig as checkInstagramConfig } from './instagram-api.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIGURAZIONE =====
const CONFIG = {
  outputDir: path.join(__dirname, '..', 'data', 'batch-posts'),
  delayBetweenPosts: 60000, // 1 minuto tra i post (per evitare rate limits)
  maxPostsPerBatch: 7
};

/**
 * Pubblica un singolo carousel generato
 */
async function publishCarousel(carouselData, options = {}) {
  const { dryRun = false, carouselId } = options;
  
  const id = carouselId || `carousel-${Date.now()}`;
  
  console.log('\n' + '🚀'.repeat(20));
  console.log(`PUBBLICAZIONE: ${id}`);
  console.log('🚀'.repeat(20));
  
  try {
    // 1. Cerca foto
    console.log('\n📸 Ricerca foto Unsplash...');
    let photoKeywords = carouselData.photoKeywords || carouselData.metadata?.topic || 'fishing';
    // Assicurati che sia un array
    if (typeof photoKeywords === 'string') {
      photoKeywords = photoKeywords.split(/[,\s]+/).filter(k => k.length > 2);
    }
    const photos = await searchFishingPhotos(photoKeywords);
    console.log(`   ✅ ${photos.length} foto trovate`);
    
    // 2. Genera HTML
    console.log('\n📄 Generazione template HTML...');
    const slidesHTML = generateAllSlideHTML(carouselData, photos);
    console.log(`   ✅ ${slidesHTML.length} template generati`);
    
    // 3. Genera immagini
    console.log('\n🖼️ Rendering immagini PNG...');
    const imagePaths = await generateCarouselImages(slidesHTML, id);
    console.log(`   ✅ ${imagePaths.length} immagini create`);
    
    // 4. Upload Cloudinary
    console.log('\n☁️ Upload su Cloudinary...');
    const cloudinaryUrls = await uploadMultipleImages(imagePaths, `fishandtips/instagram/${id}`);
    console.log(`   ✅ ${cloudinaryUrls.length} immagini caricate`);
    
    // 5. Pubblica su Instagram
    if (dryRun) {
      console.log('\n⏭️ DRY RUN - Pubblicazione saltata');
      return { success: true, dryRun: true, imagePaths, cloudinaryUrls };
    }
    
    if (!checkInstagramConfig()) {
      console.log('\n⚠️ Instagram non configurato');
      return { success: false, reason: 'not_configured' };
    }
    
    console.log('\n📱 Pubblicazione su Instagram...');
    const fullCaption = `${carouselData.caption}\n\n${carouselData.hashtags.map(h => `#${h}`).join(' ')}`;
    const igResult = await publishCarouselPost(cloudinaryUrls, fullCaption);
    
    console.log('\n✅ PUBBLICATO CON SUCCESSO!');
    console.log(`   Media ID: ${igResult.mediaId}`);
    
    return {
      success: true,
      mediaId: igResult.mediaId,
      imagePaths,
      cloudinaryUrls
    };
    
  } catch (error) {
    console.error(`\n❌ Errore: ${error.message}`);
    return { success: false, error: error.message };
  }
}

/**
 * Pubblica batch di post dal piano settimanale
 */
export async function publishWeeklyBatch(plan, options = {}) {
  const { dryRun = false, startFromDay = 1, endAtDay = 7 } = options;
  
  console.log('\n' + '📅'.repeat(30));
  console.log('BATCH PUBLISHING - PIANO SETTIMANALE');
  console.log('📅'.repeat(30));
  console.log(`\n🔧 Dry Run: ${dryRun ? 'SÌ' : 'NO'}`);
  console.log(`📊 Post da ${startFromDay} a ${endAtDay}`);
  
  const results = [];
  const postsToPublish = plan.filter(p => 
    p.dayNumber >= startFromDay && 
    p.dayNumber <= endAtDay &&
    p.carousel
  );
  
  console.log(`\n📝 Post pronti: ${postsToPublish.length}`);
  
  for (let i = 0; i < postsToPublish.length; i++) {
    const post = postsToPublish[i];
    
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`[${i + 1}/${postsToPublish.length}] ${post.day} - ${post.topic}`);
    console.log('═'.repeat(60));
    
    const result = await publishCarousel(post.carousel, {
      dryRun,
      carouselId: `${post.day.toLowerCase()}-${Date.now()}`
    });
    
    results.push({
      ...post,
      publishResult: result,
      publishedAt: result.success ? new Date().toISOString() : null
    });
    
    // Pausa tra i post
    if (i < postsToPublish.length - 1 && !dryRun) {
      console.log(`\n⏳ Attesa ${CONFIG.delayBetweenPosts / 1000}s prima del prossimo post...`);
      await new Promise(r => setTimeout(r, CONFIG.delayBetweenPosts));
    }
  }
  
  // Riepilogo
  console.log('\n' + '📊'.repeat(30));
  console.log('RIEPILOGO BATCH');
  console.log('📊'.repeat(30));
  
  const successful = results.filter(r => r.publishResult?.success);
  const failed = results.filter(r => !r.publishResult?.success);
  
  console.log(`\n✅ Successi: ${successful.length}`);
  console.log(`❌ Falliti: ${failed.length}`);
  
  if (failed.length > 0) {
    console.log('\nPost falliti:');
    failed.forEach(f => {
      console.log(`   - ${f.day}: ${f.publishResult?.error || 'Errore sconosciuto'}`);
    });
  }
  
  return results;
}

/**
 * Genera e pubblica un singolo post con opzioni
 */
export async function generateAndPublishSingle(options) {
  const {
    contentType = 'tutorial',
    topic,
    tone,
    dryRun = false
  } = options;
  
  console.log('\n🎨 Generazione carousel...');
  const carousel = await generateAdvancedCarousel({
    contentType,
    topic,
    tone
  });
  
  return publishCarousel(carousel, { dryRun });
}

/**
 * Pubblica da file JSON esistente
 */
export async function publishFromFile(filepath, options = {}) {
  const { dryRun = false, postIndex } = options;
  
  console.log(`\n📂 Caricamento piano da: ${filepath}`);
  const plan = loadPlan(filepath);
  
  if (typeof postIndex === 'number') {
    // Pubblica singolo post
    const post = plan[postIndex];
    if (!post) {
      throw new Error(`Post index ${postIndex} non trovato`);
    }
    return publishCarousel(post.carousel, { dryRun });
  }
  
  // Pubblica tutti
  return publishWeeklyBatch(plan, { dryRun });
}

/**
 * Workflow completo: genera + pubblica settimana
 */
export async function fullWeeklyWorkflow(options = {}) {
  const { dryRun = false, saveOnly = false } = options;
  
  console.log('\n' + '🚀'.repeat(30));
  console.log('WORKFLOW SETTIMANALE COMPLETO');
  console.log('🚀'.repeat(30));
  
  // 1. Genera piano
  console.log('\n📅 Step 1: Generazione piano settimanale...');
  const plan = generateWeeklyPlan();
  
  // 2. Genera contenuti
  console.log('\n🎨 Step 2: Generazione contenuti...');
  const generatedPlan = await generateWeeklyContent(plan);
  
  // 3. Salva piano
  const savedPath = savePlan(generatedPlan);
  
  if (saveOnly) {
    console.log('\n✅ Piano generato e salvato!');
    console.log(`📁 File: ${savedPath}`);
    return { plan: generatedPlan, savedPath };
  }
  
  // 4. Pubblica
  console.log('\n📱 Step 3: Pubblicazione su Instagram...');
  const results = await publishWeeklyBatch(generatedPlan, { dryRun });
  
  // 5. Aggiorna piano con risultati
  const finalPlan = generatedPlan.map((p, i) => ({
    ...p,
    publishResult: results[i]?.publishResult
  }));
  
  savePlan(finalPlan, `published-${new Date().toISOString().split('T')[0]}`);
  
  return { plan: finalPlan, results };
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🚀 FishandTips Batch Instagram Poster
======================================

Pubblica carousel su Instagram in batch.

Uso:
  node scripts/batch-instagram-poster.js --single --type <tipo> --topic "<topic>" [--tone <tono>] [--dry-run]
  node scripts/batch-instagram-poster.js --weekly [--save-only] [--dry-run]
  node scripts/batch-instagram-poster.js --from-file <path> [--index <n>] [--dry-run]

Opzioni:
  --single     Genera e pubblica un singolo post
  --weekly     Workflow completo settimanale
  --from-file  Pubblica da file JSON esistente
  --save-only  Solo genera, non pubblica
  --dry-run    Testa senza pubblicare
  --index      Indice specifico del post (con --from-file)

Tipi: tutorial, comparison, mistakes, quiz, toplist, meme, story
Toni: expert, friendly, provocative, storytelling, funny

Esempi:
  node scripts/batch-instagram-poster.js --single --type mistakes --topic "pesca alla spigola" --dry-run
  node scripts/batch-instagram-poster.js --weekly --save-only
  node scripts/batch-instagram-poster.js --weekly --dry-run
  node scripts/batch-instagram-poster.js --from-file ./data/weekly-plans/week-2024-01-15.json
`);
    return;
  }
  
  const dryRun = args.includes('--dry-run');
  const saveOnly = args.includes('--save-only');
  
  const getArg = (name) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : null;
  };
  
  if (args[0] === '--single') {
    const contentType = getArg('type') || 'tutorial';
    const topic = getArg('topic') || 'tecniche di pesca';
    const tone = getArg('tone');
    
    const result = await generateAndPublishSingle({
      contentType,
      topic,
      tone,
      dryRun
    });
    
    console.log('\n📊 Risultato:', result.success ? '✅ Successo' : '❌ Fallito');
    return;
  }
  
  if (args[0] === '--weekly') {
    const result = await fullWeeklyWorkflow({ dryRun, saveOnly });
    console.log('\n📊 Workflow completato!');
    return;
  }
  
  if (args[0] === '--from-file') {
    const filepath = args[1];
    const postIndex = getArg('index') ? parseInt(getArg('index')) : undefined;
    
    if (!filepath) {
      console.error('❌ Specifica il path del file');
      return;
    }
    
    const result = await publishFromFile(filepath, { dryRun, postIndex });
    console.log('\n📊 Pubblicazione completata!');
    return;
  }
  
  console.log('❌ Comando non riconosciuto. Usa --help per aiuto.');
}

main().catch(console.error);

export default {
  publishCarousel,
  publishWeeklyBatch,
  generateAndPublishSingle,
  publishFromFile,
  fullWeeklyWorkflow
};

