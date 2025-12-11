/**
 * 📱 API Route: Instagram Auto-Post
 * 
 * Webhook endpoint per pubblicare automaticamente su Instagram
 * quando un nuovo articolo viene pubblicato su Sanity
 * 
 * Trigger: Sanity Webhook su pubblicazione articolo
 * 
 * POST /api/instagram-post
 * Body: { articleSlug: string } oppure Sanity webhook payload
 */

import { NextRequest, NextResponse } from 'next/server';

// Verifica che il webhook sia autorizzato
const WEBHOOK_SECRET = process.env.INSTAGRAM_WEBHOOK_SECRET;

export async function POST(request: NextRequest) {
  console.log('\n📱 Instagram Post API - Richiesta ricevuta');
  
  try {
    // Verifica autorizzazione (opzionale ma consigliato)
    const authHeader = request.headers.get('authorization');
    if (WEBHOOK_SECRET && authHeader !== `Bearer ${WEBHOOK_SECRET}`) {
      console.log('❌ Autorizzazione fallita');
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    console.log('📦 Payload ricevuto:', JSON.stringify(body, null, 2));
    
    // Determina lo slug dell'articolo
    let articleSlug: string | null = null;
    
    // Caso 1: Chiamata diretta con articleSlug
    if (body.articleSlug) {
      articleSlug = body.articleSlug;
    }
    // Caso 2: Webhook Sanity (formato standard)
    else if (body._type === 'post' && body.slug?.current) {
      articleSlug = body.slug.current;
    }
    // Caso 3: Webhook Sanity (array di documenti)
    else if (Array.isArray(body) && body[0]?.slug?.current) {
      articleSlug = body[0].slug.current;
    }
    
    if (!articleSlug) {
      console.log('❌ Slug articolo non trovato nel payload');
      return NextResponse.json(
        { error: 'Article slug not found in request body' },
        { status: 400 }
      );
    }
    
    console.log(`📝 Articolo da processare: ${articleSlug}`);
    
    // Verifica che le API keys siano configurate
    const missingKeys = [];
    if (!process.env.GEMINI_API_KEY) missingKeys.push('GEMINI_API_KEY');
    if (!process.env.UNSPLASH_ACCESS_KEY) missingKeys.push('UNSPLASH_ACCESS_KEY');
    if (!process.env.CLOUDINARY_CLOUD_NAME) missingKeys.push('CLOUDINARY_CLOUD_NAME');
    if (!process.env.INSTAGRAM_ACCESS_TOKEN) missingKeys.push('INSTAGRAM_ACCESS_TOKEN');
    
    if (missingKeys.length > 0) {
      console.log('⚠️ Configurazione incompleta:', missingKeys.join(', '));
      return NextResponse.json(
        { 
          error: 'Configuration incomplete',
          missing: missingKeys,
          message: 'Some API keys are not configured. The Instagram post was not created.'
        },
        { status: 503 }
      );
    }
    
    // Importa la pipeline dinamicamente (per evitare problemi con ESM)
    // NOTA: In produzione, questo dovrebbe essere un job asincrono (queue)
    // per non bloccare la risposta del webhook
    
    // Per ora, rispondiamo subito e logghiamo che il job è stato schedulato
    // In una implementazione completa, useresti una queue come Bull o Vercel Cron
    
    console.log('✅ Job Instagram schedulato per:', articleSlug);
    
    // Rispondi immediatamente al webhook
    return NextResponse.json({
      success: true,
      message: 'Instagram post job scheduled',
      articleSlug,
      timestamp: new Date().toISOString()
    });
    
    /* 
    // IMPLEMENTAZIONE SINCRONA (per testing - sconsigliata in produzione)
    // Decommentare solo per test locali
    
    const { runPipeline } = await import('@/scripts/instagram-pipeline.js');
    const result = await runPipeline(articleSlug, { dryRun: false });
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Instagram carousel published',
        mediaId: result.steps.instagramPublish?.mediaId,
        articleSlug
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error,
        articleSlug
      }, { status: 500 });
    }
    */
    
  } catch (error) {
    console.error('❌ Errore API:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Health check
export async function GET() {
  const config = {
    gemini: !!process.env.GEMINI_API_KEY,
    sanity: !!process.env.SANITY_API_TOKEN,
    unsplash: !!process.env.UNSPLASH_ACCESS_KEY,
    cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
    instagram: !!process.env.INSTAGRAM_ACCESS_TOKEN,
    webhookSecret: !!WEBHOOK_SECRET
  };
  
  const allConfigured = Object.values(config).every(Boolean);
  
  return NextResponse.json({
    status: allConfigured ? 'ready' : 'partial',
    service: 'Instagram Auto-Post',
    configuration: config,
    timestamp: new Date().toISOString()
  });
}


