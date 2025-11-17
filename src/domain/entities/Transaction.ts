/**
 * Transaction Entity
 * Represents a payment transaction
 */
export interface Transaction {
  id: string
  payment_link_id: string
  amount_usd: number
  currency_to_amount: number
  status: 'PENDING' | 'COMPLETED' | 'FAILED'
  card_last4: string
  card_brand: string
  processed_at: string
  error_code?: string
  error_message?: string
}
