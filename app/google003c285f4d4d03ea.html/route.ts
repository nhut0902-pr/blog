import { NextResponse } from 'next/server';

export async function GET() {
    return new NextResponse('google-site-verification: google003c285f4d4d03ea.html', {
        headers: {
            'Content-Type': 'text/html',
        },
    });
}
