'use client';

import Link from 'next/link';
import { User, Bookmark, PenSquare, LogOut, X, BarChart, Terminal } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import SearchBar from './SearchBar';

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const { user, logout } = useAuth();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] md:hidden">
            {/* Backdrop with blur */}
            <div
                className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
                onClick={onClose}
            />

            {/* Menu Content */}
            <div className="absolute top-0 right-0 w-4/5 max-w-sm h-full bg-slate-900 border-l border-cyan-500/30 shadow-[-10px_0_30px_rgba(6,182,212,0.2)] transform transition-transform duration-300 ease-out overflow-y-auto">

                {/* Tech Background Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: 'linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)',
                        backgroundSize: '20px 20px'
                    }}
                />

                {/* Header */}
                <div className="relative p-6 border-b border-cyan-500/20 flex justify-between items-center bg-slate-900/50">
                    <div className="flex items-center space-x-2 text-cyan-400">
                        <Terminal size={20} />
                        <span className="font-mono font-bold tracking-wider">SYSTEM_MENU</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-400 hover:text-cyan-400 transition-colors p-2 hover:bg-cyan-950/30 rounded"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-8 relative z-10">
                    {/* Search */}
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-500 uppercase">Search_Database</label>
                        <SearchBar />
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-2">
                        <label className="text-xs font-mono text-slate-500 uppercase">Navigation_Modules</label>

                        {user ? (
                            <div className="space-y-2">
                                {/* User Profile Card */}
                                <div className="flex items-center p-3 bg-slate-800/50 border border-slate-700 rounded mb-4">
                                    <div className="w-10 h-10 bg-cyan-900/30 rounded flex items-center justify-center text-cyan-400 border border-cyan-500/30 mr-3">
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-mono text-white">{user.name}</div>
                                        <div className="text-xs text-slate-400">{user.email}</div>
                                    </div>
                                </div>

                                <Link href="/profile" onClick={onClose} className="flex items-center p-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 border border-transparent hover:border-cyan-500/30 rounded transition-all font-mono text-sm">
                                    <User size={18} className="mr-3" />
                                    USER_PROFILE
                                </Link>
                                <Link href="/bookmarks" onClick={onClose} className="flex items-center p-3 text-slate-300 hover:text-cyan-400 hover:bg-cyan-950/30 border border-transparent hover:border-cyan-500/30 rounded transition-all font-mono text-sm">
                                    <Bookmark size={18} className="mr-3" />
                                    SAVED_DATA
                                </Link>

                                {user.role === 'ADMIN' && (
                                    <div className="pt-4 mt-4 border-t border-slate-800">
                                        <label className="text-xs font-mono text-red-400 uppercase mb-2 block">Admin_Privileges</label>
                                        <Link href="/admin" onClick={onClose} className="flex items-center p-3 text-red-400 hover:bg-red-950/20 border border-transparent hover:border-red-500/30 rounded transition-all font-mono text-sm">
                                            <PenSquare size={18} className="mr-3" />
                                            ADMIN_CONSOLE
                                        </Link>
                                        <Link href="/admin/analytics" onClick={onClose} className="flex items-center p-3 text-green-400 hover:bg-green-950/20 border border-transparent hover:border-green-500/30 rounded transition-all font-mono text-sm">
                                            <BarChart size={18} className="mr-3" />
                                            SYSTEM_ANALYTICS
                                        </Link>
                                        <Link href="/admin/comments" onClick={onClose} className="flex items-center p-3 text-yellow-400 hover:bg-yellow-950/20 border border-transparent hover:border-yellow-500/30 rounded transition-all font-mono text-sm">
                                            <Terminal size={18} className="mr-3" />
                                            COMMENT_CONTROL
                                        </Link>
                                    </div>
                                )}

                                <button
                                    onClick={() => { logout(); onClose(); }}
                                    className="w-full flex items-center p-3 mt-4 text-red-400 hover:bg-red-950/20 border border-red-900/30 hover:border-red-500/50 rounded transition-all font-mono text-sm"
                                >
                                    <LogOut size={18} className="mr-3" />
                                    TERMINATE_SESSION
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                <Link href="/login" onClick={onClose} className="flex items-center justify-center p-3 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-950/30 rounded transition-all font-mono text-sm">
                                    LOGIN
                                </Link>
                                <Link href="/register" onClick={onClose} className="flex items-center justify-center p-3 bg-cyan-600 text-slate-900 font-bold hover:bg-cyan-500 rounded transition-all font-mono text-sm">
                                    REGISTER
                                </Link>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="absolute bottom-0 left-0 w-full p-4 border-t border-cyan-500/20 bg-slate-900/80 backdrop-blur text-center">
                    <div className="text-[10px] font-mono text-slate-600">
                        SYSTEM_V.2.0.4 // SECURE_CONNECTION
                    </div>
                </div>
            </div>
        </div>
    );
}
