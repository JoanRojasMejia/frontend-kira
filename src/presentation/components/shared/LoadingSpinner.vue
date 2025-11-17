<template>
  <div class="loading-spinner" :class="{ 'loading-spinner--small': size === 'small' }">
    <div class="spinner"></div>
    <p v-if="message" class="loading-message">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
/**
 * Loading Spinner Component
 * Pure presentational component for displaying loading states
 */
defineProps<{
  message?: string
  size?: 'normal' | 'small'
}>()
</script>

<style scoped src="./styles/LoadingSpinner.scss" lang="scss"></style>
