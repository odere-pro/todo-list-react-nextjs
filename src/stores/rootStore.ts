import type { Task, TaskId } from '@/types/Task';
import type { Todos } from '@/types/Todos';
import {
    deleteTaskById,
    completeTask,
    updateTask as updateTaskHelper,
    createTask as createTaskHelper,
} from '@/lib/utils/storeHelpers';
import { createStore } from 'zustand/vanilla';

interface RootState extends Todos {
    items: Record<TaskId, Task & { hidden?: boolean }>;
    loading: boolean;
    hideComplete: boolean;
    searchStr?: string;
}

export type RootActions = {
    createTask: (data: Task, parentId?: TaskId) => void;
    updateTask: (id: TaskId, data: Partial<Task>) => void;
    updateAllTasks: (data: Todos) => void;
    deleteTask: (id: TaskId) => void;
    deleteAllTask: () => void;
    hideCompletedTasks: (value: boolean) => void;
    setSearchStr: (value?: string) => void;
    setCompleteTask: (id: TaskId, value: boolean) => void;
};

export type RootStore = RootState & RootActions;

export const defaultInitState: RootState = {
    items: {},
    topLevelTodos: [],
    loading: true,
    hideComplete: false,
};

export const createRootStore = (initState: RootState = defaultInitState) => {
    return createStore<RootStore>()((set) => ({
        ...initState,

        createTask: (data: Task, parentId: TaskId | null = null) =>
            set(({ items, topLevelTodos }) => createTaskHelper({ items, topLevelTodos }, { ...data, parentId })),

        updateTask: (id: TaskId, data: Partial<Task>) =>
            set(({ items, topLevelTodos }) => updateTaskHelper(id, { items, topLevelTodos }, data)),

        updateAllTasks: (data: Todos) => set(() => data),

        deleteTask: (id: TaskId) => set(({ items, topLevelTodos }) => deleteTaskById(id, { items, topLevelTodos })),

        deleteAllTask: () =>
            set(({ items, topLevelTodos }) => ({
                ...{ items, topLevelTodos },
                ...defaultInitState,
            })),

        hideCompletedTasks: (hideComplete: boolean) =>
            set(({ items, topLevelTodos }) => {
                return {
                    ...{ items, topLevelTodos },
                    hideComplete,
                };
            }),

        setSearchStr: (searchStr?: string) =>
            set(({ items, topLevelTodos }) => {
                Object.values(items).forEach((item: Task) => {
                    const searchStrLower = searchStr?.toLowerCase() || '';
                    const matchesSearch =
                        item.id.toLowerCase().includes(searchStrLower) ||
                        item.title.toLowerCase().includes(searchStrLower);

                    items[item.id] = {
                        ...item,
                        hidden: !matchesSearch,
                    };
                });

                return {
                    items,
                    topLevelTodos,
                    searchStr,
                };
            }),

        setCompleteTask: (id: TaskId, value: boolean) => set((state) => completeTask(id, state, value)),
    }));
};
