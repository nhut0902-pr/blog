import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Check if post is bookmarked
export async function GET(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ bookmarked: false });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ bookmarked: false });
        }

        const bookmark = await prisma.bookmark.findUnique({
            where: {
                userId_postId: {
                    userId: payload.sub as string,
                    postId,
                },
            },
        });

        return NextResponse.json({ bookmarked: !!bookmark });
    } catch (error) {
        return NextResponse.json({ bookmarked: false });
    }
}

// Remove bookmark
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ postId: string }> }
) {
    try {
        const { postId } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.bookmark.delete({
            where: {
                userId_postId: {
                    userId: payload.sub as string,
                    postId,
                },
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error removing bookmark' }, { status: 500 });
    }
}
