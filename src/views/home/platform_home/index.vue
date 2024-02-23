<script setup lang="ts">
import { onMounted } from 'vue'
import { getDetailApi } from '../user_home/home.api'

const getDetail = async () => {
  await getDetailApi()
}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <div>平台主页</div>
</template>
