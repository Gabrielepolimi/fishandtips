/**
 * 🎭 FishandTips - Content Tones & Styles
 * 
 * Definisce i diversi toni e stili per i carousel Instagram
 * Ogni tono ha prompt specifici per generare contenuti unici
 */

// ===== TONI DISPONIBILI =====
export const TONES = {
  
  // 🎓 ESPERTO AUTOREVOLE
  expert: {
    id: 'expert',
    name: 'Esperto Autorevole',
    emoji: '🎓',
    description: 'Tono professionale e tecnico, genera trust e salvataggi',
    promptModifier: `
      TONO: Esperto e autorevole
      - Usa linguaggio tecnico ma accessibile
      - Cita dati e statistiche quando possibile
      - Sii preciso e dettagliato
      - Trasmetti competenza e affidabilità
      - Evita slang e linguaggio troppo colloquiale
      - Usa termini tecnici della pesca (bolentino, surfcasting, etc.)
      - Esempio: "La tecnica corretta prevede...", "Secondo gli esperti..."
    `,
    hookStyle: 'informativo',
    ctaStyle: 'professionale',
    exampleHooks: [
      'La tecnica definitiva per...',
      'Guida completa:',
      'Tutto quello che devi sapere su...',
      'I fondamenti della pesca a...'
    ]
  },

  // 🤝 AMICO PESCATORE
  friendly: {
    id: 'friendly',
    name: 'Amico Pescatore',
    emoji: '🤝',
    description: 'Tono colloquiale e amichevole, alto engagement',
    promptModifier: `
      TONO: Amichevole e colloquiale
      - Usa "tu" e linguaggio informale
      - Aggiungi espressioni come "raga", "dai", "fidati"
      - Racconta come se parlassi a un amico
      - Usa emoji frequentemente
      - Condividi esperienze personali
      - Sii entusiasta e appassionato
      - Esempio: "Raga, vi svelo il trucco che...", "Fidati, funziona!"
    `,
    hookStyle: 'colloquiale',
    ctaStyle: 'amichevole',
    exampleHooks: [
      'Raga, dovete provare questo!',
      'Vi svelo un segreto...',
      'Okay, parliamoci chiaro:',
      'Amici pescatori, ascoltate!'
    ]
  },

  // 🔥 PROVOCATORIO/CLICKBAIT
  provocative: {
    id: 'provocative',
    name: 'Provocatorio',
    emoji: '🔥',
    description: 'Hook forti e controversi per viralità',
    promptModifier: `
      TONO: Provocatorio e clickbait (ma onesto)
      - Usa affermazioni forti e dirette
      - Crea curiosità con numeri e statistiche shock
      - Metti in discussione credenze comuni
      - Usa parole come "ERRORE", "SBAGLIATO", "VERITÀ"
      - Crea urgenza e FOMO
      - Sii bold ma sempre veritiero
      - Esempio: "Il 90% dei pescatori sbaglia QUESTO", "La verità che nessuno ti dice"
    `,
    hookStyle: 'shock',
    ctaStyle: 'urgente',
    exampleHooks: [
      'Il 90% dei pescatori sbaglia questo!',
      'STOP! Prima di pescare leggi questo',
      'La verità che nessuno ti dice su...',
      'Perché NON prendi pesci (la verità)'
    ]
  },

  // 💫 STORYTELLING EMOTIVO
  storytelling: {
    id: 'storytelling',
    name: 'Storytelling',
    emoji: '💫',
    description: 'Storie emozionanti per connessione emotiva',
    promptModifier: `
      TONO: Storytelling emotivo
      - Racconta una storia coinvolgente
      - Crea atmosfera con descrizioni sensoriali
      - Usa il passato narrativo
      - Includi momenti di tensione e risoluzione
      - Connetti emotivamente con il lettore
      - Evoca nostalgia e passione per la pesca
      - Esempio: "Era l'alba, il mare calmo...", "Ricordo ancora quella mattina..."
    `,
    hookStyle: 'narrativo',
    ctaStyle: 'emotivo',
    exampleHooks: [
      'Era l\'alba, il mare calmo...',
      'Ricordo ancora quella mattina...',
      'La storia di una cattura indimenticabile',
      'Quella volta che tutto sembrava perduto...'
    ]
  },

  // 😂 DIVERTENTE/MEME
  funny: {
    id: 'funny',
    name: 'Divertente',
    emoji: '😂',
    description: 'Umorismo e meme per condivisioni',
    promptModifier: `
      TONO: Divertente e ironico
      - Usa umorismo relatable per pescatori
      - Fai battute sulle situazioni comuni
      - Sii autoironico
      - Usa meme culture e riferimenti pop
      - Crea contenuti condivisibili
      - Non essere offensivo, solo divertente
      - Esempio: "Quando dici 5 minuti e torni dopo 8 ore", "POV: Il pesce che hai perso"
    `,
    hookStyle: 'ironico',
    ctaStyle: 'leggero',
    exampleHooks: [
      'POV: Sei un pescatore e...',
      'Nessuno: ... Pescatori:',
      'Quando dici "solo un\'oretta"...',
      'La mia ragazza vs la mia canna da pesca'
    ]
  }
};

