'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ExternalLink, ShoppingCart, Star, Code, MessageCircle, Loader2, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';

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
    author: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    _count: {
        purchases: number;
    };
}

export default function SourceCodeDetailPage() {
    const params = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [sourceCode, setSourceCode] = useState<SourceCode | null>(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);
    const [contactInfo, setContactInfo] = useState('');
    const [showPurchaseForm, setShowPurchaseForm] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'contact' | 'vietqr'>('contact');
    const { addToCart } = useCart();

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
                setSourceCode(data);
            } else {
                router.push('/store');
            }
        } catch (error) {
            console.error('Failed to fetch source code:', error);
            router.push('/store');
        } finally {
            setLoading(false);
        }
    };

    const handlePurchase = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            router.push('/login');
            return;
        }

        if (!contactInfo.trim()) {
            alert('Vui lòng nhập thông tin liên hệ');
            return;
        }

        setPurchasing(true);
        try {
            // Contact method only (QR payment coming soon)
            const res = await fetch(`/api/store/${params.id}/purchase`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contactInfo })
            });

            const data = await res.json();

            if (res.ok) {
                alert('Yêu cầu mua hàng đã được gửi! Admin sẽ liên hệ với bạn sớm nhất.');
                setShowPurchaseForm(false);
                setContactInfo('');
            } else {
                alert(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Purchase failed:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setPurchasing(false);
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
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-4"></div>
                    <p className="text-slate-400 font-mono">LOADING_PRODUCT...</p>
                </div>
            </div>
        );
    }

    if (!sourceCode) {
        return (
            <div className="min-h-screen bg-slate-950 flex items-center justify-center">
                <div className="text-center">
                    <Code size={64} className="text-slate-600 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2 font-mono">PRODUCT_NOT_FOUND</h2>
                    <Link href="/store" className="text-cyan-400 hover:text-cyan-300 font-mono">
                        &lt; BACK_TO_STORE
                    </Link>
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
                {/* Back Button */}
                <Link
                    href="/store"
                    className="inline-flex items-center text-cyan-400 hover:text-cyan-300 mb-8 font-mono transition-colors"
                >
                    <ArrowLeft size={20} className="mr-2" />
                    BACK_TO_STORE
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Left: Image & Demo */}
                    <div className="space-y-6">
                        <div className="aspect-video bg-slate-900 rounded-lg overflow-hidden border border-slate-800 relative">
                            {sourceCode.imageUrl ? (
                                <img
                                    src={sourceCode.imageUrl}
                                    alt={sourceCode.title}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <Code size={64} className="text-slate-600" />
                                </div>
                            )}
                            
                            {sourceCode.featured && (
                                <div className="absolute top-4 right-4 bg-yellow-500 text-black px-3 py-1 rounded font-bold text-sm">
                                    <Star size={14} className="inline mr-1" />
                                    FEATURED
                                </div>
                            )}
                        </div>

                        {/* Demo Button */}
                        {sourceCode.demoUrl && (
                            <a
                                href={sourceCode.demoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full bg-slate-800 hover:bg-slate-700 text-cyan-400 font-bold py-3 px-6 rounded border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-center font-mono"
                            >
                                <ExternalLink size={18} className="mr-2" />
                                VIEW_LIVE_DEMO
                            </a>
                        )}
                    </div>

                    {/* Right: Details */}
                    <div className="space-y-6">
                        <div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4 font-mono">
                                {sourceCode.title}
                            </h1>
                            <div className="text-4xl font-bold text-cyan-400 mb-6 font-mono">
                                {formatPrice(sourceCode.price)}
                            </div>
                        </div>

                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6 backdrop-blur-sm">
                            <h3 className="text-lg font-bold text-white mb-3 font-mono">DESCRIPTION</h3>
                            <p className="text-slate-300 leading-relaxed whitespace-pre-wrap">
                                {sourceCode.description}
                            </p>
                        </div>

                        {/* Tags */}
                        {sourceCode.tags.length > 0 && (
                            <div>
                                <h3 className="text-lg font-bold text-white mb-3 font-mono">TECHNOLOGIES</h3>
                                <div className="flex flex-wrap gap-2">
                                    {sourceCode.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="px-3 py-1 bg-slate-800 text-cyan-400 rounded font-mono text-sm border border-slate-700"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Author */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 backdrop-blur-sm">
                            <div className="flex items-center">
                                {sourceCode.author.avatarUrl ? (
                                    <img
                                        src={sourceCode.author.avatarUrl}
                                        alt={sourceCode.author.name}
                                        className="w-12 h-12 rounded-full mr-4"
                                    />
                                ) : (
                                    <div className="w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center mr-4">
                                        <span className="text-white font-bold">
                                            {sourceCode.author.name.charAt(0)}
                                        </span>
                                    </div>
                                )}
                                <div>
                                    <p className="text-white font-medium">{sourceCode.author.name}</p>
                                    <p className="text-slate-400 text-sm font-mono">DEVELOPER</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-4 backdrop-blur-sm">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-slate-400">
                                    <ShoppingCart size={16} className="mr-2" />
                                    <span className="font-mono">{sourceCode._count.purchases} SALES</span>
                                </div>
                                {sourceCode.category && (
                                    <span className="text-cyan-400 font-mono text-sm">
                                        {sourceCode.category.toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-4">
                            <button
                                onClick={() => {
                                    addToCart({
                                        id: sourceCode.id,
                                        title: sourceCode.title,
                                        price: sourceCode.price,
                                        imageUrl: sourceCode.imageUrl
                                    });
                                }}
                                className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-4 px-6 rounded transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] hover:shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center justify-center font-mono text-lg"
                            >
                                <ShoppingCart size={20} className="mr-2" />
                                ADD_TO_CART
                            </button>
                            <button
                                onClick={() => setShowPurchaseForm(true)}
                                className="flex-1 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white font-bold py-4 px-6 rounded transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)] hover:shadow-[0_0_30px_rgba(6,182,212,0.5)] flex items-center justify-center font-mono text-lg"
                            >
                                <MessageCircle size={20} className="mr-2" />
                                BUY_NOW
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Purchase Form Modal */}
            {showPurchaseForm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-cyan-500/30 rounded-lg w-full max-w-md p-6 relative">
                        <h2 className="text-xl font-bold text-white mb-4 font-mono">
                            CONTACT_ADMIN
                        </h2>
                        
                        <form onSubmit={handlePurchase} className="space-y-4">
                            {/* Payment Method Selection */}
                            <div>
                                <label className="block text-slate-300 text-sm mb-3 font-mono">
                                    PAYMENT_METHOD *
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="p-3 rounded border bg-slate-800 border-slate-700 text-slate-500 font-mono text-sm text-center relative">
                                        <CreditCard size={16} className="mx-auto mb-1 opacity-50" />
                                        VietQR
                                        <div className="absolute inset-0 bg-slate-900/80 rounded flex items-center justify-center">
                                            <span className="text-xs text-yellow-400 font-mono">COMING_SOON</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => setPaymentMethod('contact')}
                                        className="p-3 rounded border bg-cyan-600 border-cyan-500 text-white font-mono text-sm"
                                    >
                                        <MessageCircle size={16} className="mx-auto mb-1" />
                                        Contact Admin
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-slate-300 text-sm mb-2 font-mono">
                                    CONTACT_INFO *
                                </label>
                                <textarea
                                    value={contactInfo}
                                    onChange={(e) => setContactInfo(e.target.value)}
                                    placeholder="Nhập số điện thoại, email hoặc thông tin liên hệ khác..."
                                    className="w-full bg-slate-800 border border-slate-700 rounded px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                                    rows={4}
                                    required
                                />
                            </div>

                            <div className="bg-slate-800/50 border border-slate-700 rounded p-4">
                                <p className="text-slate-400 text-sm font-mono">
                                    <span className="text-cyan-400">&gt;</span> Admin sẽ liên hệ với bạn để xác nhận đơn hàng và hướng dẫn thanh toán.
                                </p>
                            </div>

                            {/* QR Payment Coming Soon Notice */}
                            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded p-3">
                                <p className="text-yellow-400 text-xs font-mono text-center">
                                    🚧 TÍNH NĂNG THANH TOÁN QR ĐANG PHÁT TRIỂN 🚧
                                </p>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setShowPurchaseForm(false)}
                                    className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold py-3 px-4 rounded transition-colors font-mono"
                                >
                                    CANCEL
                                </button>
                                <button
                                    type="submit"
                                    disabled={purchasing}
                                    className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 px-4 rounded transition-colors font-mono flex items-center justify-center disabled:opacity-50"
                                >
                                    {purchasing ? (
                                        <Loader2 size={18} className="animate-spin" />
                                    ) : (
                                        'SEND_REQUEST'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}


        </div>
    );
}