/**
 * 🎣 FishandTips - Sanity Helpers
 * 
 * Funzioni helper per interagire con Sanity CMS
 * Recupero ID autori, categorie e validazione documenti
 */

import { createClient } from '@sanity/client';

// ===== CONFIGURAZIONE SANITY =====
const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3nnnl6gi',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

// ===== FUNZIONI HELPER =====

/**
 * Recupera l'ID del primo autore disponibile
 * @returns {Promise<string|null>} ID dell'autore o null se non trovato
 */
export async function getDefaultAuthorId() {
  try {
    const author = await sanityClient.fetch(`*[_type == "author"][0]{ _id, name }`);
    if (author) {
      console.log(`✅ Autore trovato: ${author.name} (${author._id})`);
      return author._id;
    }
    console.log('⚠️ Nessun autore trovato in Sanity');
    return null;
  } catch (error) {
    console.error('❌ Errore nel recupero autore:', error.message);
    return null;
  }
}

/**
 * Recupera tutti gli autori disponibili
 * @returns {Promise<Array>} Lista degli autori
 */
export async function getAllAuthors() {
  try {
    const authors = await sanityClient.fetch(`*[_type == "author"]{ _id, name, slug }`);
    return authors || [];
  } catch (error) {
    console.error('❌ Errore nel recupero autori:', error.message);
    return [];
  }
}

/**
 * Recupera l'ID di una categoria per slug
 * @param {string} slug - Lo slug della categoria (es: "attrezzature", "tecniche-di-pesca")
 * @returns {Promise<string|null>} ID della categoria o null se non trovata
 */
export async function getCategoryIdBySlug(slug) {
  try {
    const category = await sanityClient.fetch(
      `*[_type == "category" && slug.current == $slug][0]{ _id, title }`,
      { slug }
    );
    if (category) {
      console.log(`✅ Categoria trovata: ${category.title} (${category._id})`);
      return category._id;
    }
    console.log(`⚠️ Categoria non trovata per slug: ${slug}`);
    return null;
  } catch (error) {
    console.error('❌ Errore nel recupero categoria:', error.message);
    return null;
  }
}

/**
 * Recupera tutte le categorie disponibili
 * @returns {Promise<Array>} Lista delle categorie con id, title e slug
 */
export async function getAllCategories() {
  try {
    const categories = await sanityClient.fetch(`
      *[_type == "category"]{ 
        _id, 
        title, 
        "slug": slug.current 
      } | order(title asc)
    `);
    return categories || [];
  } catch (error) {
    console.error('❌ Errore nel recupero categorie:', error.message);
    return [];
  }
}

/**
 * Recupera tutte le tecniche di pesca disponibili
 * @returns {Promise<Array>} Lista delle tecniche
 */
export async function getAllFishingTechniques() {
  try {
    const techniques = await sanityClient.fetch(`
      *[_type == "fishingTechnique"]{ 
        _id, 
        title, 
        "slug": slug.current 
      } | order(title asc)
    `);
    return techniques || [];
  } catch (error) {
    console.error('❌ Errore nel recupero tecniche:', error.message);
    return [];
  }
}

/**
 * Verifica se un articolo con lo stesso slug esiste già
 * @param {string} slug - Lo slug dell'articolo
 * @returns {Promise<boolean>} true se esiste, false altrimenti
 */
export async function articleExistsBySlug(slug) {
  try {
    const existing = await sanityClient.fetch(
      `*[_type == "post" && slug.current == $slug][0]{ _id }`,
      { slug }
    );
    return !!existing;
  } catch (error) {
    console.error('❌ Errore nella verifica articolo:', error.message);
    return false;
  }
}

/**
 * Crea un documento in Sanity
 * @param {Object} document - Il documento da creare
 * @returns {Promise<Object>} Il documento creato
 */
export async function createDocument(document) {
  try {
    const result = await sanityClient.create(document);
    console.log(`✅ Documento creato con ID: ${result._id}`);
    return result;
  } catch (error) {
    console.error('❌ Errore nella creazione documento:', error.message);
    throw error;
  }
}

/**
 * Valida un documento post prima della creazione
 * @param {Object} doc - Il documento da validare
 * @returns {Object} { valid: boolean, errors: string[] }
 */
