'use client';

import { useState, useEffect } from 'react';
import Input from '@/components/Input';
import Button from '@/components/Button';
import type { TaskId } from '@/types/Task';

export type Entry = [key: string, value: string];

interface DataBlockProps {
    type?: TaskId;
    className?: string;
    data?: Entry[];
    onChange?(data: Record<string, string>): void;
}

const dataPresets: Record<TaskId, Entry> = {
    todo: ['', ''],
    task: ['task', 'name: deadline: '],
    food: ['calories', ' - kCal'],
    'shopping-item': ['item', 'price:'],
};

// TODO: Implement the DataBlock component,  need more testing
function DataBlock({ className, data = [], onChange, type = 'todo' }: DataBlockProps) {
    const [entries, setEntries] = useState<Entry[]>(data);

    const addEntry = () => {
        setEntries([dataPresets[type], ...entries]);
        setTimeout(() => {
            const lastKeyInput = document.getElementById(`entry-${0}-key`);
            lastKeyInput?.focus();
        }, 0);
    };

    const getRemoveEntry = (index: number) => () => {
        const newEntries = [...entries.slice(0, index), ...entries.slice(index + 1)];
        setEntries(newEntries);
    };

    const getDataOnChange = (newEntries: Entry[]): Record<string, string> => {
        return newEntries.reduce((acc, [key, value]) => {
            if (!key) return acc;
            return { ...acc, [key]: value };
        }, {});
    };

    const getOnKeyChange = (index: number) => (newKey: string) => {
        const newEntries: Entry[] = entries.map((entry, i) => (i === index ? [newKey, entry[1]] : entry));
        if (onChange) {
            onChange(getDataOnChange(newEntries));
        }

        setEntries(newEntries);
    };

    const getOnValueChange = (index: number) => (newValue: string) => {
        const newEntries: Entry[] = entries.map((entry, i) => (i === index ? [entry[0], newValue] : entry));
        if (onChange) {
            onChange(getDataOnChange(newEntries));
        }

        setEntries(newEntries);
    };

    useEffect(() => {
        setEntries(data);
    }, [data]);

    return (
        <div className={`flex flex-col gap-4 ${className}`}>
            <div className="flex gap-4 justify-end">
                <Button title="Add tag" onClick={addEntry} className="min-w-min" />
            </div>

            {entries.map(([key, value], index) => (
                <div key={`entry-${index}`} className="flex flex-wrap gap-4 items-end">
                    <Input
                        inputId={`entry-${index}-key`}
                        className="w-36"
                        label="Key"
                        value={key}
                        onChange={getOnKeyChange(index)}
                    />
                    <Input
                        inputId={`entry-${index}-value`}
                        className="flex-1 min-w-36"
                        label="Value"
                        value={value}
                        onChange={getOnValueChange(index)}
                    />
                    <Button
                        title="X"
                        variant="danger"
                        onClick={getRemoveEntry(index)}
                        className="mb-2 min-w-min bg-transparent text-red-500 hover:text-white"
                    />
                </div>
            ))}
        </div>
    );
}

export default DataBlock;
