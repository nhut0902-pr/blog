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
        <div className="flex flex-wrap gap-2 p-3 bg-slate-800 border border-slate-700 rounded focus-within:border-cyan-500 transition-colors">
            {value.map((tag, index) => (
                <span
                    key={index}
                    className="inline-flex items-center px-2 py-1 text-sm bg-cyan-500/20 text-cyan-400 rounded border border-cyan-500/30 font-mono"
                >
                    #{tag}
                    <button
                        type="button"
                        onClick={() => removeTag(index)}
                        className="ml-1 hover:text-cyan-300 transition-colors"
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
                className="flex-1 min-w-[120px] outline-none text-sm bg-transparent text-white placeholder-slate-500"
            />
        </div>
    );
}
