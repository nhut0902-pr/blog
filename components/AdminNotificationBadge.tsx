'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AdminNotificationBadge() {
    const { user } = useAuth();
    const [pendingCount, setPendingCount] = useState(0);

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            fetchPendingCount();
            // Poll every 30 seconds
            const interval = setInterval(fetchPendingCount, 30000);
            return () => clearInterval(interval);
        }
    }, [user]);

    const fetchPendingCount = async () => {
        try {
            const res = await fetch('/api/admin/purchases?status=PENDING');
            const data = await res.json();
            if (res.ok) {
                setPendingCount(data.purchases.length);
            }
        } catch (error) {
            console.error('Failed to fetch pending count:', error);
        }
    };

    if (!user || user.role !== 'ADMIN' || pendingCount === 0) {
        return null;
    }

    return (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold animate-pulse">
            {pendingCount > 9 ? '9+' : pendingCount}
        </span>
    );
}