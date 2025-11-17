import type { PaymentLink, CreatePaymentLinkDto, ProcessPaymentDto, ProcessPaymentWithCardDto, PaymentResult } from '../entities/PaymentLink'

/**
 * Payment Link Repository Interface
 * Defines the contract for payment link data access
 */
export interface PaymentLinkRepository {
  /**
   * Creates a new payment link (returns full entity for internal use)
   * @param data - Payment link creation data
   * @returns Created payment link
   */
  create(data: CreatePaymentLinkDto): Promise<PaymentLink>

  /**
   * Retrieves a payment link by ID
   * @param id - Payment link ID
   * @returns Payment link if found
   */
  getById(id: string): Promise<PaymentLink>

  /**
   * Processes a payment for a payment link (matching API spec)
   * @param data - Payment processing data (only payment_link_id)
   * @returns Payment result
   */
  processPayment(data: ProcessPaymentDto): Promise<PaymentResult>

  /**
   * Processes a payment with card data (frontend validation)
   * @param data - Payment processing data with card info
   * @returns Payment result
   */
  processPaymentWithCard(data: ProcessPaymentWithCardDto): Promise<PaymentResult>
}
