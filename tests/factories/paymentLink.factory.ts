import type { PaymentLink } from '@/domain/entities/PaymentLink'
import type { Transaction } from '@/domain/entities/Transaction'
import { v4 as uuidv4 } from 'uuid'
import { addDays } from 'date-fns'
import { generateMerchantId } from '@/utils/idGenerators'

/**
 * Factory for creating mock PaymentLink entities in tests
 */
export function createMockPaymentLink(overrides: Partial<PaymentLink> = {}): PaymentLink {
  const now = new Date().toISOString()

  return {
    id: uuidv4(),
    merchant_id: generateMerchantId(),
    amount_usd: 100,
    currency_from: 'USD',
    currency_to: 'MXN',
    status: 'PENDING',
    expires_at: addDays(new Date(), 1).toISOString(),
    description: 'Test payment link description',
    created_at: now,
    updated_at: now,
    transactions: [],
    webhook_events: [],
    ...overrides
  }
}

/**
 * Factory for creating mock Transaction entities in tests
 */
export function createMockTransaction(overrides: Partial<Transaction> = {}): Transaction {
  return {
    id: uuidv4(),
    payment_link_id: uuidv4(),
    amount_usd: 100,
    currency_to_amount: 1775,
    status: 'COMPLETED',
    card_last4: '1234',
    card_brand: 'visa',
    processed_at: new Date().toISOString(),
    ...overrides
  }
}
