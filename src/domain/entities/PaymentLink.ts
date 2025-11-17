import type { Transaction } from './Transaction'

/**
 * Payment Link Entity (from API - raw response)
 */
export interface PaymentLinkRaw {
  id: string
  merchant_id: string
  amount_usd: string // Comes as string from API (e.g., "123.00")
  currency_from: 'USD'
  currency_to: 'MXN'
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'FAILED'
  expires_at: string | null
  description: string
  created_at: string
  updated_at: string
  transactions?: Transaction[]
  webhook_events?: unknown[]
}

/**
 * Payment Link Entity (domain)
 * Represents a payment link in the system
 */
export interface PaymentLink {
  id: string
  merchant_id: string
  amount_usd: number
  currency_from: 'USD'
  currency_to: 'MXN'
  status: 'PENDING' | 'COMPLETED' | 'EXPIRED' | 'FAILED'
  expires_at: string | null
  description: string
  created_at: string
  updated_at: string
  transactions?: Transaction[]
  webhook_events?: unknown[]
}

/**
 * DTO for creating a payment link (API Request)
 */
export interface CreatePaymentLinkDto {
  merchant_id: string
  amount_usd: number
  currency_from: string
  currency_to: string
  description: string
  expires_at: string | null
}

/**
 * DTO for creating a payment link response (API Response)
 */
export interface CreatePaymentLinkResponseDto {
  id: string
  status: 'PENDING'
  amount_usd: number
  created_at: string
}

/**
 * DTO for processing a payment (API Request)
 */
export interface ProcessPaymentDto {
  payment_link_id: string
  payment_token: string
}

/**
 * Payment success response (API Response)
 */
export interface PaymentSuccessResponse {
  status: 'success'
  transaction_id: string
  original_amount: number
  fees: number
  total_amount: number
  psp_used: string
  psp_reference: string
  processing_time_ms: number
}

/**
 * Payment error response (API Response)
 */
export interface PaymentErrorResponse {
  status: 'error' | 'failed'
  error_message: string
  transaction_id: string
  original_amount?: number | string
  fees?: number
  total_amount?: number | string
  psp_used?: string
  transaction_status?: string
  processing_time_ms?: number
}

/**
 * Payment result response (Union type)
 */
export type PaymentResult = PaymentSuccessResponse | PaymentErrorResponse

/**
 * Internal DTO for processing payment with card data (Frontend only)
 * Used before calling the API to include card token and terms acceptance
 */
export interface ProcessPaymentWithCardDto {
  payment_link_id: string
  card_token: string
  accept_terms: boolean
}
