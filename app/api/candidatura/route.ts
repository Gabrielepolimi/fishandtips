import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { nome, attivita, categoria, email, sito, messaggio } = await request.json();

    // Validazione base
    if (!nome || !attivita || !categoria || !email) {
      return NextResponse.json(
        { error: 'Nome, attività, categoria e email sono obbligatori' },
        { status: 400 }
      );
    }

    // Validazione email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }

    // Google Sheets Web App URL per candidature
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_CANDIDATURE_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.error('GOOGLE_SHEETS_CANDIDATURE_URL non configurato');
      // Fallback: usa lo stesso webhook della newsletter se non c'è quello dedicato
      const FALLBACK_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;
      
      if (!FALLBACK_URL) {
        return NextResponse.json(
          { error: 'Servizio temporaneamente non disponibile' },
          { status: 503 }
        );
      }
    }

    const webhookUrl = GOOGLE_SCRIPT_URL || process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    // Invia dati a Google Sheets
    const response = await fetch(webhookUrl!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tipo: 'CANDIDATURA_MIGLIORI_2025',
        nome,
        attivita,
        categoria,
        email,
        sito: sito || '',
        messaggio: messaggio || '',
        dataCandidatura: new Date().toISOString(),
        stato: 'Nuova'
      }),
    });

    if (!response.ok) {
      throw new Error('Errore nel salvataggio dei dati');
    }

    return NextResponse.json(
      { message: 'Candidatura inviata con successo!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Errore durante l\'invio della candidatura:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'invio. Riprova.' },
      { status: 500 }
    );
  }
}

