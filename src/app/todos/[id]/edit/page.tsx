import Card from '@/components/Card';
import type { Todos } from '@/types/Todos';
import { headers } from 'next/headers';
import { notFound } from 'next/navigation';
import { rootStore } from '@/stores/rootStore';

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

    return (
        <Card {...data.items[id]} />
    );
};

export default TodoPage;
