import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { PortableText } from '@portabletext/react';
import { sanityClient } from '../../../sanityClient';
import RelatedArticlesCarousel from '../../../components/articles/RelatedArticlesCarousel';
import FishingRodComparison from '../../../components/articles/FishingRodComparison';
import YouTubeEmbed from '../../../components/articles/YouTubeEmbed';
import FishSpeciesBox from '../../../components/articles/FishSpeciesBox';
import RelatedDatabaseLinks from '../../../components/articles/RelatedDatabaseLinks';
import { extractRelatedLinks, portableTextToPlainText } from '../../../lib/extract-related-links';
import { getArticleGateConfig } from '../../../lib/article-gate-config';
import { splitBodyForGate } from '../../../lib/split-article-body';
import {
  articlePortableTextComponents,
  articleProseClassName,
} from '../../../lib/portable-text-components';
import GatedArticleContent from '../../../components/articles/GatedArticleContent';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: any;
  publishedAt: string;
  mainImage?: string;
  author: string;
  categories: Array<{
    title: string;
    slug: string;
  }>;
  fishingTechniques: Array<{
    title: string;
    slug: string;
  }>;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  seoImage?: string;
  readingTime?: number;
  status: string;
  showFishingRodComparison?: boolean;
  fishingRodComparisonTitle?: string;
  selectedProducts?: Array<{
    productId: string;
    name: string;
    brand: string;
    price: number;
    length?: number;
    castingPower?: string;
    action?: string;
    experienceLevel: string;
    badge?: string;
    quickReview?: string;
    affiliateLink?: string;
    image?: string;
  }>;
  showYouTubeVideo?: boolean;
  youtubeUrl?: string;
  youtubeTitle?: string;
  youtubeDescription?: string;
  youtube?: {
    videoId: string;
    title?: string;
    channelTitle?: string;
    url?: string;
    embedUrl?: string;
    reason?: string;
    takeaways?: string[];
    metrics?: {
      views?: number;
      likeCount?: number;
      commentCount?: number;
      durationSeconds?: number;
      publishedAt?: string;
    };
  };
}

interface Article {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  mainImage?: string;
  publishedAt: string;
  author: string;
  readingTime?: number;
}

interface Props {
  params: Promise<{ slug: string }>;
}

// Disabilita il build statico per ora
export const dynamic = 'force-dynamic';
/** Temporaneo: refresh pagine articolo alla CDN. Ripristinare a 3600 dopo verifica. */
export const revalidate = 0;

// Forza il refresh dei dati
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  
  if (!post) {
    return {
      title: 'Articolo non trovato',
      description: 'L\'articolo che stai cercando non esiste.',
    };
  }

  const title = post.seoTitle || post.title;
  const description = post.seoDescription || post.excerpt;
  const image = post.seoImage || post.mainImage || '';
  const keywords = post.seoKeywords || ['pesca', 'tecniche di pesca', 'blog pesca'];

  return {
    title,
    description,
    keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author],
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
    alternates: {
      canonical: `https://fishandtips.it/articoli/${post.slug}`,
    },
  };
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await sanityClient.fetch(`
      *[_type == "post" && slug.current == $slug && status == "published"][0] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        body,
        publishedAt,
        "mainImage": mainImage.asset->url,
        "author": author->name,
        categories[]->{
          title,
          "slug": slug.current
        },
        fishingTechniques[]->{
          title,
          "slug": slug.current
        },
        seoTitle,
        seoDescription,
        seoKeywords,
        "seoImage": seoImage.asset->url,
        readingTime,
        status,
        showFishingRodComparison,
        fishingRodComparisonTitle,
        selectedProducts,
        showYouTubeVideo,
        youtubeUrl,
        youtubeTitle,
      youtubeDescription,
      youtube
      }
    `, { slug }, {
      // Disabilita il caching per Vercel
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    return post;
  } catch (error) {
    console.error('Errore nel recupero articolo:', error);
    return null;
  }
}

