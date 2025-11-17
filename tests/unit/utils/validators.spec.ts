import { describe, it, expect } from 'vitest'
import {
  luhnCheck,
  detectCardBrand,
  isValidCardLength,
  isValidCVV,
  isValidExpirationDate,
  isValidCardHolder,
  isValidAmount,
  isValidDescription,
  isExpired
} from '@/utils/validators'

describe('Validators', () => {
  describe('luhnCheck', () => {
    it('should return true for valid Visa card number', () => {
      expect(luhnCheck('4532015112830366')).toBe(true)
    })

    it('should return true for valid Mastercard number', () => {
      expect(luhnCheck('5425233430109903')).toBe(true)
    })

    it('should return true for valid Amex number', () => {
      expect(luhnCheck('374245455400126')).toBe(true)
    })

    it('should return false for invalid card number', () => {
      expect(luhnCheck('4532015112830367')).toBe(false)
    })

    it('should handle card numbers with spaces', () => {
      expect(luhnCheck('4532 0151 1283 0366')).toBe(true)
    })

    it('should return false for non-numeric input', () => {
      expect(luhnCheck('abcd1234')).toBe(false)
    })
  })

  describe('detectCardBrand', () => {
    it('should detect Visa', () => {
      expect(detectCardBrand('4532015112830366')).toBe('visa')
    })

    it('should detect Mastercard', () => {
      expect(detectCardBrand('5425233430109903')).toBe('mastercard')
    })

    it('should detect Amex', () => {
      expect(detectCardBrand('374245455400126')).toBe('amex')
    })

    it('should return unknown for unrecognized card', () => {
      expect(detectCardBrand('1234567890123456')).toBe('unknown')
    })
  })

  describe('isValidCardLength', () => {
    it('should accept 16 digits for Visa', () => {
      expect(isValidCardLength('4532015112830366')).toBe(true)
    })

    it('should accept 16 digits for Mastercard', () => {
      expect(isValidCardLength('5425233430109903')).toBe(true)
    })

    it('should accept 15 digits for Amex', () => {
      expect(isValidCardLength('374245455400126')).toBe(true)
    })

    it('should reject wrong length for Visa', () => {
      expect(isValidCardLength('453201511283036')).toBe(false)
    })

    it('should reject wrong length for Amex', () => {
      expect(isValidCardLength('37424545540012')).toBe(false)
    })
  })

  describe('isValidCVV', () => {
    it('should accept 3 digits for Visa', () => {
      expect(isValidCVV('123', '4532015112830366')).toBe(true)
    })

    it('should accept 3 digits for Mastercard', () => {
      expect(isValidCVV('456', '5425233430109903')).toBe(true)
    })

    it('should accept 4 digits for Amex', () => {
      expect(isValidCVV('1234', '374245455400126')).toBe(true)
    })

    it('should reject 4 digits for Visa', () => {
      expect(isValidCVV('1234', '4532015112830366')).toBe(false)
    })

    it('should reject 3 digits for Amex', () => {
      expect(isValidCVV('123', '374245455400126')).toBe(false)
    })
  })

  describe('isValidExpirationDate', () => {
    it('should accept future expiration date', () => {
      expect(isValidExpirationDate('12/30')).toBe(true)
    })

    it('should reject expired date', () => {
      expect(isValidExpirationDate('01/20')).toBe(false)
    })

    it('should reject invalid month', () => {
      expect(isValidExpirationDate('13/25')).toBe(false)
      expect(isValidExpirationDate('00/25')).toBe(false)
    })

    it('should reject invalid format', () => {
      expect(isValidExpirationDate('1225')).toBe(false)
      expect(isValidExpirationDate('12-25')).toBe(false)
    })
  })

  describe('isValidCardHolder', () => {
    it('should accept valid name', () => {
      expect(isValidCardHolder('John Doe')).toBe(true)
    })

    it('should accept name with multiple spaces', () => {
      expect(isValidCardHolder('Maria De Los Angeles')).toBe(true)
    })

    it('should reject name with numbers', () => {
      expect(isValidCardHolder('John Doe 123')).toBe(false)
    })

    it('should reject name with special characters', () => {
      expect(isValidCardHolder('John@Doe')).toBe(false)
    })

    it('should reject too short name', () => {
      expect(isValidCardHolder('Jo')).toBe(false)
    })
  })

  describe('isValidAmount', () => {
    it('should accept positive numbers', () => {
      expect(isValidAmount(100)).toBe(true)
      expect(isValidAmount(0.01)).toBe(true)
    })

    it('should accept positive string numbers', () => {
      expect(isValidAmount('100')).toBe(true)
      expect(isValidAmount('0.01')).toBe(true)
    })

    it('should reject zero', () => {
      expect(isValidAmount(0)).toBe(false)
      expect(isValidAmount('0')).toBe(false)
    })

    it('should reject negative numbers', () => {
      expect(isValidAmount(-100)).toBe(false)
      expect(isValidAmount('-100')).toBe(false)
    })

    it('should reject non-numeric values', () => {
      expect(isValidAmount('abc')).toBe(false)
    })
  })

  describe('isValidDescription', () => {
    it('should accept description with minimum length', () => {
      expect(isValidDescription('Valid description')).toBe(true)
    })

    it('should reject description too short', () => {
      expect(isValidDescription('Short')).toBe(false)
    })

    it('should respect custom minimum length', () => {
      expect(isValidDescription('Test', 5)).toBe(false)
      expect(isValidDescription('Testing', 5)).toBe(true)
    })
  })

  describe('isExpired', () => {
    it('should return false for future dates', () => {
      const futureDate = new Date(Date.now() + 86400000).toISOString()
      expect(isExpired(futureDate)).toBe(false)
    })

    it('should return true for past dates', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString()
      expect(isExpired(pastDate)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isExpired(null)).toBe(false)
    })
  })
})
