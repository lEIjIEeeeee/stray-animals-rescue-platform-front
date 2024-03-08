<script setup lang="ts">
import { onMounted } from 'vue'
import { getDetailApi } from '@/views/user/home/home.api'

const getDetail = async () => {
  await getDetailApi()
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <div>宠物</div>
</template>
