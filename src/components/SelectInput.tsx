'use client';

import { Label, Listbox, ListboxButton, ListboxOption, ListboxOptions } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/16/solid';
import { CheckIcon } from '@heroicons/react/20/solid';
import { useState, useEffect } from 'react';
import type { TaskType } from '@/types/Task';

export const OPTIONS: TaskType[] = ['todo', 'shopping-item', 'task', 'food'];

interface SelectInputProps {
    value: TaskType;
    inputId?: string;
    className?: string;
    label?: string;
    options?: TaskType[];
    onChange?: (value: TaskType) => void;
}

function SelectInput({ value, options = OPTIONS, onChange, inputId, className, label }: SelectInputProps) {
    const [selected, setSelected] = useState(value);

    const handleChange = (e: TaskType) => {
        setSelected(e);
        if (onChange) {
            onChange(e);
        }
    };

    useEffect(() => {
        setSelected(value);
    }, [value]);

    return (
        <div className={className}>
            <Listbox value={selected} onChange={handleChange}>
                <Label htmlFor={inputId} className="w-full block text-xs/5 text-gray-500 dark:text-neutral-400">
                    {label}
                </Label>
                <div className="relative w-full ">
                    <ListboxButton
                        id={inputId}
                        className="grid w-full cursor-default grid-cols-1 rounded-md bg-neutral-50/75 dark:bg-neutral-950/25 py-1.5 pr-2 pl-3 text-left text-gray-900 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    >
                        <span className="col-start-1 row-start-1 truncate pr-6 text-neutral-900 dark:text-neutral-100">
                            {selected}
                        </span>
                        <ChevronUpDownIcon
                            aria-hidden="true"
                            className="col-start-1 row-start-1 size-5 self-center justify-self-end text-neutral-900 dark:text-neutral-100 sm:size-4"
                        />
                    </ListboxButton>

                    <ListboxOptions
                        transition
                        className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-neutral-50/75 dark:bg-neutral-950/25 py-1 text-base ring-1 shadow-lg ring-black/5 focus:outline-hidden data-leave:transition data-leave:duration-100 data-leave:ease-in data-closed:data-leave:opacity-0 sm:text-sm"
                    >
                        {options.map((option) => (
                            <ListboxOption
                                key={option}
                                value={option}
                                className="group relative cursor-default py-2 pr-9 pl-3 text-gray-900 select-none data-focus:bg-indigo-600 data-focus:text-white data-focus:outline-hidden"
                            >
                                <span className="block truncate font-normal group-data-selected:font-semibold text-neutral-900 dark:text-neutral-100">
                                    {option}
                                </span>

                                <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-indigo-600 group-not-data-selected:hidden group-data-focus:text-white">
                                    <CheckIcon aria-hidden="true" className="size-5" />
                                </span>
                            </ListboxOption>
                        ))}
                    </ListboxOptions>
                </div>
            </Listbox>
        </div>
    );
}

export default SelectInput;
