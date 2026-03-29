/**
 * Invalida la cache edge CDN Vercel per URL specifici.
 *
 * Richiede: VERCEL_TOKEN (https://vercel.com/account/tokens)
 * Opzionale: VERCEL_TEAM_ID se il progetto è sotto un team
 *
 * Uso: VERCEL_TOKEN=xxx node scripts/purge-vercel-cache.js
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const TEAM_ID = process.env.VERCEL_TEAM_ID;

const urls = [
  'https://fishandtips.it/articoli',
  'https://fishandtips.it/pesci-mediterraneo',
  'https://fishandtips.it/calendario-pesca',
  'https://fishandtips.it/spot-pesca-italia',
];

async function purgeCache() {
  if (!VERCEL_TOKEN) {
    console.error(
      'Manca VERCEL_TOKEN. Crealo su Vercel → Account Settings → Tokens, poi:\n' +
        '  VERCEL_TOKEN=xxx node scripts/purge-vercel-cache.js'
    );
    process.exit(1);
  }

  let apiUrl = 'https://api.vercel.com/v1/edge-cache/purge';
  if (TEAM_ID) {
    apiUrl += `?teamId=${encodeURIComponent(TEAM_ID)}`;
  }

  for (const url of urls) {
    console.log(`Purging: ${url}`);
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: [url] }),
    });
    let data;
    try {
      data = await res.json();
    } catch {
      data = { raw: await res.text() };
    }
    console.log(url, res.status, JSON.stringify(data));
  }
}

purgeCache().catch((err) => {
  console.error(err);
  process.exit(1);
});
