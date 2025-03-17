import { useState, useCallback, useEffect } from 'react';
import type { Todos } from '@/types/Todos';

const useTodosApi = () => {
    const getFromLocalStorage = () => {
        if (typeof window !== 'undefined') {
            const savedTodos = localStorage.getItem('todos');
            return savedTodos ? JSON.parse(savedTodos) : undefined;
        }
    };

    const setToLocalStorage = (todos: Todos) => {
        if (typeof window !== 'undefined' && todos) {
            localStorage.setItem('todos', JSON.stringify(todos));
        }
    };

    const [todos, setTodos] = useState<Todos>(getFromLocalStorage);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setToLocalStorage(todos);
    }, [todos]);

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
