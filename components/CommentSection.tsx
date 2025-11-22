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
    reactions: { type: string; userId: string }[];
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

    // ... existing code

    return (
        <div className="mt-12">
            {/* ... existing code */}

            <div className="space-y-4">
                {comments.map((comment) => (
                    <CommentThread
                        key={comment.id}
                        comment={comment}
                        onReply={handleReply}
                        currentUserId={user?.id}
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
{
    comments.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400 text-center py-8">
            Chưa có bình luận nào. Hãy là người đầu tiên chia sẻ!
        </p>
    )
}
            </div >
        </div >
    );
}
