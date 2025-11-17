import { ref, computed } from 'vue'
import {
  luhnCheck,
  detectCardBrand,
  isValidCardLength,
  isValidCVV,
  isValidExpirationDate,
  isValidCardHolder
} from '@/utils/validators'

/**
 * Card validation state
 */
export interface CardValidationState {
  cardNumber: {
    isValid: boolean
    error: string | null
  }
  cardHolder: {
    isValid: boolean
    error: string | null
  }
  expirationDate: {
    isValid: boolean
    error: string | null
  }
  cvv: {
    isValid: boolean
    error: string | null
  }
}

/**
 * Composable for credit card validation
 * @returns Object with validation functions and state
 */
export function useCreditCardValidation() {
  const cardNumber = ref('')
  const cardHolder = ref('')
  const expirationDate = ref('')
  const cvv = ref('')
  const termsAccepted = ref(false)

  const validationState = ref<CardValidationState>({
    cardNumber: { isValid: false, error: null },
    cardHolder: { isValid: false, error: null },
    expirationDate: { isValid: false, error: null },
    cvv: { isValid: false, error: null }
  })

  /**
   * Validates card number
   */
  const validateCardNumber = (): boolean => {
    const value = cardNumber.value.replace(/\s/g, '')

    if (value.length === 0) {
      validationState.value.cardNumber = {
        isValid: false,
        error: 'El número de tarjeta es requerido'
      }
      return false
    }

    if (!isValidCardLength(value)) {
      validationState.value.cardNumber = {
        isValid: false,
        error: 'Longitud de tarjeta inválida'
      }
      return false
    }

    if (!luhnCheck(value)) {
      validationState.value.cardNumber = {
        isValid: false,
        error: 'Número de tarjeta inválido'
      }
      return false
    }

    validationState.value.cardNumber = {
      isValid: true,
      error: null
    }
    return true
  }

  /**
   * Validates card holder name
   */
  const validateCardHolder = (): boolean => {
    const value = cardHolder.value

    if (value.length === 0) {
      validationState.value.cardHolder = {
        isValid: false,
        error: 'El nombre del titular es requerido'
      }
      return false
    }

    if (!isValidCardHolder(value)) {
      validationState.value.cardHolder = {
        isValid: false,
        error: 'Solo se permiten letras y espacios (mínimo 3 caracteres)'
      }
      return false
    }

    validationState.value.cardHolder = {
      isValid: true,
      error: null
    }
    return true
  }

  /**
   * Validates expiration date
   */
  const validateExpirationDate = (): boolean => {
    const value = expirationDate.value

    if (value.length === 0) {
      validationState.value.expirationDate = {
        isValid: false,
        error: 'La fecha de expiración es requerida'
      }
      return false
    }

    if (!isValidExpirationDate(value)) {
      validationState.value.expirationDate = {
        isValid: false,
        error: 'Fecha inválida o expirada (MM/YY)'
      }
      return false
    }

    validationState.value.expirationDate = {
      isValid: true,
      error: null
    }
    return true
  }

  /**
   * Validates CVV
   */
  const validateCVV = (): boolean => {
    const value = cvv.value

    if (value.length === 0) {
      validationState.value.cvv = {
        isValid: false,
        error: 'El CVV es requerido'
      }
      return false
    }

    if (!isValidCVV(value, cardNumber.value)) {
      const brand = detectCardBrand(cardNumber.value)
      const expectedLength = brand === 'amex' ? 4 : 3
      validationState.value.cvv = {
        isValid: false,
        error: `CVV debe tener ${expectedLength} dígitos`
      }
      return false
    }

    validationState.value.cvv = {
      isValid: true,
      error: null
    }
    return true
  }

  /**
   * Validates all fields
   */
  const validateAll = (): boolean => {
    const isCardNumberValid = validateCardNumber()
    const isCardHolderValid = validateCardHolder()
    const isExpirationValid = validateExpirationDate()
    const isCVVValid = validateCVV()

    return isCardNumberValid && isCardHolderValid && isExpirationValid && isCVVValid && termsAccepted.value
  }

  /**
   * Gets card brand
   */
  const cardBrand = computed(() => {
    return detectCardBrand(cardNumber.value)
  })

  /**
   * Checks if form is valid
   */
  const isFormValid = computed(() => {
    return (
      validationState.value.cardNumber.isValid &&
      validationState.value.cardHolder.isValid &&
      validationState.value.expirationDate.isValid &&
      validationState.value.cvv.isValid &&
      termsAccepted.value
    )
  })

  /**
   * Resets all fields and validation
   */
  const reset = () => {
    cardNumber.value = ''
    cardHolder.value = ''
    expirationDate.value = ''
    cvv.value = ''
    termsAccepted.value = false
    validationState.value = {
      cardNumber: { isValid: false, error: null },
      cardHolder: { isValid: false, error: null },
      expirationDate: { isValid: false, error: null },
      cvv: { isValid: false, error: null }
    }
  }

  return {
    // State
    cardNumber,
    cardHolder,
    expirationDate,
    cvv,
    termsAccepted,
    validationState,
    cardBrand,
    isFormValid,

    // Methods
    validateCardNumber,
    validateCardHolder,
    validateExpirationDate,
    validateCVV,
    validateAll,
    reset
  }
}
