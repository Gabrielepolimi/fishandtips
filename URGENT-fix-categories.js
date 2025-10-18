const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function urgentFixCategories() {
  try {
    console.log('🚨 FIX URGENTE: CATEGORIE SENZA SLUG\n');

    // 1. VERIFICA CATEGORIE PROBLEMATICHE
    const categories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current
      }
    `);
    
    console.log(`📂 Categorie totali: ${categories.length}`);
    
    const categoriesWithoutSlug = categories.filter(cat => !cat.slug);
    console.log(`❌ Categorie senza slug: ${categoriesWithoutSlug.length}`);
    
    if (categoriesWithoutSlug.length === 0) {
      console.log('✅ Tutte le categorie hanno slug!');
      return;
    }

    // 2. MAPPING SLUG CORRETTI
    const slugMapping = {
      'Tecniche di Pesca': 'tecniche-di-pesca',
      'Attrezzature di Pesca': 'attrezzature',
      'Spot di Pesca': 'spot-di-pesca',
      'Consigli Generali': 'consigli'
    };

    console.log('\n🔧 ISTRUZIONI MANUALI URGENTI:');
    console.log('🚨 AZIONE IMMEDIATA RICHIESTA:');
    console.log('1. Vai su Sanity Studio: https://fishandtips-studio.vercel.app');
    console.log('2. Apri la sezione "Categories"');
    console.log('3. Per ogni categoria, aggiorna lo slug:');
    
    categoriesWithoutSlug.forEach(category => {
      const correctSlug = slugMapping[category.title];
      if (correctSlug) {
        console.log(`   📝 ${category.title} → slug: "${correctSlug}"`);
      } else {
        console.log(`   ⚠️ ${category.title} → slug non trovato nel mapping`);
      }
    });

    console.log('\n🎯 IMPATTO DEL FIX:');
    console.log('✅ Pagine categoria funzioneranno');
    console.log('✅ URL categoria accessibili');
    console.log('✅ Sitemap categoria aggiornata');
    console.log('✅ SEO categoria migliorato');

    console.log('\n⏰ TEMPO STIMATO: 5 minuti');
    console.log('🚨 PRIORITÀ: CRITICA');

  } catch (error) {
    console.error('❌ Errore durante il fix categorie:', error);
  }
}

urgentFixCategories();

