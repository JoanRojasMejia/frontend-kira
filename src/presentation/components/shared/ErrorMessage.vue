<template>
  <div class="error-message" role="alert">
    <div class="error-icon">⚠️</div>
    <div class="error-content">
      <h3 v-if="title" class="error-title">{{ title }}</h3>
      <p class="error-text">{{ message }}</p>
      <button v-if="showRetry" @click="$emit('retry')" class="retry-button">Reintentar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Error Message Component
 * Pure presentational component for displaying errors
 */
defineProps<{
  title?: string
  message: string
  showRetry?: boolean
}>()

defineEmits<{
  retry: []
}>()
</script>

<style scoped src="./styles/ErrorMessage.scss" lang="scss"></style>
