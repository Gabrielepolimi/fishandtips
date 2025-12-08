import 'dotenv/config';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================
// PINTEREST IMAGE GENERATOR
// Crea immagini verticali ottimizzate per Pinterest (1000x1500)
// ============================================

const PIN_WIDTH = 1000;
const PIN_HEIGHT = 1500;

/**
 * Template HTML per pin Pinterest
 */
function createPinTemplate(data) {
  const { overlayText, imageUrl, brandColor = '#1a365d' } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      width: ${PIN_WIDTH}px;
      height: ${PIN_HEIGHT}px;
      font-family: 'Nunito', sans-serif;
      overflow: hidden;
    }
    
    .pin-container {
      width: 100%;
      height: 100%;
      position: relative;
      background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 100%),
                  url('${imageUrl}') center/cover no-repeat;
    }
    
    .overlay-text {
      position: absolute;
      bottom: 120px;
      left: 50px;
      right: 50px;
      font-size: 64px;
      font-weight: 900;
      color: white;
      text-shadow: 2px 2px 8px rgba(0,0,0,0.8);
      line-height: 1.2;
      text-transform: uppercase;
    }
    
    .brand-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 80px;
      background: ${brandColor};
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
    }
    
    .brand-logo {
      font-size: 28px;
    }
    
    .brand-name {
      font-size: 32px;
      font-weight: 700;
      color: white;
      letter-spacing: 2px;
    }
    
    .top-badge {
      position: absolute;
      top: 40px;
      left: 40px;
      background: ${brandColor};
      color: white;
      padding: 15px 30px;
      font-size: 24px;
      font-weight: 700;
      border-radius: 50px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  </style>
</head>
<body>
  <div class="pin-container">
    <div class="top-badge">🎣 Guida Pesca</div>
    <div class="overlay-text">${overlayText}</div>
    <div class="brand-bar">
      <span class="brand-logo">🐟</span>
      <span class="brand-name">FISHANDTIPS.IT</span>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Template alternativo per tips/consigli
 */
function createTipsTemplate(data) {
  const { overlayText, imageUrl, tipNumber = '01' } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      width: ${PIN_WIDTH}px;
      height: ${PIN_HEIGHT}px;
      font-family: 'Nunito', sans-serif;
    }
    
    .pin-container {
      width: 100%;
      height: 100%;
      background: linear-gradient(135deg, #0c4a6e 0%, #164e63 50%, #134e4a 100%);
      display: flex;
      flex-direction: column;
      padding: 60px;
    }
    
    .header {
      display: flex;
      align-items: center;
      gap: 20px;
      margin-bottom: 40px;
    }
    
    .tip-number {
      font-size: 72px;
      font-weight: 900;
      color: #fbbf24;
    }
    
    .tip-label {
      font-size: 28px;
      color: rgba(255,255,255,0.8);
      text-transform: uppercase;
      letter-spacing: 3px;
    }
    
    .image-container {
      flex: 1;
      border-radius: 30px;
      overflow: hidden;
      margin: 30px 0;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    
    .image-container img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .text-content {
      background: rgba(255,255,255,0.1);
      border-radius: 20px;
      padding: 40px;
      backdrop-filter: blur(10px);
    }
    
    .overlay-text {
      font-size: 48px;
      font-weight: 800;
      color: white;
      line-height: 1.3;
    }
    
    .brand-footer {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-top: 40px;
      padding-top: 30px;
      border-top: 2px solid rgba(255,255,255,0.2);
    }
    
    .brand-name {
      font-size: 28px;
      font-weight: 700;
      color: white;
    }
  </style>
</head>
<body>
  <div class="pin-container">
    <div class="header">
      <span class="tip-number">#${tipNumber}</span>
      <span class="tip-label">Consiglio Pesca</span>
    </div>
    
    <div class="image-container">
      <img src="${imageUrl}" alt="Pesca">
    </div>
    
    <div class="text-content">
      <div class="overlay-text">${overlayText}</div>
    </div>
    
    <div class="brand-footer">
      <span>🐟</span>
      <span class="brand-name">FishandTips.it</span>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Template per spot di pesca
 */
function createSpotTemplate(data) {
  const { overlayText, imageUrl, location = 'Italia' } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@600;800;900&display=swap" rel="stylesheet">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    
    body {
      width: ${PIN_WIDTH}px;
      height: ${PIN_HEIGHT}px;
      font-family: 'Nunito', sans-serif;
    }
    
    .pin-container {
      width: 100%;
      height: 100%;
      position: relative;
      background: url('${imageUrl}') center/cover no-repeat;
    }
    
    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(
        180deg,
        rgba(0,0,0,0.3) 0%,
        rgba(0,0,0,0) 30%,
        rgba(0,0,0,0) 50%,
        rgba(0,0,0,0.8) 100%
      );
    }
    
    .location-badge {
      position: absolute;
      top: 40px;
      left: 40px;
      background: white;
      color: #0c4a6e;
      padding: 15px 30px;
      font-size: 24px;
      font-weight: 700;
      border-radius: 50px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    
    .content {
      position: absolute;
      bottom: 100px;
      left: 50px;
      right: 50px;
    }
    
    .spot-label {
      font-size: 24px;
      color: #fbbf24;
      text-transform: uppercase;
      letter-spacing: 3px;
      margin-bottom: 15px;
    }
    
    .overlay-text {
      font-size: 56px;
      font-weight: 900;
      color: white;
      text-shadow: 2px 2px 10px rgba(0,0,0,0.8);
      line-height: 1.2;
    }
    
    .brand-bar {
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 70px;
      background: rgba(255,255,255,0.95);
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }
    
    .brand-name {
      font-size: 26px;
      font-weight: 700;
      color: #0c4a6e;
    }
  </style>
</head>
<body>
  <div class="pin-container">
    <div class="gradient-overlay"></div>
    <div class="location-badge">
      <span>📍</span>
      <span>${location}</span>
    </div>
    <div class="content">
      <div class="spot-label">Spot di Pesca</div>
      <div class="overlay-text">${overlayText}</div>
    </div>
    <div class="brand-bar">
      <span>🐟</span>
      <span class="brand-name">FishandTips.it</span>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Genera immagine pin da HTML
 */
export async function generatePinImage(pinData, outputPath, template = 'default') {
  console.log('\n🎨 Generazione immagine pin...');
  
  // Crea directory se non esiste
  const dir = path.dirname(outputPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  // Seleziona template
  let html;
  switch (template) {
    case 'tips':
      html = createTipsTemplate(pinData);
      break;
    case 'spot':
      html = createSpotTemplate(pinData);
      break;
    default:
      html = createPinTemplate(pinData);
  }

  // Genera immagine con Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: PIN_WIDTH, height: PIN_HEIGHT });
    await page.setContent(html, { 
      waitUntil: 'networkidle0',
      timeout: 60000 
    });

    // Aspetta che le immagini si carichino
    await new Promise(resolve => setTimeout(resolve, 2000));

    await page.screenshot({ 
      path: outputPath,
      type: 'png',
      fullPage: false
    });

    console.log(`   ✅ Immagine salvata: ${outputPath}`);
    return outputPath;

  } finally {
    await browser.close();
  }
}

/**
 * Genera multipli pin per un batch
 */
export async function generatePinBatch(pins, outputDir) {
  console.log(`\n🎨 Generazione batch ${pins.length} pin...`);
  
  const results = [];
  
  for (let i = 0; i < pins.length; i++) {
    const pin = pins[i];
    const filename = `pin-${Date.now()}-${i + 1}.png`;
    const outputPath = path.join(outputDir, filename);
    
    try {
      await generatePinImage(pin, outputPath, pin.template || 'default');
      results.push({ success: true, path: outputPath, pin });
    } catch (error) {
      console.error(`   ❌ Errore pin ${i + 1}:`, error.message);
      results.push({ success: false, error: error.message, pin });
    }
    
    // Pausa tra generazioni
    if (i < pins.length - 1) {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  return results;
}

// Test
if (import.meta.url === `file://${process.argv[1]}`) {
  const testPin = {
    overlayText: 'Come Pescare la Spigola',
    imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1000',
    location: 'Sardegna'
  };

  const outputPath = path.join(__dirname, '../data/pinterest-images/test-pin.png');
  
  generatePinImage(testPin, outputPath, 'spot')
    .then(() => console.log('✅ Test completato!'))
    .catch(console.error);
}

