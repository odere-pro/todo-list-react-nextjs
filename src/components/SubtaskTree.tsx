'use client';

import type { Task, TaskId } from '@/types/Task';
import React from 'react';
import { useRootStore } from '@/providers/RootStoreProvider';
import Link from 'next/link';

type TaskList = {
    id: TaskId;
    subtasks: (TaskList | null)[];
};

export const getTaskMultiLevelList = (id: TaskId, items: Record<string, Task>): TaskList | null => {
    const buildList = (taskId: TaskId): TaskList | null => {
        const task = items[taskId];
        if (!task) return null;

        return {
            id: task.id,
            subtasks: task.subtasks ? task.subtasks.map(buildList) : [],
        };
    };

    return buildList(id);
};

const SubtaskTree = ({ subtasks }: Task) => {
    const { items } = useRootStore((state) => state);

    if (!subtasks || subtasks.length === 0) return null;

    const renderSubtasks = (subtasks?: TaskId[]) => {
        if (!subtasks) return null;

        return (
            <ul className="ml-4 mt-2 flex flex-col gap-2">
                {subtasks.map((id) => {
                    const subtask = items[id];
                    if (!subtask) return null;
                    return (
                        <li key={id}>
                            <Link
                                href={`/todos/${id}`}
                                className="select-none outline-none text-neutral-900 dark:text-neutral-100 dark:border-neutral-500 hover:text-indigo-600 dark:hover:text-indigo-600 focus:text-indigo-600 dark:focus:text-indigo-600"
                                tabIndex={subtask.locked ? -1 : 0}
                            >
                                #{id}: {subtask.title}
                            </Link>
                            {subtask.subtasks && subtask.subtasks.length > 0 && renderSubtasks(subtask.subtasks)}
                        </li>
                    );
                })}
            </ul>
        );
    };

    return (
        <div className="flex flex-col">
            <h3 className="text-sm text-left">Subtasks</h3>
            <div className="-ml-4 text-xs">{renderSubtasks(subtasks)}</div>
        </div>
    );
};

export default SubtaskTree;
