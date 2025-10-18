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

async function updateSitemapFinal() {
  try {
    console.log('🗺️ AGGIORNAMENTO SITEMAP FINALE\n');

    // 1. VERIFICA ARTICOLI E CATEGORIE
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        seoTitle,
        seoDescription
      } | order(publishedAt desc)
    `);

    const categories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    console.log(`📝 Articoli: ${articles.length}`);
    console.log(`📂 Categorie: ${categories.length}`);

    // 2. VERIFICA SEO PROBLEMATICI
    const problematicArticles = articles.filter(article => {
      if (!article.seoTitle || !article.seoDescription) return true;
      return article.seoTitle.length > 60 || 
             article.seoDescription.length < 120 || 
             article.seoDescription.length > 160;
    });

    console.log(`\n❌ Articoli con problemi SEO: ${problematicArticles.length}`);
    if (problematicArticles.length > 0) {
      console.log('📋 Articoli da correggere:');
      problematicArticles.forEach(article => {
        const issues = [];
        if (!article.seoTitle) issues.push('SEO Title mancante');
        else if (article.seoTitle.length > 60) issues.push(`SEO Title troppo lungo (${article.seoTitle.length} chars)`);
        
        if (!article.seoDescription) issues.push('SEO Description mancante');
        else if (article.seoDescription.length < 120) issues.push(`SEO Description troppo corta (${article.seoDescription.length} chars)`);
        else if (article.seoDescription.length > 160) issues.push(`SEO Description troppo lunga (${article.seoDescription.length} chars)`);
        
        console.log(`   - ${article.title}`);
        issues.forEach(issue => console.log(`     ❌ ${issue}`));
      });
    }

    // 3. GENERA SITEMAP AGGIORNATA
    console.log('\n🗺️ GENERAZIONE SITEMAP AGGIORNATA...');
    
    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <!-- Pagine principali -->
  <url>
    <loc>https://fishandtips.it</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://fishandtips.it/articoli</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://fishandtips.it/chi-siamo</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://fishandtips.it/contatti</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <url>
    <loc>https://fishandtips.it/registrazione</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
  <url>
    <loc>https://fishandtips.it/mappa-del-sito</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://fishandtips.it/supporto</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
  <url>
    <loc>https://fishandtips.it/cookie-policy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.4</priority>
  </url>

  <!-- Categorie -->
${categories.filter(cat => cat.slug).map(category => `  <url>
    <loc>https://fishandtips.it/categoria/${category.slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}

  <!-- Articoli pubblicati -->
${articles.map(article => `  <url>
    <loc>https://fishandtips.it/articoli/${article.slug}</loc>
    <lastmod>${new Date(article.publishedAt).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('\n')}
</urlset>`;

    // 4. SALVA SITEMAP
    const sitemapPath = path.join(process.cwd(), 'public/sitemap-static.xml');
    fs.writeFileSync(sitemapPath, sitemapContent);
    
    console.log(`✅ Sitemap aggiornata: ${sitemapPath}`);
    console.log(`📊 URL totali: ${2 + categories.filter(cat => cat.slug).length + articles.length}`);

    // 5. VERIFICA SITEMAP
    console.log('\n🔍 VERIFICA SITEMAP...');
    const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
    const sitemapUrls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
    
    console.log(`📄 URL nella sitemap: ${sitemapUrls.length}`);
    
    // Verifica articoli in sitemap
    const articlesInSitemap = articles.filter(article => 
      sitemapUrls.includes(`https://fishandtips.it/articoli/${article.slug}`)
    );
    console.log(`📝 Articoli in sitemap: ${articlesInSitemap.length}/${articles.length}`);
    
    // Verifica categorie in sitemap
    const categoriesInSitemap = categories.filter(cat => 
      cat.slug && sitemapUrls.includes(`https://fishandtips.it/categoria/${cat.slug}`)
    );
    console.log(`📂 Categorie in sitemap: ${categoriesInSitemap.length}/${categories.filter(cat => cat.slug).length}`);

    // 6. RACCOMANDAZIONI FINALI
    console.log('\n💡 RACCOMANDAZIONI FINALI...');
    
    if (problematicArticles.length > 0) {
      console.log('🔧 FIX SEO RICHIESTI:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni articolo problematico');
      console.log('   3. Correggi SEO Title (30-60 caratteri)');
      console.log('   4. Correggi SEO Description (120-160 caratteri)');
      console.log('   5. Salva e pubblica');
      
      console.log('\n📋 ARTICOLI DA CORREGGERE:');
      problematicArticles.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    } else {
      console.log('✅ Tutti gli articoli sono ottimizzati');
      console.log('✅ La sitemap è aggiornata');
      console.log('✅ Il sistema è pronto per l\'indicizzazione');
    }

    // 7. RIEPILOGO FINALE
    console.log('\n📊 RIEPILOGO FINALE...');
    console.log(`📝 Articoli totali: ${articles.length}`);
    console.log(`📂 Categorie totali: ${categories.length}`);
    console.log(`✅ Categorie con slug: ${categories.filter(cat => cat.slug).length}/${categories.length}`);
    console.log(`✅ Articoli in sitemap: ${articlesInSitemap.length}/${articles.length}`);
    console.log(`✅ Categorie in sitemap: ${categoriesInSitemap.length}/${categories.filter(cat => cat.slug).length}`);
    console.log(`❌ Articoli con problemi SEO: ${problematicArticles.length}/${articles.length}`);
    
    const healthScore = Math.round(((articles.length - problematicArticles.length) / articles.length) * 100);
    console.log(`🏆 HEALTH SCORE: ${healthScore}%`);
    
    if (healthScore >= 90) {
      console.log('✅ ECCELLENTE: Sistema completamente ottimizzato');
    } else if (healthScore >= 80) {
      console.log('🟢 BUONO: Sistema quasi ottimizzato');
    } else if (healthScore >= 70) {
      console.log('🟡 MEDIO: Sistema necessita miglioramenti');
    } else {
      console.log('🔴 CRITICO: Sistema necessita interventi urgenti');
    }

    console.log('\n🎯 RISULTATO:');
    if (problematicArticles.length === 0) {
      console.log('✅ Sitemap aggiornata con successo');
      console.log('✅ Tutti gli articoli sono ottimizzati');
      console.log('✅ Il sistema è pronto per l\'indicizzazione');
    } else {
      console.log('⚠️ Sitemap aggiornata ma alcuni articoli necessitano di correzioni SEO');
      console.log('⚠️ Completa le correzioni SEO per ottimizzare completamente il sistema');
    }

  } catch (error) {
    console.error('❌ Errore durante l\'aggiornamento sitemap:', error);
  }
}

updateSitemapFinal();

