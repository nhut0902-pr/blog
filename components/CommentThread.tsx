'use client';

import { useState } from 'react';
import { User, Reply, MessageCircle } from 'lucide-react';

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

interface CommentThreadProps {
    comment: Comment;
    onReply: (parentId: string, content: string) => void;
    depth?: number;
}

export default function CommentThread({ comment, onReply, depth = 0 }: CommentThreadProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setSubmitting(true);
        await onReply(comment.id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
        setSubmitting(false);
    };

    const maxDepth = 2; // Limit nesting to 2 levels
    const canReply = depth < maxDepth;

    return (
        <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        {comment.user.avatarUrl ? (
                            <img
                                src={comment.user.avatarUrl}
                                alt={comment.user.name}
                                className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-1">
                            <span className="font-medium text-gray-900 dark:text-white">
                                {comment.user.name}
                            </span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {new Date(comment.createdAt).toLocaleDateString('vi-VN')}
                            </span>
                        </div>

                        <p className="text-gray-700 dark:text-gray-300 mb-2">
                            {comment.content}
                        </p>

                        {canReply && (
                            <button
                                onClick={() => setShowReplyForm(!showReplyForm)}
                                className="flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                            >
                                <Reply size={14} className="mr-1" />
                                Trả lời
                            </button>
                        )}
                    </div>
                </div>

                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="mt-4 ml-13">
                        <textarea
                            value={replyContent}
                            onChange={(e) => setReplyContent(e.target.value)}
                            placeholder="Viết câu trả lời..."
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                            rows={3}
                            disabled={submitting}
                        />
                        <div className="flex space-x-2 mt-2">
                            <button
                                type="submit"
                                disabled={submitting || !replyContent.trim()}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {submitting ? 'Đang gửi...' : 'Gửi'}
                            </button>
                            <button
                                type="button"
                                onClick={() => {
                                    setShowReplyForm(false);
                                    setReplyContent('');
                                }}
                                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                )}
            </div>

            {/* Render replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2">
                    {comment.replies.map((reply) => (
                        <CommentThread
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            depth={depth + 1}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
