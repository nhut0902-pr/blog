'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './flip-card.css';

export default function FlipCard() {
    const router = useRouter();
    const [isSignUp, setIsSignUp] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login form state
    const [loginData, setLoginData] = useState({ email: '', password: '' });

    // Signup form state
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        password: '',
    });

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(loginData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                router.push('/');
                router.refresh();
            } else {
                setError(data.error || 'Đăng nhập thất bại');
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(signupData),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                router.push('/');
                router.refresh();
            } else {
                setError(data.error || 'Đăng ký thất bại');
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="wrapper">
            <div className="card-switch">
                <label className="switch">
                    <input
                        type="checkbox"
                        className="toggle"
                        checked={isSignUp}
                        onChange={(e) => setIsSignUp(e.target.checked)}
                    />
                    <span className="slider"></span>
                    <span className="card-side"></span>
                </label>

                <div className="flip-card__inner">
                    {/* Login Form */}
                    <div className="flip-card__front">
                        <form onSubmit={handleLogin} className="flip-card__form">
                            <div className="title">Log in</div>
                            <input
                                className="flip-card__input"
                                name="email"
                                placeholder="Email"
                                type="email"
                                required
                                value={loginData.email}
                                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                            />
                            <input
                                className="flip-card__input"
                                name="password"
                                placeholder="Password"
                                type="password"
                                required
                                value={loginData.password}
                                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                            />
                            {error && !isSignUp && (
                                <div className="error-message">{error}</div>
                            )}
                            <button className="flip-card__btn" type="submit" disabled={loading}>
                                {loading ? 'Loading...' : "Let's go!"}
                            </button>
                        </form>
                    </div>

                    {/* Signup Form */}
                    <div className="flip-card__back">
                        <form onSubmit={handleSignup} className="flip-card__form">
                            <div className="title">Sign up</div>
                            <input
                                className="flip-card__input"
                                placeholder="Name"
                                type="text"
                                required
                                value={signupData.name}
                                onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                            />
                            <input
                                className="flip-card__input"
                                placeholder="Email"
                                type="email"
                                required
                                value={signupData.email}
                                onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                            />
                            <input
                                className="flip-card__input"
                                placeholder="Password"
                                type="password"
                                required
                                value={signupData.password}
                                onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                            />
                            {error && isSignUp && (
                                <div className="error-message">{error}</div>
                            )}
                            <button className="flip-card__btn" type="submit" disabled={loading}>
                                {loading ? 'Loading...' : 'Confirm'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
