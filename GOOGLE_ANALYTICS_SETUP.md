# 🎯 Configurazione Google Analytics

## 📋 Prerequisiti

1. **Account Google Analytics** (gratuito)
2. **Proprietà GA4** configurata
3. **ID di misurazione** (formato: G-XXXXXXXXXX)

## 🔧 Passi per la Configurazione

### 1. Crea una Proprietà Google Analytics

1. Vai su [Google Analytics](https://analytics.google.com/)
2. Clicca "Inizia a misurare"
3. Inserisci i dettagli del tuo account
4. Crea una nuova proprietà per FishandTips
5. Seleziona "Web" come piattaforma
6. Inserisci i dettagli del sito:
   - **Nome sito**: FishandTips
   - **URL**: https://fishandtips.it
   - **Categoria**: Sport
   - **Fuso orario**: Europe/Rome

### 2. Ottieni l'ID di Misurazione

1. Nella proprietà creata, vai su "Amministrazione"
2. Nella colonna "Proprietà", clicca "Dati di flusso"
3. Copia l'ID di misurazione (es: G-XXXXXXXXXX)

### 3. Configura le Variabili d'Ambiente

Crea un file `.env.local` nella root del progetto:

```bash
# Google Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX

# Altre variabili...
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your-api-token
DATABASE_URL="file:./dev.db"
RESEND_API_KEY=your-resend-api-key
```

**⚠️ IMPORTANTE**: Sostituisci `G-XXXXXXXXXX` con il tuo vero ID di misurazione!

### 4. Testa la Configurazione

1. Riavvia il server di sviluppo:
   ```bash
   npm run dev
   ```

2. Apri il sito e accetta i cookie
3. Vai su Google Analytics → Tempo reale
4. Verifica che il traffico venga registrato

## 🍪 Gestione del Consenso Cookie

Il sito è configurato per rispettare il GDPR:

- **Default**: Analytics disabilitato
- **"Solo Essenziali"**: Analytics rimane disabilitato
- **"Accetta Tutti"**: Analytics viene abilitato

## 📊 Eventi Personalizzati

Il sito traccia automaticamente:

- **Consenso cookie**: `cookie_consent`
- **Iscrizione newsletter**: `newsletter_signup`
- **Visualizzazione articoli**: `article_view`

## 🔍 Verifica del Funzionamento

### Console del Browser
Apri gli strumenti di sviluppo e verifica:
```javascript
// Dovrebbe restituire la funzione gtag
console.log(window.gtag);

// Dovrebbe mostrare l'ID di misurazione
console.log(window.dataLayer);
```

### Google Analytics
1. Vai su "Tempo reale" → "Panoramica"
2. Visita il sito da un altro dispositivo
3. Verifica che la visita appaia in tempo reale

## 🚀 Deploy

Per il deploy in produzione:

1. **Vercel**: Aggiungi la variabile `NEXT_PUBLIC_GA_MEASUREMENT_ID` nelle impostazioni del progetto
2. **Netlify**: Aggiungi la variabile nelle impostazioni di ambiente
3. **Altri hosting**: Configura la variabile d'ambiente secondo la documentazione

## 📈 Metriche Importanti

Una volta configurato, potrai monitorare:

- **Utenti attivi**: Numero di visitatori
- **Pagine più viste**: Quali articoli sono più popolari
- **Fonte del traffico**: Da dove arrivano i visitatori
- **Comportamento**: Come navigano nel sito
- **Conversioni**: Iscrizioni newsletter

## 🆘 Risoluzione Problemi

### Analytics non funziona
1. Verifica che l'ID sia corretto
2. Controlla che la variabile d'ambiente sia impostata
3. Verifica che i cookie siano accettati

### Duplicazione dei dati
1. Verifica che non ci siano script duplicati
2. Controlla che il consenso sia gestito correttamente

### Problemi di privacy
1. Il sito rispetta il GDPR di default
2. Analytics è disabilitato finché l'utente non accetta
3. I dati sono anonimizzati

---

**🎯 Il tuo Google Analytics è ora configurato e pronto per tracciare il successo di FishandTips!**


