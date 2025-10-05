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
    "categories": categories[]->title,
    excerpt,
    body,
        showYouTubeVideo,
        youtubeUrl,
        youtubeTitle,
        youtubeDescription
  }`, { now: new Date().toISOString() }, {
    // Disabilita il caching per Vercel
    cache: 'no-store',
    next: { revalidate: 0 }
  });
}
