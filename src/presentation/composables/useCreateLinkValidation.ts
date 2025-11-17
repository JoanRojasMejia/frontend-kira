import { ref, reactive } from 'vue'
import { isValidDescription, isValidAmount } from '@/utils/validators'

/**
 * Form data interface
 */
export interface CreateLinkFormData {
  merchantName: string
  description: string
  amount: number
  hasExpiration: boolean
}

/**
 * Form errors interface
 */
interface FormErrors {
  merchantName: string | null
  description: string | null
  amount: string | null
}

/**
 * Create Link Validation Composable
 * Manages form validation for payment link creation
 */
export function useCreateLinkValidation() {
  const formData = reactive<CreateLinkFormData>({
    merchantName: '',
    description: '',
    amount: 0,
    hasExpiration: true
  })

  const errors = ref<FormErrors>({
    merchantName: null,
    description: null,
    amount: null
  })

  /**
   * Validate merchant name
   */
  const validateMerchantName = (): boolean => {
    if (!formData.merchantName.trim()) {
      errors.value.merchantName = 'El nombre del comercio es requerido'
      return false
    }
    errors.value.merchantName = null
    return true
  }

  /**
   * Validate description
   */
  const validateDescription = (): boolean => {
    if (!isValidDescription(formData.description)) {
      errors.value.description = 'La descripción debe tener al menos 10 caracteres'
      return false
    }
    errors.value.description = null
    return true
  }

  /**
   * Validate amount
   */
  const validateAmount = (): boolean => {
    if (!isValidAmount(formData.amount)) {
      errors.value.amount = 'El monto debe ser mayor a 0'
      return false
    }
    errors.value.amount = null
    return true
  }

  /**
   * Validate all fields
   */
  const validateAll = (): boolean => {
    const isValid = validateMerchantName() && validateDescription() && validateAmount()
    return isValid
  }

  /**
   * Reset form
   */
  const reset = () => {
    formData.merchantName = ''
    formData.description = ''
    formData.amount = 0
    formData.hasExpiration = true
    errors.value.merchantName = null
    errors.value.description = null
    errors.value.amount = null
  }

  return {
    formData,
    errors,
    validateMerchantName,
    validateDescription,
    validateAmount,
    validateAll,
    reset
  }
}