async function getRelatedArticles(currentArticleId: string): Promise<Article[]> {
  try {
    const articles = await sanityClient.fetch(`
      *[_type == "post" && status == "published" && _id != $currentId && publishedAt <= $now] | order(publishedAt desc) [0...12] {
        _id,
        title,
        "slug": slug.current,
        excerpt,
        "mainImage": mainImage.asset->url,
        publishedAt,
        "author": author->name,
        readingTime
      }
    `, { 
      currentId: currentArticleId,
      now: new Date().toISOString()
    }, {
      cache: 'no-store',
      next: { revalidate: 0 }
    });

    return articles || [];
  } catch (error) {
    console.error('Errore nel recupero articoli correlati:', error);
    return [];
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
    notFound();
  }

  // Recupera gli articoli correlati
  const relatedArticles = await getRelatedArticles(post._id);

  const gateConfig = getArticleGateConfig(slug);
  const isGatedArticle = gateConfig !== null;
  const { preview: previewBlocks, gated: gatedBlocks } = isGatedArticle
    ? splitBodyForGate(post.body, { introParagraphCount: 3 })
    : { preview: [], gated: [] };

  // Controlli di sicurezza per i dati
  if (!post.title || !post.author) {
    notFound();
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('it-IT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Structured Data per l'articolo
  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.mainImage || '',
    author: {
      '@type': 'Person',
      name: post.author,
    },
    publisher: {
      '@type': 'Organization',
      name: 'FishandTips',
      logo: {
        '@type': 'ImageObject',
        url: 'https://fishandtips.it/images/icononly.png'
      }
    },
    datePublished: post.publishedAt,
    dateModified: post.publishedAt,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://fishandtips.it/articoli/${post.slug}`
    },
    articleSection: post.categories && post.categories.length > 0 ? post.categories.map((cat: any) => cat.title).join(', ') : '',
    keywords: post.seoKeywords?.join(', ') || 'pesca, tecniche di pesca',
    wordCount: post.body?.length || 0,
  };

  const formatMonthYear = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('it-IT', { month: 'long', year: 'numeric' });
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://fishandtips.it/'
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Articoli',
        item: 'https://fishandtips.it/articoli'
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://fishandtips.it/articoli/${post.slug}`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {/* Header */}
        <header className="mb-8 sm:mb-12">
          <div className="mb-4 sm:mb-6">
            {post.categories && post.categories.length > 0 && post.categories.map((category, index) => (
              <span
                key={category.slug || `category-${index}`}
                className="inline-block bg-brand-blue/10 text-brand-blue text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 rounded-full mr-2 sm:mr-3 mb-2 sm:mb-3 font-medium"
              >
                {category.title}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
            {post.title}
          </h1>
          
          {/* TL;DR / Summary box */}
          <div className="mb-6 sm:mb-8">
            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 sm:p-5">
              <h2 className="text-base sm:text-lg font-semibold text-blue-900 mb-2">In breve</h2>
              <p className="text-sm sm:text-base text-blue-900">
                {post.excerpt
                  ? `In questa guida scoprirai ${post.excerpt}`
                  : 'In questa guida scoprirai quando usarla, come impostare l’attrezzatura e gli errori da evitare.'}
              </p>
            </div>
          </div>
          
          {/* Freshness signal */}
          {post.publishedAt && (
            <p className="text-sm text-gray-500 mb-4">
              Ultimo aggiornamento: {formatMonthYear(post.publishedAt)}
            </p>
          )}
          
          {post.excerpt && (
            <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 mb-6 sm:mb-8 leading-relaxed">
              {post.excerpt}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-sm sm:text-base text-gray-500 mb-6 sm:mb-8 space-y-2 sm:space-y-0">
            <div className="flex flex-wrap items-center space-x-4 sm:space-x-6">
              <span className="font-medium">di {post.author}</span>
              <span className="hidden sm:inline">•</span>
              <span>{formatDate(post.publishedAt)}</span>
              {post.readingTime && (
                <>
                  <span className="hidden sm:inline">•</span>
                  <span>{post.readingTime} min di lettura</span>
                </>
              )}
            </div>
          </div>

          {/* Tecniche di pesca */}
          {post.fishingTechniques && post.fishingTechniques.length > 0 && (
            <div className="mb-6 sm:mb-8">
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-2 sm:mb-3">
                🎣 Tecniche trattate:
              </h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {post.fishingTechniques.map((technique, index) => (
                  <span
                    key={technique.slug || `technique-${index}`}
                    className="inline-block bg-brand-yellow/20 text-gray-800 text-sm sm:text-base px-3 sm:px-4 py-1 sm:py-2 rounded-full font-medium"
                  >
                    {technique.title}
                  </span>
                ))}
              </div>
            </div>
          )}
        </header>

        {/* Immagine principale */}
        {post.mainImage && !gateConfig?.inlineCta && (
          <div className="mb-8 sm:mb-12">
            <Image
              src={post.mainImage}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto rounded-lg sm:rounded-xl shadow-lg sm:shadow-xl"
              priority
            />
          </div>
        )}

      {/* Video YouTube */}
      {post.youtube?.videoId || post.youtube?.embedUrl || post.youtube?.url ? (
        <div className="mb-8 sm:mb-12">
          <div className="bg-white border border-gray-200 rounded-xl p-5 sm:p-6 shadow-sm">
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">
              Video consigliato (selezionato da Fish & Tips)
            </h2>
            {post.youtube.reason && (
              <p className="text-gray-700 mb-3 text-sm sm:text-base">
                {post.youtube.reason}
              </p>
            )}
            {post.youtube.takeaways && post.youtube.takeaways.length > 0 && (
              <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1 text-sm sm:text-base">
                {post.youtube.takeaways.slice(0, 3).map((t, idx) => (
                  <li key={idx}>{t}</li>
                ))}
              </ul>
            )}
            <YouTubeEmbed
              videoId={
                post.youtube.videoId ||
                post.youtube.embedUrl ||
                post.youtube.url ||
                ''
              }
              title={post.youtube.title || post.title}
              className="mt-4"
            />
            {post.youtube.channelTitle && (
              <p className="text-xs text-gray-500 mt-2">
                Canale: {post.youtube.channelTitle}
              </p>
            )}
          </div>
        </div>
      ) : post.showYouTubeVideo && post.youtubeUrl && (
          <div className="mb-8 sm:mb-12">
            <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg sm:rounded-xl p-4 sm:p-6 border border-red-200" itemScope itemType="https://schema.org/VideoObject">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800" itemProp="name">
                  📺 {post.youtubeTitle || 'Video Tutorial'}
                </h3>
              </div>
              
              {/* Testo di Spiegazione */}
              {post.youtubeDescription && (
                <div className="mb-6">
                  <div className="prose prose-sm sm:prose max-w-none text-gray-700">
                    <div className="whitespace-pre-line" itemProp="description" role="complementary" aria-label="Spiegazione del video tutorial">
                      {post.youtubeDescription}
                    </div>
                  </div>
                </div>
              )}
              
              <YouTubeEmbed 
                videoId={post.youtubeUrl}
                title={post.youtubeTitle}
                className="w-full"
              />
              
              {/* Schema Markup per SEO */}
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "VideoObject",
                    "name": post.youtubeTitle || "Video Tutorial",
                    "description": post.youtubeDescription || "Video tutorial di pesca",
                    "thumbnailUrl": `https://img.youtube.com/vi/${post.youtubeUrl.split('v=')[1]?.split('&')[0] || post.youtubeUrl}/maxresdefault.jpg`,
                    "embedUrl": `https://www.youtube.com/embed/${post.youtubeUrl.split('v=')[1]?.split('&')[0] || post.youtubeUrl}`,
                    "uploadDate": post.publishedAt,
                    "author": {
                      "@type": "Person",
                      "name": post.author
                    }
                  })
                }}
              />
            </div>
          </div>
        )}

        {/* Contenuto */}
        {isGatedArticle && gateConfig ? (
          <GatedArticleContent
            gateConfig={gateConfig}
            previewBlocks={previewBlocks}
            gatedBlocks={gatedBlocks}
          />
        ) : (
          <div className={articleProseClassName}>
            <PortableText
              value={post.body}
              components={articlePortableTextComponents}
            />
          </div>
        )}

        {/* Schede specie menzionate */}
        {post.body && <FishSpeciesBox body={post.body} />}

        {/* Footer articolo */}
        <footer className="mt-16 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between text-base text-gray-500 space-y-4 sm:space-y-0">
            <div>
              <p className="font-medium">Pubblicato il {formatDate(post.publishedAt)}</p>
            </div>
          </div>
        </footer>

        {/* Link a pagine database (tecniche, specie, regioni) estratti da titolo e corpo */}
        <RelatedDatabaseLinks links={extractRelatedLinks(post.title, portableTextToPlainText(post.body))} />

        {/* Approfondisci / Guide correlate */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-12">
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sm:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">Approfondisci</h2>
              <p className="text-gray-600 mb-6 text-sm sm:text-base">
                Guide correlate per approfondire l&apos;argomento.
              </p>
              <div className="grid gap-4 sm:gap-5">
                {relatedArticles.slice(0, 3).map((rel) => (
                  <Link
                    key={rel._id}
                    href={`/articoli/${rel.slug}`}
                    className="group flex items-start gap-4 p-4 rounded-xl bg-white border border-gray-200 hover:border-brand-blue/40 hover:shadow-sm transition"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-gray-500 mb-1">
                        {new Date(rel.publishedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 group-hover:text-brand-blue line-clamp-2">
                        {rel.title}
                      </h3>
                      {rel.excerpt && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {rel.excerpt}
                        </p>
                      )}
                    </div>
                    <span className="text-brand-blue font-semibold text-sm sm:text-base">→</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

                  {/* Confronto canne da pesca */}
          {post.showFishingRodComparison && (
            <FishingRodComparison 
              customTitle={post.fishingRodComparisonTitle}
              selectedProducts={post.selectedProducts}
            />
          )}

          {/* Carosello articoli correlati */}
          <RelatedArticlesCarousel articles={relatedArticles} />
      </article>
    </>
  );
}
