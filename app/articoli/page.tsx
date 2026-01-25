import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getPosts } from '../../lib/getPosts';

export const dynamic = 'force-dynamic';
type SearchParams = { [key: string]: string | string[] | undefined };

export async function generateMetadata(
  { searchParams }: { searchParams?: SearchParams }
): Promise<Metadata> {
  const pageParam = searchParams?.page;
  const page = Array.isArray(pageParam) ? parseInt(pageParam[0] || '1', 10) : parseInt(pageParam || '1', 10);
  const safePage = Number.isFinite(page) && page > 1 ? page : 1;
  const canonicalBase = 'https://fishandtips.it/articoli';
  const canonical = safePage > 1 ? `${canonicalBase}?page=${safePage}` : canonicalBase;

  return {
    title: 'Articoli di Pesca - Consigli, Tecniche e Guide | FishandTips',
    description: 'Scopri tutti gli articoli di pesca: tecniche, attrezzature, spot e consigli. Guide complete per spinning, bolognese, feeder e molto altro.',
    keywords: 'articoli pesca, tecniche di pesca, guide pesca, spinning, bolognese, feeder, attrezzature pesca, spot pesca, consigli pesca',
    robots: 'index, follow',
    alternates: {
      canonical,
    },
    openGraph: {
      title: 'Articoli di Pesca - Consigli, Tecniche e Guide | FishandTips',
      description: 'Scopri tutti gli articoli di pesca: tecniche, attrezzature, spot e consigli. Guide complete per spinning, bolognese, feeder e molto altro.',
      type: 'website',
      url: canonical,
      images: [
        {
          url: 'https://fishandtips.it/images/articoli.jpg',
          width: 1200,
          height: 630,
          alt: 'Articoli di pesca FishandTips',
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Articoli di Pesca - Consigli, Tecniche e Guide | FishandTips',
      description: 'Scopri tutti gli articoli di pesca: tecniche, attrezzature, spot e consigli.',
      images: ['https://fishandtips.it/images/articoli.jpg'],
    },
  };
}

export default async function ArticoliPage({ searchParams }: { searchParams?: SearchParams }) {
  const pageParam = searchParams?.page;
  const pageNumber = Array.isArray(pageParam) ? parseInt(pageParam[0] || '1', 10) : parseInt(pageParam || '1', 10);
  const page = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1;
  const perPage = 12;

  const posts = await getPosts();
  const sorted = (posts || []).sort((a: any, b: any) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
  const totalPages = Math.max(1, Math.ceil(sorted.length / perPage));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * perPage;
  const paginated = sorted.slice(start, start + perPage);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-white pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8">
            <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <span className="text-gray-300">/</span>
            <span className="text-gray-900 font-medium">Articoli</span>
          </nav>

          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Articoli e guide
            </h1>
            <p className="text-xl text-gray-600 leading-relaxed">
              Tecniche, consigli e segreti per migliorare le tue catture. 
              Scritti da pescatori, per pescatori.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              La tua guida alla pesca sportiva
            </h2>
            <p className="text-lg text-gray-600">
              Contenuti di qualità scritti da esperti del settore
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Guide dettagliate</h3>
              <p className="text-sm text-gray-500">
                Articoli completi con tecniche passo passo, ideali per principianti e esperti.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Consigli pratici</h3>
              <p className="text-sm text-gray-500">
                Trucchi e segreti dei professionisti che puoi applicare subito.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Aggiornamenti continui</h3>
              <p className="text-sm text-gray-500">
                Nuovi articoli ogni settimana su tecniche, spot e attrezzature.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
            Ricevi i nuovi articoli nella tua inbox
          </h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">
            Iscriviti alla newsletter e ricevi contenuti personalizzati 
            basati sulle tue tecniche preferite. Zero spam, solo valore.
          </p>
          <Link 
            href="/registrazione"
            className="inline-flex items-center px-8 py-4 bg-white text-gray-900 font-medium rounded-full hover:bg-gray-100 transition-colors"
          >
            Iscriviti gratis
            <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </section>

      {/* Elenco completo articoli con paginazione */}
      <section className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Tutti gli articoli</h2>
            <p className="text-sm text-gray-500">
              {sorted.length} contenuti pubblicati · Pagina {currentPage} di {totalPages}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginated.map((post: any) => {
              const firstCategoryTitle = post.categories?.[0]?.title || 'Pesca';
              const slug = typeof post.slug === 'string' ? post.slug : post.slug?.current;
              
              return (
              <article key={post._id} className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200">
                {post.mainImage?.asset?.url && (
                  <div className="relative aspect-[4/3]">
                    <Image
                      src={post.mainImage.asset.url}
                      alt={post.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                )}
                <div className="p-5 flex flex-col gap-3">
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{new Date(post.publishedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span className="text-gray-300">•</span>
                    <span>{firstCategoryTitle}</span>
                  </div>
                  <Link href={`/articoli/${slug}`} className="group">
                    <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                  </Link>
                  <p className="text-sm text-gray-600 line-clamp-3">
                    {post.excerpt || 'Scopri tecniche, attrezzature e consigli pratici per migliorare le tue uscite di pesca.'}
                  </p>
                  <div className="pt-1">
                    <Link
                      href={`/articoli/${slug}`}
                      className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:text-blue-700"
                    >
                      Leggi l&apos;articolo
                      <span aria-hidden="true">→</span>
                    </Link>
                  </div>
                </div>
              </article>
              );
            })}
          </div>

          {/* Paginazione */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-3 mt-10">
              {currentPage > 1 ? (
                <Link
                  href={`/articoli?page=${currentPage - 1}`}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-blue-200 hover:text-blue-700 transition-colors"
                >
                  ← Pagina precedente
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-full border border-gray-100 text-sm text-gray-400 cursor-not-allowed">
                  ← Pagina precedente
                </span>
              )}
              <span className="text-sm text-gray-600">
                Pagina {currentPage} di {totalPages}
              </span>
              {currentPage < totalPages ? (
                <Link
                  href={`/articoli?page=${currentPage + 1}`}
                  className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-700 hover:border-blue-200 hover:text-blue-700 transition-colors"
                >
                  Pagina successiva →
                </Link>
              ) : (
                <span className="px-4 py-2 rounded-full border border-gray-100 text-sm text-gray-400 cursor-not-allowed">
                  Pagina successiva →
                </span>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
