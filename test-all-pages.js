const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function testAllPages() {
  try {
    console.log('🧪 TESTARE TUTTE LE PAGINE\n');

    // 1. TEST ARTICOLI
    console.log('📝 1. TEST ARTICOLI...');
    
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        status,
        mainImage,
        body,
        seoTitle,
        seoDescription,
        seoKeywords,
        categories,
        showYouTubeVideo,
        youtubeUrl,
        youtubeTitle,
        youtubeDescription
      } | order(publishedAt desc)
    `);

    console.log(`📊 Articoli da testare: ${articles.length}`);
    
    let articlesPassed = 0;
    let articlesFailed = 0;
    const failedArticles = [];

    articles.forEach((article, index) => {
      console.log(`\n${index + 1}. ${article.title}`);
      console.log(`   Slug: ${article.slug}`);
      
      let testsPassed = 0;
      let testsTotal = 0;
      const testResults = [];

      // Test 1: Slug valido
      testsTotal++;
      if (article.slug && article.slug.length > 0 && !article.slug.includes('undefined')) {
        testsPassed++;
        testResults.push('✅ Slug valido');
      } else {
        testResults.push('❌ Slug non valido');
      }

      // Test 2: Status pubblicato
      testsTotal++;
      if (article.status === 'published') {
        testsPassed++;
        testResults.push('✅ Status pubblicato');
      } else {
        testResults.push('❌ Status non pubblicato');
      }

      // Test 3: Immagine presente
      testsTotal++;
      if (article.mainImage) {
        testsPassed++;
        testResults.push('✅ Immagine presente');
      } else {
        testResults.push('❌ Immagine mancante');
      }

      // Test 4: Contenuto presente
      testsTotal++;
      if (article.body && article.body.length > 0) {
        testsPassed++;
        testResults.push('✅ Contenuto presente');
      } else {
        testResults.push('❌ Contenuto mancante');
      }

      // Test 5: SEO Title
      testsTotal++;
      if (article.seoTitle && article.seoTitle.length >= 30 && article.seoTitle.length <= 60) {
        testsPassed++;
        testResults.push('✅ SEO Title ottimizzato');
      } else {
        testResults.push('❌ SEO Title non ottimizzato');
      }

      // Test 6: SEO Description
      testsTotal++;
      if (article.seoDescription && article.seoDescription.length >= 120 && article.seoDescription.length <= 160) {
        testsPassed++;
        testResults.push('✅ SEO Description ottimizzata');
      } else {
        testResults.push('❌ SEO Description non ottimizzata');
      }

      // Test 7: SEO Keywords
      testsTotal++;
      if (article.seoKeywords && article.seoKeywords.length > 0) {
        testsPassed++;
        testResults.push('✅ SEO Keywords presenti');
      } else {
        testResults.push('❌ SEO Keywords mancanti');
      }

      // Test 8: Categorie
      testsTotal++;
      if (article.categories && article.categories.length > 0) {
        testsPassed++;
        testResults.push('✅ Categorie presenti');
      } else {
        testResults.push('❌ Categorie mancanti');
      }

      // Test 9: Video YouTube (se presente)
      if (article.showYouTubeVideo) {
        testsTotal++;
        if (article.youtubeUrl && article.youtubeTitle && article.youtubeDescription) {
          testsPassed++;
          testResults.push('✅ Video YouTube completo');
        } else {
          testResults.push('❌ Video YouTube incompleto');
        }
      }

      // Risultati test
      testResults.forEach(result => {
        console.log(`   ${result}`);
      });

      const testScore = Math.round((testsPassed / testsTotal) * 100);
      console.log(`   📊 Score: ${testScore}% (${testsPassed}/${testsTotal})`);

      if (testScore >= 80) {
        articlesPassed++;
        console.log(`   ✅ PASSA`);
      } else {
        articlesFailed++;
        failedArticles.push({
          title: article.title,
          slug: article.slug,
          score: testScore,
          issues: testResults.filter(r => r.includes('❌'))
        });
        console.log(`   ❌ FALLISCE`);
      }
    });

    // 2. TEST CATEGORIE
    console.log('\n📂 2. TEST CATEGORIE...');
    
    const categories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current,
        description
      }
    `);

    console.log(`📊 Categorie da testare: ${categories.length}`);
    
    let categoriesPassed = 0;
    let categoriesFailed = 0;
    const failedCategories = [];

    categories.forEach((category, index) => {
      console.log(`\n${index + 1}. ${category.title}`);
      
      let testsPassed = 0;
      let testsTotal = 0;
      const testResults = [];

      // Test 1: Slug presente
      testsTotal++;
      if (category.slug && category.slug.length > 0) {
        testsPassed++;
        testResults.push('✅ Slug presente');
      } else {
        testResults.push('❌ Slug mancante');
      }

      // Test 2: Titolo presente
      testsTotal++;
      if (category.title && category.title.length > 0) {
        testsPassed++;
        testResults.push('✅ Titolo presente');
      } else {
        testResults.push('❌ Titolo mancante');
      }

      // Test 3: Slug valido
      testsTotal++;
      if (category.slug && !category.slug.includes('undefined') && !category.slug.includes(' ')) {
        testsPassed++;
        testResults.push('✅ Slug valido');
      } else {
        testResults.push('❌ Slug non valido');
      }

      // Risultati test
      testResults.forEach(result => {
        console.log(`   ${result}`);
      });

      const testScore = Math.round((testsPassed / testsTotal) * 100);
      console.log(`   📊 Score: ${testScore}% (${testsPassed}/${testsTotal})`);

      if (testScore >= 80) {
        categoriesPassed++;
        console.log(`   ✅ PASSA`);
      } else {
        categoriesFailed++;
        failedCategories.push({
          title: category.title,
          slug: category.slug,
          score: testScore,
          issues: testResults.filter(r => r.includes('❌'))
        });
        console.log(`   ❌ FALLISCE`);
      }
    });

    // 3. RIEPILOGO FINALE
    console.log('\n📊 3. RIEPILOGO FINALE...');
    
    console.log(`📝 ARTICOLI:`);
    console.log(`   ✅ Passati: ${articlesPassed}/${articles.length} (${Math.round((articlesPassed/articles.length)*100)}%)`);
    console.log(`   ❌ Falliti: ${articlesFailed}/${articles.length} (${Math.round((articlesFailed/articles.length)*100)}%)`);
    
    console.log(`\n📂 CATEGORIE:`);
    console.log(`   ✅ Passate: ${categoriesPassed}/${categories.length} (${Math.round((categoriesPassed/categories.length)*100)}%)`);
    console.log(`   ❌ Fallite: ${categoriesFailed}/${categories.length} (${Math.round((categoriesFailed/categories.length)*100)}%)`);

    // 4. PROBLEMI IDENTIFICATI
    if (failedArticles.length > 0) {
      console.log('\n❌ ARTICOLI CON PROBLEMI:');
      failedArticles.forEach(article => {
        console.log(`\n📝 ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Score: ${article.score}%`);
        console.log(`   Problemi:`);
        article.issues.forEach(issue => {
          console.log(`     ${issue}`);
        });
      });
    }

    if (failedCategories.length > 0) {
      console.log('\n❌ CATEGORIE CON PROBLEMI:');
      failedCategories.forEach(category => {
        console.log(`\n📂 ${category.title}`);
        console.log(`   Slug: ${category.slug}`);
        console.log(`   Score: ${category.score}%`);
        console.log(`   Problemi:`);
        category.issues.forEach(issue => {
          console.log(`     ${issue}`);
        });
      });
    }

    // 5. HEALTH SCORE COMPLESSIVO
    const totalTests = articles.length + categories.length;
    const totalPassed = articlesPassed + categoriesPassed;
    const overallScore = Math.round((totalPassed / totalTests) * 100);
    
    console.log(`\n🏆 HEALTH SCORE COMPLESSIVO: ${overallScore}%`);
    
    if (overallScore >= 90) {
      console.log('✅ ECCELLENTE: Tutte le pagine funzionano correttamente');
    } else if (overallScore >= 80) {
      console.log('🟢 BUONO: Alcune pagine necessitano miglioramenti');
    } else if (overallScore >= 70) {
      console.log('🟡 MEDIO: Interventi significativi necessari');
    } else if (overallScore >= 60) {
      console.log('🟠 BASSO: Interventi urgenti necessari');
    } else {
      console.log('🔴 CRITICO: Interventi immediati necessari');
    }

    // 6. RACCOMANDAZIONI
    console.log('\n💡 RACCOMANDAZIONI:');
    
    if (failedArticles.length > 0) {
      console.log('🔧 FIX ARTICOLI:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni articolo con problemi');
      console.log('   3. Correggi i problemi identificati');
      console.log('   4. Salva e pubblica');
    }
    
    if (failedCategories.length > 0) {
      console.log('🔧 FIX CATEGORIE:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni categoria con problemi');
      console.log('   3. Aggiungi slug mancanti');
      console.log('   4. Salva e pubblica');
    }

    console.log('\n🎯 RISULTATO FINALE:');
    if (overallScore >= 80) {
      console.log('✅ Il sito è pronto per l\'indicizzazione');
      console.log('✅ Google può accedere e comprendere i contenuti');
      console.log('✅ La struttura è ottimizzata');
    } else {
      console.log('❌ Il sito necessita di interventi prima dell\'indicizzazione');
      console.log('❌ Google potrebbe avere difficoltà ad accedere ai contenuti');
      console.log('❌ La struttura necessita di miglioramenti');
    }

  } catch (error) {
    console.error('❌ Errore durante il test delle pagine:', error);
  }
}

testAllPages();

