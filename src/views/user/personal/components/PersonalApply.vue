<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { SearchParams } from '../../post/types'

defineExpose({
  search
})

const searchParams = reactive(new SearchParams())
function search(str) {
  searchParams.searchContent = str
  console.log('applySearch:' + searchParams.searchContent)
  // getAnimalList()
}

onMounted(() => {
  console.log('applyInit:' + searchParams.searchContent)
})
</script>

<template>
  <div>111</div>
</template>

<style scoped></style>
