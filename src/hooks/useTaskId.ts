import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useRootStore } from '@/providers/RootStoreProvider';

const useTaskId = () => {
    const pathname = usePathname();
    const { items } = useRootStore((state) => state);
    const [id, setId] = useState('');

    useEffect(() => {
        const match = pathname.match(/\/todos\/(\d+)/);

        setId(match ? match[1] : '');
    }, [items, pathname]);

    return { id };
};

export default useTaskId;
