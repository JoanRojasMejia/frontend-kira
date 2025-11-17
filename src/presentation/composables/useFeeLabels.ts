import type { GroupedFeeByType } from './useFeeCalculator'

/**
 * Fee Labels Composable
 * Provides human-readable labels for fee types
 */
export function useFeeLabels() {
  /**
   * Get human-readable label for fee type (grouped)
   * @param type - Fee type (FIXED, PERCENTAGE, FX_SPREAD)
   * @param groupedFee - Grouped fee data
   * @returns Formatted label
   */
  const getFeeLabelForType = (type: string, groupedFee: GroupedFeeByType): string => {
    if (type === 'FIXED') {
      return 'Comisión Fija'
    }

    if (type === 'PERCENTAGE') {
      // If multiple rules, show range or average
      if (groupedFee.count > 1) {
        const values = groupedFee.rules.map((r) => r.value)
        const min = Math.min(...values)
        const max = Math.max(...values)
        if (min === max) {
          return `Comisión (${min}%)`
        }
        return `Comisión (${min}% - ${max}%)`
      }
      return `Comisión (${groupedFee.rules[0]?.value || 0}%)`
    }

    if (type === 'FX_SPREAD') {
      // If multiple rules, show range or average
      if (groupedFee.count > 1) {
        const values = groupedFee.rules.map((r) => r.value)
        const min = Math.min(...values)
        const max = Math.max(...values)
        if (min === max) {
          return `Conversión de Moneda (${min}%)`
        }
        return `Conversión de Moneda (${min}% - ${max}%)`
      }
      return `Conversión de Moneda (${groupedFee.rules[0]?.value || 0}%)`
    }

    return 'Comisión'
  }

  return {
    getFeeLabelForType
  }
}
