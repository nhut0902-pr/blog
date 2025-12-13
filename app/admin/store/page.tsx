'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Star, Eye, ShoppingCart, Loader2 } from 'lucide-react';
import Link from 'next/link';

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
    active: boolean;
    _count: {
        purchases: number;
    };
    createdAt: string;
}

export default function AdminStorePage() {
    const { user } = useAuth();
    const router = useRouter();
    const [sourceCodes, setSourceCodes] = useState<SourceCode[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (user.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchSourceCodes();
    }, [user]);

    const fetchSourceCodes = async () => {
        try {
            const res = await fetch('/api/admin/store');
            const data = await res.json();
            if (res.ok) {
                setSourceCodes(data);
            }
        } catch (error) {
            console.error('Failed to fetch source codes:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Bạn có chắc muốn xóa source code này?')) return;

        try {
            const res = await fetch(`/api/store/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                const data = await res.json();
                // Refresh the list to show updated status
                fetchSourceCodes();
                alert(data.message);
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Xóa thất bại');
            }
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Có lỗi xảy ra');
        }
    };

    const toggleFeatured = async (id: string, featured: boolean) => {
        try {
            const sourceCode = sourceCodes.find(item => item.id === id);
            if (!sourceCode) return;

            const res = await fetch(`/api/store/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...sourceCode,
                    featured: !featured
                })
            });

            if (res.ok) {
                setSourceCodes(prev => prev.map(item => 
                    item.id === id ? { ...item, featured: !featured } : item
                ));
            }
        } catch (error) {
            console.error('Toggle featured failed:', error);
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
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="w-12 h-12 text-cyan-400 animate-spin mx-auto mb-4" />
                    <p className="text-slate-400 font-mono">LOADING_STORE_DATA...</p>
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

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white font-mono mb-2">
                            <span className="text-cyan-400">&gt;_</span> STORE_MANAGEMENT
                        </h1>
                        <p className="text-slate-400">Quản lý source code store</p>
                    </div>
                    <Link
                        href="/admin/store/create"
                        className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-6 rounded flex items-center font-mono transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                    >
                        <Plus size={18} className="mr-2" />
                        ADD_PRODUCT
                    </Link>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-mono">TOTAL_PRODUCTS</p>
                                <p className="text-2xl font-bold text-white">{sourceCodes.length}</p>
                            </div>
                            <ShoppingCart className="text-cyan-400" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-mono">FEATURED</p>
                                <p className="text-2xl font-bold text-yellow-400">
                                    {sourceCodes.filter(item => item.featured).length}
                                </p>
                            </div>
                            <Star className="text-yellow-400" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-mono">TOTAL_SALES</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {sourceCodes.reduce((sum, item) => sum + item._count.purchases, 0)}
                                </p>
                            </div>
                            <Eye className="text-green-400" size={32} />
                        </div>
                    </div>
                </div>

                {/* Products Table */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-slate-800/50 border-b border-slate-700">
                                <tr>
                                    <th className="text-left py-4 px-6 text-slate-300 font-mono text-sm">PRODUCT</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-mono text-sm">PRICE</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-mono text-sm">SALES</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-mono text-sm">STATUS</th>
                                    <th className="text-left py-4 px-6 text-slate-300 font-mono text-sm">ACTIONS</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sourceCodes.map((item) => (
                                    <tr key={item.id} className="border-b border-slate-800 hover:bg-slate-800/30">
                                        <td className="py-4 px-6">
                                            <div className="flex items-center">
                                                <div className="w-12 h-12 bg-slate-800 rounded mr-4 flex items-center justify-center">
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <ShoppingCart size={20} className="text-slate-600" />
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="text-white font-medium">{item.title}</p>
                                                    <p className="text-slate-400 text-sm line-clamp-1">
                                                        {item.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-cyan-400 font-mono font-bold">
                                                {formatPrice(item.price)}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <span className="text-green-400 font-mono">
                                                {item._count.purchases}
                                            </span>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-2">
                                                {item.featured && (
                                                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-mono">
                                                        FEATURED
                                                    </span>
                                                )}
                                                <span className={`px-2 py-1 rounded text-xs font-mono ${
                                                    item.active 
                                                        ? 'bg-green-500/20 text-green-400' 
                                                        : 'bg-red-500/20 text-red-400'
                                                }`}>
                                                    {item.active ? 'ACTIVE' : 'INACTIVE'}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="py-4 px-6">
                                            <div className="flex items-center space-x-2">
                                                <Link
                                                    href={`/store/${item.id}`}
                                                    target="_blank"
                                                    className="p-2 text-slate-400 hover:text-green-400 hover:bg-green-500/20 rounded transition-colors"
                                                    title="View Product"
                                                >
                                                    <Eye size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => toggleFeatured(item.id, item.featured)}
                                                    className={`p-2 rounded transition-colors ${
                                                        item.featured
                                                            ? 'text-yellow-400 hover:bg-yellow-500/20'
                                                            : 'text-slate-500 hover:text-yellow-400 hover:bg-yellow-500/20'
                                                    }`}
                                                    title="Toggle Featured"
                                                >
                                                    <Star size={16} fill={item.featured ? 'currentColor' : 'none'} />
                                                </button>
                                                <Link
                                                    href={`/admin/store/edit/${item.id}`}
                                                    className="p-2 text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/20 rounded transition-colors"
                                                    title="Edit"
                                                >
                                                    <Edit size={16} />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(item.id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/20 rounded transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {sourceCodes.length === 0 && (
                        <div className="text-center py-12">
                            <ShoppingCart size={48} className="text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-mono">NO_PRODUCTS_FOUND</p>
                            <Link
                                href="/admin/store/create"
                                className="inline-block mt-4 text-cyan-400 hover:text-cyan-300 font-mono"
                            >
                                CREATE_FIRST_PRODUCT
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}