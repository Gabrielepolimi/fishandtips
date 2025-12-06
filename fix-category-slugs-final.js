const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function fixCategorySlugsFinal() {
  try {
    console.log('🔧 FIX SLUG CATEGORIE FINALI\n');

    // 1. VERIFICA CATEGORIE ATTUALE
    const categories = await client.fetch(`
      *[_type == "category"] {
        _id,
        title,
        "slug": slug.current
      }
    `);

    console.log('📂 CATEGORIE ATTUALE:');
    categories.forEach(category => {
      console.log(`   - ${category.title} → ${category.slug}`);
    });

    // 2. SLUG CORRETTI ATTESI
    const correctSlugs = {
      'Tecniche di Pesca': 'tecniche-di-pesca',
      'Attrezzature di Pesca': 'attrezzature',
      'Spot di Pesca': 'spot-di-pesca',
      'Consigli Generali': 'consigli'
    };

    console.log('\n🔧 SLUG CORRETTI ATTESI:');
    Object.entries(correctSlugs).forEach(([title, slug]) => {
      console.log(`   - ${title} → ${slug}`);
    });

    // 3. IDENTIFICA CATEGORIE DA CORREGGERE
    console.log('\n❌ CATEGORIE DA CORREGGERE:');
    const categoriesToFix = categories.filter(category => {
      const expectedSlug = correctSlugs[category.title];
      return expectedSlug && category.slug !== expectedSlug;
    });

    categoriesToFix.forEach(category => {
      const expectedSlug = correctSlugs[category.title];
      console.log(`   - ${category.title}: ${category.slug} → ${expectedSlug}`);
    });

    if (categoriesToFix.length === 0) {
      console.log('✅ Tutte le categorie hanno slug corretti!');
      return;
    }

    // 4. ISTRUZIONI MANUALI
    console.log('\n📋 ISTRUZIONI MANUALI PER FIX:');
    console.log('1. Vai su Sanity Studio: https://fishandtips-studio.vercel.app');
    console.log('2. Apri la sezione "Categories"');
    console.log('3. Per ogni categoria da correggere:');
    
    categoriesToFix.forEach(category => {
      const expectedSlug = correctSlugs[category.title];
      console.log(`\n   📂 ${category.title}:`);
      console.log(`      - Apri la categoria`);
      console.log(`      - Cambia slug da "${category.slug}" a "${expectedSlug}"`);
      console.log(`      - Salva e pubblica`);
    });

    console.log('\n4. Dopo aver corretto tutti gli slug:');
    console.log('   - Ricarica la sitemap');
    console.log('   - Verifica che le pagine categoria funzionino');
    console.log('   - Testa i link di navigazione');

    // 5. VERIFICA SITEMAP
    console.log('\n🗺️ VERIFICA SITEMAP:');
    const fs = require('fs');
    const path = require('path');
    const sitemapPath = path.join(process.cwd(), 'public/sitemap-static.xml');
    
    if (fs.existsSync(sitemapPath)) {
      const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
      const urlMatches = sitemapContent.match(/<loc>(.*?)<\/loc>/g);
      const sitemapUrls = urlMatches ? urlMatches.map(match => match.replace(/<\/?loc>/g, '')) : [];
      
      console.log(`📄 Sitemap trovata con ${sitemapUrls.length} URL`);
      
      // Verifica categorie in sitemap
      const categoriesInSitemap = categories.filter(cat => 
        sitemapUrls.includes(`https://fishandtips.it/categoria/${cat.slug}`)
      );
      console.log(`📂 Categorie in sitemap: ${categoriesInSitemap.length}/${categories.length}`);
      
      if (categoriesInSitemap.length > 0) {
        console.log(`✅ Categorie in sitemap:`);
        categoriesInSitemap.forEach(category => {
          console.log(`   - ${category.title} → https://fishandtips.it/categoria/${category.slug}`);
        });
      }
      
      if (categoriesInSitemap.length < categories.length) {
        console.log(`❌ Categorie mancanti dalla sitemap:`);
        const missingCategories = categories.filter(cat => 
          !sitemapUrls.includes(`https://fishandtips.it/categoria/${cat.slug}`)
        );
        missingCategories.forEach(category => {
          console.log(`   - ${category.title} → https://fishandtips.it/categoria/${category.slug}`);
        });
        
        console.log('\n🔧 FIX SITEMAP:');
        console.log('1. Aggiungi le categorie mancanti alla sitemap');
        console.log('2. Aggiorna il file sitemap-static.xml');
        console.log('3. Verifica che tutti gli URL siano accessibili');
      }
    } else {
      console.log(`❌ Sitemap non trovata!`);
    }

    // 6. RIEPILOGO FINALE
    console.log('\n📊 RIEPILOGO FINALE:');
    console.log(`📂 Categorie totali: ${categories.length}`);
    console.log(`✅ Con slug: ${categories.filter(cat => cat.slug).length}/${categories.length}`);
    console.log(`✅ Slug corretti: ${categories.filter(cat => {
      const expectedSlug = correctSlugs[cat.title];
      return expectedSlug && cat.slug === expectedSlug;
    }).length}/${categories.length}`);
    console.log(`✅ In sitemap: ${categoriesInSitemap ? categoriesInSitemap.length : 0}/${categories.length}`);

    console.log('\n🎯 RISULTATO:');
    if (categoriesToFix.length === 0) {
      console.log('✅ Tutte le categorie sono ottimizzate!');
      console.log('✅ Google può accedere alle pagine categoria!');
      console.log('✅ La struttura del sito è completa!');
    } else {
      console.log('❌ Alcune categorie necessitano di correzioni');
      console.log('❌ Segui le istruzioni manuali per completare il fix');
      console.log('❌ Dopo il fix, il sito sarà completamente ottimizzato');
    }

  } catch (error) {
    console.error('❌ Errore durante il fix categorie:', error);
  }
}

fixCategorySlugsFinal();



