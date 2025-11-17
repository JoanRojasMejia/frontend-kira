import type { PaymentLinkRepository } from '@/domain/repositories/PaymentLinkRepository'
import type { PaymentLink, CreatePaymentLinkDto, ProcessPaymentDto, ProcessPaymentWithCardDto, PaymentResult } from '@/domain/entities/PaymentLink'
import { PaymentLinkService } from '../services/PaymentLinkService'

/**
 * Payment Link Repository Implementation
 * Implements the repository interface using the PaymentLinkService
 */
export class PaymentLinkRepositoryImpl implements PaymentLinkRepository {
  private service: PaymentLinkService

  constructor() {
    this.service = new PaymentLinkService()
  }

  /**
   * Creates a new payment link (returns full entity)
   */
  async create(data: CreatePaymentLinkDto): Promise<PaymentLink> {
    return await this.service.createFull(data)
  }

  /**
   * Retrieves a payment link by ID
   */
  async getById(id: string): Promise<PaymentLink> {
    return await this.service.getById(id)
  }

  /**
   * Processes a payment for a payment link (matching API spec)
   */
  async processPayment(data: ProcessPaymentDto): Promise<PaymentResult> {
    return await this.service.processPayment(data)
  }

  /**
   * Processes a payment with card data (frontend validation)
   */
  async processPaymentWithCard(data: ProcessPaymentWithCardDto): Promise<PaymentResult> {
    return await this.service.processPaymentWithCard(data)
  }
}
