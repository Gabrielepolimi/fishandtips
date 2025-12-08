/**
 * 📱 FishandTips - Instagram Graph API
 * 
 * Integrazione con Instagram Graph API per pubblicare carousel
 * Requisiti: Account Business + Pagina Facebook collegata
 * 
 * Documentazione: https://developers.facebook.com/docs/instagram-api/guides/content-publishing
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// ===== CONFIGURAZIONE =====
const CONFIG = {
  accessToken: process.env.INSTAGRAM_ACCESS_TOKEN,
  instagramAccountId: process.env.INSTAGRAM_ACCOUNT_ID,
  graphApiVersion: 'v18.0',
  baseUrl: 'https://graph.facebook.com'
};

/**
 * Verifica la configurazione Instagram
 */
export function checkConfig() {
  const missing = [];
  
  if (!CONFIG.accessToken) missing.push('INSTAGRAM_ACCESS_TOKEN');
  if (!CONFIG.instagramAccountId) missing.push('INSTAGRAM_ACCOUNT_ID');
  
  if (missing.length > 0) {
    console.warn('⚠️ Configurazione Instagram incompleta:');
    missing.forEach(key => console.warn(`   - ${key} mancante`));
    return false;
  }
  
  return true;
}

/**
 * Ottieni l'ID dell'account Instagram Business collegato
 * (Usa questo una volta per trovare il tuo INSTAGRAM_ACCOUNT_ID)
 */
export async function getInstagramAccountId() {
  if (!CONFIG.accessToken) {
    throw new Error('INSTAGRAM_ACCESS_TOKEN non configurato');
  }
  
  const url = `${CONFIG.baseUrl}/${CONFIG.graphApiVersion}/me/accounts?fields=instagram_business_account{id,username}&access_token=${CONFIG.accessToken}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Facebook API Error: ${data.error.message}`);
  }
  
  const pages = data.data || [];
  const instagramAccounts = [];
  
  for (const page of pages) {
    if (page.instagram_business_account) {
      instagramAccounts.push({
        pageId: page.id,
        instagramId: page.instagram_business_account.id,
        username: page.instagram_business_account.username
      });
    }
  }
  
  return instagramAccounts;
}

/**
 * Crea un container per un'immagine del carousel
 * @param {string} imageUrl - URL pubblico dell'immagine
 * @param {boolean} isCarouselItem - Se true, crea item per carousel
 */
async function createMediaContainer(imageUrl, isCarouselItem = true) {
  const params = new URLSearchParams({
    image_url: imageUrl,
    is_carousel_item: isCarouselItem.toString(),
    access_token: CONFIG.accessToken
  });
  
  const url = `${CONFIG.baseUrl}/${CONFIG.graphApiVersion}/${CONFIG.instagramAccountId}/media?${params}`;
  
  const response = await fetch(url, { method: 'POST' });
  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Errore creazione media: ${data.error.message}`);
  }
  
  return data.id; // Container ID
}

/**
 * Crea il container del carousel
 * @param {Array<string>} childrenIds - Array di container ID delle immagini
 * @param {string} caption - Caption del post
 */
async function createCarouselContainer(childrenIds, caption) {
  const params = new URLSearchParams({
    media_type: 'CAROUSEL',
    children: childrenIds.join(','),
    caption: caption,
    access_token: CONFIG.accessToken
  });
  
  const url = `${CONFIG.baseUrl}/${CONFIG.graphApiVersion}/${CONFIG.instagramAccountId}/media?${params}`;
  
  const response = await fetch(url, { method: 'POST' });
  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Errore creazione carousel: ${data.error.message}`);
  }
  
  return data.id; // Carousel container ID
}

/**
 * Pubblica il carousel
 * @param {string} containerId - ID del container carousel
 */
async function publishCarousel(containerId) {
  const params = new URLSearchParams({
    creation_id: containerId,
    access_token: CONFIG.accessToken
  });
  
  const url = `${CONFIG.baseUrl}/${CONFIG.graphApiVersion}/${CONFIG.instagramAccountId}/media_publish?${params}`;
  
  const response = await fetch(url, { method: 'POST' });
  const data = await response.json();
  
  if (data.error) {
    throw new Error(`Errore pubblicazione: ${data.error.message}`);
  }
  
  if (!data.id) {
    console.log('⚠️ Risposta API:', JSON.stringify(data));
    throw new Error('Media ID is not available');
  }
  
  return data.id; // Media ID del post pubblicato
}

/**
 * Controlla lo stato di un media container
 * @param {string} containerId - ID del container da verificare
 */
async function checkMediaStatus(containerId) {
  const url = `${CONFIG.baseUrl}/${CONFIG.graphApiVersion}/${containerId}?fields=status_code,status&access_token=${CONFIG.accessToken}`;
  
  const response = await fetch(url);
  const data = await response.json();
  
  return {
    id: containerId,
    status: data.status_code,
    details: data.status
  };
}

/**
 * Attendi che tutti i media siano pronti
 */
async function waitForMediaReady(containerIds, maxWaitSeconds = 60) {
  const startTime = Date.now();
  const timeout = maxWaitSeconds * 1000;
  
  while (Date.now() - startTime < timeout) {
    let allReady = true;
    
    for (const id of containerIds) {
      const status = await checkMediaStatus(id);
      
      if (status.status === 'ERROR') {
        throw new Error(`Media ${id} in errore: ${status.details}`);
      }
      
      if (status.status !== 'FINISHED') {
        allReady = false;
        break;
      }
    }
    
    if (allReady) {
      return true;
    }
    
    // Attendi 2 secondi prima di ricontrollare
    await new Promise(r => setTimeout(r, 2000));
  }
  
  throw new Error('Timeout: media non pronti');
}

