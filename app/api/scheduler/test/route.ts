import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../../lib/auth';
import { SchedulerService } from '../../../../lib/services/schedulerService';

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

    // Solo admin può testare lo scheduler
    if (session.user.email !== 'admin@fishandtips.it') {
      return NextResponse.json(
        { error: 'Accesso negato' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { action } = body;

    let result;

    switch (action) {
      case 'test':
        result = await SchedulerService.testScheduler();
        break;

      case 'stats':
        result = await SchedulerService.getSchedulerStats();
        break;

      default:
        return NextResponse.json(
          { error: 'Azione non valida' },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      result
    });

  } catch (error: any) {
    console.error('Errore test scheduler:', error);
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    const stats = await SchedulerService.getSchedulerStats();

    return NextResponse.json({
      success: true,
      stats,
      message: 'Statistiche scheduler recuperate'
    });

  } catch (error: any) {
    console.error('Errore recupero statistiche scheduler:', error);
    
    return NextResponse.json(
      { error: 'Errore interno del server' },
      { status: 500 }
    );
  }
}
