import ReelUpload from '@/components/reels/ReelUpload';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Upload Reel - Nhutcoder Reels',
    description: 'Tải video lên Nhutcoder Reels'
};

export default function ReelUploadPage() {
    return (
        <div className="min-h-screen bg-slate-950 pt-20 pb-12">
            <ReelUpload />
        </div>
    );
}
