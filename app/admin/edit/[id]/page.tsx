'use client';

import { useEffect, useState, use } from 'react';
import PostForm from '@/components/PostForm';
import { useRouter } from 'next/navigation';

export default function EditPostPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const [post, setPost] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetch(`/api/posts/${id}`)
            .then((res) => res.json())
            .then((data) => {
                if (data.error) {
                    router.push('/admin');
                } else {
                    setPost(data);
                }
            })
            .catch(() => router.push('/admin'))
            .finally(() => setLoading(false));
    }, [id, router]);

    const handleSubmit = async (data: {
        title: string;
        content: string;
        published: boolean;
        tags: string[];
        category: string;
        imageUrl: string;
    }) => {
        const res = await fetch(`/api/posts/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Failed to update post');
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;
    if (!post) return null;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Edit Post</h1>
            <PostForm
                initialData={{
                    title: post.title,
                    content: post.content,
                    published: post.published,
                    tags: post.tags || [],
                    category: post.category || '',
                    imageUrl: post.imageUrl || '',
                }}
                onSubmit={handleSubmit}
                isEditing
            />
        </div>
    );
}
