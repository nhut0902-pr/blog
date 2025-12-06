import { NextResponse } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import prisma from '@/lib/prisma';
import { signJWT } from '@/lib/auth';
import { cookies } from 'next/headers';

const client = new OAuth2Client(process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);

export async function POST(request: Request) {
    try {
        const { credential } = await request.json();

        // Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: credential,
            audience: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
        });

        const payload = ticket.getPayload();
        if (!payload || !payload.email) {
            return NextResponse.json({ error: 'Invalid token' }, { status: 400 });
        }

        const { email, name, sub: googleId, picture } = payload;

        // Check if user exists
        let user = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { googleId }
                ]
            }
        });

        if (user) {
            // Update user if needed
            if (!user.googleId || !user.avatarUrl) {
                user = await prisma.user.update({
                    where: { id: user.id },
                    data: {
                        googleId: user.googleId || googleId,
                        avatarUrl: user.avatarUrl || picture
                    }
                });
            }
        } else {
            // Create new user
            // Generate a random password since they are using Google
            const randomPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            const hashedPassword = await import('@/lib/auth').then(m => m.hashPassword(randomPassword));

            user = await prisma.user.create({
                data: {
                    email,
                    name: name || email.split('@')[0],
                    googleId,
                    password: hashedPassword,
                    avatarUrl: picture,
                    role: 'USER'
                }
            });
        }

        if (user.isLocked) {
            return NextResponse.json({ error: 'Account is locked' }, { status: 403 });
        }

        // Generate App JWT
        const token = await signJWT({
            sub: user.id,
            email: user.email,
            role: user.role,
        });

        // Set cookie
        const cookieStore = await cookies();
        cookieStore.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400, // 1 day
            path: '/',
        });

        return NextResponse.json({
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                avatarUrl: user.avatarUrl
            }
        });

    } catch (error) {
        console.error('Google Auth Error:', error);
        return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
    }
}
