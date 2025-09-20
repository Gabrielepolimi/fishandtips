# 🚀 Guida Deploy FishandTips.it

## 📋 Prerequisiti

- ✅ Account Vercel (gratuito)
- ✅ Dominio fishandtips.it su GoDaddy
- ✅ Repository Git (GitHub, GitLab, Bitbucket)
- ✅ Google Analytics configurato

## 🔧 Deploy su Vercel

### 1. Prepara il Repository

1. **Crea un repository Git** (se non l'hai già):
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tuousername/fishandtips.git
   git push -u origin main
   ```

2. **Verifica che tutti i file siano presenti**:
   - ✅ `package.json`
   - ✅ `next.config.js`
   - ✅ `vercel.json`
   - ✅ `.env.local` (non committare questo file)

### 2. Deploy su Vercel

1. **Vai su [Vercel](https://vercel.com/)**
2. **Clicca "New Project"**
3. **Importa il repository** da GitHub/GitLab
4. **Configura il progetto**:
   - **Framework Preset**: Next.js (dovrebbe essere rilevato automaticamente)
   - **Root Directory**: `./` (lasciare vuoto)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Clicca "Deploy"**

### 3. Configura le Variabili d'Ambiente

Nelle impostazioni del progetto Vercel, vai su "Environment Variables" e aggiungi:

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-TUOIDREALE

# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=tuo-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=tuo-api-token

# Database (per Vercel Postgres o simile)
DATABASE_URL=tuo-database-url

# Email (Resend)
RESEND_API_KEY=tuo-resend-api-key
```

**⚠️ IMPORTANTE**: Sostituisci tutti i valori con quelli reali!

### 4. Riavvia il Deploy

Dopo aver configurato le variabili:
1. Vai su "Deployments"
2. Clicca "Redeploy" sull'ultimo deploy
3. Verifica che tutto funzioni

## 🌐 Configurazione Dominio GoDaddy

### 1. Ottieni i Nameserver di Vercel

1. In Vercel, vai su "Settings" → "Domains"
2. Aggiungi il dominio: `fishandtips.it`
3. Vercel ti fornirà i nameserver da configurare

### 2. Configura GoDaddy

1. **Accedi a GoDaddy**
2. **Vai su "Domains"** → Trova `fishandtips.it`
3. **Clicca "Manage"**
4. **Vai su "Nameservers"**
5. **Seleziona "Change"**
6. **Scegli "I'll use my own nameservers"**
7. **Aggiungi i nameserver di Vercel**:
   ```
   ns1.vercel-dns.com
   ns2.vercel-dns.com
   ns3.vercel-dns.com
   ns4.vercel-dns.com
   ns5.vercel-dns.com
   ```
8. **Salva le modifiche**

### 3. Verifica la Configurazione

1. **Aspetta 24-48 ore** per la propagazione DNS
2. **Verifica su [whatsmydns.net](https://whatsmydns.net/)**
3. **Testa il sito**: https://fishandtips.it

## 🔒 SSL e Sicurezza

Vercel fornisce automaticamente:
- ✅ **SSL gratuito** (Let's Encrypt)
- ✅ **HTTPS forzato**
- ✅ **HSTS headers**
- ✅ **Security headers** (configurati in vercel.json)

## 📊 Monitoraggio

### 1. Vercel Analytics
- Vai su "Analytics" nel dashboard Vercel
- Monitora performance e errori

### 2. Google Analytics
- Verifica che funzioni su https://fishandtips.it
- Controlla i dati in tempo reale

### 3. Uptime Monitoring
- Considera servizi come UptimeRobot (gratuito)
- Monitora la disponibilità del sito

## 🚀 Ottimizzazioni Post-Deploy

### 1. Performance
- ✅ **Vercel Edge Network**: Automatico
- ✅ **Image Optimization**: Next.js automatico
- ✅ **Code Splitting**: Automatico

### 2. SEO
- ✅ **Sitemap**: https://fishandtips.it/sitemap.xml
- ✅ **RSS Feed**: https://fishandtips.it/feed.xml
- ✅ **Robots.txt**: https://fishandtips.it/robots.txt

### 3. PWA
- ✅ **Manifest**: https://fishandtips.it/manifest.json
- ✅ **Service Worker**: Configurato

## 🆘 Troubleshooting

### Dominio non funziona
1. Verifica i nameserver su GoDaddy
2. Aspetta 24-48 ore per la propagazione
3. Usa [whatsmydns.net](https://whatsmydns.net/) per verificare

### Build fallisce
1. Controlla i log di build su Vercel
2. Verifica le variabili d'ambiente
3. Testa localmente con `npm run build`

### Analytics non funziona
1. Verifica l'ID di Google Analytics
2. Controlla che i cookie siano accettati
3. Verifica la console del browser

## 📈 Prossimi Passi

1. **Configura backup automatici** del database
2. **Imposta monitoraggio uptime**
3. **Configura email professionali** (info@fishandtips.it)
4. **Ottimizza per Core Web Vitals**
5. **Configura backup Sanity**

---

**🎯 Il tuo sito FishandTips.it sarà online e pronto per conquistare il mondo della pesca!**








