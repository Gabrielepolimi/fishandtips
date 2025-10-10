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

async function completeIndexingAudit() {
  try {
    console.log('🔍 AUDIT COMPLETO PER INDICIZZAZIONE\n');
    console.log('📅 Verifica sistematica per ottimizzazione SEO\n');

    // 1. AUDIT ARTICOLI E CONTENUTI
    console.log('📝 1. AUDIT ARTICOLI E CONTENUTI...');
    
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
        youtubeDescription,
        author,
        excerpt
      } | order(publishedAt desc)
    `);

    console.log(`📊 STATISTICHE ARTICOLI:`);
    console.log(`   📝 Articoli totali: ${articles.length}`);
    console.log(`   📅 Articoli pubblicati: ${articles.filter(a => a.status === 'published').length}`);
    console.log(`   📅 Articoli con date future: ${articles.filter(a => new Date(a.publishedAt) > new Date()).length}`);
    console.log(`   📅 Articoli con date passate: ${articles.filter(a => new Date(a.publishedAt) <= new Date()).length}`);

    // Verifica SEO completo
    const seoComplete = articles.filter(article => 
      article.seoTitle && 
      article.seoDescription && 
      article.seoKeywords &&
      article.seoTitle.length >= 30 &&
      article.seoTitle.length <= 60 &&
      article.seoDescription.length >= 120 &&
      article.seoDescription.length <= 160
    );
    console.log(`   ✅ SEO completo: ${seoComplete.length}/${articles.length} (${Math.round((seoComplete.length/articles.length)*100)}%)`);

    // Verifica immagini
    const withImages = articles.filter(article => article.mainImage);
    console.log(`   🖼️ Con immagini: ${withImages.length}/${articles.length} (${Math.round((withImages.length/articles.length)*100)}%)`);

    // Verifica contenuto
    const withContent = articles.filter(article => article.body && article.body.length > 0);
    console.log(`   📄 Con contenuto: ${withContent.length}/${articles.length} (${Math.round((withContent.length/articles.length)*100)}%)`);

    // Verifica video YouTube
    const withVideo = articles.filter(article => article.showYouTubeVideo);
    console.log(`   🎥 Con video YouTube: ${withVideo.length}/${articles.length} (${Math.round((withVideo.length/articles.length)*100)}%)`);

    // 2. AUDIT CATEGORIE
    console.log('\n📂 2. AUDIT CATEGORIE...');
    
    const categories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current,
        description
      }
    `);
    
    console.log(`📊 STATISTICHE CATEGORIE:`);
    console.log(`   📂 Categorie totali: ${categories.length}`);
    
    const categoriesWithSlug = categories.filter(cat => cat.slug);
    console.log(`   ✅ Con slug: ${categoriesWithSlug.length}/${categories.length}`);
    
    const categoriesWithoutSlug = categories.filter(cat => !cat.slug);
    console.log(`   ❌ Senza slug: ${categoriesWithoutSlug.length}/${categories.length}`);
    
    if (categoriesWithoutSlug.length > 0) {
      console.log(`   📋 Categorie senza slug:`);
      categoriesWithoutSlug.forEach(cat => {
        console.log(`      - ${cat.title} (ID: ${cat._id})`);
      });
    }

    // Verifica articoli per categoria
    const categoryStats = {};
    articles.forEach(article => {
      if (article.categories) {
        article.categories.forEach(cat => {
          const categoryName = typeof cat === 'object' ? cat.title : cat;
          categoryStats[categoryName] = (categoryStats[categoryName] || 0) + 1;
        });
      }
    });
    
    console.log(`   📊 Distribuzione articoli per categoria:`);
    Object.entries(categoryStats).forEach(([category, count]) => {
      console.log(`      - ${category}: ${count} articoli`);
    });

    // 3. AUDIT SITEMAP
    console.log('\n🗺️ 3. AUDIT SITEMAP...');
    
    const sitemapPath = path.join(process.cwd(), 'public/sitemap-static.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
      const sitemapUrls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
      
      console.log(`📊 STATISTICHE SITEMAP:`);
      console.log(`   📄 Sitemap trovata: ✅`);
      console.log(`   🔗 URL totali: ${sitemapUrls.length}`);
      
      // Verifica articoli in sitemap
      const articlesInSitemap = articles.filter(article => 
        sitemapUrls.includes(`https://fishandtips.it/articoli/${article.slug}`)
      );
      console.log(`   📝 Articoli in sitemap: ${articlesInSitemap.length}/${articles.length}`);
      
      // Verifica categorie in sitemap
      const categoriesInSitemap = categoriesWithSlug.filter(cat => 
        sitemapUrls.includes(`https://fishandtips.it/categoria/${cat.slug}`)
      );
      console.log(`   📂 Categorie in sitemap: ${categoriesInSitemap.length}/${categoriesWithSlug.length}`);
      
      // Verifica URL mancanti
      const missingArticles = articles.filter(article => 
        !sitemapUrls.includes(`https://fishandtips.it/articoli/${article.slug}`)
      );
      if (missingArticles.length > 0) {
        console.log(`   ❌ Articoli mancanti dalla sitemap: ${missingArticles.length}`);
        missingArticles.forEach(article => {
          console.log(`      - ${article.title} (${article.slug})`);
        });
      }
      
      // Verifica URL duplicati
      const urlCounts = {};
      sitemapUrls.forEach(url => {
        urlCounts[url] = (urlCounts[url] || 0) + 1;
      });
      const duplicateUrls = Object.entries(urlCounts).filter(([url, count]) => count > 1);
      console.log(`   🔄 URL duplicati: ${duplicateUrls.length}`);
      
    } else {
      console.log(`   ❌ Sitemap non trovata!`);
    }

    // 4. AUDIT ROBOTS.TXT
    console.log('\n🤖 4. AUDIT ROBOTS.TXT...');
    
    const robotsPath = path.join(process.cwd(), 'app/robots.ts');
    if (fs.existsSync(robotsPath)) {
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      console.log('✅ robots.ts trovato');
      
      // Verifica regole critiche
      const criticalRules = [
        'sitemap:',
        'Disallow: /api/',
        'Disallow: /_next/',
        'Disallow: /favicon.ico',
        'Disallow: /manifest.webmanifest',
        'Disallow: /feed.xml',
        'Disallow: /sitemap.xml',
        'Disallow: /articoli?search=*'
      ];
      
      let rulesPresent = 0;
      criticalRules.forEach(rule => {
        if (robotsContent.includes(rule)) {
          console.log(`   ✅ ${rule}`);
          rulesPresent++;
        } else {
          console.log(`   ❌ ${rule}`);
        }
      });
      
      console.log(`   📊 Regole presenti: ${rulesPresent}/${criticalRules.length} (${Math.round((rulesPresent/criticalRules.length)*100)}%)`);
      
    } else {
      console.log('❌ robots.ts non trovato!');
    }

    // 5. AUDIT METADATA E SEO
    console.log('\n📊 5. AUDIT METADATA E SEO...');
    
    // Analisi SEO dettagliata
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
    
    console.log(`📊 STATISTICHE SEO:`);
    console.log(`   ✅ Articoli con SEO ottimizzato: ${articles.length - seoIssues.length}/${articles.length}`);
    console.log(`   ❌ Articoli con problemi SEO: ${seoIssues.length}/${articles.length}`);
    
    if (seoIssues.length > 0) {
      console.log(`   📋 Articoli con problemi SEO:`);
      seoIssues.forEach(article => {
        console.log(`      - ${article.title}`);
        article.issues.forEach(issue => {
          console.log(`        ❌ ${issue}`);
        });
      });
    }

    // 6. AUDIT STRUTTURA URL
    console.log('\n🔗 6. AUDIT STRUTTURA URL...');
    
    // Verifica slug duplicati
    const slugCounts = {};
    articles.forEach(article => {
      slugCounts[article.slug] = (slugCounts[article.slug] || 0) + 1;
    });
    
    const duplicateSlugs = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
    console.log(`📊 STATISTICHE URL:`);
    console.log(`   🔄 Slug duplicati: ${duplicateSlugs.length}`);
    
    // Verifica slug problematici
    const problematicSlugs = articles.filter(article => 
      article.slug.includes('--') || 
      article.slug.endsWith('-') || 
      article.slug.startsWith('-') ||
      article.slug.length > 100 ||
      article.slug.includes(' ') ||
      article.slug.includes('_')
    );
    console.log(`   ❌ Slug problematici: ${problematicSlugs.length}`);
    
    if (problematicSlugs.length > 0) {
      console.log(`   📋 Slug problematici:`);
      problematicSlugs.forEach(article => {
        console.log(`      - ${article.slug} (${article.title})`);
      });
    }

    // 7. AUDIT IMMAGINI E MEDIA
    console.log('\n🖼️ 7. AUDIT IMMAGINI E MEDIA...');
    
    const articlesWithImages = articles.filter(article => article.mainImage);
    const articlesWithoutImages = articles.filter(article => !article.mainImage);
    
    console.log(`📊 STATISTICHE IMMAGINI:`);
    console.log(`   ✅ Articoli con immagini: ${articlesWithImages.length}/${articles.length}`);
    console.log(`   ❌ Articoli senza immagini: ${articlesWithoutImages.length}/${articles.length}`);
    
    if (articlesWithoutImages.length > 0) {
      console.log(`   📋 Articoli senza immagini:`);
      articlesWithoutImages.forEach(article => {
        console.log(`      - ${article.title}`);
      });
    }
    
    // Verifica video YouTube
    const articlesWithVideo = articles.filter(article => article.showYouTubeVideo);
    const completeVideos = articlesWithVideo.filter(article => 
      article.youtubeUrl && article.youtubeTitle && article.youtubeDescription
    );
    
    console.log(`   🎥 Articoli con video YouTube: ${articlesWithVideo.length}`);
    console.log(`   ✅ Video completi: ${completeVideos.length}/${articlesWithVideo.length}`);
    
    if (articlesWithVideo.length > 0 && completeVideos.length < articlesWithVideo.length) {
      console.log(`   📋 Video incompleti:`);
      articlesWithVideo.forEach(article => {
        if (!article.youtubeUrl || !article.youtubeTitle || !article.youtubeDescription) {
          console.log(`      - ${article.title}`);
          if (!article.youtubeUrl) console.log(`        ❌ URL mancante`);
          if (!article.youtubeTitle) console.log(`        ❌ Titolo mancante`);
          if (!article.youtubeDescription) console.log(`        ❌ Descrizione mancante`);
        }
      });
    }

    // 8. AUDIT PERFORMANCE E TECNICA
    console.log('\n⚡ 8. AUDIT PERFORMANCE E TECNICA...');
    
    const now = new Date();
    const futureArticles = articles.filter(article => new Date(article.publishedAt) > now);
    const recentArticles = articles.filter(article => 
      new Date(article.publishedAt) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    );
    const oldArticles = articles.filter(article => 
      new Date(article.publishedAt) < new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    );
    
    console.log(`📊 STATISTICHE TEMPORALI:`);
    console.log(`   📅 Articoli con date future: ${futureArticles.length}`);
    console.log(`   📅 Articoli pubblicati negli ultimi 30 giorni: ${recentArticles.length}`);
    console.log(`   📅 Articoli pubblicati più di 60 giorni fa: ${oldArticles.length}`);
    
    // Verifica autori
    const authors = [...new Set(articles.map(article => article.author))];
    console.log(`   👥 Autori unici: ${authors.length}`);
    
    // Verifica excerpt
    const articlesWithExcerpt = articles.filter(article => article.excerpt && article.excerpt.length > 0);
    console.log(`   📝 Articoli con excerpt: ${articlesWithExcerpt.length}/${articles.length}`);

    // 9. ANALISI PROBLEMI CRITICI
    console.log('\n🚨 9. ANALISI PROBLEMI CRITICI...');
    
    const criticalIssues = [];
    
    if (categoriesWithoutSlug.length > 0) {
      criticalIssues.push(`🔴 CRITICO: ${categoriesWithoutSlug.length} categorie senza slug`);
    }
    
    if (seoIssues.length > 0) {
      criticalIssues.push(`🟡 ALTO: ${seoIssues.length} articoli con problemi SEO`);
    }
    
    if (articlesWithoutImages.length > 0) {
      criticalIssues.push(`🟡 ALTO: ${articlesWithoutImages.length} articoli senza immagini`);
    }
    
    if (duplicateSlugs.length > 0) {
      criticalIssues.push(`🔴 CRITICO: ${duplicateSlugs.length} slug duplicati`);
    }
    
    if (problematicSlugs.length > 0) {
      criticalIssues.push(`🟡 ALTO: ${problematicSlugs.length} slug problematici`);
    }
    
    if (criticalIssues.length > 0) {
      console.log(`🚨 PROBLEMI CRITICI IDENTIFICATI:`);
      criticalIssues.forEach(issue => console.log(`   ${issue}`));
    } else {
      console.log(`✅ Nessun problema critico identificato`);
    }

    // 10. CALCOLO HEALTH SCORE
    console.log('\n🏆 10. CALCOLO HEALTH SCORE...');
    
    let score = 0;
    let maxScore = 0;
    
    // SEO Score (25%)
    maxScore += 25;
    score += (seoComplete.length / articles.length) * 25;
    
    // Images Score (20%)
    maxScore += 20;
    score += (withImages.length / articles.length) * 20;
    
    // Content Score (20%)
    maxScore += 20;
    score += (withContent.length / articles.length) * 20;
    
    // Categories Score (15%)
    maxScore += 15;
    score += (categoriesWithSlug.length / categories.length) * 15;
    
    // URL Structure Score (10%)
    maxScore += 10;
    score += (articles.length - problematicSlugs.length - duplicateSlugs.length) / articles.length * 10;
    
    // Video Score (10%)
    maxScore += 10;
    score += (completeVideos.length / Math.max(articlesWithVideo.length, 1)) * 10;
    
    const healthScore = Math.round(score);
    
    console.log(`📊 HEALTH SCORE: ${healthScore}%`);
    
    if (healthScore >= 90) {
      console.log(`✅ ECCELLENTE: Sistema SEO ottimizzato`);
    } else if (healthScore >= 80) {
      console.log(`🟢 BUONO: Alcuni miglioramenti necessari`);
    } else if (healthScore >= 70) {
      console.log(`🟡 MEDIO: Interventi significativi necessari`);
    } else if (healthScore >= 60) {
      console.log(`🟠 BASSO: Interventi urgenti necessari`);
    } else {
      console.log(`🔴 CRITICO: Interventi immediati necessari`);
    }

    // 11. RACCOMANDAZIONI PRIORITARIE
    console.log('\n💡 11. RACCOMANDAZIONI PRIORITARIE...');
    
    const recommendations = [];
    
    if (categoriesWithoutSlug.length > 0) {
      recommendations.push({
        priority: '🔴 CRITICO',
        action: 'Fix categorie senza slug',
        description: 'Aggiornare slug delle categorie in Sanity Studio',
        impact: 'Pagine categoria non funzionano'
      });
    }
    
    if (duplicateSlugs.length > 0) {
      recommendations.push({
        priority: '🔴 CRITICO',
        action: 'Fix slug duplicati',
        description: 'Correggere slug duplicati immediatamente',
        impact: 'Conflitti di URL'
      });
    }
    
    if (seoIssues.length > 0) {
      recommendations.push({
        priority: '🟡 ALTO',
        action: 'Fix SEO articoli',
        description: 'Aggiornare SEO title, description e keywords',
        impact: 'Indicizzazione compromessa'
      });
    }
    
    if (articlesWithoutImages.length > 0) {
      recommendations.push({
        priority: '🟡 ALTO',
        action: 'Fix immagini articoli',
        description: 'Aggiungere immagini principali agli articoli',
        impact: 'SEO e user experience compromessi'
      });
    }
    
    if (recommendations.length > 0) {
      console.log(`📋 RACCOMANDAZIONI PRIORITARIE:`);
      recommendations.forEach((rec, index) => {
        console.log(`   ${index + 1}. ${rec.priority} ${rec.action}`);
        console.log(`      📝 ${rec.description}`);
        console.log(`      💥 ${rec.impact}`);
      });
    } else {
      console.log(`✅ Nessuna raccomandazione critica`);
    }

    // 12. RIEPILOGO FINALE
    console.log('\n📊 12. RIEPILOGO FINALE...');
    console.log(`📝 Articoli totali: ${articles.length}`);
    console.log(`📂 Categorie totali: ${categories.length}`);
    console.log(`✅ SEO ottimizzato: ${seoComplete.length}`);
    console.log(`❌ SEO problematico: ${seoIssues.length}`);
    console.log(`✅ Con immagini: ${withImages.length}`);
    console.log(`❌ Senza immagini: ${articlesWithoutImages.length}`);
    console.log(`✅ Con contenuto: ${withContent.length}`);
    console.log(`🎥 Con video YouTube: ${articlesWithVideo.length}`);
    console.log(`✅ Video completi: ${completeVideos.length}`);
    console.log(`✅ Categorie con slug: ${categoriesWithSlug.length}`);
    console.log(`❌ Categorie senza slug: ${categoriesWithoutSlug.length}`);
    console.log(`🔄 Slug duplicati: ${duplicateSlugs.length}`);
    console.log(`❌ Slug problematici: ${problematicSlugs.length}`);
    
    console.log(`\n🎯 RISULTATO FINALE:`);
    console.log(`🏆 Health Score: ${healthScore}%`);
    console.log(`🚨 Problemi critici: ${criticalIssues.length}`);
    console.log(`💡 Raccomandazioni: ${recommendations.length}`);

  } catch (error) {
    console.error('❌ Errore durante l\'audit completo:', error);
  }
}

completeIndexingAudit();
