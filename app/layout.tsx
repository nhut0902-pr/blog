import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrivacyBanner from "@/components/PrivacyBanner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: 'BlogApp - Chia sẻ kiến thức và câu chuyện',
    template: '%s | BlogApp',
  },
  description: 'Nền tảng blog hiện đại với dark mode, tìm kiếm, bookmarks, và nhiều tính năng khác',
  keywords: ['blog', 'chia sẻ', 'kiến thức', 'viết blog', 'cộng đồng', 'tin tức', 'news'],
  authors: [{ name: 'BlogApp Team' }],
  creator: 'BlogApp',
  publisher: 'BlogApp',
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    siteName: 'BlogApp',
    title: 'BlogApp - Chia sẻ kiến thức và câu chuyện',
    description: 'Nền tảng blog hiện đại với dark mode, tìm kiếm, bookmarks, và nhiều tính năng khác',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'BlogApp',
    description: 'Nền tảng blog hiện đại',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'google003c285f4d4d03ea',
    // yandex: 'your-yandex-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <Navbar />
            <main className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
              {children}
            </main>
            <PrivacyBanner />
            <Footer />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html >
  );
}
