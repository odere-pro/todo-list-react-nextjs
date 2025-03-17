import TodosList from '@/components/TodosList';
import { Suspense } from 'react';

const TodosPage = async () => {
    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center flex-1">
                    <span>Loading...</span>
                </div>
            }
        >
            <TodosList />
        </Suspense>
    );
};

export default TodosPage;
