'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import Link from 'next/link';
import ImageUpload from '@/components/ImageUpload';
import TagInput from '@/components/TagInput';

interface SourceCode {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    demoUrl?: string;
    downloadUrl?: string;
    tags: string[];
    category?: string;
    featured: boolean;
    active: boolean;
}

export default function EditSourceCodePage() {
    const router = useRouter();
    const params = useParams();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
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
        featured: false,
        active: true
    });

    useEffect(() => {
        if (params.id) {
            fetchSourceCode();
        }
    }, [params.id]);

    const fetchSourceCode = async () => {
        try {
            const res = await fetch(`/api/store/${params.id}`);
            const data = await res.json();
            
            if (res.ok) {
                setFormData({
                    title: data.title,
                    description: data.description,
                    price: data.price.toString(),
                    imageUrl: data.imageUrl || '',
                    demoUrl: data.demoUrl || '',
                    downloadUrl: data.downloadUrl || '',
                    tags: data.tags || [],
                    category: data.category || '',
                    featured: data.featured,
                    active: data.active
                });
            } else {
                setError('Không tìm thấy sản phẩm');
            }
        } catch (err) {
            setError('Có lỗi xảy ra khi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError('');

        try {
            const res = await fetch(`/api/store/${params.id}`, {
                method: 'PUT',
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
                setError(data.error || 'Cập nhật sản phẩm thất bại');
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-mono">LOADING_PRODUCT...</p>
                </div>
            </div>
        );
    }

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
                        <span className="text-cyan-400">&gt;_</span> EDIT_PRODUCT
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

                    {/* Checkboxes */}
                    <div className="flex items-center space-x-6">
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

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="active"
                                checked={formData.active}
                                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                                className="w-4 h-4 text-cyan-600 bg-slate-800 border-slate-700 rounded focus:ring-cyan-500"
                            />
                            <label htmlFor="active" className="ml-2 text-slate-300 font-mono">
                                ACTIVE_PRODUCT
                            </label>
                        </div>
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
                            disabled={saving}
                            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded flex items-center font-mono transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50"
                        >
                            {saving ? (
                                <Loader2 size={18} className="animate-spin mr-2" />
                            ) : (
                                <Save size={18} className="mr-2" />
                            )}
                            {saving ? 'UPDATING...' : 'UPDATE_PRODUCT'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}