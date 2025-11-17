import type { FeeCalculatorRepository } from '@/domain/repositories/FeeCalculatorRepository'
import type { FeeCalculation, FeeCalculationRequestDTO } from '@/domain/entities/FeeCalculation'
import { feeCalculatorService } from '@/infrastructure/services/FeeCalculatorService'

/**
 * Fee Calculator Repository Implementation
 * Implements the domain repository interface using the fee calculator service
 */
export class FeeCalculatorRepositoryImpl implements FeeCalculatorRepository {
  /**
   * Calculate fees for a transaction
   * @param request - Fee calculation request
   * @returns Promise with fee calculation result
   */
  async calculate(request: FeeCalculationRequestDTO): Promise<FeeCalculation> {
    return await feeCalculatorService.calculate(request)
  }
}
