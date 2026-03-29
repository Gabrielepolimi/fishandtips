/**
 * Invalida la cache CDN Vercel tramite API ufficiale "invalidate-by-tags".
 *
 * L'endpoint legacy /v1/edge-cache/purge con { urls: [...] } non esiste più → 404.
 * Docs: https://vercel.com/docs/rest-api/reference/endpoints/edge-cache/invalidate-by-tags
 *
 * Variabili:
 *   VERCEL_TOKEN (obbligatorio) — https://vercel.com/account/tokens
 *   VERCEL_PROJECT_ID_OR_NAME — nome o id progetto (default: fishandtips)
 *   VERCEL_TEAM_ID — opzionale, se il progetto è sotto un team
 *   CACHE_TAGS — tag separati da virgola (default: * = tutto il progetto in prod)
 *   CACHE_TARGET — production | preview (default: production)
 *
 * Uso:
 *   VERCEL_TOKEN=xxx node scripts/purge-vercel-cache.js
 *
 * Equivalente CLI: vercel cache invalidate --tag '*' --scope production
 */

const VERCEL_TOKEN = process.env.VERCEL_TOKEN;
const PROJECT = process.env.VERCEL_PROJECT_ID_OR_NAME || 'fishandtips';
const TEAM_ID = process.env.VERCEL_TEAM_ID;
const TAGS_RAW = process.env.CACHE_TAGS || '*';
const TARGET = process.env.CACHE_TARGET || 'production';

async function invalidateByTags() {
  if (!VERCEL_TOKEN) {
    console.error(
      'Manca VERCEL_TOKEN. Crealo su Vercel → Account Settings → Tokens, poi:\n' +
        '  VERCEL_TOKEN=xxx node scripts/purge-vercel-cache.js'
    );
    process.exit(1);
  }

  const tags = TAGS_RAW.split(',')
    .map((t) => t.trim())
    .filter(Boolean);

  const params = new URLSearchParams();
  params.set('projectIdOrName', PROJECT);
  if (TEAM_ID) {
    params.set('teamId', TEAM_ID);
  }

  const apiUrl = `https://api.vercel.com/v1/edge-cache/invalidate-by-tags?${params.toString()}`;

  console.log(`POST ${apiUrl}`);
  console.log(`Body: tags=${JSON.stringify(tags)}, target=${TARGET}`);

  const res = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${VERCEL_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tags,
      target: TARGET,
    }),
  });

  let data;
  const text = await res.text();
  try {
    data = JSON.parse(text);
  } catch {
    data = { raw: text };
  }

  console.log('Status:', res.status, JSON.stringify(data));

  if (!res.ok) {
    console.error(
      '\nSe vedi 401/403: controlla il token e i permessi "Cache purging".\n' +
        'Se vedi 404 sul progetto: imposta VERCEL_PROJECT_ID_OR_NAME al nome/id esatto del progetto in Vercel.\n' +
        'Se il progetto è in team: imposta VERCEL_TEAM_ID (Team Settings → Team ID).'
    );
    process.exit(1);
  }
}

invalidateByTags().catch((err) => {
  console.error(err);
  process.exit(1);
});
