'use client';

import { useEffect, useState } from 'react';

interface CategorySelectProps {
    value: string;
    onChange: (category: string) => void;
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/categories')
            .then((res) => res.json())
            .then((data) => {
                setCategories(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    if (loading) {
        return (
            <select disabled className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100">
                <option>Đang tải...</option>
            </select>
        );
    }

    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
            <option value="">-- Chọn danh mục --</option>
            {categories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                    {cat.name}
                </option>
            ))}
        </select>
    );
}
