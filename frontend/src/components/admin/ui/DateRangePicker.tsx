"use client";

import { CalendarIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useState, useCallback } from "react";

interface DateRange {
    from: string;
    to: string;
}

interface DateRangePickerProps {
    label: string;
    value: DateRange;
    onChange: (value: DateRange) => void;
    className?: string;
}

export default function DateRangePicker({
    label,
    value,
    onChange,
    className = "",
}: DateRangePickerProps) {
    const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, from: e.target.value });
    };

    const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange({ ...value, to: e.target.value });
    };

    const handleClear = useCallback(() => {
        onChange({ from: "", to: "" });
    }, [onChange]);

    return (
        <div className={className}>
            <div className="mb-1.5 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
                {(value.from || value.to) && (
                    <button
                        type="button"
                        onClick={handleClear}
                        className="text-xs text-brand-600 hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300"
                    >
                        Clear
                    </button>
                )}
            </div>

            <div className="flex items-center gap-2">
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        value={value.from}
                        onChange={handleFromChange}
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-600"
                    />
                </div>
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <div className="relative flex-1">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <CalendarIcon className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                        type="date"
                        value={value.to}
                        onChange={handleToChange}
                        className="block w-full rounded-lg border border-gray-300 bg-white py-2 pl-9 pr-3 text-sm text-gray-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:focus:border-brand-600"
                    />
                </div>
            </div>
        </div>
    );
}
