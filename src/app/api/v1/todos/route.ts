import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Todos } from '@/types/Todos';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function GET() {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos: Todos = JSON.parse(data);

        return new Response(JSON.stringify(todos), {
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

export async function DELETE() {
    try {
        const dataPath = path.join(__dirname, 'data.json');

        await fs.writeFile(dataPath, JSON.stringify({
            items: {},
            topLevelTodos: [],
        }, null, 2));

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
    const idPath = path.join(__dirname, 'id.json');
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

export async function POST(request: Request) {
    try {
        const id = await getId();
        const dataPath = path.join(__dirname, 'data.json');
        const payload = await request.json();
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos: Todos = JSON.parse(data);

        let topLevelTodos = [...todos.topLevelTodos];
        const { parentId } = payload;

        if (!parentId && topLevelTodos.includes(id)) {
            topLevelTodos = topLevelTodos.filter((item) => item !== id);
        }

        delete payload.id;

        const newTodos = {
            ...todos,
            items: {
                ...todos.items,
                [id]: {
                    ...todos.items[id],
                    ...payload,
                    id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            },
            topLevelTodos: [id, ...topLevelTodos],
        };

        await fs.writeFile(dataPath, JSON.stringify({
            ...newTodos,
            timeStamp: new Date().toISOString(),
            length: (todos?.length || 0) + 1,
        }, null, 2));

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

export function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Allow': 'GET, POST, DELETE, OPTIONS',
            'Content-Type': 'application/json',
        },
    });
}
