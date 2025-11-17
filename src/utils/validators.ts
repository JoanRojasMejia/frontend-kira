/**
 * Validators utility functions
 * Contains validation logic for various inputs
 */

/**
 * Validates a credit card number using the Luhn algorithm
 * @param cardNumber - Card number to validate
 * @returns true if valid, false otherwise
 */
export function luhnCheck(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s/g, '')

  if (!/^\d+$/.test(cleanNumber)) {
    return false
  }

  let sum = 0
  let isEven = false

  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i], 10)

    if (isEven) {
      digit *= 2
      if (digit > 9) {
        digit -= 9
      }
    }

    sum += digit
    isEven = !isEven
  }

  return sum % 10 === 0
}

/**
 * Detects card brand from card number
 * @param cardNumber - Card number
 * @returns Card brand (visa, mastercard, amex, unknown)
 */
export function detectCardBrand(cardNumber: string): string {
  const cleanNumber = cardNumber.replace(/\s/g, '')

  if (cleanNumber.startsWith('4')) {
    return 'visa'
  } else if (/^5[1-5]/.test(cleanNumber)) {
    return 'mastercard'
  } else if (/^3[47]/.test(cleanNumber)) {
    return 'amex'
  }

  return 'unknown'
}

/**
 * Validates card number length based on card type
 * @param cardNumber - Card number
 * @returns true if length is valid for the card type
 */
export function isValidCardLength(cardNumber: string): boolean {
  const cleanNumber = cardNumber.replace(/\s/g, '')
  const brand = detectCardBrand(cleanNumber)

  if (brand === 'amex') {
    return cleanNumber.length === 15
  } else if (brand === 'visa' || brand === 'mastercard') {
    return cleanNumber.length === 16
  }

  // For unknown cards, accept 13-19 digits
  return cleanNumber.length >= 13 && cleanNumber.length <= 19
}

/**
 * Validates CVV based on card type
 * @param cvv - CVV code
 * @param cardNumber - Card number to detect type
 * @returns true if CVV is valid for card type
 */
export function isValidCVV(cvv: string, cardNumber: string): boolean {
  const brand = detectCardBrand(cardNumber)

  if (brand === 'amex') {
    return /^\d{4}$/.test(cvv)
  }

  return /^\d{3}$/.test(cvv)
}

/**
 * Validates expiration date format and checks if not expired
 * @param expirationDate - Date in MM/YY format
 * @returns true if valid and not expired
 */
export function isValidExpirationDate(expirationDate: string): boolean {
  const match = expirationDate.match(/^(\d{2})\/(\d{2})$/)

  if (!match) {
    return false
  }

  const month = parseInt(match[1], 10)
  const year = parseInt(match[2], 10)

  if (month < 1 || month > 12) {
    return false
  }

  const currentDate = new Date()
  const currentYear = currentDate.getFullYear() % 100
  const currentMonth = currentDate.getMonth() + 1

  if (year < currentYear) {
    return false
  }

  if (year === currentYear && month < currentMonth) {
    return false
  }

  return true
}

/**
 * Validates card holder name
 * @param name - Card holder name
 * @returns true if valid (only letters and spaces, min 3 chars)
 */
export function isValidCardHolder(name: string): boolean {
  const trimmed = name.trim()
  return /^[a-zA-Z\s]+$/.test(trimmed) && trimmed.length >= 3
}

/**
 * Validates amount is positive number
 * @param amount - Amount to validate
 * @returns true if amount is positive
 */
export function isValidAmount(amount: number | string): boolean {
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount

  return !isNaN(numAmount) && numAmount > 0
}

/**
 * Validates description minimum length
 * @param description - Description text
 * @param minLength - Minimum length (default 10)
 * @returns true if description meets minimum length
 */
export function isValidDescription(description: string, minLength: number = 10): boolean {
  return description.trim().length >= minLength
}

/**
 * Checks if a date is expired
 * @param dateString - ISO date string
 * @returns true if date is in the past
 */
export function isExpired(dateString: string | null): boolean {
  if (!dateString) {
    return false
  }

  const expirationDate = new Date(dateString)
  const now = new Date()

  return now > expirationDate
}
