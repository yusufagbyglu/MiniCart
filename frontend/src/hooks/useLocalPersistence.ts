import { useEffect } from "react";

export function useLocalPersistence<T>(key: string, value: T, callback: (val: T) => void) {
    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = localStorage.getItem(key);
            if (saved) {
                callback(JSON.parse(saved));
            }
        }
    }, [key, callback]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }, [key, value]);
}
