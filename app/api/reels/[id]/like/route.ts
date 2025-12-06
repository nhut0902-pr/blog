import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import prisma from '@/lib/prisma';

// POST - Like/Unlike reel
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

        const userId = payload.sub as string;

        // Check if reel exists
        const reel = await prisma.reel.findUnique({ where: { id: reelId } });
        if (!reel) {
            return NextResponse.json({ error: 'Reel not found' }, { status: 404 });
        }

        // Check if already liked
        const existingLike = await prisma.reelLike.findUnique({
            where: {
                reelId_userId: { reelId, userId }
            }
        });

        if (existingLike) {
            // Unlike
            await prisma.reelLike.delete({
                where: { id: existingLike.id }
            });
            return NextResponse.json({ liked: false });
        } else {
            // Like
            await prisma.reelLike.create({
                data: { reelId, userId }
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        console.error('Error liking reel:', error);
        return NextResponse.json({ error: 'Failed to like reel' }, { status: 500 });
    }
}

// GET - Check if user liked reel
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: reelId } = await params;

        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ liked: false });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ liked: false });
        }

        const like = await prisma.reelLike.findUnique({
            where: {
                reelId_userId: { reelId, userId: payload.sub as string }
            }
        });

        return NextResponse.json({ liked: !!like });
    } catch (error) {
        return NextResponse.json({ liked: false });
    }
}
