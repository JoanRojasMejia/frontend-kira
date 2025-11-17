import { ref, readonly } from 'vue'
import type { ProcessPaymentWithCardDto, PaymentResult } from '@/domain/entities/PaymentLink'
import { ProcessPayment } from '@/domain/use-cases/ProcessPayment'
import { PaymentLinkRepositoryImpl } from '@/infrastructure/repositories/PaymentLinkRepositoryImpl'

/**
 * Composable for processing payments
 * @returns Object with state and functions for processing payments
 */
export function usePayment() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const paymentResult = ref<PaymentResult | null>(null)

  const repository = new PaymentLinkRepositoryImpl()
  const processPaymentUseCase = new ProcessPayment(repository)

  /**
   * Processes a payment with card data
   * @param data - Payment processing data with card info
   */
  const processPayment = async (data: ProcessPaymentWithCardDto) => {
    loading.value = true
    error.value = null
    paymentResult.value = null

    try {
      const result = await processPaymentUseCase.execute(data)

      // Check if result is an error response
      if (result.status === 'error' || result.status === 'failed') {
        error.value = result.error_message || 'Error al procesar el pago'
      }

      paymentResult.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al procesar el pago'
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
    paymentResult.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    paymentResult: readonly(paymentResult),
    processPayment,
    reset
  }
}
