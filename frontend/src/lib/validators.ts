export const validators = {
  email: (value: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(value)
  },

  password: (value: string): { valid: boolean; message?: string } => {
    if (value.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters" }
    }
    if (!/[A-Z]/.test(value)) {
      return { valid: false, message: "Password must contain at least one uppercase letter" }
    }
    if (!/[a-z]/.test(value)) {
      return { valid: false, message: "Password must contain at least one lowercase letter" }
    }
    if (!/[0-9]/.test(value)) {
      return { valid: false, message: "Password must contain at least one number" }
    }
    return { valid: true }
  },

  phone: (value: string): boolean => {
    const phoneRegex = /^\+?[\d\s-()]{10,}$/
    return phoneRegex.test(value)
  },

  postalCode: (value: string): boolean => {
    return value.length >= 3 && value.length <= 10
  },

  required: (value: string | number | null | undefined): boolean => {
    if (value === null || value === undefined) return false
    if (typeof value === "string") return value.trim().length > 0
    return true
  },

  minLength: (value: string, min: number): boolean => {
    return value.length >= min
  },

  maxLength: (value: string, max: number): boolean => {
    return value.length <= max
  },

  numeric: (value: string): boolean => {
    return /^\d+$/.test(value)
  },

  decimal: (value: string): boolean => {
    return /^\d+(\.\d{1,2})?$/.test(value)
  },
}

export type ValidationRule = {
  validate: (value: unknown) => boolean
  message: string
}

export function validateField(value: unknown, rules: ValidationRule[]): string | null {
  for (const rule of rules) {
    if (!rule.validate(value)) {
      return rule.message
    }
  }
  return null
}
