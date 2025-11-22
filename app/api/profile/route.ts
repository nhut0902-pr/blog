import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

// Get current user profile
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

        const user = await prisma.user.findUnique({
            where: { id: payload.sub as string },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                bio: true,
                avatarUrl: true,
                createdAt: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Error fetching profile' }, { status: 500 });
    }
}

// Update user profile
export async function PUT(request: Request) {
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

        const { name, bio, avatarUrl } = await request.json();

        const user = await prisma.user.update({
            where: { id: payload.sub as string },
            data: {
                ...(name && { name }),
                ...(bio !== undefined && { bio }),
                ...(avatarUrl !== undefined && { avatarUrl }),
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                bio: true,
                avatarUrl: true,
            },
        });

        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({ error: 'Error updating profile' }, { status: 500 });
    }
}
