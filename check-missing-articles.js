const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function checkMissingArticles() {
  try {
    console.log('🔍 VERIFICA ARTICOLI MANCANTI DAL DATABASE\n');

    const missingSlugs = [
      'surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia',
      'migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali',
      'rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti',
      'licenza-di-pesca-in-italia-tipi-costi-regole-e-come-ottenerla',
      'migliori-mulinelli-da-spinning-guida-completa-economici-e-professionali'
    ];

    console.log('📋 ARTICOLI MANCANTI DA VERIFICARE:');
    missingSlugs.forEach((slug, index) => {
      console.log(`${index + 1}. ${slug}`);
    });

    console.log('\n🔍 VERIFICA ALTERNATIVE NEL DATABASE...');
    
    // Verifica se esistono articoli con slug simili
    for (const slug of missingSlugs) {
      console.log(`\n🔍 Cercando alternative per: ${slug}`);
      
      // Cerca articoli con parole chiave simili
      const keywords = slug.split('-').slice(0, 3); // Prime 3 parole
      const searchQuery = keywords.join(' ');
      
      const alternatives = await client.fetch(`
        *[_type == "post" && status == "published" && (
          title match "*${searchQuery}*" ||
          slug.current match "*${keywords[0]}*" ||
          slug.current match "*${keywords[1]}*" ||
          slug.current match "*${keywords[2]}*"
        )] {
          _id,
          title,
          "slug": slug.current,
          publishedAt
        }
      `);

      if (alternatives.length > 0) {
        console.log(`✅ Trovate ${alternatives.length} alternative:`);
        alternatives.forEach(alt => {
          console.log(`   - ${alt.title} (${alt.slug})`);
        });
      } else {
        console.log(`❌ Nessuna alternativa trovata`);
      }
    }

    // Verifica tutti gli articoli nel database
    console.log('\n📊 VERIFICA COMPLETA DATABASE...');
    const allArticles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        status
      } | order(publishedAt desc)
    `);

    console.log(`✅ Articoli totali nel database: ${allArticles.length}`);
    
    // Mostra primi 10 articoli
    console.log('\n📝 PRIMI 10 ARTICOLI NEL DATABASE:');
    allArticles.slice(0, 10).forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Data: ${article.publishedAt}`);
      console.log('');
    });

    // Verifica se ci sono articoli con status diverso da "published"
    console.log('🔍 VERIFICA ARTICOLI NON PUBBLICATI...');
    const unpublishedArticles = await client.fetch(`
      *[_type == "post" && status != "published"] {
        _id,
        title,
        "slug": slug.current,
        status,
        publishedAt
      }
    `);

    console.log(`📝 Articoli non pubblicati: ${unpublishedArticles.length}`);
    if (unpublishedArticles.length > 0) {
      unpublishedArticles.forEach(article => {
        console.log(`   - ${article.title} (${article.status})`);
      });
    }

    // Verifica articoli con date future
    console.log('\n⚠️ VERIFICA ARTICOLI CON DATE FUTURE...');
    const now = new Date();
    const futureArticles = allArticles.filter(article => 
      new Date(article.publishedAt) > now
    );

    console.log(`📅 Articoli con date future: ${futureArticles.length}`);
    if (futureArticles.length > 0) {
      futureArticles.forEach(article => {
        console.log(`   - ${article.title}: ${article.publishedAt}`);
      });
    }

    console.log('\n🎯 RACCOMANDAZIONI:');
    console.log('1. 🔍 Verificare se gli articoli mancanti esistono con slug diversi');
    console.log('2. 📝 Controllare se sono stati eliminati o mai creati');
    console.log('3. 🔄 Verificare che i redirect puntino agli articoli corretti');
    console.log('4. 📅 Correggere le date future degli articoli');
    console.log('5. 🗺️ Aggiornare la sitemap con gli articoli esistenti');

  } catch (error) {
    console.error('❌ Errore durante la verifica:', error);
  }
}

checkMissingArticles();
