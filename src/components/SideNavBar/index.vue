<script setup lang="ts">
const props = defineProps<{
  menu
}>()
</script>

<template>
  <div v-for="item in props.menu" :key="item.code">
    <el-menu-item v-if="item.children.length === 0" :index="item.module">
      <el-icon>
        <Notification />
      </el-icon>
      {{ item.name }}
    </el-menu-item>
    <el-sub-menu v-if="item.children.length > 0" :index="item.module">
      <template #title>
        <el-icon>
          <Menu />
        </el-icon>
        <span>{{ item.name }}</span>
      </template>
      <SideNavBar :menu="item.children" />
    </el-sub-menu>
  </div>
</template>

<style scoped>
:deep(.el-sub-menu) {
  width: 100%;
}
</style>
