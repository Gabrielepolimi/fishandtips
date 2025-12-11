/**
 * 📅 FishandTips - Weekly Content Planner
 * 
 * Genera automaticamente un piano editoriale settimanale
 * con contenuti diversificati per tono e tipo
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TONES, CONTENT_TYPES } from './content-tones.js';
import { generateAdvancedCarousel } from './advanced-carousel-generator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ===== PIANO EDITORIALE SETTIMANALE =====
const WEEKLY_PLAN = [
  {
    day: 'Lunedì',
    dayNumber: 1,
    contentType: 'tutorial',
    tone: 'expert',
    description: 'Tutorial tecnico per iniziare la settimana',
    bestTime: '07:00'
  },
  {
    day: 'Martedì',
    dayNumber: 2,
    contentType: 'meme',
    tone: 'funny',
    description: 'Contenuto divertente per engagement',
    bestTime: '12:30'
  },
  {
    day: 'Mercoledì',
    dayNumber: 3,
    contentType: 'mistakes',
    tone: 'provocative',
    description: 'Errori comuni - contenuto virale',
    bestTime: '19:00'
  },
  {
    day: 'Giovedì',
    dayNumber: 4,
    contentType: 'quiz',
    tone: 'friendly',
    description: 'Quiz interattivo per engagement',
    bestTime: '12:30'
  },
  {
    day: 'Venerdì',
    dayNumber: 5,
    contentType: 'comparison',
    tone: 'expert',
    description: 'Confronto prodotti/tecniche',
    bestTime: '07:00'
  },
  {
    day: 'Sabato',
    dayNumber: 6,
    contentType: 'toplist',
    tone: 'friendly',
    description: 'Top 5/Lista weekend',
    bestTime: '10:00'
  },
  {
    day: 'Domenica',
    dayNumber: 7,
    contentType: 'story',
    tone: 'storytelling',
    description: 'Storia emotiva per chiudere settimana',
    bestTime: '18:00'
  }
];

// ===== BANCA TOPIC PER TIPO =====
const TOPIC_BANK = {
  tutorial: [
    'Come scegliere la canna da spinning perfetta',
    'Tecniche di lancio per principianti',
    'Nodi da pesca essenziali: guida completa',
    'Come preparare l\'attrezzatura per il surfcasting',
    'Pesca alla bolognese: setup perfetto',
    'Come leggere le maree per pescare meglio',
    'Terminali per la pesca all\'orata',
    'Come scegliere il mulinello giusto',
    'Pesca a fondo dalla scogliera: guida',
    'Come innestare correttamente le esche vive',
    'Montature per la pesca alla spigola',
    'Come pescare in condizioni di mare mosso'
  ],
  
  mistakes: [
    'pesca alla spigola',
    'surfcasting',
    'spinning',
    'pesca all\'orata',
    'scelta del mulinello',
    'uso delle esche artificiali',
    'pesca notturna',
    'pesca dalla scogliera',
    'pesca con il vivo',
    'gestione della canna'
  ],
  
  quiz: [
    'pesci del mediterraneo',
    'tecniche di pesca',
    'nodi da pesca',
    'attrezzatura da pesca',
    'esche naturali',
    'regolamenti pesca sportiva',
    'specie ittiche italiane',
    'mulinelli e canne'
  ],
  
  comparison: {
    items: [
      ['Spinning', 'Surfcasting'],
      ['Mulinello frontale', 'Mulinello a bobina fissa'],
      ['Esche naturali', 'Esche artificiali'],
      ['Canna telescopica', 'Canna in due pezzi'],
      ['Trecciato', 'Nylon'],
      ['Pesca da riva', 'Pesca in barca'],
      ['Alba', 'Tramonto (per pescare)'],
      ['Mare calmo', 'Mare mosso']
    ]
  },
  
  toplist: [
    'esche per la spigola',
    'spot di pesca in Italia',
    'mulinelli sotto i 100€',
    'canne da spinning',
    'pesci più combattivi del mediterraneo',
    'tecniche per principianti',
    'errori che rovinano la giornata di pesca',
    'accessori indispensabili'
  ],
  
  meme: [
    'la vita del pescatore',
    'pescatori vs fidanzate',
    'quando il pesce scappa',
    'la sveglia alle 4 di mattina',
    'il meteo del pescatore',
    'aspettative vs realtà in pesca',
    'quando dici solo 5 minuti',
    'il pescatore e il suo portafoglio'
  ],
  
  story: [
    'La mia prima cattura importante',
    'Quella volta che ho perso il pesce della vita',
    'Una giornata di pesca indimenticabile',
    'Il consiglio del vecchio pescatore',
    'Quando la pesca mi ha insegnato la pazienza',
    'La cattura che non dimenticherò mai',
    'Pesca in tempesta: la mia avventura',
    'Il pesce che mi ha fatto piangere'
  ]
};

/**
 * Seleziona topic casuale dalla banca
 */
