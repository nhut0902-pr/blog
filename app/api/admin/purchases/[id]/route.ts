import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// PUT - Cập nhật trạng thái purchase
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
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

        const body = await request.json();
        const { status } = body;

        if (!['PENDING', 'COMPLETED', 'CANCELLED'].includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status' },
                { status: 400 }
            );
        }

        const { id } = await params;
        const purchase = await prisma.purchase.update({
            where: { id },
            data: { status },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                sourceCode: {
                    select: {
                        id: true,
                        title: true,
                        price: true
                    }
                }
            }
        });

        return NextResponse.json(purchase);
    } catch (error) {
        console.error('Purchase PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update purchase' },
            { status: 500 }
        );
    }
}