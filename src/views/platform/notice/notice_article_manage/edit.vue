<script setup lang="ts">
import router from '@/router'
import AddEdit from './components/AddEdit.vue'
</script>

<template>
  <AddEdit type="edit" @edit="router.go(-1)" />
</template>
