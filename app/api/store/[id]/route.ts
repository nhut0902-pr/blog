import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// GET - Lấy chi tiết source code
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const sourceCode = await prisma.sourceCode.findUnique({
            where: { id, active: true },
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
            }
        });

        if (!sourceCode) {
            return NextResponse.json(
                { error: 'Source code not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(sourceCode);
    } catch (error) {
        console.error('Store GET by ID error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch source code' },
            { status: 500 }
        );
    }
}

// PUT - Cập nhật source code (Admin only)
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
        const { title, description, price, imageUrl, demoUrl, downloadUrl, tags, category, featured, active } = body;

        const { id } = await params;
        const sourceCode = await prisma.sourceCode.update({
            where: { id },
            data: {
                title,
                description,
                price: parseFloat(price),
                imageUrl,
                demoUrl,
                downloadUrl,
                tags: tags || [],
                category,
                featured: featured || false,
                active: active !== undefined ? active : true
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        avatarUrl: true
                    }
                }
            }
        });

        return NextResponse.json(sourceCode);
    } catch (error) {
        console.error('Store PUT error:', error);
        return NextResponse.json(
            { error: 'Failed to update source code' },
            { status: 500 }
        );
    }
}

// DELETE - Xóa source code (Admin only)
export async function DELETE(
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

        const { id } = await params;
        
        // Check if there are any purchases for this source code
        const purchaseCount = await prisma.purchase.count({
            where: { sourceCodeId: id }
        });

        if (purchaseCount > 0) {
            // Soft delete - set as inactive instead of hard delete
            await prisma.sourceCode.update({
                where: { id },
                data: { active: false }
            });
            return NextResponse.json({ 
                message: 'Source code deactivated successfully (has purchase history)' 
            });
        } else {
            // Hard delete if no purchases
            await prisma.sourceCode.delete({
                where: { id }
            });
            return NextResponse.json({ message: 'Source code deleted successfully' });
        }
    } catch (error) {
        console.error('Store DELETE error:', error);
        return NextResponse.json(
            { error: 'Failed to delete source code' },
            { status: 500 }
        );
    }
}