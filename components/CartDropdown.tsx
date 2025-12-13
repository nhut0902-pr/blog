'use client';

import { useState, useRef, useEffect } from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    const { items, removeFromCart, updateQuantity, getTotalPrice, getTotalItems, clearCart } = useCart();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const totalItems = getTotalItems();

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                title="Giỏ hàng"
            >
                <ShoppingCart size={20} className="text-gray-700 dark:text-gray-300" />
                {totalItems > 0 && (
                    <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                        {totalItems > 9 ? '9+' : totalItems}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
                        <h3 className="font-semibold text-gray-900 dark:text-white">Giỏ hàng ({totalItems})</h3>
                        {items.length > 0 && (
                            <button
                                onClick={clearCart}
                                className="text-xs text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                            >
                                Xóa tất cả
                            </button>
                        )}
                    </div>

                    {/* Cart Items */}
                    <div className="max-h-64 overflow-y-auto">
                        {items.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                <ShoppingCart size={48} className="mx-auto mb-4 opacity-50" />
                                <p>Giỏ hàng trống</p>
                                <Link
                                    href="/store"
                                    onClick={() => setIsOpen(false)}
                                    className="inline-block mt-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 text-sm"
                                >
                                    Khám phá sản phẩm
                                </Link>
                            </div>
                        ) : (
                            items.map((item) => (
                                <div key={item.id} className="p-4 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <div className="flex items-start gap-3">
                                        {/* Image */}
                                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-600 rounded flex-shrink-0">
                                            {item.imageUrl ? (
                                                <img
                                                    src={item.imageUrl}
                                                    alt={item.title}
                                                    className="w-full h-full object-cover rounded"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ShoppingCart size={16} className="text-gray-400" />
                                                </div>
                                            )}
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-medium text-gray-900 dark:text-white line-clamp-2">
                                                {item.title}
                                            </h4>
                                            <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                                                {formatPrice(item.price)}
                                            </p>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                                    >
                                                        <Minus size={14} />
                                                    </button>
                                                    <span className="text-sm font-medium w-8 text-center">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                        className="p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-600"
                                                    >
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className="p-1 text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Footer */}
                    {items.length > 0 && (
                        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                <span className="font-semibold text-gray-900 dark:text-white">Tổng cộng:</span>
                                <span className="font-bold text-lg text-indigo-600 dark:text-indigo-400">
                                    {formatPrice(getTotalPrice())}
                                </span>
                            </div>
                            <Link
                                href="/cart"
                                onClick={() => setIsOpen(false)}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded transition-colors flex items-center justify-center"
                            >
                                Xem giỏ hàng
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}