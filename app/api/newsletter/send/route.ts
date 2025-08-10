import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { EmailService } from '../../../../lib/services/emailService';

export async function POST(request: NextRequest) {
  try {
    // Verifica sessione
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, userId } = body;

    let result;

    switch (type) {
      case 'personal':
        // Invia newsletter personalizzata all'utente corrente
        result = await EmailService.sendPersonalizedNewsletter(session.user.id);
        break;

      case 'bulk':
        // Invia newsletter a tutti gli utenti (solo admin)
        if (session.user.email !== 'admin@fishandtips.it') {
          return NextResponse.json(
            { error: 'Accesso negato' },
            { status: 403 }
          );
        }
        result = await EmailService.sendBulkNewsletter();
        break;

      case 'welcome':
        // Invia email di benvenuto
        result = await EmailService.sendWelcomeEmail(session.user.id);
        break;

      case 'preferences':
        // Invia email di conferma preferenze
        result = await EmailService.sendPreferencesConfirmation(session.user.id);
        break;

      default:
        return NextResponse.json(
          { error: 'Tipo di email non valido' },
          { status: 400 }
        );
    }

    if (result) {
      return NextResponse.json({
        success: true,
        message: 'Email inviata con successo',
        result
      });
    } else {
      return NextResponse.json(
        { error: 'Errore nell\'invio dell\'email' },
        { status: 500 }
      );
    }

  } catch (error: any) {
    console.error('Errore invio newsletter:', error);
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

// GET per testare l'invio
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const test = searchParams.get('test');

    if (test === 'true') {
      // Test invio newsletter personalizzata
      const result = await EmailService.sendPersonalizedNewsletter(session.user.id);
      
      return NextResponse.json({
        success: result,
        message: result ? 'Newsletter di test inviata' : 'Errore nell\'invio',
        user: {
          id: session.user.id,
          email: session.user.email,
          firstName: session.user.firstName
        }
      });
    }

    return NextResponse.json({
      message: 'API Newsletter funzionante',
      endpoints: {
        'POST /api/newsletter/send': 'Invia newsletter',
        'GET /api/newsletter/send?test=true': 'Test invio newsletter'
      }
    });

  } catch (error: any) {
    console.error('Errore API newsletter:', error);
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
