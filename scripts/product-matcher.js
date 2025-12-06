/**
 * 🛒 FishandTips Product Matcher
 * 
 * Abbina automaticamente prodotti affiliati alle keyword degli articoli
 * Genera link affiliati Amazon con tag personalizzato
 * 
 * Uso:
 *   import { matchProducts } from './product-matcher.js';
 *   const products = await matchProducts("canna surfcasting per principianti");
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== CONFIGURAZIONE =====
const CONFIG = {
  affiliateTag: process.env.AMAZON_AFFILIATE_TAG || 'fishandtips-21',
  amazonBaseUrl: 'https://www.amazon.it/dp/',
  amazonSearchUrl: 'https://www.amazon.it/s?k=',
  maxProductsPerArticle: 5,
  minProductsPerArticle: 3
};

// ===== CARICAMENTO DATABASE PRODOTTI =====
let productsDatabase = null;

function loadProductsDatabase() {
  if (productsDatabase) return productsDatabase;
  
  const filePath = path.join(__dirname, '..', 'data', 'affiliate-products.json');
  
  if (!fs.existsSync(filePath)) {
    console.warn('⚠️ Database prodotti non trovato:', filePath);
    return null;
  }
  
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    productsDatabase = JSON.parse(data);
    console.log('✅ Database prodotti caricato');
    return productsDatabase;
  } catch (error) {
    console.error('❌ Errore caricamento database prodotti:', error.message);
    return null;
  }
}

// ===== KEYWORD MATCHING =====

/**
 * Estrae i tag/keywords da una stringa
 * @param {string} text - Testo da analizzare
 * @returns {string[]} Array di keywords normalizzate
 */
function extractKeywords(text) {
  const normalized = text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
  
  // Parole chiave comuni per la pesca
  const fishingKeywords = [
    // Tecniche
    'surfcasting', 'spinning', 'bolognese', 'feeder', 'traina', 'jigging', 'eging',
    'rockfishing', 'light', 'ultralight', 'shore', 'vertical',
    // Attrezzatura
    'canna', 'canne', 'mulinello', 'mulinelli', 'esca', 'esche', 'artificiale', 'artificiali',
    'minnow', 'popper', 'jig', 'totanara', 'totanare', 'softbait',
    'trecciato', 'fluorocarbon', 'nylon', 'ami', 'piombi',
    // Specie
    'spigola', 'branzino', 'orata', 'sarago', 'dentice', 'ricciola', 'serra',
    'seppia', 'calamaro', 'tonno', 'lampuga', 'leccia',
    // Livelli
    'principiante', 'principianti', 'beginner', 'economico', 'economica', 'budget',
    'professionale', 'pro', 'esperto', 'avanzato',
    // Qualità
    'migliore', 'migliori', 'top', 'premium', 'qualita'
  ];
  
  const found = [];
  for (const keyword of fishingKeywords) {
    if (normalized.includes(keyword)) {
      found.push(keyword);
    }
  }
  
  return found;
}

/**
 * Calcola il punteggio di matching tra keyword e prodotto
 * @param {string[]} keywords - Keywords estratte dalla query
 * @param {Object} product - Prodotto dal database
 * @returns {number} Punteggio (0-100)
 */
function calculateMatchScore(keywords, product) {
  let score = 0;
  const productTags = product.tags || [];
  const productText = [
    product.name,
    product.brand,
    product.quickReview,
    ...productTags
  ].join(' ').toLowerCase();
  
  // Match diretto con i tag (peso alto)
  for (const keyword of keywords) {
    if (productTags.some(tag => tag.includes(keyword))) {
      score += 20;
    }
    if (productText.includes(keyword)) {
      score += 10;
    }
  }
  
  // Bonus per livello esperienza appropriato
  if (keywords.includes('principiante') || keywords.includes('principianti') || keywords.includes('economico')) {
    if (product.experienceLevel === 'beginner' || product.badge === 'beginner-friendly' || product.badge === 'budget-friendly') {
      score += 25;
    }
  }
  
  if (keywords.includes('professionale') || keywords.includes('pro') || keywords.includes('esperto')) {
    if (product.experienceLevel === 'expert' || product.badge === 'pro-choice') {
      score += 25;
    }
  }
  
  // Bonus per best-seller e best-value (sempre rilevanti)
  if (product.badge === 'best-seller') score += 10;
  if (product.badge === 'best-value') score += 10;
  
  return Math.min(score, 100);
}

// ===== FUNZIONE PRINCIPALE =====

/**
 * Trova i prodotti più rilevanti per una keyword/articolo
 * @param {string} keyword - Keyword o titolo dell'articolo
 * @param {Object} options - Opzioni di configurazione
 * @returns {Array} Prodotti ordinati per rilevanza
 */
