'use client';

import { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImageUpload({ value, onChange, label = 'Tải ảnh lên' }: ImageUploadProps) {
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            setError('Vui lòng chọn file ảnh');
            return;
        }

        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            setError('Kích thước file tối đa 5MB');
            return;
        }

        setError('');
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Upload failed');
            }

            const data = await res.json();
            onChange(data.url);
        } catch (err: any) {
            setError(err.message || 'Lỗi khi tải ảnh lên');
        } finally {
            setUploading(false);
        }
    };

    const handleRemove = () => {
        onChange('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-slate-300 text-sm font-mono mb-2">
                {label}
            </label>

            {value ? (
                <div className="relative">
                    <img
                        src={value}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded border border-slate-700"
                    />
                    <button
                        type="button"
                        onClick={handleRemove}
                        className="absolute top-2 right-2 p-2 bg-red-500/80 text-white rounded hover:bg-red-500 transition-colors backdrop-blur-sm"
                    >
                        <X size={16} />
                    </button>
                </div>
            ) : (
                <div className="border-2 border-dashed border-slate-700 rounded p-6 text-center hover:border-cyan-500 transition-colors bg-slate-800/30">
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        disabled={uploading}
                        className="hidden"
                        id="image-upload"
                    />
                    <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                    >
                        {uploading ? (
                            <>
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mb-3"></div>
                                <p className="text-sm text-slate-400 font-mono">UPLOADING...</p>
                            </>
                        ) : (
                            <>
                                <ImageIcon size={48} className="text-slate-600 mb-3" />
                                <p className="text-sm text-slate-400 mb-1 font-mono">
                                    CLICK_TO_SELECT_IMAGE
                                </p>
                                <p className="text-xs text-slate-500 font-mono">
                                    PNG, JPG, WebP (MAX_5MB)
                                </p>
                            </>
                        )}
                    </label>
                </div>
            )}

            {error && (
                <p className="text-sm text-red-400 font-mono">{error}</p>
            )}
        </div>
    );
}
