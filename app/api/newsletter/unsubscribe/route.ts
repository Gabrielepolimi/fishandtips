import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    // Validazione
    if (!email) {
      return NextResponse.json(
        { error: 'Email obbligatoria' },
        { status: 400 }
      );
    }

    // Trova l'utente
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      return NextResponse.json(
        { error: 'Email non trovata' },
        { status: 404 }
      );
    }

    // Disiscrivi l'utente
    await prisma.user.update({
      where: { email },
      data: {
        newsletterSubscribed: false
      }
    });

    // Log dell'attività
    await prisma.userActivity.create({
      data: {
        userId: user.id,
        action: 'newsletter_unsubscription',
        details: 'Disiscritto dalla newsletter'
      }
    });

    return NextResponse.json(
      { message: 'Disiscrizione completata con successo' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Errore durante la disiscrizione dalla newsletter:', error);
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
