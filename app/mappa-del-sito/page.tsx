import { Metadata } from 'next';
import Link from 'next/link';
import { sanityClient } from '../../sanityClient';

export const metadata: Metadata = {
  title: 'Mappa del Sito',
  description: 'Naviga facilmente tra tutte le pagine e gli articoli di FishandTips. Trova rapidamente i contenuti che ti interessano.',
  robots: {
    index: true,
    follow: true,
  },
};

async function getCategories() {
  try {
    const categories = await sanityClient.fetch(`
      *[_type == "category"] {
        title,
        "slug": slug.current,
        description
      }
    `);
    return categories;
  } catch (error) {
    console.error('Errore nel recupero categorie:', error);
    return [];
  }
}

async function getRecentPosts() {
  try {
    const posts = await sanityClient.fetch(`
      *[_type == "post" && status == "published"] | order(publishedAt desc)[0...10] {
        title,
        "slug": slug.current,
        publishedAt,
        "category": categories[0]->title
      }
    `);
    return posts;
  } catch (error) {
    console.error('Errore nel recupero articoli:', error);
    return [];
  }
}

export default async function SitemapPage() {
  const categories = await getCategories();
  const recentPosts = await getRecentPosts();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <section className="bg-brand-blue text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Mappa del Sito</h1>
          <p className="text-xl text-white/90">
            Naviga facilmente tra tutti i contenuti di FishandTips
          </p>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Pagine Principali */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pagine Principali</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <ul className="space-y-3">
                <li>
                  <Link href="/" className="text-brand-blue hover:text-brand-blue-dark font-medium">
                    Home
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Pagina principale con contenuti in evidenza</p>
                </li>
                <li>
                  <Link href="/articoli" className="text-brand-blue hover:text-brand-blue-dark font-medium">
                    Articoli
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Tutti gli articoli organizzati per categoria</p>
                </li>
                <li>
                  <Link href="/chi-siamo" className="text-brand-blue hover:text-brand-blue-dark font-medium">
                    Chi Siamo
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Conosci il team di FishandTips</p>
                </li>
                <li>
                  <Link href="/contatti" className="text-brand-blue hover:text-brand-blue-dark font-medium">
                    Contatti
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Contattaci per domande o collaborazioni</p>
                </li>
                <li>
                  <Link href="/registrazione" className="text-brand-blue hover:text-brand-blue-dark font-medium">
                    Newsletter
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Iscriviti per contenuti personalizzati</p>
                </li>
              </ul>
            </div>
          </div>

          {/* Categorie */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Categorie</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              {categories && categories.length > 0 ? (
                <ul className="space-y-3">
                  {categories
                    .filter((category: any) => category.slug && typeof category.slug === 'string' && category.title) // Filtra categorie valide
                    .map((category: any, index: number) => (
                      <li key={`${category.slug}-${index}`}>
                        <Link 
                          href={`/categoria/${category.slug}`} 
                          className="text-brand-blue hover:text-brand-blue-dark font-medium"
                        >
                          {category.title}
                        </Link>
                        {category.description && (
                          <p className="text-gray-600 text-sm mt-1">{category.description}</p>
                        )}
                      </li>
                    ))}
                </ul>
              ) : (
                <p className="text-gray-500">Nessuna categoria disponibile al momento.</p>
              )}
            </div>
          </div>

          {/* Articoli Recenti */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Articoli Recenti</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              {recentPosts && recentPosts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {recentPosts
                    .filter((post: any) => post.slug && typeof post.slug === 'string' && post.title) // Filtra articoli validi
                    .map((post: any, index: number) => (
                      <div key={`${post.slug}-${index}`} className="border-b border-gray-100 pb-3 last:border-b-0">
                        <Link 
                          href={`/articoli/${post.slug}`} 
                          className="text-brand-blue hover:text-brand-blue-dark font-medium"
                        >
                          {post.title}
                        </Link>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <span>{new Date(post.publishedAt).toLocaleDateString('it-IT')}</span>
                          {post.category && (
                            <>
                              <span className="mx-2">•</span>
                              <span>{post.category}</span>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-gray-500">Nessun articolo disponibile al momento.</p>
              )}
            </div>
          </div>

          {/* Pagine Legali */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Pagine Legali</h2>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Link href="/privacy" className="text-brand-blue hover:text-brand-blue-dark font-medium">
                    Privacy Policy
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Come gestiamo i tuoi dati</p>
                </div>
                <div>
                  <Link href="/termini" className="text-brand-blue hover:text-brand-blue-dark font-medium">
                    Termini di Servizio
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Condizioni di utilizzo del sito</p>
                </div>
                <div>
                  <Link href="/newsletter/unsubscribe" className="text-brand-blue hover:text-brand-blue-dark font-medium">
                    Disiscriviti Newsletter
                  </Link>
                  <p className="text-gray-600 text-sm mt-1">Gestisci le tue iscrizioni</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
