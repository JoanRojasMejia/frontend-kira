<template>
  <div class="payment-status">
    <!-- Success State -->
    <div v-if="status === 'success'" class="status-container status-success">
      <h2 class="status-title">¡Pago Exitoso!</h2>
      <p class="status-message">Tu pago ha sido procesado correctamente.</p>

      <div v-if="transactionId" class="transaction-info">
        <div class="info-row">
          <span class="info-label">ID de Transacción:</span>
          <span class="info-value transaction-id">{{ transactionId }}</span>
        </div>
        <div v-if="amount" class="info-row">
          <span class="info-label">Monto:</span>
          <span class="info-value">${{ amount.toFixed(2) }} USD</span>
        </div>
        <div v-if="mxnAmount" class="info-row">
          <span class="info-label">Convertido a:</span>
          <span class="info-value">${{ mxnAmount.toFixed(2) }} MXN</span>
        </div>
      </div>

      <p class="status-note">Recibirás un correo de confirmación con los detalles de tu pago.</p>
    </div>

    <!-- Error State -->
    <div v-else-if="status === 'error'" class="status-container status-error">
      <div class="status-icon">❌</div>
      <h2 class="status-title">Error en el Pago</h2>
      <p class="status-message">
        {{ errorMessage || 'No se pudo procesar el pago. Por favor, intenta nuevamente.' }}
      </p>

      <button @click="$emit('retry')" class="action-button retry-button">Reintentar Pago</button>
    </div>

    <!-- Expired State -->
    <div v-else-if="status === 'expired'" class="status-container status-expired">
      <h2 class="status-title">Link Expirado</h2>
      <p class="status-message">
        Este link de pago ha expirado. Por favor, solicita uno nuevo al comercio.
      </p>
    </div>

    <!-- Completed State (Already Paid) -->
    <div v-else-if="status === 'completed'" class="status-container status-completed">
      <div class="status-icon">✓</div>
      <h2 class="status-title">Pago Ya Procesado</h2>
      <p class="status-message">
        Este link de pago ya fue utilizado y no puede ser usado nuevamente.
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Payment Status View Component
 * Pure presentational component - displays different payment states
 */
defineProps<{
  status: 'success' | 'error' | 'expired' | 'completed'
  transactionId?: string
  amount?: number
  mxnAmount?: number
  errorMessage?: string
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped src="./styles/PaymentStatusView.scss" lang="scss"></style>
