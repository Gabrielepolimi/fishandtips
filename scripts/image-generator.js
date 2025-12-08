/**
 * 🖼️ FishandTips - Image Generator
 * 
 * Converte HTML templates in immagini PNG per Instagram
 * Usa Puppeteer per rendering pixel-perfect
 * 
 * Dimensioni output: 1080x1350 (formato Instagram carousel)
 */

import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIGURAZIONE =====
const CONFIG = {
  viewport: {
    width: 1080,
    height: 1350,
    deviceScaleFactor: 1
  },
  outputDir: path.join(__dirname, '..', 'data', 'carousel-images'),
  imageFormat: 'png',
  imageQuality: 100
};

/**
 * Inizializza browser Puppeteer
 */
async function initBrowser() {
  return await puppeteer.launch({
    headless: 'new',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu'
    ]
  });
}

/**
 * Genera immagine da HTML
 * @param {string} html - HTML completo della slide
 * @param {string} outputPath - Path di output per l'immagine
 * @returns {Promise<string>} Path dell'immagine generata
 */
export async function htmlToImage(html, outputPath) {
  const browser = await initBrowser();
  
  try {
    const page = await browser.newPage();
    
    // Imposta viewport per Instagram
    await page.setViewport(CONFIG.viewport);
    
    // Carica HTML con timeout aumentato
    await page.setContent(html, {
      waitUntil: 'domcontentloaded',
      timeout: 60000 // 60 secondi
    });
    
    // Attendi che i font siano caricati (con timeout)
    try {
      await page.evaluateHandle('document.fonts.ready');
    } catch (e) {
      console.log('   ⚠️ Font loading timeout, continuando...');
    }
    
    // Attendi un po' per le immagini di sfondo
    await new Promise(r => setTimeout(r, 500));
    
    // Screenshot
    await page.screenshot({
      path: outputPath,
      type: CONFIG.imageFormat,
      clip: {
        x: 0,
        y: 0,
        width: CONFIG.viewport.width,
        height: CONFIG.viewport.height
      }
    });
    
    console.log(`   ✅ Immagine salvata: ${path.basename(outputPath)}`);
    
    return outputPath;
    
  } finally {
    await browser.close();
  }
}

/**
 * Genera tutte le immagini del carousel
 * @param {Array} slides - Array di slide con HTML
 * @param {string} carouselId - ID univoco del carousel
 * @returns {Promise<Array>} Array di path delle immagini generate
 */
export async function generateCarouselImages(slides, carouselId) {
  console.log('\n' + '🖼️'.repeat(20));
  console.log('GENERAZIONE IMMAGINI CAROUSEL');
  console.log('🖼️'.repeat(20));
  console.log(`\n📁 Carousel ID: ${carouselId}`);
  console.log(`📊 Slide da generare: ${slides.length}\n`);
  
  // Crea directory output se non esiste
  const outputDir = path.join(CONFIG.outputDir, carouselId);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const browser = await initBrowser();
  const imagePaths = [];
  
  try {
    const page = await browser.newPage();
    await page.setViewport(CONFIG.viewport);
    
    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const outputPath = path.join(outputDir, `slide-${i + 1}.png`);
      
      console.log(`[${i + 1}/${slides.length}] Generando slide ${slide.type}...`);
      
      // Carica HTML con timeout aumentato
      await page.setContent(slide.html, {
        waitUntil: 'domcontentloaded',
        timeout: 60000 // 60 secondi
      });
      
      // Attendi font e immagini (con gestione errori)
      try {
        await page.evaluateHandle('document.fonts.ready');
      } catch (e) {
        // Font timeout, continua comunque
      }
      await new Promise(r => setTimeout(r, 500));
      
      // Screenshot
      await page.screenshot({
        path: outputPath,
        type: CONFIG.imageFormat,
        clip: {
          x: 0,
          y: 0,
          width: CONFIG.viewport.width,
          height: CONFIG.viewport.height
        }
      });
      
      console.log(`   ✅ ${path.basename(outputPath)}`);
      imagePaths.push(outputPath);
    }
    
  } finally {
    await browser.close();
  }
  
  console.log(`\n✅ ${imagePaths.length} immagini generate in: ${outputDir}`);
  
  return imagePaths;
}

/**
 * Genera carousel completo da dati e foto
 * @param {Object} carouselData - Dati del carousel (da AI)
 * @param {Array} photos - Foto da Unsplash
 * @returns {Promise<Object>} Risultato con path immagini
 */
export async function generateFullCarousel(carouselData, photos, templates) {
  const carouselId = `carousel-${Date.now()}`;
  
  // Genera HTML per ogni slide
  const slidesHTML = templates.generateAllSlideHTML(carouselData, photos);
  
  // Genera immagini
  const imagePaths = await generateCarouselImages(slidesHTML, carouselId);
  
  return {
    carouselId,
    imagePaths,
    outputDir: path.join(CONFIG.outputDir, carouselId),
    slides: slidesHTML.map((s, i) => ({
      ...s,
      imagePath: imagePaths[i]
    }))
  };
}

/**
 * Test generazione singola slide
 */
export async function testSingleSlide() {
  const testHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@700;800&display=swap');
    
    .slide {
      width: 1080px;
      height: 1350px;
      background: linear-gradient(135deg, #0c4a6e 0%, #0284c7 100%);
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      font-family: 'Poppins', sans-serif;
      color: white;
      text-align: center;
      padding: 60px;
    }
    
    .emoji {
      font-size: 100px;
      margin-bottom: 40px;
    }
    
    .title {
      font-size: 72px;
      font-weight: 800;
      margin-bottom: 20px;
      text-transform: uppercase;
    }
    
    .subtitle {
      font-size: 36px;
      opacity: 0.9;
    }
    
    .brand {
      position: absolute;
      bottom: 50px;
      font-size: 28px;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="slide">
    <div class="emoji">🎣</div>
    <h1 class="title">5 ERRORI</h1>
    <p class="subtitle">che il 90% dei pescatori fa</p>
    <div class="brand">@fishandtips.it</div>
  </div>
</body>
</html>
  `;
  
  const outputDir = path.join(CONFIG.outputDir, 'test');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const outputPath = path.join(outputDir, 'test-slide.png');
  
  console.log('\n🧪 Test generazione immagine...\n');
  
  await htmlToImage(testHTML, outputPath);
  
  console.log(`\n✅ Test completato!`);
  console.log(`📁 Output: ${outputPath}`);
  
  return outputPath;
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === '--test') {
    await testSingleSlide();
    return;
  }
  
  console.log(`
🖼️ FishandTips Image Generator
================================

Converte HTML templates in immagini PNG per Instagram.

Uso:
  node scripts/image-generator.js --test    Test generazione singola slide

Questo modulo viene usato automaticamente dalla pipeline Instagram.
`);
}

// Solo esegui main() se questo file è il punto di ingresso
if (process.argv[1]?.includes('image-generator.js')) {
  main().catch(console.error);
}

export default {
  htmlToImage,
  generateCarouselImages,
  generateFullCarousel,
  testSingleSlide
};

