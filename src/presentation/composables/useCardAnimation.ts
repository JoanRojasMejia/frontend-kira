import { ref, computed } from 'vue'

/**
 * Composable for credit card animation
 * Handles card flip and focus area animations
 */
export function useCardAnimation() {
  const isCardFlipped = ref(false)
  const focusedElement = ref<string | null>(null)
  const isInputFocused = ref(false)

  /**
   * Focus element style for highlight animation
   */
  const focusElementStyle = computed(() => {
    if (!focusedElement.value || !isInputFocused.value) {
      return null
    }
    // Style will be calculated based on element dimensions
    return {}
  })

  /**
   * Flips card to show back (CVV side)
   */
  const flipCard = (flip: boolean) => {
    isCardFlipped.value = flip
  }

  /**
   * Handles input focus event
   */
  const focusInput = (elementRef: string) => {
    isInputFocused.value = true
    focusedElement.value = elementRef
  }

  /**
   * Handles input blur event
   */
  const blurInput = () => {
    setTimeout(() => {
      if (!isInputFocused.value) {
        focusedElement.value = null
      }
    }, 300)
    isInputFocused.value = false
  }

  /**
   * Calculates focus element position and dimensions
   */
  const calculateFocusStyle = (target: HTMLElement): Record<string, string> => {
    return {
      width: `${target.offsetWidth}px`,
      height: `${target.offsetHeight}px`,
      transform: `translateX(${target.offsetLeft}px) translateY(${target.offsetTop}px)`
    }
  }

  return {
    // State
    isCardFlipped,
    focusedElement,
    focusElementStyle,
    isInputFocused,

    // Methods
    flipCard,
    focusInput,
    blurInput,
    calculateFocusStyle
  }
}
