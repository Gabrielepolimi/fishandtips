import { NextRequest, NextResponse } from 'next/server';
import {
  ZONA_PESCA_OPTIONS,
  formatTecnicheForBrevo,
  parseTecnicheInput,
  type GateSubscribePayload,
  type ZonaPesca,
} from '../../../lib/brevo-gate-constants';

const BREVO_LIST_ID = 3;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function parsePayload(body: unknown): GateSubscribePayload | { error: string } {
  if (!body || typeof body !== 'object') {
    return { error: 'Dati non validi.' };
  }

  const raw = body as Record<string, unknown>;
  const email =
    typeof raw.email === 'string' ? raw.email.trim().toLowerCase() : '';
  const nome = typeof raw.nome === 'string' ? raw.nome.trim() : '';
  const zonaPesca = raw.zonaPesca;
  const tecniche = parseTecnicheInput(raw.tecniche ?? raw.tecnica);

  if (!email || !EMAIL_REGEX.test(email)) {
    return { error: 'Inserisci un indirizzo email valido.' };
  }

  if (!nome || nome.length < 2) {
    return { error: 'Inserisci il tuo nome.' };
  }

  if (!ZONA_PESCA_OPTIONS.includes(zonaPesca as ZonaPesca)) {
    return { error: 'Seleziona dove peschi di più.' };
  }

  if (!tecniche) {
    return { error: 'Seleziona almeno una tecnica.' };
  }

  return {
    email,
    nome,
    zonaPesca: zonaPesca as ZonaPesca,
    tecniche,
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const parsed = parsePayload(body);

    if ('error' in parsed) {
      return NextResponse.json({ error: parsed.error }, { status: 400 });
    }

    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      console.error('BREVO_API_KEY non configurata');
      return NextResponse.json(
        { error: 'Servizio temporaneamente non disponibile. Riprova tra poco.' },
        { status: 503 }
      );
    }

    const res = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({
        email: parsed.email,
        attributes: {
          FIRSTNAME: parsed.nome,
          ZONA_PESCA: parsed.zonaPesca,
          TECNICA: formatTecnicheForBrevo(parsed.tecniche),
        },
        listIds: [BREVO_LIST_ID],
        updateEnabled: true,
      }),
    });

    if (res.status === 400) {
      const err = await res.json().catch(() => ({}));
      const message = String(err?.message ?? '').toLowerCase();
      const code = String(err?.code ?? '').toLowerCase();
      if (
        message.includes('already') ||
        message.includes('duplicate') ||
        code.includes('duplicate')
      ) {
        return NextResponse.json({ success: true, alreadySubscribed: true });
      }
    }

    if (!res.ok) {
      console.error('Brevo API error:', res.status, await res.text());
      return NextResponse.json(
        { error: 'Qualcosa è andato storto. Riprova tra poco.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error) {
    console.error('Errore subscribe Brevo:', error);
    return NextResponse.json(
      { error: 'Qualcosa è andato storto. Riprova tra poco.' },
      { status: 500 }
    );
  }
}
