'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Star, Eye, Code, ExternalLink, Filter } from 'lucide-react';

interface SourceCode {
    id: string;
    title: string;
    description: string;
    price: number;
    imageUrl?: string;
    demoUrl?: string;
    tags: string[];
    category?: string;
    featured: boolean;
    author: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    _count: {
        purchases: number;
    };
}

export default function StorePage() {
    const [sourceCodes, setSourceCodes] = useState<SourceCode[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'featured'>('all');
    const { addToCart } = useCart();

    useEffect(() => {
        fetchSourceCodes();
    }, [filter]);

    const fetchSourceCodes = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (filter === 'featured') {
                params.append('featured', 'true');
            }

            const res = await fetch(`/api/store?${params.toString()}`);
            const data = await res.json();
            
            if (res.ok) {
                setSourceCodes(data.sourceCodes);
            }
        } catch (error) {
            console.error('Failed to fetch source codes:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
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

            {/* Decorative orbs */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-cyan-600/20 rounded-full blur-[100px]" />
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-indigo-600/20 rounded-full blur-[120px]" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl lg:text-6xl font-bold text-white font-mono mb-4">
                        <span className="text-cyan-400">&gt;_</span> SOURCE_CODE_STORE
                    </h1>
                    <p className="text-xl text-slate-300 max-w-3xl mx-auto">
                        Khám phá và mua các source code chất lượng cao được phát triển bởi đội ngũ chuyên nghiệp
                    </p>
                </div>

                {/* Filters */}
                <div className="flex justify-center mb-8">
                    <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-2 backdrop-blur-sm">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-6 py-2 rounded font-mono text-sm transition-all ${
                                filter === 'all'
                                    ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                    : 'text-slate-400 hover:text-cyan-400'
                            }`}
                        >
                            ALL_PRODUCTS
                        </button>
                        <button
                            onClick={() => setFilter('featured')}
                            className={`px-6 py-2 rounded font-mono text-sm transition-all ml-2 ${
                                filter === 'featured'
                                    ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                    : 'text-slate-400 hover:text-cyan-400'
                            }`}
                        >
                            <Star size={16} className="inline mr-2" />
                            FEATURED
                        </button>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-20">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
                        <p className="mt-4 text-slate-400 font-mono">LOADING_PRODUCTS...</p>
                    </div>
                )}

                {/* Products Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {sourceCodes.map((item) => (
                            <div
                                key={item.id}
                                className="group bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden hover:border-cyan-500/50 transition-all duration-300 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.2)]"
                            >
                                {/* Image */}
                                <div className="aspect-video bg-slate-800 relative overflow-hidden">
                                    {item.imageUrl ? (
                                        <img
                                            src={item.imageUrl}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Code size={48} className="text-slate-600" />
                                        </div>
                                    )}
                                    
                                    {/* Featured badge */}
                                    {item.featured && (
                                        <div className="absolute top-3 right-3 bg-yellow-500 text-black px-2 py-1 rounded text-xs font-bold">
                                            <Star size={12} className="inline mr-1" />
                                            FEATURED
                                        </div>
                                    )}

                                    {/* Demo link */}
                                    {item.demoUrl && (
                                        <a
                                            href={item.demoUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="absolute top-3 left-3 bg-slate-900/80 text-cyan-400 p-2 rounded hover:bg-slate-800 transition-colors"
                                            title="Xem demo"
                                        >
                                            <ExternalLink size={16} />
                                        </a>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="text-xl font-bold text-white group-hover:text-cyan-400 transition-colors">
                                            {item.title}
                                        </h3>
                                        <span className="text-2xl font-bold text-cyan-400 font-mono">
                                            {formatPrice(item.price)}
                                        </span>
                                    </div>

                                    <p className="text-slate-300 text-sm mb-4 line-clamp-3">
                                        {item.description}
                                    </p>

                                    {/* Tags */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {item.tags.slice(0, 3).map((tag) => (
                                            <span
                                                key={tag}
                                                className="px-2 py-1 bg-slate-800 text-cyan-400 text-xs rounded font-mono"
                                            >
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Author & Stats */}
                                    <div className="flex items-center justify-between text-sm text-slate-400 mb-4">
                                        <div className="flex items-center">
                                            {item.author.avatarUrl ? (
                                                <img
                                                    src={item.author.avatarUrl}
                                                    alt={item.author.name}
                                                    className="w-6 h-6 rounded-full mr-2"
                                                />
                                            ) : (
                                                <div className="w-6 h-6 rounded-full bg-cyan-500 flex items-center justify-center mr-2">
                                                    <span className="text-xs font-bold text-white">
                                                        {item.author.name.charAt(0)}
                                                    </span>
                                                </div>
                                            )}
                                            <span>{item.author.name}</span>
                                        </div>
                                        <div className="flex items-center">
                                            <ShoppingCart size={14} className="mr-1" />
                                            <span>{item._count.purchases} đã bán</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addToCart({
                                                    id: item.id,
                                                    title: item.title,
                                                    price: item.price,
                                                    imageUrl: item.imageUrl
                                                });
                                            }}
                                            className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-3 px-4 rounded transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)] hover:shadow-[0_0_20px_rgba(34,197,94,0.5)] flex items-center justify-center font-mono text-sm"
                                        >
                                            <ShoppingCart size={16} className="mr-2" />
                                            ADD_CART
                                        </button>
                                        <Link
                                            href={`/store/${item.id}`}
                                            className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center font-mono text-sm"
                                        >
                                            VIEW
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty State */}
                {!loading && sourceCodes.length === 0 && (
                    <div className="text-center py-20">
                        <Code size={64} className="text-slate-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                            NO_PRODUCTS_FOUND
                        </h3>
                        <p className="text-slate-400">
                            Chưa có sản phẩm nào trong cửa hàng. Hãy quay lại sau nhé!
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}