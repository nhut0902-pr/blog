import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';

// GET - Lấy danh sách source codes
export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const featured = searchParams.get('featured') === 'true';
        const category = searchParams.get('category');
        const limit = parseInt(searchParams.get('limit') || '12');
        const page = parseInt(searchParams.get('page') || '1');

        const where: any = { active: true };
        
        if (featured) {
            where.featured = true;
        }
        
        if (category) {
            where.category = category;
        }

        const sourceCodes = await prisma.sourceCode.findMany({
            where,
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
            ],
            take: limit,
            skip: (page - 1) * limit
        });

        const total = await prisma.sourceCode.count({ where });

        return NextResponse.json({
            sourceCodes,
            pagination: {
                page,
                limit,
                total,
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Store GET error:', error);
        return NextResponse.json(
            { error: 'Failed to fetch source codes' },
            { status: 500 }
        );
    }
}

// POST - Tạo source code mới (Admin only)
export async function POST(request: NextRequest) {
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
        const { title, description, price, imageUrl, demoUrl, downloadUrl, tags, category, featured } = body;

        if (!title || !description || !price) {
            return NextResponse.json(
                { error: 'Title, description, and price are required' },
                { status: 400 }
            );
        }

        const sourceCode = await prisma.sourceCode.create({
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
                authorId: user.id
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

        return NextResponse.json(sourceCode, { status: 201 });
    } catch (error) {
        console.error('Store POST error:', error);
        return NextResponse.json(
            { error: 'Failed to create source code' },
            { status: 500 }
        );
    }
}