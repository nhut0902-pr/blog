'use client';

import { useState, useRef, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Play, Pause, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

interface ReelCardProps {
    reel: {
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
    };
    isActive: boolean;
    onOpenComments: () => void;
}

export default function ReelCard({ reel, isActive, onOpenComments }: ReelCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(reel._count.likes);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        if (videoRef.current) {
            if (isActive) {
                videoRef.current.play().catch(() => { });
                setIsPlaying(true);
            } else {
                videoRef.current.pause();
                videoRef.current.currentTime = 0;
                setIsPlaying(false);
            }
        }
    }, [isActive]);

    useEffect(() => {
        // Check if user liked this reel
        fetch(`/api/reels/${reel.id}/like`)
            .then(res => res.json())
            .then(data => setLiked(data.liked))
            .catch(() => { });
    }, [reel.id]);

    const togglePlay = () => {
        if (videoRef.current) {
            if (isPlaying) {
                videoRef.current.pause();
            } else {
                videoRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const toggleMute = () => {
        if (videoRef.current) {
            videoRef.current.muted = !isMuted;
            setIsMuted(!isMuted);
        }
    };

    const handleLike = async () => {
        if (isLiking) return;
        setIsLiking(true);

        try {
            const res = await fetch(`/api/reels/${reel.id}/like`, {
                method: 'POST'
            });
            const data = await res.json();

            if (res.ok) {
                setLiked(data.liked);
                setLikeCount(prev => data.liked ? prev + 1 : prev - 1);
            }
        } catch (error) {
            console.error('Like failed:', error);
        } finally {
            setIsLiking(false);
        }
    };

    const handleShare = async () => {
        try {
            await navigator.share({
                title: reel.title || 'Nhutcoder Reels',
                url: `${window.location.origin}/reels/${reel.id}`
            });
        } catch {
            // Fallback: copy to clipboard
            navigator.clipboard.writeText(`${window.location.origin}/reels/${reel.id}`);
            alert('Đã copy link!');
        }
    };

    return (
        <div className="relative w-full h-full bg-black flex items-center justify-center">
            {/* Video */}
            <video
                ref={videoRef}
                src={reel.videoUrl}
                poster={reel.thumbnailUrl}
                className="w-full h-full object-contain"
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
            />

            {/* Play/Pause overlay */}
            {!isPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                    <Play className="w-20 h-20 text-white/80" fill="white" />
                </div>
            )}

            {/* Mute button */}
            <button
                onClick={toggleMute}
                className="absolute top-4 right-4 p-2 bg-black/50 rounded-full"
            >
                {isMuted ? (
                    <VolumeX className="w-5 h-5 text-white" />
                ) : (
                    <Volume2 className="w-5 h-5 text-white" />
                )}
            </button>

            {/* Right side actions */}
            <div className="absolute right-4 bottom-32 flex flex-col items-center gap-6">
                {/* Like button */}
                <button
                    onClick={handleLike}
                    className="flex flex-col items-center"
                    disabled={isLiking}
                >
                    <div className={`p-3 rounded-full ${liked ? 'bg-red-500' : 'bg-black/50'}`}>
                        <Heart
                            className={`w-7 h-7 ${liked ? 'text-white fill-white' : 'text-white'}`}
                        />
                    </div>
                    <span className="text-white text-xs mt-1">{likeCount}</span>
                </button>

                {/* Comment button */}
                <button
                    onClick={onOpenComments}
                    className="flex flex-col items-center"
                >
                    <div className="p-3 rounded-full bg-black/50">
                        <MessageCircle className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white text-xs mt-1">{reel._count.comments}</span>
                </button>

                {/* Share button */}
                <button
                    onClick={handleShare}
                    className="flex flex-col items-center"
                >
                    <div className="p-3 rounded-full bg-black/50">
                        <Share2 className="w-7 h-7 text-white" />
                    </div>
                    <span className="text-white text-xs mt-1">Chia sẻ</span>
                </button>
            </div>

            {/* Bottom info */}
            <div className="absolute bottom-8 left-4 right-20">
                <Link href={`/profile/${reel.author.id}`} className="flex items-center gap-2 mb-2">
                    {reel.author.avatarUrl ? (
                        <img
                            src={reel.author.avatarUrl}
                            alt={reel.author.name}
                            className="w-10 h-10 rounded-full border-2 border-white"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-cyan-500 flex items-center justify-center border-2 border-white">
                            <span className="text-white font-bold">
                                {reel.author.name.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                    <span className="text-white font-semibold">@{reel.author.name}</span>
                </Link>

                {reel.title && (
                    <p className="text-white font-medium mb-1">{reel.title}</p>
                )}

                {reel.description && (
                    <p className="text-white/80 text-sm line-clamp-2">{reel.description}</p>
                )}

                <p className="text-white/60 text-xs mt-2">{reel.views} lượt xem</p>
            </div>
        </div>
    );
}
