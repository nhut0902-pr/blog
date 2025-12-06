import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Get comments for a reel
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: reelId } = await params;

        const comments = await prisma.reelComment.findMany({
            where: { reelId },
            orderBy: { createdAt: 'desc' },
            include: {
                user: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            }
        });

        return NextResponse.json(comments);
    } catch (error) {
        console.error('Error fetching comments:', error);
        return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
    }
}

// POST - Add comment to reel
export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: reelId } = await params;

        // Verify authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const { content } = await request.json();

        if (!content || content.trim().length === 0) {
            return NextResponse.json({ error: 'Comment content is required' }, { status: 400 });
        }

        // Check if reel exists
        const reel = await prisma.reel.findUnique({ where: { id: reelId } });
        if (!reel) {
            return NextResponse.json({ error: 'Reel not found' }, { status: 404 });
        }

        const comment = await prisma.reelComment.create({
            data: {
                content: content.trim(),
                reelId,
                userId: payload.sub as string
            },
            include: {
                user: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            }
        });

        return NextResponse.json(comment, { status: 201 });
    } catch (error) {
        console.error('Error creating comment:', error);
        return NextResponse.json({ error: 'Failed to create comment' }, { status: 500 });
    }
}
