/**
 * 🎨 FishandTips - Advanced Carousel Generator
 * 
 * Genera carousel con toni e tipi di contenuto diversi
 * Supporta: Tutorial, Confronti, Errori, Quiz, Top List, Meme, Storie
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { GoogleGenerativeAI } from '@google/generative-ai';
import { TONES, CONTENT_TYPES, generateHashtagSet, getRecommendedTone } from './content-tones.js';

// ===== CONFIGURAZIONE =====
const CONFIG = {
  geminiApiKey: process.env.GEMINI_API_KEY,
  model: 'gemini-2.0-flash'
};

let genAI = null;

function initGemini() {
  if (!CONFIG.geminiApiKey) {
    throw new Error('❌ GEMINI_API_KEY non configurata!');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(CONFIG.geminiApiKey);
  }
  return genAI.getGenerativeModel({ model: CONFIG.model });
}

// ===== PROMPT TEMPLATES =====

const BASE_PROMPT = `
Sei un esperto social media manager specializzato in contenuti di pesca per Instagram.
Genera un carousel di 7 slide in ITALIANO per l'account @fishandtips.it

FORMATO OUTPUT (JSON valido):
{
  "slides": [
    {
      "slideNumber": 1,
      "type": "hook",
      "headline": "Testo grande principale (max 6 parole)",
      "subheadline": "Sottotitolo o frase curiosità (max 10 parole)",
      "emoji": "🎣"
    },
    {
      "slideNumber": 2,
      "type": "content",
      "headline": "Titolo punto (es: Tip #1 o Errore #1)",
      "body": "Spiegazione breve (max 40 parole)",
      "highlight": "Frase chiave da evidenziare",
      "emoji": "🐟"
    },
    {
      "slideNumber": 7,
      "type": "cta",
      "headline": "Call to action principale",
      "body": "Testo secondario motivazionale",
      "actions": ["💾 Salva", "👆 Seguici", "🔗 Link in bio"]
    }
  ],
  "caption": "caption per il post (max 500 caratteri, includi emoji e domanda finale)",
  "hashtags": ["lista", "di", "hashtag", "senza #"],
  "photoKeywords": ["keyword1", "keyword2", "keyword3"]
}

REGOLE IMPORTANTI:
- Slide 1 = type "hook" con headline e subheadline
- Slide 2-6 = type "content" con headline, body, highlight, emoji
- Slide 7 = type "cta" con headline, body, actions
- Ogni slide DEVE avere TUTTI i campi richiesti per il suo tipo
- Usa emoji strategicamente
- Il contenuto deve essere PRATICO e ACTIONABLE
- photoKeywords: 3 parole chiave in inglese per cercare foto su Unsplash
`;

/**
 * Genera prompt per tipo di contenuto specifico
 */
function buildPrompt(contentType, topic, tone, extraContext = '') {
  const toneConfig = TONES[tone] || TONES.friendly;
  const typeConfig = CONTENT_TYPES[contentType] || CONTENT_TYPES.tutorial;
  
  return `
${BASE_PROMPT}

===== TIPO CONTENUTO: ${typeConfig.name} =====
${typeConfig.promptTemplate.replace('{topic}', topic)}

===== TONO: ${toneConfig.name} ${toneConfig.emoji} =====
${toneConfig.promptModifier}

===== ARGOMENTO =====
${topic}

${extraContext ? `===== CONTESTO EXTRA =====\n${extraContext}` : ''}

Genera il carousel JSON ora:
`;
}

/**
 * Genera carousel avanzato
 */
export async function generateAdvancedCarousel(options) {
  const {
    contentType = 'tutorial',
    topic,
    tone = null,
    extraContext = '',
    item1 = '',
    item2 = '',
    number = 5
  } = options;

  // Usa tono consigliato se non specificato
  const selectedTone = tone || getRecommendedTone(contentType).id;
  
  console.log('\n' + '🎨'.repeat(20));
  console.log('GENERAZIONE CAROUSEL AVANZATO');
  console.log('🎨'.repeat(20));
  console.log(`\n📊 Tipo: ${CONTENT_TYPES[contentType]?.name || contentType}`);
  console.log(`🎭 Tono: ${TONES[selectedTone]?.name || selectedTone}`);
  console.log(`📝 Topic: ${topic}`);

  const model = initGemini();
  
  // Costruisci topic con variabili
  let finalTopic = topic;
  if (contentType === 'comparison') {
    finalTopic = `${item1} vs ${item2}`;
  } else if (contentType === 'toplist') {
    finalTopic = `Top ${number} ${topic}`;
  }
  
  const prompt = buildPrompt(contentType, finalTopic, selectedTone, extraContext);
  
  console.log('\n🤖 Chiamata Gemini AI...');
  const startTime = Date.now();
  
  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    
    const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`✅ Risposta ricevuta in ${elapsed}s`);
    
    // Pulisci JSON
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    const carousel = JSON.parse(text);
    
    // Aggiungi hashtag ottimizzati
    const optimizedHashtags = generateHashtagSet(contentType);
    carousel.hashtags = [...new Set([...carousel.hashtags, ...optimizedHashtags])].slice(0, 30);
    
    // Aggiungi metadata
    carousel.metadata = {
      contentType,
      tone: selectedTone,
      topic: finalTopic,
      generatedAt: new Date().toISOString()
    };
    
    console.log(`\n✅ Carousel generato:`);
    console.log(`   📊 Tipo: ${contentType}`);
    console.log(`   🎭 Tono: ${selectedTone}`);
    console.log(`   🖼️ Slide: ${carousel.slides.length}`);
    console.log(`   📝 Caption: ${carousel.caption.length} caratteri`);
    console.log(`   #️⃣ Hashtag: ${carousel.hashtags.length}`);
    
    return carousel;
    
  } catch (error) {
    console.error('❌ Errore generazione:', error.message);
    throw error;
  }
}

