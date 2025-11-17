import { describe, it, expect } from 'vitest'
import { generateMerchantId, isValidMerchantId, extractMerchantUid } from '@/utils/idGenerators'

describe('idGenerators', () => {
  describe('generateMerchantId', () => {
    it('should generate merchant ID with correct format', () => {
      const merchantId = generateMerchantId()
      expect(merchantId).toMatch(/^merchant-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('should generate unique IDs', () => {
      const id1 = generateMerchantId()
      const id2 = generateMerchantId()
      const id3 = generateMerchantId()

      expect(id1).not.toBe(id2)
      expect(id2).not.toBe(id3)
      expect(id1).not.toBe(id3)
    })

    it('should start with "merchant-" prefix', () => {
      const merchantId = generateMerchantId()
      expect(merchantId).toMatch(/^merchant-/)
    })

    it('should contain a valid UUID after the prefix', () => {
      const merchantId = generateMerchantId()
      const uid = merchantId.replace('merchant-', '')
      // UUID v4 format validation
      expect(uid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i)
    })
  })

  describe('isValidMerchantId', () => {
    it('should return true for valid merchant IDs', () => {
      const validId = generateMerchantId()
      expect(isValidMerchantId(validId)).toBe(true)
    })

    it('should return true for manually created valid format', () => {
      const validId = 'merchant-a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      expect(isValidMerchantId(validId)).toBe(true)
    })

    it('should return false for invalid format - missing prefix', () => {
      const invalidId = 'a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      expect(isValidMerchantId(invalidId)).toBe(false)
    })

    it('should return false for invalid format - wrong prefix', () => {
      const invalidId = 'customer-a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      expect(isValidMerchantId(invalidId)).toBe(false)
    })

    it('should return false for invalid format - malformed UUID', () => {
      const invalidId = 'merchant-not-a-valid-uuid'
      expect(isValidMerchantId(invalidId)).toBe(false)
    })

    it('should return false for empty string', () => {
      expect(isValidMerchantId('')).toBe(false)
    })

    it('should return false for random string', () => {
      expect(isValidMerchantId('random-string-123')).toBe(false)
    })
  })

  describe('extractMerchantUid', () => {
    it('should extract UID from valid merchant ID', () => {
      const merchantId = 'merchant-a1b2c3d4-e5f6-7890-abcd-ef1234567890'
      const uid = extractMerchantUid(merchantId)
      expect(uid).toBe('a1b2c3d4-e5f6-7890-abcd-ef1234567890')
    })

    it('should extract UID from generated merchant ID', () => {
      const merchantId = generateMerchantId()
      const uid = extractMerchantUid(merchantId)
      expect(uid).not.toBeNull()
      expect(uid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)
    })

    it('should return null for invalid merchant ID format', () => {
      const invalidId = 'not-a-merchant-id'
      const uid = extractMerchantUid(invalidId)
      expect(uid).toBeNull()
    })

    it('should return null for merchant ID without valid UUID', () => {
      const invalidId = 'merchant-invalid-uuid'
      const uid = extractMerchantUid(invalidId)
      expect(uid).toBeNull()
    })

    it('should return null for empty string', () => {
      const uid = extractMerchantUid('')
      expect(uid).toBeNull()
    })

    it('should handle case-insensitive UUIDs', () => {
      const merchantId = 'merchant-A1B2C3D4-E5F6-7890-ABCD-EF1234567890'
      const uid = extractMerchantUid(merchantId)
      expect(uid).toBe('A1B2C3D4-E5F6-7890-ABCD-EF1234567890')
    })
  })
})
