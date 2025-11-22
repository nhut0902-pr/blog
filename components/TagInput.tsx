'use client';

import { useState, KeyboardEvent } from 'react';
import { X } from 'lucide-react';

interface TagInputProps {
    value: string[];
    onChange: (tags: string[]) => void;
    placeholder?: string;
}

export default function TagInput({ value, onChange, placeholder = 'Thêm tag...' }: TagInputProps) {
    const [input, setInput] = useState('');

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            addTag();
        } else if (e.key === 'Backspace' && !input && value.length > 0) {
            removeTag(value.length - 1);
        }
    };

    const addTag = () => {
        const tag = input.trim().toLowerCase();
        if (tag && !value.includes(tag)) {
            onChange([...value, tag]);
            setInput('');
        }
    };

    const removeTag = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="flex flex-wrap gap-2 p-2 border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500">
            {value.map((tag, index) => (
                <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-sm bg-indigo-100 text-indigo-800 rounded-md"
                >
                    {tag}
                    <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:text-indigo-600"
                    >
                        <X size={14} />
                    </button>
                </span>
            ))}
            <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={addTag}
                placeholder={value.length === 0 ? placeholder : ''}
                className="flex-1 min-w-[120px] outline-none text-sm"
            />
        </div>
    );
}
