<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { getUserType, removeToken, removeUserType } from '@/utils/auth'
import router from '@/router'
import { ElMessageBox } from 'element-plus'

// 1.首页
// 5.宠物领养
// 6.宠物认领
// 4.宠物捐助
// 7.帖子专区
// 3.救助案例
// 2.领养须知等公告
const menuList = [
  {
    code: '/home',
    name: '网站首页',
    module: 'home'
  },
  {
    code: '/animal',
    name: '全部萌宠',
    module: 'animal'
  },
  {
    code: '/post',
    name: '社区交流',
    module: 'post'
  },
  {
    code: '/notice',
    name: '公告须知'
  },
  {
    code: '/feedback',
    name: '用户反馈'
  }
]

const avatar = computed(() => {
  const data = null
  if (data) {
    return data.avatar
  } else {
    return '/src/assets/user/default_avatar.png'
  }
})

const userType = ref()

onMounted(() => {
  userType.value = getUserType()
})

const goAdminHomePage = () => {
  router.replace('/platform')
}

const goPersonalAnimal = () => {
  const target = router.resolve({
    path: 'personal/personalAnimal'
  })
  window.open(target.href, '_blank')
}

const goPersonalPost = () => {
  const target = router.resolve({
    path: 'personal/personalPost'
  })
  window.open(target.href, '_blank')
}

const goPersonalApply = () => {
  const target = router.resolve({
    path: 'personal/personalApply'
  })
  window.open(target.href, '_blank')
}

const logout = async () => {
  await ElMessageBox.confirm('是否确认退出登录？', {
    type: 'warning'
  })
  removeToken()
  removeUserType()
  router.push('/login')
}
</script>

<template>
  <div class="w-full h-full pt-[90px] flex flex-col">
    <div class="w-full h-[90px] border-b fixed top-0 left-0 z-50 bg-white flex items-center">
      <div class="w-[270px] px-[10px] items-baseline leading-[90px]">
        <span class="font-medium text-[24px] mr-[5px]">流浪动物救助平台</span>
        <span class="font-medium text-[16px]">用户端</span>
      </div>
      <el-menu router mode="horizontal" :default-active="$route.meta.module">
        <div>
          <el-menu-item v-for="item in menuList" :key="item.code" :index="item.module"
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
            <el-dropdown-item @click="goPersonalAnimal">
              <el-icon>
                <Star />
              </el-icon>
              我的宠物
            </el-dropdown-item>
            <el-dropdown-item @click="goPersonalPost">
              <el-icon>
                <EditPen />
              </el-icon>
              我的帖子
            </el-dropdown-item>
            <el-dropdown-item @click="goPersonalApply">
              <el-icon>
                <Bell />
              </el-icon>
              我的申请
            </el-dropdown-item>

            <div v-if="userType === 'PLATFORM_ADMIN'">
              <el-dropdown-item divided @click="goAdminHomePage">
                <el-icon>
                  <Setting />
                </el-icon>
                管理端
              </el-dropdown-item>
            </div>
            <el-dropdown-item divided @click="logout">
              <el-icon>
                <SwitchButton />
              </el-icon>
              退 出
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
    <div class="flex-1 bg-blue-50">
      <router-view />
    </div>
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
</style>
