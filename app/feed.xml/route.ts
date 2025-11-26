import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: {
                author: {
                    select: { name: true },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 50,
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://blog-89b4.vercel.app';

        const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>BlogApp</title>
    <link>${baseUrl}</link>
    <description>Nền tảng blog hiện đại với dark mode, tìm kiếm, bookmarks, và nhiều tính năng khác</description>
    <language>vi</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml"/>
${posts
                .map((post) => {
                    const title = post.title.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                    const content = post.content
                        .substring(0, 500)
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;');
                    const link = `${baseUrl}/blog/${post.id}`;
                    const pubDate = new Date(post.createdAt).toUTCString();
                    const author = post.author.name || 'Anonymous';
                    const categories = post.tags?.map((tag) => `      <category>${tag}</category>`).join('\n') || '';

                    return `    <item>
      <title>${title}</title>
      <link>${link}</link>
      <guid isPermaLink="true">${link}</guid>
      <description>${content}...</description>
      <author>${author}</author>
      <pubDate>${pubDate}</pubDate>
${categories}
    </item>`;
                })
                .join('\n')}
  </channel>
</rss>`;

        return new NextResponse(rss, {
            headers: {
                'Content-Type': 'application/xml',
                'Cache-Control': 'public, s-maxage=1800, stale-while-revalidate',
            },
        });
    } catch (error) {
        console.error('Error generating RSS feed:', error);
        return new NextResponse('Error generating feed', { status: 500 });
    }
}
