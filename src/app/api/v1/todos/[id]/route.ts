import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Todos } from '@/types/Todos';
import { getTask } from '@/lib/utils/task';
import { NextRequest } from 'next/server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const id = (await params).id;

        if (!id) {
            return new Response(JSON.stringify({ error: 'ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const dataPath = path.join(__dirname, '..', 'data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos: Todos = JSON.parse(data);

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

        const dataPath = path.join(__dirname, '..', 'data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos: Todos = JSON.parse(data);

        if (!todos.items[id]) {
            return new Response(JSON.stringify({ error: 'Not found' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        delete todos.items[id];
        todos.topLevelTodos = todos.topLevelTodos.filter((todoId) => todoId !== id);

        await fs.writeFile(dataPath, JSON.stringify(todos, null, 2));

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

// FIXME: hack to get the next ID
const getId = async (): Promise<string> => {
    const idPath = path.join(__dirname, '..', 'id.json');
    let idData;

    try {
        idData = await fs.readFile(idPath, 'utf-8');
    } catch (error) {
        if ((error as { code: string }).code === 'ENOENT') {
            idData = JSON.stringify({ id: '0000' });
            await fs.writeFile(idPath, idData);
        } else {
            throw error;
        }
    }

    const idJson = JSON.parse(idData);
    const newId = (parseInt(idJson.id, 10) + 1).toString().padStart(4, '0');
    idJson.id = newId;

    await fs.writeFile(idPath, JSON.stringify(idJson, null, 2));

    return newId;
};

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const parentId = (await params).id;
        const id = await getId();

        if (!parentId) {
            return new Response(JSON.stringify({ error: 'ID is required' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const dataPath = path.join(__dirname, '..', 'data.json');
        const payload = await request.json();
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos: Todos = JSON.parse(data);

        let topLevelTodos = [...todos.topLevelTodos];

        if (!parentId && topLevelTodos.includes(id)) {
            topLevelTodos = topLevelTodos.filter((item) => item !== id);
        }

        delete payload.id;

        const newTodos = {
            ...todos,
            items: {
                ...todos.items,
                [parentId]: {
                    ...todos.items[parentId],
                    subtasks: [id, ...(todos.items[parentId].subtasks || [])],
                    updatedAt: new Date().toISOString(),
                },
                [id]: {
                    ...payload,
                    id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            },
            topLevelTodos,
        };

        await fs.writeFile(
            dataPath,
            JSON.stringify(
                {
                    ...newTodos,
                    timeStamp: new Date().toISOString(),
                    length: (todos?.length || 0) + 1,
                },
                null,
                2
            )
        );

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
        const dataPath = path.join(__dirname, '..', 'data.json');
        const payload = await request.json();
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos: Todos = JSON.parse(data);
        const todo = todos.items[id];
        const { parentId } = payload;

        if (parentId === id) {
            return new Response(JSON.stringify({ error: 'Please input valid ID' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

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

        await fs.writeFile(dataPath, JSON.stringify(newTodos, null, 2));

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
