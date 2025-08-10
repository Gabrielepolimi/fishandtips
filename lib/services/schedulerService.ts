import cron from 'node-cron';
import { EmailService } from './emailService';
import { prisma } from '../prisma';

export class SchedulerService {
  private static isInitialized = false;

  // Inizializza tutti i job di scheduling
  static initialize() {
    if (this.isInitialized) {
      console.log('Scheduler già inizializzato');
      return;
    }

    console.log('🚀 Inizializzazione scheduler newsletter...');

    // Newsletter settimanale (ogni lunedì alle 9:00)
    cron.schedule('0 9 * * 1', async () => {
      console.log('📧 Invio newsletter settimanale...');
      await this.sendWeeklyNewsletter();
    }, {
      timezone: 'Europe/Rome'
    });

    // Newsletter bisettimanale (ogni lunedì e giovedì alle 9:00)
    cron.schedule('0 9 * * 1,4', async () => {
      console.log('📧 Invio newsletter bisettimanale...');
      await this.sendBiweeklyNewsletter();
    }, {
      timezone: 'Europe/Rome'
    });

    // Newsletter mensile (primo del mese alle 9:00)
    cron.schedule('0 9 1 * *', async () => {
      console.log('📧 Invio newsletter mensile...');
      await this.sendMonthlyNewsletter();
    }, {
      timezone: 'Europe/Rome'
    });

    // Pulizia log attività (ogni domenica alle 2:00)
    cron.schedule('0 2 * * 0', async () => {
      console.log('🧹 Pulizia log attività...');
      await this.cleanupActivityLogs();
    }, {
      timezone: 'Europe/Rome'
    });

    this.isInitialized = true;
    console.log('✅ Scheduler inizializzato con successo');
  }

  // Invia newsletter settimanale
  private static async sendWeeklyNewsletter() {
    try {
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          emailVerified: true,
          notifications: {
            email: true,
            weeklyDigest: true
          },
          preferences: {
            newsletterFrequency: 'weekly'
          }
        }
      });

      console.log(`📧 Invio newsletter settimanale a ${users.length} utenti`);

      let success = 0;
      let failed = 0;

      for (const user of users) {
        try {
          const result = await EmailService.sendPersonalizedNewsletter(user.id);
          if (result) {
            success++;
          } else {
            failed++;
          }

          // Pausa tra le email
          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Errore invio a ${user.email}:`, error);
          failed++;
        }
      }

      // Registra statistiche
      await prisma.userActivity.create({
        data: {
          userId: 'system',
          action: 'newsletter_weekly_sent',
          metadata: JSON.stringify({
            totalUsers: users.length,
            success,
            failed,
            timestamp: new Date().toISOString()
          })
        }
      });

      console.log(`✅ Newsletter settimanale completata: ${success} successi, ${failed} fallimenti`);

    } catch (error) {
      console.error('❌ Errore newsletter settimanale:', error);
    }
  }

  // Invia newsletter bisettimanale
  private static async sendBiweeklyNewsletter() {
    try {
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          emailVerified: true,
          notifications: {
            email: true,
            weeklyDigest: true
          },
          preferences: {
            newsletterFrequency: 'biweekly'
          }
        }
      });

      console.log(`📧 Invio newsletter bisettimanale a ${users.length} utenti`);

      let success = 0;
      let failed = 0;

      for (const user of users) {
        try {
          const result = await EmailService.sendPersonalizedNewsletter(user.id);
          if (result) {
            success++;
          } else {
            failed++;
          }

          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Errore invio a ${user.email}:`, error);
          failed++;
        }
      }

      await prisma.userActivity.create({
        data: {
          userId: 'system',
          action: 'newsletter_biweekly_sent',
          metadata: JSON.stringify({
            totalUsers: users.length,
            success,
            failed,
            timestamp: new Date().toISOString()
          })
        }
      });

      console.log(`✅ Newsletter bisettimanale completata: ${success} successi, ${failed} fallimenti`);

    } catch (error) {
      console.error('❌ Errore newsletter bisettimanale:', error);
    }
  }

  // Invia newsletter mensile
  private static async sendMonthlyNewsletter() {
    try {
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          emailVerified: true,
          notifications: {
            email: true,
            weeklyDigest: true
          },
          preferences: {
            newsletterFrequency: 'monthly'
          }
        }
      });

      console.log(`📧 Invio newsletter mensile a ${users.length} utenti`);

      let success = 0;
      let failed = 0;

      for (const user of users) {
        try {
          const result = await EmailService.sendPersonalizedNewsletter(user.id);
          if (result) {
            success++;
          } else {
            failed++;
          }

          await new Promise(resolve => setTimeout(resolve, 200));
        } catch (error) {
          console.error(`Errore invio a ${user.email}:`, error);
          failed++;
        }
      }

      await prisma.userActivity.create({
        data: {
          userId: 'system',
          action: 'newsletter_monthly_sent',
          metadata: JSON.stringify({
            totalUsers: users.length,
            success,
            failed,
            timestamp: new Date().toISOString()
          })
        }
      });

      console.log(`✅ Newsletter mensile completata: ${success} successi, ${failed} fallimenti`);

    } catch (error) {
      console.error('❌ Errore newsletter mensile:', error);
    }
  }

  // Pulizia log attività (mantiene solo ultimi 90 giorni)
  private static async cleanupActivityLogs() {
    try {
      const ninetyDaysAgo = new Date();
      ninetyDaysAgo.setDate(ninetyDaysAgo.getDate() - 90);

      const result = await prisma.userActivity.deleteMany({
        where: {
          createdAt: {
            lt: ninetyDaysAgo
          }
        }
      });

      console.log(`🧹 Puliti ${result.count} log attività vecchi`);

    } catch (error) {
      console.error('❌ Errore pulizia log:', error);
    }
  }

  // Metodo per testare manualmente l'invio
  static async testScheduler() {
    console.log('🧪 Test scheduler...');
    
    try {
      // Test newsletter settimanale
      await this.sendWeeklyNewsletter();
      
      console.log('✅ Test scheduler completato');
      return true;
    } catch (error) {
      console.error('❌ Errore test scheduler:', error);
      return false;
    }
  }

  // Ottieni statistiche scheduler
  static async getSchedulerStats() {
    try {
      const stats = await prisma.userActivity.findMany({
        where: {
          action: {
            in: ['newsletter_weekly_sent', 'newsletter_biweekly_sent', 'newsletter_monthly_sent']
          }
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 10
      });

      return stats.map(stat => ({
        action: stat.action,
        metadata: JSON.parse(stat.metadata || '{}'),
        createdAt: stat.createdAt
      }));

    } catch (error) {
      console.error('Errore recupero statistiche scheduler:', error);
      return [];
    }
  }
}
