import { useState, useEffect } from 'react';
import { useRootStore } from '@/providers/RootStoreProvider';
import type { TaskId, Task } from '@/types/Task';

const useTodo = (id?: TaskId) => {
    const { items } = useRootStore((state) => state);
    const [todo, setTodo] = useState<Task | null>(null);

    useEffect(() => {
        if (id) {
            setTodo(items[id] || null);
        } else {
            setTodo(null);
        }
    }, [items, id]);

    return {
        todo,
        items,
    };
};

export default useTodo;
