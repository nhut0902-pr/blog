'use client';

import { useState, useEffect } from 'react';
import { Bookmark } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface BookmarkButtonProps {
    postId: string;
}

export default function BookmarkButton({ postId }: BookmarkButtonProps) {
    const [bookmarked, setBookmarked] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Check if post is bookmarked
        fetch(`/api/bookmarks/${postId}`)
            .then((res) => res.json())
            .then((data) => setBookmarked(data.bookmarked))
            .catch(() => setBookmarked(false));
    }, [postId]);

    const handleToggle = async () => {
        setLoading(true);

        try {
            if (bookmarked) {
                // Remove bookmark
                const res = await fetch(`/api/bookmarks/${postId}`, {
                    method: 'DELETE',
                });

                if (res.ok) {
                    setBookmarked(false);
                } else if (res.status === 401) {
                    router.push('/login');
                }
            } else {
                // Add bookmark
                const res = await fetch('/api/bookmarks', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ postId }),
                });

                if (res.ok) {
                    setBookmarked(true);
                } else if (res.status === 401) {
                    router.push('/login');
                }
            }
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all ${bookmarked
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                } disabled:opacity-50`}
            title={bookmarked ? 'Bỏ lưu' : 'Lưu bài viết'}
        >
            <Bookmark
                size={18}
                fill={bookmarked ? 'currentColor' : 'none'}
                className="transition-all"
            />
            <span className="text-sm font-medium">
                {bookmarked ? 'Đã lưu' : 'Lưu'}
            </span>
        </button>
    );
}
