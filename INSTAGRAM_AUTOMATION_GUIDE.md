# 📱 FishandTips - Guida Instagram Automation

## 🎯 Panoramica

Sistema automatico per pubblicare carousel Instagram dai tuoi articoli Sanity.

```
Articolo Sanity → AI Gemini → Foto Unsplash → Immagini PNG → Cloudinary → Instagram
```

---

## 🔧 SETUP (Da fare UNA volta)

### Step 1: Account Instagram Business

1. Apri Instagram → **Impostazioni** → **Account**
2. **Passa a un account professionale** → Scegli **Business**
3. Segui le istruzioni per collegare a Facebook

### Step 2: Pagina Facebook

1. Vai su [facebook.com/pages/create](https://facebook.com/pages/create)
2. Crea: "FishandTips - Pesca Sportiva"
3. Categoria: "Sport e tempo libero"
4. Collega a Instagram (nelle impostazioni IG)

### Step 3: Facebook Developer App

1. Vai su [developers.facebook.com](https://developers.facebook.com)
2. **Crea App** → **Business** → "FishandTips Bot"
3. Aggiungi prodotto: **Instagram Graph API**
4. **Impostazioni** → Copia **App ID** e **App Secret**
5. Vai in **Instagram Graph API** → **Token Generator**
6. Genera token con permessi: `instagram_content_publish`, `instagram_basic`
7. Copia il **Access Token**

### Step 4: Unsplash Developer

1. Vai su [unsplash.com/developers](https://unsplash.com/developers)
2. Registrati → **New Application**
3. Nome: "FishandTips"
4. Copia **Access Key**

### Step 5: Cloudinary

1. Vai su [cloudinary.com](https://cloudinary.com) → Registrati (gratis)
2. Dashboard → Copia:
   - **Cloud Name**
   - **API Key**
   - **API Secret**

### Step 6: Configura variabili ambiente

Aggiungi al tuo `.env.local`:

```env
# Instagram (da Facebook Developer)
INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxx
INSTAGRAM_ACCOUNT_ID=17841400000000000

# Unsplash
UNSPLASH_ACCESS_KEY=xxxxxxxxxxxxx

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=xxxxxxxxxxxxxxxxx

# Webhook Secret (opzionale, per sicurezza)
INSTAGRAM_WEBHOOK_SECRET=tuo-secret-random
```

---

## 🧪 TESTARE IL SISTEMA

### Test 1: Verifica configurazione

```bash
# Verifica Unsplash
node scripts/unsplash-service.js --test

# Verifica Cloudinary
node scripts/cloudinary-service.js --test

# Verifica Instagram
node scripts/instagram-api.js --test
```

### Test 2: Genera carousel di prova

```bash
# Con articolo di test (non pubblica)
node scripts/instagram-pipeline.js --test

# Con articolo reale (dry run - non pubblica)
node scripts/instagram-pipeline.js "slug-tuo-articolo" --dry-run
```

### Test 3: Pubblicazione reale

```bash
# Pubblica su Instagram
node scripts/instagram-pipeline.js "slug-tuo-articolo"
```

---

## 🚀 AUTOMAZIONE

### Opzione A: Manuale (via CLI)

```bash
node scripts/instagram-pipeline.js "come-pescare-la-spigola"
```

### Opzione B: Webhook Sanity (Automatico)

1. Vai su [sanity.io/manage](https://sanity.io/manage) → Progetto → **API** → **Webhooks**
2. Crea webhook:
   - **Name**: Instagram Auto-Post
   - **URL**: `https://fishandtips.it/api/instagram-post`
   - **Trigger**: On Create
   - **Filter**: `_type == "post" && status == "published"`
   - **HTTP method**: POST
   - **Headers**: `Authorization: Bearer TUO_WEBHOOK_SECRET`

---

## 📁 FILE CREATI

| File | Descrizione |
|------|-------------|
| `scripts/instagram-carousel-generator.js` | AI genera contenuto carousel |
| `scripts/unsplash-service.js` | Cerca foto su Unsplash |
| `scripts/carousel-templates.js` | Template HTML per slide |
| `scripts/image-generator.js` | Converte HTML → PNG |
| `scripts/cloudinary-service.js` | Upload immagini |
| `scripts/instagram-api.js` | Pubblica su Instagram |
| `scripts/instagram-pipeline.js` | Pipeline completa |
| `app/api/instagram-post/route.ts` | Webhook endpoint |

---

## 📊 OUTPUT ESEMPIO

Quando pubblichi un articolo, il sistema:

1. **Genera 7 slide** con AI (hook + 5 content + CTA)
2. **Cerca 7 foto** su Unsplash
3. **Crea 7 immagini** PNG 1080x1350
4. **Upload** su Cloudinary
5. **Pubblica** carousel su Instagram

**Caption generata:**
```
5 errori che UCCIDONO le tue pescate a surfcasting 🎣❌

Quanti ne fai? Sii onesto nei commenti! 👇

💾 Salva questo post - ti servirà sulla spiaggia!
📖 Guida completa → Link in bio

#surfcasting #pescaitalia #spigola #orata ...
```

---

## ⚠️ LIMITI E NOTE

| Aspetto | Limite |
|---------|--------|
| Unsplash | 50 req/ora, 5000/mese |
| Cloudinary | 25GB storage, 25GB bandwidth/mese |
| Instagram | 25 post/giorno |
| Gemini | 15 req/minuto (free) |

---

## 🐛 TROUBLESHOOTING

### "GEMINI_API_KEY non configurata"
→ Verifica `.env.local` e riavvia il terminale

### "Instagram API Error"
→ Il token potrebbe essere scaduto. Rigenera su Facebook Developer

### "Cloudinary upload failed"
→ Verifica le credenziali e lo spazio disponibile

### Immagini non generate
→ Verifica che Puppeteer sia installato: `npm install puppeteer`

---

## 📞 SUPPORTO

File di log salvati in: `data/instagram-output/`

Per debug completo:
```bash
DEBUG=* node scripts/instagram-pipeline.js "slug"
```

