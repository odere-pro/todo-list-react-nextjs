import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Todos } from '@/types/Todos';
import { getTask } from '@/lib/utils/task';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function GET() {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos: Todos = JSON.parse(data);

        Object.values(todos.items).forEach((task) => {
            Object.assign(todos.items[task.id], getTask(task, todos.items));
        });

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

export async function POST(req: Request) {
    try {
        const dataPath = path.join(__dirname, 'data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos = JSON.parse(data);

        const newTodo = await req.json();
        todos.push(newTodo);

        await fs.writeFile(dataPath, JSON.stringify(todos, null, 2));

        return new Response(JSON.stringify(newTodo), {
            status: 201,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        return new Response(JSON.stringify({ error }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' },
        });
    }
}
