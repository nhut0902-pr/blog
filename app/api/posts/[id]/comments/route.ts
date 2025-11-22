import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Get all comments for this post
        const allComments = await prisma.comment.findMany({
            where: { postId: id },
            include: {
                author: {
                    select: {
                        name: true,
                        email: true,
                        avatarUrl: true,
                    },
                },
                reactions: {
                    select: {
                        type: true,
                        userId: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        // Build nested structure
        const commentMap = new Map();
        const rootComments: any[] = [];

        // First pass: create map
        allComments.forEach(comment => {
            commentMap.set(comment.id, { ...comment, replies: [] });
        });

        // Second pass: build tree
        allComments.forEach(comment => {
            const commentWithReplies = commentMap.get(comment.id);
            if (comment.parentId) {
                const parent = commentMap.get(comment.parentId);
                if (parent) {
                    parent.replies.push(commentWithReplies);
                }
            } else {
                rootComments.push(commentWithReplies);
            }
        });

        return NextResponse.json(rootComments);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching comments' }, { status: 500 });
    }
}

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

        const { content, parentId } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: id,
                userId: payload.sub as string,
                parentId: parentId || null,
            },
            include: {
                user: {
                    select: { name: true, email: true, avatarUrl: true },
                },
            },
        });

        return NextResponse.json(comment);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating comment' }, { status: 500 });
    }
}
