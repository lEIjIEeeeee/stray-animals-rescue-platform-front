<script setup lang="ts">
import { computed, ref } from 'vue'
import usePopup from '@/hooks/usePopup'
import useMainLoading from '@/hooks/useMainLoading'

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)

defineExpose({
  open
})

function open(id) {
  postId.value = id
  init()
  openPopup()
  console.log(show.value)
}

const postId = ref()

const init = () => {
  getPostDetail()
}

const getPostDetail = () => {
  openMainLoading()
  setTimeout(() => {
    console.log('帖子详情')
  }, 1000)
  closeMainLoading()
}
</script>

<template>
  <div>帖子详情</div>
</template>
