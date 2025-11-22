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
        const { type } = await request.json();
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = payload.userId as string;

        // Check if reaction already exists
        const existingReaction = await prisma.commentReaction.findUnique({
            where: {
                userId_commentId: {
                    userId,
                    commentId: id,
                },
            },
        });

        if (existingReaction) {
            if (existingReaction.type === type) {
                // Remove reaction if clicking same type
                await prisma.commentReaction.delete({
                    where: { id: existingReaction.id },
                });
                return NextResponse.json({ action: 'removed' });
            } else {
                // Update reaction type
                const updated = await prisma.commentReaction.update({
                    where: { id: existingReaction.id },
                    data: { type },
                });
                return NextResponse.json({ action: 'updated', reaction: updated });
            }
        } else {
            // Create new reaction
            const newReaction = await prisma.commentReaction.create({
                data: {
                    type,
                    userId,
                    commentId: id,
                },
            });

            // Create notification for comment author (if not self)
            const comment = await prisma.comment.findUnique({
                where: { id },
                select: { userId: true, content: true, postId: true }
            });

            if (comment && comment.userId !== userId) {
                await prisma.notification.create({
                    data: {
                        type: 'REACTION',
                        message: `${payload.name || 'Someone'} reacted to your comment: "${comment.content.substring(0, 20)}..."`,
                        userId: comment.userId,
                        senderId: userId,
                        postId: comment.postId
                    }
                });
            }

            return NextResponse.json({ action: 'created', reaction: newReaction });
        }
    } catch (error) {
        console.error('Error handling reaction:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
