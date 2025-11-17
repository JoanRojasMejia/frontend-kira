import type { PaymentLinkRepository } from '../repositories/PaymentLinkRepository'
import type { PaymentLink } from '../entities/PaymentLink'

/**
 * Use Case: Get Payment Link By ID
 * Handles the business logic for retrieving a payment link
 */
export class GetPaymentLinkById {
  constructor(private repository: PaymentLinkRepository) {}

  /**
   * Executes the use case to get a payment link by ID
   * @param id - Payment link ID
   * @returns Payment link if found
   * @throws Error if ID is invalid or link not found
   */
  async execute(id: string): Promise<PaymentLink> {
    // Validate ID
    if (!id || id.trim().length === 0) {
      throw new Error('Payment link ID is required')
    }

    // Get payment link through repository
    return await this.repository.getById(id)
  }
}
