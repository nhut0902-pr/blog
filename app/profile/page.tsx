'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { User, Mail, Calendar, Upload, Loader2 } from 'lucide-react';
import ImageUpload from '@/components/ImageUpload';

export default function ProfilePage() {
    const { user: authUser } = useAuth();
    const router = useRouter();
    const [profile, setProfile] = useState<any>(null);
    const [name, setName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!authUser) {
            router.push('/login');
            return;
        }

        fetchProfile();
    }, [authUser, router]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/profile');
            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                setName(data.name || '');
                setBio(data.bio || '');
                setAvatarUrl(data.avatarUrl || '');
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, bio, avatarUrl }),
            });

            if (res.ok) {
                const data = await res.json();
                setProfile(data);
                alert('Cập nhật thành công!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Có lỗi xảy ra!');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
                <Loader2 className="animate-spin text-indigo-600" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
                        <User className="mr-3 text-indigo-600 dark:text-indigo-400" size={32} />
                        Hồ sơ cá nhân
                    </h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Avatar */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Ảnh đại diện
                            </label>
                            <ImageUpload value={avatarUrl} onChange={setAvatarUrl} label="" />
                        </div>

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Tên hiển thị
                            </label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                                required
                            />
                        </div>

                        {/* Email (read-only) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Email
                            </label>
                            <div className="flex items-center px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                                <Mail size={18} className="mr-2 text-gray-500" />
                                <span className="text-gray-700 dark:text-gray-300">{profile?.email}</span>
                            </div>
                        </div>

                        {/* Bio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                Giới thiệu
                            </label>
                            <textarea
                                value={bio}
                                onChange={(e) => setBio(e.target.value)}
                                rows={4}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white resize-none"
                                placeholder="Viết vài dòng về bản thân..."
                            />
                        </div>

                        {/* Created At */}
                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                            <Calendar size={16} className="mr-2" />
                            Tham gia từ {new Date(profile?.createdAt).toLocaleDateString('vi-VN')}
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={saving}
                            className="w-full px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
