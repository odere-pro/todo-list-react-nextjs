import type { Todos } from '@/types/Todos';
import { getTask } from '@/lib/utils/task';
import { readTodos, writeTodos, generateId } from '@/lib/utils/serverHelpers';
import { NextRequest } from 'next/server';

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

        return new Response(JSON.stringify(getTask(todo, todos.items)), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
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

        delete todos.items[id];

        await writeTodos({
            ...todos,
            topLevelTodos: todos.topLevelTodos.filter((todoId) => todoId !== id),
            timeStamp: new Date().toISOString(),
            length: (todos?.length || 0) + 1,
        });

        return new Response(JSON.stringify({ message: 'Deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
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
        let topLevelTodos = [...todos?.topLevelTodos || []];

        if (!parentId && topLevelTodos.includes(id)) {
            topLevelTodos = topLevelTodos.filter((item) => item !== id);
        }

        delete payload.id;
        const parentTodo = todos.items[parentId];

        const newTodos = {
            ...todos,
            items: {
                ...todos.items,
                [parentId]: {
                    ...parentTodo,
                    subtasks: [id, ...(parentTodo.subtasks || [])],
                    updatedAt: new Date().toISOString(),
                },
                [id]: {
                    ...payload,
                    id,
                    parentId,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            },
            topLevelTodos,
        };

        await writeTodos({
            ...newTodos,
            timeStamp: new Date().toISOString(),
            length: (todos?.length || 0) + 1,
        });

        return new Response(JSON.stringify(newTodos.items[id]), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
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
        const todo = todos.items[id];

        delete payload.id;

        let newTodos: Todos = {
            ...todos,
            items: {
                ...todos.items,
                [id]: {
                    ...todos.items[id],
                    ...payload,
                    updatedAt: new Date().toISOString(),
                },
            },
            timeStamp: new Date().toISOString(),
        };

        if (parentId) {
            const parentTodo = newTodos.items[parentId];
            newTodos = {
                ...newTodos,
                items: {
                    ...newTodos.items,
                    [parentId]: {
                        ...parentTodo,
                        subtasks: [id, ...(parentTodo.subtasks || [])],
                        updatedAt: new Date().toISOString(),
                    },
                },
            };
        }

        if (todo.parentId) {
            const parentTodo = newTodos.items[todo.parentId];
            newTodos = {
                ...newTodos,
                items: {
                    ...newTodos.items,
                    [todo.parentId]: {
                        ...parentTodo,
                        subtasks: parentTodo.subtasks?.filter((item) => item !== id),
                        updatedAt: new Date().toISOString(),
                    },
                },
            };
        } else {
            newTodos = {
                ...newTodos,
                topLevelTodos: newTodos.topLevelTodos.filter((item) => item !== id),
            };
        }

        await writeTodos({
            ...newTodos,
            timeStamp: new Date().toISOString(),
            length: (todos?.length || 0) + 1,
        });

        return new Response(JSON.stringify(newTodos.items[id]), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify(error), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
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
