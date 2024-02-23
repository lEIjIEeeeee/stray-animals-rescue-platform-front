<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { getDetailApi } from './home.api'

// 1.首页
// 5.宠物领养
// 6.宠物认领
// 4.宠物捐助
// 7.帖子专区
// 3.救助案例
// 2.领养须知等公告
const menuList = [
  {
    path: '/home',
    name: '网站首页',
    module: 'home'
  },
  {
    path: '/animal',
    name: '宠物领养',
    module: 'animal'
  },
  {
    path: '/animal2',
    name: '丢失认领',
    module: 'animal2'
  },
  {
    path: '/animal3',
    name: '爱心捐助',
    module: 'animal3'
  },
  {
    path: '/post',
    name: '社区交流',
    module: 'post'
  },
  {
    path: '/animal5',
    name: '公告须知',
    module: 'notice'
  }
]

const avatar = computed(() => {
  const data = getUserInfo()
  if (data.avatar) {
    return data.avatar
  } else {
    return 'src/assets/user/default_avatar.png'
  }
})

const getDetail = async () => {
  await getDetailApi()
}

const getUserInfo = async () => {}

onMounted(() => {
  getDetail()
})
</script>

<template>
  <div class="w-full flex flex-col">
    <div class="w-full h-[90px] px-[20px] py-[10px] border-b bg-white">
      <div class="w-full flex items-center">
        <div class="flex justify-center mr-[20px]">
          <span class="font-medium text-[24px]">流浪动物救助平台</span>
        </div>
        <el-menu router mode="horizontal" :default-active="$route.meta.module">
          <div>
            <el-menu-item v-for="item in menuList" :key="item.path" :index="item.module"
              >{{ item.name }}
            </el-menu-item>
          </div>
        </el-menu>

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
                  <Setting />
                </el-icon>
                管理端
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

    <div class="container-wrapper bg-blue-50">
      <router-view />
    </div>
    <div class="w-full h-[100px] border-t bg-white"></div>
  </div>
</template>

<style scoped>
.el-menu {
  border: none !important;
  flex: 1;
  min-width: 0;
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
}

.el-menu > div {
  display: inline-block;
  vertical-align: text-top;
  display: flex;
  align-items: center;
}

.el-menu-item {
  font-size: 16px;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}

.container-wrapper {
  min-height: calc(100vh - 190px);
}
</style>
