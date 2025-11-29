'use client';

import { useEffect, useState } from 'react';
import SnowfallEffect from './SnowfallEffect';
import PetalFallEffect from './PetalFallEffect';

export default function SeasonalEffect() {
    const [enabled, setEnabled] = useState(false);
    const [type, setType] = useState<'snow' | 'petal' | 'none'>('none');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch current effect settings
        fetch('/api/settings/seasonal-effect')
            .then(res => res.json())
            .then(data => {
                setEnabled(data.enabled);
                setType(data.type);
                setLoading(false);
            })
            .catch(err => {
                console.error('Failed to fetch seasonal effect settings:', err);
                setLoading(false);
            });
    }, []);

    if (loading || !enabled || type === 'none') {
        return null;
    }

    return (
        <>
            {type === 'snow' && <SnowfallEffect />}
            {type === 'petal' && <PetalFallEffect />}
        </>
    );
}
