<script setup lang="ts">
import { onMounted } from 'vue'
import { getDetailApi } from '@/views/home/user_home/home.api'

const getDetail = async () => {
  await getDetailApi()
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <div>动物</div>
</template>
