import Card from '@/components/Card';
import Toolbar from '@/components/Toolbar';
import type { Todos } from '@/types/Todos';
import { headers } from 'next/headers';
import { rootStore } from '@/store/rootStore';

const TodosPage = async () => {
    const headersList = await headers();
    const referer = headersList.get('referer');
    let data: Todos = rootStore;

    if (referer) {
        const url = new URL(referer);
        const res = await fetch(`${url.origin}/api/v1/todos`);
        data = await res.json();
    }

    return (
        <>
            <Toolbar title="Todo List">
                <button
                    type="button"
                    className="relative inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Add task
                </button>
            </Toolbar>

            {data.composition.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                    <p className="text-lg text-neutral-500 dark:text-neutral-400">Welcome</p>
                    <p className="text-lg text-neutral-500 dark:text-neutral-400">Please add first it</p>
                </div>
            ) : (
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
            )}
        </>
    );
};

export default TodosPage;
