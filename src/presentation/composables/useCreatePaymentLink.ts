import { ref, readonly } from 'vue'
import type { PaymentLink, CreatePaymentLinkDto } from '@/domain/entities/PaymentLink'
import { CreatePaymentLink } from '@/domain/use-cases/CreatePaymentLink'
import { PaymentLinkRepositoryImpl } from '@/infrastructure/repositories/PaymentLinkRepositoryImpl'

/**
 * Composable for creating payment links
 * @returns Object with state and functions for creating payment links
 */
export function useCreatePaymentLink() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const paymentLink = ref<PaymentLink | null>(null)

  const repository = new PaymentLinkRepositoryImpl()
  const createPaymentLinkUseCase = new CreatePaymentLink(repository)

  /**
   * Creates a new payment link
   * @param data - Payment link creation data
   */
  const createLink = async (data: CreatePaymentLinkDto) => {
    loading.value = true
    error.value = null
    paymentLink.value = null

    try {
      const result = await createPaymentLinkUseCase.execute(data)
      paymentLink.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al crear el link de pago'
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
    paymentLink: readonly(paymentLink),
    createLink,
    reset
  }
}
