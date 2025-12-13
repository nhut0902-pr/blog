'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, User, Clock, CheckCircle, XCircle, Mail, Phone } from 'lucide-react';

interface Purchase {
    id: string;
    amount: number;
    status: 'PENDING' | 'COMPLETED' | 'CANCELLED';
    contactInfo: string;
    createdAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        avatarUrl?: string;
    };
    sourceCode: {
        id: string;
        title: string;
        price: number;
        imageUrl?: string;
    };
}

export default function AdminPurchasesPage() {
    const { user } = useAuth();
    const router = useRouter();
    const [purchases, setPurchases] = useState<Purchase[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'PENDING' | 'COMPLETED' | 'CANCELLED'>('all');

    useEffect(() => {
        if (!user) {
            router.push('/login');
            return;
        }
        if (user.role !== 'ADMIN') {
            router.push('/');
            return;
        }
        fetchPurchases();
    }, [user, filter]);

    const fetchPurchases = async () => {
        try {
            const params = new URLSearchParams();
            if (filter !== 'all') {
                params.append('status', filter);
            }

            const res = await fetch(`/api/admin/purchases?${params.toString()}`);
            const data = await res.json();
            if (res.ok) {
                setPurchases(data.purchases);
            }
        } catch (error) {
            console.error('Failed to fetch purchases:', error);
        } finally {
            setLoading(false);
        }
    };

    const updatePurchaseStatus = async (purchaseId: string, status: string) => {
        try {
            const res = await fetch(`/api/admin/purchases/${purchaseId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });

            if (res.ok) {
                setPurchases(prev => prev.map(p => 
                    p.id === purchaseId ? { ...p, status: status as any } : p
                ));
            }
        } catch (error) {
            console.error('Failed to update purchase status:', error);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING': return 'text-yellow-400 bg-yellow-500/20';
            case 'COMPLETED': return 'text-green-400 bg-green-500/20';
            case 'CANCELLED': return 'text-red-400 bg-red-500/20';
            default: return 'text-slate-400 bg-slate-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'PENDING': return <Clock size={16} />;
            case 'COMPLETED': return <CheckCircle size={16} />;
            case 'CANCELLED': return <XCircle size={16} />;
            default: return <Clock size={16} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
                    <p className="text-slate-400 font-mono">LOADING_PURCHASES...</p>
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
                            <span className="text-cyan-400">&gt;_</span> PURCHASE_MANAGEMENT
                        </h1>
                        <p className="text-slate-400">Quản lý đơn hàng và yêu cầu mua source code</p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex gap-4 mb-8">
                    {['all', 'PENDING', 'COMPLETED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status as any)}
                            className={`px-4 py-2 rounded font-mono text-sm transition-all ${
                                filter === status
                                    ? 'bg-cyan-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]'
                                    : 'bg-slate-800 text-slate-400 hover:text-cyan-400 hover:bg-slate-700'
                            }`}
                        >
                            {status === 'all' ? 'ALL' : status}
                        </button>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-mono">TOTAL_ORDERS</p>
                                <p className="text-2xl font-bold text-white">{purchases.length}</p>
                            </div>
                            <ShoppingCart className="text-cyan-400" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-mono">PENDING</p>
                                <p className="text-2xl font-bold text-yellow-400">
                                    {purchases.filter(p => p.status === 'PENDING').length}
                                </p>
                            </div>
                            <Clock className="text-yellow-400" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-mono">COMPLETED</p>
                                <p className="text-2xl font-bold text-green-400">
                                    {purchases.filter(p => p.status === 'COMPLETED').length}
                                </p>
                            </div>
                            <CheckCircle className="text-green-400" size={32} />
                        </div>
                    </div>
                    <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-mono">REVENUE</p>
                                <p className="text-2xl font-bold text-cyan-400">
                                    {formatPrice(purchases.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0))}
                                </p>
                            </div>
                            <ShoppingCart className="text-cyan-400" size={32} />
                        </div>
                    </div>
                </div>

                {/* Purchases List */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-lg overflow-hidden backdrop-blur-sm">
                    {purchases.length === 0 ? (
                        <div className="text-center py-12">
                            <ShoppingCart size={48} className="text-slate-600 mx-auto mb-4" />
                            <p className="text-slate-400 font-mono">NO_PURCHASES_FOUND</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-slate-800">
                            {purchases.map((purchase) => (
                                <div key={purchase.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                                    <div className="flex items-start justify-between">
                                        {/* Left: Product & User Info */}
                                        <div className="flex gap-4 flex-1">
                                            {/* Product Image */}
                                            <div className="w-16 h-16 bg-slate-800 rounded flex items-center justify-center flex-shrink-0">
                                                {purchase.sourceCode.imageUrl ? (
                                                    <img
                                                        src={purchase.sourceCode.imageUrl}
                                                        alt={purchase.sourceCode.title}
                                                        className="w-full h-full object-cover rounded"
                                                    />
                                                ) : (
                                                    <ShoppingCart size={20} className="text-slate-600" />
                                                )}
                                            </div>

                                            {/* Info */}
                                            <div className="flex-1">
                                                <h3 className="text-white font-medium mb-1">
                                                    {purchase.sourceCode.title}
                                                </h3>
                                                <div className="flex items-center gap-4 text-sm text-slate-400 mb-2">
                                                    <div className="flex items-center">
                                                        <User size={14} className="mr-1" />
                                                        {purchase.user.name}
                                                    </div>
                                                    <div className="flex items-center">
                                                        <Mail size={14} className="mr-1" />
                                                        {purchase.user.email}
                                                    </div>
                                                    <span>{new Date(purchase.createdAt).toLocaleDateString('vi-VN')}</span>
                                                </div>
                                                <div className="bg-slate-800 rounded p-3 mb-3">
                                                    <p className="text-slate-300 text-sm">
                                                        <span className="text-cyan-400 font-mono">CONTACT_INFO:</span> {purchase.contactInfo}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: Price & Actions */}
                                        <div className="text-right flex-shrink-0 ml-4">
                                            <div className="text-2xl font-bold text-cyan-400 font-mono mb-2">
                                                {formatPrice(purchase.amount)}
                                            </div>
                                            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-mono mb-4 ${getStatusColor(purchase.status)}`}>
                                                {getStatusIcon(purchase.status)}
                                                <span className="ml-1">{purchase.status}</span>
                                            </div>
                                            
                                            {purchase.status === 'PENDING' && (
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => updatePurchaseStatus(purchase.id, 'COMPLETED')}
                                                        className="px-3 py-1 bg-green-600 hover:bg-green-500 text-white text-xs rounded font-mono transition-colors"
                                                    >
                                                        COMPLETE
                                                    </button>
                                                    <button
                                                        onClick={() => updatePurchaseStatus(purchase.id, 'CANCELLED')}
                                                        className="px-3 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded font-mono transition-colors"
                                                    >
                                                        CANCEL
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}