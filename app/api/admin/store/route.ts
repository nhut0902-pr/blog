import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// GET - Lấy tất cả source codes cho admin
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }
        const user = await prisma.user.findUnique({
            where: { id: payload.sub as string }
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const sourceCodes = await prisma.sourceCode.findMany({
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                },
                _count: {
                    select: {
                        purchases: true
                    }
                }
            },
            orderBy: [
                { featured: 'desc' },
                { createdAt: 'desc' }
            ]
        });

        return NextResponse.json(sourceCodes);
    } catch (error) {
        console.error('Admin Store GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch source codes' },
            { status: 500 }
        );
    }
}