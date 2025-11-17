import { describe, it, expect, beforeEach } from 'vitest'
import { useCreditCardValidation } from '@/presentation/composables/useCreditCardValidation'

describe('useCreditCardValidation', () => {
  let composable: ReturnType<typeof useCreditCardValidation>

  beforeEach(() => {
    composable = useCreditCardValidation()
  })

  describe('initialization', () => {
    it('should initialize with empty values', () => {
      expect(composable.cardNumber.value).toBe('')
      expect(composable.cardHolder.value).toBe('')
      expect(composable.expirationDate.value).toBe('')
      expect(composable.cvv.value).toBe('')
      expect(composable.termsAccepted.value).toBe(false)
      expect(composable.isFormValid.value).toBe(false)
    })

    it('should initialize with invalid validation state', () => {
      expect(composable.validationState.value.cardNumber.isValid).toBe(false)
      expect(composable.validationState.value.cardHolder.isValid).toBe(false)
      expect(composable.validationState.value.expirationDate.isValid).toBe(false)
      expect(composable.validationState.value.cvv.isValid).toBe(false)
    })
  })

  describe('validateCardNumber', () => {
    it('should validate correct Visa card number', () => {
      composable.cardNumber.value = '4532015112830366'
      const isValid = composable.validateCardNumber()

      expect(isValid).toBe(true)
      expect(composable.validationState.value.cardNumber.isValid).toBe(true)
      expect(composable.validationState.value.cardNumber.error).toBeNull()
    })

    it('should validate correct Mastercard number', () => {
      composable.cardNumber.value = '5425233430109903'
      const isValid = composable.validateCardNumber()

      expect(isValid).toBe(true)
      expect(composable.validationState.value.cardNumber.isValid).toBe(true)
    })

    it('should validate correct Amex number', () => {
      composable.cardNumber.value = '374245455400126'
      const isValid = composable.validateCardNumber()

      expect(isValid).toBe(true)
      expect(composable.validationState.value.cardNumber.isValid).toBe(true)
    })

    it('should reject invalid card number (Luhn check)', () => {
      composable.cardNumber.value = '4532015112830367'
      const isValid = composable.validateCardNumber()

      expect(isValid).toBe(false)
      expect(composable.validationState.value.cardNumber.isValid).toBe(false)
      expect(composable.validationState.value.cardNumber.error).toBeTruthy()
    })

    it('should reject card number with invalid length', () => {
      composable.cardNumber.value = '453201'
      const isValid = composable.validateCardNumber()

      expect(isValid).toBe(false)
      expect(composable.validationState.value.cardNumber.error).toContain('inválida')
    })

    it('should reject empty card number', () => {
      composable.cardNumber.value = ''
      const isValid = composable.validateCardNumber()

      expect(isValid).toBe(false)
      expect(composable.validationState.value.cardNumber.error).toContain('requerido')
    })
  })

  describe('validateCVV', () => {
    it('should accept 3 digits for Visa/Mastercard', () => {
      composable.cardNumber.value = '4532015112830366'
      composable.cvv.value = '123'
      const isValid = composable.validateCVV()

      expect(isValid).toBe(true)
      expect(composable.validationState.value.cvv.isValid).toBe(true)
    })

    it('should accept 4 digits for Amex', () => {
      composable.cardNumber.value = '374245455400126'
      composable.cvv.value = '1234'
      const isValid = composable.validateCVV()

      expect(isValid).toBe(true)
      expect(composable.validationState.value.cvv.isValid).toBe(true)
    })

    it('should reject invalid CVV length for Visa', () => {
      composable.cardNumber.value = '4532015112830366'
      composable.cvv.value = '1234'
      const isValid = composable.validateCVV()

      expect(isValid).toBe(false)
      expect(composable.validationState.value.cvv.error).toContain('3 dígitos')
    })

    it('should reject invalid CVV length for Amex', () => {
      composable.cardNumber.value = '374245455400126'
      composable.cvv.value = '123'
      const isValid = composable.validateCVV()

      expect(isValid).toBe(false)
      expect(composable.validationState.value.cvv.error).toContain('4 dígitos')
    })
  })

  describe('validateExpirationDate', () => {
    it('should accept future expiration date', () => {
      composable.expirationDate.value = '12/30'
      const isValid = composable.validateExpirationDate()

      expect(isValid).toBe(true)
      expect(composable.validationState.value.expirationDate.isValid).toBe(true)
    })

    it('should reject expired date', () => {
      composable.expirationDate.value = '01/20'
      const isValid = composable.validateExpirationDate()

      expect(isValid).toBe(false)
      expect(composable.validationState.value.expirationDate.error).toBeTruthy()
    })

    it('should reject invalid format', () => {
      composable.expirationDate.value = '13/25'
      const isValid = composable.validateExpirationDate()

      expect(isValid).toBe(false)
    })
  })

  describe('validateCardHolder', () => {
    it('should accept valid name', () => {
      composable.cardHolder.value = 'John Doe'
      const isValid = composable.validateCardHolder()

      expect(isValid).toBe(true)
      expect(composable.validationState.value.cardHolder.isValid).toBe(true)
    })

    it('should reject name with numbers', () => {
      composable.cardHolder.value = 'John Doe 123'
      const isValid = composable.validateCardHolder()

      expect(isValid).toBe(false)
      expect(composable.validationState.value.cardHolder.error).toBeTruthy()
    })

    it('should reject too short name', () => {
      composable.cardHolder.value = 'Jo'
      const isValid = composable.validateCardHolder()

      expect(isValid).toBe(false)
    })
  })

  describe('validateAll', () => {
    it('should return true when all fields are valid', () => {
      composable.cardNumber.value = '4532015112830366'
      composable.cardHolder.value = 'John Doe'
      composable.expirationDate.value = '12/30'
      composable.cvv.value = '123'
      composable.termsAccepted.value = true

      const isValid = composable.validateAll()

      expect(isValid).toBe(true)
      expect(composable.isFormValid.value).toBe(true)
    })

    it('should return false when terms not accepted', () => {
      composable.cardNumber.value = '4532015112830366'
      composable.cardHolder.value = 'John Doe'
      composable.expirationDate.value = '12/30'
      composable.cvv.value = '123'
      composable.termsAccepted.value = false

      const isValid = composable.validateAll()

      expect(isValid).toBe(false)
    })

    it('should return false when any field is invalid', () => {
      composable.cardNumber.value = '4532015112830367' // Invalid
      composable.cardHolder.value = 'John Doe'
      composable.expirationDate.value = '12/30'
      composable.cvv.value = '123'
      composable.termsAccepted.value = true

      const isValid = composable.validateAll()

      expect(isValid).toBe(false)
    })
  })

  describe('cardBrand', () => {
    it('should detect Visa', () => {
      composable.cardNumber.value = '4532015112830366'
      expect(composable.cardBrand.value).toBe('visa')
    })

    it('should detect Mastercard', () => {
      composable.cardNumber.value = '5425233430109903'
      expect(composable.cardBrand.value).toBe('mastercard')
    })

    it('should detect Amex', () => {
      composable.cardNumber.value = '374245455400126'
      expect(composable.cardBrand.value).toBe('amex')
    })
  })

  describe('reset', () => {
    it('should reset all fields and validation state', () => {
      composable.cardNumber.value = '4532015112830366'
      composable.cardHolder.value = 'John Doe'
      composable.expirationDate.value = '12/30'
      composable.cvv.value = '123'
      composable.termsAccepted.value = true
      composable.validateAll()

      composable.reset()

      expect(composable.cardNumber.value).toBe('')
      expect(composable.cardHolder.value).toBe('')
      expect(composable.expirationDate.value).toBe('')
      expect(composable.cvv.value).toBe('')
      expect(composable.termsAccepted.value).toBe(false)
      expect(composable.validationState.value.cardNumber.isValid).toBe(false)
    })
  })
})
