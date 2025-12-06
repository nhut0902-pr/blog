import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET - Get single reel
export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const reel = await prisma.reel.findUnique({
            where: { id },
            include: {
                author: {
                    select: { id: true, name: true, avatarUrl: true }
                },
                _count: {
                    select: { likes: true, comments: true }
                }
            }
        });

        if (!reel) {
            return NextResponse.json({ error: 'Reel not found' }, { status: 404 });
        }

        // Increment view count
        await prisma.reel.update({
            where: { id },
            data: { views: { increment: 1 } }
        });

        return NextResponse.json(reel);
    } catch (error) {
        console.error('Error fetching reel:', error);
        return NextResponse.json({ error: 'Failed to fetch reel' }, { status: 500 });
    }
}

// DELETE - Delete reel (Admin only)
export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        // Verify authentication
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        await prisma.reel.delete({ where: { id } });

        return NextResponse.json({ message: 'Reel deleted' });
    } catch (error) {
        console.error('Error deleting reel:', error);
        return NextResponse.json({ error: 'Failed to delete reel' }, { status: 500 });
    }
}
