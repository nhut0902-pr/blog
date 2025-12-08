'use client';

import { useEffect } from 'react';

declare global {
    interface Window {
        Tawk_API?: unknown;
        Tawk_LoadStart?: Date;
    }
}

interface TawkToChatProps {
    propertyId: string;
    widgetId: string;
}

export default function TawkToChat({ propertyId, widgetId }: TawkToChatProps) {
    useEffect(() => {
        // Prevent duplicate script loading
        if (document.getElementById('tawkto-script')) return;

        window.Tawk_API = window.Tawk_API || {};
        window.Tawk_LoadStart = new Date();

        const script = document.createElement('script');
        script.id = 'tawkto-script';
        script.async = true;
        script.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
        script.charset = 'UTF-8';
        script.setAttribute('crossorigin', '*');

        document.body.appendChild(script);

        return () => {
            // Cleanup on unmount
            const existingScript = document.getElementById('tawkto-script');
            if (existingScript) {
                existingScript.remove();
            }
        };
    }, [propertyId, widgetId]);

    return null; // This component doesn't render anything visible
}
