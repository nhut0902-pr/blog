import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { sendNewPostNotification } from '@/lib/email';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        // Verify admin authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { postId } = await request.json();

        if (!postId) {
            return NextResponse.json({ error: 'Post ID required' }, { status: 400 });
        }

        // Get post details
        const post = await prisma.post.findUnique({
            where: { id: postId },
            select: {
                id: true,
                title: true,
                content: true,
            },
        });

        if (!post) {
            return NextResponse.json({ error: 'Post not found' }, { status: 404 });
        }

        // Get all active subscribers
        const subscribers = await prisma.subscriber.findMany({
            where: { active: true },
            select: { email: true },
        });

        if (subscribers.length === 0) {
            return NextResponse.json({ message: 'No active subscribers' }, { status: 200 });
        }

        // Send emails
        const emails = subscribers.map((s) => s.email);
        const result = await sendNewPostNotification(post, emails);

        return NextResponse.json({
            message: `Đã gửi email tới ${result.successful}/${result.total} người đăng ký`,
            ...result,
        });
    } catch (error) {
        console.error('Send newsletter error:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra khi gửi email' }, { status: 500 });
    }
}
