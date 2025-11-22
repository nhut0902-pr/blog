import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Get user's bookmarks
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const bookmarks = await prisma.bookmark.findMany({
            where: { userId: payload.sub as string },
            include: {
                post: {
                    include: {
                        author: {
                            select: { name: true, email: true, avatarUrl: true },
                        },
                        _count: {
                            select: { comments: true, likes: true },
                        },
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(bookmarks);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching bookmarks' }, { status: 500 });
    }
}

// Add bookmark
export async function POST(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: 'Post ID is required' }, { status: 400 });
        }

        const bookmark = await prisma.bookmark.create({
            data: {
                userId: payload.sub as string,
                postId,
            },
        });

        return NextResponse.json(bookmark);
    } catch (error: any) {
        if (error.code === 'P2002') {
            return NextResponse.json({ error: 'Already bookmarked' }, { status: 409 });
        }
        return NextResponse.json({ error: 'Error creating bookmark' }, { status: 500 });
    }
}
