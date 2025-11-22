'use client';

import PostForm from '@/components/PostForm';

export default function CreatePostPage() {
    const handleSubmit = async (data: {
        title: string;
        content: string;
        published: boolean;
        tags: string[];
        category: string;
        imageUrl: string;
    }) => {
        const res = await fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            throw new Error('Failed to create post');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Post</h1>
            <PostForm onSubmit={handleSubmit} />
        </div>
    );
}