export function validatePostDocument(doc) {
  const errors = [];

  if (!doc.title || doc.title.length === 0) {
    errors.push('Titolo mancante');
  } else if (doc.title.length > 60) {
    errors.push(`Titolo troppo lungo: ${doc.title.length} caratteri (max 60)`);
  }

  if (!doc.slug?.current) {
    errors.push('Slug mancante');
  }

  if (!doc.excerpt || doc.excerpt.length === 0) {
    errors.push('Excerpt mancante');
  } else if (doc.excerpt.length > 160) {
    errors.push(`Excerpt troppo lungo: ${doc.excerpt.length} caratteri (max 160)`);
  }

  if (!doc.body || doc.body.length === 0) {
    errors.push('Body mancante');
  }

  if (!doc.author?._ref) {
    errors.push('Riferimento autore mancante');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Converte testo markdown in Sanity Block Content
 * Supporta: H2, H3, H4, liste puntate, blockquote, grassetto, corsivo
 * @param {string} markdown - Il testo in formato markdown
 * @returns {Array} Array di blocchi Sanity
 */
export function markdownToBlockContent(markdown) {
  const lines = markdown.split('\n');
  const blocks = [];
  let blockIndex = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmedLine = line.trim();
    
    // Salta linee vuote
    if (!trimmedLine) continue;

    let style = 'normal';
    let text = trimmedLine;
    let listItem = null;

    // Headings
    if (trimmedLine.startsWith('#### ')) {
      style = 'h4';
      text = trimmedLine.slice(5);
    } else if (trimmedLine.startsWith('### ')) {
      style = 'h3';
      text = trimmedLine.slice(4);
    } else if (trimmedLine.startsWith('## ')) {
      style = 'h2';
      text = trimmedLine.slice(3);
    } else if (trimmedLine.startsWith('# ')) {
      style = 'h1';
      text = trimmedLine.slice(2);
    }
    // Blockquote
    else if (trimmedLine.startsWith('> ')) {
      style = 'blockquote';
      text = trimmedLine.slice(2);
    }
    // Liste puntate
    else if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('* ')) {
      listItem = 'bullet';
      text = trimmedLine.slice(2);
    }
    // Liste numerate
    else if (/^\d+\.\s/.test(trimmedLine)) {
      listItem = 'number';
      text = trimmedLine.replace(/^\d+\.\s/, '');
    }

    // Processa grassetto e corsivo nel testo
    const { children, markDefs } = parseInlineMarks(text, blockIndex);

    const block = {
      _type: 'block',
      _key: `block-${blockIndex}`,
      style,
      markDefs,
      children
    };

    if (listItem) {
      block.listItem = listItem;
      block.level = 1;
    }

    blocks.push(block);
    blockIndex++;
  }

  return blocks;
}

/**
 * Parsa marks inline (grassetto, corsivo, link) nel testo
 * @param {string} text - Il testo da parsare
 * @param {number} blockIndex - Indice del blocco per generare chiavi uniche
 * @returns {Object} { children: Array, markDefs: Array }
 */
function parseInlineMarks(text, blockIndex) {
  const children = [];
  const markDefs = [];
  let spanIndex = 0;

  // Pattern per grassetto (**text**) e corsivo (*text* o _text_)
  // Per semplicità, gestiamo solo il caso base senza nesting complesso
  const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|_[^_]+_)/g);

  for (const part of parts) {
    if (!part) continue;

    let marks = [];
    let cleanText = part;

    // Grassetto
    if (part.startsWith('**') && part.endsWith('**')) {
      marks.push('strong');
      cleanText = part.slice(2, -2);
    }
    // Corsivo con asterisco
    else if (part.startsWith('*') && part.endsWith('*') && !part.startsWith('**')) {
      marks.push('em');
      cleanText = part.slice(1, -1);
    }
    // Corsivo con underscore
    else if (part.startsWith('_') && part.endsWith('_')) {
      marks.push('em');
      cleanText = part.slice(1, -1);
    }

    children.push({
      _type: 'span',
      _key: `span-${blockIndex}-${spanIndex}`,
      text: cleanText,
      marks
    });
    spanIndex++;
  }

  // Se non ci sono children, crea uno span vuoto
  if (children.length === 0) {
    children.push({
      _type: 'span',
      _key: `span-${blockIndex}-0`,
      text: text,
      marks: []
    });
  }

  return { children, markDefs };
}

/**
 * Genera uno slug da un testo
 * @param {string} text - Il testo da convertire in slug
 * @returns {string} Lo slug generato
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Rimuove accenti
    .replace(/[^a-z0-9]+/g, '-')     // Sostituisce caratteri speciali con -
    .replace(/^-+|-+$/g, '')          // Rimuove - iniziali e finali
    .substring(0, 96);                // Max 96 caratteri
}

/**
 * Stampa un report delle risorse disponibili in Sanity
 */
export async function printSanityReport() {
  console.log('\n📊 REPORT RISORSE SANITY\n');
  console.log('='.repeat(50));

  // Autori
  const authors = await getAllAuthors();
  console.log(`\n👤 AUTORI (${authors.length}):`);
  authors.forEach(a => console.log(`   - ${a.name} [${a._id}]`));

  // Categorie
  const categories = await getAllCategories();
  console.log(`\n📁 CATEGORIE (${categories.length}):`);
  categories.forEach(c => console.log(`   - ${c.title} (${c.slug}) [${c._id}]`));

  // Tecniche
  const techniques = await getAllFishingTechniques();
  console.log(`\n🎣 TECNICHE DI PESCA (${techniques.length}):`);
  techniques.forEach(t => console.log(`   - ${t.title} (${t.slug}) [${t._id}]`));

  console.log('\n' + '='.repeat(50));
}

// ===== EXPORT DEFAULT =====
export default {
  sanityClient,
  getDefaultAuthorId,
  getAllAuthors,
  getCategoryIdBySlug,
  getAllCategories,
  getAllFishingTechniques,
  articleExistsBySlug,
  createDocument,
  validatePostDocument,
  markdownToBlockContent,
  slugify,
  printSanityReport
};

