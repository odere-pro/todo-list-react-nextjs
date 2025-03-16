import Card from '@/components/Card';
import Toolbar from '@/components/Toolbar';
import type { Todos } from '@/types/Todos';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { rootStore } from '@/store/rootStore';

const TodoPage = async (props: { params: { id: string } }) => {
    const { id } = await props.params;
    const headersList = await headers();
    const referer = headersList.get('referer');
    let data: Todos = rootStore;

    if (referer) {
        const url = new URL(referer);
        const res = await fetch(`${url.origin}/api/v1/todos`);
        data = await res.json();
    }

    const card = data?.items[id];

    if (!card) {
        notFound();
    }

    const noSubtasks = !card.subtasks || card.subtasks?.length === 0;
    if (noSubtasks) {
        redirect(`/todos/${id}/edit`);
    }
    const backHref = !card.parentId ? '/todos' : `/todos/${card.parentId}`;
    const title = !card.parentId ? 'Todos' : data?.items[card.parentId].title;

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

            <ul role="list" className="w-full flex flex-col gap-4">
                {card.subtasks?.map((id) => (
                    <li key={id}>
                        <Card {...data.items[id]} />
                    </li>
                ))}
            </ul>
        </>
    );
};

export default TodoPage;
