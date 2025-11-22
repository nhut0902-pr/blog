import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import prisma from '@/lib/prisma';
import LikeButton from '@/components/LikeButton';
import BookmarkButton from '@/components/BookmarkButton';
import ShareButtons from '@/components/ShareButtons';
import CommentSection from '@/components/CommentSection';
import { Calendar, User as UserIcon } from 'lucide-react';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';

async function getPost(id: string) {
    const post = await prisma.post.findUnique({
        where: { id },
        include: {
            author: {
                select: { name: true },
            },
            _count: {
                select: { likes: true },
            },
        },
    });
    return post;
}

async function getIsLiked(postId: string) {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;
    if (!token) return false;

    const payload = await verifyJWT(token);
    if (!payload) return false;

    const like = await prisma.like.findUnique({
        where: {
            postId_userId: {
                postId,
                userId: payload.sub as string,
            },
        },
    });

    return !!like;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const { id } = await params;
    const post = await getPost(id);

    if (!post) {
        return {
            title: 'Post Not Found',
        };
    }

    const excerpt = post.content.substring(0, 160);
    const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${id}`;

    return {
        title: post.title,
        description: excerpt,
        keywords: post.tags?.join(', '),
        authors: [{ name: post.author.name || 'Anonymous' }],
        openGraph: {
            title: post.title,
            description: excerpt,
            url,
            type: 'article',
            publishedTime: post.createdAt.toISOString(),
            modifiedTime: post.updatedAt.toISOString(),
            authors: [post.author.name || 'Anonymous'],
            tags: post.tags,
            images: post.imageUrl ? [{ url: post.imageUrl }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: post.title,
            description: excerpt,
            images: post.imageUrl ? [post.imageUrl] : [],
        },
        alternates: {
            canonical: url,
        },
    };
}

export default async function BlogDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getPost(id);
    const isLiked = await getIsLiked(id);

    if (!post) {
        notFound();
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

    // JSON-LD Structured Data for SEO
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.content.substring(0, 160),
        image: post.imageUrl || `${baseUrl}/og-image.png`,
        datePublished: post.createdAt.toISOString(),
        dateModified: post.updatedAt.toISOString(),
        author: {
            '@type': 'Person',
            name: post.author.name || 'Anonymous',
        },
        publisher: {
            '@type': 'Organization',
            name: 'BlogApp',
            logo: {
                '@type': 'ImageObject',
                url: `${baseUrl}/logo.png`,
            },
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `${baseUrl}/blog/${post.id}`,
        },
    };

    return (
        <>
            {/* JSON-LD Structured Data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 dark:bg-gray-900">
                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 mb-6">
                        <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <Calendar size={14} className="mr-2" />
                            {new Date(post.createdAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center bg-gray-100 px-3 py-1 rounded-full">
                            <UserIcon size={14} className="mr-2" />
                            {post.author.name || 'Anonymous'}
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-6 leading-tight">
                        {post.title}
                    </h1>

                    <div className="flex justify-center mb-6">
                        <ShareButtons
                            url={`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/blog/${post.id}`}
                            title={post.title}
                            description={post.content.substring(0, 160)}
                        />
                    </div>

                    <div className="flex justify-center space-x-4">
                        <LikeButton
                            postId={post.id}
                            initialLikes={post._count.likes}
                            initialLiked={isLiked}
                        />
                        <BookmarkButton postId={post.id} />
                    </div>
                </header>

                <div className="prose prose-lg prose-indigo mx-auto text-gray-700">
                    {post.content.split('\n').map((paragraph: string, idx: number) => (
                        <p key={idx} className="mb-4 leading-relaxed">
                            {paragraph}
                        </p>
                    ))}
                </div>

                <hr className="my-12 border-gray-200" />

                <CommentSection postId={post.id} />
            </article>
        </>
    );
}
