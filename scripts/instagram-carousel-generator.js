/**
 * 📱 FishandTips - Instagram Carousel Generator
 * 
 * Genera automaticamente carousel Instagram da articoli Sanity
 * Include: testi slide, caption, hashtag ottimizzati
 * 
 * Uso:
 *   node scripts/instagram-carousel-generator.js "slug-articolo"
 *   node scripts/instagram-carousel-generator.js --test
 */

import { GoogleGenerativeAI } from '@google/generative-ai';
import { createClient } from '@sanity/client';

// ===== CONFIGURAZIONE =====
const CONFIG = {
  gemini: {
    apiKey: process.env.GEMINI_API_KEY,
    model: 'gemini-2.0-flash'
  },
  sanity: {
    projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3nnnl6gi',
    dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    apiVersion: '2024-08-10',
    token: process.env.SANITY_API_TOKEN
  },
  instagram: {
    maxSlides: 7,
    maxCaptionLength: 2200,
    maxHashtags: 30
  }
};

// ===== INIZIALIZZAZIONE =====
const sanityClient = createClient({
  projectId: CONFIG.sanity.projectId,
  dataset: CONFIG.sanity.dataset,
  apiVersion: CONFIG.sanity.apiVersion,
  useCdn: false,
  token: CONFIG.sanity.token
});

let genAI;
let model;

function initGemini() {
  if (!CONFIG.gemini.apiKey) {
    throw new Error('❌ GEMINI_API_KEY non configurata!');
  }
  genAI = new GoogleGenerativeAI(CONFIG.gemini.apiKey);
  model = genAI.getGenerativeModel({ model: CONFIG.gemini.model });
}

// ===== PROMPT PER CAROUSEL =====
const CAROUSEL_PROMPT = (article) => `
Sei un social media manager esperto di Instagram per un brand di pesca sportiva italiana.
Devi creare un CAROUSEL Instagram da questo articolo del blog FishandTips.it.

=== ARTICOLO ORIGINALE ===
Titolo: ${article.title}
Excerpt: ${article.excerpt || ''}
Contenuto: ${article.bodyText || article.excerpt || ''}
Categoria: ${article.category || 'pesca'}
Keywords: ${(article.seoKeywords || []).join(', ')}

=== REGOLE CAROUSEL INSTAGRAM ===
1. SLIDE 1 (HOOK): Deve catturare l'attenzione in 1 secondo
   - Usa numeri ("5 errori", "7 segreti")
   - Crea curiosità ("Il 90% sbaglia questo")
   - Mai titoli noiosi
   
2. SLIDE 2-6 (CONTENUTO): Un concetto per slide
   - Max 30-40 parole per slide
   - Linguaggio semplice e diretto
   - Emoji per enfasi (ma non esagerare)
   
3. SLIDE 7 (CTA): Call-to-action finale
   - "Salva questo post"
   - "Seguici per altri tips"
   - "Link in bio"

=== STILE ===
- Tono: amichevole, esperto, italiano
- Usa "tu" (non "voi")
- Emoji: 2-3 per slide max
- NO clickbait esagerato, sì curiosità genuina

=== OUTPUT RICHIESTO ===
Rispondi SOLO con questo JSON (senza markdown code blocks):

{
  "carouselType": "tips" | "errors" | "tutorial" | "comparison" | "facts",
  "slides": [
    {
      "slideNumber": 1,
      "type": "hook",
      "headline": "Testo grande principale (max 6 parole)",
      "subheadline": "Sottotitolo o frase curiosità (max 10 parole)",
      "emoji": "emoji principale per questa slide"
    },
    {
      "slideNumber": 2,
      "type": "content",
      "headline": "Titolo punto (es: 'Errore #1' o 'Tip #1')",
      "body": "Spiegazione breve (max 40 parole)",
      "highlight": "Frase chiave da evidenziare",
      "emoji": "emoji"
    },
    // ... altre slide contenuto ...
    {
      "slideNumber": 7,
      "type": "cta",
      "headline": "Call to action principale",
      "body": "Testo secondario CTA",
      "actions": ["💾 Salva", "👆 Seguici", "🔗 Link in bio"]
    }
  ],
  "caption": "Caption completa per il post (max 2000 caratteri). Include: introduzione accattivante, riassunto valore, domanda per engagement, CTA. NON includere hashtag qui.",
  "hashtags": ["hashtag1", "hashtag2", ...], // 25-30 hashtag rilevanti (senza #)
  "photoKeywords": ["keyword1", "keyword2", "keyword3"] // 3-5 keyword per cercare foto su Unsplash
}
`;

