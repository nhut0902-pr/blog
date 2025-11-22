import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            orderBy: { views: 'desc' },
            take: 5,
            select: {
                id: true,
                title: true,
                views: true,
                imageUrl: true,
                createdAt: true,
                author: {
                    select: { name: true },
                },
            },
        });

        return NextResponse.json(posts);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching popular posts' }, { status: 500 });
    }
}
