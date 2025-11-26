import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        // Get posts published in last 2 days (Google News requirement)
        const twoDaysAgo = new Date();
        twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

        const posts = await prisma.post.findMany({
            where: {
                published: true,
                createdAt: {
                    gte: twoDaysAgo,
                },
            },
            include: {
                author: {
                    select: { name: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 1000, // Google News limit
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog-89b4.vercel.app';

        const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${posts
                .map((post) => {
                    const pubDate = new Date(post.createdAt).toISOString();
                    const title = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    const keywords = post.tags?.join(', ') || '';

                    return `  <url>
    <loc>${baseUrl}/blog/${post.id}</loc>
    <news:news>
      <news:publication>
        <news:name>BlogApp</news:name>
        <news:language>vi</news:language>
      </news:publication>
      <news:publication_date>${pubDate}</news:publication_date>
      <news:title>${title}</news:title>
      <news:keywords>${keywords}</news:keywords>
    </news:news>
  </url>`;
                })
                .join('\n')}
</urlset>`;

        return new NextResponse(sitemap, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate',
            },
        });
    } catch (error) {
        console.error('Error generating news sitemap:', error);
        return new NextResponse('Error generating sitemap', { status: 500 });
    }
}
