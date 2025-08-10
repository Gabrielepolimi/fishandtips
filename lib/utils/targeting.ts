import { sanityClient } from '../../sanityClient';

export interface UserPreferences {
  interests: {
    techniques: string[];
  };
}

export interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  publishedAt: string;
  mainImage: string;
  author: string;
  categories: Array<{ _id: string; title: string; slug: string }>;
  fishingTechniques: Array<{ _id: string; title: string; slug: string }>;
}

export interface ScoredArticle extends Article {
  score: number;
  matchReasons: string[];
}

// Calcola il punteggio di matching tra utente e articolo
export function calculateArticleScore(user: UserPreferences, article: Article): ScoredArticle {
  let score = 0;
  const matchReasons: string[] = [];

  // Matching per tecniche di pesca (peso: 100%)
  const techniqueMatches = user.interests.techniques.filter(technique =>
    article.fishingTechniques?.some(art => art.slug === technique) || false
  );
  if (techniqueMatches.length > 0) {
    score += 100 * (techniqueMatches.length / user.interests.techniques.length);
    matchReasons.push(`Tecniche: ${techniqueMatches.join(', ')}`);
  }

  return {
    ...article,
    score: Math.round(score * 100) / 100,
    matchReasons
  };
}

// Recupera articoli per newsletter (usa i POST esistenti)
export async function getNewsletterArticles(user: UserPreferences): Promise<ScoredArticle[]> {
  try {
    // Query per i POST esistenti
    const articles = await sanityClient.fetch(`
      *[_type == "post"] | order(publishedAt desc) [0...10] {
        _id,
        title,
        slug,
        excerpt,
        publishedAt,
        "mainImage": mainImage.asset->url,
        "author": author->name,
        categories[]->{
          _id,
          title,
          slug
        },
        fishingTechniques[]->{
          _id,
          title,
          slug
        }
      }
    `);

    // Calcola i punteggi e ordina
    const scoredArticles = articles
      .map(article => calculateArticleScore(user, article))
      .sort((a, b) => b.score - a.score) // Ordina per punteggio decrescente
      .slice(0, 5); // Prendi i migliori 5

    return scoredArticles;
  } catch (error) {
    console.error('Errore nel recupero articoli newsletter:', error);
    return [];
  }
}

// Analizza le preferenze utente per suggerimenti
export function analyzeUserPreferences(user: UserPreferences) {
  const analysis = {
    totalInterests: 0,
    techniqueCount: user.interests.techniques.length,
    suggestions: [] as string[]
  };

  analysis.totalInterests = analysis.techniqueCount;

  // Suggerimenti basati sui dati
  if (analysis.totalInterests < 2) {
    analysis.suggestions.push('Aggiungi più tecniche di pesca per ricevere contenuti più personalizzati');
  }

  if (analysis.techniqueCount === 0) {
    analysis.suggestions.push('Seleziona le tue tecniche di pesca preferite');
  }

  return analysis;
}
