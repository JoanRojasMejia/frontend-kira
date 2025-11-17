/**
 * API Client
 * Centralized HTTP client for making API requests
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

if (!API_BASE_URL) {
  throw new Error('VITE_API_BASE_URL is not defined in environment variables')
}

export interface ApiError {
  message: string
  status?: number
  data?: unknown
}

class ApiClient {
  private baseURL: string

  constructor(baseURL: string) {
    this.baseURL = baseURL
  }

  /**
   * Makes a GET request
   * @param endpoint - API endpoint (without base URL)
   * @param options - Fetch options
   * @returns Response data
   */
  async get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'GET'
    })
  }

  /**
   * Makes a POST request
   * @param endpoint - API endpoint (without base URL)
   * @param body - Request body
   * @param options - Fetch options
   * @returns Response data
   */
  async post<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    })
  }

  /**
   * Makes a PUT request
   * @param endpoint - API endpoint (without base URL)
   * @param body - Request body
   * @param options - Fetch options
   * @returns Response data
   */
  async put<T>(endpoint: string, body?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers
      },
      body: body ? JSON.stringify(body) : undefined
    })
  }

  /**
   * Makes a DELETE request
   * @param endpoint - API endpoint (without base URL)
   * @param options - Fetch options
   * @returns Response data
   */
  async delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: 'DELETE'
    })
  }

  /**
   * Makes a generic HTTP request
   * @param endpoint - API endpoint (without base URL)
   * @param options - Fetch options
   * @returns Response data
   * @throws ApiError if request fails
   */
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    try {
      const response = await fetch(url, options)

      // Try to parse response as JSON
      let data: unknown
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        data = await response.text()
      }

      // Check if response is successful
      if (!response.ok) {
        const error: ApiError = {
          message: typeof data === 'object' && data !== null && 'message' in data
            ? String(data.message)
            : `HTTP error ${response.status}`,
          status: response.status,
          data
        }
        throw error
      }

      return data as T
    } catch (error) {
      // If it's already an ApiError, re-throw it
      if (error && typeof error === 'object' && 'status' in error) {
        throw error
      }

      // Otherwise, wrap it in an ApiError
      const apiError: ApiError = {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        data: error
      }
      throw apiError
    }
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_BASE_URL)

// Export class for testing purposes
export { ApiClient }
