import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

interface SearchInputProps {
    className?: string;
    onSearch?(value: string): void;
}

function SearchInput(props: SearchInputProps) {
    return (
        <div
            className={`relative flex w-[50vw] max-w-md transition duration-300 bg-neutral-50/75 dark:bg-neutral-950/25 rounded-md ${props.className}`}
        >
            <input
                name="search"
                type="search"
                placeholder="Search"
                onChange={(e) => {
                    if (props.onSearch) {
                        props.onSearch((e.target as HTMLInputElement).value);
                    }
                }}
                className="block flex-1 py-2 pr-9 pl-4 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
            />
            <MagnifyingGlassIcon
                aria-hidden="true"
                className="absolute right-2 pointer-events-none size-5 self-center text-gray-400"
            />
        </div>
    );
}

export default SearchInput;
