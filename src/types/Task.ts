export type TaskId = string;

export type TaskType = 'todo' | 'shopping-item' | 'task' | 'food';

export type Currency = 'USD' | 'EUR' | 'task' | 'SEK';

export interface Base {
    id: TaskId;
    createdAt?: string;
    updatedAt?: string;
}

export interface Task extends Base {
    locked: boolean;
    completed: boolean;
    cost: number;
    currency: Currency;
    data: Record<string, string>;
    description: string;
    parentId: TaskId | null;
    subtasks?: TaskId[];
    title: string;
    type: TaskType;
    totalCost?: number;
}
