import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ============================================
// PINTEREST CONTENT GENERATOR
// Genera titoli, descrizioni e hashtag ottimizzati per Pinterest
// ============================================

const CONFIG = {
  geminiModel: 'gemini-2.0-flash',
};

let genAI = null;

function initGemini() {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('❌ GEMINI_API_KEY non configurata!');
  }
  if (!genAI) {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  }
  return genAI.getGenerativeModel({ model: CONFIG.geminiModel });
}

// Categorie di bacheche Pinterest
export const PINTEREST_BOARDS = {
  'tecniche-di-pesca': 'Tecniche di Pesca',
  'attrezzature': 'Attrezzatura Pesca',
  'consigli': 'Consigli Pescatori',
  'spot-di-pesca': 'Spot Pesca Italia',
  'pesci': 'Pesci del Mediterraneo',
  'default': 'Pesca Sportiva Italia'
};

// Prompt per generare contenuto Pinterest
const PINTEREST_PROMPT = `Sei un esperto di Pinterest marketing per il settore pesca sportiva.

Genera contenuto per un PIN Pinterest basato su questo articolo:

TITOLO: {title}
EXCERPT: {excerpt}
CATEGORIA: {category}

Devi generare:
1. **Titolo Pin** (max 100 caratteri): Accattivante, con emoji, che invogli al click
2. **Descrizione** (max 500 caratteri): SEO-friendly con keyword pesca, call-to-action finale
3. **Alt Text** (max 200 caratteri): Descrizione dell'immagine per accessibilità
4. **Hashtag** (10-15): I più rilevanti per pesca in Italia
5. **Keyword Immagine** (3-5 parole): Per cercare foto su Unsplash
6. **Testo Overlay** (max 6 parole): Testo grande da mettere sull'immagine del pin

IMPORTANTE:
- Usa italiano
- Includi emoji nel titolo
- La descrizione deve contenere keyword come: pesca, pescatore, tecniche pesca, attrezzatura pesca
- Gli hashtag devono includere #pesca #pescasportiva #pescaitalia
- Il testo overlay deve essere BREVE e d'impatto

Rispondi SOLO con JSON valido:
{
  "title": "...",
  "description": "...",
  "altText": "...",
  "hashtags": ["pesca", "pescasportiva", ...],
  "imageKeywords": ["fishing", "sea", ...],
  "overlayText": "..."
}`;

/**
 * Genera contenuto per un pin Pinterest
 */
export async function generatePinContent(article) {
  console.log('\n📌 Generazione contenuto Pinterest...');
  console.log(`   📝 Articolo: ${article.title}`);

  const model = initGemini();

  const prompt = PINTEREST_PROMPT
    .replace('{title}', article.title)
    .replace('{excerpt}', article.excerpt || '')
    .replace('{category}', article.category || 'pesca');

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // Pulisci la risposta
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const content = JSON.parse(text);

    console.log('   ✅ Contenuto generato!');
    console.log(`   📌 Titolo: ${content.title}`);
    console.log(`   #️⃣ Hashtag: ${content.hashtags.length}`);

    return {
      title: content.title,
      description: content.description + '\n\n' + content.hashtags.map(h => `#${h.replace('#', '')}`).join(' '),
      altText: content.altText,
      hashtags: content.hashtags,
      imageKeywords: content.imageKeywords,
      overlayText: content.overlayText,
      link: `https://fishandtips.it/articoli/${article.slug}`,
      boardName: PINTEREST_BOARDS[article.category] || PINTEREST_BOARDS.default
    };

  } catch (error) {
    console.error('❌ Errore generazione contenuto:', error.message);
    throw error;
  }
}

/**
 * Genera contenuto per un pin da uno spot di pesca
 */
export async function generateSpotPinContent(spot) {
  console.log('\n📌 Generazione pin per spot:', spot.name);

  const model = initGemini();

  const prompt = `Genera contenuto Pinterest per questo SPOT DI PESCA:

NOME: ${spot.name}
REGIONE: ${spot.region}
DESCRIZIONE: ${spot.description}
SPECIE: ${spot.species?.join(', ') || 'Varie'}
TECNICHE: ${spot.techniques?.join(', ') || 'Varie'}

Genera JSON con:
{
  "title": "Titolo accattivante con emoji (max 100 char)",
  "description": "Descrizione SEO con keyword pesca, spot, regione (max 500 char)",
  "altText": "Descrizione immagine (max 200 char)",
  "hashtags": ["pesca", "spot", "regione", ...],
  "imageKeywords": ["fishing", "italy", "sea", ...],
  "overlayText": "Testo breve per immagine (max 6 parole)"
}

Rispondi SOLO con JSON valido.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const content = JSON.parse(text);

    return {
      ...content,
      description: content.description + '\n\n' + content.hashtags.map(h => `#${h.replace('#', '')}`).join(' '),
      link: `https://fishandtips.it/spot-pesca-italia/${spot.region.toLowerCase().replace(/\s+/g, '-')}/${spot.slug}`,
      boardName: 'Spot Pesca Italia'
    };

  } catch (error) {
    console.error('❌ Errore:', error.message);
    throw error;
  }
}

/**
 * Genera contenuto per un pin da un pesce
 */
export async function generateFishPinContent(fish) {
  console.log('\n📌 Generazione pin per pesce:', fish.name);

  const model = initGemini();

  const prompt = `Genera contenuto Pinterest per questo PESCE:

NOME: ${fish.name}
NOME SCIENTIFICO: ${fish.scientificName}
DESCRIZIONE: ${fish.description}
HABITAT: ${fish.habitat}
TECNICHE: ${fish.techniques?.join(', ') || 'Varie'}

Genera JSON con:
{
  "title": "Titolo accattivante con emoji (max 100 char)",
  "description": "Descrizione SEO informativa sul pesce (max 500 char)",
  "altText": "Descrizione immagine del pesce (max 200 char)",
  "hashtags": ["pesca", "pesce", "mediterraneo", ...],
  "imageKeywords": ["fish", "mediterranean", ...],
  "overlayText": "Nome pesce o fatto interessante (max 6 parole)"
}

Rispondi SOLO con JSON valido.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    const content = JSON.parse(text);

    return {
      ...content,
      description: content.description + '\n\n' + content.hashtags.map(h => `#${h.replace('#', '')}`).join(' '),
      link: `https://fishandtips.it/pesci-mediterraneo/${fish.slug}`,
      boardName: 'Pesci del Mediterraneo'
    };

  } catch (error) {
    console.error('❌ Errore:', error.message);
    throw error;
  }
}

// Test
if (import.meta.url === `file://${process.argv[1]}`) {
  const testArticle = {
    title: 'Come pescare la spigola a spinning',
    excerpt: 'Guida completa alle tecniche di spinning per catturare la spigola in mare',
    category: 'tecniche-di-pesca',
    slug: 'come-pescare-spigola-spinning'
  };

  generatePinContent(testArticle)
    .then(content => console.log('\n📌 Risultato:', JSON.stringify(content, null, 2)))
    .catch(console.error);
}

