import TodosList from '@/components/TodosList';
import { Suspense } from 'react';
import TodoForm from '@/components/TodoForm';

const TodoPage = async (props: { params: { id: string }; searchParams: { edit: string } }) => {
    const { id } = await props.params;

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-[100vh]">
                    <span>Loading...</span>
                </div>
            }
        >
            <TodoForm id={id}>
                <TodosList id={id} />
            </TodoForm>
        </Suspense>
    );
};

export default TodoPage;
