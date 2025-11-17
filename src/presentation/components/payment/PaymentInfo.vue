<template>
  <div class="payment-info">
    <div class="payment-title-wrapper">
      <img
        src="https://vectorseek.com/wp-content/uploads/2023/10/Adidas-originals-horizontal-Logo-Vector.svg-.png"
        alt="Logo"
        class="payment-logo"
      />
    </div>

    <div class="info-row">
      <div>
        <div class="info-label">Comercio</div>
        <div class="info-value info-value--left">{{ paymentLink.merchant_id }}</div>
      </div>
    </div>

    <div class="info-row">
      <div>
        <div class="info-label">Descripción</div>
        <div class="info-value info-value--left">{{ paymentLink.description }}</div>
      </div>
    </div>

    <div class="summary">
      <div class="summary-row">
        <span class="info-label">Subtotal</span>
        <span class="info-value">${{ paymentLink.amount_usd.toFixed(2) }} USD</span>
      </div>

      <!-- Loading fees -->
      <div v-if="loadingFees" class="summary-row">
        <span class="info-label">Calculando comisiones...</span>
        <span class="info-value loading-spinner">⏳</span>
      </div>

      <!-- Fees breakdown -->
      <template v-else-if="feeCalculation && feesByType">
        <!-- PERCENTAGE fees -->
        <div v-if="feesByType.PERCENTAGE" class="summary-row summary-row--fee">
          <span class="info-label">
            {{ getFeeLabelForType('PERCENTAGE', feesByType.PERCENTAGE) }}
          </span>
          <span class="info-value info-value--fee">
            ${{ feesByType.PERCENTAGE.totalFeeAmount.toFixed(2) }} USD
          </span>
        </div>

        <!-- FX_SPREAD fees -->
        <div v-if="feesByType.FX_SPREAD" class="summary-row summary-row--fee">
          <span class="info-label">
            {{ getFeeLabelForType('FX_SPREAD', feesByType.FX_SPREAD) }}
          </span>
          <span class="info-value info-value--fee">
            ${{ feesByType.FX_SPREAD.totalFeeAmount.toFixed(2) }} USD
          </span>
        </div>

        <!-- FIXED fees -->
        <div v-if="feesByType.FIXED" class="summary-row summary-row--fee">
          <span class="info-label">
            {{ getFeeLabelForType('FIXED', feesByType.FIXED) }}
          </span>
          <span class="info-value info-value--fee">
            ${{ feesByType.FIXED.totalFeeAmount.toFixed(2) }} USD
          </span>
        </div>

        <div class="summary-row summary-row--total-fee">
          <span class="info-label info-label--bold">Total Comisiones</span>
          <span class="info-value info-value--fee-total">
            ${{ feeCalculation.total_fee.toFixed(2) }} USD
          </span>
        </div>
      </template>
    </div>

    <div class="total-row">
      <span class="total-label">Total a Pagar</span>
      <span class="total-amount"> ${{ finalAmount.toFixed(2) }} USD </span>
    </div>

    <!-- FX Conversion -->
    <div class="conversion-section">
      <div v-if="loadingFxConversion" class="conversion-loading">
        <span class="info-label">Calculando conversión...</span>
        <span class="loading-spinner">⏳</span>
      </div>

      <div v-else-if="fxConversion" class="conversion-result">
        <div class="conversion-row">
          <span class="conversion-label">Tipo de cambio:</span>
          <span class="conversion-value">
            ${{ fxConversion.exchangeRate.toFixed(2) }} MXN por USD
          </span>
        </div>
        <div class="conversion-row conversion-row--total">
          <span class="conversion-label conversion-label--bold">Total en MXN:</span>
          <span class="conversion-amount">
            ${{ fxConversion.convertedAmount.toFixed(2) }} MXN
          </span>
        </div>
      </div>
    </div>

    <div v-if="paymentLink.expires_at" class="info-row expiration-row">
      <span class="info-label">Tiempo restante:</span>
      <span
        class="expiration-countdown"
        :class="{ 'expiration-countdown--warning': isExpiringRapidly }"
      >
        {{ timeRemaining }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import type { PaymentLink } from '@/domain/entities/PaymentLink'
import type { FeeCalculation } from '@/domain/entities/FeeCalculation'
import type { FxConversion } from '@/domain/entities/FxConversion'
import type { FeesByType } from '@/presentation/composables/useFeeCalculator'
import { useCountdown } from '@/presentation/composables/useCountdown'
import { useFeeLabels } from '@/presentation/composables/useFeeLabels'
import { convertUsdToMxn } from '@/utils/formatters'

/**
 * Payment Info Component
 * Pure presentational component - displays payment link information
 */
const props = defineProps<{
  paymentLink: PaymentLink
  feeCalculation?: FeeCalculation | null
  feesByType?: FeesByType | null
  loadingFees?: boolean
  fxConversion?: FxConversion | null
  loadingFxConversion?: boolean
}>()

const emit = defineEmits<{
  expired: []
}>()

// Composables
const { timeRemaining, isExpiringRapidly, startCountdown, stopCountdown } = useCountdown(
  props.paymentLink.expires_at
)
const { getFeeLabelForType } = useFeeLabels()

// Computed properties
const mxnAmount = computed(() => {
  return convertUsdToMxn(props.paymentLink.amount_usd)
})

const finalAmount = computed(() => {
  if (props.feeCalculation) {
    return props.feeCalculation.final_amount
  }
  return props.paymentLink.amount_usd
})

// Lifecycle
onMounted(() => {
  startCountdown(() => emit('expired'))
})

onUnmounted(() => {
  stopCountdown()
})
</script>

<style scoped src="./styles/PaymentInfo.scss" lang="scss"></style>
