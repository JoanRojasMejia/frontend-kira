import type {
  FxConversionRequestDTO,
  FxConversionResponseDTO
} from '@/domain/entities/FxConversion'
import { apiClient, type ApiError } from '../http/apiClient'

/**
 * FX Conversion Service
 * Handles API calls to FX conversion backend
 */
class FxConversionService {
  /**
   * Convert currency from one to another
   * @param request - FX conversion request
   * @returns Promise with FX conversion result
   */
  async convert(request: FxConversionRequestDTO): Promise<FxConversionResponseDTO> {
    try {
      const response = await apiClient.post<FxConversionResponseDTO>(
        '/mock-services/fx/convert',
        request
      )
      return response
    } catch (error) {
      const apiError = error as ApiError
      console.error('Error converting currency:', apiError)
      throw new Error(apiError.message || 'Error al convertir la moneda')
    }
  }
}

// Export singleton instance
export const fxConversionService = new FxConversionService()
