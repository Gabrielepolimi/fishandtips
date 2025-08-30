import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST() {
  try {
    // Forza il refresh della sitemap
    revalidatePath('/sitemap.xml');
    
    return NextResponse.json({
      success: true,
      message: 'Sitemap refresh forzato con successo',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Errore nel refresh sitemap:', error);
    return NextResponse.json({
      success: false,
      message: 'Errore nel refresh sitemap',
      error: error instanceof Error ? error.message : 'Errore sconosciuto'
    }, { status: 500 });
  }
}
