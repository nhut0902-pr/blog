'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import TagInput from '@/components/TagInput';

export default function CreateSourceCodePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        imageUrl: '',
        demoUrl: '',
        downloadUrl: '',
        tags: [] as string[],
        category: '',
        featured: false
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/store', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    price: parseFloat(formData.price)
                })
            });

            const data = await res.json();

            if (res.ok) {
                router.push('/admin/store');
            } else {
                setError(data.error || 'Tạo sản phẩm thất bại');
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950">
            {/* Tech Background */}
            <div className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
                    backgroundSize: '40px 40px'
                }}
            />

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/admin/store"
                        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4 font-mono transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        BACK_TO_STORE
                    </Link>
                    <h1 className="text-3xl font-bold text-white font-mono">
                        <span className="text-cyan-400">&gt;_</span> CREATE_PRODUCT
                    </h1>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 backdrop-blur-sm space-y-6">
                    {/* Title */}
                    <div>
                        <label className="block text-slate-300 text-sm font-mono mb-2">
                            TITLE *
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Nhập tên sản phẩm..."
                            required
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-slate-300 text-sm font-mono mb-2">
                            DESCRIPTION *
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500 resize-none"
                            placeholder="Mô tả chi tiết sản phẩm..."
                            rows={6}
                            required
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-slate-300 text-sm font-mono mb-2">
                            PRICE (VND) *
                        </label>
                        <input
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="0"
                            min="0"
                            step="1000"
                            required
                        />
                    </div>

                    {/* Image */}
                    <div>
                        <ImageUpload
                            value={formData.imageUrl}
                            onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                            label="PRODUCT_IMAGE"
                        />
                    </div>

                    {/* Demo URL */}
                    <div>
                        <label className="block text-slate-300 text-sm font-mono mb-2">
                            DEMO_URL
                        </label>
                        <input
                            type="url"
                            value={formData.demoUrl}
                            onChange={(e) => setFormData({ ...formData, demoUrl: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="https://demo.example.com"
                        />
                    </div>

                    {/* Download URL */}
                    <div>
                        <label className="block text-slate-300 text-sm font-mono mb-2">
                            DOWNLOAD_URL
                        </label>
                        <input
                            type="url"
                            value={formData.downloadUrl}
                            onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="https://download.example.com"
                        />
                    </div>

                    {/* Tags */}
                    <div>
                        <label className="block text-slate-300 text-sm font-mono mb-2">
                            TECHNOLOGIES
                        </label>
                        <TagInput
                            value={formData.tags}
                            onChange={(tags) => setFormData({ ...formData, tags })}
                            placeholder="Nhập công nghệ (React, Next.js, ...)"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-slate-300 text-sm font-mono mb-2">
                            CATEGORY
                        </label>
                        <input
                            type="text"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-3 text-white focus:outline-none focus:border-cyan-500"
                            placeholder="Web App, Mobile App, ..."
                        />
                    </div>

                    {/* Featured */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                            className="w-4 h-4 text-cyan-600 bg-slate-800 border-slate-700 rounded focus:ring-cyan-500"
                        />
                        <label htmlFor="featured" className="ml-2 text-slate-300 font-mono">
                            FEATURED_PRODUCT
                        </label>
                    </div>

                    {/* Error */}
                    {error && (
                        <div className="bg-red-500/20 border border-red-500/50 rounded p-4">
                            <p className="text-red-400 font-mono text-sm">{error}</p>
                        </div>
                    )}

                    {/* Submit */}
                    <div className="flex justify-end pt-6">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded flex items-center font-mono transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={18} className="animate-spin mr-2" />
                            ) : (
                                <Save size={18} className="mr-2" />
                            )}
                            {loading ? 'CREATING...' : 'CREATE_PRODUCT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}