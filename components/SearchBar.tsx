'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface SearchResult {
    id: string;
    title: string;
    content: string;
    tags?: string[];
    category?: string;
    author: {
        name: string;
    };
    _count: {
        comments: number;
        likes: number;
    };
}

export default function SearchBar() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const searchRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        const searchPosts = async () => {
            if (query.trim().length < 2) {
                setResults([]);
                return;
            }

            setLoading(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                if (res.ok) {
                    const data = await res.json();
                    setResults(data);
                    setShowResults(true);
                }
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setLoading(false);
            }
        };

        const debounce = setTimeout(searchPosts, 300);
        return () => clearTimeout(debounce);
    }, [query]);

    const handleClear = () => {
        setQuery('');
        setResults([]);
        setShowResults(false);
    };

    return (
        <div ref={searchRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
                    size={20}
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query.length >= 2 && setShowResults(true)}
                    placeholder="Tìm kiếm bài viết..."
                    className="w-full pl-10 pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-white"
                />
                {query && (
                    <button
                        onClick={handleClear}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                        <X size={18} />
                    </button>
                )}
                {loading && (
                    <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
                        <Loader2 className="animate-spin text-indigo-600" size={18} />
                    </div>
                )}
            </div>

            {showResults && query.length >= 2 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto z-50">
                    {results.length > 0 ? (
                        <div className="py-2">
                            {results.map((post) => (
                                <Link
                                    key={post.id}
                                    href={`/blog/${post.id}`}
                                    onClick={() => {
                                        setShowResults(false);
                                        setQuery('');
                                    }}
                                    className="block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <h4 className="font-medium text-gray-900 dark:text-white mb-1 line-clamp-1">
                                        {post.title}
                                    </h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">
                                        {post.content.substring(0, 100)}...
                                    </p>
                                    <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-500">
                                        <span>{post.author.name}</span>
                                        <span>•</span>
                                        <span>{post._count.comments} bình luận</span>
                                        <span>•</span>
                                        <span>{post._count.likes} lượt thích</span>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                            Không tìm thấy kết quả cho "{query}"
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
