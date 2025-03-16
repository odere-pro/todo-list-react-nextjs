'use client';

import type { TaskType, Task } from '@/types/Task';
import Label from '@/components/Label';
import { getMinutesAgo } from '@/lib/utils/time';
import Link from 'next/link';

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

export const getBorderClass = (locked: boolean) => {
    const config: Record<string, string> = {
        default: 'border-neutral-400 dark:border-neutral-500 rounded-bl-lg rounded-br-lg border-t-4',
        danger: 'border-red-500 rounded-bl-lg rounded-br-lg border-t-4',
    };

    return locked ? config.danger : config.default;
};

export const getLockedClass = (locked: boolean) => {
    return locked && 'pointer-events-none opacity-50';
};

interface CardProps extends Task {
    children?: React.ReactNode;
}

const Card = ({ createdAt, data, title, locked, completed, type, id, totalCost, currency, updatedAt }: CardProps) => {
    const emoji = typesConfig[type].emoji;
    const taskLabel = typesConfig[type].label;
    const time = updatedAt || createdAt;
    const minutesAgo = time && getMinutesAgo(time);

    return (
        <div className={`flex flex-col w-full ${getLockedClass(locked)}`}>
            <Link className="flex justify-between items-center gap-4" href={`/todos/${id}`} tabIndex={locked ? -1 : 0}>
                <h3 className="text-md truncate text-neutral-900 dark:text-neutral-100 flex-1 border-cyan-500">
                    <span className="mr-2">
                        {emoji} <strong>#{id}</strong>
                    </span>
                    {title}
                </h3>

                {locked && (
                    <Label type="danger">
                        <span className="text-xs/5">Locked</span>
                    </Label>
                )}
            </Link>

            <div className={`gap-4 max-w-4xl p-4 bg-neutral-200 dark:bg-neutral-700 ${getBorderClass(locked)}`}>
                <div className="flex flex-wrap gap-2">
                    <Label value={taskLabel} type="info">
                        type: {taskLabel}
                    </Label>

                    {Object.entries(data).map(([key, value]) => (
                        <Label key={key} value={value} type="info">
                            {key.toLocaleLowerCase()}: {value}
                        </Label>
                    ))}

                    {completed && <Label value="Completed" type="success" />}
                </div>
                <div></div>
            </div>

            <div className={`flex justify-between items-center gap-4`}>
                <div>
                    {totalCost && (
                        <Label value={taskLabel} type="empty">
                            <span className="text-xs/5 text-gray-500 dark:text-neutral-400">
                                Total cost: {totalCost} {currency}
                            </span>
                        </Label>
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
