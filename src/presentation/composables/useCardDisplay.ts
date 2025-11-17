import { computed } from 'vue'

/**
 * Card display masks for different card types
 */
const CARD_MASKS = {
  amex: '#### ###### #####',
  other: '#### #### #### ####'
}

/**
 * Composable for credit card display logic
 * Handles card masks, month/year extraction, and visual formatting
 */
export function useCardDisplay(_: string, cardBrand: string, expirationDate: string) {
  /**
   * Get card number mask based on card brand
   */
  const cardMask = computed(() => {
    return cardBrand === 'amex' ? CARD_MASKS.amex : CARD_MASKS.other
  })

  /**
   * Get card mask as array for iteration
   */
  const cardMaskArray = computed(() => {
    return cardMask.value.split('')
  })

  /**
   * Get Amex card mask array
   */
  const amexCardMask = computed(() => {
    return CARD_MASKS.amex.split('')
  })

  /**
   * Get other cards mask array
   */
  const otherCardMask = computed(() => {
    return CARD_MASKS.other.split('')
  })

  /**
   * Extract month from expiration date (MM/YY format)
   */
  const cardMonth = computed(() => {
    if (!expirationDate || expirationDate.length < 2) {
      return ''
    }
    return expirationDate.substring(0, 2)
  })

  /**
   * Extract year from expiration date (MM/YY format)
   */
  const cardYear = computed(() => {
    if (!expirationDate || expirationDate.length < 5) {
      return ''
    }
    // Convert YY to full year (20YY)
    const yy = expirationDate.substring(3, 5)
    return `20${yy}`
  })

  /**
   * Get minimum card month based on current year
   */
  const minCardMonth = computed(() => {
    const currentYear = new Date().getFullYear()
    const selectedYear = cardYear.value ? parseInt(cardYear.value) : currentYear

    if (selectedYear === currentYear) {
      return new Date().getMonth() + 1
    }
    return 1
  })

  /**
   * Get minimum card year
   */
  const minCardYear = computed(() => {
    return new Date().getFullYear()
  })

  /**
   * Get random card background (1-25)
   */
  const getRandomBackground = (): number => {
    return Math.floor(Math.random() * 25 + 1)
  }

  /**
   * Map card brand to image name
   */
  const getCardTypeImage = computed(() => {
    const brandMap: Record<string, string> = {
      visa: 'visa',
      mastercard: 'mastercard',
      amex: 'amex',
      discover: 'discover',
      unknown: 'visa' // default
    }
    return brandMap[cardBrand] || 'visa'
  })

  return {
    // Computed
    cardMask,
    cardMaskArray,
    amexCardMask,
    otherCardMask,
    cardMonth,
    cardYear,
    minCardMonth,
    minCardYear,
    getCardTypeImage,

    // Methods
    getRandomBackground
  }
}
