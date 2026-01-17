"use client";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";

export interface FilterOption {
    label: string;
    value: string | number;
}

interface FilterDropdownProps {
    label: string;
    options: FilterOption[];
    value: string | number | null;
    onChange: (value: string | number | null) => void;
    placeholder?: string;
    className?: string;
}

export default function FilterDropdown({
    label,
    options,
    value,
    onChange,
    placeholder = "All",
    className = "",
}: FilterDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedOption = options.find((opt) => opt.value === value);

    const handleSelect = (optionValue: string | number | null) => {
        onChange(optionValue);
        setIsOpen(false);
    };

    return (
        <div ref={dropdownRef} className={`relative ${className}`}>
            <label className="mb-1.5 block text-sm font-medium text-gray-700 dark:text-gray-300">
                {label}
            </label>

            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="flex w-full items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm text-gray-900 hover:bg-gray-50 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:hover:bg-gray-800 dark:focus:border-brand-600"
            >
                <span className={selectedOption ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"}>
                    {selectedOption?.label || placeholder}
                </span>
                <ChevronDownIcon
                    className={`ml-2 h-5 w-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                />
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <ul className="max-h-60 overflow-auto rounded-lg py-1">
                        {/* "All" option to clear filter */}
                        <li>
                            <button
                                type="button"
                                onClick={() => handleSelect(null)}
                                className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${value === null
                                        ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                                        : "text-gray-700 dark:text-gray-300"
                                    }`}
                            >
                                {placeholder}
                            </button>
                        </li>

                        {/* Options */}
                        {options.map((option) => (
                            <li key={option.value}>
                                <button
                                    type="button"
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-800 ${value === option.value
                                            ? "bg-brand-50 text-brand-600 dark:bg-brand-900/20 dark:text-brand-400"
                                            : "text-gray-700 dark:text-gray-300"
                                        }`}
                                >
                                    {option.label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
