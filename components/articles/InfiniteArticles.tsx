'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

type Post = {
  _id: string;
  title: string;
  slug: { current: string } | string;
  mainImage?: { asset?: { url: string } };
  publishedAt?: string;
  excerpt?: string;
  categories?: { title?: string; slug?: string }[];
};

type Props = {
  initialPosts: Post[];
  total: number;
  perPage?: number;
};

export default function InfiniteArticles({ initialPosts, total, perPage = 12 }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts || []);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState((initialPosts || []).length < total);
  const [error, setError] = useState<string | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const loadMore = async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/posts?offset=${posts.length}&limit=${perPage}`, { cache: 'no-store' });
      if (!res.ok) {
        throw new Error('Errore nel caricamento degli articoli');
      }
      const data = await res.json();
      const newPosts: Post[] = data.posts || [];
      setPosts((prev) => [...prev, ...newPosts]);
      setHasMore(posts.length + newPosts.length < data.total);
    } catch (err: any) {
      setError(err.message || 'Errore nel caricamento');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '400px 0px 400px 0px', threshold: 0 }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [observerRef.current, posts.length, hasMore]); // rely on posts length/hasMore to trigger

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => {
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
                  {post.publishedAt && (
                    <span>{new Date(post.publishedAt).toLocaleDateString('it-IT', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                  )}
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

      {error && (
        <div className="text-center text-sm text-red-600">
          {error}
        </div>
      )}

      <div ref={observerRef} className="h-10 flex items-center justify-center">
        {loading && <span className="text-sm text-gray-500">Caricamento...</span>}
        {!hasMore && !loading && (
          <span className="text-sm text-gray-400">Hai visto tutti gli articoli.</span>
        )}
      </div>
    </div>
  );
}
