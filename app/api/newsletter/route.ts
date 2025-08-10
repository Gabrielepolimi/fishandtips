import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Interface per i dati della newsletter
interface NewsletterSubscriber {
  email: string;
  subscribedAt: string;
  ip?: string;
  userAgent?: string;
}

// Funzione per validare email
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Funzione per salvare subscriber nel file JSON
async function saveSubscriber(subscriber: NewsletterSubscriber): Promise<void> {
  const dataPath = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');
  
  try {
    // Crea directory se non esiste
    await fs.mkdir(path.dirname(dataPath), { recursive: true });
    
    // Leggi subscribers esistenti
    let subscribers: NewsletterSubscriber[] = [];
    try {
      const existingData = await fs.readFile(dataPath, 'utf-8');
      subscribers = JSON.parse(existingData);
    } catch (error) {
      // File non esiste, inizia con array vuoto
    }
    
    // Controlla se email già esiste
    const existingSubscriber = subscribers.find(sub => sub.email === subscriber.email);
    if (existingSubscriber) {
      throw new Error('Email già iscritta');
    }
    
    // Aggiungi nuovo subscriber
    subscribers.push(subscriber);
    
    // Salva nel file
    await fs.writeFile(dataPath, JSON.stringify(subscribers, null, 2));
  } catch (error) {
    console.error('Errore nel salvataggio subscriber:', error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;
    
    // Validazione input
    if (!email) {
      return NextResponse.json(
        { error: 'Email richiesta' },
        { status: 400 }
      );
    }
    
    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      );
    }
    
    // Prepara dati subscriber
    const subscriber: NewsletterSubscriber = {
      email: email.toLowerCase().trim(),
      subscribedAt: new Date().toISOString(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown'
    };
    
    // Salva subscriber
    await saveSubscriber(subscriber);
    
    // Log per debugging
    console.log(`Nuovo subscriber: ${subscriber.email}`);
    
    return NextResponse.json(
      { 
        success: true, 
        message: 'Iscrizione completata con successo!',
        email: subscriber.email 
      },
      { status: 200 }
    );
    
  } catch (error: any) {
    console.error('Errore API newsletter:', error);
    
    if (error.message === 'Email già iscritta') {
      return NextResponse.json(
        { error: 'Questa email è già iscritta alla newsletter' },
        { status: 409 }
      );
    }
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// GET per ottenere statistiche (opzionale, per admin)
export async function GET() {
  try {
    const dataPath = path.join(process.cwd(), 'data', 'newsletter-subscribers.json');
    
    try {
      const data = await fs.readFile(dataPath, 'utf-8');
      const subscribers: NewsletterSubscriber[] = JSON.parse(data);
      
      return NextResponse.json({
        total: subscribers.length,
        recent: subscribers.slice(-10) // Ultimi 10
      });
    } catch (error) {
      return NextResponse.json({
        total: 0,
        recent: []
      });
    }
  } catch (error) {
    return NextResponse.json(
      { error: 'Errore nel recupero dati' },
      { status: 500 }
    );
  }
}
