'use client';

import { useState } from 'react';
import { Heart } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    initialLiked: boolean;
}

export default function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [liked, setLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    const router = useRouter();

    const handleLike = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/posts/${postId}/like`, {
                method: 'POST',
            });

            if (res.ok) {
                const data = await res.json();
                setLiked(data.liked);
                setLikes((prev) => (data.liked ? prev + 1 : prev - 1));
            }
        } catch (error) {
            console.error('Error liking post:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleLike}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${liked
                    ? 'bg-pink-50 text-pink-600 hover:bg-pink-100'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
        >
            <Heart
                size={20}
                className={`transition-transform duration-200 ${liked ? 'fill-current scale-110' : ''}`}
            />
            <span className="font-medium">{likes}</span>
        </button>
    );
}