export async function matchProducts(keyword, options = {}) {
  const {
    maxProducts = CONFIG.maxProductsPerArticle,
    minProducts = CONFIG.minProductsPerArticle,
    category = null, // Filtra per categoria specifica
    experienceLevel = null // Filtra per livello
  } = options;
  
  console.log(`\n🔍 Ricerca prodotti per: "${keyword}"`);
  
  const db = loadProductsDatabase();
  if (!db) {
    console.log('⚠️ Nessun database prodotti disponibile');
    return [];
  }
  
  const keywords = extractKeywords(keyword);
  console.log(`   Keywords estratte: ${keywords.join(', ')}`);
  
  // Raccogli tutti i prodotti da tutte le categorie
  const allProducts = [];
  for (const [categoryName, products] of Object.entries(db)) {
    if (categoryName === 'metadata') continue;
    if (Array.isArray(products)) {
      products.forEach(p => {
        allProducts.push({
          ...p,
          category: categoryName
        });
      });
    }
  }
  
  // Calcola score per ogni prodotto
  const scoredProducts = allProducts.map(product => ({
    ...product,
    matchScore: calculateMatchScore(keywords, product)
  }));
  
  // Filtra per categoria se specificata
  let filtered = scoredProducts;
  if (category) {
    filtered = filtered.filter(p => p.category.includes(category));
  }
  
  // Filtra per livello se specificato
  if (experienceLevel) {
    filtered = filtered.filter(p => p.experienceLevel === experienceLevel);
  }
  
  // Ordina per score e prendi i migliori
  const sorted = filtered
    .filter(p => p.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, maxProducts);
  
  // Se non abbastanza prodotti, aggiungi best-seller generici
  if (sorted.length < minProducts) {
    const bestSellers = allProducts
      .filter(p => p.badge === 'best-seller' || p.badge === 'best-value')
      .filter(p => !sorted.find(s => s.id === p.id))
      .slice(0, minProducts - sorted.length);
    sorted.push(...bestSellers);
  }
  
  // Formatta prodotti con link affiliati
  const formattedProducts = sorted.map((product, index) => ({
    _key: `product-${index}`,
    _type: 'object',
    productId: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    quickReview: product.quickReview,
    experienceLevel: product.experienceLevel,
    badge: product.badge,
    affiliateLink: generateAffiliateLink(product),
    matchScore: product.matchScore
  }));
  
  console.log(`   ✅ ${formattedProducts.length} prodotti trovati`);
  formattedProducts.forEach(p => {
    console.log(`      - ${p.name} (score: ${p.matchScore})`);
  });
  
  return formattedProducts;
}

/**
 * Genera il link affiliato Amazon per un prodotto
 * @param {Object} product - Prodotto
 * @returns {string} URL con tag affiliato
 */
export function generateAffiliateLink(product) {
  if (product.asin) {
    // Link diretto al prodotto
    return `${CONFIG.amazonBaseUrl}${product.asin}?tag=${CONFIG.affiliateTag}`;
  } else if (product.searchQuery) {
    // Link di ricerca
    return `${CONFIG.amazonSearchUrl}${encodeURIComponent(product.searchQuery)}&tag=${CONFIG.affiliateTag}`;
  } else {
    // Fallback con nome prodotto
    return `${CONFIG.amazonSearchUrl}${encodeURIComponent(product.name)}&tag=${CONFIG.affiliateTag}`;
  }
}

/**
 * Ottiene prodotti per una categoria specifica
 * @param {string} categoryId - ID della categoria (es: "canne_surfcasting")
 * @param {number} limit - Numero massimo di prodotti
 * @returns {Array} Prodotti della categoria
 */
export function getProductsByCategory(categoryId, limit = 5) {
  const db = loadProductsDatabase();
  if (!db || !db[categoryId]) return [];
  
  return db[categoryId].slice(0, limit).map((product, index) => ({
    _key: `product-${index}`,
    _type: 'object',
    productId: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    quickReview: product.quickReview,
    experienceLevel: product.experienceLevel,
    badge: product.badge,
    affiliateLink: generateAffiliateLink(product)
  }));
}

/**
 * Ottiene tutti i prodotti disponibili
 * @returns {Object} Database completo dei prodotti
 */
export function getAllProducts() {
  return loadProductsDatabase();
}

/**
 * Stampa un report dei prodotti disponibili
 */
export function printProductsReport() {
  const db = loadProductsDatabase();
  if (!db) {
    console.log('❌ Database prodotti non disponibile');
    return;
  }
  
  console.log('\n📦 REPORT PRODOTTI DISPONIBILI\n');
  console.log('='.repeat(60));
  
  let total = 0;
  for (const [category, products] of Object.entries(db)) {
    if (category === 'metadata') continue;
    if (!Array.isArray(products)) continue;
    
    console.log(`\n📁 ${category.toUpperCase()} (${products.length} prodotti)`);
    products.forEach(p => {
      const badge = p.badge ? `[${p.badge}]` : '';
      console.log(`   - ${p.name} | €${p.price} ${badge}`);
    });
    total += products.length;
  }
  
  console.log('\n' + '='.repeat(60));
  console.log(`📊 Totale prodotti: ${total}`);
  console.log(`🏷️ Tag affiliato: ${CONFIG.affiliateTag}`);
  console.log('='.repeat(60) + '\n');
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
🛒 FishandTips Product Matcher
==============================

Uso:
  node scripts/product-matcher.js "keyword"          # Trova prodotti per keyword
  node scripts/product-matcher.js --report           # Mostra report prodotti
  node scripts/product-matcher.js --category <cat>   # Prodotti per categoria

Esempi:
  node scripts/product-matcher.js "canna surfcasting principianti"
  node scripts/product-matcher.js "mulinello spinning spigola"
  node scripts/product-matcher.js --category canne_surfcasting
  node scripts/product-matcher.js --report
`);
    return;
  }
  
  if (args[0] === '--report') {
    printProductsReport();
    return;
  }
  
  if (args[0] === '--category' && args[1]) {
    const products = getProductsByCategory(args[1]);
    console.log(`\nProdotti per categoria "${args[1]}":`);
    products.forEach(p => console.log(`  - ${p.name} | €${p.price}`));
    return;
  }
  
  // Ricerca per keyword
  const keyword = args.join(' ');
  await matchProducts(keyword);
}

main();

