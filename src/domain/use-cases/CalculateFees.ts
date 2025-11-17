import type { FeeCalculatorRepository } from '../repositories/FeeCalculatorRepository'
import type { FeeCalculation, FeeCalculationRequestDTO } from '../entities/FeeCalculation'

/**
 * Calculate Fees Use Case
 * Business logic for calculating transaction fees
 */
export class CalculateFees {
  constructor(private feeCalculatorRepository: FeeCalculatorRepository) {}

  /**
   * Execute fee calculation
   * @param request - Fee calculation request
   * @returns Promise with fee calculation result
   * @throws Error if validation fails
   */
  async execute(request: FeeCalculationRequestDTO): Promise<FeeCalculation> {
    // Validate request
    this.validate(request)

    // Calculate fees via repository
    const feeCalculation = await this.feeCalculatorRepository.calculate(request)

    return feeCalculation
  }

  /**
   * Validate fee calculation request
   * @param request - Request to validate
   * @throws Error if validation fails
   */
  private validate(request: FeeCalculationRequestDTO): void {
    if (request.amount <= 0) {
      throw new Error('El monto debe ser mayor a 0')
    }

    if (request.transaction_number < 0) {
      throw new Error('El número de transacción debe ser mayor o igual a 0')
    }

    if (!request.currency_from || request.currency_from.length !== 3) {
      throw new Error('La moneda de origen debe ser un código de 3 letras')
    }

    if (!request.currency_to || request.currency_to.length !== 3) {
      throw new Error('La moneda de destino debe ser un código de 3 letras')
    }
  }
}
