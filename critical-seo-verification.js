const { createClient } = require('@sanity/client');

// Configurazione Sanity Client
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
});

async function criticalSEOVerification() {
  try {
    console.log('🤔 VERIFICA CRITICA SEO: SONO SICURO AL 100%?\n');
    console.log('🔍 Analisi onesta e dettagliata\n');

    // 1. VERIFICA SEO DETTAGLIATA
    console.log('📊 1. VERIFICA SEO DETTAGLIATA...');
    
    const articles = await client.fetch(`
      *[_type == "post" && status == "published"] {
        _id,
        title,
        "slug": slug.current,
        seoTitle,
        seoDescription,
        seoKeywords,
        mainImage,
        body,
        categories
      }
    `);

    console.log(`📝 Articoli totali: ${articles.length}\n`);

    // Analisi SEO critica
    let seoComplete = 0;
    let seoIncomplete = 0;
    const seoIssues = [];

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      
      let issues = [];
      let score = 0;
      let maxScore = 0;

      // Test 1: SEO Title
      maxScore++;
      if (article.seoTitle) {
        if (article.seoTitle.length >= 30 && article.seoTitle.length <= 60) {
          score++;
          console.log(`   ✅ SEO Title: "${article.seoTitle}" (${article.seoTitle.length} chars)`);
        } else {
          issues.push(`SEO Title ${article.seoTitle.length < 30 ? 'troppo corto' : 'troppo lungo'} (${article.seoTitle.length} chars)`);
          console.log(`   ❌ SEO Title: "${article.seoTitle}" (${article.seoTitle.length} chars) - ${article.seoTitle.length < 30 ? 'TROPPO CORTO' : 'TROPPO LUNGO'}`);
        }
      } else {
        issues.push('SEO Title mancante');
        console.log(`   ❌ SEO Title: MANCANTE`);
      }

      // Test 2: SEO Description
      maxScore++;
      if (article.seoDescription) {
        if (article.seoDescription.length >= 120 && article.seoDescription.length <= 160) {
          score++;
          console.log(`   ✅ SEO Description: "${article.seoDescription.substring(0, 50)}..." (${article.seoDescription.length} chars)`);
        } else {
          issues.push(`SEO Description ${article.seoDescription.length < 120 ? 'troppo corta' : 'troppo lunga'} (${article.seoDescription.length} chars)`);
          console.log(`   ❌ SEO Description: "${article.seoDescription.substring(0, 50)}..." (${article.seoDescription.length} chars) - ${article.seoDescription.length < 120 ? 'TROPPO CORTA' : 'TROPPO LUNGA'}`);
        }
      } else {
        issues.push('SEO Description mancante');
        console.log(`   ❌ SEO Description: MANCANTE`);
      }

      // Test 3: SEO Keywords
      maxScore++;
      if (article.seoKeywords && article.seoKeywords.length > 0) {
        score++;
        console.log(`   ✅ SEO Keywords: ${article.seoKeywords.length} keywords`);
      } else {
        issues.push('SEO Keywords mancanti');
        console.log(`   ❌ SEO Keywords: MANCANTI`);
      }

      // Test 4: Immagine principale
      maxScore++;
      if (article.mainImage) {
        score++;
        console.log(`   ✅ Immagine principale: Presente`);
      } else {
        issues.push('Immagine principale mancante');
        console.log(`   ❌ Immagine principale: MANCANTE`);
      }

      // Test 5: Contenuto
      maxScore++;
      if (article.body && article.body.length > 0) {
        score++;
        console.log(`   ✅ Contenuto: Presente (${Array.isArray(article.body) ? article.body.length : 'N/A'} blocks)`);
      } else {
        issues.push('Contenuto mancante');
        console.log(`   ❌ Contenuto: MANCANTE`);
      }

      // Test 6: Categorie
      maxScore++;
      if (article.categories && article.categories.length > 0) {
        score++;
        console.log(`   ✅ Categorie: ${article.categories.length} categorie`);
      } else {
        issues.push('Categorie mancanti');
        console.log(`   ❌ Categorie: MANCANTI`);
      }

      const seoScore = Math.round((score / maxScore) * 100);
      console.log(`   📊 Score: ${seoScore}% (${score}/${maxScore})`);

      if (seoScore >= 80) {
        seoComplete++;
        console.log(`   ✅ SEO COMPLETO`);
      } else {
        seoIncomplete++;
        seoIssues.push({
          title: article.title,
          slug: article.slug,
          score: seoScore,
          issues: issues
        });
        console.log(`   ❌ SEO INCOMPLETO`);
      }
      
      console.log('');
    });

    // 2. ANALISI CRITICA
    console.log('📊 2. ANALISI CRITICA...');
    console.log(`✅ Articoli con SEO completo: ${seoComplete}/${articles.length} (${Math.round((seoComplete/articles.length)*100)}%)`);
    console.log(`❌ Articoli con SEO incompleto: ${seoIncomplete}/${articles.length} (${Math.round((seoIncomplete/articles.length)*100)}%)`);

    if (seoIssues.length > 0) {
      console.log('\n❌ ARTICOLI CON PROBLEMI SEO:');
      seoIssues.forEach(article => {
        console.log(`\n📝 ${article.title}`);
        console.log(`   Slug: ${article.slug}`);
        console.log(`   Score: ${article.score}%`);
        console.log(`   Problemi:`);
        article.issues.forEach(issue => {
          console.log(`     ❌ ${issue}`);
        });
      });
    }

    // 3. VERIFICA GOOGLE COMPRENDE IL CONTENUTO
    console.log('\n🤔 3. GOOGLE COMPRENDE IL CONTENUTO?');
    
    const googleCanUnderstand = articles.filter(article => {
      return article.seoTitle && 
             article.seoDescription && 
             article.seoKeywords &&
             article.mainImage &&
             article.body &&
             article.categories &&
             article.seoTitle.length >= 30 &&
             article.seoTitle.length <= 60 &&
             article.seoDescription.length >= 120 &&
             article.seoDescription.length <= 160;
    });

    console.log(`📊 Articoli che Google può comprendere: ${googleCanUnderstand.length}/${articles.length} (${Math.round((googleCanUnderstand.length/articles.length)*100)}%)`);

    if (googleCanUnderstand.length < articles.length) {
      console.log(`❌ PROBLEMA: ${articles.length - googleCanUnderstand.length} articoli non ottimizzati per Google`);
      
      const notOptimized = articles.filter(article => !googleCanUnderstand.includes(article));
      console.log(`📋 Articoli non ottimizzati:`);
      notOptimized.forEach(article => {
        console.log(`   - ${article.title}`);
      });
    }

    // 4. RISPOSTA CRITICA
    console.log('\n🤔 4. RISPOSTA CRITICA...');
    
    if (seoComplete === articles.length) {
      console.log('✅ SÌ, SONO SICURO AL 100%');
      console.log('✅ Tutti gli articoli hanno SEO completo');
      console.log('✅ Google può comprendere tutti i contenuti');
      console.log('✅ Il sistema è completamente ottimizzato');
    } else {
      console.log('❌ NO, NON SONO SICURO AL 100%');
      console.log(`❌ Solo ${seoComplete}/${articles.length} articoli hanno SEO completo`);
      console.log(`❌ ${seoIncomplete} articoli necessitano di miglioramenti`);
      console.log('❌ Google potrebbe non comprendere tutti i contenuti');
      console.log('❌ Il sistema necessita di ulteriori interventi');
    }

    // 5. RACCOMANDAZIONI
    console.log('\n💡 5. RACCOMANDAZIONI...');
    
    if (seoIssues.length > 0) {
      console.log('🔧 FIX SEO RICHIESTI:');
      console.log('   1. Vai su Sanity Studio');
      console.log('   2. Apri ogni articolo con problemi SEO');
      console.log('   3. Correggi i problemi identificati');
      console.log('   4. Salva e pubblica');
      
      console.log('\n📋 PROBLEMI SPECIFICI:');
      const uniqueIssues = [...new Set(seoIssues.flatMap(article => article.issues))];
      uniqueIssues.forEach(issue => {
        console.log(`   - ${issue}`);
      });
    } else {
      console.log('✅ Nessun fix SEO richiesto');
      console.log('✅ Tutti gli articoli sono ottimizzati');
    }

    // 6. CONCLUSIONE FINALE
    console.log('\n🎯 6. CONCLUSIONE FINALE...');
    
    if (seoComplete === articles.length) {
      console.log('✅ RISULTATO: SÌ, SONO SICURO AL 100%');
      console.log('✅ Tutti gli articoli hanno SEO completo');
      console.log('✅ Google può comprendere tutti i contenuti');
      console.log('✅ Il sistema è pronto per l\'indicizzazione');
    } else {
      console.log('❌ RISULTATO: NO, NON SONO SICURO AL 100%');
      console.log('❌ Alcuni articoli necessitano di miglioramenti SEO');
      console.log('❌ Google potrebbe non comprendere tutti i contenuti');
      console.log('❌ Il sistema necessita di ulteriori interventi');
    }

    // 7. HEALTH SCORE
    const healthScore = Math.round((seoComplete / articles.length) * 100);
    console.log(`\n🏆 HEALTH SCORE SEO: ${healthScore}%`);
    
    if (healthScore >= 90) {
      console.log('✅ ECCELLENTE: SEO completamente ottimizzato');
    } else if (healthScore >= 80) {
      console.log('🟢 BUONO: SEO quasi ottimizzato');
    } else if (healthScore >= 70) {
      console.log('🟡 MEDIO: SEO necessita miglioramenti');
    } else if (healthScore >= 60) {
      console.log('🟠 BASSO: SEO necessita interventi urgenti');
    } else {
      console.log('🔴 CRITICO: SEO necessita interventi immediati');
    }

  } catch (error) {
    console.error('❌ Errore durante la verifica critica SEO:', error);
  }
}

criticalSEOVerification();



