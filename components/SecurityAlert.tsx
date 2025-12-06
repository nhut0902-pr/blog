'use client';

import { useState, useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import Link from 'next/link';

export default function SecurityAlert() {
    const [dismissed, setDismissed] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const isDismissed = localStorage.getItem('security-alert-dismissed-2025-12');
        if (isDismissed) {
            setDismissed(true);
        }
    }, []);

    const handleDismiss = () => {
        localStorage.setItem('security-alert-dismissed-2025-12', 'true');
        setDismissed(true);
    };

    if (!mounted || dismissed) return null;

    return (
        <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 relative">
            <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 flex-1">
                    <AlertTriangle className="w-5 h-5 flex-shrink-0 animate-pulse" />
                    <p className="text-sm font-medium">
                        <span className="font-bold">⚠️ CẢNH BÁO BẢO MẬT:</span>{' '}
                        Lỗ hổng nghiêm trọng trong React Server Components (CVE-2025-55182) đã được phát hiện.
                        Ảnh hưởng đến React 19 và Next.js 15-16.{' '}
                        <Link
                            href="https://react.dev/blog"
                            target="_blank"
                            className="underline font-bold hover:text-yellow-200"
                        >
                            Xem chi tiết →
                        </Link>
                    </p>
                </div>
                <button
                    onClick={handleDismiss}
                    className="p-1 hover:bg-white/20 rounded transition-colors flex-shrink-0"
                    aria-label="Đóng thông báo"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
}
