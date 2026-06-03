/** Configurazione content gate per articolo (PDF + copy + localStorage) */

export type ArticleGateCopy = {
  title: string;
  bullets: string[];
  submitLabel: string;
  successMessage: string;
  pdfLinkLabel: string;
  footerNote?: string;
};

export type ArticleGateConfig = {
  slug: string;
  storageKey: string;
  pdfBackupUrl: string;
  copy: ArticleGateCopy;
  /** Test/conversione: nessun testo visibile prima dell'iscrizione (corpo in sr-only per SEO) */
  hideArticleUntilUnlock?: boolean;
};

const PDF_TAGLIE_URL =
  'https://cdn.sanity.io/files/3nnnl6gi/production/14eea4062fd3fd872f52cfb8d20e169c29633321.pdf';

export const GATED_ARTICLES: Record<string, ArticleGateConfig> = {
  'taglia-minima-dei-pesci-in-italia-2026-tabella-completa': {
    slug: 'taglia-minima-dei-pesci-in-italia-2026-tabella-completa',
    storageKey: 'ft-gate-taglie-2026',
    pdfBackupUrl: PDF_TAGLIE_URL,
    hideArticleUntilUnlock: true,
    copy: {
      title: 'Scarica la tabella ufficiale 2026 con 30+ specie',
      bullets: [
        'Taglie minime aggiornate 2026 per mare e acqua dolce',
        'Oltre 30 specie in un\'unica tabella chiara e stampabile',
        'Guida gratuita inviata subito alla tua email',
      ],
      submitLabel: 'Scaricala gratis',
      successMessage:
        'Ti abbiamo inviato la guida via email — controlla la posta (anche lo spam).',
      pdfLinkLabel: 'Scarica il PDF ora',
    },
  },
  'recfishing-app-obbligatoria-pesca-sportiva-2026': {
    slug: 'recfishing-app-obbligatoria-pesca-sportiva-2026',
    storageKey: 'ft-gate-recfishing-2026',
    pdfBackupUrl: PDF_TAGLIE_URL,
    copy: {
      title: 'Scarica la tabella ufficiale 2026 con 30+ specie',
      bullets: [
        'Taglie minime aggiornate per mare e acqua dolce — da tenere a portata di mano',
        'Oltre 30 specie in PDF: utile insieme al diario RecFishing e alle nuove regole 2026',
        'Invio immediato via email, nessun costo',
      ],
      submitLabel: 'Ricevi la tabella gratis',
      successMessage:
        'Ti abbiamo inviato la tabella taglie via email — controlla la posta (anche lo spam).',
      pdfLinkLabel: 'Scarica la tabella PDF ora',
      footerNote:
        'Ricevi la tabella taglie e i nostri consigli di pesca. Niente spam, cancellazione in un click.',
    },
  },
};

/** @deprecated Usa getArticleGateConfig(slug) */
export const GATED_ARTICLE_SLUG = 'taglia-minima-dei-pesci-in-italia-2026-tabella-completa';

export const PDF_BACKUP_URL = PDF_TAGLIE_URL;

export const GATE_STORAGE_KEY = GATED_ARTICLES[GATED_ARTICLE_SLUG].storageKey;

export function getArticleGateConfig(slug: string): ArticleGateConfig | null {
  return GATED_ARTICLES[slug] ?? null;
}

export function isGatedArticleSlug(slug: string): boolean {
  return slug in GATED_ARTICLES;
}
