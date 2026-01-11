const currencySymbols: Record<string, string> = {
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  CNY: "¥",
  INR: "₹",
  TRY: "₺",
}

export function formatPrice(amount: number, currency = "USD", locale = "en-US"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
}

export function getCurrencySymbol(currency: string): string {
  return currencySymbols[currency] || currency
}

export function formatCompactPrice(amount: number, currency = "USD"): string {
  if (amount >= 1000000) {
    return `${getCurrencySymbol(currency)}${(amount / 1000000).toFixed(1)}M`
  }
  if (amount >= 1000) {
    return `${getCurrencySymbol(currency)}${(amount / 1000).toFixed(1)}K`
  }
  return formatPrice(amount, currency)
}
