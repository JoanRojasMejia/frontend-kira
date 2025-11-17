import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import CreateLinkForm from '@/presentation/components/create-link/CreateLinkForm.vue'

describe('CreateLinkForm Component', () => {
  it('should render all form fields', () => {
    const wrapper = mount(CreateLinkForm, {
      props: {
        loading: false
      }
    })

    expect(wrapper.find('#merchant-name').exists()).toBe(true)
    expect(wrapper.find('#description').exists()).toBe(true)
    expect(wrapper.find('#amount').exists()).toBe(true)
    expect(wrapper.find('#currency-from').exists()).toBe(true)
    expect(wrapper.find('#currency-to').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('should disable currency fields with fixed values', () => {
    const wrapper = mount(CreateLinkForm, {
      props: {
        loading: false
      }
    })

    const currencyFrom = wrapper.find('#currency-from')
    const currencyTo = wrapper.find('#currency-to')

    expect((currencyFrom.element as HTMLInputElement).disabled).toBe(true)
    expect((currencyTo.element as HTMLInputElement).disabled).toBe(true)
    expect((currencyFrom.element as HTMLInputElement).value).toBe('USD')
    expect((currencyTo.element as HTMLInputElement).value).toBe('MXN')
  })

  it('should emit submit event with correct data', async () => {
    const wrapper = mount(CreateLinkForm, {
      props: {
        loading: false
      }
    })

    await wrapper.find('#merchant-name').setValue('Test Merchant')
    await wrapper.find('#description').setValue('This is a valid test description')
    await wrapper.find('#amount').setValue(100)

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    const submitEvent = wrapper.emitted('submit')![0][0] as any
    expect(submitEvent.merchantName).toBe('Test Merchant')
    expect(submitEvent.description).toBe('This is a valid test description')
    expect(submitEvent.amount).toBe(100)
  })

  it('should show validation errors for empty fields', async () => {
    const wrapper = mount(CreateLinkForm, {
      props: {
        loading: false
      }
    })

    // Try to submit without filling fields
    await wrapper.find('form').trigger('submit.prevent')

    // Should not emit submit
    expect(wrapper.emitted('submit')).toBeFalsy()
  })

  it('should disable submit button while loading', () => {
    const wrapper = mount(CreateLinkForm, {
      props: {
        loading: true
      }
    })

    const submitButton = wrapper.find('button[type="submit"]')
    expect((submitButton.element as HTMLButtonElement).disabled).toBe(true)
    expect(submitButton.text()).toContain('Creando')
  })

  it('should toggle expiration switch correctly', async () => {
    const wrapper = mount(CreateLinkForm, {
      props: {
        loading: false
      }
    })

    const checkbox = wrapper.find('input[type="checkbox"]')

    // Initially checked (default true)
    expect((checkbox.element as HTMLInputElement).checked).toBe(true)

    // Toggle
    await checkbox.setValue(false)
    expect((checkbox.element as HTMLInputElement).checked).toBe(false)
  })
})
