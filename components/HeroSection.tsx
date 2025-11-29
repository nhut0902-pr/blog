'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { TrendingUp, Sparkles } from 'lucide-react';
import SearchBar from './SearchBar';

interface FeaturedPost {
    id: string;
    title: string;
    content: string;
    imageUrl: string | null;
    category: string | null;
    createdAt: Date;
    author: {
        name: string;
    };
}

export default function HeroSection() {
    const [featuredPost, setFeaturedPost] = useState<FeaturedPost | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch popular posts and display the top one
        fetch('/api/posts/popular')
            .then((res) => res.json())
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    setFeaturedPost(data[0]);
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error('HeroSection fetch error:', err);
                setLoading(false);
            });
    }, []);

    return (
        <div className="relative mb-12 group">
            {/* Tech Background Effect */}
            <div className="absolute inset-0 bg-slate-950 rounded-xl overflow-hidden -z-10 border border-slate-800">
                {/* Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.15]"
                    style={{
                        backgroundImage: 'linear-gradient(#4f46e5 1px, transparent 1px), linear-gradient(90deg, #4f46e5 1px, transparent 1px)',
                        backgroundSize: '32px 32px'
                    }}
                />

                {/* Glowing Orbs */}
                <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-600/20 rounded-full blur-[100px] translate-x-1/2 translate-y-1/2" />
            </div>

            <div className="relative p-8 lg:p-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                    {/* Left: Text Content */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="inline-flex items-center space-x-2">
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                            </span>
                            <span className="text-sm font-mono text-cyan-400 tracking-wider uppercase">Featured_Post.exe</span>
                        </div>

                        {loading ? (
                            <div className="space-y-4">
                                <div className="h-12 bg-slate-800 rounded animate-pulse w-3/4" />
                                <div className="h-24 bg-slate-800 rounded animate-pulse" />
                            </div>
                        ) : featuredPost ? (
                            <>
                                <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-white font-mono tracking-tight">
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">
                                        {featuredPost.title}
                                    </span>
                                </h1>
                                <p className="text-lg text-slate-400 line-clamp-3 font-light border-l-2 border-slate-700 pl-4">
                                    {featuredPost.content ? featuredPost.content.substring(0, 200) : ''}...
                                </p>
                                <div className="flex items-center space-x-4 pt-4">
                                    <Link
                                        href={`/blog/${featuredPost.id}`}
                                        className="group/btn relative inline-flex items-center px-8 py-3 bg-slate-900 text-cyan-400 font-mono text-sm border border-cyan-500/30 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all duration-300 overflow-hidden"
                                    >
                                        <span className="absolute inset-0 bg-cyan-950/50 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
                                        <span className="relative flex items-center">
                                            READ_MORE
                                            <TrendingUp size={16} className="ml-2" />
                                        </span>
                                    </Link>
                                    <div className="text-xs font-mono text-slate-500 flex items-center space-x-4">
                                        <span>// {featuredPost.author?.name || 'SYSTEM'}</span>
                                        <span>:: {new Date(featuredPost.createdAt).toLocaleDateString('vi-VN')}</span>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div>
                                <h1 className="text-4xl lg:text-5xl font-bold leading-tight text-white font-mono mb-4">
                                    HELLO_WORLD
                                </h1>
                                <p className="text-lg text-slate-400 font-mono">
                                    &gt; Initializing tech blog sequence...<br />
                                    &gt; Loading knowledge base...
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Right: Featured Image or Search */}
                    <div className="relative">
                        {/* Decorative corners */}
                        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-cyan-500/50" />
                        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-2 border-r-2 border-cyan-500/50" />
                        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-2 border-l-2 border-cyan-500/50" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-cyan-500/50" />

                        {featuredPost?.imageUrl ? (
                            <div className="relative group overflow-hidden bg-slate-900 border border-slate-800">
                                <div className="absolute inset-0 bg-cyan-500/10 mix-blend-overlay z-10" />
                                <img
                                    src={featuredPost.imageUrl}
                                    alt={featuredPost.title}
                                    className="w-full h-80 object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500 grayscale group-hover:grayscale-0"
                                />
                                {featuredPost.category && (
                                    <div className="absolute top-0 right-0 bg-cyan-500 text-slate-900 text-xs font-bold px-3 py-1 font-mono uppercase z-20">
                                        {featuredPost.category}
                                    </div>
                                )}
                                {/* Scanline effect */}
                                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] pointer-events-none z-10 opacity-20" />
                            </div>
                        ) : (
                            <div className="bg-slate-900/50 border border-slate-700 p-6 backdrop-blur-sm">
                                <h3 className="text-xl font-bold text-white font-mono mb-4 flex items-center">
                                    <span className="text-cyan-400 mr-2">&gt;</span> SEARCH_QUERY
                                </h3>
                                <SearchBar />
                                <div className="flex flex-wrap gap-2 mt-4">
                                    <span className="text-xs font-mono text-slate-500 uppercase">Tags:</span>
                                    {['React', 'Next.js', 'TypeScript', 'AI'].map((tag) => (
                                        <button
                                            key={tag}
                                            className="px-2 py-1 bg-slate-800 text-cyan-400 border border-cyan-900/50 text-xs font-mono hover:bg-cyan-950 hover:border-cyan-500/50 transition-all"
                                        >
                                            #{tag}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
