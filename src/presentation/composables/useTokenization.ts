import { ref, readonly } from 'vue'
import type { TokenResponse } from '@/infrastructure/services/TokenizationService'
import { TokenizationService } from '@/infrastructure/services/TokenizationService'

/**
 * Composable for card tokenization
 * @returns Object with state and functions for tokenizing cards
 */
export function useTokenization() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const token = ref<TokenResponse | null>(null)

  const tokenizationService = new TokenizationService()

  /**
   * Tokenizes a credit card
   * @param cardData - Card information
   */
  const tokenize = async (cardData: {
    card_number: string
    card_holder: string
    expiration_date: string
    cvv: string
  }) => {
    loading.value = true
    error.value = null
    token.value = null

    try {
      const result = await tokenizationService.tokenize(cardData)
      token.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al tokenizar la tarjeta'
    } finally {
      loading.value = false
    }
  }

  /**
   * Resets the state
   */
  const reset = () => {
    loading.value = false
    error.value = null
    token.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    token: readonly(token),
    tokenize,
    reset
  }
}