/**
 * Pubblica un carousel completo su Instagram
 * @param {Array<string>} imageUrls - Array di URL pubblici delle immagini
 * @param {string} caption - Caption completa (inclusi hashtag)
 * @returns {Promise<Object>} Risultato della pubblicazione
 */
export async function publishCarouselPost(imageUrls, caption) {
  console.log('\n' + '📱'.repeat(20));
  console.log('PUBBLICAZIONE INSTAGRAM');
  console.log('📱'.repeat(20) + '\n');
  
  if (!checkConfig()) {
    throw new Error('Configurazione Instagram incompleta');
  }
  
  if (imageUrls.length < 2 || imageUrls.length > 10) {
    throw new Error('Il carousel deve avere 2-10 immagini');
  }
  
  console.log(`📊 Immagini: ${imageUrls.length}`);
  console.log(`📝 Caption: ${caption.length} caratteri\n`);
  
  // 1. Crea container per ogni immagine
  console.log('1️⃣ Creazione container immagini...');
  const childrenIds = [];
  
  for (let i = 0; i < imageUrls.length; i++) {
    const url = imageUrls[i];
    console.log(`   [${i + 1}/${imageUrls.length}] Caricamento...`);
    
    const containerId = await createMediaContainer(url);
    childrenIds.push(containerId);
    console.log(`   ✅ Container: ${containerId}`);
  }
  
  // 2. Attendi che tutti i media siano processati
  console.log('\n2️⃣ Attesa elaborazione media...');
  await waitForMediaReady(childrenIds);
  console.log('   ✅ Tutti i media pronti');
  
  // 3. Crea il carousel container
  console.log('\n3️⃣ Creazione carousel...');
  const carouselId = await createCarouselContainer(childrenIds, caption);
  console.log(`   ✅ Carousel container: ${carouselId}`);
  
  // 4. Attendi che il carousel sia pronto
  console.log('\n4️⃣ Attesa elaborazione carousel...');
  await waitForMediaReady([carouselId]);
  console.log('   ✅ Carousel pronto');
  
  // 5. Pubblica
  console.log('\n5️⃣ Pubblicazione...');
  const mediaId = await publishCarousel(carouselId);
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ CAROUSEL PUBBLICATO CON SUCCESSO!');
  console.log('='.repeat(50));
  console.log(`📱 Media ID: ${mediaId}`);
  console.log(`🔗 Vai su Instagram per vedere il post`);
  console.log('='.repeat(50) + '\n');
  
  return {
    success: true,
    mediaId,
    childrenIds,
    carouselContainerId: carouselId
  };
}

/**
 * Pubblica un singolo post immagine
 */
export async function publishSingleImage(imageUrl, caption) {
  if (!checkConfig()) {
    throw new Error('Configurazione Instagram incompleta');
  }
  
  // 1. Crea container
  const params = new URLSearchParams({
    image_url: imageUrl,
    caption: caption,
    access_token: CONFIG.accessToken
  });
  
  const containerUrl = `${CONFIG.baseUrl}/${CONFIG.graphApiVersion}/${CONFIG.instagramAccountId}/media?${params}`;
  const containerResponse = await fetch(containerUrl, { method: 'POST' });
  const containerData = await containerResponse.json();
  
  if (containerData.error) {
    throw new Error(containerData.error.message);
  }
  
  // 2. Attendi
  await waitForMediaReady([containerData.id]);
  
  // 3. Pubblica
  const mediaId = await publishCarousel(containerData.id);
  
  return { success: true, mediaId };
}

/**
 * Test connessione API
 */
export async function testConnection() {
  console.log('\n📱 Test connessione Instagram API...\n');
  
  if (!checkConfig()) {
    return false;
  }
  
  try {
    const accounts = await getInstagramAccountId();
    
    if (accounts.length === 0) {
      console.log('⚠️ Nessun account Instagram Business trovato');
      console.log('   Assicurati di avere:');
      console.log('   1. Account Instagram Business/Creator');
      console.log('   2. Pagina Facebook collegata');
      return false;
    }
    
    console.log('✅ Account Instagram trovati:\n');
    accounts.forEach(acc => {
      console.log(`   📱 @${acc.username}`);
      console.log(`      Instagram ID: ${acc.instagramId}`);
      console.log(`      Page ID: ${acc.pageId}`);
      console.log('');
    });
    
    console.log('💡 Usa questo INSTAGRAM_ACCOUNT_ID nel tuo .env.local:');
    console.log(`   INSTAGRAM_ACCOUNT_ID=${accounts[0].instagramId}`);
    
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
  
  if (args[0] === '--get-id') {
    try {
      const accounts = await getInstagramAccountId();
      console.log(JSON.stringify(accounts, null, 2));
    } catch (error) {
      console.error('Errore:', error.message);
    }
    return;
  }
  
  console.log(`
📱 FishandTips Instagram API
==============================

Gestisce la pubblicazione di carousel su Instagram.

Uso:
  node scripts/instagram-api.js --test     Testa la connessione
  node scripts/instagram-api.js --get-id   Ottieni Instagram Account ID

Setup richiesto:
  1. Account Instagram Business
  2. Pagina Facebook collegata
  3. Facebook Developer App con permessi instagram_content_publish
  4. Access Token valido

Variabili ambiente:
  INSTAGRAM_ACCESS_TOKEN    Token di accesso Facebook/Instagram
  INSTAGRAM_ACCOUNT_ID      ID dell'account Instagram Business
`);
}

// Solo esegui main() se questo file è il punto di ingresso
if (process.argv[1]?.includes('instagram-api.js')) {
  main().catch(console.error);
}

export default {
  checkConfig,
  getInstagramAccountId,
  publishCarouselPost,
  publishSingleImage,
  testConnection
};

