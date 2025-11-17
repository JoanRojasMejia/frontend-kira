<template>
  <div class="success-container">
    <h2 class="success-title">¡Link de Pago Creado!</h2>

    <p class="success-message">
      Tu link de pago ha sido creado exitosamente. Compártelo con tus clientes para recibir pagos.
    </p>

    <div class="url-container">
      <div class="url-display">
        <span class="url-text">{{ paymentUrl }}</span>
      </div>

      <div class="action-buttons">
        <button @click="handleCopy" class="action-button action-button--primary">
          {{ copied ? 'Copiado' : 'Copiar URL' }}
        </button>

        <button v-if="canShare" @click="handleShare" class="action-button action-button--secondary">
          Compartir
        </button>
      </div>
    </div>

    <div class="payment-details">
      <h3 class="details-title">Detalles del Pago</h3>
      <div class="details-grid">
        <div class="detail-item">
          <span class="detail-label">Monto:</span>
          <span class="detail-value">${{ paymentLink.amount_usd.toFixed(2) }} USD</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Descripción:</span>
          <span class="detail-value">{{ paymentLink.description }}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">Expira:</span>
          <span class="detail-value">
            {{ paymentLink.expires_at ? formatDate(paymentLink.expires_at) : 'Sin expiración' }}
          </span>
        </div>
      </div>
    </div>

    <button @click="$emit('createAnother')" class="create-another-button">Crear Otro Link</button>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { PaymentLink } from '@/domain/entities/PaymentLink'
import { useClipboard } from '@/presentation/composables/useClipboard'
import { formatDate } from '@/utils/formatters'

/**
 * Link Created Success Component
 * Pure presentational component - displays success state
 */
const props = defineProps<{
  paymentLink: PaymentLink
}>()

const emit = defineEmits<{
  createAnother: []
}>()

// Composables
const { copied, canShare, copyToClipboard: copyText, share } = useClipboard()

// Computed properties
const paymentUrl = computed(() => {
  return `${window.location.origin}/pay/${props.paymentLink.id}`
})

// Handlers
const handleCopy = async () => {
  await copyText(paymentUrl.value)
}

const handleShare = async () => {
  await share({
    title: 'Link de Pago',
    text: `Paga ${props.paymentLink.amount_usd} USD - ${props.paymentLink.description}`,
    url: paymentUrl.value
  })
}
</script>

<style scoped src="./styles/LinkCreatedSuccess.scss" lang="scss"></style>
