import FlipCard from '@/components/auth/FlipCard';

export const metadata = {
    title: 'Login | BlogApp',
    description: 'Sign in to your BlogApp account',
};

export default function LoginPage() {
    return (
        <div className="min-h-[calc(100vh-4rem)] bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
            <FlipCard />
        </div>
    );
}
