import Card from '@/components/Card';
import type { Todos } from '@/types/Todos';
import { headers } from 'next/headers';

const TodosPage = async () => {
    const headersList = await headers();
    const referer = headersList.get('referer');

    let data: Todos = { items: {}, composition: [] };

    if (referer) {
        const url = new URL(referer);
        const res = await fetch(`${url.origin}/api/v1/todos`);
        data = await res.json();
    }

    if (data.composition.length === 0) {
        return (
            <div className="flex items-center justify-center h-full">
                <p className="text-lg text-neutral-500 dark:text-neutral-400">Please add first item</p>
            </div>
        );
    }

    return (
        <ul role="list" className="w-full flex flex-col gap-4">
            {data &&
                data.composition.map(
                    (id) =>
                        !data.items[id].parentId && (
                            <li key={id}>
                                <Card {...data.items[id]} />
                            </li>
                        )
                )}
        </ul>
    );
};

export default TodosPage;
