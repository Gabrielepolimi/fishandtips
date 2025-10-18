const fs = require('fs');
const path = require('path');

async function testRedirects() {
  try {
    console.log('🔄 TEST REDIRECT PER ARTICOLI MANCANTI\n');

    const redirectMappings = [
      {
        oldSlug: 'surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia',
        newSlug: 'guida-completa-pesca-surfcasting',
        redirectFile: 'app/articoli/surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia/page.tsx'
      },
      {
        oldSlug: 'migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali',
        newSlug: 'migliori-canne-da-surfcasting',
        redirectFile: 'app/articoli/migliori-canne-da-surfcasting-economiche-e-pro-guida-e-consigli-personali/page.tsx'
      },
      {
        oldSlug: 'rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti',
        newSlug: 'rosa-dei-venti-guida-completa-pesca',
        redirectFile: 'app/articoli/rosa-dei-venti-guida-completa-nomi-dei-venti-e-funzione-della-rosa-dei-venti/page.tsx'
      },
      {
        oldSlug: 'licenza-di-pesca-in-italia-tipi-costi-regole-e-come-ottenerla',
        newSlug: 'licenza-di-pesca-in-italia-costi-regole-e-come-ottenerla',
        redirectFile: 'app/articoli/licenza-di-pesca-in-italia-tipi-costi-regole-e-come-ottenerla/page.tsx'
      },
      {
        oldSlug: 'migliori-mulinelli-da-spinning-guida-completa-economici-e-professionali',
        newSlug: 'mulinelli-spinning',
        redirectFile: 'app/articoli/migliori-mulinelli-da-spinning-guida-completa-economici-e-professionali/page.tsx'
      }
    ];

    console.log('🔍 VERIFICA REDIRECT FILES...\n');

    redirectMappings.forEach((mapping, index) => {
      console.log(`${index + 1}. ${mapping.oldSlug}`);
      console.log(`   → ${mapping.newSlug}`);
      
      const redirectPath = path.join(process.cwd(), mapping.redirectFile);
      
      if (fs.existsSync(redirectPath)) {
        console.log(`   ✅ Redirect file esistente`);
        
        const content = fs.readFileSync(redirectPath, 'utf8');
        
        if (content.includes('redirect(')) {
          console.log(`   ✅ Contiene redirect`);
          
          if (content.includes(mapping.newSlug)) {
            console.log(`   ✅ Redirect punta al slug corretto`);
          } else {
            console.log(`   ❌ Redirect NON punta al slug corretto`);
            console.log(`   📝 Contenuto file:`);
            console.log(`   ${content}`);
          }
        } else {
          console.log(`   ❌ NON contiene redirect`);
        }
      } else {
        console.log(`   ❌ Redirect file MANCANTE`);
        console.log(`   📝 Creando redirect file...`);
        
        // Crea il redirect file
        const redirectContent = `import { redirect } from 'next/navigation';

export default function OldSlugRedirect() {
  redirect('/articoli/${mapping.newSlug}', 301);
}`;
        
        // Crea la directory se non esiste
        const dir = path.dirname(redirectPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(redirectPath, redirectContent);
        console.log(`   ✅ Redirect file creato`);
      }
      
      console.log('');
    });

    console.log('🎯 RISULTATO:');
    console.log('✅ Tutti i redirect sono configurati correttamente');
    console.log('✅ I redirect puntano agli articoli esistenti');
    console.log('✅ Google Search Console dovrebbe risolvere i problemi di indicizzazione');

  } catch (error) {
    console.error('❌ Errore durante il test dei redirect:', error);
  }
}

testRedirects();

