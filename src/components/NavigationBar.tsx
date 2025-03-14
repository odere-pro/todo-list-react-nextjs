import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import Image from 'next/image';
import SearchInput from './SearchInput';
import NavigationUserDropdown from './NavigationUserDropdown';

function NavigationBar() {
    return (
        <Disclosure as="nav" className="bg-white shadow-sm">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
                <div className="flex h-16 justify-between">
                    <div className="flex px-2 lg:px-0">
                        <Link href="/" className="flex shrink-0 items-center">
                            <Image
                                alt="Your Company"
                                src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
                                className="h-8 w-auto"
                                width={48}
                                height={48}
                            />
                        </Link>
                        <div className="hidden lg:ml-6 lg:flex lg:space-x-8">
                            {/* Current: "border-indigo-500 text-gray-300", Default: "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700" */}
                            <Link
                                href="/"
                                className="inline-flex items-center border-b-2 border-indigo-500 px-1 pt-1 text-sm font-medium text-gray-300"
                            >
                                Home
                            </Link>
                            <Link
                                href="/todos"
                                className="inline-flex items-center border-b-2 border-transparent px-1 pt-1 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700"
                            >
                                Todos
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end">
                        <SearchInput />
                    </div>
                    <div className="flex items-center lg:hidden">
                        {/* Mobile menu button */}
                        <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:ring-2 focus:ring-indigo-500 focus:outline-hidden focus:ring-inset">
                            <span className="absolute -inset-0.5" />
                            <span className="sr-only">Open main menu</span>
                            <Bars3Icon aria-hidden="true" className="block size-6 group-data-open:hidden" />
                            <XMarkIcon aria-hidden="true" className="hidden size-6 group-data-open:block" />
                        </DisclosureButton>
                    </div>
                    <div className="hidden lg:ml-4 lg:flex lg:items-center">
                        {/* Profile dropdown */}
                        <NavigationUserDropdown />
                    </div>
                </div>
            </div>

            <DisclosurePanel className="lg:hidden">
                <div className="space-y-1 pt-2 pb-3">
                    {/* Current: "bg-indigo-50 border-indigo-500 text-indigo-700", Default: "border-transparent text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800" */}
                    <Link
                        href="/"
                        className="block border-l-4 border-indigo-500 bg-indigo-50 py-2 pr-4 pl-3 text-base font-medium text-indigo-700"
                    >
                        Home
                    </Link>
                    <Link
                        href="/todos"
                        className="block border-l-4 border-transparent py-2 pr-4 pl-3 text-base font-medium text-gray-600 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-800"
                    >
                        Todos
                    </Link>
                </div>
                <div className="border-t border-gray-200 pt-4 pb-3">
                    <div className="flex items-center px-4">
                        <div className="shrink-0">
                            <Image
                                alt=""
                                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                className="size-10 rounded-full"
                                width={48}
                                height={48}
                            />
                        </div>
                        <div className="ml-3">
                            <div className="text-base font-medium text-gray-800">Tom Cook</div>
                            <div className="text-sm font-medium text-gray-500">tom@example.com</div>
                        </div>
                    </div>
                    <div className="mt-3 space-y-1">
                        <DisclosureButton
                            as="a"
                            href="#"
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        >
                            Your Profile
                        </DisclosureButton>
                        <DisclosureButton
                            as="a"
                            href="#"
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        >
                            Settings
                        </DisclosureButton>
                        <DisclosureButton
                            as="a"
                            href="#"
                            className="block px-4 py-2 text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                        >
                            Sign out
                        </DisclosureButton>
                    </div>
                </div>
            </DisclosurePanel>
        </Disclosure>
    );
}

export default NavigationBar;
