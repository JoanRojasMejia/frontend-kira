import { ref, computed, onMounted, onUnmounted } from 'vue'
import { formatTimeRemaining } from '@/utils/formatters'

/**
 * Countdown Composable
 * Manages countdown timer for expiration dates
 */
export function useCountdown(expiresAt: string | null) {
  const timeRemaining = ref(formatTimeRemaining(expiresAt))
  let intervalId: number | null = null

  const isExpiringRapidly = computed(() => {
    if (!expiresAt) return false

    const expirationDate = new Date(expiresAt)
    const now = new Date()
    const diff = expirationDate.getTime() - now.getTime()
    const minutesRemaining = Math.floor(diff / (1000 * 60))

    return minutesRemaining <= 5
  })

  const updateCountdown = (onExpired?: () => void) => {
    if (!expiresAt) return

    const expirationDate = new Date(expiresAt)
    const now = new Date()

    if (now > expirationDate) {
      timeRemaining.value = 'Expirado'
      if (intervalId !== null) {
        clearInterval(intervalId)
      }
      if (onExpired) {
        onExpired()
      }
      return
    }

    timeRemaining.value = formatTimeRemaining(expiresAt)
  }

  const startCountdown = (onExpired?: () => void) => {
    if (expiresAt) {
      intervalId = window.setInterval(() => updateCountdown(onExpired), 1000)
    }
  }

  const stopCountdown = () => {
    if (intervalId !== null) {
      clearInterval(intervalId)
    }
  }

  return {
    timeRemaining,
    isExpiringRapidly,
    startCountdown,
    stopCountdown
  }
}
