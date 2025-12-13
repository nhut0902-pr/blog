import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// GET - Lấy danh sách purchases cho admin
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

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const limit = parseInt(searchParams.get('limit') || '20');
        const page = parseInt(searchParams.get('page') || '1');

        const where: any = {};
        if (status) {
            where.status = status;
        }

        const purchases = await prisma.purchase.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        avatarUrl: true
                    }
                },
                sourceCode: {
                    select: {
                        id: true,
                        title: true,
                        price: true,
                        imageUrl: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            take: limit,
            skip: (page - 1) * limit
        });

        const total = await prisma.purchase.count({ where });

        return NextResponse.json({
            purchases,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Admin Purchases GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch purchases' },
            { status: 500 }
        );
    }
}