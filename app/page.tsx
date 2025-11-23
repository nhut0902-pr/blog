'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import { MessageSquare, Heart, Calendar, User, X, Loader2 } from 'lucide-react';
import PopularPosts from '@/components/PopularPosts';

export default function HomePage() {
  const [posts, setPosts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [allTags, setAllTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Fetch categories
    fetch('/api/categories')
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(console.error);
  }, []);

  const fetchPosts = useCallback(async (reset = false) => {
    if (reset) {
      setLoading(true);
      setPosts([]);
      setNextCursor(null);
      setHasMore(true);
    } else {
      setLoadingMore(true);
    }

    const params = new URLSearchParams();
    if (selectedCategory) params.append('category', selectedCategory);
    if (selectedTag) params.append('tag', selectedTag);
    if (!reset && nextCursor) params.append('cursor', nextCursor);
    params.append('limit', '10');

    try {
      const res = await fetch(`/api/posts?${params.toString()}`, { cache: 'no-store' });
      const data = await res.json();

      if (reset) {
        setPosts(data.posts);
      } else {
        setPosts((prev) => [...prev, ...data.posts]);
      }

      setNextCursor(data.nextCursor);
      setHasMore(data.hasMore);

      // Extract all unique tags
      const tags = new Set<string>();
      data.posts.forEach((post: any) => {
        post.tags?.forEach((tag: string) => tags.add(tag));
      });
      if (reset) {
        setAllTags(Array.from(tags).sort());
      } else {
        setAllTags((prev) => Array.from(new Set([...prev, ...Array.from(tags)])).sort());
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [selectedCategory, selectedTag, nextCursor]);

  useEffect(() => {
    fetchPosts(true);
  }, [selectedCategory, selectedTag]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !loading) {
          fetchPosts(false);
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [hasMore, loadingMore, loading, fetchPosts]);

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedTag('');
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
            Blog Của Chúng Tôi
          </h1>
          <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 px-4">
            Khám phá những bài viết mới nhất và thú vị nhất
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Filters */}
            <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Danh mục
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Tất cả danh mục</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.slug}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Tag Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tag
                  </label>
                  <select
                    value={selectedTag}
                    onChange={(e) => setSelectedTag(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Tất cả tags</option>
                    {allTags.map((tag) => (
                      <option key={tag} value={tag}>
                        {tag}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Active Filters */}
              {(selectedCategory || selectedTag) && (
                <div className="mt-4 flex items-center gap-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Đang lọc:</span>
                  {selectedCategory && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200">
                      {categories.find((c) => c.slug === selectedCategory)?.name}
                      <button
                        onClick={() => setSelectedCategory('')}
                        className="ml-2 hover:text-indigo-600 dark:hover:text-indigo-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  {selectedTag && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                      #{selectedTag}
                      <button
                        onClick={() => setSelectedTag('')}
                        className="ml-2 hover:text-purple-600 dark:hover:text-purple-400"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 underline"
                  >
                    Xóa tất cả
                  </button>
                </div>
              )}
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                <p className="mt-4 text-gray-600 dark:text-gray-400">Đang tải...</p>
              </div>
            )}

            {/* Posts Grid */}
            {!loading && posts.length === 0 && (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Chưa có bài viết nào
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {selectedCategory || selectedTag
                    ? 'Không tìm thấy bài viết với bộ lọc này'
                    : 'Hãy quay lại sau nhé!'}
                </p>
              </div>
            )}

            {!loading && posts.length > 0 && (
              <div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2">
                {posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/blog/${post.id}`}
                    className="group bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-indigo-200 dark:hover:border-indigo-500 flex flex-col h-full"
                  >
                    {/* Image */}
                    {post.imageUrl && (
                      <div className="aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                        <img
                          src={post.imageUrl}
                          alt={post.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}

                    <div className="p-6 flex flex-col flex-grow">
                      {/* Category & Tags */}
                      <div className="flex flex-wrap gap-2 mb-3">
                        {post.category && (
                          <span className="px-2 py-1 text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200 rounded-md">
                            {categories.find((c) => c.slug === post.category)?.name || post.category}
                          </span>
                        )}
                        {post.tags?.slice(0, 2).map((tag: string) => (
                          <span
                            key={tag}
                            className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-md"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                        {post.title}
                      </h2>

                      {/* Content Preview */}
                      <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 flex-grow">
                        {post.content.substring(0, 150)}...
                      </p>

                      {/* Meta Info */}
                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center">
                            <User size={16} className="mr-1" />
                            <span className="truncate max-w-[80px]">{post.author.name}</span>
                          </div>
                          <div className="flex items-center">
                            <Calendar size={16} className="mr-1" />
                            <span>{new Date(post.createdAt).toLocaleDateString('vi-VN')}</span>
                          </div>
                        </div>
                      </div>

                      {/* Engagement */}
                      <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center">
                          <MessageSquare size={16} className="mr-1" />
                          <span>{post._count.comments}</span>
                        </div>
                        <div className="flex items-center">
                          <Heart size={16} className="mr-1" />
                          <span>{post._count.likes}</span>
                        </div>
                        <div className="flex items-center ml-auto">
                          <span className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded-full">
                            {post.views || 0} views
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Loading more indicator */}
            {loadingMore && (
              <div className="flex justify-center py-8">
                <Loader2 className="animate-spin text-indigo-600" size={32} />
              </div>
            )}

            {/* Observer target for infinite scroll */}
            {!loading && hasMore && (
              <div ref={observerTarget} className="h-20" />
            )}

            {/* End of results */}
            {!loading && !hasMore && posts.length > 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                Đã hiển thị tất cả bài viết
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-8">
            <PopularPosts />

            {/* Newsletter or other widgets could go here */}
            <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-xl font-bold mb-2">Đăng ký nhận tin</h3>
              <p className="text-indigo-100 mb-4 text-sm">
                Nhận những bài viết mới nhất và ưu đãi độc quyền qua email.
              </p>
              <div className="space-y-2">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="w-full px-4 py-2 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button className="w-full bg-white text-indigo-600 font-semibold py-2 rounded-lg hover:bg-indigo-50 transition-colors">
                  Đăng ký ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
