'use client';

import Button from '@/components/Button';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';
import Toolbar from '@/components/Toolbar';
import { Disclosure } from '@headlessui/react';
import { ElementType } from 'react';
import { usePathname } from 'next/navigation';
import { useRootStore } from '@/providers/RootStoreProvider';

interface NavigationBarProps {
    className?: string;
    element?: ElementType;
}

function NavigationBar(props: NavigationBarProps) {
    const { createTask } = useRootStore((state) => state);
    const { element = 'nav', className } = props;
    const pathname = usePathname();

    const getActiveLinkClass = (href: string) => {
        const config: Record<string, string> = {
            active: 'border-b-2 border-indigo-500',
        };

        return pathname === href ? config.active : undefined;
    };

    const handleAddTask = () => {
        // FIXME: remove after testing
        // createTask({
        //     locked: false,
        //     completed: false,
        //     cost: 10,
        //     createdAt: '2025-03-15T18:48:29.356Z',
        //     currency: 'SEK',
        //     data: {
        //         'data 1': 'task',
        //         'data 2': 'task',
        //     },
        //     description:
        //         '# Project Title\n\n## Introduction\n\nThis is a brief introduction to the project.\n\n## Features\n\n1. Feature one\n2. Feature two\n3. Feature three\n\n## Installation\n\nTo install the project, follow these steps:\n\n```bash\ngit clone https://github.com/your-repo/project.git\ncd project\nnpm install\n```\n\n## Usage\n\n- Step one\n- Step two\n- Step three\n',
        //     parentId: null,
        //     id: '0012',
        //     title: 'Has 4 subtasks',
        //     type: 'task',
        //     updatedAt: '2025-03-15T18:48:29.356Z',
        // });
    };

    // TODO: Add Breadcrumbs
    return (
        <Disclosure
            as={element}
            className={`flex flex-col gap-4 pb-4 text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900 ${className}`}
        >
            <div className="bg-neutral-200 dark:bg-neutral-700">
                <div className="mx-auto max-w-4xl px-[20px] lg:px-4">
                    <nav className="flex gap-4 h-16 justify-between items-center select-none">
                        <div className="flex h-full">
                            <Link
                                href="/todos"
                                className={`inline-flex items-center px-2 text-md font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-800 transition duration-300 ${getActiveLinkClass('/todos')}`}
                            >
                                <strong>Home</strong>
                            </Link>
                        </div>

                        <SearchInput className="" />
                    </nav>
                </div>
            </div>

            <Toolbar className="mx-auto max-w-3xl px-[20px] lg:px-4">
                <Button title="Add task" variant="primary" onClick={handleAddTask} />
                <Button title="Add task" onClick={handleAddTask} />
            </Toolbar>
        </Disclosure>
    );
}

export default NavigationBar;
