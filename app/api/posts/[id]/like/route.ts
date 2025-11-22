import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);

        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.sub as string;
        const postId = id;

        const existingLike = await prisma.like.findUnique({
            where: {
                postId_userId: {
                    postId,
                    userId,
                },
            },
        });

        if (existingLike) {
            await prisma.like.delete({
                where: { id: existingLike.id },
            });
            return NextResponse.json({ liked: false });
        } else {
            await prisma.like.create({
                data: {
                    postId,
                    userId,
                },
            });
            return NextResponse.json({ liked: true });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Error toggling like' }, { status: 500 });
    }
}
