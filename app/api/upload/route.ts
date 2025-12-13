import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { verifyJWT } from '@/lib/auth';

export async function POST(request: NextRequest) {
    try {
        // Verify authentication
        const token = request.cookies.get('token')?.value;
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const payload = await verifyJWT(token);
        if (!payload) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const formData = await request.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ error: 'No file provided' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Only image files are allowed' }, { status: 400 });
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ error: 'File size must be less than 5MB' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Generate unique filename
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 15);
        const extension = file.name.split('.').pop();
        const filename = `${timestamp}-${randomString}.${extension}`;

        // Save to public/uploads directory
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        const filePath = join(uploadDir, filename);

        // Create uploads directory if it doesn't exist
        try {
            await writeFile(filePath, buffer);
        } catch (error) {
            // If directory doesn't exist, create it
            const { mkdir } = await import('fs/promises');
            await mkdir(uploadDir, { recursive: true });
            await writeFile(filePath, buffer);
        }

        // Return the public URL
        const url = `/uploads/${filename}`;

        return NextResponse.json({ url }, { status: 200 });
    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' },
            { status: 500 }
        );
    }
}