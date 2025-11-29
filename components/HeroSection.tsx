'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
// import { TrendingUp, Sparkles } from 'lucide-react';
// import SearchBar from './SearchBar';

interface FeaturedPost {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    category: string | null;
    createdAt: Date;
    author: {
        name: string;
    };
}

export default function HeroSection() {
    const [featuredPost, setFeaturedPost] = useState<FeaturedPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch popular posts and display the top one
        fetch('/api/posts/popular')
            .then((res) => res.json())
            .then((data) => {
                console.log('HeroSection data:', data);
                if (Array.isArray(data) && data.length > 0) {
                    setFeaturedPost(data[0]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('HeroSection fetch error:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="relative mb-12">
            {/* Gradient Background với Glassmorphism */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 via-purple-500/20 to-pink-500/20 dark:from-indigo-900/30 dark:via-purple-900/30 dark:to-pink-900/30 rounded-3xl blur-3xl -z-10" />

            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
                    {/* Left: Text Content */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="inline-flex items-center space-x-2 text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                            {/* <Sparkles size={18} className="animate-pulse" /> */}
                            <span>✨ Bài viết nổi bật</span>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                <div className="h-12 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                                <div className="h-24 bg-gray-200 dark:bg-gray-700 rounded-lg animate-pulse" />
                            </div>
                        ) : featuredPost ? (
                            <>
                                <h1 className="text-4xl lg:text-5xl font-black leading-tight text-gray-900 dark:text-white">
                                    {featuredPost.title}
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-3">
                                    {featuredPost.content.substring(0, 200)}...
                                </p>
                                <div className="flex items-center space-x-4 pt-4">
                                    <Link
                                        href={`/blog/${featuredPost.id}`}
                                        className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
                                    >
                                        Đọc ngay
                                        {/* <TrendingUp size={18} className="ml-2" /> */}
                                    </Link>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        <span className="font-medium">{featuredPost.author?.name || 'Unknown'}</span>
                                        <span className="mx-2">•</span>
                                        <span>{new Date(featuredPost.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-black leading-tight text-gray-900 dark:text-white mb-4">
                                    Chào mừng đến với BlogApp
                                </h1>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    Khám phá những bài viết thú vị và chia sẻ kiến thức cùng cộng đồng
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Featured Image hoặc Search */}
                    <div className="flex flex-col justify-center space-y-6">
                        {featuredPost?.imageUrl ? (
                            <div className="relative group">
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent rounded-2xl" />
                                <img
                                    src={featuredPost.imageUrl}
                                    alt={featuredPost.title}
                                    className="w-full h-80 object-cover rounded-2xl shadow-xl group-hover:scale-105 transition-transform duration-500"
                                />
                                {featuredPost.category && (
                                    <div className="absolute top-4 left-4 px-4 py-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                        {featuredPost.category}
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex flex-col justify-center h-full space-y-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                                    Tìm kiếm bài viết
                                </h3>
                                {/* <SearchBar /> */}
                                <div className="p-4 border rounded bg-gray-50 dark:bg-gray-800">
                                    Search Bar Placeholder
                                </div>
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-sm text-gray-500 dark:text-gray-400">Trending:</span>
                                    {['React', 'Next.js', 'TypeScript', 'Design'].map((tag) => (
                                        <button
                                            key={tag}
                                            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm hover:bg-indigo-100 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
