# 🚨 SETUP EMERGENZA: Campi YouTube

## 🔍 PROBLEMA IDENTIFICATO
I campi YouTube non sono visibili in Sanity Studio nonostante le modifiche ai file schema.

## 🎯 SOLUZIONE EMERGENZA

### **METODO 1: Aggiunta Manuale in Sanity Studio**

#### **1. Vai su Sanity Studio:**
```
https://fishandtips-studio.vercel.app
```

#### **2. Apri un Articolo:**
- Vai su **"Content"** → **"Post"**
- Apri **"Pesca a Genova"** (o qualsiasi articolo)

#### **3. Cerca il Pulsante "Add Field":**
- **Opzione A**: Cerca un pulsante **"+"** o **"Add field"** in fondo alla lista dei campi
- **Opzione B**: Cerca **"Edit schema"** o **"Configure"** 
- **Opzione C**: Cerca **"Structure"** nel menu laterale

#### **4. Se Trovi "Add Field":**
**Campo 1: YouTube URL**
- Nome: `youtubeUrl`
- Tipo: `String`
- Titolo: `YouTube Video URL`
- Descrizione: `URL del video YouTube`

**Campo 2: YouTube Title**
- Nome: `youtubeTitle`
- Tipo: `String`
- Titolo: `YouTube Video Title`
- Descrizione: `Titolo personalizzato per il video`

#### **5. Se NON Trovi "Add Field":**
**Cerca in queste sezioni:**
- **Settings** (icona ingranaggio)
- **Schema** o **Content Types**
- **Structure** o **Document Types**
- **Configure** o **Edit**

### **METODO 2: Aggiunta via URL Diretto**

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

### **METODO 3: Test Immediato**

#### **1. Aggiungi Video di Test:**
- **YouTube URL**: `dQw4w9WgXcQ`
- **YouTube Title**: `Tutorial pesca - Test video`

#### **2. Salva e Pubblica**

#### **3. Verifica sul Sito:**
```
https://fishandtips.it/articoli/pesca-genova-consigli-locali
```

## 🎯 SISTEMA PRONTO

**Il componente React è già implementato e funzionante!**

**Hai solo bisogno di aggiungere i campi in Sanity Studio.**

**Una volta aggiunti, il video apparirà automaticamente sul sito!** 🚀


