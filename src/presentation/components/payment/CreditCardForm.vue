<template>
  <div class="card-form">
    <!-- Animated Card Display -->
    <div class="card-list">
      <div class="card-item" :class="{ '-active': isCardFlipped }">
        <!-- Front of card -->
        <div class="card-item__side -front">
          <div
            class="card-item__focus"
            :class="{ '-active': focusElementStyle }"
            :style="focusElementStyle"
          ></div>
          <div class="card-item__cover"></div>

          <div class="card-item__wrapper">
            <div class="card-item__top">
              <img
                src="https://framerusercontent.com/images/kP3OZOFL7CTwodeQ6FNmA3tGi8s.png"
                class="card-item__chip"
                alt="Card chip"
              />
              <div class="card-item__type">
                <transition name="slide-fade-up">
                  <img
                    v-if="cardTypeImage && cleanCardNumber.length > 0"
                    :key="cardTypeImage"
                    :src="`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardTypeImage}.png`"
                    alt="Card type"
                    class="card-item__typeImg"
                  />
                </transition>
              </div>
            </div>

            <!-- Card Number Display -->
            <label for="cardNumber" class="card-item__number" ref="cardNumberLabel">
              <template v-if="cardBrand === 'amex'">
                <span v-for="(n, index) in amexCardMaskArray" :key="index">
                  <transition name="slide-fade-up">
                    <div
                      v-if="
                        n.trim() !== '' && getDigitAtMaskPosition(index, amexCardMaskArray) !== null
                      "
                      class="card-item__numberItem"
                    >
                      <template v-if="index > 4 && index < 14"> * </template>
                      <template v-else>
                        {{ getDigitAtMaskPosition(index, amexCardMaskArray) }}
                      </template>
                    </div>
                    <div
                      v-else
                      class="card-item__numberItem"
                      :class="{ '-active': n.trim() === '' }"
                    >
                      {{ n }}
                    </div>
                  </transition>
                </span>
              </template>

              <template v-else>
                <span v-for="(n, index) in otherCardMaskArray" :key="index">
                  <transition name="slide-fade-up">
                    <div
                      v-if="
                        n.trim() !== '' &&
                        getDigitAtMaskPosition(index, otherCardMaskArray) !== null
                      "
                      class="card-item__numberItem"
                    >
                      <template v-if="index > 4 && index < 15"> * </template>
                      <template v-else>
                        {{ getDigitAtMaskPosition(index, otherCardMaskArray) }}
                      </template>
                    </div>
                    <div
                      v-else
                      class="card-item__numberItem"
                      :class="{ '-active': n.trim() === '' }"
                    >
                      {{ n }}
                    </div>
                  </transition>
                </span>
              </template>
            </label>

            <!-- Card Holder and Expiration -->
            <div class="card-item__content">
              <label for="cardName" class="card-item__info" ref="cardNameLabel">
                <div class="card-item__holder">Card Holder</div>
                <transition name="slide-fade-up">
                  <div v-if="cardHolder.length" class="card-item__name" key="1">
                    <transition-group name="slide-fade-right">
                      <span
                        v-for="(char, index) in cardHolder.replace(/\s\s+/g, ' ')"
                        :key="index + 1"
                        class="card-item__nameItem"
                        >{{ char }}</span
                      >
                    </transition-group>
                  </div>
                  <div v-else class="card-item__name" key="2">Full Name</div>
                </transition>
              </label>
              <div class="card-item__date" ref="cardDateLabel">
                <label for="cardMonth" class="card-item__dateTitle">Expires</label>
                <label for="cardMonth" class="card-item__dateItem">
                  <transition name="slide-fade-up">
                    <span v-if="displayMonth" :key="displayMonth">{{ displayMonth }}</span>
                    <span v-else key="2">MM</span>
                  </transition>
                </label>
                /
                <label for="cardYear" class="card-item__dateItem">
                  <transition name="slide-fade-up">
                    <span v-if="displayYear" :key="displayYear">{{ displayYear }}</span>
                    <span v-else key="2">YY</span>
                  </transition>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Back of card -->
        <div class="card-item__side -back">
          <div class="card-item__cover"></div>
          <div class="card-item__band"></div>
          <div class="card-item__cvv">
            <div class="card-item__cvvTitle">CVV</div>
            <div class="card-item__cvvBand">
              <span v-for="(n, index) in cvv" :key="index">*</span>
            </div>
            <div class="card-item__type">
              <img
                v-if="cardTypeImage"
                :src="`https://raw.githubusercontent.com/muhammederdem/credit-card-form/master/src/assets/images/${cardTypeImage}.png`"
                class="card-item__typeImg"
                alt="Card type"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Form Inputs -->
    <form @submit.prevent="handleSubmit" class="card-form__form">
      <div class="card-input">
        <label for="cardNumber" class="card-input__label">Card Number</label>
        <input
          id="cardNumber"
          type="text"
          class="card-input__input"
          :class="{ 'is-invalid': cardNumberError, 'is-valid': cardNumberValid }"
          v-model="displayCardNumber"
          @input="handleCardNumberInput"
          @focus="handleFocus('cardNumber')"
          @blur="handleBlur"
          placeholder="1234 5678 9012 3456"
          maxlength="19"
          autocomplete="off"
        />
        <span v-if="cardNumberError" class="card-input__error">{{ cardNumberError }}</span>
      </div>

      <div class="card-input">
        <label for="cardName" class="card-input__label">Card Holder</label>
        <input
          id="cardName"
          type="text"
          class="card-input__input"
          :class="{ 'is-invalid': cardHolderError, 'is-valid': cardHolderValid }"
          v-model="cardHolderInput"
          @focus="handleFocus('cardName')"
          @blur="handleBlur"
          placeholder="JOHN DOE"
          autocomplete="off"
        />
        <span v-if="cardHolderError" class="card-input__error">{{ cardHolderError }}</span>
      </div>

      <div class="card-form__row">
        <div class="card-form__col">
          <div class="card-form__group">
            <label for="cardMonth" class="card-input__label">Expiration Date</label>
            <div class="card-input__expiration">
              <input
                id="cardMonth"
                type="text"
                class="card-input__input"
                :class="{ 'is-invalid': expirationError, 'is-valid': expirationValid }"
                v-model="displayExpiration"
                @input="handleExpirationInput"
                @focus="handleFocus('cardDate')"
                @blur="handleBlur"
                placeholder="MM/YY"
                maxlength="5"
                autocomplete="off"
              />
            </div>
            <span v-if="expirationError" class="card-input__error">{{ expirationError }}</span>
          </div>
        </div>
        <div class="card-form__col -cvv">
          <div class="card-input">
            <label for="cardCvv" class="card-input__label">CVV</label>
            <input
              id="cardCvv"
              type="text"
              class="card-input__input"
              :class="{ 'is-invalid': cvvError, 'is-valid': cvvValid }"
              v-model="cvvInput"
              @input="handleCVVInput"
              @focus="handleCVVFocus"
              @blur="handleCVVBlur"
              :placeholder="cvvPlaceholder"
              :maxlength="cvvMaxLength"
              inputmode="numeric"
              autocomplete="off"
            />
            <span v-if="cvvError" class="card-input__error">{{ cvvError }}</span>
          </div>
        </div>
      </div>

      <div class="card-input">
        <label class="card-input__checkbox">
          <input
            v-model="termsAcceptedInput"
            type="checkbox"
            class="card-input__checkbox-input"
            required
          />
          <span class="card-input__checkbox-label">
            Acepto los <a href="#" class="card-input__link">términos y condiciones</a>
          </span>
        </label>
      </div>

      <button type="submit" class="card-form__button" :disabled="!isFormValid || loading">
        {{ loading ? 'Procesando...' : 'Pagar' }}
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { formatCardNumber, formatExpirationDate } from '@/utils/formatters'
import { useCardAnimation } from '@/presentation/composables/useCardAnimation'
import { useCardDisplay } from '@/presentation/composables/useCardDisplay'

