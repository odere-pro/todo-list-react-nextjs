import type { Todos } from '@/types/Todos';
import { readTodos, writeTodos, generateId } from '@/lib/utils/serverHelpers';
import { NextRequest } from 'next/server';
import { deleteTaskById, updateTask, createTask } from '@/lib/utils/storeHelpers';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;

        if (!id) {
            return new Response(JSON.stringify({ error: 'ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const todos = await readTodos();
        const todo = todos.items[id];

        if (!todo) {
            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        return new Response(JSON.stringify(todo), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                message: 'Failed to read task',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;

        if (!id) {
            return new Response(JSON.stringify({ error: 'ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const todos = await readTodos();
        const todo = todos.items[id];

        if (!todo) {
            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        await writeTodos({
            ...deleteTaskById(id, todos),
            timeStamp: new Date().toISOString(),
        });

        return new Response(JSON.stringify({ message: 'Deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                message: 'Failed to delete task',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const parentId = (await params).id;
        const id = await generateId();

        if (!parentId) {
            return new Response(JSON.stringify({ error: 'ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const payload = await request.json();
        const todos = await readTodos();
        let topLevelTodos = [...(todos?.topLevelTodos || [])];

        if (!parentId && topLevelTodos.includes(id)) {
            topLevelTodos = topLevelTodos.filter((item) => item !== id);
        }

        const newTodos = createTask(todos, {
            ...payload,
            id,
            parentId,
        });

        await writeTodos({
            ...newTodos,
            timeStamp: new Date().toISOString(),
        });

        return new Response(JSON.stringify(newTodos.items[id]), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                message: 'Failed to create task',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;
        const payload = await request.json();
        const { parentId } = payload;

        if (parentId === id) {
            return new Response(JSON.stringify({ error: 'Please input valid ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const todos = await readTodos();
        const newTodos: Todos = updateTask(id, todos, payload);

        await writeTodos({
            ...newTodos,
            timeStamp: new Date().toISOString(),
        });

        return new Response(JSON.stringify(newTodos.items[id]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                message: 'Failed to update task',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            Allow: 'GET, POST, DELETE, OPTIONS, PATCH',
            'Content-Type': 'application/json',
        },
    });
}
