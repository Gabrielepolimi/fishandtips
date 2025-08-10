import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from './prisma';
import { verifyPassword } from './utils/userUtils';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        console.log('🔍 Tentativo di login per:', credentials?.email);
        
        if (!credentials?.email || !credentials?.password) {
          console.log('❌ Credenziali mancanti');
          return null;
        }

        try {
          // Trova utente nel database
          const user = await prisma.user.findUnique({
            where: {
              email: credentials.email.toLowerCase().trim()
            },
            include: {
              preferences: true,
              interests: true,
              location: true,
              notifications: true
            }
          });

          if (!user) {
            console.log('❌ Utente non trovato');
            return null;
          }

          console.log('✅ Utente trovato:', user.email);

          // Verifica password
          const isPasswordValid = await verifyPassword(credentials.password, user.password);
          console.log('🔐 Password valida:', isPasswordValid);
          
          if (!isPasswordValid) {
            console.log('❌ Password non valida');
            return null;
          }

          // Controlla se utente è attivo
          if (!user.isActive) {
            console.log('❌ Utente non attivo');
            return null;
          }

          // Aggiorna lastLogin
          await prisma.user.update({
            where: { id: user.id },
            data: { lastLogin: new Date() }
          });

          // Registra attività
          await prisma.userActivity.create({
            data: {
              userId: user.id,
              action: 'login',
              metadata: JSON.stringify({
                ip: 'unknown',
                userAgent: 'unknown'
              })
            }
          });

          // Rimuovi password e restituisci dati utente
          const { password, ...userWithoutPassword } = user;
          
          return {
            id: user.id,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
            experience: user.experience,
            preferences: user.preferences,
            interests: user.interests,
            location: user.location,
            notifications: user.notifications,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin
          };
        } catch (error) {
          console.error('Errore autenticazione:', error);
          return null;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 giorni
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.experience = user.experience;
        token.preferences = user.preferences;
        token.interests = user.interests;
        token.location = user.location;
        token.notifications = user.notifications;
        token.createdAt = user.createdAt;
        token.lastLogin = user.lastLogin;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.firstName = token.firstName as string;
        session.user.lastName = token.lastName as string;
        session.user.experience = token.experience as string;
        session.user.preferences = token.preferences as any;
        session.user.interests = token.interests as any;
        session.user.location = token.location as any;
        session.user.notifications = token.notifications as any;
        session.user.createdAt = token.createdAt as string;
        session.user.lastLogin = token.lastLogin as string;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  secret: process.env.NEXTAUTH_SECRET || 'your-secret-key-change-in-production'
};
