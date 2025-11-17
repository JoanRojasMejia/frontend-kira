import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PaymentStatusView from '@/presentation/components/payment/PaymentStatusView.vue'

describe('PaymentStatusView Component', () => {
  it('should show success message for completed payment', () => {
    const wrapper = mount(PaymentStatusView, {
      props: {
        status: 'success',
        transactionId: 'txn_123',
        amount: 100,
        mxnAmount: 1775
      }
    })

    expect(wrapper.text()).toContain('¡Pago Exitoso!')
    expect(wrapper.text()).toContain('txn_123')
    expect(wrapper.text()).toContain('$100.00 USD')
    expect(wrapper.text()).toContain('$1775.00 MXN')
  })

  it('should show error message for failed payment', () => {
    const wrapper = mount(PaymentStatusView, {
      props: {
        status: 'error',
        errorMessage: 'Insufficient funds'
      }
    })

    expect(wrapper.text()).toContain('Error en el Pago')
    expect(wrapper.text()).toContain('Insufficient funds')
  })

  it('should show expired message when link is expired', () => {
    const wrapper = mount(PaymentStatusView, {
      props: {
        status: 'expired'
      }
    })

    expect(wrapper.text()).toContain('Link Expirado')
    expect(wrapper.text()).toContain('ha expirado')
  })

  it('should show completed message when link already paid', () => {
    const wrapper = mount(PaymentStatusView, {
      props: {
        status: 'completed'
      }
    })

    expect(wrapper.text()).toContain('Pago Ya Procesado')
  })

  it('should show retry button on error', async () => {
    const wrapper = mount(PaymentStatusView, {
      props: {
        status: 'error',
        errorMessage: 'Payment failed'
      }
    })

    const retryButton = wrapper.find('.retry-button')
    expect(retryButton.exists()).toBe(true)

    await retryButton.trigger('click')
    expect(wrapper.emitted('retry')).toBeTruthy()
  })

  it('should not show retry button on success', () => {
    const wrapper = mount(PaymentStatusView, {
      props: {
        status: 'success',
        transactionId: 'txn_123'
      }
    })

    expect(wrapper.find('.retry-button').exists()).toBe(false)
  })
})
