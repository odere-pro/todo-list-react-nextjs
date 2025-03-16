import Card from '@/components/Card';
import Toolbar from '@/components/Toolbar';
import type { Todos } from '@/types/Todos';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { rootStore } from '@/store/rootStore';

const TodoPage = async ({ params }: { params: { id: string } }) => {
    const { id } = await params;
    const headersList = await headers();
    const referer = headersList.get('referer');
    let data: Todos = rootStore;

    if (referer) {
        const url = new URL(referer);
        const res = await fetch(`${url.origin}/api/v1/todos`);
        data = await res.json();
    }

    const card = data.items[id];

    if (!card) {
        notFound();
    }

    const title = card.parentId ? data.items[card.parentId].title : undefined;
    const backHref = card.parentId ? `/todos/${card.parentId}` : undefined;

    return (
        <>
            <Toolbar title={title} backHref={backHref}>
                <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Add task
                </button>
            </Toolbar>
            <Card {...data.items[id]} />
        </>
    );
};

export default TodoPage;
