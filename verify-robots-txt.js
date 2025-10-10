const fs = require('fs');
const path = require('path');

async function verifyRobotsTxt() {
  try {
    console.log('🤖 VERIFICA DETTAGLIATA ROBOTS.TXT\n');

    // 1. VERIFICA FILE ROBOTS.TXT
    const robotsPath = path.join(process.cwd(), 'app/robots.ts');
    console.log('📄 1. VERIFICA FILE ROBOTS.TXT...');
    
    if (fs.existsSync(robotsPath)) {
      console.log('✅ robots.ts trovato');
      
      const robotsContent = fs.readFileSync(robotsPath, 'utf8');
      console.log(`📊 Dimensione file: ${robotsContent.length} caratteri`);
      
      // 2. ANALISI CONTENUTO DETTAGLIATA
      console.log('\n🔍 2. ANALISI CONTENUTO DETTAGLIATA...');
      
      // Verifica struttura base
      const hasExport = robotsContent.includes('export default function robots()');
      const hasMetadataRoute = robotsContent.includes('MetadataRoute');
      const hasReturn = robotsContent.includes('return {');
      const hasRules = robotsContent.includes('rules:');
      const hasSitemap = robotsContent.includes('sitemap:');
      const hasHost = robotsContent.includes('host:');
      
      console.log(`📋 Struttura base:`);
      console.log(`   ✅ Export function: ${hasExport ? '✅' : '❌'}`);
      console.log(`   ✅ MetadataRoute: ${hasMetadataRoute ? '✅' : '❌'}`);
      console.log(`   ✅ Return object: ${hasReturn ? '✅' : '❌'}`);
      console.log(`   ✅ Rules array: ${hasRules ? '✅' : '❌'}`);
      console.log(`   ✅ Sitemap URL: ${hasSitemap ? '✅' : '❌'}`);
      console.log(`   ✅ Host URL: ${hasHost ? '✅' : '❌'}`);
      
      // 3. VERIFICA REGOLE SPECIFICHE
      console.log('\n📋 3. VERIFICA REGOLE SPECIFICHE...');
      
      const criticalRules = [
        { rule: 'userAgent: \'*\'', name: 'User Agent universale', required: true },
        { rule: 'allow: [', name: 'Regole allow', required: true },
        { rule: 'disallow: [', name: 'Regole disallow', required: true },
        { rule: '\'/\'', name: 'Allow root', required: true },
        { rule: '\'/articoli\'', name: 'Allow articoli', required: true },
        { rule: '\'/categoria/*\'', name: 'Allow categorie', required: true },
        { rule: '\'/articoli/*\'', name: 'Allow articoli specifici', required: true },
        { rule: '\'/api/\'', name: 'Disallow API', required: true },
        { rule: '\'/_next/\'', name: 'Disallow Next.js', required: true },
        { rule: '\'/favicon.ico\'', name: 'Disallow favicon', required: true },
        { rule: '\'/manifest.webmanifest\'', name: 'Disallow manifest', required: true },
        { rule: '\'/feed.xml\'', name: 'Disallow feed', required: true },
        { rule: '\'/sitemap.xml\'', name: 'Disallow sitemap', required: true },
        { rule: '\'/articoli?search=*\'', name: 'Disallow search', required: true },
        { rule: 'userAgent: \'Googlebot\'', name: 'Googlebot specifico', required: true },
        { rule: 'sitemap: \'https://fishandtips.it/sitemap-static.xml\'', name: 'Sitemap URL', required: true },
        { rule: 'host: \'https://fishandtips.it\'', name: 'Host URL', required: true }
      ];
      
      let rulesPresent = 0;
      let rulesMissing = 0;
      
      criticalRules.forEach(({ rule, name, required }) => {
        const isPresent = robotsContent.includes(rule);
        const status = isPresent ? '✅' : '❌';
        const priority = required ? '🔴 CRITICO' : '🟡 IMPORTANTE';
        
        console.log(`   ${status} ${name}: ${status}`);
        if (!isPresent && required) {
          console.log(`      ${priority}: Regola mancante!`);
          rulesMissing++;
        }
        
        if (isPresent) rulesPresent++;
      });
      
      console.log(`\n📊 STATISTICHE REGOLE:`);
      console.log(`   ✅ Regole presenti: ${rulesPresent}/${criticalRules.length}`);
      console.log(`   ❌ Regole mancanti: ${rulesMissing}`);
      console.log(`   📈 Percentuale: ${Math.round((rulesPresent/criticalRules.length)*100)}%`);
      
      // 4. VERIFICA SINTASSI
      console.log('\n🔍 4. VERIFICA SINTASSI...');
      
      // Verifica parentesi e virgolette
      const openBraces = (robotsContent.match(/\{/g) || []).length;
      const closeBraces = (robotsContent.match(/\}/g) || []).length;
      const openBrackets = (robotsContent.match(/\[/g) || []).length;
      const closeBrackets = (robotsContent.match(/\]/g) || []).length;
      const openParens = (robotsContent.match(/\(/g) || []).length;
      const closeParens = (robotsContent.match(/\)/g) || []).length;
      
      console.log(`📋 Parentesi e virgolette:`);
      console.log(`   {} Braces: ${openBraces}/${closeBraces} ${openBraces === closeBraces ? '✅' : '❌'}`);
      console.log(`   [] Brackets: ${openBrackets}/${closeBrackets} ${openBrackets === closeBrackets ? '✅' : '❌'}`);
      console.log(`   () Parentheses: ${openParens}/${closeParens} ${openParens === closeParens ? '✅' : '❌'}`);
      
      // 5. VERIFICA URL E DOMINI
      console.log('\n🌐 5. VERIFICA URL E DOMINI...');
      
      const sitemapUrl = 'https://fishandtips.it/sitemap-static.xml';
      const hostUrl = 'https://fishandtips.it';
      
      const hasCorrectSitemap = robotsContent.includes(sitemapUrl);
      const hasCorrectHost = robotsContent.includes(hostUrl);
      
      console.log(`📋 URL e domini:`);
      console.log(`   ✅ Sitemap URL corretto: ${hasCorrectSitemap ? '✅' : '❌'}`);
      console.log(`   ✅ Host URL corretto: ${hasCorrectHost ? '✅' : '❌'}`);
      
      if (!hasCorrectSitemap) {
        console.log(`   ❌ Sitemap URL mancante o errato`);
      }
      if (!hasCorrectHost) {
        console.log(`   ❌ Host URL mancante o errato`);
      }
      
      // 6. VERIFICA REGOLE GOOGLEBOT
      console.log('\n🤖 6. VERIFICA REGOLE GOOGLEBOT...');
      
      const googlebotRules = [
        'userAgent: \'Googlebot\'',
        'allow: \'/\'',
        'disallow: [',
        '\'/api/\'',
        '\'/_next/\''
      ];
      
      let googlebotRulesPresent = 0;
      googlebotRules.forEach(rule => {
        if (robotsContent.includes(rule)) {
          console.log(`   ✅ ${rule}`);
          googlebotRulesPresent++;
        } else {
          console.log(`   ❌ ${rule}`);
        }
      });
      
      console.log(`📊 Regole Googlebot: ${googlebotRulesPresent}/${googlebotRules.length}`);
      
      // 7. VERIFICA REGOLE DISALLOW CRITICHE
      console.log('\n🚫 7. VERIFICA REGOLE DISALLOW CRITICHE...');
      
      const criticalDisallows = [
        '/api/',
        '/_next/',
        '/favicon.ico',
        '/manifest.webmanifest',
        '/feed.xml',
        '/sitemap.xml',
        '/articoli?search=*'
      ];
      
      let disallowsPresent = 0;
      criticalDisallows.forEach(disallow => {
        if (robotsContent.includes(disallow)) {
          console.log(`   ✅ Disallow ${disallow}`);
          disallowsPresent++;
        } else {
          console.log(`   ❌ Disallow ${disallow} MANCANTE`);
        }
      });
      
      console.log(`📊 Disallow critiche: ${disallowsPresent}/${criticalDisallows.length}`);
      
      // 8. VERIFICA REGOLE ALLOW CRITICHE
      console.log('\n✅ 8. VERIFICA REGOLE ALLOW CRITICHE...');
      
      const criticalAllows = [
        '/',
        '/articoli',
        '/categoria/*',
        '/articoli/*'
      ];
      
      let allowsPresent = 0;
      criticalAllows.forEach(allow => {
        if (robotsContent.includes(allow)) {
          console.log(`   ✅ Allow ${allow}`);
          allowsPresent++;
        } else {
          console.log(`   ❌ Allow ${allow} MANCANTE`);
        }
      });
      
      console.log(`📊 Allow critiche: ${allowsPresent}/${criticalAllows.length}`);
      
      // 9. ANALISI PROBLEMI
      console.log('\n🚨 9. ANALISI PROBLEMI...');
      
      const problems = [];
      
      if (rulesMissing > 0) {
        problems.push(`❌ ${rulesMissing} regole critiche mancanti`);
      }
      
      if (openBraces !== closeBraces) {
        problems.push(`❌ Parentesi graffe non bilanciate`);
      }
      
      if (openBrackets !== closeBrackets) {
        problems.push(`❌ Parentesi quadre non bilanciate`);
      }
      
      if (!hasCorrectSitemap) {
        problems.push(`❌ Sitemap URL errato`);
      }
      
      if (!hasCorrectHost) {
        problems.push(`❌ Host URL errato`);
      }
      
      if (disallowsPresent < criticalDisallows.length) {
        problems.push(`❌ Regole disallow mancanti`);
      }
      
      if (allowsPresent < criticalAllows.length) {
        problems.push(`❌ Regole allow mancanti`);
      }
      
      if (problems.length > 0) {
        console.log(`🚨 PROBLEMI IDENTIFICATI:`);
        problems.forEach(problem => console.log(`   ${problem}`));
      } else {
        console.log(`✅ Nessun problema identificato`);
      }
      
      // 10. RACCOMANDAZIONI
      console.log('\n💡 10. RACCOMANDAZIONI...');
      
      if (rulesMissing > 0) {
        console.log(`🔧 FIX RICHIESTI:`);
        console.log(`   1. Aggiungere regole mancanti`);
        console.log(`   2. Verificare sintassi`);
        console.log(`   3. Testare robots.txt generato`);
      } else {
        console.log(`✅ Robots.txt configurato correttamente`);
        console.log(`✅ Tutte le regole critiche presenti`);
        console.log(`✅ Sintassi corretta`);
        console.log(`✅ URL e domini corretti`);
      }
      
      // 11. RIEPILOGO FINALE
      console.log('\n📊 11. RIEPILOGO FINALE...');
      console.log(`📄 File robots.ts: ${fs.existsSync(robotsPath) ? '✅' : '❌'}`);
      console.log(`📋 Regole presenti: ${rulesPresent}/${criticalRules.length} (${Math.round((rulesPresent/criticalRules.length)*100)}%)`);
      console.log(`🔍 Sintassi: ${openBraces === closeBraces && openBrackets === closeBrackets ? '✅' : '❌'}`);
      console.log(`🌐 URL corretti: ${hasCorrectSitemap && hasCorrectHost ? '✅' : '❌'}`);
      console.log(`🚫 Disallow critiche: ${disallowsPresent}/${criticalDisallows.length} (${Math.round((disallowsPresent/criticalDisallows.length)*100)}%)`);
      console.log(`✅ Allow critiche: ${allowsPresent}/${criticalAllows.length} (${Math.round((allowsPresent/criticalAllows.length)*100)}%)`);
      console.log(`🚨 Problemi: ${problems.length}`);
      
      const overallScore = Math.round(((rulesPresent + (openBraces === closeBraces ? 1 : 0) + (hasCorrectSitemap ? 1 : 0) + (hasCorrectHost ? 1 : 0) + disallowsPresent + allowsPresent) / (criticalRules.length + 5)) * 100);
      console.log(`🏆 SCORE COMPLESSIVO: ${overallScore}%`);
      
      if (overallScore >= 90) {
        console.log(`✅ ECCELLENTE: Robots.txt ottimizzato`);
      } else if (overallScore >= 80) {
        console.log(`🟢 BUONO: Alcuni miglioramenti necessari`);
      } else if (overallScore >= 70) {
        console.log(`🟡 MEDIO: Interventi significativi necessari`);
      } else {
        console.log(`🔴 CRITICO: Interventi urgenti necessari`);
      }
      
    } else {
      console.log('❌ robots.ts non trovato!');
      console.log('🚨 PROBLEMA CRITICO: File robots.ts mancante');
    }

  } catch (error) {
    console.error('❌ Errore durante la verifica robots.txt:', error);
  }
}

verifyRobotsTxt();
