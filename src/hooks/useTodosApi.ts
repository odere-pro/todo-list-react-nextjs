import { useState, useEffect } from 'react';
import type { Todos } from '@/types/Todos';

const useTodosApi = () => {
    const [todos, setTodos] = useState<Todos>();
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTodos = async () => {
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
        };

        fetchTodos();
    }, []);

    return { todos, loading, error };
};

export default useTodosApi;
