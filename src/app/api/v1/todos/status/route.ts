import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Todos } from '@/types/Todos';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function GET() {
    try {
        const dataPath = path.join(__dirname, '..', 'data.json');
        const data = await fs.readFile(dataPath, 'utf-8');
        const todos: Todos = JSON.parse(data);

        return new Response(JSON.stringify({
            length: todos.length,
            timeStamp: todos.timeStamp,
        }), {
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

export function OPTIONS() {
    return new Response(null, {
        status: 204,
        headers: {
            'Allow': 'GET, OPTIONS',
            'Content-Type': 'application/json',
        },
    });
}
