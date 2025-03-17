import React from 'react';
import type { TaskId } from '@/types/Task';

interface CheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    id?: TaskId;
}

const Checkbox: React.FC<CheckboxProps> = ({ checked, onChange, label, id }) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.stopPropagation();
        onChange(event.target.checked);
    };

    const hoverClass =
        'hover:text-indigo-600 dark:hover:text-indigo-600 focus:text-indigo-600 dark:focus:text-indigo-600 transition duration-300';

    return (
        <label
            onClick={(e) => e.stopPropagation()}
            htmlFor={`task-${id}`}
            className={`cursor-pointer relative flex gap-3 text-neutral-900 dark:text-neutral-100 ${hoverClass}`}
        >
            <div className="min-w-0 flex-1 text-sm/6">
                <span className="font-medium select-none">{label}</span>
            </div>
            <div className="flex h-6 shrink-0 items-center">
                <div className="group grid size-4 grid-cols-1">
                    <input
                        defaultChecked={checked}
                        id={`task-${id}`}
                        name={`task-${id}`}
                        type="checkbox"
                        onChange={handleChange}
                        className="cursor-pointer col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto"
                    />
                    <svg
                        fill="none"
                        viewBox="0 0 14 14"
                        className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25"
                    >
                        <path
                            d="M3 8L6 11L11 3.5"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-checked:opacity-100"
                        />
                        <path
                            d="M3 7H11"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="opacity-0 group-has-indeterminate:opacity-100"
                        />
                    </svg>
                </div>
            </div>
        </label>
    );
};

export default Checkbox;
