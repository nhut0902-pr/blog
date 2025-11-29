import Link from 'next/link';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { Plus, Edit, Trash2 } from 'lucide-react';
import DeletePostButton from '@/components/DeletePostButton';
import SeasonalEffectToggle from '@/components/admin/SeasonalEffectToggle';

export const dynamic = 'force-dynamic';

async function getPosts() {
    const posts = await prisma.post.findMany({
        orderBy: { createdAt: 'desc' },
        include: {
            author: {
                select: { name: true },
            },
        },
    });
    return posts;
}

export default async function AdminDashboard() {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
        redirect('/login');
    }

    const payload = await verifyJWT(token);

    if (!payload || payload.role !== 'ADMIN') {
        redirect('/');
    }

    const posts = await getPosts();

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
                <Link
                    href="/admin/create"
                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                    <Plus size={20} className="mr-2" />
                    Create New Post
                </Link>
            </div>

            {/* Seasonal Effect Toggle */}
            <div className="mb-8">
                <SeasonalEffectToggle />
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Link href="/admin/comments" className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-400 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Quản lý Bình luận</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Duyệt và kiểm duyệt comments</p>
                        </div>
                        <div className="text-indigo-600 dark:text-indigo-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/analytics" className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-green-500 dark:hover:border-green-400 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Thống kê</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Xem analytics và insights</p>
                        </div>
                        <div className="text-green-600 dark:text-green-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                        </div>
                    </div>
                </Link>

                <Link href="/admin/create" className="bg-white dark:bg-gray-800 p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:border-purple-500 dark:hover:border-purple-400 transition-all shadow-sm hover:shadow-md">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">Tạo bài mới</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Viết bài blog mới</p>
                        </div>
                        <div className="text-purple-600 dark:text-purple-400">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                </Link>
            </div>

            <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Author
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {posts.map((post: any) => (
                            <tr key={post.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{post.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{post.author.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span
                                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${post.published
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                            }`}
                                    >
                                        {post.published ? 'Published' : 'Draft'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(post.createdAt).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end space-x-3">
                                    <Link
                                        href={`/admin/edit/${post.id}`}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <Edit size={18} />
                                    </Link>
                                    <DeletePostButton postId={post.id} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
