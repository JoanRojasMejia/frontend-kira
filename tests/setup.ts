import { config } from '@vue/test-utils'
import { vi } from 'vitest'

// Mock de navigator.clipboard
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn().mockResolvedValue(undefined)
  },
  writable: true,
  configurable: true
})

// Mock de Web Share API
Object.defineProperty(navigator, 'share', {
  value: vi.fn().mockResolvedValue(undefined),
  writable: true,
  configurable: true
})

// Configuración global de Vue Test Utils
config.global.mocks = {
  $t: (key: string) => key
}
