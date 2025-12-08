# 📌 Pinterest Automation - FishandTips

Guida completa per l'automazione dei pin Pinterest.

## 📋 Stato Setup

- [x] Account Pinterest Business creato
- [x] App Developer creata (ID: 1539302)
- [ ] Accesso Trial approvato (in attesa)
- [ ] Token di accesso generato
- [x] Script di automazione pronti

## 🔑 Credenziali Necessarie

Quando Pinterest approva l'accesso Trial, dovrai:

1. Generare un **Access Token** dalla dashboard developer
2. Aggiungere questi secrets su GitHub:

| Secret | Descrizione |
|--------|-------------|
| `PINTEREST_ACCESS_TOKEN` | Token di accesso Pinterest |

## 📁 File Creati

| File | Descrizione |
|------|-------------|
| `scripts/pinterest-content-generator.js` | Genera titoli, descrizioni e hashtag ottimizzati |
| `scripts/pinterest-image-generator.js` | Crea immagini verticali 1000x1500 |
| `scripts/pinterest-api.js` | Gestisce le chiamate API Pinterest |
| `scripts/pinterest-pipeline.js` | Pipeline completa di automazione |
| `.github/workflows/pinterest-daily-post.yml` | Workflow GitHub Actions |

## 🚀 Come Usare

### Test Manuale (Dry Run)

```bash
# Testa senza pubblicare
node scripts/pinterest-pipeline.js --latest 3 --dry-run

# Per un articolo specifico
node scripts/pinterest-pipeline.js --article nome-articolo --dry-run
```

### Pubblicazione Reale

```bash
# Pubblica pin per ultimi 3 articoli
node scripts/pinterest-pipeline.js --latest 3

# Pubblica pin per articolo specifico
node scripts/pinterest-pipeline.js --article nome-articolo
```

### Via GitHub Actions

1. Vai su **GitHub** → **Actions** → **📌 Pinterest Daily Pin**
2. Clicca **Run workflow**
3. Scegli le opzioni e avvia

## 📅 Pianificazione Automatica

Il workflow è configurato per:
- **10:00** (ora italiana) - 1 pin
- **19:00** (ora italiana) - 1 pin

= **14 pin a settimana** automatici

## 🎨 Template Pin Disponibili

### 1. Default
- Immagine a tutto schermo
- Testo overlay grande
- Barra brand in basso

### 2. Tips
- Layout verticale con card
- Numero tip in evidenza
- Ideale per consigli

### 3. Spot
- Badge location in alto
- Perfetto per spot di pesca
- Nome località evidenziato

## 📋 Bacheche Consigliate

Crea queste bacheche su Pinterest:

1. **Tecniche di Pesca** - Tutorial e guide
2. **Attrezzatura Pesca** - Recensioni e consigli prodotti
3. **Spot Pesca Italia** - Luoghi dove pescare
4. **Pesci del Mediterraneo** - Schede specie
5. **Consigli Pescatori** - Tips e trucchi

## ⚠️ Limiti Pinterest API

| Limite | Valore |
|--------|--------|
| Pin/giorno (Trial) | 1000 |
| Rate limit | ~100 req/min |
| Dimensione immagine | Max 20MB |

## 🔧 Troubleshooting

### "Token non valido"
- Rigenera il token dalla dashboard Pinterest
- Aggiorna il secret `PINTEREST_ACCESS_TOKEN`

### "Board not found"
- Crea manualmente la bacheca su Pinterest
- Usa lo stesso nome esatto nello script

### Immagini non caricate
- Verifica le credenziali Cloudinary
- L'immagine deve essere su URL pubblico

## 📊 Metriche da Monitorare

- **Impressioni** - Quante volte i pin vengono visti
- **Salvataggi** - Pin salvati da altri utenti
- **Click** - Visite al sito da Pinterest
- **Follower** - Crescita dell'account

## 🎯 Best Practices

1. **Consistenza** - Pubblica regolarmente (2+ pin/giorno)
2. **Orari** - Mattina e sera sono i migliori
3. **Hashtag** - Usa 5-10 hashtag rilevanti
4. **Descrizioni** - Includi keyword SEO
5. **Immagini** - Verticali, alta qualità, testo leggibile

---

## 📞 Prossimi Passi

1. ⏳ Attendi approvazione Trial Pinterest
2. 🔑 Genera Access Token
3. ➕ Aggiungi secret su GitHub
4. 🧪 Testa con `--dry-run`
5. 🚀 Avvia automazione!

