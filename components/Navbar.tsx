'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PenSquare, LogOut, User, BarChart, Menu, X, Bookmark } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import NotificationsDropdown from './NotificationsDropdown';
import MobileMenu from './MobileMenu';
import { useState } from 'react';

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = async () => {
        await logout();
        setMobileMenuOpen(false);
        router.push('/login');
    };

    return (
        <>
            <nav className="bg-slate-950 shadow-lg border-b border-cyan-900/30 sticky top-0 z-50 backdrop-blur-xl bg-opacity-80">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex items-center flex-shrink-0 group cursor-pointer">
                            <Link href="/" className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-cyan-500/10 border border-cyan-500/50 rounded flex items-center justify-center group-hover:bg-cyan-500/20 transition-all">
                                    <span className="font-mono font-bold text-cyan-400 text-lg">&gt;_</span>
                                </div>
                                <span className="text-xl font-bold font-mono text-white tracking-tight">
                                    Blog<span className="text-cyan-400">App</span>
                                </span>
                            </Link>
                        </div>

                        {/* Desktop Search Bar */}
                        <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                            <SearchBar />
                        </div>

                        {/* Desktop Right side */}
                        <div className="hidden md:flex items-center space-x-4">
                            <ThemeToggle />
                            {user && <NotificationsDropdown />}
                            {user ? (
                                <>
                                    <div className="h-6 w-px bg-slate-700 mx-2" />
                                    <Link
                                        href="/profile"
                                        className="flex items-center space-x-2 text-sm font-mono text-slate-300 hover:text-cyan-400 transition-colors"
                                    >
                                        <User size={16} />
                                        <span>{user.name}</span>
                                    </Link>
                                    {user.role === 'ADMIN' && (
                                        <Link
                                            href="/admin"
                                            className="p-2 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-900/20 rounded transition-colors"
                                            title="Admin Dashboard"
                                        >
                                            <PenSquare size={18} />
                                        </Link>
                                    )}
                                    <button
                                        onClick={handleLogout}
                                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-900/20 rounded transition-colors"
                                        title="Logout"
                                    >
                                        <LogOut size={18} />
                                    </button>
                                </>
                            ) : (
                                <div className="flex items-center space-x-3">
                                    <Link
                                        href="/login"
                                        className="text-sm font-mono text-slate-300 hover:text-cyan-400 transition-colors"
                                    >
                                        LOGIN
                                    </Link>
                                    <Link
                                        href="/register"
                                        className="px-4 py-2 text-sm font-mono font-bold text-slate-900 bg-cyan-500 hover:bg-cyan-400 rounded transition-colors shadow-[0_0_10px_rgba(6,182,212,0.5)]"
                                    >
                                        REGISTER
                                    </Link>
                                </div>
                            )}
                        </div>

                        {/* Mobile menu button */}
                        <div className="flex md:hidden items-center space-x-4">
                            <ThemeToggle />
                            {user && <NotificationsDropdown />}
                            <button
                                onClick={() => setMobileMenuOpen(true)}
                                className="inline-flex items-center justify-center p-2 rounded text-cyan-400 hover:text-white hover:bg-cyan-900/20 focus:outline-none transition-colors border border-cyan-500/30"
                            >
                                <Menu size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu Overlay */}
            <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
        </>
    );
}
