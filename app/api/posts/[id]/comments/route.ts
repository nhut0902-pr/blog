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
            where: {
                postId: id,
                status: { not: 'REJECTED' }
            },
            include: {
                user: {
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

        const userId = payload.userId as string;

        const { content, parentId } = await request.json();

        if (!content) {
            return NextResponse.json({ error: 'Content is required' }, { status: 400 });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId: id,
                userId,
                parentId: parentId || null,
            },
            include: {
                user: {
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
        });

        // Parse mentions and create notifications
        const mentionRegex = /@(\w+)/g;
        const mentions = content.match(mentionRegex);

        if (mentions) {
            const mentionedNames = mentions.map((m: string) => m.substring(1));
            const mentionedUsers = await prisma.user.findMany({
                where: {
                    name: { in: mentionedNames, mode: 'insensitive' },
                },
            });

            for (const mentionedUser of mentionedUsers) {
                if (mentionedUser.id !== userId) {
                    await prisma.notification.create({
                        data: {
                            type: 'MENTION',
                            message: `${payload.name || 'Someone'} mentioned you in a comment: "${content.substring(0, 20)}..."`,
                            userId: mentionedUser.id,
                            senderId: userId,
                            postId: id,
                        },
                    });
                }
            }
        }

        // Notify post author if not self and not already notified by mention
        const post = await prisma.post.findUnique({ where: { id } });
        if (post && post.authorId !== userId) {
            // Check if post author was already mentioned to avoid double notification
            const postAuthor = await prisma.user.findUnique({ where: { id: post.authorId } });
            const isMentioned = mentions && postAuthor && mentions.some((m: string) => m.substring(1).toLowerCase() === postAuthor.name.toLowerCase());

            if (!isMentioned) {
                await prisma.notification.create({
                    data: {
                        type: 'COMMENT',
                        message: `${payload.name || 'Someone'} commented on your post "${post.title}"`,
                        userId: post.authorId,
                        senderId: userId,
                        postId: id,
                    },
                });
            }
        }

        // Notify parent comment author if reply
        if (parentId) {
            const parentComment = await prisma.comment.findUnique({ where: { id: parentId } });
            if (parentComment && parentComment.userId !== userId && parentComment.userId !== post?.authorId) {
                // Check if parent author was already mentioned
                const parentAuthor = await prisma.user.findUnique({ where: { id: parentComment.userId } });
                const isMentioned = mentions && parentAuthor && mentions.some((m: string) => m.substring(1).toLowerCase() === parentAuthor.name.toLowerCase());

                if (!isMentioned) {
                    await prisma.notification.create({
                        data: {
                            type: 'REPLY',
                            message: `${payload.name || 'Someone'} replied to your comment`,
                            userId: parentComment.userId,
                            senderId: userId,
                            postId: id,
                        },
                    });
                }
            }
        }

        return NextResponse.json(comment);
    } catch (error) {
        return NextResponse.json({ error: 'Error creating comment' }, { status: 500 });
    }
}
