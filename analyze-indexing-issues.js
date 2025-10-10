const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function analyzeIndexingIssues() {
  try {
    console.log('🚨 ANALISI PROBLEMI INDICIZZAZIONE GOOGLE SEARCH CONSOLE\n');

    // 1. PROBLEMA CANONICAL TAGS (8 pagine)
    console.log('🔴 PROBLEMA 1: PAGINE CON CANONICAL TAGS SBAGLIATI (8 pagine)');
    console.log('📋 PAGINE PROBLEMATICHE:');
    const canonicalIssues = [
      'https://fishandtips.it/categoria/spot-di-pesca',
      'https://fishandtips.it/categoria/tecniche-di-pesca', 
      'https://fishandtips.it/privacy',
      'https://fishandtips.it/articoli?search={search_term_string}',
      'https://fishandtips.it/categoria/consigli',
      'https://fishandtips.it/mappa-del-sito',
      'https://fishandtips.it/categoria/spot',
      'https://fishandtips.it/categoria/attrezzature'
    ];

    canonicalIssues.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

    console.log('\n🔧 SOLUZIONI CANONICAL:');
    console.log('✅ Verificare che ogni pagina abbia canonical corretto');
    console.log('✅ Rimuovere canonical duplicati');
    console.log('✅ Assicurarsi che canonical punti alla pagina stessa');

    // 2. PROBLEMA INDICIZZAZIONE (21 pagine)
    console.log('\n🔴 PROBLEMA 2: PAGINE SCANSIONATE MA NON INDICIZZATE (21 pagine)');
    console.log('📋 PAGINE PROBLEMATICHE:');
    const indexingIssues = [
      'https://fishandtips.it/articoli/surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia',
      'https://fishandtips.it/articoli/pesca-alla-seppia-tecniche-periodi-migliori-e-consigli-pratici',
      'https://fishandtips.it/articoli/migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali',
      'https://fishandtips.it/articoli/rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti',
      'https://fishandtips.it/termini',
      'https://fishandtips.it/chi-siamo',
      'https://fishandtips.it/articoli/pesca-al-polpo-tecniche-periodi-migliori-e-consigli-pratici',
      'https://fishandtips.it/favicon.ico',
      'https://fishandtips.it/manifest.webmanifest',
      'https://fishandtips.it/articoli/licenza-di-pesca-in-italia-tipi-costi-regole-e-come-ottenerla',
      'https://fishandtips.it/feed.xml',
      'https://fishandtips.it/articoli/i-7-consigli-fondamentali-per-pescare-correttamente',
      'https://fishandtips.it/categoria/tecniche',
      'https://fishandtips.it/supporto',
      'https://fishandtips.it/articoli/migliori-canne-da-spinning-economiche-professionali',
      'https://fishandtips.it/contatti',
      'https://fishandtips.it/registrazione',
      'https://fishandtips.it/articoli',
      'https://fishandtips.it/cookie-policy',
      'https://fishandtips.it/articoli/migliori-mulinelli-da-spinning-guida-completa-economici-e-professionali',
      'https://fishandtips.it/sitemap.xml'
    ];

    indexingIssues.forEach((url, index) => {
      console.log(`${index + 1}. ${url}`);
    });

    // 3. ANALISI SPECIFICA PROBLEMI
    console.log('\n🔍 ANALISI SPECIFICA PROBLEMI:');
    
    // Problemi di redirect
    console.log('\n🔄 PROBLEMI DI REDIRECT:');
    const redirectIssues = [
      'surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia',
      'migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali', 
      'rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti'
    ];
    
    redirectIssues.forEach(slug => {
      console.log(`❌ ${slug} → Redirect non funzionante`);
    });

    // Problemi di categoria
    console.log('\n📁 PROBLEMI DI CATEGORIA:');
    const categoryIssues = [
      'categoria/tecniche → dovrebbe essere categoria/tecniche-di-pesca',
      'categoria/spot → dovrebbe essere categoria/spot-di-pesca'
    ];
    
    categoryIssues.forEach(issue => {
      console.log(`❌ ${issue}`);
    });

    // File di sistema
    console.log('\n📄 FILE DI SISTEMA NON INDICIZZABILI:');
    const systemFiles = [
      'favicon.ico',
      'manifest.webmanifest', 
      'feed.xml',
      'sitemap.xml'
    ];
    
    systemFiles.forEach(file => {
      console.log(`⚠️ ${file} → Dovrebbe essere escluso da robots.txt`);
    });

    // 4. VERIFICA ARTICOLI ESISTENTI
    console.log('\n📝 VERIFICA ARTICOLI ESISTENTI:');
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        publishedAt,
        status
      }
    `);

    console.log(`✅ Articoli pubblicati nel database: ${articles.length}`);
    
    // Verifica articoli problematici
    const problematicArticles = articles.filter(article => 
      indexingIssues.some(url => url.includes(article.slug))
    );

    console.log(`❌ Articoli con problemi di indicizzazione: ${problematicArticles.length}`);
    problematicArticles.forEach(article => {
      console.log(`   - ${article.title} (${article.slug})`);
    });

    // 5. RACCOMANDAZIONI IMMEDIATE
    console.log('\n🚀 RACCOMANDAZIONI IMMEDIATE:');
    console.log('1. 🔧 FIX CANONICAL TAGS:');
    console.log('   - Verificare canonical in tutte le pagine');
    console.log('   - Assicurarsi che puntino alla pagina corretta');
    
    console.log('\n2. 🔄 FIX REDIRECTS:');
    console.log('   - Implementare redirect 301 per slug vecchi');
    console.log('   - Verificare che funzionino correttamente');
    
    console.log('\n3. 📁 FIX CATEGORIE:');
    console.log('   - Redirect categoria/tecniche → categoria/tecniche-di-pesca');
    console.log('   - Redirect categoria/spot → categoria/spot-di-pesca');
    
    console.log('\n4. 🤖 FIX ROBOTS.TXT:');
    console.log('   - Escludere file di sistema dall\'indicizzazione');
    console.log('   - Escludere URL di ricerca');
    
    console.log('\n5. 📊 FIX SITEMAP:');
    console.log('   - Verificare che sitemap sia aggiornata');
    console.log('   - Inviare a Google Search Console');

    console.log('\n🎯 PRIORITÀ:');
    console.log('1. 🔴 CRITICO: Fix canonical tags (8 pagine)');
    console.log('2. 🟡 ALTO: Fix redirects (3 articoli)');
    console.log('3. 🟡 ALTO: Fix categorie (2 categorie)');
    console.log('4. 🟢 MEDIO: Fix robots.txt (4 file)');
    console.log('5. 🟢 MEDIO: Aggiornare sitemap');

  } catch (error) {
    console.error('❌ Errore durante l\'analisi:', error);
  }
}

analyzeIndexingIssues();
