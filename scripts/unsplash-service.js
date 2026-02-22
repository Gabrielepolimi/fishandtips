/**
 * 📸 FishandTips - Unsplash Service
 * 
 * Integrazione con Unsplash API per foto reali di pesca
 * Free tier: 50 requests/hour, 5000/month
 */

// ===== CONFIGURAZIONE =====
const CONFIG = {
  accessKey: process.env.UNSPLASH_ACCESS_KEY,
  baseUrl: 'https://api.unsplash.com',
  defaultPerPage: 10
};

/**
 * Cerca foto su Unsplash
 * @param {string} query - Termini di ricerca
 * @param {Object} options - Opzioni di ricerca
 * @returns {Promise<Array>} Array di foto
 */
export async function searchPhotos(query, options = {}) {
  const {
    perPage = 7,
    orientation = 'portrait', // 'portrait' per Instagram
    orderBy = 'relevant'
  } = options;
  
  if (!CONFIG.accessKey) {
    console.warn('⚠️ UNSPLASH_ACCESS_KEY non configurata - uso placeholder');
    return getPlaceholderPhotos(perPage);
  }
  
  const params = new URLSearchParams({
    query,
    per_page: perPage,
    orientation,
    order_by: orderBy
  });
  
  try {
    const response = await fetch(
      `${CONFIG.baseUrl}/search/photos?${params}`,
      {
        headers: {
          'Authorization': `Client-ID ${CONFIG.accessKey}`
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.results.map(photo => ({
      id: photo.id,
      url: photo.urls.regular, // 1080px
      urlFull: photo.urls.full,
      urlSmall: photo.urls.small,
      width: photo.width,
      height: photo.height,
      description: photo.description || photo.alt_description,
      author: {
        name: photo.user.name,
        username: photo.user.username,
        link: photo.user.links.html
      },
      downloadLink: photo.links.download_location, // Per tracking Unsplash
      color: photo.color // Colore dominante
    }));
    
  } catch (error) {
    console.error('❌ Errore Unsplash:', error.message);
    return getPlaceholderPhotos(perPage);
  }
}

/**
 * Cerca foto specifiche per la pesca
 * @param {Array<string>} keywords - Keywords dall'articolo
 * @returns {Promise<Array>} Foto ottimizzate per carousel
 */
export async function searchFishingPhotos(keywords = []) {
  // Costruisci query ottimizzata per pesca
  const baseQueries = [
    'fishing sea',
    'fisherman beach',
    'fishing rod sunset',
    'ocean fishing',
    'mediterranean sea fishing'
  ];
  
  // Combina con keywords specifiche dell'articolo
  const customQuery = keywords.length > 0 
    ? keywords.slice(0, 3).join(' ') + ' fishing'
    : baseQueries[Math.floor(Math.random() * baseQueries.length)];
  
  console.log(`📸 Unsplash search: "${customQuery}"`);
  
  const photos = await searchPhotos(customQuery, {
    perPage: 10,
    orientation: 'portrait'
  });
  
  // Se poche foto, aggiungi ricerca generica
  if (photos.length < 7) {
    const morePhotos = await searchPhotos('fishing ocean', {
      perPage: 7 - photos.length,
      orientation: 'portrait'
    });
    photos.push(...morePhotos);
  }
  
  return photos.slice(0, 7);
}

/**
 * Ottieni una singola foto per keyword
 */
export async function getPhotoForSlide(keyword, slideType = 'content') {
  // Query specifiche per tipo di slide
  const queryMap = {
    'hook': `${keyword} dramatic ocean`,
    'content': `${keyword} fishing`,
    'cta': 'fishing community sunset'
  };
  
  const query = queryMap[slideType] || `${keyword} fishing`;
  const photos = await searchPhotos(query, { perPage: 3 });
  
  return photos[0] || null;
}

/**
 * Foto placeholder quando Unsplash non disponibile
 */
function getPlaceholderPhotos(count) {
  const placeholders = [
    {
      id: 'placeholder-1',
      url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1080',
      description: 'Fishing at sunset',
      author: { name: 'Unsplash', username: 'unsplash' },
      color: '#1a365d'
    },
    {
      id: 'placeholder-2',
      url: 'https://images.unsplash.com/photo-1498654896293-37aacf113fd9?w=1080',
      description: 'Fisherman on beach',
      author: { name: 'Unsplash', username: 'unsplash' },
      color: '#0c4a6e'
    },
    {
      id: 'placeholder-3',
      url: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=1080',
      description: 'Fishing rod',
      author: { name: 'Unsplash', username: 'unsplash' },
      color: '#0284c7'
    },
    {
      id: 'placeholder-4',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080',
      description: 'Ocean waves',
      author: { name: 'Unsplash', username: 'unsplash' },
      color: '#0369a1'
    },
    {
      id: 'placeholder-5',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1080',
      description: 'Sea fishing',
      author: { name: 'Unsplash', username: 'unsplash' },
      color: '#1e40af'
    },
    {
      id: 'placeholder-6',
      url: 'https://images.unsplash.com/photo-1544551763-77ef2d0cfc6c?w=1080',
      description: 'Beach sunrise',
      author: { name: 'Unsplash', username: 'unsplash' },
      color: '#c2410c'
    },
    {
      id: 'placeholder-7',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1080',
      description: 'Fishing community',
      author: { name: 'Unsplash', username: 'unsplash' },
      color: '#059669'
    }
  ];
  
  return placeholders.slice(0, count);
}

/**
 * Trigger download tracking per Unsplash (richiesto dai ToS)
 */
export async function trackDownload(downloadLink) {
  if (!CONFIG.accessKey || !downloadLink) return;
  
  try {
    await fetch(downloadLink, {
      headers: {
        'Authorization': `Client-ID ${CONFIG.accessKey}`
      }
    });
  } catch (error) {
    // Silently fail - non critico
  }
}

/**
 * Test della connessione Unsplash
 */
export async function testConnection() {
  console.log('\n📸 Test connessione Unsplash...\n');
  
  if (!CONFIG.accessKey) {
    console.log('⚠️ UNSPLASH_ACCESS_KEY non configurata');
    console.log('   Usa: export UNSPLASH_ACCESS_KEY=your_key');
    return false;
  }
  
  try {
    const photos = await searchPhotos('fishing italy', { perPage: 3 });
    
    console.log(`✅ Connessione OK - ${photos.length} foto trovate\n`);
    
    photos.forEach((photo, i) => {
      console.log(`${i + 1}. ${photo.description || 'No description'}`);
      console.log(`   📷 by ${photo.author.name}`);
      console.log(`   🔗 ${photo.url.substring(0, 50)}...`);
      console.log('');
    });
    
    return true;
    
  } catch (error) {
    console.error('❌ Errore:', error.message);
    return false;
  }
}

// CLI
if (process.argv[1]?.includes('unsplash-service')) {
  testConnection();
}

export default {
  searchPhotos,
  searchFishingPhotos,
  getPhotoForSlide,
  trackDownload,
  testConnection
};







