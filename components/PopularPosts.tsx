'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, TrendingUp } from 'lucide-react';

interface PopularPost {
    id: string;
    title: string;
    views: number;
    imageUrl: string | null;
    createdAt: string;
    author: {
        name: string | null;
    };
}

export default function PopularPosts() {
    const [posts, setPosts] = useState<PopularPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularPosts = async () => {
            try {
                const res = await fetch('/api/posts/popular');
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error('Error fetching popular posts:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopularPosts();
    }, []);

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-4"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (posts.length === 0) return null;

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center">
                <TrendingUp className="w-5 h-5 mr-2 text-indigo-600" />
                Popular Posts
            </h3>
            <div className="space-y-4">
                {posts.map((post) => (
                    <Link
                        key={post.id}
                        href={`/blog/${post.id}`}
                        className="flex gap-4 group"
                    >
                        <div className="flex-shrink-0 w-16 h-16 relative rounded-md overflow-hidden bg-gray-100 dark:bg-gray-700">
                            {post.imageUrl ? (
                                <img
                                    src={post.imageUrl}
                                    alt={post.title}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <TrendingUp size={20} />
                                </div>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                {post.title}
                            </h4>
                            <div className="flex items-center mt-1 text-xs text-gray-500 dark:text-gray-400">
                                <Eye size={12} className="mr-1" />
                                {post.views} views
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
