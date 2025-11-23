'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { PenSquare, LogOut, User, BarChart, Menu, X, Bookmark } from 'lucide-react';
import ThemeToggle from './ThemeToggle';
import SearchBar from './SearchBar';
import NotificationsDropdown from './NotificationsDropdown';
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

    const closeMobileMenu = () => setMobileMenuOpen(false);

    return (
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 transition-colors sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center flex-shrink-0">
                        <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent" onClick={closeMobileMenu}>
                            BlogApp
                        </Link>
                    </div>

                    {/* Desktop Search Bar */}
                    <div className="hidden lg:flex flex-1 max-w-lg mx-8">
                        <SearchBar />
                    </div>

                    {/* Desktop Right side */}
                    <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
                        <ThemeToggle />
                        {user && <NotificationsDropdown />}
                        {user ? (
                            <>
                                <span className="hidden lg:flex text-sm text-gray-700 dark:text-gray-300 items-center">
                                    <User size={16} className="mr-1" />
                                    {user.name}
                                </span>
                                <Link
                                    href="/bookmarks"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <Bookmark size={16} className="lg:mr-1" />
                                    <span className="hidden lg:inline">Đã lưu</span>
                                </Link>
                                <Link
                                    href="/profile"
                                    className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    <User size={16} className="lg:mr-1" />
                                    <span className="hidden lg:inline">Hồ sơ</span>
                                </Link>
                                {user.role === 'ADMIN' && (
                                    <>
                                        <Link
                                            href="/admin"
                                            className="flex items-center px-3 py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
                                        >
                                            <PenSquare size={18} className="lg:mr-1" />
                                            <span className="hidden lg:inline">Admin</span>
                                        </Link>
                                    </>
                                )}
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 transition-colors"
                                >
                                    <LogOut size={18} className="lg:mr-1" />
                                    <span className="hidden lg:inline">Đăng xuất</span>
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Đăng ký
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex md:hidden items-center space-x-2">
                        <ThemeToggle />
                        {user && <NotificationsDropdown />}
                        <button
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none transition-colors min-w-[44px] min-h-[44px]"
                            aria-expanded={mobileMenuOpen}
                        >
                            <span className="sr-only">Mở menu</span>
                            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile menu */}
            {mobileMenuOpen && (
                <div className="md:hidden border-t border-gray-200 dark:border-gray-700">
                    <div className="px-4 pt-2 pb-3 space-y-1">
                        {/* Mobile Search */}
                        <div className="mb-4">
                            <SearchBar />
                        </div>

                        {user ? (
                            <>
                                {/* User info */}
                                <div className="flex items-center px-3 py-3 border-b border-gray-200 dark:border-gray-700 mb-2">
                                    <User size={20} className="mr-2 text-gray-500" />
                                    <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                                </div>

                                <Link
                                    href="/bookmarks"
                                    onClick={closeMobileMenu}
                                    className="flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
                                >
                                    <Bookmark size={20} className="mr-3" />
                                    Đã lưu
                                </Link>
                                <Link
                                    href="/profile"
                                    onClick={closeMobileMenu}
                                    className="flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
                                >
                                    <User size={20} className="mr-3" />
                                    Hồ sơ
                                </Link>

                                {user.role === 'ADMIN' && (
                                    <>
                                        <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                                            <p className="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                                                Quản trị
                                            </p>
                                        </div>
                                        <Link
                                            href="/admin"
                                            onClick={closeMobileMenu}
                                            className="flex items-center px-3 py-3 text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
                                        >
                                            <PenSquare size={20} className="mr-3" />
                                            Admin Dashboard
                                        </Link>
                                        <Link
                                            href="/admin/users"
                                            onClick={closeMobileMenu}
                                            className="flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
                                        >
                                            Quản lý người dùng
                                        </Link>
                                        <Link
                                            href="/admin/comments"
                                            onClick={closeMobileMenu}
                                            className="flex items-center px-3 py-3 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
                                        >
                                            Quản lý bình luận
                                        </Link>
                                        <Link
                                            href="/admin/analytics"
                                            onClick={closeMobileMenu}
                                            className="flex items-center px-3 py-3 text-base font-medium text-green-600 dark:text-green-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
                                        >
                                            <BarChart size={20} className="mr-3" />
                                            Analytics
                                        </Link>
                                    </>
                                )}

                                <div className="border-t border-gray-200 dark:border-gray-700 my-2 pt-2">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center w-full px-3 py-3 text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-lg transition-colors min-h-[44px]"
                                    >
                                        <LogOut size={20} className="mr-3" />
                                        Đăng xuất
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Link
                                    href="/login"
                                    onClick={closeMobileMenu}
                                    className="block w-full px-4 py-3 text-center text-base font-medium text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors min-h-[44px]"
                                >
                                    Đăng nhập
                                </Link>
                                <Link
                                    href="/register"
                                    onClick={closeMobileMenu}
                                    className="block w-full px-4 py-3 text-center text-base font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors min-h-[44px]"
                                >
                                    Đăng ký
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
}
