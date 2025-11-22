import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Get user notifications
export async function GET() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: { userId: payload.sub as string },
            include: {
                sender: {
                    select: { name: true, avatarUrl: true },
                },
            },
            orderBy: { createdAt: 'desc' },
            take: 20,
        });

        return NextResponse.json(notifications);
    } catch (error) {
        console.error('Notification error:', error);
        return NextResponse.json({ error: 'Error fetching notifications' }, { status: 500 });
    }
}

// Mark notification as read
export async function PATCH(request: Request) {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { notificationId } = await request.json();

        await prisma.notification.update({
            where: { id: notificationId },
            data: { read: true },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error updating notification' }, { status: 500 });
    }
}

// Mark all as read
export async function POST() {
    try {
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        await prisma.notification.updateMany({
            where: {
                userId: payload.sub as string,
                read: false,
            },
            data: { read: true },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error marking all as read' }, { status: 500 });
    }
}
