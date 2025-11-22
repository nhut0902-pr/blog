'use client';

import { useEffect, useState } from 'react';
import { BarChart, Users, FileText, MessageSquare, Eye, TrendingUp, Calendar } from 'lucide-react';
import Link from 'next/link';

interface Stats {
    totalPosts: number;
    totalUsers: number;
    totalComments: number;
    totalViews: number;
    recentPosts: any[];
    topPosts: any[];
}

export default function AnalyticsPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch('/api/admin/stats');
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (error) {
                console.error('Error fetching stats:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!stats) return null;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                    <BarChart className="mr-3" />
                    Analytics Dashboard
                </h1>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg text-blue-600 dark:text-blue-300">
                                <FileText size={24} />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Posts</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalPosts}</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-lg text-green-600 dark:text-green-300">
                                <Users size={24} />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalUsers}</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-600 dark:text-purple-300">
                                <MessageSquare size={24} />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Comments</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalComments}</h3>
                    </div>

                    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg text-orange-600 dark:text-orange-300">
                                <Eye size={24} />
                            </div>
                            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Views</span>
                        </div>
                        <h3 className="text-3xl font-bold text-gray-900 dark:text-white">{stats.totalViews}</h3>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Top Posts */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <TrendingUp className="mr-2 text-indigo-600" />
                            Top Performing Posts
                        </h2>
                        <div className="space-y-6">
                            {stats.topPosts.map((post, index) => (
                                <div key={post.id} className="flex items-center">
                                    <span className="text-2xl font-bold text-gray-300 dark:text-gray-600 mr-4 w-8">
                                        #{index + 1}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <Link href={`/blog/${post.id}`} className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 truncate block">
                                            {post.title}
                                        </Link>
                                        <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400 space-x-4">
                                            <span className="flex items-center">
                                                <Eye size={14} className="mr-1" /> {post.views}
                                            </span>
                                            <span className="flex items-center">
                                                <MessageSquare size={14} className="mr-1" /> {post._count.comments}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Activity */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6">
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                            <Calendar className="mr-2 text-indigo-600" />
                            Recent Posts
                        </h2>
                        <div className="space-y-6">
                            {stats.recentPosts.map((post) => (
                                <div key={post.id} className="flex items-start border-b border-gray-100 dark:border-gray-700 last:border-0 pb-4 last:pb-0">
                                    <div className="flex-1">
                                        <Link href={`/blog/${post.id}`} className="text-gray-900 dark:text-white font-medium hover:text-indigo-600 block mb-1">
                                            {post.title}
                                        </Link>
                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                            <span>by {post.author.name}</span>
                                            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
