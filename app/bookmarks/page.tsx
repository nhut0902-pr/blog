'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Bookmark, Calendar, MessageSquare, Heart, Trash2 } from 'lucide-react';

export default function BookmarksPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }

        fetchBookmarks();
    }, [user, router]);

    const fetchBookmarks = () => {
        fetch('/api/bookmarks')
            .then((res) => res.json())
            .then((data) => {
                setBookmarks(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    const handleRemove = async (postId: string) => {
        try {
            const res = await fetch(`/api/bookmarks/${postId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchBookmarks();
            }
        } catch (error) {
            console.error('Error removing bookmark:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 flex items-center">
                        <Bookmark className="mr-3 text-indigo-600 dark:text-indigo-400" size={36} />
                        Bài viết đã lưu
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {bookmarks.length} bài viết
                    </p>
                </div>

                {bookmarks.length === 0 ? (
                    <div className="text-center py-20">
                        <Bookmark size={64} className="mx-auto text-gray-300 dark:text-gray-700 mb-4" />
                        <h3 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                            Chưa có bài viết nào
                        </h3>
                        <p className="text-gray-500 dark:text-gray-500 mb-6">
                            Lưu các bài viết yêu thích để đọc lại sau
                        </p>
                        <Link
                            href="/"
                            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Khám phá bài viết
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {bookmarks.map((bookmark) => (
                            <div
                                key={bookmark.id}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                            >
                                {bookmark.post.imageUrl && (
                                    <div className="aspect-video overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-700 dark:to-gray-600">
                                        <img
                                            src={bookmark.post.imageUrl}
                                            alt={bookmark.post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                <div className="p-6">
                                    <Link href={`/blog/${bookmark.post.id}`}>
                                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-2">
                                            {bookmark.post.title}
                                        </h2>
                                    </Link>

                                    <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                                        {bookmark.post.content.substring(0, 150)}...
                                    </p>

                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center space-x-3">
                                            <span className="flex items-center">
                                                <MessageSquare size={16} className="mr-1" />
                                                {bookmark.post._count.comments}
                                            </span>
                                            <span className="flex items-center">
                                                <Heart size={16} className="mr-1" />
                                                {bookmark.post._count.likes}
                                            </span>
                                        </div>

                                        <button
                                            onClick={() => handleRemove(bookmark.post.id)}
                                            className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                            title="Xóa khỏi danh sách"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
