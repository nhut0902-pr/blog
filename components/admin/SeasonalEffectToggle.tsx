'use client';

import { useState, useEffect } from 'react';
import { Sparkles } from 'lucide-react';

export default function SeasonalEffectToggle() {
    const [enabled, setEnabled] = useState(false);
    const [type, setType] = useState<'snow' | 'petal' | 'none'>('none');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Fetch current settings
        fetch('/api/settings/seasonal-effect')
            .then(res => res.json())
            .then(data => {
                setEnabled(data.enabled);
                setType(data.type);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch settings:', err);
                setLoading(false);
            });
    }, []);

    const handleUpdate = async (newEnabled: boolean, newType: string) => {
        setSaving(true);
        try {
            const res = await fetch('/api/settings/seasonal-effect', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    enabled: newEnabled,
                    type: newType
                })
            });

            if (res.ok) {
                setEnabled(newEnabled);
                setType(newType as 'snow' | 'petal' | 'none');

                // Reload page to apply changes
                window.location.reload();
            }
        } catch (error) {
            console.error('Failed to update settings:', error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-6 bg-slate-800 rounded w-48 mb-4"></div>
                    <div className="h-20 bg-slate-800 rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-slate-900/50 border border-cyan-500/30 rounded-lg p-6 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                    <Sparkles className="text-cyan-400" size={24} />
                    <h3 className="text-xl font-bold text-white font-mono">Seasonal Effects</h3>
                </div>
                <div className="flex items-center space-x-3">
                    <span className="text-sm font-mono text-slate-400">
                        {enabled ? 'ACTIVE' : 'DISABLED'}
                    </span>
                    <button
                        onClick={() => handleUpdate(!enabled, enabled ? 'none' : type)}
                        disabled={saving}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${enabled ? 'bg-cyan-600' : 'bg-slate-700'
                            }`}
                    >
                        <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${enabled ? 'translate-x-6' : 'translate-x-1'
                                }`}
                        />
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <label className="text-xs font-mono text-slate-500 uppercase">Effect Type</label>
                <div className="grid grid-cols-3 gap-3">
                    <button
                        onClick={() => handleUpdate(true, 'none')}
                        disabled={saving}
                        className={`p-4 rounded border transition-all font-mono text-sm ${type === 'none'
                                ? 'bg-slate-800 border-cyan-500 text-cyan-400'
                                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                    >
                        ❌ None
                    </button>
                    <button
                        onClick={() => handleUpdate(true, 'snow')}
                        disabled={saving}
                        className={`p-4 rounded border transition-all font-mono text-sm ${type === 'snow'
                                ? 'bg-slate-800 border-cyan-500 text-cyan-400'
                                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                    >
                        ❄️ Snow
                    </button>
                    <button
                        onClick={() => handleUpdate(true, 'petal')}
                        disabled={saving}
                        className={`p-4 rounded border transition-all font-mono text-sm ${type === 'petal'
                                ? 'bg-slate-800 border-cyan-500 text-cyan-400'
                                : 'bg-slate-900/50 border-slate-700 text-slate-400 hover:border-slate-600'
                            }`}
                    >
                        🌸 Petal
                    </button>
                </div>

                {saving && (
                    <div className="text-center text-xs font-mono text-cyan-400">
                        Updating...
                    </div>
                )}
            </div>

            <div className="mt-6 p-4 bg-slate-800/50 border border-slate-700 rounded">
                <p className="text-xs font-mono text-slate-400">
                    <span className="text-cyan-400">&gt;</span> Changes will be applied globally across the site.
                    The page will reload automatically when you change the effect.
                </p>
            </div>
        </div>
    );
}
