'use client';

import Link from 'next/link';
import { Github, Mail, Send } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            const res = await fetch('/api/newsletter/subscribe', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (res.ok) {
                setMessage(data.message);
                setEmail('');
            } else {
                setMessage(data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            setMessage('Có lỗi xảy ra');
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-gray-100 dark:bg-gray-800 py-8 mt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Newsletter Section */}
                <div className="mb-8 text-center">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        📬 Đăng ký nhận tin
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                        Nhận thông báo qua email khi có bài viết mới
                    </p>
                    <form onSubmit={handleSubscribe} className="max-w-md mx-auto">
                        <div className="flex gap-2">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email của bạn..."
                                required
                                className="flex-1 px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-medium min-h-[44px]"
                            >
                                <Send size={18} />
                                {loading ? 'Đang gửi...' : 'Đăng ký'}
                            </button>
                        </div>
                        {message && (
                            <p className={`mt-2 text-sm ${message.includes('thành công') ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                                {message}
                            </p>
                        )}
                    </form>
                </div>

                {/* Contact & Social Links */}
                <div className="flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-300 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                        <Mail size={16} className="text-gray-500 dark:text-gray-400" />
                        <a href="mailto:lamminhnhut09022011@gmail.com" className="hover:underline">
                            lamminhnhut09022011@gmail.com
                        </a>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link href="https://github.com/nhut0902-pr" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-800 dark:hover:text-gray-200 transition-colors">
                            <Github size={20} className="mr-1" />
                            nhut0902-pr
                        </Link>
                    </div>
                </div>

                {/* Copyright */}
                <div className="text-center text-xs text-gray-500 dark:text-gray-500 mt-6">
                    © {new Date().getFullYear()} BlogApp. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
