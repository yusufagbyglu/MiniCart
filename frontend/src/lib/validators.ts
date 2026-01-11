export const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const required = (value: any) => {
    return value !== undefined && value !== null && value !== "";
};
