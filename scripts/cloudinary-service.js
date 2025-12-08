/**
 * ☁️ FishandTips - Cloudinary Service
 * 
 * Upload immagini su Cloudinary per Instagram
 * Free tier: 25GB storage, 25GB bandwidth/mese
 */

import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

// ===== CONFIGURAZIONE =====
// Le variabili vengono lette a runtime per supportare GitHub Actions
function getConfig() {
  return {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  };
}

/**
 * Inizializza Cloudinary
 */
function initCloudinary() {
  const config = getConfig();
  
  if (!config.cloudName || !config.apiKey || !config.apiSecret) {
    console.log('⚠️ Cloudinary config missing:');
    console.log('   Cloud Name:', config.cloudName ? '✅' : '❌ missing');
    console.log('   API Key:', config.apiKey ? '✅' : '❌ missing');
    console.log('   API Secret:', config.apiSecret ? '✅' : '❌ missing');
    return false;
  }
  
  cloudinary.config({
    cloud_name: config.cloudName,
    api_key: config.apiKey,
    api_secret: config.apiSecret
  });
  
  return true;
}

/**
 * Verifica configurazione
 */
export function checkConfig() {
  const config = getConfig();
  const missing = [];
  
  if (!config.cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
  if (!config.apiKey) missing.push('CLOUDINARY_API_KEY');
  if (!config.apiSecret) missing.push('CLOUDINARY_API_SECRET');
  
  if (missing.length > 0) {
    console.warn('⚠️ Configurazione Cloudinary incompleta:');
    missing.forEach(key => console.warn(`   - ${key} mancante`));
    return false;
  }
  
  return true;
}

/**
 * Upload singola immagine su Cloudinary
 * @param {string} imagePath - Path locale dell'immagine
 * @param {string} folder - Cartella su Cloudinary
 * @returns {Promise<Object>} Risultato upload
 */
export async function uploadToCloudinary(imagePath, folder = 'fishandtips/instagram') {
  if (!initCloudinary()) {
    throw new Error('Cloudinary non configurato');
  }
  
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder,
      resource_type: 'image',
      format: 'png',
      transformation: [
        { quality: 'auto:best' },
        { fetch_format: 'auto' }
      ]
    });
    
    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
      format: result.format,
      bytes: result.bytes
    };
    
  } catch (error) {
    console.error(`❌ Errore upload ${imagePath}:`, error.message);
    throw error;
  }
}

/**
 * Upload multiple immagini
 * @param {Array<string>} imagePaths - Array di path locali
 * @param {string} folder - Cartella su Cloudinary
 * @returns {Promise<Array<string>>} Array di URL pubblici
 */
export async function uploadMultipleImages(imagePaths, folder = 'fishandtips/instagram') {
  console.log(`☁️ Upload ${imagePaths.length} immagini su Cloudinary...`);
  
  const urls = [];
  
  for (let i = 0; i < imagePaths.length; i++) {
    const imagePath = imagePaths[i];
    console.log(`   [${i + 1}/${imagePaths.length}] Uploading...`);
    
    const result = await uploadToCloudinary(imagePath, folder);
    urls.push(result.url);
    
    console.log(`   ✅ ${result.url.split('/').pop()}`);
  }
  
  console.log(`\n✅ ${urls.length} immagini caricate su Cloudinary`);
  
  return urls;
}

/**
 * Elimina immagine da Cloudinary
 * @param {string} publicId - ID pubblico dell'immagine
 */
export async function deleteFromCloudinary(publicId) {
  if (!initCloudinary()) {
    throw new Error('Cloudinary non configurato');
  }
  
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return result;
  } catch (error) {
    console.error(`❌ Errore eliminazione ${publicId}:`, error.message);
    throw error;
  }
}

/**
 * Elimina cartella intera
 * @param {string} folder - Path della cartella
 */
export async function deleteFolder(folder) {
  if (!initCloudinary()) {
    throw new Error('Cloudinary non configurato');
  }
  
  try {
    // Prima elimina tutte le risorse
    await cloudinary.api.delete_resources_by_prefix(folder);
    // Poi elimina la cartella vuota
    await cloudinary.api.delete_folder(folder);
    return true;
  } catch (error) {
    console.error(`❌ Errore eliminazione cartella ${folder}:`, error.message);
    throw error;
  }
}

/**
 * Test connessione Cloudinary
 */
export async function testConnection() {
  console.log('\n☁️ Test connessione Cloudinary...\n');
  
  if (!checkConfig()) {
    return false;
  }
  
  if (!initCloudinary()) {
    console.log('❌ Inizializzazione fallita');
    return false;
  }
  
  try {
    // Test con ping API
    const result = await cloudinary.api.ping();
    
    console.log('✅ Connessione OK');
    console.log(`   Cloud Name: ${getConfig().cloudName}`);
    console.log(`   Status: ${result.status}`);
    
    // Mostra utilizzo
    const usage = await cloudinary.api.usage();
    console.log(`\n📊 Utilizzo:`);
    console.log(`   Storage: ${(usage.storage.usage / 1024 / 1024).toFixed(2)} MB / ${(usage.storage.limit / 1024 / 1024 / 1024).toFixed(0)} GB`);
    console.log(`   Bandwidth: ${(usage.bandwidth.usage / 1024 / 1024).toFixed(2)} MB / ${(usage.bandwidth.limit / 1024 / 1024 / 1024).toFixed(0)} GB`);
    
    return true;
    
  } catch (error) {
    console.error('❌ Errore:', error.message);
    return false;
  }
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  
  if (args[0] === '--test') {
    await testConnection();
    return;
  }
  
  if (args[0] === '--upload' && args[1]) {
    if (!fs.existsSync(args[1])) {
      console.error(`❌ File non trovato: ${args[1]}`);
      return;
    }
    
    const result = await uploadToCloudinary(args[1]);
    console.log('\n✅ Upload completato:');
    console.log(`   URL: ${result.url}`);
    console.log(`   Public ID: ${result.publicId}`);
    return;
  }
  
  console.log(`
☁️ FishandTips Cloudinary Service
===================================

Gestisce upload immagini su Cloudinary per Instagram.

Uso:
  node scripts/cloudinary-service.js --test              Testa la connessione
  node scripts/cloudinary-service.js --upload <file>    Upload singolo file

Variabili ambiente richieste:
  CLOUDINARY_CLOUD_NAME
  CLOUDINARY_API_KEY
  CLOUDINARY_API_SECRET

Free tier: 25GB storage, 25GB bandwidth/mese
`);
}

// Solo esegui main() se questo file è il punto di ingresso
if (process.argv[1]?.includes('cloudinary-service.js')) {
  main().catch(console.error);
}

export default {
  checkConfig,
  uploadToCloudinary,
  uploadMultipleImages,
  deleteFromCloudinary,
  deleteFolder,
  testConnection
};

