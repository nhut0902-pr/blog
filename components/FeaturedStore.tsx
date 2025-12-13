'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, Star, Code, ExternalLink } from 'lucide-react';

interface FeaturedProduct {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    demoUrl?: string;
    tags: string[];
    _count: {
        purchases: number;
    };
}

export default function FeaturedStore() {
    const [products, setProducts] = useState<FeaturedProduct[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFeaturedProducts();
    }, []);

    const fetchFeaturedProducts = async () => {
        try {
            const res = await fetch('/api/store?featured=true&limit=3');
            const data = await res.json();
            
            if (res.ok) {
                setProducts(data.sourceCodes);
            }
        } catch (error) {
            console.error('Failed to fetch featured products:', error);
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

    if (loading) {
        return (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 animate-pulse">
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
                <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex gap-4">
                            <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (products.length === 0) return null;

    return (
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl shadow-lg p-6 border border-cyan-500/30">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-white flex items-center font-mono">
                    <Star className="w-5 h-5 mr-2 text-yellow-400" fill="currentColor" />
                    FEATURED_STORE
                </h3>
                <Link
                    href="/store"
                    className="text-cyan-400 hover:text-cyan-300 text-sm font-mono transition-colors"
                >
                    VIEW_ALL &gt;
                </Link>
            </div>

            {/* Products */}
            <div className="space-y-4">
                {products.map((product) => (
                    <Link
                        key={product.id}
                        href={`/store/${product.id}`}
                        className="group block"
                    >
                        <div className="flex gap-4 p-3 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-cyan-500/50 transition-all">
                            {/* Image */}
                            <div className="flex-shrink-0 w-16 h-16 relative rounded-lg overflow-hidden bg-slate-700">
                                {product.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.title}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <Code size={20} className="text-slate-500" />
                                    </div>
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors line-clamp-2 mb-1">
                                    {product.title}
                                </h4>
                                
                                {/* Price */}
                                <div className="text-cyan-400 font-bold text-sm font-mono mb-2">
                                    {formatPrice(product.price)}
                                </div>

                                {/* Tags */}
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {product.tags.slice(0, 2).map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-slate-700 text-cyan-400 text-xs rounded font-mono"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Stats */}
                                <div className="flex items-center justify-between text-xs text-slate-400">
                                    <div className="flex items-center">
                                        <ShoppingCart size={12} className="mr-1" />
                                        {product._count.purchases} sold
                                    </div>
                                    {product.demoUrl && (
                                        <ExternalLink size={12} className="text-cyan-400" />
                                    )}
                                </div>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>

            {/* CTA */}
            <Link
                href="/store"
                className="mt-6 w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-3 px-4 rounded-lg transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)] flex items-center justify-center font-mono text-sm"
            >
                <ShoppingCart size={16} className="mr-2" />
                BROWSE_ALL_PRODUCTS
            </Link>
        </div>
    );
}