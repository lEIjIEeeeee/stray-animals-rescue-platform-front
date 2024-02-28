<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'
import { getDetailApi } from '../user_home/home.api'
import router from '@/router'
import SideNavBar from '@/components/SideNavBar/index.vue'

const avatar = ref()

const menuList = [
  {
    code: '/platform/home',
    name: '概况',
    module: 'home',
    icon: 'MostlyCloudy',
    children: [
      {
        code: '/platform/home/workbench',
        name: '工作台',
        module: 'workbench',
        icon: 'Notification',
        children: []
      }
    ]
  },
  {
    code: '/platform/animal',
    name: '动物管理',
    module: 'animal',
    icon: 'Menu',
    children: [
      {
        code: '/platform/animal/animalManage',
        name: '动物信息管理',
        module: 'animalManage',
        icon: 'Star',
        children: []
      },
      {
        code: '/platform/animal/categoryManage',
        name: '动物类别管理',
        module: 'categoryManage',
        icon: 'Files',
        children: []
      }
    ]
  },
  {
    code: '/platform/community',
    name: '社区管理',
    module: 'community',
    icon: 'MapLocation',
    children: [
      {
        code: '/platform/community/postManage',
        name: '帖子管理',
        module: 'postManage',
        icon: 'Edit',
        children: []
      },
      {
        code: '/platform/community/commentManage',
        name: '评论管理',
        module: 'commentManage',
        icon: 'ChatDotSquare',
        children: []
      }
    ]
  }
]

const isCollapse = ref(false)
const reviewWrapper = ref(null)
const sideNavBar = ref(null)
const containerWrapper = ref(null)

const handleCollapse = async () => {
  isCollapse.value = !isCollapse.value
  getContainerWrapperWidth()
}

const getContainerWrapperWidth = () => {
  const reviewWrapperWidth = reviewWrapper.value.offsetWidth
  const sideNavBarWidth = isCollapse.value ? 64 : 200
  const containerWrapperWidth = reviewWrapperWidth - sideNavBarWidth
  containerWrapper.value.style.width = containerWrapperWidth + 'px'
}

const handleSelect = (key, keyPath) => {
  const toPath = '/platform/' + keyPath[0] + '/' + key
  router.push(toPath)
}

const getDetail = async () => {
  await getDetailApi()
  avatar.value = '/src/assets/user/default_avatar.png'
}

onMounted(() => {
  getDetail()
  getContainerWrapperWidth()
})
</script>

<template>
  <div>
    <div class="w-full h-[90px] border-b fixed top-0 left-0 z-50 bg-white flex items-center">
      <div class="w-full flex flex-row items-center justify-center">
        <div class="w-[270px] px-[10px] items-baseline leading-[90px]">
          <span class="font-medium text-[24px] mr-[5px]">流浪动物救助平台</span>
          <span class="font-medium text-[16px]">管理端</span>
        </div>
        <div
          class="collapse-icon px-[10px] h-[60px] flex items-center cursor-pointer"
          @click="handleCollapse"
        >
          <fold v-if="!isCollapse" />
          <expand v-else />
        </div>

        <div class="ml-auto">
          <el-dropdown>
            <div class="w-[50px] h-[50px] rounded-[50%] mr-[30px] flex items-center">
              <el-image class="rounded-[50%] object-fill" :src="avatar" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <el-icon>
                    <Bell />
                  </el-icon>
                  我的申请
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon>
                    <Star />
                  </el-icon>
                  我的宠物
                </el-dropdown-item>
                <el-dropdown-item>
                  <el-icon>
                    <EditPen />
                  </el-icon>
                  我的帖子
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-icon>
                    <user />
                  </el-icon>
                  用户端
                </el-dropdown-item>
                <el-dropdown-item divided>
                  <el-icon>
                    <SwitchButton />
                  </el-icon>
                  退 出
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </div>
    </div>

    <div class="w-full h-[90px]"></div>

    <div class="flex flex-row bg-blue-50" ref="reviewWrapper">
      <div class="side-nav-bar bg-white" ref="sideNavBar">
        <el-menu
          router
          class="el-menu-vertical-demo h-full"
          mode="vertical"
          :default-active="$route.meta.module"
          :unique-opened="true"
          :collapse="isCollapse"
          @select="handleSelect"
        >
          <SideNavBar :menu="menuList" />
        </el-menu>
      </div>
      <div class="container-wrapper" ref="containerWrapper">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.side-nav-bar,
.container-wrapper {
  min-height: calc(100vh - 90px);
}

.collapse-icon:hover {
  background-color: #ecf5ff;
}

.collapse-icon svg {
  width: 20px;
}

.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
}
</style>
