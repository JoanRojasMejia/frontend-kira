/**
 * Formatters utility functions
 * Contains formatting logic for various display values
 */

/**
 * Formats a card number with spaces every 4 digits
 * @param cardNumber - Card number to format
 * @returns Formatted card number
 */
export function formatCardNumber(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s/g, '')
  const chunks = cleanNumber.match(/.{1,4}/g) || []
  return chunks.join(' ')
}

/**
 * Formats expiration date as MM/YY
 * @param input - Input string (can be MMYY or partial)
 * @returns Formatted expiration date
 */
export function formatExpirationDate(input: string): string {
  const cleanInput = input.replace(/\D/g, '')

  if (cleanInput.length >= 2) {
    return cleanInput.slice(0, 2) + (cleanInput.length > 2 ? '/' + cleanInput.slice(2, 4) : '')
  }

  return cleanInput
}

/**
 * Formats an amount with currency symbol
 * @param amount - Amount to format
 * @param currency - Currency code (USD, MXN, etc.)
 * @returns Formatted amount string
 */
export function formatAmount(amount: number, currency: string = 'USD'): string {
  const symbols: Record<string, string> = {
    USD: '$',
    MXN: '$'
  }

  const symbol = symbols[currency] || currency

  return `${symbol}${amount.toFixed(2)}`
}

/**
 * Formats a date to a readable string
 * @param dateString - ISO date string
 * @returns Formatted date string
 */
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-MX', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

/**
 * Calculates time remaining until expiration
 * @param expiresAt - Expiration date string
 * @returns Human-readable time remaining
 */
export function formatTimeRemaining(expiresAt: string | null): string {
  if (!expiresAt) {
    return 'Sin expiración'
  }

  const expirationDate = new Date(expiresAt)
  const now = new Date()
  const diff = expirationDate.getTime() - now.getTime()

  if (diff <= 0) {
    return 'Expirado'
  }

  const hours = Math.floor(diff / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s restantes`
  }

  if (minutes > 0) {
    return `${minutes}m ${seconds}s restantes`
  }

  return `${seconds}s restantes`
}

/**
 * Masks a card number showing only last 4 digits
 * @param cardNumber - Full card number
 * @returns Masked card number
 */
export function maskCardNumber(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s/g, '')
  const last4 = cleanNumber.slice(-4)
  return `•••• •••• •••• ${last4}`
}

/**
 * Converts USD to MXN using mock exchange rate
 * @param amountUsd - Amount in USD
 * @param exchangeRate - Exchange rate (default 17.5-18)
 * @returns Amount in MXN
 */
export function convertUsdToMxn(amountUsd: number, exchangeRate: number = 17.75): number {
  return Number((amountUsd * exchangeRate).toFixed(2))
}
