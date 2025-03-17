'use client';

import Link from 'next/link';
import { ChevronLeftIcon } from '@heroicons/react/20/solid';
import { useRootStore } from '@/providers/RootStoreProvider';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';

interface ToolbarProps {
    children?: React.ReactNode;
    className?: string;
}

function Toolbar({ children, className }: ToolbarProps) {
    const { items } = useRootStore((state) => state);
    const { id } = useParams();
    const [[title, url], setLinkData] = useState<[string | undefined, string | undefined]>([undefined, undefined]);

    useEffect(() => {
        if (id && items && Object.keys(items).length > 0) {
            const card = items[id as string];
            if (card === undefined) return;

            const title = card.parentId ? items[card.parentId].title : 'Todos';
            const url = card.parentId ? `/todos/${card.parentId}` : '/todos';
            setLinkData([title, url]);
        }
    }, [items, id]);

    return (
        <div className={`flex justify-between items-center w-full gap-4 ${className}`}>
            {id && url && (
                <Link className="flex items-center text-neutral-900 dark:text-neutral-100" href={url}>
                    <ChevronLeftIcon aria-hidden="true" className="size-6 flex-none" />
                    <span>{title}</span>
                </Link>
            )}
            <div className="flex justify-end flex-1 gap-4">{children}</div>
        </div>
    );
}

export default Toolbar;
