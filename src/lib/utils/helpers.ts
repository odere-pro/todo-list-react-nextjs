// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MemoizedFunction<T extends (...args: any[]) => any> = T & {
    cache: Map<string, ReturnType<T>>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function memoize<T extends (...args: any[]) => any>(
    fn: T,
    hashFunction?: (...args: Parameters<T>) => string
): MemoizedFunction<T> {
    const cache = new Map<string, ReturnType<T>>();

    const memoizedFn = (...args: Parameters<T>): ReturnType<T> => {
        const key = hashFunction ? hashFunction(...args) : JSON.stringify(args);
        if (cache.has(key)) {
            return cache.get(key) as ReturnType<T>;
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
    };

    memoizedFn.cache = cache;
    return memoizedFn as MemoizedFunction<T>;
}
