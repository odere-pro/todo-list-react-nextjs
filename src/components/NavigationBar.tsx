'use client';

import Button from '@/components/Button';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';
import Toolbar from '@/components/Toolbar';
import Toggle from '@/components/Toggle';
import { Disclosure } from '@headlessui/react';
import { ElementType } from 'react';
import { usePathname } from 'next/navigation';
import { useRootStore } from '@/providers/RootStoreProvider';
import { useEffect, useState } from 'react';

interface NavigationBarProps {
    className?: string;
    element?: ElementType;
}

function NavigationBar(props: NavigationBarProps) {
    const { setSearchStr, items, hideCompletedTasks } = useRootStore((state) => state);
    const { element = 'nav', className } = props;
    const pathname = usePathname();
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        const match = pathname.match(/\/todos\/(\d+)/);
        if (match) {
            setIsNotFound(Boolean(match[1] && !items[match[1]]));
        }
    }, [items, pathname]);

    const getActiveLinkClass = (href: string) => {
        const config: Record<string, string> = {
            active: 'border-b-2 border-indigo-500',
        };

        return pathname === href ? config.active : undefined;
    };

    const handleAddTask = () => {
        // FIXME: remove after testing
    };

    const filterCompleteTasks = (value: boolean) => {
        hideCompletedTasks(value);
    };

    const onSearch = (value: string) => {
        console.log({ value })
        setSearchStr(value);
    };

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

                        {!isNotFound && <SearchInput onSearch={onSearch} />}
                    </nav>
                </div>
            </div>

            {!isNotFound && (
                <Toolbar className="mx-auto max-w-3xl px-[20px] lg:px-4">
                    <Toggle onChange={filterCompleteTasks} />
                    <Button title="Add task" variant="primary" onClick={handleAddTask} />
                </Toolbar>
            )}
        </Disclosure>
    );
}

export default NavigationBar;
