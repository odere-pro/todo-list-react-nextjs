'use client';

import Card from '@/components/Card';
import React from 'react';
import { useRootStore } from '@/providers/RootStoreProvider';
import type { TaskId } from '@/types/Task';

interface TodoListProps {
    id?: TaskId;
}

const TodosList = ({ id }: TodoListProps) => {
    const { items, topLevelTodos, loading, hideComplete } = useRootStore((state) => state);

    if (loading) {
        return (
            <div className="flex items-center justify-center flex-1">
                <span>Loading...</span>
            </div>
        );
    }

    if (id && !items[id]) {
        return (
            <div className="flex items-center justify-center flex-1">
                <span>404 - Task not found</span>
            </div>
        );
    }

    const todosIds = id ? items[id]?.subtasks || [] : topLevelTodos;

    if (todosIds.length === 0) {
        return (
            <div className="flex flex-1 items-center justify-center h-full">
                <p className="text-lg text-neutral-500 dark:text-neutral-400">Please add first item</p>
            </div>
        );
    }

    return (
        <ul role="list" className="w-full flex flex-col gap-4">
            {todosIds.map((id) => {
                if (hideComplete) {
                    return (
                        !items[id].completed &&
                        !items[id].hidden && (
                            <li key={id}>
                                <Card {...items[id]} />
                            </li>
                        )
                    );
                }

                return (
                    !items[id].hidden && (
                        <li key={id}>
                            <Card {...items[id]} />
                        </li>
                    )
                );
            })}
        </ul>
    );
};

export default TodosList;
