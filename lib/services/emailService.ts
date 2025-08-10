import { Resend } from 'resend';
import { render } from '@react-email/render';
import NewsletterTemplate from '../../components/email/NewsletterTemplate';
import { getNewsletterArticles, UserPreferences, ScoredArticle } from '../utils/targeting';
import { prisma } from '../prisma';

const resend = new Resend(process.env.RESEND_API_KEY);

export interface NewsletterData {
  userId: string;
  userEmail: string;
  userFirstName: string;
  userLastName: string;
  articles: ScoredArticle[];
  userPreferences: {
    totalInterests: number;
  };
}

export class EmailService {
  // Invia newsletter personalizzata a un utente
  static async sendPersonalizedNewsletter(userId: string): Promise<boolean> {
    try {
      // Recupera dati utente
      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          preferences: true,
          interests: true,
          notifications: true
        }
      });

      if (!user || !user.isActive || !user.notifications?.email) {
        console.log(`Utente ${userId} non attivo o non abilita email`);
        return false;
      }

      // Prepara preferenze utente
      const userPreferences: UserPreferences = {
        interests: {
          techniques: user.interests?.techniques ? JSON.parse(user.interests.techniques) : []
        }
      };

      // Recupera articoli per newsletter
      const articles = await getNewsletterArticles(userPreferences);

      if (articles.length === 0) {
        console.log(`Nessun articolo trovato per utente ${userId}`);
        return false;
      }

      // Prepara dati per il template
      const newsletterData: NewsletterData = {
        userId: user.id,
        userEmail: user.email,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        articles,
        userPreferences: {
          totalInterests: userPreferences.interests.techniques.length
        }
      };

      // Genera HTML email
      const emailHtml = await render(
        NewsletterTemplate({
          userName: `${user.firstName} ${user.lastName}`,
          userFirstName: user.firstName,
          articles: newsletterData.articles,
          userPreferences: newsletterData.userPreferences,
          unsubscribeUrl: `${process.env.NEXTAUTH_URL}/unsubscribe?email=${encodeURIComponent(user.email)}`,
          preferencesUrl: `${process.env.NEXTAUTH_URL}/registrazione?edit=true`
        })
      );

      // Invia email
      const result = await resend.emails.send({
        from: 'FishandTips <onboarding@resend.dev>',
        to: user.email,
        subject: `🎣 ${user.firstName}, ecco i migliori articoli di pesca per te!`,
        html: emailHtml,
        tags: [
          { name: 'category', value: 'newsletter' },
          { name: 'user_id', value: user.id }
        ]
      });

      if (result.error) {
        console.error('Errore invio email:', result.error);
        return false;
      }

      // Registra invio nel database
      await prisma.userActivity.create({
        data: {
          userId: user.id,
          action: 'newsletter_sent',
          metadata: JSON.stringify({
            emailId: result.data?.id,
            articlesCount: articles.length,
            articles: articles.map(a => ({ id: a._id, title: a.title, score: a.score }))
          })
        }
      });

      console.log(`Newsletter inviata con successo a ${user.email}`);
      return true;

    } catch (error) {
      console.error('Errore nel servizio email:', error);
      return false;
    }
  }

  // Invia newsletter a tutti gli utenti abilitati
  static async sendBulkNewsletter(): Promise<{ success: number; failed: number }> {
    try {
      // Recupera tutti gli utenti abilitati per newsletter
      const users = await prisma.user.findMany({
        where: {
          isActive: true,
          emailVerified: true,
          notifications: {
            email: true,
            weeklyDigest: true
          }
        },
        include: {
          preferences: true,
          interests: true,
          notifications: true
        }
      });

      console.log(`Trovati ${users.length} utenti per newsletter`);

      let success = 0;
      let failed = 0;

      // Invia newsletter a ogni utente
      for (const user of users) {
        const result = await this.sendPersonalizedNewsletter(user.id);
        if (result) {
          success++;
        } else {
          failed++;
        }

        // Pausa tra le email per evitare rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      return { success, failed };

    } catch (error) {
      console.error('Errore invio newsletter bulk:', error);
      return { success: 0, failed: 0 };
    }
  }
}
