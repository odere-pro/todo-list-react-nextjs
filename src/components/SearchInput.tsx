import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

interface SearchInputProps {
    className?: string;
}

function SearchInput(props: SearchInputProps) {
    return (
        <div className={`relative flex w-xs md:w-md transition duration-300 bg-neutral-950/25 ${props.className}`}>
            <input
                name="search"
                type="search"
                placeholder="Search"
                className="block flex-1 py-2 pr-9 pl-4 text-base text-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <MagnifyingGlassIcon
                aria-hidden="true"
                className="absolute right-2 pointer-events-none size-5 self-center text-gray-400"
            />
        </div>
    );
}

export default SearchInput;
