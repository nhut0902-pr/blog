'use client';

import { useState, useRef } from 'react';
import { Upload, X, Loader2, Video } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ReelUpload() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (!selectedFile) return;

        // Validate file type
        if (!selectedFile.type.startsWith('video/')) {
            setError('Chỉ chấp nhận file video');
            return;
        }

        // Validate file size (max 100MB)
        if (selectedFile.size > 100 * 1024 * 1024) {
            setError('Video quá lớn. Tối đa 100MB');
            return;
        }

        setFile(selectedFile);
        setPreview(URL.createObjectURL(selectedFile));
        setError('');
    };

    const handleUpload = async () => {
        if (!file) return;

        setUploading(true);
        setError('');

        try {
            const formData = new FormData();
            formData.append('video', file);
            formData.append('title', title);
            formData.append('description', description);

            const res = await fetch('/api/reels', {
                method: 'POST',
                body: formData
            });

            if (res.ok) {
                router.push('/reels');
                router.refresh();
            } else {
                const data = await res.json();
                setError(data.error || 'Upload thất bại');
            }
        } catch (err) {
            setError('Có lỗi xảy ra. Vui lòng thử lại');
        } finally {
            setUploading(false);
        }
    };

    const clearFile = () => {
        setFile(null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-white mb-6 font-mono">
                <span className="text-cyan-400">&gt;_</span> UPLOAD_REEL
            </h1>

            {/* File upload area */}
            {!file ? (
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-cyan-500/50 rounded-lg p-12 text-center cursor-pointer hover:border-cyan-400 transition-colors bg-slate-900/50"
                >
                    <Video className="w-16 h-16 text-cyan-400 mx-auto mb-4" />
                    <p className="text-white font-medium mb-2">Chọn video để tải lên</p>
                    <p className="text-slate-400 text-sm">MP4, WebM, MOV - Tối đa 100MB</p>
                    <p className="text-slate-500 text-xs mt-2">Thời lượng: 60 giây - 3 phút</p>
                </div>
            ) : (
                <div className="relative">
                    <video
                        src={preview!}
                        className="w-full aspect-[9/16] object-cover rounded-lg bg-black"
                        controls
                    />
                    <button
                        onClick={clearFile}
                        className="absolute top-2 right-2 p-2 bg-red-500 rounded-full hover:bg-red-600"
                    >
                        <X className="w-4 h-4 text-white" />
                    </button>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileSelect}
                className="hidden"
            />

            {/* Form fields */}
            {file && (
                <div className="mt-6 space-y-4">
                    <div>
                        <label className="block text-slate-300 text-sm mb-2">Tiêu đề (tùy chọn)</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Thêm tiêu đề..."
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label className="block text-slate-300 text-sm mb-2">Mô tả (tùy chọn)</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Thêm mô tả..."
                            rows={3}
                            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 resize-none"
                            maxLength={500}
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-sm">{error}</p>
                    )}

                    <button
                        onClick={handleUpload}
                        disabled={uploading}
                        className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Đang tải lên...
                            </>
                        ) : (
                            <>
                                <Upload className="w-5 h-5" />
                                Đăng Reel
                            </>
                        )}
                    </button>
                </div>
            )}
        </div>
    );
}
