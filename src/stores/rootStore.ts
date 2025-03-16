import type { Todos } from '@/types/Todos';
import { createStore } from 'zustand/vanilla';
type RootState = Todos

export type RootActions = {
    update: (data: Todos) => void;
};

export type RootStore = RootState & RootActions;

export const defaultInitState: RootState = {
    items: {},
    composition: [],
};

export const createRootStore = (initState: RootState = defaultInitState) => {
    return createStore<RootStore>()((set) => ({
        ...initState,
        update: (data: Todos) => set(() => ({ items: data.items, composition: data.composition })),
    }));
};

export const rootStore = {
    items: {},
    composition: [],
};
