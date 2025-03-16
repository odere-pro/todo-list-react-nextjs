import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';

interface ToolbarProps {
    backHref?: string;
    children?: React.ReactNode;
    className?: string;
    title?: string;
}

function Toolbar({ title, backHref, children, className }: ToolbarProps) {
    return (
        <div className={`flex justify-between items-center w-full gap-4 ${className}`}>
            {backHref && (
                <Link className="flex items-center text-neutral-900 dark:text-neutral-100" href={backHref}>
                    <ChevronLeftIcon aria-hidden="true" className="size-6 flex-none" />
                    <span>{title}</span>
                </Link>
            )}
            <div className="flex justify-end flex-1 gap-4">{children}</div>
        </div>
    );
}

export default Toolbar;
