import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

// GET - Get current seasonal effect settings (public)
export async function GET() {
    try {
        const enabled = await prisma.siteSetting.findUnique({
            where: { key: 'seasonal_effect_enabled' }
        });

        const type = await prisma.siteSetting.findUnique({
            where: { key: 'seasonal_effect_type' }
        });

        return NextResponse.json({
            enabled: enabled?.value === 'true',
            type: type?.value || 'none'
        });
    } catch (error) {
        console.error('Error fetching seasonal effect settings:', error);
        return NextResponse.json({
            enabled: false,
            type: 'none'
        });
    }
}

// POST - Update seasonal effect settings (admin only)
export async function POST(request: Request) {
    try {
        // Check if user is admin
        const cookieStore = await cookies();
        const token = cookieStore.get('token')?.value;

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const payload = await verifyJWT(token);

        if (!payload || payload.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { enabled, type } = await request.json();

        // Update or create settings
        await prisma.siteSetting.upsert({
            where: { key: 'seasonal_effect_enabled' },
            update: { value: String(enabled) },
            create: { key: 'seasonal_effect_enabled', value: String(enabled) }
        });

        await prisma.siteSetting.upsert({
            where: { key: 'seasonal_effect_type' },
            update: { value: type },
            create: { key: 'seasonal_effect_type', value: type }
        });

        return NextResponse.json({ success: true, enabled, type });
    } catch (error) {
        console.error('Error updating seasonal effect settings:', error);
        return NextResponse.json(
            { error: 'Failed to update settings' },
            { status: 500 }
        );
    }
}
