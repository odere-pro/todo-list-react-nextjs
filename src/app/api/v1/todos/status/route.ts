import { readTodos } from '@/lib/utils/serverHelpers';

export async function GET() {
    try {
        const todos = await readTodos();

        return new Response(
            JSON.stringify({
                length: todos.length,
                timeStamp: todos.timeStamp,
            }),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' },
            }
        );
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
            Allow: 'GET, OPTIONS',
            'Content-Type': 'application/json',
        },
    });
}
