const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function checkContentImages() {
  try {
    console.log('🖼️ CONTROLLO CONTENUTO E IMMAGINI\n');

    // 1. VERIFICA ARTICOLI CON CONTENUTO E IMMAGINI
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        mainImage,
        body,
        seoTitle,
        seoDescription,
        seoKeywords
      }
    `);

    console.log(`📝 Articoli totali: ${articles.length}\n`);

    // Verifica immagini
    console.log('🖼️ VERIFICA IMMAGINI...');
    const articlesWithImages = articles.filter(article => article.mainImage);
    const articlesWithoutImages = articles.filter(article => !article.mainImage);
    
    console.log(`✅ Articoli con immagini: ${articlesWithImages.length}/${articles.length}`);
    console.log(`❌ Articoli senza immagini: ${articlesWithoutImages.length}/${articles.length}`);
    
    if (articlesWithoutImages.length > 0) {
      console.log('\n📋 ARTICOLI SENZA IMMAGINI:');
      articlesWithoutImages.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }

    // Verifica contenuto
    console.log('\n📄 VERIFICA CONTENUTO...');
    const articlesWithContent = articles.filter(article => 
      article.body && 
      article.body.length > 0 && 
      !Array.isArray(article.body) || 
      (Array.isArray(article.body) && article.body.length > 0)
    );
    const articlesWithoutContent = articles.filter(article => 
      !article.body || 
      article.body.length === 0 || 
      (Array.isArray(article.body) && article.body.length === 0)
    );
    
    console.log(`✅ Articoli con contenuto: ${articlesWithContent.length}/${articles.length}`);
    console.log(`❌ Articoli senza contenuto: ${articlesWithoutContent.length}/${articles.length}`);
    
    if (articlesWithoutContent.length > 0) {
      console.log('\n📋 ARTICOLI SENZA CONTENUTO:');
      articlesWithoutContent.forEach(article => {
        console.log(`   - ${article.title}`);
        console.log(`     Body type: ${typeof article.body}`);
        console.log(`     Body length: ${Array.isArray(article.body) ? article.body.length : 'N/A'}`);
      });
    }

    // Verifica SEO
    console.log('\n📊 VERIFICA SEO...');
    const articlesWithSEO = articles.filter(article => 
      article.seoTitle && 
      article.seoDescription && 
      article.seoKeywords
    );
    const articlesWithoutSEO = articles.filter(article => 
      !article.seoTitle || 
      !article.seoDescription || 
      !article.seoKeywords
    );
    
    console.log(`✅ Articoli con SEO: ${articlesWithSEO.length}/${articles.length}`);
    console.log(`❌ Articoli senza SEO: ${articlesWithoutSEO.length}/${articles.length}`);
    
    if (articlesWithoutSEO.length > 0) {
      console.log('\n📋 ARTICOLI SENZA SEO:');
      articlesWithoutSEO.forEach(article => {
        console.log(`   - ${article.title}`);
        console.log(`     SEO Title: ${article.seoTitle ? '✅' : '❌'}`);
        console.log(`     SEO Description: ${article.seoDescription ? '✅' : '❌'}`);
        console.log(`     SEO Keywords: ${article.seoKeywords ? '✅' : '❌'}`);
      });
    }

    // 2. ANALISI DETTAGLIATA CONTENUTO
    console.log('\n🔍 ANALISI DETTAGLIATA CONTENUTO...');
    
    articles.forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      console.log(`   Immagine: ${article.mainImage ? '✅' : '❌'}`);
      console.log(`   Contenuto: ${article.body ? '✅' : '❌'}`);
      console.log(`   SEO Title: ${article.seoTitle ? '✅' : '❌'}`);
      console.log(`   SEO Description: ${article.seoDescription ? '✅' : '❌'}`);
      console.log(`   SEO Keywords: ${article.seoKeywords ? '✅' : '❌'}`);
      
      if (article.body) {
        if (Array.isArray(article.body)) {
          console.log(`   Body blocks: ${article.body.length}`);
        } else {
          console.log(`   Body type: ${typeof article.body}`);
        }
      }
    });

    // 3. RACCOMANDAZIONI
    console.log('\n💡 RACCOMANDAZIONI...');
    
    if (articlesWithoutImages.length > 0) {
      console.log('🔧 FIX IMMAGINI:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni articolo senza immagine');
      console.log('   3. Aggiungi un\'immagine principale');
      console.log('   4. Salva e pubblica');
    }
    
    if (articlesWithoutContent.length > 0) {
      console.log('🔧 FIX CONTENUTO:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni articolo senza contenuto');
      console.log('   3. Aggiungi contenuto testuale');
      console.log('   4. Salva e pubblica');
    }
    
    if (articlesWithoutSEO.length > 0) {
      console.log('🔧 FIX SEO:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni articolo senza SEO');
      console.log('   3. Aggiungi SEO Title, Description e Keywords');
      console.log('   4. Salva e pubblica');
    }

    // 4. RIEPILOGO
    console.log('\n📊 RIEPILOGO:');
    console.log(`📝 Articoli totali: ${articles.length}`);
    console.log(`🖼️ Con immagini: ${articlesWithImages.length}/${articles.length} (${Math.round((articlesWithImages.length/articles.length)*100)}%)`);
    console.log(`📄 Con contenuto: ${articlesWithContent.length}/${articles.length} (${Math.round((articlesWithContent.length/articles.length)*100)}%)`);
    console.log(`📊 Con SEO: ${articlesWithSEO.length}/${articles.length} (${Math.round((articlesWithSEO.length/articles.length)*100)}%)`);
    
    const healthScore = Math.round(((articlesWithImages.length + articlesWithContent.length + articlesWithSEO.length) / (articles.length * 3)) * 100);
    console.log(`🏆 HEALTH SCORE: ${healthScore}%`);
    
    if (healthScore >= 90) {
      console.log('✅ ECCELLENTE: Contenuto e immagini ottimizzati');
    } else if (healthScore >= 70) {
      console.log('🟢 BUONO: Alcuni miglioramenti necessari');
    } else if (healthScore >= 50) {
      console.log('🟡 MEDIO: Interventi significativi necessari');
    } else {
      console.log('🔴 CRITICO: Interventi urgenti necessari');
    }

  } catch (error) {
    console.error('❌ Errore durante il controllo contenuto e immagini:', error);
  }
}

checkContentImages();

