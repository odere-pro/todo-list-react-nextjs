'use client';

type LabelType = 'default' | 'success' | 'danger' | 'warning' | 'info' | 'empty';

interface LabelProps {
    children?: React.ReactNode;
    type?: LabelType;
    value?: string;
}

export const getColorClass = (type: string) => {
    const config: Record<string, string> = {
        danger: 'text-red-500',
        default: 'bg-gray-100 text-neutral-900',
        empty: 'text-neutral-900',
        info: 'bg-blue-100 text-blue-900',
        success: 'bg-green-100 text-green-900',
        warning: 'bg-yellow-100 text-yellow-900',
    };

    return config[type] || config.default;
};

function Label({ children, value, type = 'default' }: LabelProps) {
    if (!value && !children) return null;

    if (['empty', 'danger', 'warning'].includes(type))
        return (
            <span className={`min-w-fit items-center text-sm/normal font-medium ${getColorClass(type)}`}>
                {children || value}
            </span>
        );

    return (
        <div className={`min-w-fit px-4 rounded-xl items-center text-sm/normal font-medium ${getColorClass(type)}`}>
            {children || value}
        </div>
    );
}

export default Label;
