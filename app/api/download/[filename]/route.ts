import { readFile } from 'fs/promises';
import path from 'path';
import { NextRequest, NextResponse } from 'next/server';

/** PDF consentiti in public/download — whitelist per evitare path traversal */
const ALLOWED_DOWNLOADS: Record<string, { contentType: string; displayName: string }> = {
  'Guida-Taglie-Minime-Pesci-2026-FishandTips.pdf': {
    contentType: 'application/pdf',
    displayName: 'Guida-Taglie-Minime-Pesci-2026-FishandTips.pdf',
  },
};

export const dynamic = 'force-dynamic';

export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;
  const meta = ALLOWED_DOWNLOADS[filename];

  if (!meta) {
    return NextResponse.json({ error: 'File non trovato' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'public', 'download', filename);

  try {
    const buffer = await readFile(filePath);
    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': meta.contentType,
        'Content-Disposition': `inline; filename="${meta.displayName}"`,
        'Cache-Control': 'public, max-age=86400, s-maxage=86400',
      },
    });
  } catch {
    return NextResponse.json({ error: 'File non trovato' }, { status: 404 });
  }
}
