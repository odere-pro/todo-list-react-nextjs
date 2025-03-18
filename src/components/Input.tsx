'use client';

import { useState, ChangeEvent } from 'react';

interface InputProps {
    value: string;
    inputId?: string;
    className?: string;
    label?: string;
    onChange?: (value: string) => void;
}

function Input({ value, onChange, inputId, className, label }: InputProps) {
    const [str, setStr] = useState(value);

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        setStr(e.target.value);
        if (onChange) {
            onChange(e.target.value);
        }
    };

    return (
        <div className={className}>
            <label htmlFor={inputId} className="block text-xs/5 text-gray-500 dark:text-neutral-400">
                {label}
            </label>
            <div className="mt-2">
                <input
                    id={inputId}
                    value={str}
                    onChange={handleChange}
                    maxLength={120}
                    type="text"
                    placeholder="Task title"
                    className="block w-full rounded-md bg-neutral-50/75 dark:bg-neutral-950/25 px-3 py-1.5 text-base text-neutral-900 dark:text-neutral-100 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
            </div>
        </div>
    );
}

export default Input;