// ===== TIPI DI CONTENUTO =====
export const CONTENT_TYPES = {
  
  // 🎓 TUTORIAL/TIPS
  tutorial: {
    id: 'tutorial',
    name: 'Tutorial/Tips',
    emoji: '🎓',
    description: 'Guide pratiche e consigli tecnici',
    frequency: '3x/settimana',
    objective: 'Valore, salvataggi',
    promptTemplate: `
      Crea un carousel tutorial con 7 slide su: {topic}
      
      STRUTTURA:
      - Slide 1: Hook accattivante con numero di tips/steps
      - Slide 2-6: Un tip/step per slide con spiegazione pratica
      - Slide 7: CTA con salva + segui + link in bio
      
      STILE: Educativo ma non noioso, pratico e actionable
    `,
    recommendedTones: ['expert', 'friendly']
  },

  // 🆚 CONFRONTI
  comparison: {
    id: 'comparison',
    name: 'Confronto',
    emoji: '🆚',
    description: 'Comparazioni tra prodotti, tecniche, esche',
    frequency: '1x/settimana',
    objective: 'Engagement, commenti',
    promptTemplate: `
      Crea un carousel di confronto tra: {item1} vs {item2}
      
      STRUTTURA:
      - Slide 1: "[Item1] vs [Item2]: quale scegliere?"
      - Slide 2: Pro di Item1
      - Slide 3: Contro di Item1
      - Slide 4: Pro di Item2
      - Slide 5: Contro di Item2
      - Slide 6: Verdetto finale con casi d'uso
      - Slide 7: "Tu quale preferisci? Commenta! 👇"
      
      STILE: Obiettivo e imparziale, aiuta nella scelta
    `,
    recommendedTones: ['expert', 'friendly']
  },

  // ❌ ERRORI
  mistakes: {
    id: 'mistakes',
    name: 'Errori da Evitare',
    emoji: '❌',
    description: 'Errori comuni con soluzioni',
    frequency: '1x/settimana',
    objective: 'Viralità, condivisioni',
    promptTemplate: `
      Crea un carousel sugli errori comuni: {topic}
      
      STRUTTURA:
      - Slide 1: "X errori che ROVINANO la tua pesca a [specie/tecnica]"
      - Slide 2-6: Un errore per slide + soluzione corretta
      - Slide 7: "Quanti ne facevi? Commenta il numero! 👇"
      
      STILE: Provocatorio ma educativo, mostra errore E soluzione
    `,
    recommendedTones: ['provocative', 'expert']
  },

  // 🧠 QUIZ
  quiz: {
    id: 'quiz',
    name: 'Quiz Interattivo',
    emoji: '🧠',
    description: 'Quiz e indovinelli per engagement',
    frequency: '1x/settimana',
    objective: 'Engagement altissimo',
    promptTemplate: `
      Crea un carousel quiz su: {topic}
      
      STRUTTURA:
      - Slide 1: "QUIZ: Quanto ne sai di [topic]?" 
      - Slide 2: Domanda 1 (senza risposta visibile)
      - Slide 3: Risposta 1 + spiegazione
      - Slide 4: Domanda 2
      - Slide 5: Risposta 2 + spiegazione
      - Slide 6: Domanda 3 + Risposta
      - Slide 7: "Quante ne hai indovinate? Scrivi il punteggio! 👇"
      
      STILE: Interattivo, educativo, divertente
    `,
    recommendedTones: ['friendly', 'funny']
  },

  // 🏆 TOP/LISTE
  toplist: {
    id: 'toplist',
    name: 'Top 5/Top 10',
    emoji: '🏆',
    description: 'Classifiche e liste',
    frequency: '1x/settimana',
    objective: 'Salvataggi',
    promptTemplate: `
      Crea un carousel classifica: Top {number} {topic}
      
      STRUTTURA:
      - Slide 1: "Top [N] [topic] che devi conoscere"
      - Slide 2-6: Posizioni dalla 5 alla 1 (o simile)
      - Slide 7: "Sei d'accordo? La tua top? 👇"
      
      STILE: Opinioni forti, giustifica le scelte
    `,
    recommendedTones: ['expert', 'provocative']
  },

  // 😂 MEME
  meme: {
    id: 'meme',
    name: 'Meme/Divertente',
    emoji: '😂',
    description: 'Contenuti umoristici e relatable',
    frequency: '2x/settimana',
    objective: 'Reach, condivisioni',
    promptTemplate: `
      Crea un carousel meme/divertente su: {topic}
      
      STRUTTURA:
      - Slide 1: Setup della battuta/situazione
      - Slide 2-6: Sviluppo comico con situazioni relatable
      - Slide 7: "Tagga un amico che fa così! 😂"
      
      STILE: Umoristico, relatable, condivisibile
    `,
    recommendedTones: ['funny', 'friendly']
  },

  // 📖 STORIA
  story: {
    id: 'story',
    name: 'Storia/Esperienza',
    emoji: '📖',
    description: 'Racconti e esperienze personali',
    frequency: '1x/settimana',
    objective: 'Connessione emotiva',
    promptTemplate: `
      Crea un carousel storytelling su: {topic}
      
      STRUTTURA:
      - Slide 1: Hook narrativo che crea curiosità
      - Slide 2-3: Setup della storia, contesto
      - Slide 4-5: Climax, momento di tensione
      - Slide 6: Risoluzione e lezione imparata
      - Slide 7: "Hai vissuto qualcosa di simile? Racconta! 👇"
      
      STILE: Emotivo, coinvolgente, personale
    `,
    recommendedTones: ['storytelling', 'friendly']
  }
};