/**
 * Genera carousel TUTORIAL
 */
export async function generateTutorial(topic, tone = 'expert') {
  return generateAdvancedCarousel({
    contentType: 'tutorial',
    topic,
    tone
  });
}

/**
 * Genera carousel CONFRONTO
 */
export async function generateComparison(item1, item2, tone = 'expert') {
  return generateAdvancedCarousel({
    contentType: 'comparison',
    topic: `${item1} vs ${item2}`,
    tone,
    item1,
    item2
  });
}

/**
 * Genera carousel ERRORI
 */
export async function generateMistakes(topic, tone = 'provocative') {
  return generateAdvancedCarousel({
    contentType: 'mistakes',
    topic,
    tone
  });
}

/**
 * Genera carousel QUIZ
 */
export async function generateQuiz(topic, tone = 'friendly') {
  return generateAdvancedCarousel({
    contentType: 'quiz',
    topic,
    tone
  });
}

/**
 * Genera carousel TOP LIST
 */
export async function generateTopList(topic, number = 5, tone = 'expert') {
  return generateAdvancedCarousel({
    contentType: 'toplist',
    topic,
    tone,
    number
  });
}

/**
 * Genera carousel MEME
 */
export async function generateMeme(topic, tone = 'funny') {
  return generateAdvancedCarousel({
    contentType: 'meme',
    topic,
    tone
  });
}

/**
 * Genera carousel STORIA
 */
export async function generateStory(topic, tone = 'storytelling') {
  return generateAdvancedCarousel({
    contentType: 'story',
    topic,
    tone
  });
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🎨 FishandTips Advanced Carousel Generator
============================================

Genera carousel con toni e stili diversi.

Uso:
  node scripts/advanced-carousel-generator.js --type <tipo> --topic "<argomento>" [--tone <tono>]

Tipi disponibili:
  tutorial    - Guide pratiche e consigli
  comparison  - Confronti (richiede --item1 e --item2)
  mistakes    - Errori da evitare
  quiz        - Quiz interattivi
  toplist     - Classifiche (usa --number per quantità)
  meme        - Contenuti divertenti
  story       - Racconti emotivi

Toni disponibili:
  expert      - 🎓 Autorevole e tecnico
  friendly    - 🤝 Amichevole e colloquiale
  provocative - 🔥 Provocatorio e clickbait
  storytelling - 💫 Narrativo ed emotivo
  funny       - 😂 Divertente e ironico

Esempi:
  node scripts/advanced-carousel-generator.js --type tutorial --topic "pesca alla spigola" --tone expert
  node scripts/advanced-carousel-generator.js --type comparison --item1 "spinning" --item2 "surfcasting"
  node scripts/advanced-carousel-generator.js --type mistakes --topic "pesca notturna" --tone provocative
  node scripts/advanced-carousel-generator.js --type quiz --topic "pesci del mediterraneo"
  node scripts/advanced-carousel-generator.js --type toplist --topic "esche per orata" --number 5
  node scripts/advanced-carousel-generator.js --type meme --topic "pescatori vs fidanzate"
`);
    return;
  }
  
  // Parse arguments
  const getArg = (name) => {
    const idx = args.indexOf(`--${name}`);
    return idx !== -1 ? args[idx + 1] : null;
  };
  
  const contentType = getArg('type') || 'tutorial';
  const topic = getArg('topic') || 'pesca sportiva';
  const tone = getArg('tone');
  const item1 = getArg('item1');
  const item2 = getArg('item2');
  const number = parseInt(getArg('number')) || 5;
  
  try {
    const carousel = await generateAdvancedCarousel({
      contentType,
      topic,
      tone,
      item1,
      item2,
      number
    });
    
    // Preview
    console.log('\n' + '='.repeat(60));
    console.log('📱 PREVIEW CAROUSEL');
    console.log('='.repeat(60) + '\n');
    
    carousel.slides.forEach(slide => {
      console.log(`┌${'─'.repeat(40)}┐`);
      console.log(`│ SLIDE ${slide.slideNumber} (${slide.type.toUpperCase()})`.padEnd(41) + '│');
      console.log(`├${'─'.repeat(40)}┤`);
      console.log(`│ ${slide.emoji} ${slide.title}`.substring(0, 40).padEnd(41) + '│');
      if (slide.content) {
        const content = slide.content.substring(0, 38);
        console.log(`│ ${content}`.padEnd(41) + '│');
      }
      if (slide.highlight) {
        console.log(`│ ⭐ "${slide.highlight.substring(0, 30)}"`.padEnd(41) + '│');
      }
      console.log(`└${'─'.repeat(40)}┘\n`);
    });
    
    console.log('📝 CAPTION:');
    console.log('─'.repeat(60));
    console.log(carousel.caption.substring(0, 300) + '...');
    console.log('─'.repeat(60));
    
    console.log(`\n#️⃣ HASHTAG (${carousel.hashtags.length}):`);
    console.log(carousel.hashtags.slice(0, 15).map(h => `#${h}`).join(' ') + '...');
    
  } catch (error) {
    console.error('Errore:', error.message);
    process.exit(1);
  }
}

main().catch(console.error);

export default {
  generateAdvancedCarousel,
  generateTutorial,
  generateComparison,
  generateMistakes,
  generateQuiz,
  generateTopList,
  generateMeme,
  generateStory
};

