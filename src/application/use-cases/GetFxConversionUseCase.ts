import type {
  FxConversion,
  FxConversionRequestDTO,
  FxConversionResponseDTO
} from '@/domain/entities/FxConversion'
import { fxConversionService } from '@/infrastructure/services/FxConversionService'

/**
 * Get FX Conversion Use Case
 * Application layer - orchestrates the currency conversion flow
 */
export class GetFxConversionUseCase {
  /**
   * Execute the FX conversion use case
   * @param fromCurrency - Source currency (e.g., "USD")
   * @param toCurrency - Target currency (e.g., "MXN")
   * @param amount - Amount to convert (total with fees)
   * @returns FX conversion result
   */
  async execute(fromCurrency: string, toCurrency: string, amount: number): Promise<FxConversion> {
    // Prepare request
    const request: FxConversionRequestDTO = {
      from_currency: fromCurrency,
      to_currency: toCurrency,
      amount: amount
    }

    // Call service
    const response: FxConversionResponseDTO = await fxConversionService.convert(request)

    // Map to domain entity
    return this.mapToDomain(response)
  }

  /**
   * Maps API response to domain entity
   * @param response - API response
   * @returns Domain entity
   */
  private mapToDomain(response: FxConversionResponseDTO): FxConversion {
    return {
      fromCurrency: response.from_currency,
      toCurrency: response.to_currency,
      amount: response.amount,
      convertedAmount: response.converted_amount,
      exchangeRate: response.exchange_rate,
      timestamp: response.timestamp,
      rateSource: response.rate_source
    }
  }
}
