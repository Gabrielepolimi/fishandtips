import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { sanityClient, urlFor } from '../../sanityClient';

type AwardGroup = {
  title: string;
  subtitle: string;
  items: {
    name: string;
    slug: string;
    blurb: string;
  }[];
};

type AwardPost = {
  title: string;
  slug: string;
  excerpt?: string;
  mainImage?: any;
  seoImage?: string;
};

export const dynamic = 'force-dynamic';
export const revalidate = 1800;

export const metadata: Metadata = {
  title: '10 Eccellenze Italiane della Pesca 2026 | Brand, Negozi, Progetti',
  description:
    'Le 10 eccellenze italiane della pesca 2026: brand, negozi, scuole e professionisti premiati da FishandTips. Scopri chi ha alzato l’asticella e leggi gli articoli dedicati.',
  alternates: {
    canonical: 'https://fishandtips.it/migliori-pesca-2026',
  },
  openGraph: {
    title: '10 Eccellenze Italiane della Pesca 2026',
    description:
      'Le 10 eccellenze italiane della pesca 2026: brand, negozi, scuole e professionisti premiati da FishandTips.',
    type: 'website',
    url: 'https://fishandtips.it/migliori-pesca-2026',
  },
  twitter: {
    card: 'summary_large_image',
    title: '10 Eccellenze Italiane della Pesca 2026',
    description:
      'Le 10 eccellenze italiane della pesca 2026: brand, negozi, scuole e professionisti premiati da FishandTips.',
  },
};

const awardGroups: AwardGroup[] = [
  {
    title: 'Brand / Aziende di attrezzatura',
    subtitle: 'Eccellenze italiane tra innovazione, R&D e legame con l’agonismo.',
    items: [
      {
        name: 'Trabucco Fishing Diffusion',
        slug: 'trabucco-storia-qualita-e-riferimento-nella-pesca-sportiva',
        blurb: 'Storico brand italiano: canne, pasture, galleggianti, made in Italy.',
      },
      {
        name: 'Colmic',
        slug: 'colmic-eccellenza-italiana-premiata-tra-i-migliori-della-pesca-2026',
        blurb: 'Riferimento per agonismo e pesca sportiva, forte R&D e team di campioni.',
      },
      {
        name: 'Tubertini',
        slug: 'tubertini-tradizione-e-innovazione-tra-i-migliori-della-pesca-2026',
        blurb: 'Leader italiano con produzione interna e innovazione tecnica continua.',
      },
      {
        name: 'Top Game Fishing',
        slug: 'top-game-fishing-tra-i-migliori-della-pesca-2026',
        blurb: 'Specialisti big game, traina e accessori nautici, 100% made in Italy.',
      },
    ],
  },
  {
    title: 'Negozi di pesca (fisici + online)',
    subtitle: 'Store selezionati per servizio, assortimento e valore educativo.',
    items: [
      {
        name: 'Fisherlandia',
        slug: 'fisherlandia-30-anni-di-passione-per-la-pesca-sportiva',
        blurb: 'Storico negozio + e-commerce con forte presenza educativa (YouTube, tutorial).',
      },
      {
        name: 'Sampey',
        slug: 'sampey-eccellenza-italiana-tra-i-migliori-della-pesca-2026',
        blurb: 'E-commerce multisettore pesca/sub/nautica/outdoor, riconosciuto in Italia e fuori.',
      },
      {
        name: 'FishingItalia.com',
        slug: 'fishingitalia-com-e-tra-i-migliori-della-pesca-2026',
        blurb: 'Specialisti feeder/colpo/agonismo, fondato da un campione del mondo.',
      },
      {
        name: 'Todaro Sport',
        slug: 'todaro-sport-tra-i-migliori-della-pesca-2026',
        blurb: 'Negozio fisico + online pesca e subacquea, radicato sul territorio laziale.',
      },
    ],
  },
  {
    title: 'Scuole / Progetti / Associazioni',
    subtitle: 'Formazione, comunità e progetti educativi sul territorio.',
    items: [
      {
        name: 'Fishing Accademy',
        slug: 'fishing-accademy-tra-i-migliori-della-pesca-2026',
        blurb: 'Associazione sportiva e scuola di pesca con lago e progetti educativi (FIPSAS).',
      },
      {
        name: 'Stefano Adami',
        slug: 'stefano-adami-tra-i-migliori-della-pesca-2026',
        blurb: 'Guida di pesca, divulgatore e videomaker: contenuti, uscite e progetti premiati.',
      },
    ],
  },
];

const awardSlugs = awardGroups.flatMap((group) => group.items.map((item) => item.slug));
const awardLinks = awardGroups.flatMap((group) => group.items.map((item) => ({ name: item.name, slug: item.slug })));

const serviceLinks = [
  { title: 'Calendario Pesca', description: 'Mesi migliori e specie target', href: '/calendario-pesca' },
  { title: 'Spot di Pesca in Italia', description: 'Mappe e spot per regione', href: '/spot-pesca-italia' },
  { title: 'Trova Attrezzatura', description: 'Consigli su canne, mulinelli, esche', href: '/trova-attrezzatura' },
];

