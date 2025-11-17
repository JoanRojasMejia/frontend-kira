<template>
  <div class="create-link-view">
    <div class="container">
      <LoadingSpinner v-if="loading" message="Creando link de pago..." />

      <ErrorMessage
        v-else-if="error"
        title="Error"
        :message="error"
        :show-retry="true"
        @retry="handleRetry"
      />

      <LinkCreatedSuccess
        v-else-if="paymentLink"
        :payment-link="paymentLink"
        @create-another="handleCreateAnother"
      />

      <CreateLinkForm v-else :loading="loading" @submit="handleCreateLink" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCreatePaymentLink } from '@/presentation/composables/useCreatePaymentLink'
import { generateMerchantId } from '@/utils/idGenerators'
import CreateLinkForm from '@/presentation/components/create-link/CreateLinkForm.vue'
import LinkCreatedSuccess from '@/presentation/components/create-link/LinkCreatedSuccess.vue'
import LoadingSpinner from '@/presentation/components/shared/LoadingSpinner.vue'
import ErrorMessage from '@/presentation/components/shared/ErrorMessage.vue'

/**
 * Create Link View
 * Orchestrates the payment link creation flow
 */
const { loading, error, paymentLink, createLink, reset } = useCreatePaymentLink()

const handleCreateLink = async (data: {
  merchantName: string
  description: string
  amount: number
  hasExpiration: boolean
}) => {
  // Generate unique merchant ID with format: merchant-{uid}
  const merchantId = generateMerchantId()

  // Calculate expiration date: current date + 24 hours
  let expiresAt: string | null = null
  if (data.hasExpiration) {
    const now = new Date()
    const expirationDate = new Date(now.getTime() + 24 * 60 * 60 * 1000) // Add 24 hours
    expiresAt = expirationDate.toISOString()
  }

  await createLink({
    merchant_id: merchantId,
    amount_usd: data.amount,
    currency_from: 'USD',
    currency_to: 'MXN',
    description: data.description,
    expires_at: expiresAt
  })
}

const handleCreateAnother = () => {
  reset()
}

const handleRetry = () => {
  reset()
}
</script>

<style scoped src="./styles/CreateLinkView.scss" lang="scss"></style>
