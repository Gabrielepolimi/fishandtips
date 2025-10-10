const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function fixCategorySlugs() {
  try {
    console.log('🔧 FIX CATEGORIE SLUG NULL\n');

    // 1. VERIFICA CATEGORIE CON SLUG NULL
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
    
    if (categoriesWithoutSlug.length > 0) {
      console.log('\n📋 CATEGORIE SENZA SLUG:');
      categoriesWithoutSlug.forEach(category => {
        console.log(`   - ${category.title} (ID: ${category._id})`);
      });
    }

    // 2. MAPPING SLUG CORRETTI
    const slugMapping = {
      'Tecniche di Pesca': 'tecniche-di-pesca',
      'Attrezzature di Pesca': 'attrezzature',
      'Spot di Pesca': 'spot-di-pesca',
      'Consigli Generali': 'consigli'
    };

    console.log('\n🔧 AGGIORNAMENTO SLUG CATEGORIE...');
    
    for (const category of categoriesWithoutSlug) {
      const correctSlug = slugMapping[category.title];
      
      if (correctSlug) {
        console.log(`📝 Aggiornando ${category.title} → ${correctSlug}`);
        
        try {
          await client
            .patch(category._id)
            .set({
              'slug.current': correctSlug
            })
            .commit();
          
          console.log(`✅ ${category.title} aggiornata con successo`);
        } catch (error) {
          console.log(`❌ Errore aggiornando ${category.title}:`, error.message);
        }
      } else {
        console.log(`⚠️ Slug non trovato per ${category.title}`);
      }
    }

    // 3. VERIFICA AGGIORNAMENTO
    console.log('\n✅ VERIFICA AGGIORNAMENTO...');
    
    const updatedCategories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current
      }
    `);
    
    console.log(`📂 Categorie aggiornate: ${updatedCategories.length}`);
    updatedCategories.forEach(category => {
      console.log(`   - ${category.title}: ${category.slug || 'NULL'}`);
    });

    // 4. VERIFICA ARTICOLI CON CATEGORIE
    console.log('\n📝 VERIFICA ARTICOLI CON CATEGORIE...');
    
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        categories
      }
    `);
    
    console.log(`📝 Articoli totali: ${articles.length}`);
    
    // Verifica articoli con categorie
    const articlesWithCategories = articles.filter(article => 
      article.categories && article.categories.length > 0
    );
    console.log(`✅ Articoli con categorie: ${articlesWithCategories.length}`);
    
    // Verifica articoli senza categorie
    const articlesWithoutCategories = articles.filter(article => 
      !article.categories || article.categories.length === 0
    );
    console.log(`❌ Articoli senza categorie: ${articlesWithoutCategories.length}`);
    
    if (articlesWithoutCategories.length > 0) {
      console.log('\n📋 ARTICOLI SENZA CATEGORIE:');
      articlesWithoutCategories.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }

    console.log('\n🎯 RISULTATO:');
    console.log('✅ Categorie aggiornate con slug corretti');
    console.log('✅ Pagine categoria dovrebbero funzionare');
    console.log('✅ URL categoria dovrebbero essere accessibili');

  } catch (error) {
    console.error('❌ Errore durante il fix categorie:', error);
  }
}

fixCategorySlugs();
