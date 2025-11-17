import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CreatePaymentLink } from '@/domain/use-cases/CreatePaymentLink'
import type { PaymentLinkRepository } from '@/domain/repositories/PaymentLinkRepository'
import { createMockPaymentLink } from '../../../factories/paymentLink.factory'

describe('CreatePaymentLink Use Case', () => {
  let mockRepository: PaymentLinkRepository
  let useCase: CreatePaymentLink

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      getById: vi.fn(),
      processPayment: vi.fn()
    }
    useCase = new CreatePaymentLink(mockRepository)
  })

  it('should create a payment link with expiration', async () => {
    const expiresAt = new Date(Date.now() + 86400000).toISOString()
    const mockLink = createMockPaymentLink({ expires_at: expiresAt })
    vi.mocked(mockRepository.create).mockResolvedValue(mockLink)

    const result = await useCase.execute({
      merchant_id: 'merchant-123',
      amount_usd: 100,
      currency_from: 'USD',
      currency_to: 'MXN',
      description: 'Test description for payment',
      expires_at: expiresAt
    })

    expect(result).toEqual(mockLink)
    expect(mockRepository.create).toHaveBeenCalledWith({
      merchant_id: 'merchant-123',
      amount_usd: 100,
      currency_from: 'USD',
      currency_to: 'MXN',
      description: 'Test description for payment',
      expires_at: expiresAt
    })
  })

  it('should create a payment link without expiration', async () => {
    const mockLink = createMockPaymentLink({ expires_at: null })
    vi.mocked(mockRepository.create).mockResolvedValue(mockLink)

    const result = await useCase.execute({
      merchant_id: 'merchant-123',
      amount_usd: 100,
      currency_from: 'USD',
      currency_to: 'MXN',
      description: 'Test description for payment',
      expires_at: null
    })

    expect(result).toEqual(mockLink)
  })

  it('should throw error when amount is invalid', async () => {
    await expect(
      useCase.execute({
        merchant_id: 'merchant-123',
        amount_usd: 0,
        currency_from: 'USD',
        currency_to: 'MXN',
        description: 'Test description',
        expires_at: null
      })
    ).rejects.toThrow('Amount must be greater than 0')
  })

  it('should throw error when description is too short', async () => {
    await expect(
      useCase.execute({
        merchant_id: 'merchant-123',
        amount_usd: 100,
        currency_from: 'USD',
        currency_to: 'MXN',
        description: 'Short',
        expires_at: null
      })
    ).rejects.toThrow('Description must be at least 10 characters')
  })

  it('should throw error when merchant ID is empty', async () => {
    await expect(
      useCase.execute({
        merchant_id: '',
        amount_usd: 100,
        currency_from: 'USD',
        currency_to: 'MXN',
        description: 'Valid description',
        expires_at: null
      })
    ).rejects.toThrow('Merchant ID is required')
  })
})
