import type {
  FeeCalculation,
  FeeCalculationRequestDTO,
  FeeCalculationResponseDTORaw
} from '@/domain/entities/FeeCalculation'
import { apiClient, type ApiError } from '../http/apiClient'

/**
 * Normalizes fee calculation data from API to ensure correct types
 * Converts string numbers to actual numbers
 */
function normalizeFeeCalculation(data: FeeCalculationResponseDTORaw): FeeCalculation {
  return {
    total_fee: data.total_fee,
    original_amount: data.original_amount,
    final_amount: data.final_amount,
    applied_rules: data.applied_rules.map((rule) => ({
      id: rule.id,
      type: rule.type,
      application_type: rule.application_type,
      value: parseFloat(rule.value), // Convert string to number
      fee_amount: rule.fee_amount,
      description: rule.description
    })),
    transaction_number: data.transaction_number
  }
}

/**
 * Fee Calculator Service
 * Handles API calls to fee calculator backend
 */
class FeeCalculatorService {
  /**
   * Calculate fees for a transaction
   * @param request - Fee calculation request
   * @returns Promise with fee calculation result
   */
  async calculate(request: FeeCalculationRequestDTO): Promise<FeeCalculation> {
    try {
      // Ensure amount is sent as integer
      const requestWithIntegerAmount = {
        ...request,
        amount: Math.round(request.amount)
      }

      const response = await apiClient.post<FeeCalculationResponseDTORaw>(
        '/fee-calculator/calculate',
        requestWithIntegerAmount
      )
      return normalizeFeeCalculation(response)
    } catch (error) {
      const apiError = error as ApiError
      console.error('Error calculating fees:', apiError)
      throw new Error(apiError.message || 'Error al calcular las comisiones')
    }
  }
}

// Export singleton instance
export const feeCalculatorService = new FeeCalculatorService()
