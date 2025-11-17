import { ref, readonly } from 'vue'
import type { PaymentLink } from '@/domain/entities/PaymentLink'
import { GetPaymentLinkById } from '@/domain/use-cases/GetPaymentLinkById'
import { PaymentLinkRepositoryImpl } from '@/infrastructure/repositories/PaymentLinkRepositoryImpl'

/**
 * Composable for fetching payment links
 * @returns Object with state and functions for fetching payment links
 */
export function usePaymentLink() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const paymentLink = ref<PaymentLink | null>(null)

  const repository = new PaymentLinkRepositoryImpl()
  const getPaymentLinkUseCase = new GetPaymentLinkById(repository)

  /**
   * Fetches a payment link by ID
   * @param id - Payment link ID
   */
  const fetchPaymentLink = async (id: string) => {
    loading.value = true
    error.value = null
    paymentLink.value = null

    try {
      const result = await getPaymentLinkUseCase.execute(id)
      paymentLink.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener el link de pago'
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
    paymentLink.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    paymentLink: paymentLink,
    fetchPaymentLink,
    reset
  }
}
