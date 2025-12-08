# 🚀 Setup Automazione Instagram - FishandTips

## Configurazione GitHub Secrets

Per far funzionare l'automazione, devi aggiungere i secrets al tuo repository GitHub.

### Step 1: Vai su GitHub Secrets

1. Vai su **github.com/Gabrielepolimi/fishandtips**
2. Clicca **Settings** (in alto a destra)
3. Nel menu laterale: **Secrets and variables** → **Actions**
4. Clicca **New repository secret**

### Step 2: Aggiungi questi Secrets

Aggiungi TUTTI i seguenti secrets (uno alla volta):

| Nome Secret | Valore |
|-------------|--------|
| `GEMINI_API_KEY` | `AIzaSyC3uj-8_Q1aoy4RiCuiQ-CdY5SzgGVz2-E` |
| `INSTAGRAM_ACCESS_TOKEN` | Il token che inizia con `EAA...` |
| `INSTAGRAM_ACCOUNT_ID` | `17841478179041732` |
| `UNSPLASH_ACCESS_KEY` | `1C1K5dl5iU-voZFFL3Z6J0TH4BQCLMvD_YRiAlahD8E` |
| `CLOUDINARY_CLOUD_NAME` | `dcsh7mqnm` |
| `CLOUDINARY_API_KEY` | `845282621381952` |
| `CLOUDINARY_API_SECRET` | `Ko3GRDuIQH9NwcRwDgJcXr4tmGg` |

### Step 3: Verifica il Workflow

1. Vai su **Actions** nel tuo repository
2. Dovresti vedere **"📱 Instagram Daily Post"**
3. Puoi testarlo cliccando **Run workflow** → **Run workflow**

---

## 📅 Piano Automatico

Il workflow pubblicherà automaticamente:

| Giorno | Orario | Tipo | Tono |
|--------|--------|------|------|
| Lunedì | 07:00 | 🎓 Tutorial | Esperto |
| Martedì | 12:30 | 😂 Meme | Divertente |
| Mercoledì | 19:00 | ❌ Errori | Provocatorio |
| Giovedì | 12:30 | 🧠 Quiz | Amico |
| Venerdì | 07:00 | 🆚 Confronto | Esperto |
| Sabato | 10:00 | 🏆 Top 5 | Amico |
| Domenica | 18:00 | 📖 Storia | Storytelling |

---

## ⚠️ Note Importanti

### Token Instagram
Il token scade dopo **60 giorni**. Quando scade:
1. Vai su [developers.facebook.com/tools/explorer](https://developers.facebook.com/tools/explorer)
2. Rigenera il token con tutte le permission
3. Aggiorna il secret `INSTAGRAM_ACCESS_TOKEN` su GitHub

### Esecuzione Manuale
Puoi pubblicare un post manualmente:
1. Vai su **Actions** → **📱 Instagram Daily Post**
2. Clicca **Run workflow**
3. Scegli tipo, tono e topic
4. Clicca **Run workflow**

### Monitoraggio
- Controlla la tab **Actions** per vedere se i workflow funzionano
- Se fallisce, clicca sul workflow per vedere i log dell'errore

---

## 🔧 Troubleshooting

### Errore: "Token expired"
→ Rigenera il token Instagram e aggiorna il secret

### Errore: "Rate limit"
→ Hai superato i limiti API. Aspetta qualche ora.

### Errore: "Media not found"
→ Problema con Cloudinary. Verifica le credenziali.

### Il workflow non parte
→ Verifica che i secrets siano stati aggiunti correttamente

---

## ✅ Checklist Setup

- [ ] Secret `GEMINI_API_KEY` aggiunto
- [ ] Secret `INSTAGRAM_ACCESS_TOKEN` aggiunto
- [ ] Secret `INSTAGRAM_ACCOUNT_ID` aggiunto
- [ ] Secret `UNSPLASH_ACCESS_KEY` aggiunto
- [ ] Secret `CLOUDINARY_CLOUD_NAME` aggiunto
- [ ] Secret `CLOUDINARY_API_KEY` aggiunto
- [ ] Secret `CLOUDINARY_API_SECRET` aggiunto
- [ ] Test manuale del workflow eseguito con successo

---

**Una volta completato il setup, l'automazione pubblicherà 1 post al giorno automaticamente! 🎉**

