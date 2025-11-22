'use client';

import { Facebook, Twitter, Linkedin, Share2 } from 'lucide-react';

interface ShareButtonsProps {
    url: string;
    title: string;
    description?: string;
}

export default function ShareButtons({ url, title, description }: ShareButtonsProps) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title);
    const encodedDescription = encodeURIComponent(description || '');

    const shareLinks = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
        zalo: `https://zalo.me/share/external?url=${encodedUrl}&title=${encodedTitle}`,
    };

    const handleShare = (platform: string) => {
        const link = shareLinks[platform as keyof typeof shareLinks];
        window.open(link, '_blank', 'width=600,height=400');
    };

    const handleCopyLink = () => {
        navigator.clipboard.writeText(url);
        alert('Đã sao chép link!');
    };

    return (
        <div className="flex items-center space-x-3">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Chia sẻ:
            </span>

            <button
                onClick={() => handleShare('facebook')}
                className="p-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                title="Chia sẻ lên Facebook"
            >
                <Facebook size={18} />
            </button>

            <button
                onClick={() => handleShare('twitter')}
                className="p-2 rounded-lg bg-sky-500 hover:bg-sky-600 text-white transition-colors"
                title="Chia sẻ lên Twitter"
            >
                <Twitter size={18} />
            </button>

            <button
                onClick={() => handleShare('linkedin')}
                className="p-2 rounded-lg bg-blue-700 hover:bg-blue-800 text-white transition-colors"
                title="Chia sẻ lên LinkedIn"
            >
                <Linkedin size={18} />
            </button>

            <button
                onClick={() => handleShare('zalo')}
                className="p-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-xs font-bold"
                title="Chia sẻ lên Zalo"
            >
                Z
            </button>

            <button
                onClick={handleCopyLink}
                className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 transition-colors"
                title="Sao chép link"
            >
                <Share2 size={18} />
            </button>
        </div>
    );
}