function selectTopic(contentType) {
  if (contentType === 'comparison') {
    const items = TOPIC_BANK.comparison.items;
    const selected = items[Math.floor(Math.random() * items.length)];
    return { topic: `${selected[0]} vs ${selected[1]}`, item1: selected[0], item2: selected[1] };
  }
  
  const topics = TOPIC_BANK[contentType] || TOPIC_BANK.tutorial;
  return { topic: topics[Math.floor(Math.random() * topics.length)] };
}

/**
 * Genera piano settimanale con topic
 */
export function generateWeeklyPlan(startDate = new Date()) {
  const plan = [];
  
  WEEKLY_PLAN.forEach((dayPlan, index) => {
    const postDate = new Date(startDate);
    postDate.setDate(startDate.getDate() + index);
    
    const topicData = selectTopic(dayPlan.contentType);
    
    plan.push({
      ...dayPlan,
      date: postDate.toISOString().split('T')[0],
      scheduledTime: `${postDate.toISOString().split('T')[0]}T${dayPlan.bestTime}:00`,
      ...topicData,
      status: 'pending'
    });
  });
  
  return plan;
}

/**
 * Genera tutti i carousel per il piano settimanale
 */
export async function generateWeeklyContent(plan) {
  const results = [];
  
  console.log('\n' + '📅'.repeat(30));
  console.log('GENERAZIONE CONTENUTI SETTIMANALI');
  console.log('📅'.repeat(30));
  console.log(`\n📊 Post da generare: ${plan.length}\n`);
  
  for (let i = 0; i < plan.length; i++) {
    const dayPlan = plan[i];
    
    console.log(`\n${'═'.repeat(60)}`);
    console.log(`📆 ${dayPlan.day} (${dayPlan.date}) - ${dayPlan.bestTime}`);
    console.log(`📊 ${CONTENT_TYPES[dayPlan.contentType]?.emoji || '📝'} ${CONTENT_TYPES[dayPlan.contentType]?.name || dayPlan.contentType}`);
    console.log(`🎭 ${TONES[dayPlan.tone]?.emoji || '🎭'} ${TONES[dayPlan.tone]?.name || dayPlan.tone}`);
    console.log(`📝 ${dayPlan.topic}`);
    console.log('═'.repeat(60));
    
    try {
      const carousel = await generateAdvancedCarousel({
        contentType: dayPlan.contentType,
        topic: dayPlan.topic,
        tone: dayPlan.tone,
        item1: dayPlan.item1,
        item2: dayPlan.item2
      });
      
      results.push({
        ...dayPlan,
        carousel,
        status: 'generated'
      });
      
      console.log(`✅ Generato con successo!`);
      
      // Pausa tra le generazioni per rispettare rate limits
      if (i < plan.length - 1) {
        console.log('⏳ Attesa 5 secondi...');
        await new Promise(r => setTimeout(r, 5000));
      }
      
    } catch (error) {
      console.error(`❌ Errore: ${error.message}`);
      results.push({
        ...dayPlan,
        error: error.message,
        status: 'error'
      });
    }
  }
  
  return results;
}

/**
 * Salva piano settimanale su file
 */
export function savePlan(plan, weekNumber) {
  const outputDir = path.join(__dirname, '..', 'data', 'weekly-plans');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const filename = `week-${weekNumber || new Date().toISOString().split('T')[0]}.json`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, JSON.stringify(plan, null, 2));
  console.log(`\n💾 Piano salvato: ${filepath}`);
  
  return filepath;
}

/**
 * Carica piano esistente
 */
export function loadPlan(filepath) {
  if (!fs.existsSync(filepath)) {
    throw new Error(`File non trovato: ${filepath}`);
  }
  return JSON.parse(fs.readFileSync(filepath, 'utf-8'));
}

