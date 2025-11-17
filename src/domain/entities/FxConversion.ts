/**
 * FX Conversion Request DTO
 */
export interface FxConversionRequestDTO {
  from_currency: string
  to_currency: string
  amount: number
}

/**
 * FX Conversion Response DTO
 */
export interface FxConversionResponseDTO {
  from_currency: string
  to_currency: string
  amount: number
  converted_amount: number
  exchange_rate: number
  timestamp: string
  rate_source: string
}

/**
 * FX Conversion Entity
 */
export interface FxConversion {
  fromCurrency: string
  toCurrency: string
  amount: number
  convertedAmount: number
  exchangeRate: number
  timestamp: string
  rateSource: string
}
