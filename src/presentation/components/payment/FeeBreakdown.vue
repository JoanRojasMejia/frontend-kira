<template>
  <div class="fee-breakdown">
    <h3 class="fee-breakdown__title">Desglose de Comisiones</h3>

    <!-- Loading State -->
    <div v-if="loading" class="fee-breakdown__loading">
      <span class="spinner"></span>
      <span>Calculando comisiones...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="fee-breakdown__error">
      <p>{{ error }}</p>
    </div>

    <!-- Fee Details -->
    <div v-else-if="feeCalculation" class="fee-breakdown__content">
      <!-- Original Amount -->
      <div class="fee-breakdown__row">
        <span class="fee-breakdown__label">Monto Original:</span>
        <span class="fee-breakdown__value">{{
          formatCurrency(feeCalculation.original_amount)
        }}</span>
      </div>

      <!-- Applied Rules -->
      <div class="fee-breakdown__rules">
        <div
          v-for="rule in feeCalculation.applied_rules"
          :key="rule.id"
          class="fee-breakdown__rule"
        >
          <span class="fee-breakdown__rule-label">
            <span class="fee-breakdown__rule-icon">{{ getRuleIcon(rule.type) }}</span>
            {{ getRuleLabel(rule.type, rule.value) }}
          </span>
          <span class="fee-breakdown__rule-value">{{ formatCurrency(rule.fee_amount) }}</span>
        </div>
      </div>

      <!-- Divider -->
      <div class="fee-breakdown__divider"></div>

      <!-- Total Fee -->
      <div class="fee-breakdown__row fee-breakdown__row--total-fee">
        <span class="fee-breakdown__label">Total Comisiones:</span>
        <span class="fee-breakdown__value fee-breakdown__value--fee">
          {{ formatCurrency(feeCalculation.total_fee) }}
        </span>
      </div>

      <!-- Final Amount -->
      <div class="fee-breakdown__row fee-breakdown__row--final">
        <span class="fee-breakdown__label fee-breakdown__label--final">Total a Pagar:</span>
        <span class="fee-breakdown__value fee-breakdown__value--final">
          {{ formatCurrency(feeCalculation.final_amount) }}
        </span>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="fee-breakdown__empty">
      <p>Las comisiones se calcularán automáticamente</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FeeCalculation, FeeRuleType } from '@/domain/entities/FeeCalculation'

/**
 * Fee Breakdown Component
 * Displays a detailed breakdown of transaction fees
 */
defineProps<{
  feeCalculation: FeeCalculation | null
  loading?: boolean
  error?: string | null
}>()

/**
 * Format currency value
 */
const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)} USD`
}

/**
 * Get icon for fee rule type
 */
const getRuleIcon = (type: FeeRuleType): string => {
  const icons: Record<FeeRuleType, string> = {
    FIXED: '📌',
    PERCENTAGE: '📊',
    FX_SPREAD: '💱'
  }
  return icons[type] || '💰'
}

/**
 * Get human-readable label for fee rule
 */
const getRuleLabel = (type: FeeRuleType, value: number): string => {
  const labels: Record<FeeRuleType, string> = {
    FIXED: `Comisión Fija`,
    PERCENTAGE: `Comisión por Porcentaje (${value}%)`,
    FX_SPREAD: `Spread de Conversión (${value}%)`
  }
  return labels[type] || 'Comisión'
}
</script>

<style scoped src="./styles/FeeBreakdown.scss" lang="scss"></style>
