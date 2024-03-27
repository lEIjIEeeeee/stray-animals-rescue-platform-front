<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    showAdd?: boolean
    showDefault: boolean
    showProgress: boolean
    showError: boolean
    percentage: number
  }>(),
  {
    showAdd: false
  }
)
</script>

<template>
  <div>
    <slot name="add" v-if="props.showAdd" />
    <slot v-else-if="props.showDefault" />
    <slot name="progress" :percentage="props.percentage" v-else-if="props.showProgress" />
    <slot name="error" v-else-if="props.showError" />
    <slot name="loading" v-else />
    <slot name="bottom" />
  </div>
</template>
