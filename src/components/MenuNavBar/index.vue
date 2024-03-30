<script setup lang="ts">
import MenuNavBar from '@/components/MenuNavBar/index.vue'

const props = defineProps<{
  menu
}>()
</script>

<template>
  <template v-for="item in props.menu" :key="item.code">
    <el-menu-item v-if="item.children.length === 0" :index="item.module">
      <el-icon v-if="item.icon">
        <component :is="item.icon" />
      </el-icon>
      <template #title>
        {{ item.name }}
      </template>
    </el-menu-item>
    <el-sub-menu v-if="item.children.length > 0" :index="item.module">
      <template #title>
        <el-icon v-if="item.icon">
          <component :is="item.icon" />
        </el-icon>
        <span>{{ item.name }}</span>
      </template>
      <MenuNavBar :menu="item.children" />
    </el-sub-menu>
  </template>
</template>

<style scoped>
:deep(.el-sub-menu) {
  width: 100%;
}
</style>
