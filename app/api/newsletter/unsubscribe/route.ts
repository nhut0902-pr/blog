import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
        }

        // Deactivate subscription
        await prisma.subscriber.updateMany({
            where: { email },
            data: { active: false },
        });

        return NextResponse.json({ message: 'Đã hủy đăng ký thành công' });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get('email');

        if (!email) {
            return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
        }

        await prisma.subscriber.updateMany({
            where: { email },
            data: { active: false },
        });

        return new NextResponse(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Hủy đăng ký thành công</title>
                <style>
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        min-height: 100vh;
                        margin: 0;
                        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    }
                    .container {
                        background: white;
                        padding: 40px;
                        border-radius: 12px;
                        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                        text-align: center;
                        max-width: 400px;
                    }
                    h1 { color: #1f2937; margin-bottom: 10px; }
                    p { color: #6b7280; line-height: 1.6; }
                    a {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 12px 24px;
                        background: #4f46e5;
                        color: white;
                        text-decoration: none;
                        border-radius: 8px;
                        font-weight: 600;
                    }
                    a:hover { background: #4338ca; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>✓ Đã hủy đăng ký</h1>
                    <p>Bạn sẽ không nhận thêm email từ chúng tôi nữa.</p>
                    <a href="/">Về trang chủ</a>
                </div>
            </body>
            </html>
        `, {
            headers: { 'Content-Type': 'text/html' },
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}
