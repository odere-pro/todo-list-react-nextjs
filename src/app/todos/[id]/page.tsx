import TodosList from '@/components/TodosList';
import { Suspense } from 'react';

const TodoPage = async (props: { params: { id: string }; searchParams: { edit: string } }) => {
    const { id } = await props.params;
    const searchQuery = await props.searchParams;
    const isEditMode = Object.keys(searchQuery).includes('edit');

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center h-[100vh]">
                    <span>Loading...</span>
                </div>
            }
        >
            {isEditMode ? <p>Edit</p> : <TodosList id={id} />}
        </Suspense>
    );
};

export default TodoPage;
