import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// POST - Tạo yêu cầu mua source code
export async function POST(
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

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const body = await request.json();
        const { contactInfo } = body;

        if (!contactInfo) {
            return NextResponse.json(
                { error: 'Contact information is required' },
                { status: 400 }
            );
        }

        const { id } = await params;
        
        // Kiểm tra source code có tồn tại
        const sourceCode = await prisma.sourceCode.findUnique({
            where: { id, active: true }
        });

        if (!sourceCode) {
            return NextResponse.json(
                { error: 'Source code not found' },
                { status: 404 }
            );
        }

        // Kiểm tra đã mua chưa
        const existingPurchase = await prisma.purchase.findUnique({
            where: {
                userId_sourceCodeId: {
                    userId: user.id,
                    sourceCodeId: id
                }
            }
        });

        if (existingPurchase) {
            return NextResponse.json(
                { error: 'You have already purchased this source code' },
                { status: 400 }
            );
        }

        // Tạo purchase request
        const purchase = await prisma.purchase.create({
            data: {
                userId: user.id,
                sourceCodeId: id,
                amount: sourceCode.price,
                contactInfo,
                status: 'PENDING'
            },
            include: {
                sourceCode: {
                    select: {
                        title: true,
                        price: true
                    }
                }
            }
        });

        return NextResponse.json(purchase, { status: 201 });
    } catch (error) {
        console.error('Purchase POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create purchase request' },
            { status: 500 }
        );
    }
}