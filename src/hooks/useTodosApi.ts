import type { Todos } from '@/types/Todos';
import { useState, useCallback } from 'react';

const useTodosApi = () => {
    const [todos, setTodos] = useState<Todos>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTodos = useCallback(async () => {
        try {
            const response = await fetch('/api/v1/todos');
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data: Todos = await response.json();
            setTodos(data);
        } catch (err) {
            setError((err as { message: string }).message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { todos, loading, error, fetchTodos };
};

export default useTodosApi;
