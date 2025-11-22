'use client';

import { useState } from 'react';
import { User, Reply, MessageCircle, Edit2, Trash2, X, Check } from 'lucide-react';
import ReactionButton from './ReactionButton';
import MentionTextarea from './MentionTextarea';

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
    reactions: { type: string; userId: string }[];
    isEdited: boolean;
    editedAt?: string;
    userId: string;
}

interface CommentThreadProps {
    comment: Comment;
    onReply: (parentId: string, content: string) => void;
    depth?: number;
    currentUserId?: string;
}

export default function CommentThread({ comment, onReply, depth = 0, currentUserId }: CommentThreadProps) {
    const [showReplyForm, setShowReplyForm] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState(comment.content);
    const [replyContent, setReplyContent] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [commentData, setCommentData] = useState(comment);

    const handleReplySubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyContent.trim()) return;

        setSubmitting(true);
        await onReply(comment.id, replyContent);
        setReplyContent('');
        setShowReplyForm(false);
        setSubmitting(false);
    };

    const handleEditSubmit = async () => {
        if (!editContent.trim() || editContent === commentData.content) {
            setIsEditing(false);
            return;
        }

        setSubmitting(true);
        try {
            const res = await fetch(`/api/comments/${comment.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: editContent }),
            });

            if (res.ok) {
                const updated = await res.json();
                setCommentData({ ...commentData, content: updated.content, isEdited: true });
                setIsEditing(false);
            } else {
                const error = await res.json();
                alert(error.error || 'Failed to update comment');
            }
        } catch (error) {
            console.error('Error updating comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this comment?')) return;

        try {
            const res = await fetch(`/api/comments/${comment.id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                // Ideally, we should remove it from the list in parent, but for now reload
                window.location.reload();
            }
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const maxDepth = 2; // Limit nesting to 2 levels
    const canReply = depth < maxDepth;

    // Check if editable (within 5 minutes)
    const isAuthor = currentUserId === comment.userId;
    const createdAt = new Date(comment.createdAt).getTime();
    const now = new Date().getTime();
    const isEditable = isAuthor && (now - createdAt) < 5 * 60 * 1000;

    return (
        <div className={`${depth > 0 ? 'ml-8 mt-4' : 'mb-6'}`}>
            <div className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 group">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                        {commentData.user.avatarUrl ? (
                            <img
                                src={commentData.user.avatarUrl}
                                alt={commentData.user.name}
                                className="w-10 h-10 rounded-full"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                <User size={20} className="text-indigo-600 dark:text-indigo-400" />
                            </div>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center space-x-2">
                                <span className="font-medium text-gray-900 dark:text-white">
                                    {commentData.user.name}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(commentData.createdAt).toLocaleDateString('vi-VN')}
                                </span>
                                {commentData.isEdited && (
                                    <span className="text-xs text-gray-400 italic">(edited)</span>
                                )}
                            </div>

                            {isAuthor && (
                                <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isEditable && !isEditing && (
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                                            title="Edit (within 5 mins)"
                                        >
                                            <Edit2 size={14} />
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDelete}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="mt-2">
                                <MentionTextarea
                                    value={editContent}
                                    onChange={setEditContent}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                                    rows={2}
                                />
                                <div className="flex justify-end space-x-2 mt-2">
                                    <button
                                        onClick={() => setIsEditing(false)}
                                        className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                    >
                                        <X size={18} />
                                    </button>
                                    <button
                                        onClick={handleEditSubmit}
                                        disabled={submitting}
                                        className="p-1 text-green-600 hover:text-green-700"
                                    >
                                        <Check size={18} />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-gray-700 dark:text-gray-300 mb-2 whitespace-pre-wrap">
                                {commentData.content}
                            </p>
                        )}

                        <div className="flex items-center space-x-4 mt-2">
                            <ReactionButton
                                commentId={comment.id}
                                initialReactions={comment.reactions || []}
                                currentUserId={currentUserId}
                            />

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
                </div>

                {showReplyForm && (
                    <form onSubmit={handleReplySubmit} className="mt-4 ml-13">
                        <MentionTextarea
                            value={replyContent}
                            onChange={setReplyContent}
                            placeholder="Viết câu trả lời... (gõ @ để nhắc đến ai đó)"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                            rows={3}
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
                            currentUserId={currentUserId}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
