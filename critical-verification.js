const { createClient } = require('@sanity/client');
const fs = require('fs');
const path = require('path');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function criticalVerification() {
  try {
    console.log('🔍 VERIFICA CRITICA: SONO SICURO AL 100%?\n');
    console.log('🤔 Analisi onesta e dettagliata\n');

    // 1. VERIFICA GOOGLE PUÒ ACCEDERE A TUTTE LE PAGINE
    console.log('🔍 1. GOOGLE PUÒ ACCEDERE A TUTTE LE PAGINE?');
    
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        status
      }
    `);

    console.log(`📝 Articoli pubblicati: ${articles.length}`);
    
    // Verifica se tutti gli articoli sono accessibili
    const accessibleArticles = articles.filter(article => 
      article.slug && 
      article.slug.length > 0 && 
      !article.slug.includes('undefined') &&
      article.status === 'published'
    );
    
    console.log(`✅ Articoli accessibili: ${accessibleArticles.length}/${articles.length}`);
    
    if (accessibleArticles.length < articles.length) {
      console.log(`❌ PROBLEMA: ${articles.length - accessibleArticles.length} articoli non accessibili`);
      const inaccessibleArticles = articles.filter(article => 
        !article.slug || 
        article.slug.length === 0 || 
        article.slug.includes('undefined') ||
        article.status !== 'published'
      );
      inaccessibleArticles.forEach(article => {
        console.log(`   - ${article.title} (${article.slug})`);
      });
    }

    // 2. VERIFICA GOOGLE PUÒ SEGUIRE TUTTI I REDIRECT
    console.log('\n🔍 2. GOOGLE PUÒ SEGUIRE TUTTI I REDIRECT?');
    
    const redirectFiles = [
      'app/articoli/surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia/page.tsx',
      'app/articoli/migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali/page.tsx',
      'app/articoli/rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti/page.tsx',
      'app/categoria/tecniche/page.tsx',
      'app/categoria/spot/page.tsx'
    ];

    let workingRedirects = 0;
    redirectFiles.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('redirect(') && content.includes('301')) {
          workingRedirects++;
          console.log(`   ✅ ${filePath} → Redirect 301 funzionante`);
        } else {
          console.log(`   ❌ ${filePath} → Redirect non funzionante`);
        }
      } else {
        console.log(`   ❌ ${filePath} → File mancante`);
      }
    });
    
    console.log(`📊 Redirect funzionanti: ${workingRedirects}/${redirectFiles.length}`);
    
    if (workingRedirects < redirectFiles.length) {
      console.log(`❌ PROBLEMA: ${redirectFiles.length - workingRedirects} redirect non funzionanti`);
    }

    // 3. VERIFICA GOOGLE PUÒ CAPIRE LA STRUTTURA
    console.log('\n🔍 3. GOOGLE PUÒ CAPIRE LA STRUTTURA?');
    
    const categories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current
      }
    `);
    
    const categoriesWithSlug = categories.filter(cat => cat.slug);
    console.log(`📂 Categorie con slug: ${categoriesWithSlug.length}/${categories.length}`);
    
    if (categoriesWithSlug.length < categories.length) {
      console.log(`❌ PROBLEMA: ${categories.length - categoriesWithSlug.length} categorie senza slug`);
      console.log(`   📋 Categorie senza slug:`);
      const categoriesWithoutSlug = categories.filter(cat => !cat.slug);
      categoriesWithoutSlug.forEach(cat => {
        console.log(`      - ${cat.title} → URL non accessibile`);
      });
    }
    
    // Verifica sitemap
    const sitemapPath = path.join(process.cwd(), 'public/sitemap-static.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
      const sitemapUrls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
      
      console.log(`🗺️ Sitemap: ${sitemapUrls.length} URL`);
      
      // Verifica se le categorie sono nella sitemap
      const categoriesInSitemap = categoriesWithSlug.filter(cat => 
        sitemapUrls.includes(`https://fishandtips.it/categoria/${cat.slug}`)
      );
      console.log(`📂 Categorie in sitemap: ${categoriesInSitemap.length}/${categoriesWithSlug.length}`);
      
      if (categoriesInSitemap.length < categoriesWithSlug.length) {
        console.log(`❌ PROBLEMA: Categorie non in sitemap`);
      }
    }

    // 4. VERIFICA GOOGLE PUÒ IDENTIFICARE CONTENUTI DUPLICATI
    console.log('\n🔍 4. GOOGLE PUÒ IDENTIFICARE CONTENUTI DUPLICATI?');
    
    // Verifica canonical tags
    const canonicalIssues = [];
    
    // Verifica se ci sono slug duplicati
    const slugCounts = {};
    articles.forEach(article => {
      slugCounts[article.slug] = (slugCounts[article.slug] || 0) + 1;
    });
    
    const duplicateSlugs = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
    console.log(`🔄 Slug duplicati: ${duplicateSlugs.length}`);
    
    if (duplicateSlugs.length > 0) {
      console.log(`❌ PROBLEMA: Slug duplicati trovati`);
      duplicateSlugs.forEach(([slug, count]) => {
        console.log(`   - ${slug}: ${count} volte`);
      });
    }
    
    // Verifica se ci sono articoli con stesso titolo
    const titleCounts = {};
    articles.forEach(article => {
      titleCounts[article.title] = (titleCounts[article.title] || 0) + 1;
    });
    
    const duplicateTitles = Object.entries(titleCounts).filter(([title, count]) => count > 1);
    console.log(`📝 Titoli duplicati: ${duplicateTitles.length}`);
    
    if (duplicateTitles.length > 0) {
      console.log(`❌ PROBLEMA: Titoli duplicati trovati`);
      duplicateTitles.forEach(([title, count]) => {
        console.log(`   - ${title}: ${count} volte`);
      });
    }

    // 5. VERIFICA GOOGLE PUÒ COMPRENDERE IL CONTENUTO
    console.log('\n🔍 5. GOOGLE PUÒ COMPRENDERE IL CONTENUTO?');
    
    // Verifica SEO
    const seoIssues = [];
    articles.forEach(article => {
      const issues = [];
      
      if (!article.seoTitle) {
        issues.push('SEO Title mancante');
      } else if (article.seoTitle.length < 30) {
        issues.push(`SEO Title troppo corto (${article.seoTitle.length} chars)`);
      } else if (article.seoTitle.length > 60) {
        issues.push(`SEO Title troppo lungo (${article.seoTitle.length} chars)`);
      }
      
      if (!article.seoDescription) {
        issues.push('SEO Description mancante');
      } else if (article.seoDescription.length < 120) {
        issues.push(`SEO Description troppo corta (${article.seoDescription.length} chars)`);
      } else if (article.seoDescription.length > 160) {
        issues.push(`SEO Description troppo lunga (${article.seoDescription.length} chars)`);
      }
      
      if (!article.seoKeywords) {
        issues.push('SEO Keywords mancanti');
      }
      
      if (issues.length > 0) {
        seoIssues.push({
          title: article.title,
          slug: article.slug,
          issues: issues
        });
      }
    });
    
    console.log(`📊 Articoli con SEO ottimizzato: ${articles.length - seoIssues.length}/${articles.length}`);
    console.log(`❌ Articoli con problemi SEO: ${seoIssues.length}/${articles.length}`);
    
    if (seoIssues.length > 0) {
      console.log(`❌ PROBLEMA: ${seoIssues.length} articoli con problemi SEO`);
      seoIssues.forEach(article => {
        console.log(`   - ${article.title}`);
        article.issues.forEach(issue => {
          console.log(`     ❌ ${issue}`);
        });
      });
    }
    
    // Verifica contenuto
    const articlesWithoutContent = articles.filter(article => !article.body || article.body.length === 0);
    console.log(`📄 Articoli senza contenuto: ${articlesWithoutContent.length}/${articles.length}`);
    
    if (articlesWithoutContent.length > 0) {
      console.log(`❌ PROBLEMA: ${articlesWithoutContent.length} articoli senza contenuto`);
      articlesWithoutContent.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }
    
    // Verifica immagini
    const articlesWithoutImages = articles.filter(article => !article.mainImage);
    console.log(`🖼️ Articoli senza immagini: ${articlesWithoutImages.length}/${articles.length}`);
    
    if (articlesWithoutImages.length > 0) {
      console.log(`❌ PROBLEMA: ${articlesWithoutImages.length} articoli senza immagini`);
      articlesWithoutImages.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }

    // 6. ANALISI CRITICA FINALE
    console.log('\n🚨 6. ANALISI CRITICA FINALE...');
    
    const criticalProblems = [];
    
    if (accessibleArticles.length < articles.length) {
      criticalProblems.push(`❌ ${articles.length - accessibleArticles.length} articoli non accessibili`);
    }
    
    if (workingRedirects < redirectFiles.length) {
      criticalProblems.push(`❌ ${redirectFiles.length - workingRedirects} redirect non funzionanti`);
    }
    
    if (categoriesWithSlug.length < categories.length) {
      criticalProblems.push(`❌ ${categories.length - categoriesWithSlug.length} categorie senza slug`);
    }
    
    if (duplicateSlugs.length > 0) {
      criticalProblems.push(`❌ ${duplicateSlugs.length} slug duplicati`);
    }
    
    if (seoIssues.length > 0) {
      criticalProblems.push(`❌ ${seoIssues.length} articoli con problemi SEO`);
    }
    
    if (articlesWithoutContent.length > 0) {
      criticalProblems.push(`❌ ${articlesWithoutContent.length} articoli senza contenuto`);
    }
    
    if (articlesWithoutImages.length > 0) {
      criticalProblems.push(`❌ ${articlesWithoutImages.length} articoli senza immagini`);
    }
    
    console.log(`🚨 PROBLEMI CRITICI IDENTIFICATI: ${criticalProblems.length}`);
    
    if (criticalProblems.length > 0) {
      console.log(`📋 PROBLEMI CRITICI:`);
      criticalProblems.forEach(problem => {
        console.log(`   ${problem}`);
      });
      
      console.log(`\n❌ RISPOSTA ONESTA: NO, NON SONO SICURO AL 100%`);
      console.log(`❌ Ci sono ancora ${criticalProblems.length} problemi critici`);
      console.log(`❌ L'indicizzazione potrebbe non funzionare perfettamente`);
      console.log(`❌ Serve risolvere i problemi rimanenti`);
    } else {
      console.log(`\n✅ RISPOSTA ONESTA: SÌ, SONO SICURO AL 100%`);
      console.log(`✅ Nessun problema critico identificato`);
      console.log(`✅ L'indicizzazione dovrebbe funzionare`);
      console.log(`✅ Google può accedere e comprendere tutto`);
    }

    // 7. RACCOMANDAZIONI SPECIFICHE
    console.log('\n💡 7. RACCOMANDAZIONI SPECIFICHE...');
    
    if (criticalProblems.length > 0) {
      console.log(`🔧 FIX RICHIESTI:`);
      console.log(`   1. Fix categorie senza slug (CRITICO)`);
      console.log(`   2. Fix SEO articoli (ALTO)`);
      console.log(`   3. Verificare redirect funzionanti`);
      console.log(`   4. Controllare contenuto e immagini`);
      console.log(`   5. Testare tutte le pagine`);
    } else {
      console.log(`✅ Nessun fix richiesto`);
      console.log(`✅ Sistema pronto per l'indicizzazione`);
    }

    console.log('\n🎯 CONCLUSIONE FINALE:');
    if (criticalProblems.length > 0) {
      console.log(`❌ NO, NON SONO SICURO AL 100%`);
      console.log(`❌ Ci sono ancora problemi da risolvere`);
      console.log(`❌ L'indicizzazione potrebbe non funzionare`);
      console.log(`❌ Serve completare i fix rimanenti`);
    } else {
      console.log(`✅ SÌ, SONO SICURO AL 100%`);
      console.log(`✅ Nessun problema critico`);
      console.log(`✅ L'indicizzazione dovrebbe funzionare`);
      console.log(`✅ Google può accedere e comprendere tutto`);
    }

  } catch (error) {
    console.error('❌ Errore durante la verifica critica:', error);
  }
}

criticalVerification();



