import type { TaskId, Task } from '@/types/Task';

export interface Todos {
    items: Record<TaskId, Task>;
    composition: TaskId[];
}
