import Link from 'next/link';
import { Github, Mail } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800 py-6 mt-12 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center space-x-2">
                    <Mail size={16} className="text-gray-500 dark:text-gray-400" />
                    <a href="mailto:lamminhnhut09022011@gmail.com" className="hover:underline">
                        lamminhnhut09022011@gmail.com
                    </a>
                </div>
                <div className="flex items-center space-x-4 mt-4 sm:mt-0">
                    <Link href="https://github.com/nhut0902-pr" target="_blank" rel="noopener noreferrer" className="flex items-center hover:text-gray-800 dark:hover:text-gray-200">
                        <Github size={20} className="mr-1" />
                        nhut0902-pr
                    </Link>
                    {/* Add more social links or buttons here if needed */}
                </div>
            </div>
        </footer>
    );
}
