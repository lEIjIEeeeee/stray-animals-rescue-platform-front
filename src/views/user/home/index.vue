<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { removeToken, removeUserType } from '@/utils/auth'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import MenuNavBar from '@/components/MenuNavBar/index.vue'
import { SysTokenLogin } from '@/views/common/types'
import { getSysTokenLoginApi } from '@/views/common/common.api'

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
    module: 'home',
    children: []
  },
  {
    code: '/animal',
    name: '全部萌宠',
    module: 'animal',
    children: []
  },
  {
    code: '/post',
    name: '社区交流',
    module: 'post',
    children: []
  },
  {
    code: '/notice',
    name: '公告须知',
    module: 'notice',
    children: []
  }
  // {
  //   code: '/feedback',
  //   name: '用户反馈'
  // }
]

const avatar = computed(() =>
  sysTokenLogin.avatar == null ? '/src/assets/user/default_avatar.png' : sysTokenLogin.avatar
)

onMounted(() => {
  init()
})

const init = () => {
  getSysTokenLogin()
}

const sysTokenLogin = reactive(new SysTokenLogin())
const getSysTokenLogin = async () => {
  const data = await getSysTokenLoginApi()
  Object.assign(sysTokenLogin, data.data)
}

const goAdminHomePage = () => {
  router.replace('/platform')
}

const goPersonalAnimal = () => {
  const target = router.resolve({
    path: '/personal/personalAnimal'
  })
  window.open(target.href, '_blank')
}

const goPersonalPost = () => {
  const target = router.resolve({
    path: '/personal/personalPost'
  })
  window.open(target.href, '_blank')
}

const goPersonalApply = () => {
  const target = router.resolve({
    path: '/personal/personalApply'
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

const handleSelect = (key, keyPath) => {
  let toPath = ''
  if (keyPath.length === 1) {
    toPath += '/' + key
  } else {
    keyPath.forEach(function (item) {
      toPath += '/' + item
    })
  }
  router.push(toPath)
}
</script>

<template>
  <div class="h-full pt-[90px] flex flex-col">
    <div class="w-full h-[90px] border-b fixed top-0 left-0 z-50 bg-white flex">
      <div class="w-full h-full flex items-center">
        <div class="min-w-[285px] px-[20px] items-baseline">
          <span class="font-medium text-[24px] mr-[5px]">流浪动物救助平台</span>
          <span class="font-medium text-[16px]">用户端</span>
        </div>
        <div class="h-full flex-1">
          <el-menu
            router
            class="el-menu-demo"
            mode="horizontal"
            :default-active="$route.meta.module"
            :unique-opened="true"
            @select="handleSelect"
          >
            <MenuNavBar :menu="menuList" />
          </el-menu>
        </div>
        <div>
          <el-dropdown>
            <div class="w-[50px] h-[50px] mr-[30px]">
              <el-image class="w-full h-full rounded-[50%]" :src="avatar" fit="cover" />
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
                <!-- <el-dropdown-item @click="goPersonalApply">
                  <el-icon>
                    <Bell />
                  </el-icon>
                  我的申请
                </el-dropdown-item> -->
                <div v-if="sysTokenLogin.userType === 'PLATFORM_ADMIN'">
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
      </div>
    </div>
    <div class="flex-1 bg-gray-50 overflow-auto">
      <router-view />
    </div>
  </div>
</template>

<style scoped>
.el-menu {
  height: 100%;
  border: none;
}

:deep(.el-menu-item),
:deep(.el-sub-menu__title) {
  font-size: 18px;
}

:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
}
</style>
