import { notFound } from 'next/navigation';
import client from '../../../sanityClient';
import { PortableText } from '@portabletext/react';
import { getPosts } from '../../../lib/getPosts';
import Breadcrumb from '../../../components/articles/Breadcrumb';
import ArticleMeta from '../../../components/articles/ArticleMeta';
import RelatedArticles from '../../../components/articles/RelatedArticles';

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, allPosts] = await Promise.all([
    client.fetch(
      `*[_type == "post" && slug.current == $slug][0]{
        _id,
        title,
        body,
        mainImage{
          asset->{url}
        },
        publishedAt,
        "author": author->name,
        "categories": categories[]->title,
        excerpt
      }`,
      { slug }
    ),
    getPosts()
  ]);

  if (!post) return notFound();

  return (
    <>
      {/* Hero Image */}
      {post.mainImage?.asset?.url && (
        <div className="relative h-96 md:h-[500px] overflow-hidden">
          <img
            src={post.mainImage.asset.url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/30"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 max-w-4xl mx-auto px-4">
                {post.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <Breadcrumb items={[
          { label: 'Articoli', href: '/articoli' },
          { label: post.title }
        ]} />

        {/* Article Header (if no hero image) */}
        {!post.mainImage?.asset?.url && (
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {post.title}
            </h1>
          </header>
        )}

        {/* Article Meta */}
        <ArticleMeta
          publishedAt={post.publishedAt}
          author={post.author}
          categories={post.categories || []}
          readTime={5}
        />

        {/* Article Body */}
        <div className="prose prose-lg max-w-none">
          <PortableText 
            value={post.body}
            components={{
              // Custom components for PortableText
              block: {
                h2: ({children}) => <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">{children}</h2>,
                h3: ({children}) => <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">{children}</h3>,
                normal: ({children}) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
              },
              list: {
                bullet: ({children}) => <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>,
                number: ({children}) => <ol className="list-decimal list-inside mb-4 space-y-2">{children}</ol>,
              },
              listItem: ({children}) => <li className="text-gray-700">{children}</li>,
            }}
          />
        </div>

        {/* Article Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-secondary-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">F</span>
              </div>
              <div>
                <p className="font-semibold text-gray-900">FishandTips</p>
                <p className="text-sm text-gray-600">La tua guida per la pesca sportiva</p>
              </div>
            </div>
            
            <div className="flex space-x-4">
              <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M22.46 6c-.77.35-1.6.58-2.46.69.88-.53 1.56-1.37 1.88-2.38-.83.5-1.75.85-2.72 1.05C18.37 4.5 17.26 4 16 4c-2.35 0-4.27 1.92-4.27 4.29 0 .34.04.67.11.98C8.28 9.09 5.11 7.38 3 4.79c-.37.63-.58 1.37-.58 2.15 0 1.49.75 2.81 1.91 3.56-.71 0-1.37-.2-1.95-.5v.03c0 2.08 1.48 3.82 3.44 4.21a4.22 4.22 0 0 1-1.93.07 4.28 4.28 0 0 0 4 2.98 8.521 8.521 0 0 1-5.33 1.84c-.34 0-.68-.02-1.02-.06C3.44 20.29 5.7 21 8.12 21 16 21 20.33 14.46 20.33 8.79c0-.19 0-.37-.01-.56.84-.6 1.56-1.36 2.14-2.23z"/>
                </svg>
              </button>
              <button className="p-2 text-gray-400 hover:text-primary-600 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </article>

      {/* Related Articles */}
      <RelatedArticles articles={allPosts} currentArticleId={post._id} />
    </>
  );
}
