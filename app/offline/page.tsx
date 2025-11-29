import OfflineContent from "@/components/OfflineContent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Offline - BlogApp',
    description: 'Bạn đang offline',
};

export default function OfflinePage() {
    return <OfflineContent />;
}
