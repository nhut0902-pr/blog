import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const tag = searchParams.get('tag');
        const category = searchParams.get('category');
        const cursor = searchParams.get('cursor');
        const limit = parseInt(searchParams.get('limit') || '10');

        const where: any = { published: true };

        if (tag) {
            where.tags = { has: tag };
        }

        if (category) {
            where.category = category;
        }

        const posts = await prisma.post.findMany({
            where,
            take: limit + 1, // Fetch one extra to check if there are more
            ...(cursor && {
                skip: 1,
                cursor: { id: cursor },
            }),
            include: {
                author: {
                    select: { name: true, email: true },
                },
                _count: {
                    select: { comments: true, likes: true },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        const hasMore = posts.length > limit;
        const postsToReturn = hasMore ? posts.slice(0, -1) : posts;
        const nextCursor = hasMore ? posts[posts.length - 2].id : null;

        return NextResponse.json({
            posts: postsToReturn,
            nextCursor,
            hasMore,
        });
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching posts' }, { status: 500 });
    }
}

export async function POST(request: Request) {
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

        const { title, content, published, tags, category, imageUrl } = await request.json();

        const post = await prisma.post.create({
            data: {
                title,
                content,
                published: published ?? false,
                tags: tags || [],
                category,
                imageUrl,
                authorId: payload.sub as string,
            },
        });

        revalidatePath('/');
        revalidatePath('/admin');

        return NextResponse.json(post);
    } catch (error) {
        console.error('Create post error:', error);
        return NextResponse.json({ error: 'Error creating post' }, { status: 500 });
    }
}
