import Card from '@/components/Card';
import type { Todos } from '@/types/Todos';
import { headers } from 'next/headers';
import { notFound, redirect } from 'next/navigation';
import { rootStore } from '@/stores/rootStore';

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

    if (card.subtasks?.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg text-neutral-500 dark:text-neutral-400">Please add first item</p>
            </div>
        );
    }

    return (
        <ul role="list" className="w-full flex flex-col gap-4">
            {card.subtasks?.map((id) => (
                <li key={id}>
                    <Card {...data.items[id]} />
                </li>
            ))}
        </ul>
    );
};

export default TodoPage;
