'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { MessageCircle, Send } from 'lucide-react';
import CommentThread from './CommentThread';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        name: string;
        email: string;
        avatarUrl?: string;
    };
    replies?: Comment[];
}

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const res = await fetch(`/api/posts/${postId}/comments`, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setComments(data);
            }
        } catch (error) {
            console.error('Error fetching comments:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }
        if (!newComment.trim()) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment }),
            });

            if (res.ok) {
                setNewComment('');
                fetchComments(); // Refetch to get nested structure
            }
        } catch (error) {
            console.error('Error posting comment:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleReply = async (parentId: string, content: string) => {
        try {
            const res = await fetch(`/api/posts/${postId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, parentId }),
            });

            if (res.ok) {
                fetchComments(); // Refetch to update tree
            }
        } catch (error) {
            console.error('Error posting reply:', error);
        }
    };

    return (
        <div className="mt-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                <MessageCircle className="mr-2" />
                Bình luận ({comments.length})
            </h3>

            {user ? (
                <form onSubmit={handleSubmit} className="mb-10">
                    <div className="flex items-start space-x-4">
                        <div className="flex-grow">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Chia sẻ suy nghĩ của bạn..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all resize-none min-h-[100px]"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Send size={18} className="mr-2" />
                            Gửi
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 text-center mb-10">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">Đăng nhập để tham gia thảo luận.</p>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-6 py-2 bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition-colors font-medium"
                    >
                        Đăng nhập
                    </button>
                </div>
            )}

            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentThread
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                    />
                ))}
                {comments.length === 0 && (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                        Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!
                    </p>
                )}
            </div>
        </div>
    );
}
