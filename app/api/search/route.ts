import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const query = searchParams.get('q');

        if (!query || query.trim().length === 0) {
            return NextResponse.json([]);
        }

        const searchTerm = query.trim();

        // Search in title, content, and tags
        const posts = await prisma.post.findMany({
            where: {
                published: true,
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        content: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        tags: {
                            hasSome: [searchTerm],
                        },
                    },
                ],
            },
            include: {
                author: {
                    select: { name: true, email: true },
                },
                _count: {
                    select: { comments: true, likes: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 20, // Limit results
        });

        return NextResponse.json(posts);
    } catch (error) {
        console.error('Search error:', error);
        return NextResponse.json({ error: 'Error searching posts' }, { status: 500 });
    }
}
