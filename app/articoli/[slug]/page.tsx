import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PortableText } from '@portabletext/react';
import { sanityClient, urlFor } from '../../../sanityClient';
import RelatedArticlesCarousel from '../../../components/articles/RelatedArticlesCarousel';
import LikeButton from '../../../components/articles/LikeButton';
import FishingRodComparison from '../../../components/articles/FishingRodComparison';
import YouTubeEmbed from '../../../components/articles/YouTubeEmbed';

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
  initialLikes?: number;
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
export const revalidate = 3600; // 1 ora

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
        initialLikes,
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

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
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
            <div className="flex items-center space-x-4">
              <LikeButton 
                articleId={post._id} 
                initialLikes={post.initialLikes || 0} 
              />
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
        {post.mainImage && (
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
        <div className="prose prose-lg sm:prose-xl max-w-none prose-headings:text-gray-900 prose-headings:font-bold prose-p:text-gray-700 prose-p:leading-relaxed prose-p:text-base sm:prose-p:text-lg prose-p:mb-4 sm:prose-p:mb-6 prose-img:rounded-lg prose-img:shadow-lg prose-img:my-6 sm:prose-img:my-8 prose-h2:text-2xl sm:prose-h2:text-3xl prose-h2:mt-8 sm:prose-h2:mt-12 prose-h2:mb-4 sm:prose-h2:mb-6 prose-h3:text-xl sm:prose-h3:text-2xl prose-h3:mt-6 sm:prose-h3:mt-8 prose-h3:mb-3 sm:prose-h3:mb-4 prose-ul:my-4 sm:prose-ul:my-6 prose-ol:my-4 sm:prose-ol:my-6 prose-li:text-base sm:prose-li:text-lg prose-li:mb-1 sm:prose-li:mb-2 prose-blockquote:border-l-4 prose-blockquote:border-brand-blue prose-blockquote:pl-4 sm:prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:bg-gray-50 prose-blockquote:py-3 sm:prose-blockquote:py-4 prose-blockquote:px-4 sm:prose-blockquote:px-6 prose-blockquote:rounded-r-lg">
          <PortableText 
            value={post.body} 
            components={{
              types: {
                image: ({value}) => {
                  console.log('Debug image value:', value);
                  
                  // Usa la funzione urlFor di Sanity per gestire i reference
                  if (value?.asset) {
                    const imageUrl = urlFor(value).url();
                    
                    return (
                      <div className="my-6 sm:my-8">
                        <Image
                          src={imageUrl}
                          alt={value.alt || value.caption || 'Immagine articolo'}
                          width={800}
                          height={600}
                          className="w-full h-auto rounded-lg shadow-lg"
                        />
                        {value.caption && (
                          <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 italic">
                            {value.caption}
                          </p>
                        )}
                      </div>
                    );
                  }
                  
                  // Fallback per altri formati
                  let imageUrl = '';
                  if (typeof value === 'string') {
                    imageUrl = value;
                  } else if (value?.url) {
                    imageUrl = value.url;
                  } else if (value?.src) {
                    imageUrl = value.src;
                  }
                  
                  if (!imageUrl) {
                    console.warn('Immagine senza URL valido:', value);
                    return null;
                  }
                  
                  return (
                    <div className="my-6 sm:my-8">
                      <Image
                        src={imageUrl}
                        alt={value.alt || value.caption || 'Immagine articolo'}
                        width={800}
                        height={600}
                        className="w-full h-auto rounded-lg shadow-lg"
                      />
                      {value.caption && (
                        <p className="text-xs sm:text-sm text-gray-500 text-center mt-2 italic">
                          {value.caption}
                        </p>
                      )}
                    </div>
                  );
                },
              },
              block: {
                // Evita H1 multipli nel corpo: il solo H1 è nel header sopra
                h1: ({children}) => <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-8 sm:mt-12 mb-4 sm:mb-6">{children}</h2>,
                h2: ({children}) => <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mt-6 sm:mt-10 mb-3 sm:mb-5">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mt-5 sm:mt-8 mb-2 sm:mb-4">{children}</h3>,
                h4: ({children}) => <h4 className="text-lg sm:text-xl font-bold text-gray-900 mt-4 sm:mt-6 mb-2 sm:mb-3">{children}</h4>,
                normal: ({children}) => <p className="text-base sm:text-lg text-gray-700 leading-relaxed mb-4 sm:mb-6">{children}</p>,
              },
              list: {
                bullet: ({children}) => <ul className="my-4 sm:my-6 space-y-1 sm:space-y-2">{children}</ul>,
                number: ({children}) => <ol className="my-4 sm:my-6 space-y-1 sm:space-y-2">{children}</ol>,
              },
              listItem: {
                bullet: ({children}) => <li className="text-base sm:text-lg text-gray-700 ml-3 sm:ml-4">{children}</li>,
                number: ({children}) => <li className="text-base sm:text-lg text-gray-700 ml-3 sm:ml-4">{children}</li>,
              },
              marks: {
                link: ({children, value}) => {
                  const target = (value?.href || '').startsWith('http') ? '_blank' : undefined;
                  return (
                    <a 
                      href={value?.href} 
                      target={target}
                      rel={target === '_blank' ? 'noopener noreferrer' : undefined}
                      className="text-blue-600 hover:text-blue-800 underline decoration-2 underline-offset-2 decoration-blue-400 hover:decoration-blue-600 transition-all duration-200 font-medium"
                    >
                      {children}
                    </a>
                  );
                },
                strong: ({children}) => <strong className="font-bold text-gray-900">{children}</strong>,
                em: ({children}) => <em className="italic text-gray-800">{children}</em>,
                code: ({children}) => <code className="bg-gray-100 text-gray-800 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
              },
            }}
          />
        </div>

        {/* Footer articolo */}
        <footer className="mt-16 pt-10 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row items-center justify-between text-base text-gray-500 space-y-4 sm:space-y-0">
            <div>
              <p className="font-medium">Pubblicato il {formatDate(post.publishedAt)}</p>
            </div>
          </div>
        </footer>

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
