<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  dateValue: {
    type: string[]
    default: []
  }
}>()

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      start.setHours(0, 0, 0)
      end.setHours(23, 59, 59)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      start.setHours(0, 0, 0)
      end.setHours(23, 59, 59)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      start.setHours(0, 0, 0)
      end.setHours(23, 59, 59)
      return [start, end]
    }
  }
]
</script>

<template>
  <el-date-picker></el-date-picker>
</template>
