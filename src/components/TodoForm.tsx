'use client';

import { useState, useEffect } from 'react';
import type { TaskId, Task, TaskType, Currency } from '@/types/Task';
import useTodo from '@/hooks/useTodo';
import Button from '@/components/Button';
import CostInput, { CURRENCY } from '@/components/CostInput';
import SelectInput, { OPTIONS } from '@/components/SelectInput';
import DataBlock, { type Entry } from '@/components/DataBlock';
import { useRootStore } from '@/providers/RootStoreProvider';
import useTodosApi from '@/hooks/useTodosApi';

interface TodoFormProps {
    id: TaskId;
    children?: React.ReactNode;
}

type FormData = Pick<Task, 'title' | 'description' | 'cost' | 'currency' | 'type' | 'data'>;
const dataPresets: Record<TaskType, string[]> = {
    todo: [],
    task: ['priority', 'deadline'],
    'shopping-item': ['brand', 'notes'],
    food: ['calories', 'ingredients'],
};

const defaultState: FormData = {
    title: '',
    description: '',
    cost: 0,
    currency: 'USD',
    type: 'todo',
    data: {},
};

const TodoForm = (props: TodoFormProps) => {
    const data = useTodo(props.id);
    const { loading, updateTask } = useRootStore((state) => state);
    const [formData, setFormData] = useState<FormData>(defaultState);
    const [entries, setEntries] = useState<Entry[]>([]);
    const { updateById } = useTodosApi();

    const onTitleChange = (title: string) => {
        setFormData({ ...formData, title });
    };

    const onDescriptionChange = (description: string) => {
        setFormData({ ...formData, description });
    };

    const onCostChange = (cost: number, currency: string) => {
        setFormData({ ...formData, cost, currency: currency as Currency });
    };

    const onTypeChange = (type: TaskType) => {
        setFormData({ ...formData, type });
    };

    const onDataChange = (data: FormData['data']) => {
        setFormData({ ...formData, data });
    };

    const handleSubmit = async () => {
        const data = await updateById(props.id, formData);
        if (data) {
            updateTask(props.id, data);
        }
    };

    useEffect(() => {
        if (data.todo) {
            setFormData(data.todo || defaultState);
        }
    }, [data.todo]);

    useEffect(() => {
        const getDataEntries = (): Entry[] => {
            let state: Entry[] = dataPresets[formData.type].map((key) => [key, formData.data[key] || '']);

            Object.entries(formData.data).forEach(([key, value]: Entry) => {
                if (!dataPresets[formData.type].includes(key)) {
                    state = [...state, [key, value]] as Entry[];
                }
            });
            state = state.length ? state : [];

            return state;
        };

        const newEntires = getDataEntries();
        setEntries(newEntires);
    }, [formData.data, formData.type]);

    if (loading) {
        return (
            <div className="flex items-center justify-center flex-1">
                <span>Loading...</span>
            </div>
        );
    }

    return (
        <>
            <div className="flex gap-4 justify-end mt-2 py-2">
                <Button variant="primary" title="Add Todo" onClick={handleSubmit} />
                <Button variant="primary" title="Save" onClick={handleSubmit} />
            </div>

            <form className="flex flex-col gap-4 text-neutral-900 dark:text-neutral-100">
                <fieldset className="flex flex-col">
                    <div className="rounded-lg bg-neutral-50/75 dark:bg-neutral-950/25 outline-1 -outline-offset-1 outline-gray-300 dark:outline-gray-500 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                        <label htmlFor="title" className="sr-only">
                            Title
                        </label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => onTitleChange(e.target.value)}
                            className="block w-full px-3 pt-2.5 text-lg font-medium text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-none"
                        />
                        <label htmlFor="description" className="sr-only">
                            Description
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            rows={5}
                            value={formData.description}
                            onChange={(e) => onDescriptionChange(e.target.value)}
                            placeholder="Write a description..."
                            className="block w-full resize-none px-3 py-1.5 text-base text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 leading-[21px] sm:leading-[21px]"
                        />
                    </div>
                </fieldset>

                <fieldset className="flex flex-wrap gap-4">
                    <CostInput
                        className="min-w-36"
                        cost={formData.cost}
                        currency={formData.currency}
                        currencySet={CURRENCY}
                        inputId={`cost-${props.id}`}
                        onChange={onCostChange}
                    />
                    <SelectInput
                        className="w-36"
                        label="Type"
                        value={formData.type}
                        options={OPTIONS}
                        inputId={`type-${props.id}`}
                        onChange={onTypeChange}
                    />
                </fieldset>

                <fieldset className="flex flex-col">
                    <DataBlock className="w-full" data={entries} onChange={onDataChange} />
                </fieldset>
            </form>

            <div className="pt-8">{props.children}</div>
        </>
    );
};

export default TodoForm;
