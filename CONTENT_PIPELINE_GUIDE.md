# 🎣 FishandTips - Content Pipeline AI

Guida completa per la generazione automatica di contenuti con AI e monetizzazione tramite Amazon Affiliates.

## 📋 Indice

1. [Setup Iniziale](#setup-iniziale)
2. [Generazione Articoli](#generazione-articoli)
3. [Keyword Research](#keyword-research)
4. [Prodotti Affiliati](#prodotti-affiliati)
5. [Automazione](#automazione)
6. [Workflow Settimanale](#workflow-settimanale)
7. [Troubleshooting](#troubleshooting)

---

## 🚀 Setup Iniziale

### Prerequisiti

1. **Node.js 18+** installato
2. **Account Google AI Studio** per Gemini API (gratuito)
3. **Account Sanity** con token Editor
4. **Account Amazon Affiliates Italia** (opzionale ma consigliato)

### Configurazione Variabili Ambiente

Crea il file `.env.local` nella cartella `fishandtips/`:

```bash
# Google Gemini API Key (GRATUITO)
# Ottieni da: https://aistudio.google.com/apikey
GEMINI_API_KEY=your-gemini-api-key

# Sanity API Token (con permessi EDITOR)
# Ottieni da: https://sanity.io/manage -> Progetto -> API -> Tokens
SANITY_API_TOKEN=your-sanity-token

# Amazon Affiliates Tag
# Ottieni dopo registrazione su: https://programma-affiliazione.amazon.it/
AMAZON_AFFILIATE_TAG=fishandtips-21
```

### Installazione Dipendenze

```bash
cd fishandtips
npm install @google/generative-ai
```

### Verifica Setup

```bash
# Verifica che Sanity sia accessibile
node -e "
const { createClient } = require('@sanity/client');
const client = createClient({
  projectId: '3nnnl6gi',
  dataset: 'production',
  apiVersion: '2024-08-10',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN
});
client.fetch('*[_type==\"author\"][0]').then(console.log);
"
```

---

## 📝 Generazione Articoli

### Generazione Singolo Articolo

```bash
# Sintassi base
node scripts/ai-content-generator.js "keyword" [categoria]

# Esempi
node scripts/ai-content-generator.js "migliori esche per spigola" "attrezzature"
node scripts/ai-content-generator.js "come pescare il sarago a bolognese" "tecniche-di-pesca"
node scripts/ai-content-generator.js "pesca notturna sicurezza consigli" "consigli"
```

### Categorie Disponibili

| Slug | Descrizione |
|------|-------------|
| `tecniche-di-pesca` | Surfcasting, spinning, bolognese, eging, etc. |
| `attrezzature` | Canne, mulinelli, esche, accessori |
| `consigli` | Tips, sicurezza, meteo, normative |
| `spot-di-pesca` | Località (generiche, no coordinate precise) |

### Output

L'articolo viene creato in Sanity come **BOZZA** (`status: draft`).
Lo script fornisce il link diretto per la modifica:

```
🔗 Modifica su Sanity Studio:
   https://fishandtips.sanity.studio/structure/post;abc123
```

---

## 🔍 Keyword Research

### Generazione Keyword Automatica

```bash
# Keyword generiche stagionali
node scripts/keyword-finder.js

# Focus su una nicchia specifica
node scripts/keyword-finder.js --focus surfcasting

# Solo keyword commerciali (per affiliazioni)
node scripts/keyword-finder.js --commercial

# Salva risultati + genera piano settimanale
node scripts/keyword-finder.js --save --plan
```

### Interpretazione Output

| Campo | Significato |
|-------|-------------|
| `intent: commercial` | Utente pronto a comprare |
| `intent: informational` | Utente cerca informazioni |
| `difficulty: low` | Facile posizionarsi |
| `affiliatePotential: high` | Alto potenziale guadagno |

### Strategia Consigliata

- **70% keyword commerciali** (generano revenue)
- **30% keyword informative** (generano traffico)
- Priorità a difficoltà `low` o `medium`
- Focus su keyword stagionali per massima rilevanza

---

## 🛒 Prodotti Affiliati

### Database Prodotti

I prodotti sono salvati in `data/affiliate-products.json`.

```bash
# Visualizza report prodotti
node scripts/product-matcher.js --report

# Trova prodotti per una keyword
node scripts/product-matcher.js "canna surfcasting principianti"

# Prodotti per categoria
node scripts/product-matcher.js --category canne_surfcasting
```

### Aggiungere Nuovi Prodotti

Modifica `data/affiliate-products.json`:

```json
{
  "id": "id-univoco",
  "name": "Nome Prodotto Completo",
  "brand": "Marca",
  "price": 99.99,
  "asin": "B08XYZ1234",  // Opzionale: ASIN Amazon
  "searchQuery": "query per trovarlo su amazon",
  "experienceLevel": "beginner|intermediate|expert",
  "badge": "best-value|pro-choice|beginner-friendly|best-seller",
  "quickReview": "Recensione in 2-3 frasi",
  "tags": ["surfcasting", "principianti", "economica"]
}
```

### Badge Prodotti

| Badge | Quando Usarlo |
|-------|---------------|
| `best-value` | Miglior rapporto qualità/prezzo |
| `pro-choice` | Scelto dai professionisti |
| `beginner-friendly` | Ideale per principianti |
| `best-seller` | Molto venduto |
| `budget-friendly` | Economico |

---

## ⚙️ Automazione

### Generazione Batch Manuale

```bash
# Genera 3 articoli (default)
node scripts/generate-weekly-batch.js

# Genera 5 articoli
node scripts/generate-weekly-batch.js --count 5

# Dry run (vedi keyword senza creare)
node scripts/generate-weekly-batch.js --dry-run

# Usa file keyword personalizzato
node scripts/generate-weekly-batch.js --file keywords-2024-12-06.json
```

### GitHub Actions (Automazione Cloud)

Il workflow `.github/workflows/content-generation.yml` esegue:

- **Martedì, Giovedì, Sabato alle 9:00**: Genera 2 articoli
- **Esecuzione manuale**: Dal tab Actions di GitHub

#### Setup GitHub Secrets

1. Vai su GitHub → Repository → Settings → Secrets → Actions
2. Aggiungi:
   - `GEMINI_API_KEY`
   - `SANITY_API_TOKEN`
   - `AMAZON_AFFILIATE_TAG`

#### Esecuzione Manuale

1. Vai su GitHub → Actions → "AI Content Generation"
2. Clicca "Run workflow"
3. Seleziona numero articoli e opzioni

---

## 📅 Workflow Settimanale Consigliato

### Lunedì (15 min)
```bash
# 1. Genera keyword per la settimana
node scripts/keyword-finder.js --save --plan

# 2. Rivedi le keyword e seleziona le migliori
```

### Martedì-Giovedì (Automatico o 30 min)
```bash
# Se manuale:
node scripts/generate-weekly-batch.js --count 2

# Se automatico: GitHub Actions si occupa di tutto
```

### Venerdì-Sabato (1-2 ore)
1. Apri Sanity Studio
2. Rivedi le bozze generate:
   - ✅ Controlla accuratezza informazioni
   - ✅ Aggiungi tocco personale
   - ✅ Verifica link affiliati funzionanti
   - ✅ Aggiungi immagine principale
3. Cambia status da `draft` a `published`

### Domenica (15 min)
- Controlla Google Analytics
- Verifica click su link affiliati
- Annota cosa funziona meglio

---

## 📊 Checklist Pubblicazione Articolo

- [ ] Titolo ≤ 60 caratteri
- [ ] Excerpt ≤ 160 caratteri, accattivante
- [ ] Contenuto accurato e verificato
- [ ] Almeno 3-5 prodotti con link affiliati
- [ ] Immagine principale aggiunta
- [ ] Categoria corretta selezionata
- [ ] SEO keywords presenti
- [ ] Link affiliati funzionanti
- [ ] Status cambiato in `published`

---

## 🔧 Troubleshooting

### Errore: "GEMINI_API_KEY non configurata"

```bash
# Verifica la variabile
echo $GEMINI_API_KEY

# Su Mac/Linux, aggiungi a ~/.zshrc o ~/.bashrc:
export GEMINI_API_KEY="your-api-key-here"

# Oppure crea .env.local nella cartella fishandtips
```

### Errore: "Nessun autore trovato in Sanity"

Crea almeno un autore in Sanity Studio prima di generare articoli.

### Errore: "Risposta non in formato JSON"

L'AI ha generato una risposta malformata. Riprova:
```bash
node scripts/ai-content-generator.js "stessa keyword"
```

### Rate Limiting Gemini

Gemini gratuito ha limite di 15 richieste/minuto. Lo script include pause automatiche di 5 secondi tra gli articoli.

### Articoli Duplicati

Lo script controlla automaticamente se uno slug esiste già e aggiunge un timestamp per renderlo unico.

---

## 📈 Metriche da Monitorare

| Metrica | Target Mese 1 | Target Mese 6 |
|---------|---------------|---------------|
| Articoli pubblicati | 15-20 | 100+ |
| Traffico mensile | 500-1000 | 10000+ |
| Click affiliati | 50-100 | 1000+ |
| Revenue affiliati | €0-50 | €200-500 |

---

## 📚 File di Riferimento

| File | Descrizione |
|------|-------------|
| `scripts/ai-content-generator.js` | Generatore articoli principale |
| `scripts/keyword-finder.js` | Ricerca keyword |
| `scripts/product-matcher.js` | Abbinamento prodotti |
| `scripts/generate-weekly-batch.js` | Generazione batch |
| `scripts/sanity-helpers.js` | Utility Sanity |
| `data/keyword-niches.json` | Database nicchie |
| `data/affiliate-products.json` | Database prodotti |
| `data/generation-log.json` | Log generazioni |

---

## 🆘 Supporto

Per problemi o domande:
1. Controlla i log in `data/generation-log.json`
2. Verifica le variabili ambiente
3. Consulta questa guida

---

*Ultima modifica: Dicembre 2024*

