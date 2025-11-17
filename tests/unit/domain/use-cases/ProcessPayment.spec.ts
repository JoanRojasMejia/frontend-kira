import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ProcessPayment } from '@/domain/use-cases/ProcessPayment'
import type { PaymentLinkRepository } from '@/domain/repositories/PaymentLinkRepository'

describe('ProcessPayment Use Case', () => {
  let mockRepository: PaymentLinkRepository
  let useCase: ProcessPayment

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      getById: vi.fn(),
      processPayment: vi.fn(),
      processPaymentWithCard: vi.fn()
    }
    useCase = new ProcessPayment(mockRepository)
  })

  it('should process a payment successfully', async () => {
    const mockResult = {
      status: 'success' as const,
      transaction_id: 'txn_123',
      original_amount: 100,
      fees: 5,
      total_amount: 105,
      psp_used: 'stripe',
      psp_reference: 'ref_123',
      processing_time_ms: 250
    }
    vi.mocked(mockRepository.processPaymentWithCard).mockResolvedValue(mockResult)

    const result = await useCase.execute({
      payment_link_id: 'link_123',
      card_token: 'tok_123',
      accept_terms: true
    })

    expect(result).toEqual(mockResult)
    expect(mockRepository.processPaymentWithCard).toHaveBeenCalledWith({
      payment_link_id: 'link_123',
      card_token: 'tok_123',
      accept_terms: true
    })
  })

  it('should throw error when payment link ID is empty', async () => {
    await expect(
      useCase.execute({
        payment_link_id: '',
        card_token: 'tok_123',
        accept_terms: true
      })
    ).rejects.toThrow('Payment link ID is required')
  })

  it('should throw error when card token is empty', async () => {
    await expect(
      useCase.execute({
        payment_link_id: 'link_123',
        card_token: '',
        accept_terms: true
      })
    ).rejects.toThrow('Card token is required')
  })

  it('should throw error when terms not accepted', async () => {
    await expect(
      useCase.execute({
        payment_link_id: 'link_123',
        card_token: 'tok_123',
        accept_terms: false
      })
    ).rejects.toThrow('You must accept the terms and conditions')
  })
})
