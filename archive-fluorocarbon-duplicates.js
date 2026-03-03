/**
 * Archivia su Sanity i duplicati fluorocarbon (status → archived).
 * Resta pubblicata solo la guida unica: fluorocarbon-guida-definitiva-alla-scelta-perfetta
 *
 * Uso: SANITY_API_TOKEN=xxx node archive-fluorocarbon-duplicates.js
 */

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const CANONICAL_SLUG = 'fluorocarbon-guida-definitiva-alla-scelta-perfetta';

async function archiveFluorocarbonDuplicates() {
  if (!process.env.SANITY_API_TOKEN) {
    console.error('❌ Imposta SANITY_API_TOKEN (es. export SANITY_API_TOKEN=sk...)');
    process.exit(1);
  }

  console.log('🔍 Cerco articoli fluorocarbon in Sanity...\n');

  const posts = await client.fetch(`
    *[_type == "post" && (title match *[fF]luorocarbon* || slug.current match *fluorocarbon*)] {
      _id,
      title,
      "slug": slug.current,
      status
    }
  `);

  if (posts.length === 0) {
    console.log('Nessun articolo fluorocarbon trovato.');
    return;
  }

  console.log(`Trovati ${posts.length} articoli:\n`);
  posts.forEach((p) => console.log(`   - ${p.slug} | ${p.title} | status: ${p.status}`));

  const toArchive = posts.filter((p) => p.slug !== CANONICAL_SLUG);
  const canonical = posts.find((p) => p.slug === CANONICAL_SLUG);

  if (!canonical) {
    console.log(`\n⚠️ Nessun articolo con slug "${CANONICAL_SLUG}".`);
    console.log('   Archiviare comunque tutti? (aggiungi CANONICAL_SLUG in Sanity e riesegui dopo.)');
    console.log('   Per archiviare tutti i trovati, decommenta il blocco sotto in script.\n');
    return;
  }

  console.log(`\n✅ Guida unica da tenere: ${canonical.title} (${canonical.slug})`);
  console.log(`📦 Da archiviare: ${toArchive.length} articoli\n`);

  for (const post of toArchive) {
    try {
      await client.patch(post._id).set({ status: 'archived' }).commit();
      console.log(`   ✅ Archiviato: ${post.slug}`);
    } catch (err) {
      console.error(`   ❌ ${post.slug}: ${err.message}`);
    }
  }

  console.log('\n🎉 Operazione completata. I redirect 301 (vercel.json) portano tutti alla guida unica.');
}

archiveFluorocarbonDuplicates().catch((err) => {
  console.error(err);
  process.exit(1);
});
