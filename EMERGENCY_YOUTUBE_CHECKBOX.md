# 🚨 EMERGENZA: Checkbox "Mostra Video YouTube" Non Visibile

## 🔍 PROBLEMA IDENTIFICATO
Il checkbox "Mostra Video YouTube" non è visibile in Sanity Studio nonostante le modifiche ai file schema.

## 🎯 SOLUZIONE EMERGENZA

### **METODO 1: Aspetta la Sincronizzazione**

#### **1. Tempo di Attesa:**
- **5-10 minuti** per la sincronizzazione automatica
- **Ricarica la pagina** ogni 2-3 minuti
- **Il checkbox dovrebbe apparire automaticamente**

#### **2. Verifica i Campi:**
- **Scorri in fondo** alla lista dei campi
- **Cerca**: "Mostra Video YouTube" (checkbox)
- **Potrebbe essere nascosto** in fondo alla lista

### **METODO 2: Aggiunta Manuale in Sanity Studio**

#### **1. Vai su Sanity Studio:**
```
https://fishandtips-studio.vercel.app
```

#### **2. Apri un Articolo:**
- Vai su **"Content"** → **"Post"**
- Apri **"Pesca alla seppia"** (o qualsiasi articolo)

#### **3. Cerca il Pulsante "Add Field":**
- **Opzione A**: Cerca un pulsante **"+"** o **"Add field"** in fondo alla lista dei campi
- **Opzione B**: Cerca **"Edit schema"** o **"Configure"** 
- **Opzione C**: Cerca **"Structure"** nel menu laterale

#### **4. Se Trovi "Add Field":**
**Campo 1: Mostra Video YouTube**
- Nome: `showYouTubeVideo`
- Tipo: `Boolean`
- Titolo: `Mostra Video YouTube`
- Descrizione: `Mostra un video YouTube in questo articolo`
- Valore iniziale: `false`

**Campo 2: YouTube URL**
- Nome: `youtubeUrl`
- Tipo: `String`
- Titolo: `YouTube Video URL`
- Descrizione: `URL del video YouTube o solo l'ID del video`
- Condizione: `hidden: ({document}) => !document?.showYouTubeVideo`

**Campo 3: YouTube Title**
- Nome: `youtubeTitle`
- Tipo: `String`
- Titolo: `YouTube Video Title`
- Descrizione: `Titolo personalizzato per il video`
- Condizione: `hidden: ({document}) => !document?.showYouTubeVideo`

### **METODO 3: Aggiunta via URL Diretto**

#### **1. Prova questi URL:**
```
https://fishandtips-studio.vercel.app/desk/schema
https://fishandtips-studio.vercel.app/desk/structure
https://fishandtips-studio.vercel.app/desk/configure
```

#### **2. Cerca "Post" nella lista:**
- Clicca su **"Post"**
- Cerca **"Edit"** o **"Configure"**
- Aggiungi i campi YouTube

### **METODO 4: Test Immediato**

#### **1. Aggiungi Video di Test:**
- **Mostra Video YouTube**: `true`
- **YouTube URL**: `dQw4w9WgXcQ`
- **YouTube Title**: `Tutorial pesca - Test video`

#### **2. Salva e Pubblica**

#### **3. Verifica sul Sito:**
```
https://fishandtips.it/articoli/pesca-alla-seppia-tecniche-periodi-migliori-e-consigli-pratici
```

## 🎯 SISTEMA PRONTO

**Il componente React è già implementato e funzionante!**

**Hai solo bisogno di aggiungere i campi in Sanity Studio.**

**Una volta aggiunti, il video apparirà automaticamente sul sito!** 🚀




