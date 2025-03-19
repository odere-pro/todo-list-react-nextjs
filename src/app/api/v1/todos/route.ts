import { readTodos, writeTodos, generateId } from '@/lib/utils/serverHelpers';

export async function GET() {
    try {
        const todos = await readTodos();

        return new Response(JSON.stringify(todos), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                message: 'Failed to read all tasks',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export async function DELETE() {
    try {
        await writeTodos();

        return new Response(JSON.stringify({ message: 'Deleted successfully' }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(
            JSON.stringify({
                message: 'Failed to delete all tasks',
            }),
            {
                status: 500,
                headers: { 'Content-Type': 'application/json' },
            }
        );
    }
}

export async function POST(request: Request) {
    try {
        const id = await generateId();
        const todos = await readTodos();
        const payload = await request.json();

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
                    ...payload,
                    id,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                },
            },
            topLevelTodos: [id, ...topLevelTodos],
        };

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
                message: 'Failed to create new task',
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
            Allow: 'GET, POST, DELETE, OPTIONS',
            'Content-Type': 'application/json',
        },
    });
}
