'use client';

import { GoogleLogin } from '@react-oauth/google';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function GoogleLoginButton() {
    const router = useRouter();
    const { login } = useAuth(); // We might need to update AuthContext to handle direct user setting or just reload

    const handleSuccess = async (credentialResponse: any) => {
        try {
            const res = await fetch('/api/auth/google', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    credential: credentialResponse.credential,
                }),
            });

            const data = await res.json();

            if (res.ok) {
                // Force a reload to update AuthContext state from cookies
                // Or if AuthContext has a setUser method exposed, use it.
                // For now, reloading is safest to ensure all state is synced.
                window.location.href = '/';
            } else {
                console.error('Login failed:', data.error);
                alert('Đăng nhập thất bại: ' + data.error);
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('Có lỗi xảy ra khi đăng nhập');
        }
    };

    return (
        <div className="flex justify-center my-4">
            <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => {
                    console.log('Login Failed');
                    alert('Đăng nhập Google thất bại');
                }}
                theme="filled_black"
                shape="pill"
                text="continue_with"
                locale="vi"
            />
        </div>
    );
}
