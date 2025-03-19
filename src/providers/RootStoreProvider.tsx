'use client';

import { type ReactNode, createContext, useRef, useContext, useEffect, Suspense } from 'react';
import { useStore } from 'zustand';

import { type RootStore, createRootStore } from '@/stores/rootStore';
import useTodosApi from '@/hooks/useTodosApi';

export type RootStoreApi = ReturnType<typeof createRootStore>;

export const RootStoreContext = createContext<RootStoreApi | undefined>(undefined);

export interface RootStoreProviderProps {
    children: ReactNode;
}

export const RootStoreProvider = ({ children }: RootStoreProviderProps) => {
    const storeRef = useRef<RootStoreApi | null>(null);
    const { loading, fetchAll } = useTodosApi();

    if (storeRef.current === null) {
        storeRef.current = createRootStore();
    }

    useEffect(() => {
        const fetchTodos = async () => {
            const todos = await fetchAll();
            if (todos) {
                storeRef.current?.setState(todos);
                console.log(todos)
            }
        };

        fetchTodos();
        // TODO: implement exponential backoff strategy 
        const intervalId = setInterval(fetchTodos, 2000);

        return () => clearInterval(intervalId);
    }, [fetchAll]);

    useEffect(() => {
        storeRef.current?.setState({ loading });
    }, [loading]);

    return (
        <RootStoreContext.Provider value={storeRef.current}>
            <Suspense
                fallback={
                    <div className="flex items-center justify-center h-[100vh]">
                        <span>Loading...</span>
                    </div>
                }
            >
                <div>{children}</div>
            </Suspense>
        </RootStoreContext.Provider>
    );
};

export const useRootStore = <T,>(selector: (store: RootStore) => T): T => {
    const counterStoreContext = useContext(RootStoreContext);

    if (!counterStoreContext) {
        throw new Error(`useRootStore must be used within RootStoreProvider`);
    }

    return useStore(counterStoreContext, selector);
};
