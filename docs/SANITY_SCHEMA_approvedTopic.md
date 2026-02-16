# Schema Sanity: approvedTopic (Topic Queue)

Aggiungi questo tipo documento al tuo Sanity Studio per il piano editoriale.

## Campi

| Nome          | Tipo     | Obbligatorio | Descrizione |
|---------------|----------|--------------|-------------|
| title         | string   | sì           | Topic/keyword approvato (es. "Come pescare il dentice dalla scogliera") |
| categorySlug  | string   | sì           | Slug categoria destinazione (es. "tecniche-di-pesca", "attrezzature", "consigli", "spot-di-pesca") |
| used          | boolean  | no           | Default false. Impostato a true dopo la pubblicazione dell'articolo |
| usedAt        | datetime | no           | Compilato quando il topic viene usato |
| createdAt     | datetime | no           | Creazione documento (utile per ordinamento) |
| seasonHint    | string   | no           | Stagione ideale pubblicazione (es. "febbraio", "estate") |

## Esempio definizione (JavaScript)

```js
// approvedTopic.js
export default {
  name: 'approvedTopic',
  type: 'document',
  title: 'Topic approvato',
  fields: [
    { name: 'title', type: 'string', title: 'Topic / Keyword', validation: (Rule) => Rule.required() },
    { name: 'categorySlug', type: 'string', title: 'Categoria (slug)', validation: (Rule) => Rule.required() },
    { name: 'used', type: 'boolean', title: 'Usato', initialValue: false },
    { name: 'usedAt', type: 'datetime', title: 'Usato il' },
    { name: 'createdAt', type: 'datetime', title: 'Creato il' },
    { name: 'seasonHint', type: 'string', title: 'Stagione ideale' }
  ]
}
```

Dopo aver aggiunto lo schema, crea i documenti (a mano o con lo script di import):

- **Da JSON:** `node scripts/import-topic-queue.js` (usa `data/topic-queue-50.json`)  
  oppure `node scripts/import-topic-queue.js --file path/to/topic-queue.json`
- **Da Excel:** `node scripts/import-topic-queue.js --file /path/to/fishandtips_topic_queue_50.xlsx`  
  (richiede `npm i xlsx`). Colonne attese: title (o keyword), categorySlug (o category), seasonHint (opzionale).
