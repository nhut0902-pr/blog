'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Mail, Lock, User, ArrowRight, Loader2 } from 'lucide-react';
import './flip-card.css';
import GoogleLoginButton from './GoogleLoginButton';

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
                // Force full page reload to sync auth cookies and state
                window.location.href = '/';
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
                // Force full page reload to sync auth cookies and state
                window.location.href = '/';
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

                <div className={`flip-card__inner ${isSignUp ? 'flipped' : ''}`}>
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
                            <div className="text-right mb-4">
                                <a href="#" className="text-xs text-cyan-400 hover:text-cyan-300 font-mono">Forgot_Password?</a>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded flex items-center justify-center transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] disabled:opacity-50 disabled:cursor-not-allowed font-mono group"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin mr-2" size={20} />
                                ) : (
                                    <>
                                        ACCESS_SYSTEM <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                            <div className="mt-4 relative flex items-center justify-center">
                                <div className="border-t border-slate-700 w-full absolute"></div>
                                <span className="bg-slate-900 px-2 text-xs text-slate-500 relative z-10 font-mono">OR_CONTINUE_WITH</span>
                            </div>
                            <GoogleLoginButton />
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
