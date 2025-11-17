import type { FeeCalculation, FeeCalculationRequestDTO } from '../entities/FeeCalculation'

/**
 * Fee Calculator Repository Interface
 * Defines the contract for fee calculation operations
 */
export interface FeeCalculatorRepository {
  /**
   * Calculate fees for a transaction
   * @param request - Fee calculation request data
   * @returns Promise with fee calculation result
   */
  calculate(request: FeeCalculationRequestDTO): Promise<FeeCalculation>
}
