import TodosList from '@/components/TodosList';
import TodoForm from '@/components/TodoForm';
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
            <TodoForm>
                <TodosList />
            </TodoForm>
        </Suspense>
    );
};

export default TodosPage;
