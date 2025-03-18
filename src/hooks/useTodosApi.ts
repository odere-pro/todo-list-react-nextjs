import type { Task } from '@/types/Task';
import type { Todos } from '@/types/Todos';
import { useState, useCallback } from 'react';

const useTodosApi = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchAll = useCallback(async (): Promise<Todos | undefined> => {
        try {
            const response = await fetch('/api/v1/todos');
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data: Todos = await response.json();

            return data;
        } catch (err) {
            setError((err as { message: string }).message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const updateById = useCallback(async (id: string, body: Partial<Task>): Promise<Task | undefined> => {
        try {
            const response = await fetch(`/api/v1/todos/${id}`, {
                method: 'PATCH',
                body: JSON.stringify(body),
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            if (!response.ok) {
                throw new Error('Failed to fetch todos');
            }
            const data: Task = await response.json();

            return data;
        } catch (err) {
            setError((err as { message: string }).message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    return { loading, error, fetchAll, updateById };
};

export default useTodosApi;
