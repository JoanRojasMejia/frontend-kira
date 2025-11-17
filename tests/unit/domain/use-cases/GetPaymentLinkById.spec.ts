import { describe, it, expect, beforeEach, vi } from 'vitest'
import { GetPaymentLinkById } from '@/domain/use-cases/GetPaymentLinkById'
import type { PaymentLinkRepository } from '@/domain/repositories/PaymentLinkRepository'
import { createMockPaymentLink } from '../../../factories/paymentLink.factory'

describe('GetPaymentLinkById Use Case', () => {
  let mockRepository: PaymentLinkRepository
  let useCase: GetPaymentLinkById

  beforeEach(() => {
    mockRepository = {
      create: vi.fn(),
      getById: vi.fn(),
      processPayment: vi.fn(),
      processPaymentWithCard: vi.fn()
    }
    useCase = new GetPaymentLinkById(mockRepository)
  })

  it('should get a payment link by ID', async () => {
    const mockLink = createMockPaymentLink()
    vi.mocked(mockRepository.getById).mockResolvedValue(mockLink)

    const result = await useCase.execute(mockLink.id)

    expect(result).toEqual(mockLink)
    expect(mockRepository.getById).toHaveBeenCalledWith(mockLink.id)
  })

  it('should throw error when ID is empty', async () => {
    await expect(useCase.execute('')).rejects.toThrow('Payment link ID is required')
  })

  it('should throw error when ID is whitespace', async () => {
    await expect(useCase.execute('   ')).rejects.toThrow('Payment link ID is required')
  })
})
