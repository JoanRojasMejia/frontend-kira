import { describe, it, expect } from 'vitest'
import {
  formatCardNumber,
  formatExpirationDate,
  formatAmount,
  formatDate,
  formatTimeRemaining,
  maskCardNumber,
  convertUsdToMxn
} from '@/utils/formatters'

describe('Formatters', () => {
  describe('formatCardNumber', () => {
    it('should format card number with spaces every 4 digits', () => {
      expect(formatCardNumber('4532015112830366')).toBe('4532 0151 1283 0366')
    })

    it('should handle partial card numbers', () => {
      expect(formatCardNumber('4532')).toBe('4532')
      expect(formatCardNumber('45320151')).toBe('4532 0151')
    })

    it('should handle already formatted numbers', () => {
      expect(formatCardNumber('4532 0151 1283 0366')).toBe('4532 0151 1283 0366')
    })
  })

  describe('formatExpirationDate', () => {
    it('should format as MM/YY', () => {
      expect(formatExpirationDate('1225')).toBe('12/25')
    })

    it('should handle partial input', () => {
      expect(formatExpirationDate('12')).toBe('12')
      expect(formatExpirationDate('1')).toBe('1')
    })

    it('should handle already formatted input', () => {
      expect(formatExpirationDate('12/25')).toBe('12/25')
    })
  })

  describe('formatAmount', () => {
    it('should format amount with USD currency symbol', () => {
      expect(formatAmount(100.50, 'USD')).toBe('$100.50')
    })

    it('should format amount with MXN currency symbol', () => {
      expect(formatAmount(1775.25, 'MXN')).toBe('$1775.25')
    })

    it('should default to USD', () => {
      expect(formatAmount(100)).toBe('$100.00')
    })

    it('should round to 2 decimal places', () => {
      expect(formatAmount(100.123, 'USD')).toBe('$100.12')
    })
  })

  describe('formatDate', () => {
    it('should format ISO date to readable string', () => {
      const date = new Date('2024-01-15T10:30:00Z')
      const formatted = formatDate(date.toISOString())
      expect(formatted).toContain('2024')
    })
  })

  describe('formatTimeRemaining', () => {
    it('should return "Sin expiración" for null', () => {
      expect(formatTimeRemaining(null)).toBe('Sin expiración')
    })

    it('should return "Expirado" for past dates', () => {
      const pastDate = new Date(Date.now() - 86400000).toISOString()
      expect(formatTimeRemaining(pastDate)).toBe('Expirado')
    })

    it('should format hours and minutes for future dates', () => {
      const futureDate = new Date(Date.now() + 3600000 + 1800000).toISOString() // 1h 30m
      const result = formatTimeRemaining(futureDate)
      expect(result).toContain('h')
      expect(result).toContain('m')
      expect(result).toContain('restantes')
    })

    it('should format only minutes when less than 1 hour', () => {
      const futureDate = new Date(Date.now() + 1800000).toISOString() // 30m
      const result = formatTimeRemaining(futureDate)
      expect(result).toContain('m')
      expect(result).toContain('restantes')
      expect(result).not.toContain('h')
    })
  })

  describe('maskCardNumber', () => {
    it('should mask card number showing only last 4 digits', () => {
      expect(maskCardNumber('4532015112830366')).toBe('•••• •••• •••• 0366')
    })

    it('should handle card numbers with spaces', () => {
      expect(maskCardNumber('4532 0151 1283 0366')).toBe('•••• •••• •••• 0366')
    })
  })

  describe('convertUsdToMxn', () => {
    it('should convert USD to MXN with default rate', () => {
      const result = convertUsdToMxn(100)
      expect(result).toBe(1775)
    })

    it('should convert USD to MXN with custom rate', () => {
      const result = convertUsdToMxn(100, 20)
      expect(result).toBe(2000)
    })

    it('should round to 2 decimal places', () => {
      const result = convertUsdToMxn(100.33, 17.777)
      // 100.33 * 17.777 = 1783.56841, rounds to 1783.57
      expect(result).toBe(1783.57)
    })
  })
})
