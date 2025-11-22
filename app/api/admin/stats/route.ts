import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Fetch stats
        const [
            totalPosts,
            totalUsers,
            totalComments,
            totalViews,
            recentPosts,
            topPosts
        ] = await Promise.all([
            prisma.post.count(),
            prisma.user.count(),
            prisma.comment.count(),
            prisma.post.aggregate({
                _sum: {
                    views: true
                }
            }),
            prisma.post.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                select: {
                    id: true,
                    title: true,
                    createdAt: true,
                    views: true,
                    author: { select: { name: true } }
                }
            }),
            prisma.post.findMany({
                take: 5,
                orderBy: { views: 'desc' },
                select: {
                    id: true,
                    title: true,
                    views: true,
                    _count: { select: { likes: true, comments: true } }
                }
            })
        ]);

        return NextResponse.json({
            totalPosts,
            totalUsers,
            totalComments,
            totalViews: totalViews._sum.views || 0,
            recentPosts,
            topPosts
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching stats' }, { status: 500 });
    }
}
