const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function debugLogin() {
  try {
    const email = 'mario.rossi@example.com';
    const password = 'password123';

    console.log('🔍 Debug Login...');
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);

    // Trova utente
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
      include: {
        preferences: true,
        interests: true,
        location: true,
        notifications: true
      }
    });

    if (!user) {
      console.log('❌ Utente non trovato');
      return;
    }

    console.log('✅ Utente trovato:');
    console.log('   ID:', user.id);
    console.log('   Nome:', user.firstName, user.lastName);
    console.log('   Email:', user.email);
    console.log('   Esperienza:', user.experience);
    console.log('   Attivo:', user.isActive);
    console.log('   Email verificata:', user.emailVerified);

    // Verifica password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('🔐 Password valida:', isPasswordValid);

    if (isPasswordValid) {
      console.log('✅ Login dovrebbe funzionare!');
      
      // Mostra dati utente
      console.log('\n📊 Dati utente:');
      console.log('   Preferenze:', user.preferences);
      console.log('   Interessi:', user.interests);
      console.log('   Localizzazione:', user.location);
      console.log('   Notifiche:', user.notifications);
    } else {
      console.log('❌ Password non valida');
      
      // Test con hash diretto
      const testHash = await bcrypt.hash(password, 12);
      console.log('🔧 Test hash diretto:', await bcrypt.compare(password, testHash));
    }

  } catch (error) {
    console.error('❌ Errore:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugLogin();
