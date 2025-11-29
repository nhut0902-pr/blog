'use client';

import { useEffect, useState } from 'react';
import { X, Download } from 'lucide-react';

export default function PWAInstallPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(false);

    useEffect(() => {
        // Check if already dismissed
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed) {
            const dismissedDate = new Date(dismissed);
            const now = new Date();
            const daysSince = (now.getTime() - dismissedDate.getTime()) / (1000 * 60 * 60 * 24);

            // Don't show if dismissed within last 7 days
            if (daysSince < 7) {
                return;
            }
        }

        // Listen for beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);

            // Show prompt after 3 seconds
            setTimeout(() => {
                setShowPrompt(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        // Show install prompt
        deferredPrompt.prompt();

        // Wait for user choice
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('PWA installed');
        }

        // Clear prompt
        setDeferredPrompt(null);
        setShowPrompt(false);
    };

    const handleDismiss = () => {
        setShowPrompt(false);
        localStorage.setItem('pwa-install-dismissed', new Date().toISOString());
    };

    if (!showPrompt || !deferredPrompt) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm animate-in slide-in-from-bottom duration-500">
            {/* Backdrop glow */}
            <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-lg" />

            {/* Main card */}
            <div className="relative bg-slate-900 border border-cyan-500/30 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden">
                {/* Tech pattern */}
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Header */}
                <div className="relative p-4 border-b border-cyan-500/20">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white font-mono flex items-center">
                            <Download size={20} className="mr-2 text-cyan-400" />
                            Cài đặt ứng dụng
                        </h3>
                        <button
                            onClick={handleDismiss}
                            className="text-slate-400 hover:text-white transition-colors p-1"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="relative p-4">
                    <p className="text-sm text-slate-300 mb-4">
                        Cài đặt <span className="text-cyan-400 font-mono">BlogApp</span> để truy cập nhanh hơn và sử dụng offline!
                    </p>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            onClick={handleDismiss}
                            className="flex-1 px-4 py-2 text-sm font-mono text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded transition-colors"
                        >
                            Huỷ
                        </button>
                        <button
                            onClick={handleInstall}
                            className="flex-1 px-4 py-2 text-sm font-mono font-bold text-slate-900 bg-cyan-500 hover:bg-cyan-400 rounded transition-colors shadow-[0_0_15px_rgba(6,182,212,0.5)]"
                        >
                            Cài đặt
                        </button>
                    </div>
                </div>

                {/* Footer hint */}
                <div className="relative px-4 py-2 bg-slate-800/50 border-t border-cyan-500/10">
                    <p className="text-[10px] font-mono text-slate-500 text-center">
                        PWA_INSTALL // SYSTEM_READY
                    </p>
                </div>
            </div>
        </div>
    );
}
