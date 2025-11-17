import type {
  PaymentLink,
  PaymentLinkRaw,
  CreatePaymentLinkDto,
  CreatePaymentLinkResponseDto,
  ProcessPaymentDto,
  ProcessPaymentWithCardDto,
  PaymentResult
} from '@/domain/entities/PaymentLink'
import { apiClient, type ApiError } from '../http/apiClient'

/**
 * Normalizes payment link data from API to ensure correct types
 * Converts string numbers to actual numbers
 */
function normalizePaymentLink(data: PaymentLinkRaw): PaymentLink {
  return {
    ...data,
    amount_usd: parseFloat(data.amount_usd) // Convert string to number
  }
}

/**
 * Payment Link Service
 * Handles API calls to payment link backend
 */
export class PaymentLinkService {
  /**
   * Creates a new payment link
   * @param data - Payment link creation data
   * @returns Created payment link response (matching API spec)
   */
  async create(data: CreatePaymentLinkDto): Promise<CreatePaymentLinkResponseDto> {
    try {
      const response = await apiClient.post<CreatePaymentLinkResponseDto>('/payment-links', data)
      return response
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create payment link')
    }
  }

  /**
   * Creates a new payment link and returns full entity (for internal use)
   * @param data - Payment link creation data
   * @returns Full payment link entity
   */
  async createFull(data: CreatePaymentLinkDto): Promise<PaymentLink> {
    try {
      const response = await apiClient.post<PaymentLinkRaw>('/payment-links', data)
      return normalizePaymentLink(response)
    } catch (error) {
      const apiError = error as ApiError
      throw new Error(apiError.message || 'Failed to create payment link')
    }
  }

  /**
   * Gets a payment link by ID
   * @param id - Payment link ID
   * @returns Payment link
   * @throws Error if not found
   */
  async getById(id: string): Promise<PaymentLink> {
    try {
      const response = await apiClient.get<PaymentLinkRaw>(`/payment-links/${id}`)
      return normalizePaymentLink(response)
    } catch (error) {
      const apiError = error as ApiError
      if (apiError.status === 404) {
        throw new Error('Payment link not found')
      }
      throw new Error(apiError.message || 'Failed to fetch payment link')
    }
  }

  /**
   * Processes a payment (matching API spec)
   * @param data - Payment processing data (payment_link_id and payment_token as per API spec)
   * @returns Payment result (success or error)
   */
  async processPayment(data: ProcessPaymentDto): Promise<PaymentResult> {
    try {
      const response = await apiClient.post<PaymentResult>('/payment-links/pay', data)
      return response
    } catch (error) {
      const apiError = error as ApiError
      // Return error in the expected format
      return {
        status: 'error',
        error_message: apiError.message || 'Failed to process payment',
        transaction_id: 'error_' + Date.now()
      }
    }
  }

  /**
   * Processes a payment with card data (internal use before calling API)
   * This validates card token and terms before calling the actual API
   * @param data - Payment processing data with card info
   * @returns Payment result
   */
  async processPaymentWithCard(data: ProcessPaymentWithCardDto): Promise<PaymentResult> {
    // Validate card token and terms (frontend validation)
    if (!data.card_token || data.card_token.trim().length === 0) {
      return {
        status: 'error',
        error_message: 'Card token is required',
        transaction_id: 'validation_error_' + Date.now()
      }
    }

    if (!data.accept_terms) {
      return {
        status: 'error',
        error_message: 'You must accept the terms and conditions',
        transaction_id: 'validation_error_' + Date.now()
      }
    }

    // Call the API with payment_link_id and payment_token
    return this.processPayment({
      payment_link_id: data.payment_link_id,
      payment_token: data.card_token
    })
  }
}