/**
 * Credit Card Form Component
 * Pure presentational component with animated 3D card display
 */
const props = defineProps<{
  cardNumber: string
  cardHolder: string
  expirationDate: string
  cvv: string
  termsAccepted: boolean
  cardBrand: string
  isFormValid: boolean
  loading: boolean
  validationState: {
    cardNumber: { isValid: boolean; error: string | null }
    cardHolder: { isValid: boolean; error: string | null }
    expirationDate: { isValid: boolean; error: string | null }
    cvv: { isValid: boolean; error: string | null }
  }
}>()

const emit = defineEmits<{
  'update:cardNumber': [value: string]
  'update:cardHolder': [value: string]
  'update:expirationDate': [value: string]
  'update:cvv': [value: string]
  'update:termsAccepted': [value: boolean]
  'validate:cardNumber': []
  'validate:cardHolder': []
  'validate:expirationDate': []
  'validate:cvv': []
  submit: []
}>()

// Refs for card elements
const cardNumberLabel = ref<HTMLElement | null>(null)
const cardNameLabel = ref<HTMLElement | null>(null)
const cardDateLabel = ref<HTMLElement | null>(null)

// Use animation composable
const { isCardFlipped, flipCard, focusInput, blurInput } = useCardAnimation()

// Use display composable
const { amexCardMask, otherCardMask, getRandomBackground } = useCardDisplay(
  props.cardNumber,
  props.cardBrand,
  props.expirationDate
)

