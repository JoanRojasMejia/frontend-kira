import type { PaymentLinkRepository } from '../repositories/PaymentLinkRepository'
import type { ProcessPaymentWithCardDto, PaymentResult } from '../entities/PaymentLink'

/**
 * Use Case: Process Payment
 * Handles the business logic for processing a payment with card data
 */
export class ProcessPayment {
  constructor(private repository: PaymentLinkRepository) {}

  /**
   * Executes the use case to process a payment with card data
   * This includes frontend validation before calling the API
   * @param data - Payment processing data with card info
   * @returns Payment result
   * @throws Error if validation fails
   */
  async execute(data: ProcessPaymentWithCardDto): Promise<PaymentResult> {
    // Validate payment link ID
    if (!data.payment_link_id || data.payment_link_id.trim().length === 0) {
      throw new Error('Payment link ID is required')
    }

    // Validate card token
    if (!data.card_token || data.card_token.trim().length === 0) {
      throw new Error('Card token is required')
    }

    // Validate terms acceptance
    if (!data.accept_terms) {
      throw new Error('You must accept the terms and conditions')
    }

    // Process payment through repository (with card validation)
    return await this.repository.processPaymentWithCard(data)
  }
}
