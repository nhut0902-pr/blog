'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import TagInput from './TagInput';
import CategorySelect from './CategorySelect';
import ImageUpload from './ImageUpload';

interface PostFormProps {
    initialData?: {
        title: string;
        content: string;
        published: boolean;
        tags?: string[];
        category?: string;
        imageUrl?: string;
    };
    onSubmit: (data: {
        title: string;
        content: string;
        published: boolean;
        tags: string[];
        category: string;
        imageUrl: string;
    }) => Promise<void>;
    isEditing?: boolean;
}

export default function PostForm({ initialData, onSubmit, isEditing = false }: PostFormProps) {
    const [title, setTitle] = useState(initialData?.title || '');
    const [content, setContent] = useState(initialData?.content || '');
    const [published, setPublished] = useState(initialData?.published || false);
    const [tags, setTags] = useState<string[]>(initialData?.tags || []);
    const [category, setCategory] = useState(initialData?.category || '');
    const [imageUrl, setImageUrl] = useState(initialData?.imageUrl || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await onSubmit({ title, content, published, tags, category, imageUrl });
            // Refresh the router cache first
            router.refresh();
            // Small delay to ensure cache is cleared
            await new Promise(resolve => setTimeout(resolve, 100));
            // Add timestamp to force refresh
            router.push(`/admin?t=${Date.now()}`);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-sm border border-gray-200">
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                    Title
                </label>
                <input
                    type="text"
                    id="title"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                    Content
                </label>
                <textarea
                    id="content"
                    required
                    rows={10}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
            </div>

            <div>
                <ImageUpload value={imageUrl} onChange={setImageUrl} label="Ảnh bài viết (tùy chọn)" />
            </div>

            <div>
                <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
                    Tags
                </label>
                <TagInput value={tags} onChange={setTags} placeholder="Nhập tag và nhấn Enter..." />
            </div>

            <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Danh mục
                </label>
                <CategorySelect value={category} onChange={setCategory} />
            </div>

            <div className="flex items-center">
                <input
                    id="published"
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="published" className="ml-2 block text-sm text-gray-900">
                    Publish immediately
                </label>
            </div>

            {error && (
                <div className="text-red-500 text-sm bg-red-50 p-2 rounded-md">
                    {error}
                </div>
            )}

            <div className="flex justify-end">
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="mr-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                    {loading ? 'Saving...' : isEditing ? 'Update Post' : 'Create Post'}
                </button>
            </div>
        </form>
    );
}