// Random background for card
const currentCardBackground = ref(getRandomBackground())

// Card type image - computed reactively from props.cardBrand
const cardTypeImage = computed(() => {
  const brandMap: Record<string, string> = {
    visa: 'visa',
    mastercard: 'mastercard',
    amex: 'amex',
    discover: 'discover',
    unknown: 'visa' // default
  }
  return brandMap[props.cardBrand] || 'visa'
})

// Clean card number without spaces for display logic
const cleanCardNumber = computed(() => props.cardNumber.replace(/\s/g, ''))

// Get mask arrays as regular arrays (unwrap computed)
const amexCardMaskArray = computed(() => amexCardMask.value)
const otherCardMaskArray = computed(() => otherCardMask.value)

// Helper function to get digit at mask position
const getDigitAtMaskPosition = (maskIndex: number, maskArray: string[]): string | null => {
  // Count how many non-space characters are before this index in the mask
  let digitIndex = 0
  for (let i = 0; i < maskIndex; i++) {
    if (maskArray[i]?.trim() !== '') {
      digitIndex++
    }
  }

  // Return the digit at that position in the clean card number, or null if out of bounds
  if (digitIndex < cleanCardNumber.value.length) {
    return cleanCardNumber.value[digitIndex]
  }
  return null
}

// Display values with formatting
const displayCardNumber = computed({
  get: () => formatCardNumber(props.cardNumber),
  set: (value: string) => emit('update:cardNumber', value.replace(/\s/g, ''))
})

const cardHolderInput = computed({
  get: () => props.cardHolder,
  set: (value: string) => emit('update:cardHolder', value.toUpperCase())
})

const displayExpiration = computed({
  get: () => props.expirationDate,
  set: (value: string) => {
    const formatted = formatExpirationDate(value)
    emit('update:expirationDate', formatted)
  }
})

const cvvInput = computed({
  get: () => props.cvv,
  set: (value: string) => emit('update:cvv', value.replace(/\D/g, ''))
})

const termsAcceptedInput = computed({
  get: () => props.termsAccepted,
  set: (value: boolean) => emit('update:termsAccepted', value)
})

// Extract month and year for display
const displayMonth = computed(() => {
  if (!props.expirationDate || props.expirationDate.length < 2) return ''
  return props.expirationDate.substring(0, 2)
})

const displayYear = computed(() => {
  if (!props.expirationDate || props.expirationDate.length < 5) return ''
  return props.expirationDate.substring(3, 5)
})

// Validation states
const cardNumberError = computed(() => props.validationState.cardNumber.error)
const cardNumberValid = computed(() => props.validationState.cardNumber.isValid)

const cardHolderError = computed(() => props.validationState.cardHolder.error)
const cardHolderValid = computed(() => props.validationState.cardHolder.isValid)

const expirationError = computed(() => props.validationState.expirationDate.error)
const expirationValid = computed(() => props.validationState.expirationDate.isValid)

const cvvError = computed(() => props.validationState.cvv.error)
const cvvValid = computed(() => props.validationState.cvv.isValid)

// CVV placeholder and max length based on card brand
const cvvPlaceholder = computed(() => {
  return props.cardBrand === 'amex' ? '1234' : '123'
})

const cvvMaxLength = computed(() => {
  return props.cardBrand === 'amex' ? 4 : 3
})

// Focus element style (for now simplified)
const focusElementStyle = computed(() => null)

// Input handlers
const handleCardNumberInput = () => {
  emit('update:cardNumber', props.cardNumber)
}

const handleExpirationInput = () => {
  emit('update:expirationDate', props.expirationDate)
}

const handleCVVInput = () => {
  emit('update:cvv', props.cvv)
}

// Focus handlers
const handleFocus = (ref: string) => {
  focusInput(ref)
  if (isCardFlipped.value) {
    flipCard(false)
  }
}

const handleBlur = () => {
  blurInput()
  // Trigger validation on blur
  if (props.cardNumber) emit('validate:cardNumber')
  if (props.cardHolder) emit('validate:cardHolder')
  if (props.expirationDate) emit('validate:expirationDate')
}

const handleCVVFocus = () => {
  flipCard(true)
  focusInput('cardCvv')
}

const handleCVVBlur = () => {
  flipCard(false)
  blurInput()
  if (props.cvv) emit('validate:cvv')
}

const handleSubmit = () => {
  emit('submit')
}

// Auto-focus on mount
onMounted(() => {
  const cardNumberInput = document.getElementById('cardNumber')
  if (cardNumberInput) {
    cardNumberInput.focus()
  }
})
</script>

<style scoped src="./styles/CreditCardForm.scss" lang="scss"></style>
