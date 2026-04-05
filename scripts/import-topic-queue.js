/**
 * Import topic queue: crea documenti approvedTopic in Sanity a partire da JSON o da file .xlsx
 *
 * Prerequisiti:
 * - Schema approvedTopic aggiunto in Sanity Studio (vedi docs/SANITY_SCHEMA_approvedTopic.md)
 * - SANITY_API_TOKEN con permessi di scrittura
 *
 * Uso: node scripts/import-topic-queue.js
 *      node scripts/import-topic-queue.js --file data/topic-queue-50.json
 *      node scripts/import-topic-queue.js --file /path/to/fishandtips_topic_queue_50.xlsx
 *
 * Formato xlsx: colonne title (o keyword), categorySlug (o category), seasonHint (opzionale).
 */

import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '3nnnl6gi',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});

const defaultPath = path.join(__dirname, '..', 'data', 'topic-queue-100.json');

/** Restituisce il valore di una chiave con possibili varianti (header xlsx con spazi/varianti) */
function getCell(row, ...keys) {
  for (const k of keys) {
    if (row[k] !== undefined && row[k] !== null && String(row[k]).trim() !== '') {
      return String(row[k]).trim();
    }
  }
  const exact = keys.find((k) => Object.prototype.hasOwnProperty.call(row, k));
  return exact != null ? String(row[exact]).trim() : '';
}

/** Verifica se la riga ha un numero nella colonna # (esclude righe separatrici di categoria) */
function hasRowNumber(row) {
  const numVal = getCell(row, '#', 'Num', 'N', 'n');
  if (!numVal) return false;
  const n = Number(numVal);
  return Number.isFinite(n) && n >= 0;
}

/** Esclude righe che sono intestazioni di categoria (es. "SPECIE TARGET — ...") */
function isCategorySeparatorRow(title) {
  if (!title || title.length < 3) return true;
  const t = title.toUpperCase();
  if (/^SPECIE\s|^SPOT\s|^STAGIONALI\s|^ATTREZZATURA\s|^TECNICHE\s|^GUIDE\s/i.test(t)) return true;
  if (t.includes(' — ') && t.length < 80) return true; // riga tipo "CATEGORIA — ..."
  return false;
}

/** Legge topic da file .xlsx: colonne "Topic / Keyword", "Categoria Sanity", "Stagione Pubblicazione". Solo righe con # numerico. */
async function readTopicsFromXlsx(filePath) {
  const XLSX = await import('xlsx').catch(() => null);
  if (!XLSX) {
    throw new Error('Per leggere .xlsx installa: npm i xlsx');
  }
  const buf = fs.readFileSync(filePath);
  const wb = XLSX.read(buf, { type: 'buffer' });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = XLSX.utils.sheet_to_json(sheet);
  const out = [];
  for (const row of rows) {
    if (!hasRowNumber(row)) continue;
    const title = getCell(row, 'Topic / Keyword', 'Topic/Keyword', 'Topic', 'keyword', 'title');
    if (!title || isCategorySeparatorRow(title)) continue;
    const categoryRaw = getCell(row, 'Categoria Sanity', 'Categoria', 'categorySlug', 'category', 'categoria');
    const categorySlug = categoryRaw
      ? categoryRaw.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
      : 'consigli';
    const seasonHint = getCell(row, 'Stagione Pubblicazione', 'Stagione', 'seasonHint', 'season', 'stagione');
    const priorityRaw = getCell(row, 'Priorità', 'Priority', 'priority', 'Priorita');
    const priority = priorityRaw ? Number(priorityRaw) : 3;
    out.push({ title, categorySlug, seasonHint, priority });
  }
  return out;
}

async function importTopicQueue() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Imposta SANITY_API_TOKEN');
    process.exit(1);
  }

  const filePath = process.argv.includes('--file') && process.argv[process.argv.indexOf('--file') + 1]
    ? path.resolve(process.argv[process.argv.indexOf('--file') + 1])
    : defaultPath;

  if (!fs.existsSync(filePath)) {
    console.error(`❌ File non trovato: ${filePath}`);
    process.exit(1);
  }

  let topics;
  if (filePath.toLowerCase().endsWith('.xlsx')) {
    topics = await readTopicsFromXlsx(filePath);
  } else {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);
    topics = data.topics || data;
  }

  if (!Array.isArray(topics) || topics.length === 0) {
    console.error('❌ Nessun topic in "topics" nel file JSON');
    process.exit(1);
  }

  // Evita duplicati: carica titoli già presenti
  let existingTitles = new Set();
  try {
    const existing = await client.fetch(
      `*[_type == "approvedTopic"]{ "title": title }`
    );
    existingTitles = new Set((existing || []).map((d) => (d.title || '').trim()).filter(Boolean));
    if (existingTitles.size > 0) {
      console.log(`📌 Già presenti ${existingTitles.size} topic in Sanity; i duplicati verranno saltati.\n`);
    }
  } catch (e) {
    console.warn('⚠️ Impossibile caricare topic esistenti:', e.message);
  }

  console.log(`\n📋 Import di ${topics.length} topic in Sanity (approvedTopic)...\n`);

  let created = 0;
  let skipped = 0;
  let errors = 0;

  for (let i = 0; i < topics.length; i++) {
    const t = topics[i];
    const title = (t.title || t.keyword || '').trim();
    const categorySlug = t.categorySlug || t.category || 'consigli';
    const seasonHint = t.seasonHint || '';
    const priority = t.priority ? Number(t.priority) : 3;

    if (!title) {
      console.warn(`   ⚠️ [${i + 1}] Topic senza title, skip`);
      errors++;
      continue;
    }

    if (existingTitles.has(title)) {
      skipped++;
      console.log(`   ⏭️ [${i + 1}/${topics.length}] Già presente: "${title.substring(0, 45)}..."`);
      continue;
    }

    try {
      await client.create({
        _type: 'approvedTopic',
        title,
        categorySlug,
        priority,
        used: false,
        ...(seasonHint && { seasonHint }),
        createdAt: new Date().toISOString()
      });
      created++;
      existingTitles.add(title);
      console.log(`   ✅ [${i + 1}/${topics.length}] ${title.substring(0, 50)}...`);
    } catch (err) {
      console.error(`   ❌ [${i + 1}] ${title.substring(0, 40)}... - ${err.message}`);
      errors++;
    }
  }

  console.log(`\n✅ Creati: ${created} | Saltati (duplicati): ${skipped} | Errori: ${errors}\n`);
}

importTopicQueue().catch((err) => {
  console.error(err);
  process.exit(1);
});