/**
 * Visualizza riepilogo piano
 */
export function displayPlanSummary(plan) {
  console.log('\n' + '═'.repeat(70));
  console.log('📅 PIANO EDITORIALE SETTIMANALE');
  console.log('═'.repeat(70));
  
  plan.forEach(day => {
    const typeEmoji = CONTENT_TYPES[day.contentType]?.emoji || '📝';
    const toneEmoji = TONES[day.tone]?.emoji || '🎭';
    const status = day.status === 'generated' ? '✅' : day.status === 'error' ? '❌' : '⏳';
    
    console.log(`\n${status} ${day.day} ${day.date} @ ${day.bestTime}`);
    console.log(`   ${typeEmoji} ${CONTENT_TYPES[day.contentType]?.name || day.contentType}`);
    console.log(`   ${toneEmoji} ${TONES[day.tone]?.name || day.tone}`);
    console.log(`   📝 ${day.topic.substring(0, 50)}${day.topic.length > 50 ? '...' : ''}`);
  });
  
  console.log('\n' + '═'.repeat(70));
  
  const generated = plan.filter(d => d.status === 'generated').length;
  const errors = plan.filter(d => d.status === 'error').length;
  const pending = plan.filter(d => d.status === 'pending').length;
  
  console.log(`\n📊 Riepilogo: ${generated} generati, ${pending} in attesa, ${errors} errori`);
}

// ===== CLI =====
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
📅 FishandTips Weekly Content Planner
======================================

Genera automaticamente un piano editoriale settimanale.

Uso:
  node scripts/weekly-content-planner.js --plan              Mostra piano della settimana
  node scripts/weekly-content-planner.js --generate          Genera tutti i contenuti
  node scripts/weekly-content-planner.js --generate-day <n>  Genera contenuto per giorno specifico (1-7)

Piano settimanale standard:
  Lunedì    - 🎓 Tutorial (Esperto) @ 07:00
  Martedì   - 😂 Meme (Divertente) @ 12:30
  Mercoledì - ❌ Errori (Provocatorio) @ 19:00
  Giovedì   - 🧠 Quiz (Amico) @ 12:30
  Venerdì   - 🆚 Confronto (Esperto) @ 07:00
  Sabato    - 🏆 Top 5 (Amico) @ 10:00
  Domenica  - 📖 Storia (Storytelling) @ 18:00

Esempi:
  node scripts/weekly-content-planner.js --plan
  node scripts/weekly-content-planner.js --generate
  node scripts/weekly-content-planner.js --generate-day 1
`);
    return;
  }
  
  if (args[0] === '--plan') {
    const plan = generateWeeklyPlan();
    displayPlanSummary(plan);
    return;
  }
  
  if (args[0] === '--generate') {
    const plan = generateWeeklyPlan();
    displayPlanSummary(plan);
    
    console.log('\n⏳ Inizio generazione contenuti...\n');
    const results = await generateWeeklyContent(plan);
    
    displayPlanSummary(results);
    savePlan(results);
    
    return;
  }
  
  if (args[0] === '--generate-day') {
    const dayNumber = parseInt(args[1]);
    if (isNaN(dayNumber) || dayNumber < 1 || dayNumber > 7) {
      console.error('❌ Specifica un giorno valido (1-7)');
      return;
    }
    
    const plan = generateWeeklyPlan();
    const dayPlan = plan[dayNumber - 1];
    
    console.log(`\n📆 Generazione contenuto per ${dayPlan.day}...\n`);
    
    const carousel = await generateAdvancedCarousel({
      contentType: dayPlan.contentType,
      topic: dayPlan.topic,
      tone: dayPlan.tone,
      item1: dayPlan.item1,
      item2: dayPlan.item2
    });
    
    console.log('\n✅ Contenuto generato!');
    console.log(`📝 Topic: ${dayPlan.topic}`);
    console.log(`🖼️ Slide: ${carousel.slides.length}`);
    
    return;
  }
  
  console.log('❌ Comando non riconosciuto. Usa --help per aiuto.');
}

main().catch(console.error);

export default {
  WEEKLY_PLAN,
  TOPIC_BANK,
  generateWeeklyPlan,
  generateWeeklyContent,
  savePlan,
  loadPlan,
  displayPlanSummary
};