async function fetchAwardPosts(): Promise<Record<string, AwardPost>> {
  const posts = await sanityClient.fetch<AwardPost[]>(
    `*[_type == "post" && slug.current in $slugs && status != "archived"]{
      title,
      "slug": slug.current,
      excerpt,
      mainImage,
      "seoImage": seoImage.asset->url
    }`,
    { slugs: awardSlugs }
  );

  return posts.reduce<Record<string, AwardPost>>((acc, post) => {
    acc[post.slug] = post;
    return acc;
  }, {});
}

function getImageUrl(post?: AwardPost) {
  if (!post) return null;
  if (post.seoImage) return post.seoImage;
  if (post.mainImage) return urlFor(post.mainImage).url(); // nessun resize forzato
  return null;
}

export default async function MiglioriPesca2026Page() {
  const postsBySlug = await fetchAwardPosts();

  return (
    <div className="min-h-screen bg-white">
      <section className="bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <nav className="flex items-center gap-2 text-sm mb-6 text-blue-100/80">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="text-blue-200/60">/</span>
            <span className="text-white font-semibold">Migliori della Pesca 2026</span>
          </nav>

          <div className="max-w-3xl space-y-4">
            <p className="inline-flex px-3 py-1 rounded-full bg-white/10 text-xs font-semibold uppercase tracking-wide text-blue-100">
              Lista ufficiale 2026 · 10 eccellenze italiane della pesca
            </p>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Le 10 Eccellenze Italiane della Pesca 2026
            </h1>
            <p className="text-lg text-blue-100/90 leading-relaxed">
              Selezione delle 10 eccellenze italiane che nel 2025 si sono contraddistinte per contenuti,
              prodotti innovativi, servizi e progetti apprezzati dalla community. FishandTips le premia e le consiglia
              come scelte di riferimento per pescatori e appassionati nel 2026. Ogni scheda porta all&apos;articolo dedicato.
            </p>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {awardGroups.map((group) => (
          <div key={group.title} className="space-y-6">
            <div>
              <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">
                {group.title}
              </p>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">{group.subtitle}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {group.items.map((item) => {
                const post = postsBySlug[item.slug];
                const imageUrl = getImageUrl(post);

                return (
                  <Link
                    key={item.slug}
                    href={`/articoli/${item.slug}`}
                    className="group"
                  >
                    <article className="relative overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="flex flex-col sm:flex-row">
                        <div className="sm:w-48 sm:flex-shrink-0 bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-center">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={post?.title || item.name}
                              width={320}
                              height={180}
                              className="max-h-24 sm:max-h-28 w-auto h-auto object-contain transition-transform duration-500 group-hover:scale-105"
                              priority={false}
                              sizes="(max-width: 640px) 200px, 240px"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-700 text-2xl font-semibold">
                              {item.name
                                .split(' ')
                                .map((word) => word[0])
                                .join('')
                                .slice(0, 3)
                                .toUpperCase()}
                            </div>
                          )}
                        </div>

                        <div className="p-5 flex-1 space-y-3">
                          <div className="flex items-center gap-2 text-xs font-semibold text-blue-700 uppercase tracking-wide">
                            <span>Premiati 2026</span>
                            <span className="text-gray-300">•</span>
                            <span>Selezione ufficiale</span>
                          </div>
                          <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
                            {post?.title || item.name}
                          </h3>
                          <p className="text-gray-600 leading-relaxed">
                            {post?.excerpt || item.blurb}
                          </p>
                          <div className="inline-flex items-center text-blue-700 font-semibold text-sm">
                            Leggi l&apos;articolo
                            <svg
                              className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              aria-hidden="true"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </article>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>

      {/* Servizi utili */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Servizi utili</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Strumenti veloci di FishandTips</h2>
            <p className="text-gray-600">
              Risorse pratiche per pianificare uscite, scegliere attrezzatura e trovare nuovi spot.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {serviceLinks.map((service) => (
              <Link
                key={service.href}
                href={service.href}
                className="group rounded-2xl border border-gray-200 bg-white p-4 hover:shadow-md transition-all"
              >
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
                <div className="mt-3 inline-flex items-center text-blue-700 text-sm font-semibold">
                  Apri
                  <svg className="w-4 h-4 ml-1 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Cross-link articoli premiati */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Articoli premiati</p>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Approfondisci le 10 realtà selezionate</h2>
            <p className="text-gray-600">Raggiungi direttamente gli articoli dedicati a brand, negozi, scuole e professionisti.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {awardLinks.map((item) => (
              <Link
                key={item.slug}
                href={`/articoli/${item.slug}`}
                className="rounded-xl border border-gray-200 px-4 py-3 bg-white hover:border-blue-200 hover:shadow-sm transition-all flex items-center justify-between"
              >
                <span className="text-sm font-semibold text-gray-900">{item.name}</span>
                <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
