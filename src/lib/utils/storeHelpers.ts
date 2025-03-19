import type { Task, TaskId } from '@/types/Task';
import type { Todos } from '@/types/Todos';

const updateTotalCosts = (state: Todos): Todos => {
    let newState: Todos = { ...state };

    const calculateTotalCost = (taskId: TaskId): number => {
        const task = newState.items[taskId];
        if (!task) return 0;

        let totalCost = task.cost || 0;

        if (task.subtasks && task.subtasks.length > 0) {
            task.subtasks.forEach((subtaskId) => {
                totalCost += calculateTotalCost(subtaskId);
            });
        }

        newState = {
            ...newState,
            items: {
                ...newState.items,
                [taskId]: {
                    ...task,
                    totalCost,
                    updatedAt: new Date().toISOString(),
                },
            },
        };

        return totalCost;
    };

    newState.topLevelTodos.forEach((taskId) => {
        calculateTotalCost(taskId);
    });

    return newState;
};

export const deleteTaskById = (id: string, state: Todos): Todos => {
    let newState: Todos = {
        ...state,
        topLevelTodos: state.topLevelTodos.filter((item) => item !== id),
    };

    const items = { ...state.items };
    const { parentId } = items[id];

    if (parentId) {
        const parent = state.items[parentId];
        if (parent) {
            newState = {
                ...newState,
                items: {
                    ...newState.items,
                    [parentId]: {
                        ...parent,
                        subtasks: parent?.subtasks?.filter((item) => item !== id) || [],
                        updatedAt: new Date().toISOString(),
                    },
                },
            };
        }
    }

    delete newState.items[id];

    return updateTotalCosts(newState);
};

export const completeTask = (id: string, state: Todos, value: boolean): Todos => {
    const completeSubtasks = (taskId: TaskId, items: Record<TaskId, Task & { hidden?: boolean }>) => {
        const task = items[taskId];
        if (task?.subtasks) {
            task?.subtasks?.forEach((subtaskId) => {
                items[subtaskId].completed = value;
                completeSubtasks(subtaskId, items);
            });
        }
    };

    const items = {
        ...state.items,
        [id]: {
            ...state.items[id],
            completed: value,
            updatedAt: new Date().toISOString(),
        },
    };

    completeSubtasks(id, items);

    return {
        ...state,
        items,
    };
};

export const updateTask = (id: string, state: Todos, value: Partial<Task>): Todos => {
    let newState: Todos = { ...state };
    const { parentId, completed } = value;

    if (completed !== undefined) {
        newState = completeTask(id, newState, completed);
    }

    const becomesChild = parentId && !state.items[id].parentId;
    if (becomesChild) {
        newState = {
            ...newState,
            topLevelTodos: newState.topLevelTodos.filter((item) => item !== id),
        };
    }

    if (parentId) {
        const parent = newState.items[parentId];
        if (parent) {
            newState = {
                ...newState,
                items: {
                    ...newState.items,
                    [parentId]: {
                        ...parent,
                        subtasks: parent.subtasks ? [id, ...parent?.subtasks] : [id],
                        updatedAt: new Date().toISOString(),
                    },
                },
            };
        }

        const prevParentId = state.items[id].parentId;
        const prevParent = prevParentId && newState.items[prevParentId];
        if (prevParent) {
            newState = {
                ...newState,
                items: {
                    ...newState.items,
                    [prevParentId]: {
                        ...prevParent,
                        subtasks: prevParent?.subtasks?.filter((item) => item !== id) || [],
                        updatedAt: new Date().toISOString(),
                    },
                },
            };
        }
    }

    newState = {
        ...newState,
        items: {
            ...newState.items,
            [id]: {
                ...newState.items[id],
                ...value,
                updatedAt: new Date().toISOString(),
            },
        },
    };

    return updateTotalCosts(newState);
};

export const createTask = (state: Todos, value: Task): Todos => {
    let newState: Todos = { ...state };
    const { parentId, id } = value;

    if (!parentId) {
        newState = {
            ...newState,
            topLevelTodos: [id, ...newState.topLevelTodos],
        };
    } else {
        const parent = state.items[parentId];
        if (parent) {
            newState = {
                ...newState,
                items: {
                    ...newState.items,
                    [parentId]: {
                        ...parent,
                        subtasks: parent?.subtasks ? [id, ...parent?.subtasks] : [id],
                        updatedAt: new Date().toISOString(),
                    },
                },
            };
        }
    }

    newState = {
        ...newState,
        items: {
            ...newState.items,
            [id]: {
                ...newState.items[id],
                ...value,
                createdAt: new Date().toISOString(),
            },
        },
    };

    return updateTotalCosts(newState);
};
