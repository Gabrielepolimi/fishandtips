# 🔒 Setup Sicuro API Keys - FishandTips

## ⚠️ REGOLE IMPORTANTI

1. **MAI** scrivere API key in file che possono essere committati
2. **MAI** condividere API key in chat, email, o messaggi
3. **SEMPRE** usare GitHub Secrets per CI/CD
4. **SEMPRE** usare .env.local per sviluppo locale

---

## 🔑 Setup Nuovo - API Key Google Gemini

### Step 1: Crea NUOVA API Key

1. Vai su: https://aistudio.google.com/app/apikey
2. **Elimina** tutte le chiavi esistenti (sono compromesse)
3. Clicca "Create API Key"
4. **NON copiare la chiave in nessun file o chat!**

### Step 2: Configura Localmente

Apri il terminale e esegui (sostituisci con la TUA chiave):

```bash
cd /Users/gabrielegiugliano/FishandTips.it/fishandtips

# Modifica .env.local DIRETTAMENTE con un editor
nano .env.local
# oppure
open -e .env.local
```

Poi modifica la riga `GEMINI_API_KEY=` con la nuova chiave.

### Step 3: Configura GitHub Secrets

1. Vai su: https://github.com/Gabrielepolimi/fishandtips/settings/secrets/actions
2. Trova `GEMINI_API_KEY` e clicca "Update"
3. Incolla la nuova chiave
4. Salva

### Step 4: Verifica

```bash
cd /Users/gabrielegiugliano/FishandTips.it/fishandtips
node -e 'console.log("Gemini key configured:", !!process.env.GEMINI_API_KEY)'
```

---

## 🛡️ Protezioni Aggiuntive

### 1. Google Cloud - Restrizioni API Key

Per maggiore sicurezza, puoi limitare la chiave:

1. Vai su: https://console.cloud.google.com/apis/credentials
2. Clicca sulla tua API key
3. In "API restrictions" seleziona "Restrict key"
4. Seleziona SOLO "Generative Language API"
5. In "Application restrictions" puoi limitare per IP o referrer

### 2. Rotazione Periodica

Cambia la chiave ogni 3-6 mesi come best practice.

### 3. Monitoring

Attiva gli alert su Google Cloud per monitorare l'uso anomalo:
- https://console.cloud.google.com/apis/api/generativelanguage.googleapis.com/quotas

---

## 📋 Checklist Secrets GitHub

Verifica che esistano tutti questi secrets:

- [ ] `GEMINI_API_KEY` - Google Generative AI
- [ ] `SANITY_API_TOKEN` - Sanity CMS write access
- [ ] `AMAZON_AFFILIATE_TAG` - es: fishandtips-21
- [ ] `UNSPLASH_ACCESS_KEY` - Unsplash API

URL: https://github.com/Gabrielepolimi/fishandtips/settings/secrets/actions

