'use client';

import Link from 'next/link';
import SearchInput from './SearchInput';
import Toolbar from '@/components/Toolbar';
import { Disclosure } from '@headlessui/react';
import { ElementType } from 'react';
import { usePathname } from 'next/navigation';

interface NavigationBarProps {
    className?: string;
    element?: ElementType;
}

function NavigationBar(props: NavigationBarProps) {
    const { element = 'nav', className } = props;
    const pathname = usePathname();

    const getActiveLinkClass = (href: string) => {
        const config: Record<string, string> = {
            active: 'border-b-2 border-indigo-500',
        };

        return pathname === href ? config.active : undefined;
    };

    // TODO: Add Breadcrumbs
    return (
        <Disclosure
            as={element}
            className={`flex flex-col gap-4 pb-4 text-neutral-900 dark:text-neutral-100 bg-neutral-50 dark:bg-neutral-900 ${className}`}
        >
            <div className="bg-neutral-200 dark:bg-neutral-700 shadow-lg">
                <div className="mx-auto max-w-4xl px-[20px] lg:px-4">
                    <nav className="flex gap-4 h-16 justify-between items-center">
                        <div className="flex h-full">
                            <Link
                                href="/todos"
                                className={`inline-flex items-center px-2 text-sm font-medium text-gray-300 hover:bg-neutral-800 transition duration-300 ${getActiveLinkClass('/todos')}`}
                            >
                                <strong>Home</strong>
                            </Link>
                        </div>

                        <SearchInput className="" />
                    </nav>
                </div>
            </div>

            <Toolbar className="mx-auto max-w-3xl px-[20px] lg:px-4">
                <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-sm text-neutral-100 shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Add task
                </button>
            </Toolbar>
        </Disclosure>
    );
}

export default NavigationBar;
