import client from '../sanityClient';

export async function getPosts() {
  return await client.fetch(`*[_type == "post" && status == "published" && publishedAt <= $now] | order(publishedAt desc){
    _id,
    title,
    slug,
    mainImage{
      asset->{url}
    },
    publishedAt,
    "author": author->name,
    "categories": categories[]->{title, "slug": slug.current},
    excerpt,
    body,
        showYouTubeVideo,
        youtubeUrl,
        youtubeTitle,
        youtubeDescription
  }`, { now: new Date().toISOString() }, {
    // Temporaneo: 0 per bust cache dati articoli (ripristinare 3600 dopo verifica produzione)
    next: { revalidate: 0 }
  });
}
