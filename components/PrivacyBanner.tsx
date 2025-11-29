'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Shield, X } from 'lucide-react';

export default function PrivacyBanner() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        console.log('PrivacyBanner mounted');
        // Check if user has already accepted
        const hasAccepted = localStorage.getItem('privacy-accepted');
        console.log('Privacy accepted status:', hasAccepted);

        if (!hasAccepted) {
            // Show banner after a short delay
            const timer = setTimeout(() => {
                console.log('Showing PrivacyBanner');
                setIsVisible(true);
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('privacy-accepted', 'true');
        setIsVisible(false);
    };

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-[100] max-w-sm w-full transition-all duration-500 transform translate-y-0 opacity-100">
            <div className="relative bg-slate-900 border border-cyan-500/30 p-6 rounded-lg shadow-[0_0_30px_rgba(6,182,212,0.15)] backdrop-blur-xl overflow-hidden group">

                {/* Tech decorative elements */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50" />
                <div className="absolute -top-10 -right-10 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl" />
                <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r border-cyan-500/50" />
                <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l border-cyan-500/50" />

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-2 text-cyan-400">
                            <Shield size={20} className="animate-pulse" />
                            <span className="font-mono text-sm font-bold tracking-wider uppercase">System_Notice</span>
                        </div>
                        <button
                            onClick={handleAccept}
                            className="text-slate-400 hover:text-white transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    <p className="text-slate-300 text-sm mb-4 font-light leading-relaxed">
                        <span className="text-cyan-500 font-mono mr-2">&gt;</span>
                        We use cookies to enhance your terminal experience and analyze system traffic. Accessing this node implies consent to our protocols.
                    </p>

                    <div className="flex items-center space-x-3">
                        <Link
                            href="/privacy"
                            className="flex-1 bg-cyan-950/50 hover:bg-cyan-900/50 text-cyan-400 text-xs font-mono py-2 px-4 border border-cyan-500/30 rounded text-center transition-all hover:shadow-[0_0_10px_rgba(34,211,238,0.2)]"
                        >
                            READ_POLICY
                        </Link>
                        <button
                            onClick={handleAccept}
                            className="flex-1 bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-mono py-2 px-4 rounded text-center transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)] hover:shadow-[0_0_20px_rgba(34,211,238,0.6)]"
                        >
                            ACKNOWLEDGE
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
