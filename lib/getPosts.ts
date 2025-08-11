import client from '../sanityClient';

export async function getPosts() {
  return await client.fetch(`*[_type == "post" && status == "published"] | order(_createdAt desc){
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
    body
  }`);
}
