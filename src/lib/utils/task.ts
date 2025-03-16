import type { Task, TaskId } from '@/types/Task';
import type { Todos } from '@/types/Todos';
import { memoize } from '@/lib/utils/helpers';

export const getTotalCostHashFn = (id: TaskId, items: Record<string, Task>): string => {
    const task = items[id];
    return `${task.id}-${task.updatedAt}`;
};

export const getTotalCost = (id: TaskId, items: Todos['items']): number => {
    const task = items[id];
    let totalCost = task.cost;

    const calculateSubtaskCost = (subtasks: TaskId[]): number => {
        let sum = 0;
        for (let i = 0; i < subtasks.length; i++) {
            const subtaskId = subtasks[i];
            const subtask = items[subtaskId];
            sum += subtask.cost;

            if (subtask.subtasks && subtask.subtasks.length > 0) {
                sum += calculateSubtaskCost(subtask.subtasks);
            }
        }
        return sum;
    };

    if (task.subtasks && task.subtasks.length > 0) {
        totalCost += calculateSubtaskCost(task.subtasks);
    }

    return totalCost;
};

export const memoizedGetTotalCost = memoize(getTotalCost, getTotalCostHashFn);

export const getTask = (task: Task, items: Todos['items']): Task => {
    const totalCost = memoizedGetTotalCost(task.id, items);

    return {
        ...task,
        subtasks: task.subtasks || [],
        totalCost,
    };
};
