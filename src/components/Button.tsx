import React from 'react';

type ButtonVariant = 'default' | 'primary' | 'danger';
type ButtonType = 'submit' | 'reset' | 'button' | undefined;

interface TodosListProps {
    onClick: () => void;
    title?: string;
    type?: ButtonType;
    variant?: ButtonVariant;
}

export const getVariantClass = (type: string) => {
    const config: Record<string, string> = {
        danger: 'bg-red-500 text-neutral-100 hover:bg-red-400 focus-visible:outline-indigo-600',
        default: 'bg-neutral-500 text-neutral-100 hover:bg-neutral-400 focus-visible:outline-indigo-600',
        primary: 'bg-indigo-600 text-neutral-100 hover:bg-indigo-500 focus-visible:outline-indigo-600',
    };

    return config[type] || config.default;
};

const Button = ({ type = 'button', onClick, variant = 'default', title = 'OK' }: TodosListProps) => {
    return (
        <button
            className={`relative inline-flex items-center rounded-md px-3 py-1 text-sm shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2 transition duration-300 select-none cursor-pointer ${getVariantClass(variant)}`}
            onClick={onClick}
            type={type}
        >
            {title}
        </button>
    );
};

export default Button;
