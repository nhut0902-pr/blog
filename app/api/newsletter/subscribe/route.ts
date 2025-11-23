import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
    try {
        const { email } = await request.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 });
        }

        // Check if already subscribed
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existing) {
            if (existing.active) {
                return NextResponse.json({ error: 'Email này đã đăng ký' }, { status: 400 });
            } else {
                // Reactivate subscription
                await prisma.subscriber.update({
                    where: { email },
                    data: { active: true },
                });
                return NextResponse.json({ message: 'Đã kích hoạt lại đăng ký' });
            }
        }

        // Create new subscriber
        await prisma.subscriber.create({
            data: { email },
        });

        return NextResponse.json({ message: 'Đăng ký thành công! Bạn sẽ nhận email khi có bài viết mới.' });
    } catch (error) {
        console.error('Subscribe error:', error);
        return NextResponse.json({ error: 'Có lỗi xảy ra' }, { status: 500 });
    }
}
