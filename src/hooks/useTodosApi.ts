import { useState, useCallback } from 'react';
import type { Todos } from '@/types/Todos';

const useTodosApi = () => {
    const [todos, setTodos] = useState<Todos>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTodos = useCallback(
        async ({ silent = false, force = false } = {}) => {
            if (!force && todos) {
                setLoading(false);
                console.info('Todos already fetched');
                return;
            }

            if (!silent) {
                setLoading(true);
            }

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
                if (!silent) {
                    setLoading(false);
                }
            }
        },
        [todos]
    );

    return { todos, loading, error, fetchTodos };
};

export default useTodosApi;
