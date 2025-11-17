import { v4 as uuidv4 } from 'uuid'

/**
 * Generates a unique merchant ID with format: merchant-{uid}
 * @returns Unique merchant ID string
 * @example
 * generateMerchantId() // Returns: "merchant-a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 */
export function generateMerchantId(): string {
  const uid = uuidv4()
  return `merchant-${uid}`
}

/**
 * Validates if a string is a valid merchant ID format
 * @param id - ID string to validate
 * @returns true if valid merchant ID format
 */
export function isValidMerchantId(id: string): boolean {
  // Format: merchant-{uuid}
  const merchantIdRegex = /^merchant-[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return merchantIdRegex.test(id)
}

/**
 * Extracts the UID portion from a merchant ID
 * @param merchantId - Full merchant ID
 * @returns UID portion or null if invalid format
 * @example
 * extractMerchantUid("merchant-a1b2c3d4-e5f6-7890-abcd-ef1234567890") // Returns: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
 */
export function extractMerchantUid(merchantId: string): string | null {
  if (!isValidMerchantId(merchantId)) {
    return null
  }
  return merchantId.replace('merchant-', '')
}
