'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import ReelCard from '@/components/reels/ReelCard';
import ReelComments from '@/components/reels/ReelComments';
import { useAuth } from '@/context/AuthContext';

interface Reel {
    id: string;
    title?: string;
    description?: string;
    videoUrl: string;
    thumbnailUrl?: string;
    views: number;
    author: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    _count: {
        likes: number;
        comments: number;
    };
}

export default function ReelsPage() {
    const { user } = useAuth();
    const [reels, setReels] = useState<Reel[]>([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [commentsOpen, setCommentsOpen] = useState(false);
    const [selectedReelId, setSelectedReelId] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchReels();
    }, []);

    const fetchReels = async () => {
        try {
            const res = await fetch('/api/reels');
            const data = await res.json();
            if (res.ok) {
                setReels(data.reels);
            }
        } catch (error) {
            console.error('Failed to fetch reels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleScroll = useCallback(() => {
        if (containerRef.current) {
            const scrollTop = containerRef.current.scrollTop;
            const height = containerRef.current.clientHeight;
            const newIndex = Math.round(scrollTop / height);
            if (newIndex !== activeIndex && newIndex >= 0 && newIndex < reels.length) {
                setActiveIndex(newIndex);
            }
        }
    }, [activeIndex, reels.length]);

    const openComments = (reelId: string) => {
        setSelectedReelId(reelId);
        setCommentsOpen(true);
    };

    if (loading) {
        return (
            <div className="h-screen bg-black flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (reels.length === 0) {
        return (
            <div className="h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
                <div className="text-6xl mb-4">📹</div>
                <h2 className="text-xl font-bold text-white mb-2">Chưa có Reels nào</h2>
                <p className="text-slate-400 text-center mb-6">
                    Các video ngắn sẽ xuất hiện ở đây
                </p>
                <Link href="/" className="text-cyan-400 hover:underline">
                    Quay lại trang chủ
                </Link>
            </div>
        );
    }

    return (
        <div className="h-screen bg-black relative">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-40 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/80 to-transparent">
                <Link href="/" className="p-2 text-white">
                    <ChevronLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-white font-bold text-lg">Nhutcoder Reels</h1>
                {user?.role === 'ADMIN' && (
                    <Link href="/reels/upload" className="p-2 text-white">
                        <Plus className="w-6 h-6" />
                    </Link>
                )}
            </div>

            {/* Reels container */}
            <div
                ref={containerRef}
                onScroll={handleScroll}
                className="h-full overflow-y-scroll snap-y snap-mandatory"
                style={{ scrollSnapType: 'y mandatory' }}
            >
                {reels.map((reel, index) => (
                    <div
                        key={reel.id}
                        className="h-screen snap-start snap-always"
                    >
                        <ReelCard
                            reel={reel}
                            isActive={index === activeIndex}
                            onOpenComments={() => openComments(reel.id)}
                        />
                    </div>
                ))}
            </div>

            {/* Comments modal */}
            {selectedReelId && (
                <ReelComments
                    reelId={selectedReelId}
                    isOpen={commentsOpen}
                    onClose={() => setCommentsOpen(false)}
                />
            )}
        </div>
    );
}
