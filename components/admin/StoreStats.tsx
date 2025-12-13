'use client';

import { useEffect, useState } from 'react';
import { ShoppingCart, Star, DollarSign, TrendingUp } from 'lucide-react';

interface StoreStats {
    totalProducts: number;
    featuredProducts: number;
    totalSales: number;
    totalRevenue: number;
    pendingOrders: number;
}

export default function StoreStats() {
    const [stats, setStats] = useState<StoreStats>({
        totalProducts: 0,
        featuredProducts: 0,
        totalSales: 0,
        totalRevenue: 0,
        pendingOrders: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const [storeRes, purchasesRes] = await Promise.all([
                fetch('/api/admin/store'),
                fetch('/api/admin/purchases')
            ]);

            if (storeRes.ok && purchasesRes.ok) {
                const storeData = await storeRes.json();
                const purchasesData = await purchasesRes.json();

                const products = storeData;
                const purchases = purchasesData.purchases;

                setStats({
                    totalProducts: products.length,
                    featuredProducts: products.filter((p: any) => p.featured).length,
                    totalSales: purchases.filter((p: any) => p.status === 'COMPLETED').length,
                    totalRevenue: purchases
                        .filter((p: any) => p.status === 'COMPLETED')
                        .reduce((sum: number, p: any) => sum + p.amount, 0),
                    pendingOrders: purchases.filter((p: any) => p.status === 'PENDING').length
                });
            }
        } catch (error) {
            console.error('Failed to fetch store stats:', error);
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 animate-pulse">
                        <div className="h-4 bg-slate-800 rounded w-1/2 mb-2"></div>
                        <div className="h-8 bg-slate-800 rounded w-3/4"></div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Products */}
            <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-cyan-400 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-mono uppercase">Total Products</p>
                        <p className="text-3xl font-bold text-white">{stats.totalProducts}</p>
                    </div>
                    <ShoppingCart className="text-cyan-400" size={32} />
                </div>
            </div>

            {/* Featured Products */}
            <div className="bg-slate-900/50 border border-yellow-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-yellow-400 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-mono uppercase">Featured</p>
                        <p className="text-3xl font-bold text-yellow-400">{stats.featuredProducts}</p>
                    </div>
                    <Star className="text-yellow-400" size={32} fill="currentColor" />
                </div>
            </div>

            {/* Total Sales */}
            <div className="bg-slate-900/50 border border-green-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-green-400 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-mono uppercase">Completed Sales</p>
                        <p className="text-3xl font-bold text-green-400">{stats.totalSales}</p>
                    </div>
                    <TrendingUp className="text-green-400" size={32} />
                </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-slate-900/50 border border-indigo-500/30 rounded-lg p-6 backdrop-blur-sm hover:border-indigo-400 transition-colors">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-slate-400 text-sm font-mono uppercase">Total Revenue</p>
                        <p className="text-2xl font-bold text-indigo-400 font-mono">
                            {formatPrice(stats.totalRevenue)}
                        </p>
                    </div>
                    <DollarSign className="text-indigo-400" size={32} />
                </div>
            </div>

            {/* Pending Orders Alert */}
            {stats.pendingOrders > 0 && (
                <div className="md:col-span-2 lg:col-span-4 bg-gradient-to-r from-red-900/50 to-orange-900/50 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse mr-3"></div>
                            <p className="text-red-400 font-mono">
                                <span className="font-bold">{stats.pendingOrders}</span> pending order{stats.pendingOrders > 1 ? 's' : ''} require{stats.pendingOrders === 1 ? 's' : ''} attention
                            </p>
                        </div>
                        <a
                            href="/admin/purchases"
                            className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-mono text-sm rounded transition-colors"
                        >
                            VIEW_ORDERS
                        </a>
                    </div>
                </div>
            )}
        </div>
    );
}