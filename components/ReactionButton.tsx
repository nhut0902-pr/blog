'use client';

import { useState } from 'react';
import { ThumbsUp, Heart, Smile, Frown, Angry } from 'lucide-react';

interface ReactionButtonProps {
    commentId: string;
    initialReactions: { type: string; userId: string }[];
    currentUserId?: string;
}

const REACTION_ICONS: Record<string, any> = {
    LIKE: ThumbsUp,
    LOVE: Heart,
    HAHA: Smile,
    SAD: Frown,
    ANGRY: Angry,
};

const REACTION_COLORS: Record<string, string> = {
    LIKE: 'text-blue-500',
    LOVE: 'text-red-500',
    HAHA: 'text-yellow-500',
    SAD: 'text-purple-500',
    ANGRY: 'text-orange-500',
};

export default function ReactionButton({ commentId, initialReactions, currentUserId }: ReactionButtonProps) {
    const [reactions, setReactions] = useState(initialReactions);
    const [showPicker, setShowPicker] = useState(false);
    const [loading, setLoading] = useState(false);

    const userReaction = currentUserId ? reactions.find(r => r.userId === currentUserId) : null;

    const handleReact = async (type: string) => {
        if (!currentUserId || loading) return;
        setLoading(true);
        setShowPicker(false);

        // Optimistic update
        const previousReactions = [...reactions];
        let newReactions = [...reactions];

        if (userReaction) {
            if (userReaction.type === type) {
                // Remove
                newReactions = newReactions.filter(r => r.userId !== currentUserId);
            } else {
                // Update
                newReactions = newReactions.map(r => r.userId === currentUserId ? { ...r, type } : r);
            }
        } else {
            // Add
            newReactions.push({ type, userId: currentUserId });
        }
        setReactions(newReactions);

        try {
            const res = await fetch(`/api/comments/${commentId}/react`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type }),
            });

            if (!res.ok) {
                throw new Error('Failed to react');
            }
        } catch (error) {
            console.error(error);
            setReactions(previousReactions); // Rollback
        } finally {
            setLoading(false);
        }
    };

    // Group reactions by type for display
    const reactionCounts = reactions.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setShowPicker(!showPicker)}
                className={`flex items-center space-x-1 text-sm ${userReaction ? REACTION_COLORS[userReaction.type] : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
            >
                {userReaction ? (
                    (() => {
                        const Icon = REACTION_ICONS[userReaction.type];
                        return <Icon size={16} />;
                    })()
                ) : (
                    <ThumbsUp size={16} />
                )}
                <span>{reactions.length > 0 ? reactions.length : 'Like'}</span>
            </button>

            {/* Reaction Picker */}
            {showPicker && (
                <div className="absolute bottom-full left-0 mb-2 bg-white dark:bg-gray-800 shadow-lg rounded-full px-2 py-1 flex gap-2 border border-gray-200 dark:border-gray-700 z-10 animate-in fade-in zoom-in duration-200">
                    {Object.entries(REACTION_ICONS).map(([type, Icon]) => (
                        <button
                            key={type}
                            onClick={() => handleReact(type)}
                            className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${userReaction?.type === type ? 'bg-gray-100 dark:bg-gray-700' : ''}`}
                            title={type.toLowerCase()}
                        >
                            <Icon size={20} className={REACTION_COLORS[type]} />
                        </button>
                    ))}
                </div>
            )}

            {/* Overlay to close picker */}
            {showPicker && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setShowPicker(false)}
                />
            )}
        </div>
    );
}