// ===== HASHTAG SETS =====
export const HASHTAG_SETS = {
  // Hashtag grandi (500k+ post)
  large: [
    'pesca', 'fishing', 'mare', 'sea', 'fish', 'natura', 
    'italia', 'beach', 'sunset', 'ocean'
  ],
  
  // Hashtag medi (50k-500k post)
  medium: [
    'pescasportiva', 'pescaitalia', 'fishinglife', 'pescatore',
    'fisherman', 'pescamare', 'catchandrelease', 'fishingtrip',
    'pescaallaspigola', 'surfcasting', 'spinning', 'bolognese'
  ],
  
  // Hashtag piccoli/nicchia (5k-50k post)
  small: [
    'fishandtips', 'pescaspigola', 'pescaorata', 'surfcastingitalia',
    'spinningitalia', 'pescadallascogliera', 'pescainfranata',
    'pescanotturna', 'pescaalserraglio', 'rockfishingitalia',
    'lightrocksitalia', 'eging', 'ajing', 'pescaalcalamaro'
  ],
  
  // Hashtag per tipo di contenuto
  byContentType: {
    tutorial: ['tutorial', 'howtofishing', 'imparapescare', 'consiglipesca', 'tipspesca'],
    comparison: ['confronto', 'versus', 'recensione', 'test', 'review'],
    mistakes: ['errori', 'sbagli', 'nonfaremai', 'attenzionepescatori'],
    quiz: ['quiz', 'indovinello', 'testpesca', 'quantonesai'],
    meme: ['memepesca', 'pescatoriumorismo', 'fishingmemes', 'lol'],
    story: ['storiepesca', 'raccontidipesca', 'fishingstories', 'cattura']
  }
};

// ===== HELPER FUNCTIONS =====

/**
 * Ottieni un tono casuale
 */
export function getRandomTone() {
  const toneKeys = Object.keys(TONES);
  return TONES[toneKeys[Math.floor(Math.random() * toneKeys.length)]];
}

/**
 * Ottieni tono consigliato per tipo di contenuto
 */
export function getRecommendedTone(contentType) {
  const type = CONTENT_TYPES[contentType];
  if (!type) return TONES.friendly;
  
  const recommendedId = type.recommendedTones[Math.floor(Math.random() * type.recommendedTones.length)];
  return TONES[recommendedId];
}

/**
 * Genera set di hashtag ottimizzato
 */
export function generateHashtagSet(contentType, count = 30) {
  const hashtags = new Set();
  
  // 5 grandi
  const largeCount = 5;
  const shuffledLarge = [...HASHTAG_SETS.large].sort(() => Math.random() - 0.5);
  shuffledLarge.slice(0, largeCount).forEach(h => hashtags.add(h));
  
  // 10 medi
  const mediumCount = 10;
  const shuffledMedium = [...HASHTAG_SETS.medium].sort(() => Math.random() - 0.5);
  shuffledMedium.slice(0, mediumCount).forEach(h => hashtags.add(h));
  
  // 10 piccoli
  const smallCount = 10;
  const shuffledSmall = [...HASHTAG_SETS.small].sort(() => Math.random() - 0.5);
  shuffledSmall.slice(0, smallCount).forEach(h => hashtags.add(h));
  
  // 5 specifici per tipo
  if (contentType && HASHTAG_SETS.byContentType[contentType]) {
    HASHTAG_SETS.byContentType[contentType].forEach(h => hashtags.add(h));
  }
  
  return Array.from(hashtags).slice(0, count);
}

/**
 * Ottieni hook casuale per tono
 */
export function getRandomHook(toneId) {
  const tone = TONES[toneId];
  if (!tone || !tone.exampleHooks) return '';
  return tone.exampleHooks[Math.floor(Math.random() * tone.exampleHooks.length)];
}

export default {
  TONES,
  CONTENT_TYPES,
  HASHTAG_SETS,
  getRandomTone,
  getRecommendedTone,
  generateHashtagSet,
  getRandomHook
};

