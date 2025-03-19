'use client';

import type { TaskId } from '@/types/Task';
import React from 'react';
import { useRootStore } from '@/providers/RootStoreProvider';
import Link from 'next/link';

export interface SubtaskTreeProps {
    subtasks: TaskId[];
    className?: string;
}

const SubtaskTree = ({ subtasks, className }: SubtaskTreeProps) => {
    const { items } = useRootStore((state) => state);

    if (!subtasks || subtasks?.length === 0) return null;

    return (
        <ul className={`flex flex-col text-sm gap-2 items-start ${className}`}>
            {subtasks?.map((id) => {
                const todo = items[id];

                if (!todo) return null;

                const getSubtasksCount = (taskId: TaskId): number => {
                    const task = items[taskId];
                    if (!task || !task?.subtasks) return 0;
                    return (
                        task?.subtasks?.length +
                        task?.subtasks?.reduce((sum, subtaskId) => sum + getSubtasksCount(subtaskId), 0)
                    );
                };

                const count = getSubtasksCount(id);

                return (
                    <li key={id} className="w-full flex flex-col gap-1">
                        <Link
                            href={`/todos/${id}`}
                            className="block gap-2 w-full select-none outline-none text-neutral-900 dark:text-neutral-100 dark:border-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-600 focus:text-indigo-600 dark:focus:text-indigo-600"
                            tabIndex={todo.locked ? -1 : 0}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className={`truncate ${todo.completed ? 'line-through' : ''}`}>
                                #{id}: {todo.title}{' '}
                            </div>
                        </Link>
                        <div className="text-xs text-neutral-900/50 dark:text-neutral-100/50">
                            {count > 0 ? `${count} todos` : ''}
                        </div>
                    </li>
                );
            })}
        </ul>
    );
};

export default SubtaskTree;
