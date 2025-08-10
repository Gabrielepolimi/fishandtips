import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { nome, cognome, email, tecniche } = await request.json();

    // Validazione
    if (!nome || !cognome || !email || !tecniche || tecniche.length === 0) {
      return NextResponse.json(
        { error: 'Tutti i campi sono obbligatori' },
        { status: 400 }
      );
    }

    // Verifica se l'email è già registrata
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email già registrata' },
        { status: 400 }
      );
    }

    // Crea nuovo utente
    const user = await prisma.user.create({
      data: {
        name: `${nome} ${cognome}`,
        email,
        fishingTechniques: JSON.stringify(tecniche),
        newsletterSubscribed: true
      }
    });

    // Log dell'attività
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'newsletter_subscription',
        details: `Iscritto alla newsletter con ${tecniche.length} tecniche selezionate`
      }
    });

    return NextResponse.json(
      { message: 'Iscrizione completata con successo' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Errore durante l\'iscrizione alla newsletter:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
