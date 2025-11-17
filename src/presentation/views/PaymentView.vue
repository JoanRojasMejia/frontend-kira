<template>
  <div class="payment-view">
    <div class="container">
      <div class="payment-container">
        <!-- Loading State -->
        <LoadingSpinner v-if="loadingLink" message="Cargando información del pago..." />

        <!-- Error Loading Link -->
        <ErrorMessage
          v-else-if="linkError"
          title="Error"
          :message="linkError"
          @retry="loadPaymentLink"
        />

        <!-- Link Expired -->
        <PaymentStatusView
          v-else-if="paymentLink && paymentLink.status === 'EXPIRED'"
          status="expired"
        />

        <!-- Link Already Completed -->
        <PaymentStatusView
          v-else-if="paymentLink && paymentLink.status === 'COMPLETED'"
          status="completed"
        />

        <!-- Payment Success -->
        <PaymentStatusView
          v-else-if="paymentResult && paymentResult.status === 'success'"
          status="success"
          :transaction-id="paymentResult.transaction_id"
          :amount="paymentResult.total_amount"
        />

        <!-- Payment Error -->
        <PaymentStatusView
          v-else-if="paymentError || (paymentResult && (paymentResult.status === 'error' || paymentResult.status === 'failed'))"
          status="error"
          :error-message="
            paymentError ||
            ((paymentResult?.status === 'error' || paymentResult?.status === 'failed') ? paymentResult.error_message : undefined)
          "
          @retry="handleRetryPayment"
        />

        <!-- Valid Link - Show Payment Form -->
        <div v-else-if="paymentLink" class="payment-container-inner">
          <PaymentInfo
            :payment-link="paymentLink"
            :fee-calculation="feeCalculation"
            :fees-by-type="feesByType"
            :loading-fees="loadingFees"
            :fx-conversion="fxConversion"
            :loading-fx-conversion="loadingFxConversion"
            @expired="handleLinkExpired"
          />

          <CreditCardForm
            v-model:card-number="cardNumber"
            v-model:card-holder="cardHolder"
            v-model:expiration-date="expirationDate"
            v-model:cvv="cvv"
            v-model:terms-accepted="termsAccepted"
            :card-brand="cardBrand"
            :is-form-valid="isFormValid"
            :loading="loadingPayment"
            :validation-state="validationState"
            @validate:card-number="validateCardNumber"
            @validate:card-holder="validateCardHolder"
            @validate:expiration-date="validateExpirationDate"
            @validate:cvv="validateCVV"
            @submit="handlePayment"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePaymentLink } from '@/presentation/composables/usePaymentLink'
import { usePayment } from '@/presentation/composables/usePayment'
import { useCreditCardValidation } from '@/presentation/composables/useCreditCardValidation'
import { useTokenization } from '@/presentation/composables/useTokenization'
import { useFeeCalculator } from '@/presentation/composables/useFeeCalculator'
import { useFxConversion } from '@/presentation/composables/useFxConversion'
import PaymentInfo from '@/presentation/components/payment/PaymentInfo.vue'
import CreditCardForm from '@/presentation/components/payment/CreditCardForm.vue'
import PaymentStatusView from '@/presentation/components/payment/PaymentStatusView.vue'
import LoadingSpinner from '@/presentation/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/presentation/components/shared/ErrorMessage.vue'

/**
 * Payment View
 * Orchestrates the payment flow
 */
const route = useRoute()
const paymentLinkId = route.params.id as string

// Composables
const { loading: loadingLink, error: linkError, paymentLink, fetchPaymentLink } = usePaymentLink()

const {
  loading: loadingPayment,
  error: paymentError,
  paymentResult,
  processPayment,
  reset: resetPayment
} = usePayment()

const {
  cardNumber,
  cardHolder,
  expirationDate,
  cvv,
  termsAccepted,
  validationState,
  cardBrand,
  isFormValid,
  validateCardNumber,
  validateCardHolder,
  validateExpirationDate,
  validateCVV,
  validateAll,
  reset: resetValidation
} = useCreditCardValidation()

const { token, tokenize, reset: resetTokenization } = useTokenization()

const {
  loading: loadingFees,
  error: feesError,
  feeCalculation,
  feesByType,
  calculateFees,
  reset: resetFees
} = useFeeCalculator()

const {
  loading: loadingFxConversion,
  error: fxError,
  fxConversion,
  getConversion,
  reset: resetFxConversion
} = useFxConversion()

const loadPaymentLink = async () => {
  await fetchPaymentLink(paymentLinkId)
}

// Calculate fees when payment link is loaded
watch(paymentLink, async (link) => {
  if (link && link.status === 'PENDING') {
    await calculateFees({
      amount: link.amount_usd,
      transaction_number: 1, // You can track this or get it from somewhere
      currency_from: 'USD',
      currency_to: link.currency_to || 'MXN'
    })
  }
})

// Calculate FX conversion when fees are calculated
watch(feeCalculation, async (fees) => {
  if (fees && paymentLink.value) {
    // Get total amount with fees
    const totalAmount = fees.final_amount

    // Get FX conversion
    await getConversion(
      paymentLink.value.currency_from,
      paymentLink.value.currency_to || 'MXN',
      totalAmount
    )
  }
})

const handleLinkExpired = () => {
  // Link expired during countdown
  if (paymentLink.value) {
    paymentLink.value.status = 'EXPIRED'
  }
}

const handlePayment = async () => {
  // Validate all fields
  if (!validateAll()) {
    return
  }

  if (!paymentLink.value) {
    return
  }

  // Tokenize card
  await tokenize({
    card_number: cardNumber.value,
    card_holder: cardHolder.value,
    expiration_date: expirationDate.value,
    cvv: cvv.value
  })

  if (!token.value) {
    return
  }

  // Process payment
  await processPayment({
    payment_link_id: paymentLink.value.id,
    card_token: token.value.token,
    accept_terms: termsAccepted.value
  })
}

const handleRetryPayment = () => {
  resetPayment()
  resetValidation()
  resetTokenization()
  resetFxConversion()
  // Recalculate fees (FX conversion will be recalculated via watch)
  if (paymentLink.value) {
    calculateFees({
      amount: paymentLink.value.amount_usd,
      transaction_number: 1,
      currency_from: 'USD',
      currency_to: paymentLink.value.currency_to || 'MXN'
    })
  }
}

onMounted(() => {
  loadPaymentLink()
})
</script>

<style scoped src="./styles/PaymentView.scss" lang="scss"></style>
