'use client';

import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, MessageCircle } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

export default function CartPage() {
    const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } = useCart();
    const { user } = useAuth();
    const router = useRouter();
    const [contactInfo, setContactInfo] = useState('');
    const [loading, setLoading] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const handleCheckout = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        if (!contactInfo.trim()) {
            alert('Vui lòng nhập thông tin liên hệ');
            return;
        }

        if (items.length === 0) {
            alert('Giỏ hàng trống');
            return;
        }

        setLoading(true);
        try {
            // Create purchase requests for all items
            const purchasePromises = items.map(item =>
                fetch(`/api/store/${item.id}/purchase`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 
                        contactInfo: `${contactInfo} - Số lượng: ${item.quantity}` 
                    })
                })
            );

            const results = await Promise.all(purchasePromises);
            const allSuccessful = results.every(res => res.ok);

            if (allSuccessful) {
                alert('Đã gửi yêu cầu mua hàng! Admin sẽ liên hệ với bạn sớm nhất.');
                clearCart();
                router.push('/store');
            } else {
                alert('Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
            }
        } catch (error) {
            console.error('Checkout failed:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
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

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <div className="mb-8">
                    <Link
                        href="/store"
                        className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-4 font-mono transition-colors"
                    >
                        <ArrowLeft size={20} className="mr-2" />
                        BACK_TO_STORE
                    </Link>
                    <h1 className="text-3xl font-bold text-white font-mono">
                        <span className="text-cyan-400">&gt;_</span> SHOPPING_CART
                    </h1>
                </div>

                {items.length === 0 ? (
                    /* Empty Cart */
                    <div className="text-center py-20">
                        <ShoppingCart size={64} className="text-slate-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2 font-mono">
                            CART_EMPTY
                        </h3>
                        <p className="text-slate-400 mb-6">
                            Giỏ hàng của bạn đang trống. Hãy khám phá các sản phẩm tuyệt vời!
                        </p>
                        <Link
                            href="/store"
                            className="inline-block bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-8 rounded font-mono transition-colors shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        >
                            BROWSE_PRODUCTS
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2">
                            <div className="bg-slate-900/50 border border-slate-800 rounded-lg backdrop-blur-sm">
                                <div className="p-6 border-b border-slate-800">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-xl font-bold text-white font-mono">
                                            CART_ITEMS ({items.length})
                                        </h2>
                                        <button
                                            onClick={clearCart}
                                            className="text-red-400 hover:text-red-300 text-sm font-mono transition-colors"
                                        >
                                            CLEAR_ALL
                                        </button>
                                    </div>
                                </div>

                                <div className="divide-y divide-slate-800">
                                    {items.map((item) => (
                                        <div key={item.id} className="p-6 hover:bg-slate-800/30 transition-colors">
                                            <div className="flex items-start gap-4">
                                                {/* Image */}
                                                <div className="w-20 h-20 bg-slate-800 rounded flex-shrink-0">
                                                    {item.imageUrl ? (
                                                        <img
                                                            src={item.imageUrl}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover rounded"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <ShoppingCart size={24} className="text-slate-600" />
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-white mb-2">
                                                        {item.title}
                                                    </h3>
                                                    <p className="text-2xl font-bold text-cyan-400 font-mono mb-4">
                                                        {formatPrice(item.price)}
                                                    </p>

                                                    {/* Quantity Controls */}
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center gap-3">
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                                                            >
                                                                <Minus size={16} className="text-white" />
                                                            </button>
                                                            <span className="text-white font-mono text-lg w-12 text-center">
                                                                {item.quantity}
                                                            </span>
                                                            <button
                                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                                className="p-2 bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                                                            >
                                                                <Plus size={16} className="text-white" />
                                                            </button>
                                                        </div>

                                                        <button
                                                            onClick={() => removeFromCart(item.id)}
                                                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                                                        >
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </div>
                                                </div>

                                                {/* Subtotal */}
                                                <div className="text-right">
                                                    <p className="text-sm text-slate-400 font-mono">SUBTOTAL</p>
                                                    <p className="text-xl font-bold text-white font-mono">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Checkout Sidebar */}
                        <div className="lg:col-span-1">
                            <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg backdrop-blur-sm p-6 sticky top-24">
                                <h3 className="text-xl font-bold text-white font-mono mb-6">
                                    ORDER_SUMMARY
                                </h3>

                                {/* Total */}
                                <div className="border-t border-slate-700 pt-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <span className="text-lg font-bold text-white font-mono">TOTAL:</span>
                                        <span className="text-2xl font-bold text-cyan-400 font-mono">
                                            {formatPrice(getTotalPrice())}
                                        </span>
                                    </div>
                                </div>

                                {/* Contact Form */}
                                <div className="mb-6">
                                    <label className="block text-slate-300 text-sm mb-2 font-mono">
                                        CONTACT_INFO *
                                    </label>
                                    <textarea
                                        value={contactInfo}
                                        onChange={(e) => setContactInfo(e.target.value)}
                                        placeholder="Nhập số điện thoại, email hoặc thông tin liên hệ..."
                                        className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                                        rows={4}
                                        required
                                    />
                                </div>

                                {/* Info */}
                                <div className="bg-slate-800/50 border border-slate-700 rounded p-4 mb-6">
                                    <p className="text-slate-400 text-sm font-mono">
                                        <span className="text-cyan-400">&gt;</span> Admin sẽ liên hệ với bạn để xác nhận đơn hàng và hướng dẫn thanh toán.
                                    </p>
                                </div>

                                {/* Checkout Button */}
                                <button
                                    onClick={handleCheckout}
                                    disabled={loading || !contactInfo.trim()}
                                    className="w-full bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center font-mono disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {loading ? (
                                        'PROCESSING...'
                                    ) : (
                                        <>
                                            <MessageCircle size={20} className="mr-2" />
                                            CONTACT_ADMIN
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}