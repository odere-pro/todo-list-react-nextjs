import type { Task, TaskId } from '@/types/Task';
import type { Todos } from '@/types/Todos';
import { moveTask } from '@/lib/utils/task';
import { createStore } from 'zustand/vanilla';

interface RootState extends Todos {
    loading: boolean;
    hideComplete: boolean;
}

export type RootActions = {
    createTask: (data: Task, parentId?: TaskId) => void;
    updateTask: (id: TaskId, data: Partial<Task>) => void;
    updateAllTasks: (data: Todos) => void;
    deleteTask: (id: TaskId) => void;
    deleteAllTask: () => void;
    setCompleteTasks: (value: boolean) => void;
    moveTask: (id: TaskId, position: number) => void;
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
        createTask: (data: Task, parentId?: TaskId) =>
            set((state) => {
                let items = {
                    ...state.items,
                    [data.id]: data,
                };

                if (parentId) {
                    let parent = state.items[parentId];
                    parent = {
                        ...parent,
                        subtasks: [data.id, ...(parent.subtasks || [])],
                    };

                    items = {
                        ...items,
                        [parentId]: parent,
                    };
                }

                return {
                    ...state,
                    items,
                    topLevelTodos: !parentId ? [data.id, ...state.topLevelTodos] : state.topLevelTodos,
                };
            }),

        updateTask: (id: TaskId, data: Partial<Task>) =>
            set((state) => {
                let topLevelTodos = [...state.topLevelTodos];
                const { parentId } = data;

                if (!parentId && topLevelTodos.includes(id)) {
                    topLevelTodos = topLevelTodos.filter((item) => item !== id);
                }

                delete data.id;

                return {
                    ...state,
                    items: {
                        ...state.items,
                        [id]: {
                            ...state.items[id],
                            ...data,
                        },
                    },
                    topLevelTodos,
                };
            }),

        updateAllTasks: (data: Todos) => set(() => data),

        deleteTask: (id: TaskId) =>
            set((state) => {
                const topLevelTodos = state.topLevelTodos.filter((item) => item !== id);
                let items = { ...state.items };
                const { parentId } = items[id];

                if (parentId) {
                    const parent = items[parentId];
                    items = {
                        ...items,
                        [parentId]: {
                            ...parent,
                            subtasks: parent.subtasks?.filter((item) => item !== id),
                        },
                    };
                }

                delete items[id];

                return {
                    ...state,
                    items,
                    topLevelTodos,
                };
            }),

        deleteAllTask: () =>
            set((state) => ({
                ...state,
                ...defaultInitState,
            })),

        moveTask: (id: TaskId, position: number) =>
            set((state) => {
                let topLevelTodos: TaskId[] = [];
                let items = { ...state.items };
                const { parentId } = state.items[id];

                if (parentId) {
                    const parent = items[parentId];
                    items = {
                        ...items,
                        [parentId]: {
                            ...parent,
                            subtasks: moveTask(id, position, parent.subtasks || []),
                        },
                    };
                } else {
                    topLevelTodos = moveTask(id, position, state.topLevelTodos);
                }

                return {
                    ...state,
                    items,
                    topLevelTodos,
                };
            }),

        setCompleteTasks: (hideComplete: boolean) =>
            set((state) => { 
                return {
                    ...state,
                    hideComplete,
                };
            }
        ),
    }));
};
