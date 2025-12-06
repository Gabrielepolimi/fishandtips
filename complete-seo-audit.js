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

async function completeSEOAudit() {
  try {
    console.log('🔍 AUDIT COMPLETO SEO E INDICIZZAZIONE\n');
    console.log('📅 Sito online da 2+ mesi - Problemi critici da risolvere\n');

    // 1. VERIFICA ARTICOLI E CONTENUTI
    console.log('📝 1. VERIFICA ARTICOLI E CONTENUTI...');
    
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

    console.log(`✅ Articoli pubblicati: ${articles.length}`);
    
    // Verifica articoli senza SEO
    const articlesWithoutSEO = articles.filter(article => 
      !article.seoTitle || !article.seoDescription || !article.seoKeywords
    );
    console.log(`❌ Articoli senza SEO completo: ${articlesWithoutSEO.length}`);
    
    // Verifica articoli senza immagine
    const articlesWithoutImage = articles.filter(article => !article.mainImage);
    console.log(`❌ Articoli senza immagine: ${articlesWithoutImage.length}`);
    
    // Verifica articoli senza contenuto
    const articlesWithoutContent = articles.filter(article => !article.body);
    console.log(`❌ Articoli senza contenuto: ${articlesWithoutContent.length}`);

    // 2. VERIFICA SITEMAP
    console.log('\n🗺️ 2. VERIFICA SITEMAP...');
    
    const sitemapPath = path.join(process.cwd(), 'public/sitemap-static.xml');
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
      const urls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
      
      console.log(`✅ Sitemap trovata con ${urls.length} URL`);
      
      // Verifica se tutti gli articoli sono nella sitemap
      const articlesInSitemap = articles.filter(article => 
        urls.includes(`https://fishandtips.it/articoli/${article.slug}`)
      );
      console.log(`✅ Articoli in sitemap: ${articlesInSitemap.length}/${articles.length}`);
      
      if (articlesInSitemap.length < articles.length) {
        console.log('❌ Articoli mancanti dalla sitemap:');
        const missingArticles = articles.filter(article => 
          !urls.includes(`https://fishandtips.it/articoli/${article.slug}`)
        );
        missingArticles.forEach(article => {
          console.log(`   - ${article.title} (${article.slug})`);
        });
      }
    } else {
      console.log('❌ Sitemap non trovata!');
    }

    // 3. VERIFICA ROBOTS.TXT
    console.log('\n🤖 3. VERIFICA ROBOTS.TXT...');
    
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
        'Disallow: /sitemap.xml'
      ];
      
      criticalRules.forEach(rule => {
        if (robotsContent.includes(rule)) {
          console.log(`✅ Regola presente: ${rule}`);
        } else {
          console.log(`❌ Regola MANCANTE: ${rule}`);
        }
      });
    } else {
      console.log('❌ robots.ts non trovato!');
    }

    // 4. VERIFICA METADATA E SEO
    console.log('\n📊 4. VERIFICA METADATA E SEO...');
    
    // Verifica articoli con SEO ottimizzato
    const optimizedArticles = articles.filter(article => 
      article.seoTitle && 
      article.seoDescription && 
      article.seoKeywords &&
      article.seoTitle.length > 30 &&
      article.seoDescription.length > 120 &&
      article.seoDescription.length < 160
    );
    console.log(`✅ Articoli con SEO ottimizzato: ${optimizedArticles.length}/${articles.length}`);
    
    // Verifica articoli con problemi SEO
    const problematicSEO = articles.filter(article => {
      if (!article.seoTitle || !article.seoDescription) return true;
      return article.seoTitle.length <= 30 || 
             article.seoDescription.length <= 120 || 
             article.seoDescription.length >= 160;
    });
    
    if (problematicSEO.length > 0) {
      console.log(`❌ Articoli con problemi SEO: ${problematicSEO.length}`);
      problematicSEO.forEach(article => {
        console.log(`   - ${article.title}`);
        console.log(`     Title: ${article.seoTitle ? article.seoTitle.length + ' chars' : 'MISSING'}`);
        console.log(`     Description: ${article.seoDescription ? article.seoDescription.length + ' chars' : 'MISSING'}`);
      });
    }

    // 5. VERIFICA STRUTTURA URL
    console.log('\n🔗 5. VERIFICA STRUTTURA URL...');
    
    // Verifica slug duplicati
    const slugCounts = {};
    articles.forEach(article => {
      slugCounts[article.slug] = (slugCounts[article.slug] || 0) + 1;
    });
    
    const duplicateSlugs = Object.entries(slugCounts).filter(([slug, count]) => count > 1);
    console.log(`❌ Slug duplicati: ${duplicateSlugs.length}`);
    
    // Verifica slug problematici
    const problematicSlugs = articles.filter(article => 
      article.slug.includes('--') || 
      article.slug.endsWith('-') || 
      article.slug.startsWith('-') ||
      article.slug.length > 100
    );
    console.log(`❌ Slug problematici: ${problematicSlugs.length}`);
    
    if (problematicSlugs.length > 0) {
      problematicSlugs.forEach(article => {
        console.log(`   - ${article.slug} (${article.title})`);
      });
    }

    // 6. VERIFICA IMMAGINI E MEDIA
    console.log('\n🖼️ 6. VERIFICA IMMAGINI E MEDIA...');
    
    const articlesWithImages = articles.filter(article => article.mainImage);
    console.log(`✅ Articoli con immagine: ${articlesWithImages.length}/${articles.length}`);
    
    // Verifica articoli con video YouTube
    const articlesWithVideo = articles.filter(article => article.showYouTubeVideo);
    console.log(`🎥 Articoli con video YouTube: ${articlesWithVideo.length}`);
    
    // Verifica video completi
    const completeVideos = articlesWithVideo.filter(article => 
      article.youtubeUrl && article.youtubeTitle && article.youtubeDescription
    );
    console.log(`✅ Video YouTube completi: ${completeVideos.length}/${articlesWithVideo.length}`);

    // 7. VERIFICA CATEGORIE E TASSONOMIA
    console.log('\n📁 7. VERIFICA CATEGORIE E TASSONOMIA...');
    
    const allCategories = new Set();
    articles.forEach(article => {
      if (article.categories) {
        article.categories.forEach(cat => {
          const categoryName = typeof cat === 'object' ? cat.title : cat;
          allCategories.add(categoryName);
        });
      }
    });
    
    console.log(`📂 Categorie totali: ${allCategories.size}`);
    console.log('📋 Categorie trovate:');
    Array.from(allCategories).forEach(category => {
      const count = articles.filter(article => 
        article.categories?.some(cat => {
          const categoryName = typeof cat === 'object' ? cat.title : cat;
          return categoryName === category;
        })
      ).length;
      console.log(`   - ${category}: ${count} articoli`);
    });

    // 8. VERIFICA PERFORMANCE E TECNICA
    console.log('\n⚡ 8. VERIFICA PERFORMANCE E TECNICA...');
    
    // Verifica date di pubblicazione
    const now = new Date();
    const futureArticles = articles.filter(article => 
      new Date(article.publishedAt) > now
    );
    console.log(`📅 Articoli con date future: ${futureArticles.length}`);
    
    // Verifica articoli recenti
    const recentArticles = articles.filter(article => 
      new Date(article.publishedAt) > new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
    );
    console.log(`📅 Articoli pubblicati negli ultimi 30 giorni: ${recentArticles.length}`);
    
    // Verifica articoli vecchi
    const oldArticles = articles.filter(article => 
      new Date(article.publishedAt) < new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000)
    );
    console.log(`📅 Articoli pubblicati più di 60 giorni fa: ${oldArticles.length}`);

    // 9. ANALISI PROBLEMI CRITICI
    console.log('\n🚨 9. ANALISI PROBLEMI CRITICI...');
    
    const criticalIssues = [];
    
    if (articlesWithoutSEO.length > 0) {
      criticalIssues.push(`❌ ${articlesWithoutSEO.length} articoli senza SEO completo`);
    }
    
    if (articlesWithoutImage.length > 0) {
      criticalIssues.push(`❌ ${articlesWithoutImage.length} articoli senza immagine`);
    }
    
    if (articlesWithoutContent.length > 0) {
      criticalIssues.push(`❌ ${articlesWithoutContent.length} articoli senza contenuto`);
    }
    
    if (duplicateSlugs.length > 0) {
      criticalIssues.push(`❌ ${duplicateSlugs.length} slug duplicati`);
    }
    
    if (problematicSlugs.length > 0) {
      criticalIssues.push(`❌ ${problematicSlugs.length} slug problematici`);
    }
    
    if (criticalIssues.length > 0) {
      console.log('🚨 PROBLEMI CRITICI IDENTIFICATI:');
      criticalIssues.forEach(issue => console.log(`   ${issue}`));
    } else {
      console.log('✅ Nessun problema critico identificato');
    }

    // 10. RACCOMANDAZIONI SPECIFICHE
    console.log('\n💡 10. RACCOMANDAZIONI SPECIFICHE...');
    
    if (articlesWithoutSEO.length > 0) {
      console.log('🔧 FIX SEO CRITICO:');
      console.log('   - Aggiungere SEO title, description e keywords a tutti gli articoli');
      console.log('   - Title: 30-60 caratteri');
      console.log('   - Description: 120-160 caratteri');
      console.log('   - Keywords: 3-5 parole chiave rilevanti');
    }
    
    if (articlesWithoutImage.length > 0) {
      console.log('🔧 FIX IMMAGINI:');
      console.log('   - Aggiungere immagini principali a tutti gli articoli');
      console.log('   - Ottimizzare immagini per SEO (alt text, dimensioni)');
    }
    
    if (duplicateSlugs.length > 0) {
      console.log('🔧 FIX SLUG DUPLICATI:');
      console.log('   - Correggere slug duplicati immediatamente');
      console.log('   - Implementare redirect 301 per slug vecchi');
    }
    
    if (problematicSlugs.length > 0) {
      console.log('🔧 FIX SLUG PROBLEMATICI:');
      console.log('   - Correggere slug con caratteri problematici');
      console.log('   - Assicurarsi che slug siano SEO-friendly');
    }

    // 11. PRIORITÀ DI INTERVENTO
    console.log('\n🎯 11. PRIORITÀ DI INTERVENTO...');
    
    const priorities = [];
    
    if (articlesWithoutSEO.length > 0) {
      priorities.push('🔴 CRITICO: Fix SEO articoli');
    }
    
    if (articlesWithoutImage.length > 0) {
      priorities.push('🔴 CRITICO: Fix immagini articoli');
    }
    
    if (duplicateSlugs.length > 0) {
      priorities.push('🔴 CRITICO: Fix slug duplicati');
    }
    
    if (problematicSlugs.length > 0) {
      priorities.push('🟡 ALTO: Fix slug problematici');
    }
    
    if (articlesWithoutContent.length > 0) {
      priorities.push('🟡 ALTO: Fix contenuto articoli');
    }
    
    if (priorities.length > 0) {
      console.log('📋 PRIORITÀ DI INTERVENTO:');
      priorities.forEach((priority, index) => {
        console.log(`   ${index + 1}. ${priority}`);
      });
    } else {
      console.log('✅ Nessuna priorità critica identificata');
    }

    // 12. RIEPILOGO FINALE
    console.log('\n📊 12. RIEPILOGO FINALE...');
    console.log(`📝 Articoli totali: ${articles.length}`);
    console.log(`✅ SEO ottimizzato: ${optimizedArticles.length}`);
    console.log(`❌ SEO incompleto: ${articlesWithoutSEO.length}`);
    console.log(`❌ Senza immagine: ${articlesWithoutImage.length}`);
    console.log(`❌ Senza contenuto: ${articlesWithoutContent.length}`);
    console.log(`❌ Slug duplicati: ${duplicateSlugs.length}`);
    console.log(`❌ Slug problematici: ${problematicSlugs.length}`);
    console.log(`🎥 Video YouTube: ${articlesWithVideo.length}`);
    console.log(`📂 Categorie: ${allCategories.size}`);
    
    const healthScore = Math.round(((optimizedArticles.length + articlesWithImages.length + articlesWithVideo.length) / (articles.length * 3)) * 100);
    console.log(`\n🏆 HEALTH SCORE: ${healthScore}%`);
    
    if (healthScore >= 90) {
      console.log('✅ ECCELLENTE: Sistema SEO ottimizzato');
    } else if (healthScore >= 70) {
      console.log('🟡 BUONO: Alcuni miglioramenti necessari');
    } else if (healthScore >= 50) {
      console.log('🟠 MEDIO: Interventi significativi necessari');
    } else {
      console.log('🔴 CRITICO: Interventi urgenti necessari');
    }

  } catch (error) {
    console.error('❌ Errore durante l\'audit SEO:', error);
  }
}

completeSEOAudit();



