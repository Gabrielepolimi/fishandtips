import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

interface SpotInfo {
  name: string;
  locality: string;
  region: string;
  description: string;
  environment: string;
  seabed: string;
  depth: string;
  species: { name: string; rating: number; months: number[] }[];
  techniques: { name: string; rating: number; notes: string }[];
  bestBaits: string[];
  bestArtificials: string[];
  bestTime: {
    hours: string;
    tide: string;
    weather: string;
    moon: string;
  };
  tips: string[];
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const monthNames = ['Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno', 'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'];

function buildSystemPrompt(spot: SpotInfo): string {
  const currentMonth = new Date().getMonth();
  const currentMonthName = monthNames[currentMonth];
  
  const speciesInSeason = spot.species
    .filter((s) => s.months.includes(currentMonth + 1))
    .map((s) => s.name);

  const topTechniques = spot.techniques
    .filter((t) => t.rating >= 4)
    .map((t) => `${t.name} (${t.notes})`);

  return `Sei un esperto pescatore locale dello spot "${spot.name}" a ${spot.locality}, ${spot.region}.
Rispondi in italiano come un pescatore amichevole ed esperto che conosce perfettamente questo spot.

INFORMAZIONI SULLO SPOT:
- Nome: ${spot.name}
- Località: ${spot.locality}, ${spot.region}
- Descrizione: ${spot.description}
- Ambiente: ${spot.environment}
- Fondale: ${spot.seabed}
- Profondità: ${spot.depth}

SPECIE PRESENTI (rating 1-5):
${spot.species.map((s) => `- ${s.name} (${s.rating}/5 stelle) - Mesi migliori: ${s.months.map((m) => monthNames[m - 1]).join(', ')}`).join('\n')}

TECNICHE CONSIGLIATE:
${spot.techniques.map((t) => `- ${t.name} (${t.rating}/5): ${t.notes}`).join('\n')}

ESCHE NATURALI: ${spot.bestBaits.join(', ')}
ARTIFICIALI: ${spot.bestArtificials.join(', ') || 'Non consigliati per questo spot'}

MOMENTO MIGLIORE:
- Orario: ${spot.bestTime.hours}
- Marea: ${spot.bestTime.tide}
- Meteo: ${spot.bestTime.weather}
- Luna: ${spot.bestTime.moon}

CONSIGLI LOCALI:
${spot.tips.map((t) => `- ${t}`).join('\n')}

OGGI È: ${currentMonthName}
SPECIE IN STAGIONE ORA: ${speciesInSeason.length > 0 ? speciesInSeason.join(', ') : 'Periodo non ottimale'}
TECNICHE TOP: ${topTechniques.length > 0 ? topTechniques.join(', ') : spot.techniques[0]?.name || 'Varie'}

REGOLE DI RISPOSTA:
1. Rispondi in modo amichevole e colloquiale, come un pescatore esperto
2. Usa emoji occasionalmente per rendere la chat piacevole 🎣🐟
3. Dai consigli specifici basati sulle informazioni dello spot
4. Se ti chiedono di attrezzatura, consiglia prodotti generici (es. "un buon minnow da 10-12cm")
5. Sii conciso ma utile (max 150 parole per risposta)
6. Se non sai qualcosa, ammettilo e dai un consiglio generale
7. Incoraggia il pescatore e augura buona fortuna!
8. Se chiedono del meteo attuale, ricorda che non hai accesso in tempo reale ma dai consigli generali`;
}

export async function POST(request: Request) {
  try {
    const { message, spot, history } = await request.json();

    if (!message || !spot) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // Fallback response if no API key
      return NextResponse.json({
        response: `Ciao! Mi dispiace, l'assistente AI non è configurato al momento. 

Per pescare a ${spot.name}, ti consiglio di:
- Usare ${spot.bestBaits[0] || 'esche naturali'}
- Provare la tecnica ${spot.techniques[0]?.name || 'più adatta'}
- Andare nelle ore ${spot.bestTime.hours}

Buona pesca! 🎣`,
      });
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build conversation history
    const conversationHistory = (history as Message[])
      .map((m) => `${m.role === 'user' ? 'Pescatore' : 'Esperto'}: ${m.content}`)
      .join('\n');

    const prompt = `${buildSystemPrompt(spot)}

${conversationHistory ? `CONVERSAZIONE PRECEDENTE:\n${conversationHistory}\n\n` : ''}
Pescatore: ${message}

Esperto (rispondi in modo amichevole e utile):`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Failed to generate response' },
      { status: 500 }
    );
  }
}

