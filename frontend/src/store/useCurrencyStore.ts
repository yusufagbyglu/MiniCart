import { create } from "zustand";

interface CurrencyStore {
    current: string;
    symbol: string;
    rate: number;
    setCurrency: (code: string) => void;
}

export const useCurrencyStore = create<CurrencyStore>((set) => ({
    current: "USD",
    symbol: "$",
    rate: 1.0,
    setCurrency: (code) => set({ current: code }),
}));
