import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { flushPromises } from '@vue/test-utils'
import CreateLinkView from '@/presentation/views/CreateLinkView.vue'
import { createMockPaymentLink } from '../factories/paymentLink.factory'

// Store the mock functions
let mockCreate: ReturnType<typeof vi.fn>
let mockGetById: ReturnType<typeof vi.fn>
let mockProcessPayment: ReturnType<typeof vi.fn>
let mockProcessPaymentWithCard: ReturnType<typeof vi.fn>

// Mock the repository implementation
vi.mock('@/infrastructure/repositories/PaymentLinkRepositoryImpl', () => ({
  PaymentLinkRepositoryImpl: vi.fn().mockImplementation(() => ({
    get create() { return mockCreate },
    get getById() { return mockGetById },
    get processPayment() { return mockProcessPayment },
    get processPaymentWithCard() { return mockProcessPaymentWithCard }
  }))
}))

describe('Create Payment Link Flow (Integration)', () => {
  beforeEach(() => {
    // Reset mocks before each test
    mockCreate = vi.fn()
    mockGetById = vi.fn()
    mockProcessPayment = vi.fn()
    mockProcessPaymentWithCard = vi.fn()
    vi.clearAllMocks()
  })

  it('should complete full payment link creation flow', async () => {
    const mockLink = createMockPaymentLink()
    mockCreate.mockResolvedValue(mockLink)

    const wrapper = mount(CreateLinkView)

    // Initially should show the form
    expect(wrapper.find('form').exists()).toBe(true)

    // Fill the form
    await wrapper.find('#merchant-name').setValue('Test Merchant')
    await wrapper.find('#description').setValue('This is a test payment description')
    await wrapper.find('#amount').setValue(100)

    // Submit the form
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Should show success component with URL
    expect(wrapper.text()).toContain('¡Link de Pago Creado!')
    expect(wrapper.text()).toContain(`/pay/${mockLink.id}`)
  })

  it('should handle API error during creation', async () => {
    mockCreate.mockRejectedValue(new Error('API Error'))

    const wrapper = mount(CreateLinkView)

    // Fill and submit the form
    await wrapper.find('#merchant-name').setValue('Test Merchant')
    await wrapper.find('#description').setValue('Valid description for testing')
    await wrapper.find('#amount').setValue(100)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Should show error message
    expect(wrapper.text()).toContain('Error')
  })

  it('should allow creating another link after success', async () => {
    const mockLink = createMockPaymentLink()
    mockCreate.mockResolvedValue(mockLink)

    const wrapper = mount(CreateLinkView)

    // Complete first creation
    await wrapper.find('#merchant-name').setValue('Test Merchant')
    await wrapper.find('#description').setValue('Test description for payment link')
    await wrapper.find('#amount').setValue(100)
    await wrapper.find('form').trigger('submit.prevent')
    await flushPromises()

    // Click "Create Another" button
    const createAnotherButton = wrapper.find('.create-another-button')
    expect(createAnotherButton.exists()).toBe(true)

    await createAnotherButton.trigger('click')
    await flushPromises()

    // Should show form again
    expect(wrapper.find('form').exists()).toBe(true)
  })
})
