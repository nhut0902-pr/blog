'use client';

import { useState } from 'react';
import { X, Loader2, Save } from 'lucide-react';

interface ReelEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    reel: {
        id: string;
        title?: string;
        description?: string;
    };
    onUpdate: (id: string, title: string, description: string) => void;
}

export default function ReelEditModal({ isOpen, onClose, reel, onUpdate }: ReelEditModalProps) {
    const [title, setTitle] = useState(reel.title || '');
    const [description, setDescription] = useState(reel.description || '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch(`/api/reels/${reel.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, description })
            });

            if (res.ok) {
                onUpdate(reel.id, title, description);
                onClose();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update reel');
            }
        } catch (err) {
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-900 rounded-lg w-full max-w-md p-6 relative border border-slate-200 dark:border-slate-800 shadow-xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-bold mb-6 text-slate-900 dark:text-white">Edit Reel</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter title..."
                            maxLength={100}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                            Description
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 rounded-md bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                            placeholder="Enter description..."
                            rows={4}
                            maxLength={500}
                        />
                    </div>

                    {error && (
                        <p className="text-red-500 text-sm">{error}</p>
                    )}

                    <div className="flex justify-end pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md mr-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md flex items-center disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 size={16} className="animate-spin mr-2" />
                            ) : (
                                <Save size={16} className="mr-2" />
                            )}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
