<template>
  <form @submit.prevent="handleSubmit" class="create-link-form">
    <h2 class="form-title">Crear Link de Pago</h2>

    <div class="form-group">
      <label for="merchant-name" class="form-label">Nombre del Comercio *</label>
      <input
        id="merchant-name"
        v-model="formData.merchantName"
        type="text"
        class="form-input"
        :class="{ 'form-input--error': errors.merchantName }"
        placeholder="Ej: Mi Tienda Online"
        required
      />
      <span v-if="errors.merchantName" class="form-error">{{ errors.merchantName }}</span>
    </div>

    <div class="form-group">
      <label for="description" class="form-label">Descripción *</label>
      <textarea
        id="description"
        v-model="formData.description"
        class="form-textarea"
        :class="{ 'form-input--error': errors.description }"
        placeholder="Describe el concepto del pago (mínimo 10 caracteres)"
        rows="3"
        required
      ></textarea>
      <span v-if="errors.description" class="form-error">{{ errors.description }}</span>
    </div>

    <div class="form-group">
      <label for="amount" class="form-label">Monto (USD) *</label>
      <input
        id="amount"
        v-model.number="formData.amount"
        type="number"
        step="0.01"
        min="0.01"
        class="form-input"
        :class="{ 'form-input--error': errors.amount }"
        placeholder="0.00"
        required
      />
      <span v-if="errors.amount" class="form-error">{{ errors.amount }}</span>
    </div>

    <div class="form-row">
      <div class="form-group">
        <label for="currency-from" class="form-label">Moneda Origen</label>
        <input id="currency-from" type="text" value="USD" class="form-input" disabled />
      </div>

      <div class="form-group">
        <label for="currency-to" class="form-label">Moneda Destino</label>
        <input id="currency-to" type="text" value="MXN" class="form-input" disabled />
      </div>
    </div>

    <div class="form-group">
      <label class="form-checkbox">
        <input v-model="formData.hasExpiration" type="checkbox" class="form-checkbox-input" />
        <span class="form-checkbox-label">¿Tiene expiración? (expira en 1 día)</span>
      </label>
    </div>

    <button type="submit" class="submit-button" :disabled="loading">
      {{ loading ? 'Creando...' : 'Crear Link de Pago' }}
    </button>
  </form>
</template>

<script setup lang="ts">
import {
  useCreateLinkValidation,
  type CreateLinkFormData
} from '@/presentation/composables/useCreateLinkValidation'

/**
 * Create Link Form Component
 * Pure presentational component - only emits events
 */
defineProps<{
  loading: boolean
}>()

const emit = defineEmits<{
  submit: [data: CreateLinkFormData]
}>()

// Composables
const { formData, errors, validateAll } = useCreateLinkValidation()

// Handlers
const handleSubmit = () => {
  if (validateAll()) {
    emit('submit', { ...formData })
  }
}
</script>

<style scoped src="./styles/CreateLinkForm.scss" lang="scss"></style>
