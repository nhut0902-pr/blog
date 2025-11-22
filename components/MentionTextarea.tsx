'use client';

import { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';

interface MentionTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
    disabled?: boolean;
    rows?: number;
}

interface UserSuggestion {
    id: string;
    name: string;
    avatarUrl?: string;
}

export default function MentionTextarea({
    value,
    onChange,
    placeholder,
    className,
    disabled,
    rows = 3
}: MentionTextareaProps) {
    const [suggestions, setSuggestions] = useState<UserSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [cursorPosition, setCursorPosition] = useState(0);
    const [mentionQuery, setMentionQuery] = useState('');
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 });

    useEffect(() => {
        const handleInput = () => {
            if (!textareaRef.current) return;

            const text = textareaRef.current.value;
            const position = textareaRef.current.selectionStart;
            setCursorPosition(position);

            // Check for mention trigger
            const lastAtPos = text.lastIndexOf('@', position - 1);
            if (lastAtPos !== -1) {
                const query = text.substring(lastAtPos + 1, position);
                // Only trigger if no spaces in query (simple check)
                if (!query.includes(' ')) {
                    setMentionQuery(query);
                    setShowSuggestions(true);

                    // Calculate position for dropdown (simplified)
                    // In a real app, use a library like textarea-caret to get pixel coordinates
                    // For now, just place it below the textarea or use a fixed relative position
                    // We'll use a simple absolute positioning relative to the container
                    return;
                }
            }
            setShowSuggestions(false);
        };

        const element = textareaRef.current;
        if (element) {
            element.addEventListener('input', handleInput);
            element.addEventListener('click', handleInput);
            element.addEventListener('keyup', handleInput);
        }

        return () => {
            if (element) {
                element.removeEventListener('input', handleInput);
                element.removeEventListener('click', handleInput);
                element.removeEventListener('keyup', handleInput);
            }
        };
    }, []);

    useEffect(() => {
        if (showSuggestions && mentionQuery.length >= 1) {
            const fetchUsers = async () => {
                try {
                    const res = await fetch(`/api/users/search?q=${encodeURIComponent(mentionQuery)}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSuggestions(data);
                    }
                } catch (error) {
                    console.error('Error searching users:', error);
                }
            };

            // Debounce
            const timeoutId = setTimeout(fetchUsers, 300);
            return () => clearTimeout(timeoutId);
        } else {
            setSuggestions([]);
        }
    }, [showSuggestions, mentionQuery]);

    const handleSelectUser = (user: UserSuggestion) => {
        if (!textareaRef.current) return;

        const text = value;
        const position = cursorPosition;
        const lastAtPos = text.lastIndexOf('@', position - 1);

        if (lastAtPos !== -1) {
            const before = text.substring(0, lastAtPos);
            const after = text.substring(position);
            const newValue = `${before}@${user.name} ${after}`;

            onChange(newValue);
            setShowSuggestions(false);
            setSuggestions([]);

            // Restore focus
            textareaRef.current.focus();
        }
    };

    return (
        <div className="relative">
            <textarea
                ref={textareaRef}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={className}
                disabled={disabled}
                rows={rows}
            />

            {showSuggestions && suggestions.length > 0 && (
                <div className="absolute z-10 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 mt-1 max-h-48 overflow-y-auto">
                    {suggestions.map((user) => (
                        <button
                            key={user.id}
                            onClick={() => handleSelectUser(user)}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center space-x-2 transition-colors"
                        >
                            {user.avatarUrl ? (
                                <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full" />
                            ) : (
                                <div className="w-6 h-6 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center">
                                    <User size={14} className="text-indigo-600 dark:text-indigo-400" />
                                </div>
                            )}
                            <span className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
