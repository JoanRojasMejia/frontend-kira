import { ref, computed } from 'vue'

/**
 * Clipboard Composable
 * Manages clipboard operations and sharing
 */
export function useClipboard() {
  const copied = ref(false)

  const canShare = computed(() => {
    return 'share' in navigator
  })

  /**
   * Copy text to clipboard
   * @param text - Text to copy
   */
  const copyToClipboard = async (text: string): Promise<boolean> => {
    try {
      await navigator.clipboard.writeText(text)
      copied.value = true

      setTimeout(() => {
        copied.value = false
      }, 2000)

      return true
    } catch (error) {
      console.error('Failed to copy:', error)
      return false
    }
  }

  /**
   * Share using Web Share API
   * @param data - Data to share
   */
  const share = async (data: { title: string; text: string; url: string }): Promise<boolean> => {
    try {
      await navigator.share(data)
      return true
    } catch (error) {
      // User cancelled or share failed
      console.error('Share failed:', error)
      return false
    }
  }

  return {
    copied,
    canShare,
    copyToClipboard,
    share
  }
}
