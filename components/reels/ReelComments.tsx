'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Send, Loader2 } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
}

interface ReelCommentsProps {
    reelId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ReelComments({ reelId, isOpen, onClose }: ReelCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isOpen) {
            fetchComments();
            inputRef.current?.focus();
        }
    }, [isOpen, reelId]);

    const fetchComments = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/reels/${reelId}/comments`);
            const data = await res.json();
            if (res.ok) {
                setComments(data);
            }
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || sending) return;

        setSending(true);
        try {
            const res = await fetch(`/api/reels/${reelId}/comments`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: newComment })
            });

            if (res.ok) {
                const comment = await res.json();
                setComments([comment, ...comments]);
                setNewComment('');
            }
        } catch (error) {
            console.error('Failed to send comment:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();
        const minutes = Math.floor(diff / 60000);
        const hours = Math.floor(diff / 3600000);
        const days = Math.floor(diff / 86400000);

        if (minutes < 1) return 'Vừa xong';
        if (minutes < 60) return `${minutes} phút trước`;
        if (hours < 24) return `${hours} giờ trước`;
        return `${days} ngày trước`;
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60"
                onClick={onClose}
            />

            {/* Comments panel */}
            <div className="relative w-full max-w-lg bg-slate-900 rounded-t-2xl max-h-[70vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
                    <h3 className="text-white font-semibold">Bình luận</h3>
                    <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Comments list */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="w-6 h-6 text-cyan-400 animate-spin" />
                        </div>
                    ) : comments.length === 0 ? (
                        <p className="text-center text-slate-500 py-8">Chưa có bình luận nào</p>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                {comment.user.avatarUrl ? (
                                    <img
                                        src={comment.user.avatarUrl}
                                        alt={comment.user.name}
                                        className="w-9 h-9 rounded-full"
                                    />
                                ) : (
                                    <div className="w-9 h-9 rounded-full bg-cyan-500 flex items-center justify-center">
                                        <span className="text-white text-sm font-bold">
                                            {comment.user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                )}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-white font-medium text-sm">
                                            {comment.user.name}
                                        </span>
                                        <span className="text-slate-500 text-xs">
                                            {formatTime(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-slate-300 text-sm mt-1">
                                        {comment.content}
                                    </p>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Input */}
                <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
                    <div className="flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            placeholder="Thêm bình luận..."
                            className="flex-1 bg-slate-800 border border-slate-700 rounded-full px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                        />
                        <button
                            type="submit"
                            disabled={!newComment.trim() || sending}
                            className="p-2 bg-cyan-500 rounded-full disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {sending ? (
                                <Loader2 className="w-5 h-5 text-white animate-spin" />
                            ) : (
                                <Send className="w-5 h-5 text-white" />
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
