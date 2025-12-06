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

async function deepIndexingAnalysis() {
  try {
    console.log('🔍 ANALISI APPROFONDITA PROBLEMI INDICIZZAZIONE\n');

    // 1. ANALISI DETTAGLIATA ARTICOLI PROBLEMATICI
    console.log('📝 1. ANALISI DETTAGLIATA ARTICOLI PROBLEMATICI...');
    
    const problematicSlugs = [
      'surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia',
      'pesca-alla-seppia-tecniche-periodi-migliori-e-consigli-pratici',
      'migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali',
      'rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti',
      'pesca-al-polpo-tecniche-periodi-migliori-e-consigli-pratici',
      'licenza-di-pesca-in-italia-tipi-costi-regole-e-come-ottenerla',
      'i-7-consigli-fondamentali-per-pescare-correttamente',
      'migliori-canne-da-spinning-economiche-professionali',
      'migliori-mulinelli-da-spinning-guida-completa-economici-e-professionali'
    ];

    for (const slug of problematicSlugs) {
      console.log(`\n🔍 Analizzando: ${slug}`);
      
      // Verifica se l'articolo esiste nel database
      const article = await client.fetch(`
        *[_type == "post" && slug.current == "${slug}" && status == "published"][0] {
          _id,
          title,
          "slug": slug.current,
          publishedAt,
          status,
          mainImage,
          body,
          categories,
          seoTitle,
          seoDescription,
          seoKeywords
        }
      `);

      if (article) {
        console.log(`✅ Articolo trovato nel database:`);
        console.log(`   Titolo: ${article.title}`);
        console.log(`   Data: ${article.publishedAt}`);
        console.log(`   Status: ${article.status}`);
        console.log(`   Immagine: ${article.mainImage ? '✅' : '❌'}`);
        console.log(`   Contenuto: ${article.body ? '✅' : '❌'}`);
        console.log(`   SEO Title: ${article.seoTitle || '❌'}`);
        console.log(`   SEO Description: ${article.seoDescription || '❌'}`);
        console.log(`   SEO Keywords: ${article.seoKeywords ? '✅' : '❌'}`);
      } else {
        console.log(`❌ Articolo NON trovato nel database!`);
      }
    }

    // 2. VERIFICA REDIRECT ESISTENTI
    console.log('\n🔄 2. VERIFICA REDIRECT ESISTENTI...');
    
    const redirectFiles = [
      'app/articoli/surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia/page.tsx',
      'app/articoli/migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali/page.tsx',
      'app/articoli/rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti/page.tsx',
      'app/categoria/tecniche/page.tsx',
      'app/categoria/spot/page.tsx'
    ];

    redirectFiles.forEach(filePath => {
      const fullPath = path.join(process.cwd(), filePath);
      if (fs.existsSync(fullPath)) {
        console.log(`✅ Redirect file esistente: ${filePath}`);
        const content = fs.readFileSync(fullPath, 'utf8');
        if (content.includes('redirect(')) {
          console.log(`   ✅ Contiene redirect`);
        } else {
          console.log(`   ❌ NON contiene redirect`);
        }
      } else {
        console.log(`❌ Redirect file MANCANTE: ${filePath}`);
      }
    });

    // 3. VERIFICA SITEMAP DETTAGLIATA
    console.log('\n🗺️ 3. VERIFICA SITEMAP DETTAGLIATA...');
    
    const sitemapPath = path.join(process.cwd(), 'public/sitemap-static.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
      const urls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
      
      console.log(`✅ Sitemap trovata con ${urls.length} URL`);
      
      // Verifica URL problematici nella sitemap
      const problematicUrls = [
        'https://fishandtips.it/articoli/surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia',
        'https://fishandtips.it/articoli/migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali',
        'https://fishandtips.it/articoli/rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti',
        'https://fishandtips.it/categoria/tecniche',
        'https://fishandtips.it/categoria/spot'
      ];

      problematicUrls.forEach(url => {
        if (urls.includes(url)) {
          console.log(`❌ URL problematico PRESENTE in sitemap: ${url}`);
        } else {
          console.log(`✅ URL problematico ASSENTE da sitemap: ${url}`);
        }
      });
    } else {
      console.log('❌ Sitemap non trovata!');
    }

    // 4. VERIFICA ROBOTS.TXT
    console.log('\n🤖 4. VERIFICA ROBOTS.TXT...');
    
    const robotsPath = path.join(process.cwd(), 'app/robots.ts');
    if (fs.existsSync(robotsPath)) {
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      console.log('✅ robots.ts trovato');
      
      // Verifica regole specifiche
      const disallowRules = [
        '/favicon.ico',
        '/manifest.webmanifest',
        '/feed.xml',
        '/sitemap.xml',
        '/articoli?search=*'
      ];

      disallowRules.forEach(rule => {
        if (robotsContent.includes(rule)) {
          console.log(`✅ Regola presente: ${rule}`);
        } else {
          console.log(`❌ Regola MANCANTE: ${rule}`);
        }
      });
    } else {
      console.log('❌ robots.ts non trovato!');
    }

    // 5. VERIFICA METADATA E SEO
    console.log('\n📊 5. VERIFICA METADATA E SEO...');
    
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        seoTitle,
        seoDescription,
        seoKeywords,
        mainImage,
        body
      }
    `);

    console.log(`📝 Articoli totali: ${articles.length}`);
    
    const articlesWithoutSEO = articles.filter(article => 
      !article.seoTitle || !article.seoDescription || !article.seoKeywords
    );
    
    console.log(`❌ Articoli senza SEO completo: ${articlesWithoutSEO.length}`);
    
    if (articlesWithoutSEO.length > 0) {
      console.log('\n📋 Articoli con SEO incompleto:');
      articlesWithoutSEO.forEach(article => {
        console.log(`   - ${article.title}`);
        console.log(`     SEO Title: ${article.seoTitle ? '✅' : '❌'}`);
        console.log(`     SEO Description: ${article.seoDescription ? '✅' : '❌'}`);
        console.log(`     SEO Keywords: ${article.seoKeywords ? '✅' : '❌'}`);
      });
    }

    // 6. VERIFICA IMMAGINI
    console.log('\n🖼️ 6. VERIFICA IMMAGINI...');
    
    const articlesWithoutImages = articles.filter(article => !article.mainImage);
    console.log(`❌ Articoli senza immagine: ${articlesWithoutImages.length}`);
    
    if (articlesWithoutImages.length > 0) {
      console.log('\n📋 Articoli senza immagine:');
      articlesWithoutImages.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }

    // 7. VERIFICA CONTENUTO
    console.log('\n📄 7. VERIFICA CONTENUTO...');
    
    const articlesWithoutContent = articles.filter(article => !article.body);
    console.log(`❌ Articoli senza contenuto: ${articlesWithoutContent.length}`);
    
    if (articlesWithoutContent.length > 0) {
      console.log('\n📋 Articoli senza contenuto:');
      articlesWithoutContent.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }

    // 8. ANALISI PROBLEMI SPECIFICI
    console.log('\n🚨 8. ANALISI PROBLEMI SPECIFICI...');
    
    // Verifica se ci sono articoli con slug duplicati
    const slugCounts = {};
    articles.forEach(article => {
      slugCounts[article.slug] = (slugCounts[article.slug] || 0) + 1;
    });
    
    const duplicateSlugs = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
    console.log(`❌ Slug duplicati: ${duplicateSlugs.length}`);
    
    if (duplicateSlugs.length > 0) {
      console.log('\n📋 Slug duplicati:');
      duplicateSlugs.forEach(([slug, count]) => {
        console.log(`   - ${slug}: ${count} volte`);
      });
    }

    // Verifica date di pubblicazione
    const now = new Date();
    const futureArticles = articles.filter(article => 
      new Date(article.publishedAt) > now
    );
    console.log(`⚠️ Articoli con data futura: ${futureArticles.length}`);
    
    if (futureArticles.length > 0) {
      console.log('\n📋 Articoli con data futura:');
      futureArticles.forEach(article => {
        console.log(`   - ${article.title}: ${article.publishedAt}`);
      });
    }

    // 9. RACCOMANDAZIONI SPECIFICHE
    console.log('\n💡 9. RACCOMANDAZIONI SPECIFICHE...');
    
    if (articlesWithoutSEO.length > 0) {
      console.log('🔧 FIX SEO:');
      console.log('   - Aggiungere SEO title, description e keywords a tutti gli articoli');
      console.log('   - Usare parole chiave rilevanti per ogni articolo');
    }
    
    if (articlesWithoutImages.length > 0) {
      console.log('🔧 FIX IMMAGINI:');
      console.log('   - Aggiungere immagini principali a tutti gli articoli');
      console.log('   - Ottimizzare immagini per SEO (alt text, dimensioni)');
    }
    
    if (articlesWithoutContent.length > 0) {
      console.log('🔧 FIX CONTENUTO:');
      console.log('   - Verificare che tutti gli articoli abbiano contenuto');
      console.log('   - Controllare che il contenuto sia completo e di qualità');
    }
    
    if (futureArticles.length > 0) {
      console.log('🔧 FIX DATE:');
      console.log('   - Correggere date di pubblicazione future');
      console.log('   - Impostare date corrette per tutti gli articoli');
    }

    console.log('\n🎯 RISULTATO ANALISI APPROFONDITA:');
    console.log(`📝 Articoli totali: ${articles.length}`);
    console.log(`❌ SEO incompleto: ${articlesWithoutSEO.length}`);
    console.log(`❌ Senza immagine: ${articlesWithoutImages.length}`);
    console.log(`❌ Senza contenuto: ${articlesWithoutContent.length}`);
    console.log(`❌ Slug duplicati: ${duplicateSlugs.length}`);
    console.log(`⚠️ Date future: ${futureArticles.length}`);

  } catch (error) {
    console.error('❌ Errore durante l\'analisi approfondita:', error);
  }
}

deepIndexingAnalysis();



