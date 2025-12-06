const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function checkCategoriesSlugs() {
  try {
    console.log('🔍 CONTROLLO SLUG CATEGORIE AGGIORNATI\n');

    // 1. VERIFICA CATEGORIE CON SLUG
    const categories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current,
        description
      }
    `);

    console.log(`📂 Categorie totali: ${categories.length}\n`);

    // Verifica slug
    const categoriesWithSlug = categories.filter(cat => cat.slug);
    const categoriesWithoutSlug = categories.filter(cat => !cat.slug);
    
    console.log(`✅ Categorie con slug: ${categoriesWithSlug.length}/${categories.length}`);
    console.log(`❌ Categorie senza slug: ${categoriesWithoutSlug.length}/${categories.length}`);

    if (categoriesWithSlug.length > 0) {
      console.log('\n📋 CATEGORIE CON SLUG:');
      categoriesWithSlug.forEach(category => {
        console.log(`   ✅ ${category.title} → ${category.slug}`);
      });
    }

    if (categoriesWithoutSlug.length > 0) {
      console.log('\n📋 CATEGORIE SENZA SLUG:');
      categoriesWithoutSlug.forEach(category => {
        console.log(`   ❌ ${category.title} → slug mancante`);
      });
    }

    // 2. VERIFICA SLUG CORRETTI
    console.log('\n🔍 VERIFICA SLUG CORRETTI...');
    
    const expectedSlugs = {
      'Tecniche di Pesca': 'tecniche-di-pesca',
      'Attrezzature di Pesca': 'attrezzature',
      'Spot di Pesca': 'spot-di-pesca',
      'Consigli Generali': 'consigli'
    };

    let correctSlugs = 0;
    let incorrectSlugs = 0;

    categoriesWithSlug.forEach(category => {
      const expectedSlug = expectedSlugs[category.title];
      if (expectedSlug && category.slug === expectedSlug) {
        console.log(`   ✅ ${category.title} → ${category.slug} (CORRETTO)`);
        correctSlugs++;
      } else if (expectedSlug) {
        console.log(`   ❌ ${category.title} → ${category.slug} (ATTESO: ${expectedSlug})`);
        incorrectSlugs++;
      } else {
        console.log(`   ⚠️ ${category.title} → ${category.slug} (SLUG NON MAPPATO)`);
      }
    });

    console.log(`\n📊 STATISTICHE SLUG:`);
    console.log(`   ✅ Slug corretti: ${correctSlugs}/${categoriesWithSlug.length}`);
    console.log(`   ❌ Slug incorretti: ${incorrectSlugs}/${categoriesWithSlug.length}`);

    // 3. VERIFICA ARTICOLI PER CATEGORIA
    console.log('\n📝 VERIFICA ARTICOLI PER CATEGORIA...');
    
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        categories
      }
    `);

    const categoryStats = {};
    articles.forEach(article => {
      if (article.categories) {
        article.categories.forEach(cat => {
          const categoryName = typeof cat === 'object' ? cat.title : cat;
          categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
        });
      }
    });

    console.log(`📊 Distribuzione articoli per categoria:`);
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`   - ${category}: ${count} articoli`);
    });

    // 4. VERIFICA SITEMAP CATEGORIE
    console.log('\n🗺️ VERIFICA SITEMAP CATEGORIE...');
    
    const fs = require('fs');
    const path = require('path');
    const sitemapPath = path.join(process.cwd(), 'public/sitemap-static.xml');
    
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
      const sitemapUrls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
      
      console.log(`📄 Sitemap trovata con ${sitemapUrls.length} URL`);
      
      // Verifica se le categorie sono nella sitemap
      const categoriesInSitemap = categoriesWithSlug.filter(cat => 
        sitemapUrls.includes(`https://fishandtips.it/categoria/${cat.slug}`)
      );
      console.log(`📂 Categorie in sitemap: ${categoriesInSitemap.length}/${categoriesWithSlug.length}`);
      
      if (categoriesInSitemap.length > 0) {
        console.log(`✅ Categorie in sitemap:`);
        categoriesInSitemap.forEach(category => {
          console.log(`   - ${category.title} → https://fishandtips.it/categoria/${category.slug}`);
        });
      }
      
      if (categoriesInSitemap.length < categoriesWithSlug.length) {
        console.log(`❌ Categorie mancanti dalla sitemap:`);
        const missingCategories = categoriesWithSlug.filter(cat => 
          !sitemapUrls.includes(`https://fishandtips.it/categoria/${cat.slug}`)
        );
        missingCategories.forEach(category => {
          console.log(`   - ${category.title} → https://fishandtips.it/categoria/${category.slug}`);
        });
      }
    } else {
      console.log(`❌ Sitemap non trovata!`);
    }

    // 5. TEST PAGINE CATEGORIA
    console.log('\n🧪 TEST PAGINE CATEGORIA...');
    
    const testResults = [];
    
    categoriesWithSlug.forEach(category => {
      const testResult = {
        title: category.title,
        slug: category.slug,
        url: `https://fishandtips.it/categoria/${category.slug}`,
        tests: []
      };
      
      // Test 1: Slug presente
      testResult.tests.push({
        name: 'Slug presente',
        result: category.slug ? '✅' : '❌'
      });
      
      // Test 2: Slug valido
      testResult.tests.push({
        name: 'Slug valido',
        result: category.slug && !category.slug.includes('undefined') && !category.slug.includes(' ') ? '✅' : '❌'
      });
      
      // Test 3: Slug corretto
      const expectedSlug = expectedSlugs[category.title];
      testResult.tests.push({
        name: 'Slug corretto',
        result: expectedSlug && category.slug === expectedSlug ? '✅' : '❌'
      });
      
      // Test 4: In sitemap
      const inSitemap = sitemapUrls && sitemapUrls.includes(`https://fishandtips.it/categoria/${category.slug}`);
      testResult.tests.push({
        name: 'In sitemap',
        result: inSitemap ? '✅' : '❌'
      });
      
      testResults.push(testResult);
    });

    testResults.forEach((result, index) => {
      console.log(`\n${index + 1}. ${result.title}`);
      console.log(`   Slug: ${result.slug}`);
      console.log(`   URL: ${result.url}`);
      
      result.tests.forEach(test => {
        console.log(`   ${test.result} ${test.name}`);
      });
      
      const passedTests = result.tests.filter(t => t.result === '✅').length;
      const totalTests = result.tests.length;
      const score = Math.round((passedTests / totalTests) * 100);
      
      console.log(`   📊 Score: ${score}% (${passedTests}/${totalTests})`);
      
      if (score >= 80) {
        console.log(`   ✅ PASSA`);
      } else {
        console.log(`   ❌ FALLISCE`);
      }
    });

    // 6. RIEPILOGO FINALE
    console.log('\n📊 RIEPILOGO FINALE...');
    
    const totalCategories = categories.length;
    const categoriesWithSlugCount = categoriesWithSlug.length;
    const correctSlugsCount = correctSlugs;
    const categoriesInSitemapCount = categoriesInSitemap ? categoriesInSitemap.length : 0;
    
    console.log(`📂 Categorie totali: ${totalCategories}`);
    console.log(`✅ Con slug: ${categoriesWithSlugCount}/${totalCategories} (${Math.round((categoriesWithSlugCount/totalCategories)*100)}%)`);
    console.log(`✅ Slug corretti: ${correctSlugsCount}/${categoriesWithSlugCount} (${Math.round((correctSlugsCount/categoriesWithSlugCount)*100)}%)`);
    console.log(`✅ In sitemap: ${categoriesInSitemapCount}/${categoriesWithSlugCount} (${Math.round((categoriesInSitemapCount/categoriesWithSlugCount)*100)}%)`);
    
    const overallScore = Math.round(((categoriesWithSlugCount + correctSlugsCount + categoriesInSitemapCount) / (totalCategories * 3)) * 100);
    console.log(`🏆 HEALTH SCORE: ${overallScore}%`);
    
    if (overallScore >= 90) {
      console.log('✅ ECCELLENTE: Categorie completamente ottimizzate');
    } else if (overallScore >= 80) {
      console.log('🟢 BUONO: Categorie quasi ottimizzate');
    } else if (overallScore >= 70) {
      console.log('🟡 MEDIO: Categorie necessitano miglioramenti');
    } else if (overallScore >= 60) {
      console.log('🟠 BASSO: Categorie necessitano interventi urgenti');
    } else {
      console.log('🔴 CRITICO: Categorie necessitano interventi immediati');
    }

    // 7. RACCOMANDAZIONI
    console.log('\n💡 RACCOMANDAZIONI:');
    
    if (categoriesWithoutSlug.length > 0) {
      console.log('🔧 FIX SLUG MANCANTI:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni categoria senza slug');
      console.log('   3. Aggiungi lo slug corretto');
      console.log('   4. Salva e pubblica');
    }
    
    if (incorrectSlugs > 0) {
      console.log('🔧 FIX SLUG INCORRETTI:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni categoria con slug incorretto');
      console.log('   3. Correggi lo slug');
      console.log('   4. Salva e pubblica');
    }
    
    if (categoriesInSitemapCount < categoriesWithSlugCount) {
      console.log('🔧 FIX SITEMAP:');
      console.log('   1. Aggiorna la sitemap con le categorie');
      console.log('   2. Aggiungi URL delle categorie');
      console.log('   3. Ricarica la sitemap');
    }

    console.log('\n🎯 RISULTATO FINALE:');
    if (overallScore >= 80) {
      console.log('✅ Le categorie sono ottimizzate per l\'indicizzazione');
      console.log('✅ Google può accedere alle pagine categoria');
      console.log('✅ La struttura del sito è completa');
    } else {
      console.log('❌ Le categorie necessitano di ulteriori interventi');
      console.log('❌ Google potrebbe avere difficoltà ad accedere alle pagine categoria');
      console.log('❌ La struttura del sito è incompleta');
    }

  } catch (error) {
    console.error('❌ Errore durante il controllo categorie:', error);
  }
}

checkCategoriesSlugs();



