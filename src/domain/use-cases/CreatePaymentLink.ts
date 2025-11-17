import type { PaymentLinkRepository } from '../repositories/PaymentLinkRepository'
import type { CreatePaymentLinkDto, PaymentLink } from '../entities/PaymentLink'

/**
 * Use Case: Create Payment Link
 * Handles the business logic for creating a new payment link
 */
export class CreatePaymentLink {
  constructor(private repository: PaymentLinkRepository) {}

  /**
   * Executes the use case to create a payment link
   * @param data - Payment link creation data
   * @returns Created payment link
   * @throws Error if validation fails or creation fails
   */
  async execute(data: CreatePaymentLinkDto): Promise<PaymentLink> {
    // Validate merchant ID
    if (!data.merchant_id || data.merchant_id.trim().length === 0) {
      throw new Error('Merchant ID is required')
    }

    // Validate amount
    if (data.amount_usd <= 0) {
      throw new Error('Amount must be greater than 0')
    }

    // Validate description
    if (!data.description || data.description.trim().length < 10) {
      throw new Error('Description must be at least 10 characters')
    }

    // Validate currency_from
    if (!data.currency_from || data.currency_from.length !== 3) {
      throw new Error('Currency from must be a valid 3-letter code')
    }

    // Validate currency_to
    if (!data.currency_to || data.currency_to.length !== 3) {
      throw new Error('Currency to must be a valid 3-letter code')
    }

    // Create payment link through repository
    return await this.repository.create(data)
  }
}
