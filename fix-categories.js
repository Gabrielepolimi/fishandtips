const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function fixCategories() {
  try {
    console.log('🔧 FIX CATEGORIE UNDEFINED\n');

    // 1. VERIFICA ARTICOLI CON CATEGORIE PROBLEMATICHE
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        categories
      }
    `);

    console.log(`📝 Articoli totali: ${articles.length}`);
    
    // Verifica articoli con categorie undefined
    const problematicArticles = articles.filter(article => 
      !article.categories || 
      article.categories.length === 0 ||
      article.categories.some(cat => !cat || cat === 'undefined')
    );
    
    console.log(`❌ Articoli con categorie problematiche: ${problematicArticles.length}`);
    
    if (problematicArticles.length > 0) {
      console.log('\n📋 ARTICOLI CON PROBLEMI:');
      problematicArticles.forEach(article => {
        console.log(`   - ${article.title}`);
        console.log(`     Categorie: ${JSON.stringify(article.categories)}`);
      });
    }

    // 2. VERIFICA CATEGORIE DISPONIBILI
    console.log('\n📂 CATEGORIE DISPONIBILI:');
    const availableCategories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current
      }
    `);
    
    console.log(`📂 Categorie nel database: ${availableCategories.length}`);
    availableCategories.forEach(category => {
      console.log(`   - ${category.title} (${category.slug})`);
    });

    // 3. MAPPING CATEGORIE PER ARTICOLI
    console.log('\n🔧 MAPPING CATEGORIE...');
    
    const categoryMapping = {
      'tecniche': 'Tecniche di Pesca',
      'attrezzature': 'Attrezzature di Pesca', 
      'consigli': 'Consigli Generali',
      'spot': 'Spot di Pesca'
    };
    
    // Verifica se le categorie esistono nel database
    for (const [slug, title] of Object.entries(categoryMapping)) {
      const category = availableCategories.find(cat => cat.slug === slug);
      if (category) {
        console.log(`✅ Categoria trovata: ${title} (${slug})`);
      } else {
        console.log(`❌ Categoria mancante: ${title} (${slug})`);
      }
    }

    // 4. RACCOMANDAZIONI
    console.log('\n💡 RACCOMANDAZIONI:');
    console.log('1. 🔧 Verificare che le categorie esistano nel database');
    console.log('2. 📝 Aggiornare gli articoli con categorie corrette');
    console.log('3. 🗺️ Verificare che la sitemap includa le categorie');
    console.log('4. 🔄 Testare che le pagine categoria funzionino');
    
    console.log('\n🎯 AZIONI IMMEDIATE:');
    console.log('1. Vai su Sanity Studio');
    console.log('2. Verifica che le categorie esistano');
    console.log('3. Aggiorna gli articoli con categorie corrette');
    console.log('4. Testa le pagine categoria');

  } catch (error) {
    console.error('❌ Errore durante il fix categorie:', error);
  }
}

fixCategories();