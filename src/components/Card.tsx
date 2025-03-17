'use client';

import type { TaskType, Task } from '@/types/Task';
import Label from '@/components/Label';
import Checkbox from '@/components/Checkbox';
import Button from '@/components/Button';
import SubtaskTree from '@/components/SubtaskTree';
import { getMinutesAgo } from '@/lib/utils/time';
import Link from 'next/link';
import { useRootStore } from '@/providers/RootStoreProvider';
// import Markdown from 'react-markdown';
// import remarkGfm from 'remark-gfm';
// import rehypeRaw from 'rehype-raw';
// import rehypeSanitize from 'rehype-sanitize';
// import remarkParse from 'remark-parse';
// import remarkRehype from 'remark-rehype';

interface TodoUIConfig {
    label: string;
    emoji: string;
}

const typesConfig: Record<TaskType, TodoUIConfig> = {
    todo: { label: 'Todo', emoji: '✅' },
    'shopping-item': { label: 'Glossaries', emoji: '🛒' },
    task: { label: 'TaskItem', emoji: '🏢' },
    food: { label: 'Food', emoji: '🍏' },
};

export const getLockedClass = (locked: boolean) => {
    return locked && 'pointer-events-none opacity-50';
};

const Card = (props: Task) => {
    const { setCompleteTask } = useRootStore((state) => state);
    const { createdAt, data, title, locked, completed, type, id, totalCost, currency, updatedAt, cost } = props;
    const emoji = typesConfig[type].emoji;
    const taskLabel = typesConfig[type].label;
    const time = updatedAt || createdAt;
    const minutesAgo = time && getMinutesAgo(time);
    const hoverClass =
        'hover:text-indigo-600 dark:hover:text-indigo-600 focus:text-indigo-600 dark:focus:text-indigo-600 transition duration-300';

    const editTodo = () => {
        window.location.href = `/todos/${id}?edit=true`;
    };

    return (
        <div className={`flex flex-col w-full ${getLockedClass(locked)}`}>
            <Link
                className={`flex justify-between items-center gap-4 border-b-4 text-neutral-900 dark:text-neutral-100 border-neutral-400 dark:border-neutral-500 outline-none ${hoverClass}`}
                href={`/todos/${id}`}
                tabIndex={locked ? -1 : 0}
            >
                <h2 className="text-md truncate flex-1">
                    <span className="mr-2">
                        {emoji} <strong>#{id}</strong>
                    </span>
                    {title}
                </h2>

                {locked && (
                    <Label type="danger">
                        <span className="text-xs/5">Locked</span>
                    </Label>
                )}
            </Link>

            <div className="flex flex-col items-start gap-4 max-w-4xl p-4 bg-neutral-200 dark:bg-neutral-700 rounded-bl-lg rounded-br-lg">
                <div className="flex justify-between items-start gap-2 w-full">
                    <Checkbox
                        checked={completed}
                        label="Completed"
                        id={id}
                        onChange={(value) => {
                            setCompleteTask(id, value);
                        }}
                    />
                    <div className="flex flex-wrap gap-2">
                        <Button type="button" onClick={editTodo} title="Edit" />
                    </div>
                </div>

                <div className="flex items-start gap-2 flex-wrap w-full">
                    <Label value={taskLabel} type="info">
                        type: {taskLabel}
                    </Label>

                    {Object.entries(data).map(([key, value]) => (
                        <Label key={key} value={value} type="info">
                            {key.toLocaleLowerCase()}: {value}
                        </Label>
                    ))}
                </div>

                <SubtaskTree subtasks={props.subtasks || []} className="w-full" />
            </div>

            <div className={`flex justify-between items-center gap-4`}>
                <div className="flex gap-2">
                    <Label value={taskLabel} type="empty">
                        <span className="text-xs/5 text-gray-500 dark:text-neutral-400">
                            Cost: {cost} {currency}
                        </span>
                    </Label>

                    {totalCost !== cost && (
                        <>
                            <span className="text-xs/5 text-gray-500 dark:text-neutral-400">|</span>
                            <Label value={taskLabel} type="empty">
                                <span className="text-xs/5 text-gray-500 dark:text-neutral-400">
                                    Total cost: {totalCost} {currency}
                                </span>
                            </Label>
                        </>
                    )}
                </div>
                {minutesAgo && (
                    <Label type="empty">
                        <time className="text-xs/5 text-gray-500 dark:text-neutral-400" dateTime={createdAt}>
                            Updated {minutesAgo} min ago
                        </time>
                    </Label>
                )}
            </div>
        </div>
    );
};

export default Card;
