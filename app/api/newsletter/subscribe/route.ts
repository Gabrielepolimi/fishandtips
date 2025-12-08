import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { nome, email, tipiAcqua, regioni, tecniche } = await request.json();

    // Validazione base
    if (!nome || !email || !tipiAcqua || tipiAcqua.length === 0) {
      return NextResponse.json(
        { error: 'Nome, email e tipo di acqua sono obbligatori' },
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

    // Google Sheets Web App URL
    const GOOGLE_SCRIPT_URL = process.env.GOOGLE_SHEETS_WEBHOOK_URL;

    if (!GOOGLE_SCRIPT_URL) {
      console.error('GOOGLE_SHEETS_WEBHOOK_URL non configurato');
      return NextResponse.json(
        { error: 'Servizio temporaneamente non disponibile' },
        { status: 503 }
      );
    }

    // Invia dati a Google Sheets
    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nome,
        email,
        tipiAcqua: tipiAcqua.join(', '),
        regioni: regioni?.join(', ') || '',
        tecniche: tecniche?.join(', ') || '',
        dataIscrizione: new Date().toISOString()
      }),
    });

    if (!response.ok) {
      throw new Error('Errore nel salvataggio dei dati');
    }

    return NextResponse.json(
      { message: 'Iscrizione completata con successo!' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Errore durante l\'iscrizione alla newsletter:', error);
    return NextResponse.json(
      { error: 'Errore durante la registrazione. Riprova.' },
      { status: 500 }
    );
  }
}
