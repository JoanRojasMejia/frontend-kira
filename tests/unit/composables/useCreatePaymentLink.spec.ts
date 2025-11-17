import { describe, it, expect, beforeEach, vi } from 'vitest'
import { flushPromises } from '@vue/test-utils'
import { useCreatePaymentLink } from '@/presentation/composables/useCreatePaymentLink'
import { createMockPaymentLink } from '../../factories/paymentLink.factory'

// Store the mock functions
let mockCreate: ReturnType<typeof vi.fn>
let mockGetById: ReturnType<typeof vi.fn>
let mockProcessPayment: ReturnType<typeof vi.fn>
let mockProcessPaymentWithCard: ReturnType<typeof vi.fn>

// Mock the repository
vi.mock('@/infrastructure/repositories/PaymentLinkRepositoryImpl', () => ({
  PaymentLinkRepositoryImpl: vi.fn().mockImplementation(() => ({
    get create() { return mockCreate },
    get getById() { return mockGetById },
    get processPayment() { return mockProcessPayment },
    get processPaymentWithCard() { return mockProcessPaymentWithCard }
  }))
}))

describe('useCreatePaymentLink', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockCreate = vi.fn()
    mockGetById = vi.fn()
    mockProcessPayment = vi.fn()
    mockProcessPaymentWithCard = vi.fn()
    vi.clearAllMocks()
  })

  it('should initialize with correct default values', () => {
    const { loading, error, paymentLink } = useCreatePaymentLink()

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(paymentLink.value).toBeNull()
  })

  it('should set loading to true during creation', async () => {
    mockCreate.mockImplementation(() => {
      return new Promise(resolve => setTimeout(() => resolve(createMockPaymentLink()), 100))
    })

    const { loading, createLink } = useCreatePaymentLink()

    const promise = createLink({
      merchant_id: 'merchant-123',
      amount_usd: 100,
      currency_from: 'USD',
      currency_to: 'MXN',
      description: 'Test description',
      expires_at: null
    })

    expect(loading.value).toBe(true)

    await promise
    await flushPromises()

    expect(loading.value).toBe(false)
  })

  it('should handle successful payment link creation', async () => {
    const mockLink = createMockPaymentLink()
    mockCreate.mockResolvedValue(mockLink)

    const { loading, error, paymentLink, createLink } = useCreatePaymentLink()

    await createLink({
      merchant_id: 'merchant-123',
      amount_usd: 100,
      currency_from: 'USD',
      currency_to: 'MXN',
      description: 'Valid test description',
      expires_at: null
    })

    await flushPromises()

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(paymentLink.value).toEqual(mockLink)
  })

  it('should handle validation errors', async () => {
    const { loading, error, paymentLink, createLink } = useCreatePaymentLink()

    await createLink({
      merchant_id: 'merchant-123',
      amount_usd: 0, // Invalid amount
      currency_from: 'USD',
      currency_to: 'MXN',
      description: 'Valid description',
      expires_at: null
    })

    await flushPromises()

    expect(loading.value).toBe(false)
    expect(error.value).toBeTruthy()
    expect(paymentLink.value).toBeNull()
  })

  it('should reset error state on new attempt', async () => {
    const mockLink = createMockPaymentLink()
    const { error, createLink } = useCreatePaymentLink()

    // First attempt with invalid data
    await createLink({
      merchant_id: 'merchant-123',
      amount_usd: 0,
      currency_from: 'USD',
      currency_to: 'MXN',
      description: 'Valid description',
      expires_at: null
    })

    await flushPromises()
    expect(error.value).toBeTruthy()

    // Second attempt with valid data
    mockCreate.mockResolvedValue(mockLink)

    await createLink({
      merchant_id: 'merchant-123',
      amount_usd: 100,
      currency_from: 'USD',
      currency_to: 'MXN',
      description: 'Valid description',
      expires_at: null
    })

    await flushPromises()
    expect(error.value).toBeNull()
  })

  it('should reset all state when reset is called', () => {
    const { loading, error, paymentLink, reset } = useCreatePaymentLink()

    // Manually set some values
    ;(loading as any).value = true
    ;(error as any).value = 'Some error'
    ;(paymentLink as any).value = createMockPaymentLink()

    reset()

    expect(loading.value).toBe(false)
    expect(error.value).toBeNull()
    expect(paymentLink.value).toBeNull()
  })
})
