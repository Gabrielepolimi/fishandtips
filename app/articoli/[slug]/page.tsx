import { Metadata } from 'next';
import { sanityClient } from '../../../sanityClient';
import { PortableText } from '@portabletext/react';
import { notFound } from 'next/navigation';
import Image from 'next/image';

interface Post {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: any;
  publishedAt: string;
  mainImage: {
    asset: {
      url: string;
    };
  };
  author: {
    name: string;
  };
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
  seoImage?: {
    asset: {
      url: string;
    };
  };
  readingTime?: number;
  status: string;
}

interface Props {
  params: Promise<{ slug: string }>;
}

// Genera metadata dinamici per ogni articolo
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
  const image = post.seoImage?.asset.url || post.mainImage.asset.url;
  const keywords = post.seoKeywords || ['pesca', 'tecniche di pesca', 'blog pesca'];

  return {
    title,
    description,
    keywords,
    authors: [{ name: post.author.name }],
    openGraph: {
      title,
      description,
      type: 'article',
      publishedTime: post.publishedAt,
      authors: [post.author.name],
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

// Genera percorsi statici per tutti gli articoli
export async function generateStaticParams() {
  const posts = await sanityClient.fetch(`
    *[_type == "post" && status == "published"] {
      slug
    }
  `);

  return posts.map((post: { slug: string }) => ({
    slug: post.slug,
  }));
}

async function getPost(slug: string): Promise<Post | null> {
  try {
    const post = await sanityClient.fetch(`
      *[_type == "post" && slug.current == $slug && status == "published"][0] {
        _id,
        title,
        slug,
        excerpt,
        body,
        publishedAt,
        "mainImage": mainImage.asset->url,
        "author": author->name,
        categories[]->{
          title,
          slug
        },
        fishingTechniques[]->{
          title,
          slug
        },
        seoTitle,
        seoDescription,
        seoKeywords,
        "seoImage": seoImage.asset->url,
        readingTime,
        status
      }
    `, { slug });

    return post;
  } catch (error) {
    console.error('Errore nel recupero articolo:', error);
    return null;
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);

  if (!post) {
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
    image: post.mainImage.asset.url,
    author: {
      '@type': 'Person',
      name: post.author.name,
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
    articleSection: post.categories.map((cat: any) => cat.title).join(', '),
    keywords: post.seoKeywords?.join(', ') || 'pesca, tecniche di pesca',
    wordCount: post.body?.length || 0,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <article className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8">
          <div className="mb-4">
            {post.categories.map((category) => (
              <span
                key={category.slug}
                className="inline-block bg-brand-blue/10 text-brand-blue text-sm px-3 py-1 rounded-full mr-2 mb-2"
              >
                {category.title}
              </span>
            ))}
          </div>
          
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {post.title}
          </h1>
          
          <p className="text-xl text-gray-600 mb-6">
            {post.excerpt}
          </p>

          {/* Meta info */}
          <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
            <div className="flex items-center space-x-4">
              <span>di {post.author.name}</span>
              <span>•</span>
              <span>{formatDate(post.publishedAt)}</span>
              {post.readingTime && (
                <>
                  <span>•</span>
                  <span>{post.readingTime} min di lettura</span>
                </>
              )}
            </div>
          </div>

          {/* Tecniche di pesca */}
          {post.fishingTechniques && post.fishingTechniques.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">
                🎣 Tecniche trattate:
              </h3>
              <div className="flex flex-wrap gap-2">
                {post.fishingTechniques.map((technique) => (
                  <span
                    key={technique.slug}
                    className="inline-block bg-brand-yellow/20 text-gray-800 text-sm px-3 py-1 rounded-full"
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
          <div className="mb-8">
            <Image
              src={post.mainImage.asset.url}
              alt={post.title}
              width={1200}
              height={630}
              className="w-full h-auto rounded-lg shadow-lg"
              priority
            />
          </div>
        )}

        {/* Contenuto */}
        <div className="prose prose-lg max-w-none">
          <PortableText value={post.body} />
        </div>

        {/* Footer articolo */}
        <footer className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div>
              <p>Pubblicato il {formatDate(post.publishedAt)}</p>
            </div>
            <div className="flex space-x-4">
              <button className="text-brand-blue hover:text-brand-blue-dark">
                Condividi
              </button>
              <button className="text-brand-blue hover:text-brand-blue-dark">
                Salva
              </button>
            </div>
          </div>
        </footer>
      </article>
    </>
  );
}
