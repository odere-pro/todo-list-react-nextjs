'use client';

import { useState, useEffect } from 'react';
import type { TaskId, Task, TaskType, Currency } from '@/types/Task';
import useTodo from '@/hooks/useTodo';
import Button from '@/components/Button';
import CostInput, { CURRENCY } from '@/components/CostInput';
import SelectInput, { OPTIONS } from '@/components/SelectInput';
import { useRootStore } from '@/providers/RootStoreProvider';
import useTodosApi from '@/hooks/useTodosApi';

interface TodoFormProps {
    id?: TaskId;
    children?: React.ReactNode;
}

type FormData = Pick<Task, 'title' | 'description' | 'cost' | 'currency' | 'type' | 'data'>;
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
    const { items, loading, updateTask, deleteTask, createTask } = useRootStore((state) => state);
    const { updateById, deleteById, create } = useTodosApi();
    const [formData, setFormData] = useState<FormData>(defaultState);

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

    const newTask = async () => {
        if (props.id) {
            updateTask(props.id, formData);
            await updateById(props.id, formData);
        } else {
            const data = await create(formData);
            if (data) {
                createTask(data);
            }
        }
    };

    const newSubTask = async () => {
        if (!props.id) return;
        const data = await create({
            ...formData,
            parentId: props.id,
            completed: false,
            subtasks: [],
        });
        if (data) {
            createTask(data, props.id);
        }
    };

    const deleteTaskHandler = async () => {
        if (props.id) {
            const parentId = items[props.id]?.parentId;
            deleteTask(props.id);
            await deleteById(props.id);

            window.location.href = parentId ? `/todos/${parentId}` : '/todos';
        }
    };

    useEffect(() => {
        if (data.todo) {
            setFormData(data.todo || defaultState);
        }
    }, [data.todo]);

    if (loading) {
        return (
            <div className="flex items-center justify-center flex-1">
                <span>Loading...</span>
            </div>
        );
    }

    if (props.id && !items[props.id]) {
        return (
            <div className="flex items-center justify-center flex-1">
                <span>404 - Task not found</span>
            </div>
        );
    }

    return (
        <>
            <div className={`flex justify-between items-center ${!props?.id && 'justify-end'}`}>
                {props?.id && (
                    <div>
                        <Button variant="danger" title="Delete" onClick={deleteTaskHandler} />
                    </div>
                )}
                <div className="flex gap-4 justify-end mt-2 py-2">
                    {props?.id && <Button title="Create subtask" onClick={newSubTask} />}
                    <Button variant="primary" title={!props?.id ? 'New' : 'Save'} onClick={newTask} />
                </div>
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
                        label={
                            !props?.id
                                ? 'Cost'
                                : `Total cost: ${items[props.id]?.totalCost} ${items[props.id]?.currency}`
                        }
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
            </form>

            <div className="pt-8">{props.children}</div>
        </>
    );
};

export default TodoForm;
