'use client';

import Breadcrumbs from '@/components/Breadcrumbs';
import Button from '@/components/Button';
import Link from 'next/link';
import SearchInput from '@/components/SearchInput';
import Toggle from '@/components/Toggle';
import useTaskId from '@/hooks/useTaskId';
import { Disclosure } from '@headlessui/react';
import { ElementType } from 'react';
import { useEffect, useState } from 'react';
import { useRootStore } from '@/providers/RootStoreProvider';

interface NavigationBarProps {
    className?: string;
    element?: ElementType;
}

function NavigationBar(props: NavigationBarProps) {
    const { setSearchStr, items, hideCompletedTasks } = useRootStore((state) => state);
    const { element = 'nav', className } = props;
    const { id } = useTaskId();
    const [isNotFound, setIsNotFound] = useState(false);

    useEffect(() => {
        if (id) {
            setIsNotFound(Boolean(!items[id]));
        }
    }, [id, items]);

    const handleAddTask = () => {
        // FIXME: remove after testing
    };

    const filterCompleteTasks = (value: boolean) => {
        hideCompletedTasks(value);
    };

    const onSearch = (value: string) => {
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
                                className="inline-flex items-center px-2 text-md font-medium text-neutral-900 dark:text-neutral-100 hover:bg-neutral-300 dark:hover:bg-neutral-800 transition duration-300"
                            >
                                <strong>Todo app</strong>
                            </Link>
                        </div>

                        {!isNotFound && <SearchInput onSearch={onSearch} />}
                    </nav>
                </div>
            </div>

            <Breadcrumbs className="mx-auto max-w-4xl px-[20px] lg:px-4 w-full" />

            {!isNotFound && (
                <div className={`flex justify-between items-center w-full gap-4 ${className}`}>
                    <div className="flex justify-end flex-1 gap-4 mx-auto max-w-3xl px-[20px] lg:px-4">
                        <Toggle onChange={filterCompleteTasks} />
                        <Button title="Add task" variant="primary" onClick={handleAddTask} />
                    </div>
                </div>
            )}
        </Disclosure>
    );
}

export default NavigationBar;
