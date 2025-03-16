import type { Todos } from '@/types/Todos';

interface RootStore extends Todos {
    backHref?: string;
    backTitle?: string;
}

export const rootStore: RootStore = {
    items: {},
    composition: [],
};
