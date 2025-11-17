/**
 * Fee rule types
 */
export type FeeRuleType = 'FIXED' | 'PERCENTAGE' | 'FX_SPREAD'

/**
 * Fee rule application types
 */
export type FeeApplicationType = 'ALWAYS' | 'AMOUNT_RANGE' | 'TRANSACTION_COUNT'

/**
 * Applied fee rule (from API - raw response)
 */
export interface AppliedFeeRuleRaw {
  id: string
  type: FeeRuleType
  application_type: FeeApplicationType
  value: string // Comes as string from API (e.g., "1.5000")
  fee_amount: number
  description: string
}

/**
 * Applied fee rule (domain entity)
 */
export interface AppliedFeeRule {
  id: string
  type: FeeRuleType
  application_type: FeeApplicationType
  value: number
  fee_amount: number
  description: string
}

/**
 * Fee calculation entity
 */
export interface FeeCalculation {
  total_fee: number
  original_amount: number
  final_amount: number
  applied_rules: AppliedFeeRule[]
  transaction_number: number
}

/**
 * Fee calculation request DTO
 */
export interface FeeCalculationRequestDTO {
  amount: number
  transaction_number: number
  currency_from: string
  currency_to: string
}

/**
 * Fee calculation response DTO (from API - raw response)
 */
export interface FeeCalculationResponseDTORaw {
  total_fee: number
  original_amount: number
  final_amount: number
  applied_rules: AppliedFeeRuleRaw[]
  transaction_number: number
}

/**
 * Fee calculation response DTO (domain)
 */
export interface FeeCalculationResponseDTO {
  total_fee: number
  original_amount: number
  final_amount: number
  applied_rules: AppliedFeeRule[]
  transaction_number: number
}