// ===== FUNZIONI PRINCIPALI =====

/**
 * Recupera un articolo da Sanity per slug
 */
async function getArticleBySlug(slug) {
  const article = await sanityClient.fetch(`
    *[_type == "post" && slug.current == $slug][0] {
      _id,
      title,
      excerpt,
      "bodyText": pt::text(body),
      "category": categories[0]->title,
      seoKeywords,
      publishedAt
    }
  `, { slug });
  
  return article;
}

/**
 * Genera contenuto carousel con AI
 */
export async function generateCarouselContent(article) {
  console.log('\n' + '📱'.repeat(20));
  console.log('GENERAZIONE CAROUSEL INSTAGRAM');
  console.log('📱'.repeat(20));
  console.log(`\n📰 Articolo: "${article.title}"\n`);
  
  initGemini();
  
  const startTime = Date.now();
  console.log('🤖 Chiamata Gemini AI...');
  
  try {
    const result = await model.generateContent(CAROUSEL_PROMPT(article));
    const response = await result.response;
    const content = response.text();
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Risposta ricevuta in ${elapsed}s`);
    
    // Parse JSON
    const cleanContent = content
      .replace(/```json\n?/g, '')
      .replace(/```\n?/g, '')
      .trim();
    
    const jsonMatch = cleanContent.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Risposta non in formato JSON valido');
    }
    
    const carouselData = JSON.parse(jsonMatch[0]);
    
    // Validazione
    if (!carouselData.slides || carouselData.slides.length < 5) {
      throw new Error('Carousel deve avere almeno 5 slide');
    }
    
    console.log(`\n✅ Carousel generato:`);
    console.log(`   📊 Tipo: ${carouselData.carouselType}`);
    console.log(`   🖼️ Slide: ${carouselData.slides.length}`);
    console.log(`   📝 Caption: ${carouselData.caption?.length || 0} caratteri`);
    console.log(`   #️⃣ Hashtag: ${carouselData.hashtags?.length || 0}`);
    console.log(`   📸 Photo keywords: ${carouselData.photoKeywords?.join(', ')}`);
    
    return {
      ...carouselData,
      sourceArticle: {
        id: article._id,
        title: article.title,
        slug: article.slug
      },
      generatedAt: new Date().toISOString()
    };
    
  } catch (error) {
    console.error('❌ Errore generazione carousel:', error.message);
    throw error;
  }
}

/**
 * Formatta l'output per preview
 */
export function formatCarouselPreview(carousel) {
  let output = '\n' + '='.repeat(60) + '\n';
  output += '📱 PREVIEW CAROUSEL\n';
  output += '='.repeat(60) + '\n\n';
  
  // Preview slide
  carousel.slides.forEach((slide, i) => {
    output += `┌${'─'.repeat(40)}┐\n`;
    output += `│ SLIDE ${slide.slideNumber} (${slide.type.toUpperCase()})${' '.repeat(40 - 20 - slide.type.length)}│\n`;
    output += `├${'─'.repeat(40)}┤\n`;
    
    if (slide.headline) {
      const headline = slide.headline.substring(0, 36);
      output += `│ ${slide.emoji || '📌'} ${headline}${' '.repeat(Math.max(0, 36 - headline.length))}│\n`;
    }
    
    if (slide.subheadline) {
      const sub = slide.subheadline.substring(0, 38);
      output += `│ ${sub}${' '.repeat(Math.max(0, 38 - sub.length))}│\n`;
    }
    
    if (slide.body) {
      const body = slide.body.substring(0, 38);
      output += `│ ${body}${' '.repeat(Math.max(0, 38 - body.length))}│\n`;
      if (slide.body.length > 38) {
        const body2 = slide.body.substring(38, 76);
        output += `│ ${body2}${' '.repeat(Math.max(0, 38 - body2.length))}│\n`;
      }
    }
    
    if (slide.highlight) {
      const hl = `"${slide.highlight}"`.substring(0, 38);
      output += `│ ⭐ ${hl}${' '.repeat(Math.max(0, 36 - hl.length))}│\n`;
    }
    
    output += `└${'─'.repeat(40)}┘\n\n`;
  });
  
  // Caption preview
  output += '📝 CAPTION:\n';
  output += '─'.repeat(60) + '\n';
  output += carousel.caption?.substring(0, 500) + '...\n';
  output += '─'.repeat(60) + '\n\n';
  
  // Hashtag preview
  output += `#️⃣ HASHTAG (${carousel.hashtags?.length || 0}):\n`;
  output += carousel.hashtags?.map(h => `#${h}`).join(' ').substring(0, 200) + '...\n\n';
  
  // Photo keywords
  output += `📸 KEYWORDS FOTO: ${carousel.photoKeywords?.join(', ')}\n`;
  
  return output;
}

