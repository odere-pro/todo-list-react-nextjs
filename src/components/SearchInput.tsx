import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

function SearchInput() {
    return (
        <div className="grid w-full max-w-lg grid-cols-1 lg:max-w-xs">
            <input
                name="search"
                type="search"
                placeholder="Search"
                className="col-start-1 row-start-1 block w-full rounded-md bg-white py-1.5 pr-3 pl-10 text-base text-gray-300 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
            />
            <MagnifyingGlassIcon
                aria-hidden="true"
                className="pointer-events-none col-start-1 row-start-1 ml-3 size-5 self-center text-gray-400"
            />
        </div>
    );
}

export default SearchInput;
