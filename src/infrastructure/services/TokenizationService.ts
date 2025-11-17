import { apiClient, type ApiError } from '../http/apiClient'

/**
 * Card data for tokenization
 */
export interface CardData {
  card_number: string
  card_holder: string
  expiration_date: string
  cvv: string
}

/**
 * Token response
 */
export interface TokenResponse {
  token: string
  card_brand: string
  last4: string
}

/**
 * Tokenization Service
 * Handles card tokenization via API
 */
export class TokenizationService {
  /**
   * Tokenizes a credit card
   * @param cardData - Card information
   * @returns Token response (mocked - always returns same token)
   * @throws Error if tokenization fails
   */
  async tokenize(cardData: CardData): Promise<TokenResponse> {
    // Mock tokenization - always return same hardcoded token
    // Simulating Stripe SDK tokenization
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          token: 'tok_1234567890abcdefghijklmnop',
          card_brand: this.detectCardBrand(cardData.card_number),
          last4: cardData.card_number.slice(-4)
        })
      }, 500) // Simulate network delay
    })
  }

  /**
   * Detects card brand from card number
   * @param cardNumber - Card number
   * @returns Card brand
   */
  private detectCardBrand(cardNumber: string): string {
    const cleaned = cardNumber.replace(/\s/g, '')

    if (cleaned.startsWith('4')) return 'visa'
    if (cleaned.startsWith('5')) return 'mastercard'
    if (cleaned.startsWith('3')) return 'amex'

    return 'unknown'
  }
}
