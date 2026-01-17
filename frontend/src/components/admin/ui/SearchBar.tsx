"use client";

import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useCallback } from "react";

interface SearchBarProps {
    placeholder?: string;
    onSearch: (query: string) => void;
    debounceMs?: number;
    defaultValue?: string;
    className?: string;
}

export default function SearchBar({
    placeholder = "Search...",
    onSearch,
    debounceMs = 500,
    defaultValue = "",
    className = "",
}: SearchBarProps) {
    const [searchValue, setSearchValue] = useState(defaultValue);
    const [isSearching, setIsSearching] = useState(false);

    // Debounced search effect
    useEffect(() => {
        setIsSearching(true);
        const timer = setTimeout(() => {
            onSearch(searchValue);
            setIsSearching(false);
        }, debounceMs);

        return () => {
            clearTimeout(timer);
            setIsSearching(false);
        };
    }, [searchValue, debounceMs, onSearch]);

    const handleClear = useCallback(() => {
        setSearchValue("");
    }, []);

    return (
        <div className={`relative ${className}`}>
            <div className="relative">
                {/* Search Icon */}
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                </div>

                {/* Search Input */}
                <input
                    type="text"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    placeholder={placeholder}
                    className="block w-full rounded-lg border border-gray-300 bg-white py-2.5 pl-10 pr-10 text-sm text-gray-900 placeholder:text-gray-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:border-brand-600 dark:focus:ring-brand-600/20"
                />

                {/* Clear Button or Loading Indicator */}
                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {searchValue && (
                        <>
                            {isSearching ? (
                                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent"></div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
