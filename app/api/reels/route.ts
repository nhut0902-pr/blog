import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { verifyJWT } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { uploadVideo } from '@/lib/imagekit-video';

// GET - Fetch reels feed (paginated)
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const reels = await prisma.reel.findMany({
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                author: {
                    select: { id: true, name: true, avatarUrl: true }
                },
                _count: {
                    select: { likes: true, comments: true }
                }
            }
        });

        const total = await prisma.reel.count();

        return NextResponse.json({
            reels,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching reels:', error);
        return NextResponse.json({ error: 'Failed to fetch reels' }, { status: 500 });
    }
}

// POST - Create new reel (Admin only)
export async function POST(request: Request) {
    try {
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

        const formData = await request.formData();
        const video = formData.get('video') as File;
        const title = formData.get('title') as string || '';
        const description = formData.get('description') as string || '';

        if (!video) {
            return NextResponse.json({ error: 'Video file is required' }, { status: 400 });
        }

        // Validate file type
        if (!video.type.startsWith('video/')) {
            return NextResponse.json({ error: 'Invalid file type. Only videos allowed.' }, { status: 400 });
        }

        // Validate file size (max 100MB)
        const maxSize = 100 * 1024 * 1024; // 100MB
        if (video.size > maxSize) {
            return NextResponse.json({ error: 'Video too large. Max 100MB allowed.' }, { status: 400 });
        }

        // Convert to buffer and upload
        const bytes = await video.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadResult = await uploadVideo(buffer, video.name);

        // Create reel in database
        const reel = await prisma.reel.create({
            data: {
                title,
                description,
                videoUrl: uploadResult.url,
                thumbnailUrl: uploadResult.thumbnailUrl,
                authorId: payload.sub as string,
            },
            include: {
                author: {
                    select: { id: true, name: true, avatarUrl: true }
                }
            }
        });

        return NextResponse.json(reel, { status: 201 });
    } catch (error) {
        console.error('Error creating reel:', error);
        return NextResponse.json({ error: 'Failed to create reel' }, { status: 500 });
    }
}
