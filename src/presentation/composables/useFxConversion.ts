import { ref, readonly } from 'vue'
import type { FxConversion } from '@/domain/entities/FxConversion'
import { GetFxConversionUseCase } from '@/application/use-cases/GetFxConversionUseCase'

/**
 * FX Conversion Composable
 * Manages FX conversion state and operations
 */
export function useFxConversion() {
  const loading = ref(false)
  const error = ref<string | null>(null)
  const fxConversion = ref<FxConversion | null>(null)

  const getFxConversionUseCase = new GetFxConversionUseCase()

  /**
   * Get FX conversion for a given amount
   * @param fromCurrency - Source currency
   * @param toCurrency - Target currency
   * @param amount - Amount to convert (total with fees)
   */
  const getConversion = async (fromCurrency: string, toCurrency: string, amount: number) => {
    loading.value = true
    error.value = null
    fxConversion.value = null

    try {
      const conversion = await getFxConversionUseCase.execute(fromCurrency, toCurrency, amount)
      fxConversion.value = conversion
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Error al obtener la conversión de moneda'
      console.error('FX Conversion error:', err)
    } finally {
      loading.value = false
    }
  }

  /**
   * Reset conversion state
   */
  const reset = () => {
    loading.value = false
    error.value = null
    fxConversion.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    fxConversion: readonly(fxConversion),
    getConversion,
    reset
  }
}
