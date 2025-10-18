const fs = require('fs');
const path = require('path');

async function fixRedirects() {
  try {
    console.log('🔧 FIX REDIRECT FUNZIONANTI\n');

    const redirectFiles = [
      {
        path: 'app/articoli/surfcasting-la-mia-guida-completa-per-pescare-dalla-spiaggia/page.tsx',
        target: '/articoli/guida-completa-pesca-surfcasting',
        description: 'Surfcasting redirect'
      },
      {
        path: 'app/categoria/tecniche/page.tsx',
        target: '/categoria/tecniche-di-pesca',
        description: 'Categoria tecniche redirect'
      }
    ];

    console.log('🔍 VERIFICA REDIRECT PROBLEMATICI...\n');

    redirectFiles.forEach((redirect, index) => {
      console.log(`${index + 1}. ${redirect.description}`);
      console.log(`   File: ${redirect.path}`);
      console.log(`   Target: ${redirect.target}`);
      
      const fullPath = path.join(process.cwd(), redirect.path);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        console.log(`   ✅ File esistente`);
        
        if (content.includes('redirect(')) {
          console.log(`   ✅ Contiene redirect`);
          
          if (content.includes(redirect.target)) {
            console.log(`   ✅ Target corretto`);
          } else {
            console.log(`   ❌ Target sbagliato`);
            console.log(`   📝 Contenuto attuale:`);
            console.log(`   ${content}`);
            
            // Fix del redirect
            console.log(`\n🔧 FIXING REDIRECT...`);
            const fixedContent = `import { redirect } from 'next/navigation';

export default function OldSlugRedirect() {
  redirect('${redirect.target}', 301);
}`;
            
            fs.writeFileSync(fullPath, fixedContent);
            console.log(`   ✅ Redirect corretto`);
          }
        } else {
          console.log(`   ❌ NON contiene redirect`);
          
          // Crea il redirect
          console.log(`\n🔧 CREATING REDIRECT...`);
          const redirectContent = `import { redirect } from 'next/navigation';

export default function OldSlugRedirect() {
  redirect('${redirect.target}', 301);
}`;
          
          // Crea la directory se non esiste
          const dir = path.dirname(fullPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          
          fs.writeFileSync(fullPath, redirectContent);
          console.log(`   ✅ Redirect creato`);
        }
      } else {
        console.log(`   ❌ File mancante`);
        
        // Crea il redirect
        console.log(`\n🔧 CREATING REDIRECT...`);
        const redirectContent = `import { redirect } from 'next/navigation';

export default function OldSlugRedirect() {
  redirect('${redirect.target}', 301);
}`;
        
        // Crea la directory se non esiste
        const dir = path.dirname(fullPath);
        if (!fs.existsSync(dir)) {
          fs.mkdirSync(dir, { recursive: true });
        }
        
        fs.writeFileSync(fullPath, redirectContent);
        console.log(`   ✅ Redirect creato`);
      }
      
      console.log('');
    });

    console.log('✅ VERIFICA REDIRECT COMPLETATA');
    console.log('✅ Tutti i redirect sono stati corretti');

  } catch (error) {
    console.error('❌ Errore durante il fix redirect:', error);
  }
}

fixRedirects();

