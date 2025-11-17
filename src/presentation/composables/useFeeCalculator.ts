import { ref, readonly, computed } from 'vue'
import type {
  FeeCalculation,
  FeeCalculationRequestDTO,
  FeeRuleType
} from '@/domain/entities/FeeCalculation'
import { CalculateFees } from '@/domain/use-cases/CalculateFees'
import { FeeCalculatorRepositoryImpl } from '@/infrastructure/repositories/FeeCalculatorRepositoryImpl'

/**
 * Grouped fee by type
 */
export interface GroupedFeeByType {
  type: FeeRuleType
  totalFeeAmount: number
  count: number
  rules: Array<{ id: string; value: number; fee_amount: number }>
}

/**
 * Fees grouped by type
 */
export interface FeesByType {
  PERCENTAGE: GroupedFeeByType | null
  FX_SPREAD: GroupedFeeByType | null
  FIXED: GroupedFeeByType | null
}

/**
 * Composable for fee calculation
 * Manages state and business logic for calculating transaction fees
 */
export function useFeeCalculator() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const feeCalculation = ref<FeeCalculation | null>(null)

  // Initialize use case with repository
  const repository = new FeeCalculatorRepositoryImpl()
  const calculateFeesUseCase = new CalculateFees(repository)

  /**
   * Calculate fees for a transaction
   * @param request - Fee calculation request
   */
  const calculateFees = async (request: FeeCalculationRequestDTO): Promise<void> => {
    loading.value = true
    error.value = null
    feeCalculation.value = null

    try {
      const result = await calculateFeesUseCase.execute(request)
      feeCalculation.value = result
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al calcular las comisiones'
      console.error('Error calculating fees:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Group and sum fees by type
   */
  const feesByType = computed<FeesByType>(() => {
    if (!feeCalculation.value || !feeCalculation.value.applied_rules) {
      return {
        PERCENTAGE: null,
        FX_SPREAD: null,
        FIXED: null
      }
    }

    const grouped: Record<
      FeeRuleType,
      {
        type: FeeRuleType
        totalFeeAmount: number
        count: number
        rules: Array<{ id: string; value: number; fee_amount: number }>
      }
    > = {
      PERCENTAGE: {
        type: 'PERCENTAGE',
        totalFeeAmount: 0,
        count: 0,
        rules: []
      },
      FX_SPREAD: {
        type: 'FX_SPREAD',
        totalFeeAmount: 0,
        count: 0,
        rules: []
      },
      FIXED: {
        type: 'FIXED',
        totalFeeAmount: 0,
        count: 0,
        rules: []
      }
    }

    // Group rules by type and sum fee amounts
    feeCalculation.value.applied_rules.forEach((rule) => {
      const group = grouped[rule.type]
      if (group) {
        group.totalFeeAmount += rule.fee_amount
        group.count += 1
        group.rules.push({
          id: rule.id,
          value: rule.value,
          fee_amount: rule.fee_amount
        })
      }
    })

    // Return null for types with no rules, creating readonly objects
    return {
      PERCENTAGE:
        grouped.PERCENTAGE.count > 0
          ? ({
              type: grouped.PERCENTAGE.type,
              totalFeeAmount: grouped.PERCENTAGE.totalFeeAmount,
              count: grouped.PERCENTAGE.count,
              rules: grouped.PERCENTAGE.rules
            } as GroupedFeeByType)
          : null,
      FX_SPREAD:
        grouped.FX_SPREAD.count > 0
          ? ({
              type: grouped.FX_SPREAD.type,
              totalFeeAmount: grouped.FX_SPREAD.totalFeeAmount,
              count: grouped.FX_SPREAD.count,
              rules: grouped.FX_SPREAD.rules
            } as GroupedFeeByType)
          : null,
      FIXED:
        grouped.FIXED.count > 0
          ? ({
              type: grouped.FIXED.type,
              totalFeeAmount: grouped.FIXED.totalFeeAmount,
              count: grouped.FIXED.count,
              rules: grouped.FIXED.rules
            } as GroupedFeeByType)
          : null
    }
  })

  /**
   * Reset fee calculation state
   */
  const reset = () => {
    loading.value = false
    error.value = null
    feeCalculation.value = null
  }

  return {
    // State (readonly)
    loading: readonly(loading),
    error: readonly(error),
    feeCalculation: readonly(feeCalculation),
    feesByType: readonly(feesByType),

    // Actions
    calculateFees,
    reset
  }
}
