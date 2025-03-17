import Link from 'next/link';
import type { Task } from '@/types/Task';
import useTaskId from '@/hooks/useTaskId';
import { HomeIcon } from '@heroicons/react/20/solid';
import { useEffect, useState } from 'react';
import { useRootStore } from '@/providers/RootStoreProvider';

interface PageItem {
    name: string;
    href: string;
    isActive: boolean;
}

interface BreadcrumbsProps {
    className?: string;
}

const Divider = () => (
    <svg
        fill="currentColor"
        viewBox="0 0 20 20"
        aria-hidden="true"
        className="size-5 shrink-0 text-neutral-200 dark:text-neutral-700"
    >
        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
    </svg>
);

function Breadcrumbs({ className }: BreadcrumbsProps) {
    const { items } = useRootStore((state) => state);
    const { id } = useTaskId();
    const [pages, setPages] = useState<PageItem[]>([]);

    useEffect(() => {
        let task: Task | null = items[id];
        let acc: PageItem[] = [];

        while (task) {
            const pageItem = {
                name: `#${task.id}`,
                href: `/todos/${task.id}`,
                isActive: task.id === id,
            };
            acc = [pageItem, ...acc];
            task = task.parentId ? items[task.parentId] : null;
        }

        setPages(acc);
    }, [id, items, setPages]);


    const getActiveLinkClass = (active: boolean) => {
        const config: Record<string, string> = {
            active: 'text-indigo-600 dark:text-indigo-600',
            default: 'text-neutral-400 dark:text-neutral-500',
        };

        return active ? config.active : config.default;
    };

    return (
        <nav aria-label="Breadcrumb" className={`flex items-center ${className}`}>
            <ol role="list" className="flex items-center gap-2">
                <li>
                    <div>
                        <Link
                            href="/todos"
                            className="text-neutral-400 dark:text-neutral-500 transition duration-300 hover:text-indigo-600 dark:hover:text-indigo-600"
                        >
                            <HomeIcon aria-hidden="true" className="size-5 shrink-0" />
                            <span className="sr-only">Home</span>
                        </Link>
                    </div>
                </li>
                {pages.map((page) => (
                    <li key={page.name}>
                        <div className="flex gap-2">
                            <Divider />
                            <Link
                                href={page.href}
                                aria-current={page.isActive ? 'page' : undefined}
                                className={`text-sm font-medium  transition duration-300 hover:text-indigo-600 dark:hover:text-indigo-600 ${getActiveLinkClass(page.isActive)} `}
                            >
                                {page.name}
                            </Link>
                        </div>
                    </li>
                ))}
            </ol>
        </nav>
    );
}

export default Breadcrumbs;
