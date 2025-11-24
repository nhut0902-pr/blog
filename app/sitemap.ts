import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog-89b4.vercel.app';

    // Get all published posts
    const posts = await prisma.post.findMany({
        where: { published: true },
        select: {
            id: true,
            updatedAt: true,
        },
        orderBy: { updatedAt: 'desc' },
    });

    // Get all categories
    const categories = await prisma.category.findMany({
        select: {
            slug: true,
            updatedAt: true,
        },
    });

    const postUrls = posts.map((post) => ({
        url: `${baseUrl}/blog/${post.id}`,
        lastModified: post.updatedAt,
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    const categoryUrls = categories.map((category) => ({
        url: `${baseUrl}/?category=${category.slug}`,
        lastModified: category.updatedAt,
        changeFrequency: 'daily' as const,
        priority: 0.6,
    }));

    return [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        ...postUrls,
        ...categoryUrls,
    ];
}
