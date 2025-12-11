# 🚀 FishandTips Instagram Growth System

## Guida Completa all'Automazione Instagram

Questo sistema automatizza completamente la creazione e pubblicazione di contenuti Instagram per @fish_and_tips_it.

---

## 📋 Indice

1. [Quick Start](#-quick-start)
2. [Tipi di Contenuto](#-tipi-di-contenuto)
3. [Toni Disponibili](#-toni-disponibili)
4. [Piano Editoriale](#-piano-editoriale-settimanale)
5. [Comandi Utili](#-comandi-utili)
6. [Best Practices](#-best-practices)
7. [Troubleshooting](#-troubleshooting)

---

## 🚀 Quick Start

### Pubblica un singolo post

```bash
# Tutorial con tono esperto
node scripts/batch-instagram-poster.js --single --type tutorial --topic "pesca alla spigola" --tone expert

# Errori comuni con tono provocatorio
node scripts/batch-instagram-poster.js --single --type mistakes --topic "surfcasting" --tone provocative

# Test senza pubblicare (dry run)
node scripts/batch-instagram-poster.js --single --type quiz --topic "pesci mediterraneo" --dry-run
```

### Genera un'intera settimana

```bash
# Genera e salva (senza pubblicare)
node scripts/batch-instagram-poster.js --weekly --save-only

# Genera e pubblica tutto
node scripts/batch-instagram-poster.js --weekly

# Test completo senza pubblicare
node scripts/batch-instagram-poster.js --weekly --dry-run
```

---

## 📊 Tipi di Contenuto

### 🎓 Tutorial (tutorial)
**Frequenza consigliata:** 3x/settimana  
**Obiettivo:** Valore, salvataggi  
**Toni consigliati:** expert, friendly

```bash
node scripts/advanced-carousel-generator.js --type tutorial --topic "Come scegliere il mulinello"
```

### 🆚 Confronto (comparison)
**Frequenza consigliata:** 1x/settimana  
**Obiettivo:** Engagement, commenti  
**Toni consigliati:** expert, friendly

```bash
node scripts/advanced-carousel-generator.js --type comparison --item1 "Spinning" --item2 "Surfcasting"
```

### ❌ Errori (mistakes)
**Frequenza consigliata:** 1x/settimana  
**Obiettivo:** Viralità, condivisioni  
**Toni consigliati:** provocative, expert

```bash
node scripts/advanced-carousel-generator.js --type mistakes --topic "pesca alla spigola" --tone provocative
```

### 🧠 Quiz (quiz)
**Frequenza consigliata:** 1x/settimana  
**Obiettivo:** Engagement altissimo  
**Toni consigliati:** friendly, funny

```bash
node scripts/advanced-carousel-generator.js --type quiz --topic "pesci del mediterraneo"
```

### 🏆 Top List (toplist)
**Frequenza consigliata:** 1x/settimana  
**Obiettivo:** Salvataggi  
**Toni consigliati:** expert, provocative

```bash
node scripts/advanced-carousel-generator.js --type toplist --topic "esche per orata" --number 5
```

### 😂 Meme (meme)
**Frequenza consigliata:** 2x/settimana  
**Obiettivo:** Reach, condivisioni  
**Toni consigliati:** funny, friendly

```bash
node scripts/advanced-carousel-generator.js --type meme --topic "pescatori vs fidanzate"
```

### 📖 Storia (story)
**Frequenza consigliata:** 1x/settimana  
**Obiettivo:** Connessione emotiva  
**Toni consigliati:** storytelling, friendly

```bash
node scripts/advanced-carousel-generator.js --type story --topic "La mia prima cattura"
```

---

## 🎭 Toni Disponibili

### 🎓 Esperto (expert)
- Linguaggio tecnico ma accessibile
- Autorevole e affidabile
- Perfetto per tutorial e confronti

### 🤝 Amico (friendly)
- Colloquiale e informale
- Usa "raga", "dai", "fidati"
- Alto engagement

### 🔥 Provocatorio (provocative)
- Hook forti e clickbait
- "Il 90% dei pescatori sbaglia..."
- Massima viralità

### 💫 Storytelling (storytelling)
- Narrativo ed emotivo
- "Era l'alba, il mare calmo..."
- Connessione profonda

### 😂 Divertente (funny)
- Umorismo relatable
- Meme e battute
- Massime condivisioni

---

## 📅 Piano Editoriale Settimanale

Il sistema genera automaticamente un piano bilanciato:

| Giorno | Tipo | Tono | Orario |
|--------|------|------|--------|
| **Lunedì** | 🎓 Tutorial | Esperto | 07:00 |
| **Martedì** | 😂 Meme | Divertente | 12:30 |
| **Mercoledì** | ❌ Errori | Provocatorio | 19:00 |
| **Giovedì** | 🧠 Quiz | Amico | 12:30 |
| **Venerdì** | 🆚 Confronto | Esperto | 07:00 |
| **Sabato** | 🏆 Top 5 | Amico | 10:00 |
| **Domenica** | 📖 Storia | Storytelling | 18:00 |

### Visualizza piano

```bash
node scripts/weekly-content-planner.js --plan
```

### Genera tutti i contenuti

```bash
node scripts/weekly-content-planner.js --generate
```

---

## 💻 Comandi Utili

### Generazione Carousel

```bash
# Genera carousel da articolo Sanity esistente
node scripts/instagram-pipeline.js "slug-articolo"

# Genera carousel avanzato con tipo specifico
node scripts/advanced-carousel-generator.js --type mistakes --topic "pesca notturna" --tone provocative
```

### Piano Settimanale

```bash
# Mostra piano
node scripts/weekly-content-planner.js --plan

# Genera contenuti per la settimana
node scripts/weekly-content-planner.js --generate

# Genera solo un giorno specifico (1-7)
node scripts/weekly-content-planner.js --generate-day 3
```

### Pubblicazione Batch

```bash
# Pubblica singolo post
node scripts/batch-instagram-poster.js --single --type tutorial --topic "spinning" --tone expert

# Workflow settimanale completo
node scripts/batch-instagram-poster.js --weekly

# Solo genera, non pubblica
node scripts/batch-instagram-poster.js --weekly --save-only

# Pubblica da file salvato
node scripts/batch-instagram-poster.js --from-file ./data/weekly-plans/week-2024-01-15.json

# Test senza pubblicare
node scripts/batch-instagram-poster.js --weekly --dry-run
```

---

## 📈 Best Practices

### 1. Mix di Contenuti
- **Varia i tipi**: non pubblicare sempre tutorial
- **Alterna i toni**: provocatorio → amichevole → esperto
- **Bilancia educativo e divertente**: 60% valore, 40% entertainment

### 2. Orari Ottimali
- **Mattina (7-8)**: Tutorial, contenuti informativi
- **Pranzo (12-13)**: Meme, quiz leggeri
- **Sera (18-20)**: Storie, contenuti emotivi

### 3. Hashtag Strategy
Il sistema genera automaticamente:
- 5 hashtag grandi (500k+ post)
- 10 hashtag medi (50k-500k post)
- 15 hashtag piccoli/nicchia (5k-50k post)

### 4. Engagement Tactics
- **Slide 7**: sempre CTA (Salva + Segui + Link bio)
- **Caption**: termina con domanda per commenti
- **Quiz**: chiedi punteggio nei commenti

### 5. Crescita Rapida
- Pubblica **1 post/giorno** minimo
- Rispondi ai commenti entro **1 ora**
- Usa **Stories** per anticipare i carousel
- Fai **cross-posting** su TikTok e Pinterest

---

## ⚠️ Troubleshooting

### Errore: Token Instagram scaduto

```bash
# Il token dura 60 giorni. Rigenera da:
# https://developers.facebook.com/tools/explorer/
# Seleziona tutti i permessi Instagram + Pages
```

### Errore: Rate limit Unsplash

```bash
# Free tier: 50 richieste/ora
# Aspetta 1 ora o usa immagini locali
```

### Errore: Cloudinary quota

```bash
# Free tier: 25GB storage, 25GB bandwidth/mese
# Verifica su cloudinary.com/console
```

### Post non pubblicato

```bash
# Verifica configurazione
node scripts/instagram-api.js --test

# Controlla .env.local:
# - INSTAGRAM_ACCESS_TOKEN (deve iniziare con EAA)
# - INSTAGRAM_ACCOUNT_ID
```

---

## 📁 Struttura File

```
scripts/
├── content-tones.js           # Definizione toni e tipi contenuto
├── advanced-carousel-generator.js  # Generatore avanzato
├── weekly-content-planner.js  # Piano settimanale
├── batch-instagram-poster.js  # Pubblicazione batch
├── instagram-pipeline.js      # Pipeline principale
├── instagram-api.js           # API Instagram
├── unsplash-service.js        # Ricerca foto
├── cloudinary-service.js      # Upload immagini
├── image-generator.js         # Generazione PNG
└── carousel-templates.js      # Template HTML

data/
├── weekly-plans/              # Piani salvati
├── carousel-images/           # Immagini generate
└── instagram-output/          # Log pubblicazioni
```

---

## 🎯 Obiettivi di Crescita

| Periodo | Follower | Post/Settimana | Engagement |
|---------|----------|----------------|------------|
| Mese 1 | 500 | 7 | 5% |
| Mese 3 | 2.000 | 7 | 8% |
| Mese 6 | 10.000 | 10 | 10% |
| Anno 1 | 50.000 | 14 | 12% |

---

## 🆘 Supporto

Per problemi o domande:
1. Controlla i log in `data/instagram-output/`
2. Verifica configurazione con `--dry-run`
3. Controlla token e permessi Facebook Developer

---

**Buona crescita! 🎣📱**