/**
 * Genera carousel da slug articolo
 */
export async function generateFromSlug(slug) {
  console.log(`\n🔍 Recupero articolo: ${slug}`);
  
  const article = await getArticleBySlug(slug);
  
  if (!article) {
    throw new Error(`Articolo non trovato: ${slug}`);
  }
  
  console.log(`✅ Articolo trovato: "${article.title}"`);
  
  const carousel = await generateCarouselContent(article);
  
  return carousel;
}

/**
 * Test con articolo di esempio
 */
async function testGeneration() {
  // Articolo di test
  const testArticle = {
    _id: 'test-123',
    title: 'Come pescare la spigola: tecniche, esche e periodi migliori',
    excerpt: 'Guida completa alla pesca della spigola. Scopri le tecniche più efficaci, le esche migliori e i periodi ideali per catturare questo pregiato predatore.',
    bodyText: `La spigola è uno dei pesci più ambiti dai pescatori italiani. 
    Per catturarla servono le tecniche giuste: spinning, surfcasting o pesca a fondo.
    Le esche migliori sono il muriddu, l'americano e gli artificiali come minnow e wtd.
    I periodi migliori sono autunno e primavera, soprattutto all'alba e al tramonto.
    Attenzione alle maree: la spigola mangia nelle 2 ore prima e dopo l'alta marea.
    Errori comuni: lanciare troppo lontano, usare terminali sbagliati, ferrarsi troppo presto.`,
    category: 'Tecniche di Pesca',
    seoKeywords: ['pesca spigola', 'come pescare spigola', 'tecniche spigola', 'esche spigola']
  };
  
  const carousel = await generateCarouselContent(testArticle);
  console.log(formatCarouselPreview(carousel));
  
  return carousel;
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
📱 FishandTips Instagram Carousel Generator
============================================

Genera carousel Instagram automaticamente da articoli del blog.

Uso:
  node scripts/instagram-carousel-generator.js "slug-articolo"
  node scripts/instagram-carousel-generator.js --test
  node scripts/instagram-carousel-generator.js --help

Esempi:
  node scripts/instagram-carousel-generator.js "come-pescare-la-spigola"
  node scripts/instagram-carousel-generator.js --test

Output:
  - 7 slide con testi ottimizzati
  - Caption completa
  - 25-30 hashtag rilevanti
  - Keywords per foto Unsplash

Prerequisiti:
  - GEMINI_API_KEY configurata
  - SANITY_API_TOKEN per leggere gli articoli
`);
    return;
  }
  
  if (args[0] === '--test') {
    console.log('🧪 Modalità test - uso articolo di esempio\n');
    await testGeneration();
    return;
  }
  
  const slug = args[0];
  
  try {
    const carousel = await generateFromSlug(slug);
    console.log(formatCarouselPreview(carousel));
    
    // Salva JSON output
    const fs = await import('fs');
    const outputPath = `./data/carousel-${slug}-${Date.now()}.json`;
    fs.writeFileSync(outputPath, JSON.stringify(carousel, null, 2));
    console.log(`\n💾 Output salvato: ${outputPath}`);
    
  } catch (error) {
    console.error('\n❌ ERRORE:', error.message);
    process.exit(1);
  }
}

// Solo esegui main() se questo file è il punto di ingresso
if (process.argv[1]?.includes('instagram-carousel-generator.js')) {
  main().catch(console.error);
}

export default {
  generateCarouselContent,
  generateFromSlug,
  formatCarouselPreview
};

