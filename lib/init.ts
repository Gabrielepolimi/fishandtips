import { SchedulerService } from './services/schedulerService';

// Inizializza tutti i servizi all'avvio
export function initializeServices() {
  console.log('🚀 Inizializzazione servizi FishandTips...');

  // Inizializza scheduler newsletter
  if (process.env.NODE_ENV === 'production') {
    SchedulerService.initialize();
  } else {
    console.log('📧 Scheduler disabilitato in modalità sviluppo');
  }

  console.log('✅ Servizi inizializzati con successo');
}
