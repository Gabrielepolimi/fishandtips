import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createTestUser() {
  try {
    // Hash della password
    const hashedPassword = await bcrypt.hash('password123', 12);

    // Crea utente
    const user = await prisma.user.create({
      data: {
        firstName: 'Mario',
        lastName: 'Rossi',
        email: 'mario.rossi@example.com',
        password: hashedPassword,
        experience: 'intermediate',
        isActive: true,
        emailVerified: true,
        preferences: {
          create: {
            newsletterFrequency: 'weekly',
            preferredContent: 'all',
            language: 'it',
            timezone: 'Europe/Rome'
          }
        },
        interests: {
          create: {
            techniques: JSON.stringify(['spinning', 'fly_fishing']),
            targetSpecies: JSON.stringify(['trota', 'persico']),
            environments: JSON.stringify(['fiume', 'lago']),
            gearTypes: JSON.stringify(['canna', 'mulinello']),
            seasons: JSON.stringify(['spring', 'summer'])
          }
        },
        location: {
          create: {
            region: 'Lombardia',
            province: 'MI',
            city: 'Milano',
            latitude: 45.4642,
            longitude: 9.1900
          }
        },
        notifications: {
          create: {
            email: true,
            push: false,
            weeklyDigest: true,
            newArticles: true,
            seasonalTips: true,
            gearDeals: false
          }
        }
      },
      include: {
        preferences: true,
        interests: true,
        location: true,
        notifications: true
      }
    });

    console.log('✅ Utente di test creato con successo!');
    console.log('📧 Email:', user.email);
    console.log('🔑 Password: password123');
    console.log('🆔 ID:', user.id);

  } catch (error: any) {
    if (error.code === 'P2002') {
      console.log('⚠️  Utente già esistente');
      console.log('📧 Email: mario.rossi@example.com');
      console.log('🔑 Password: password123');
    } else {
      console.error('❌ Errore durante la creazione:', error);
    }
  } finally {
    await prisma.$disconnect();
  }
}

createTestUser();
