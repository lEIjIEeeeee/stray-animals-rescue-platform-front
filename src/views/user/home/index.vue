<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { getToken, removeToken, removeUserType } from '@/utils/auth'
import router from '@/router'
import { ElMessageBox } from 'element-plus'
import MenuNavBar from '@/components/MenuNavBar/index.vue'
import { getPersonalInfoApi } from '@/views/user/personal/personal.api'
import { PersonalInfo } from '@/views/user/personal/types'

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
  currentUserInfo.avatar == null || currentUserInfo.avatar == ''
    ? '/src/assets/user/default_avatar.png'
    : currentUserInfo.avatar
)

onMounted(() => {
  init()
})

const loginFlag = ref(false)
const init = () => {
  const token = getToken()
  if (token) {
    loginFlag.value = true
    getSysTokenLogin()
  }
}

const currentUserInfo = reactive(new PersonalInfo())
const getSysTokenLogin = async () => {
  const data = await getPersonalInfoApi()
  Object.assign(currentUserInfo, data.data)
}

const goAdminHomePage = () => {
  router.replace('/platform')
}

const goPersonalAnimal = () => {
  router.push({
    path: '/personal/personalAnimal'
  })
}

const goPersonalPost = () => {
  router.push({
    path: '/personal/personalPost'
  })
}

const goAdoptRecord = () => {
  router.push({
    path: '/personal/adoptRecord'
  })
}

// const goPersonalApply = () => {
//   const target = router.resolve({
//     path: '/personal/personalApply'
//   })
//   window.open(target.href, '_blank')
// }

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

const goLogin = () => {
  router.push('/login')
}

const goRegister = () => {
  router.push('/register')
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
            <div class="w-[50px] h-[50px] mr-[50px]">
              <el-image
                class="w-full h-full rounded-[50%]"
                :src="loginFlag === true ? avatar : '/src/assets/user/unlogin_avatar.png'"
                fit="cover"
              />
            </div>
            <template #dropdown>
              <el-dropdown-menu v-if="loginFlag === true">
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
                <el-dropdown-item divided @click="goAdoptRecord">
                  <el-icon>
                    <Bell />
                  </el-icon>
                  申领记录
                </el-dropdown-item>
                <div v-if="currentUserInfo.userType === 'PLATFORM_ADMIN'">
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
              <div v-else>
                <div class="w-[400px] p-[20px] text-[14px]">
                  <div>
                    <span>登录后你可以：</span>
                  </div>
                  <div class="mt-[20px] grid grid-cols-2 gap-x-[10px] gap-y-[10px]">
                    <div class="flex items-end">
                      <el-icon size="22" color="#00aeec">
                        <Star />
                      </el-icon>
                      <span class="ml-[5px]">领养/捐助流浪动物</span>
                    </div>
                    <div class="flex items-end">
                      <el-icon size="22" color="#00aeec">
                        <Star />
                      </el-icon>
                      <span class="ml-[5px]">发布帖子/评论</span>
                    </div>
                  </div>
                  <div class="mt-[20px]">
                    <el-button class="w-full" type="primary" @click="goLogin">登录</el-button>
                  </div>
                  <div class="mt-[20px] flex justify-center">
                    <span>还没有账号？</span>
                    <span class="text-[#00aeec] cursor-pointer" @click="goRegister">点击注册</span>
                  </div>
                </div>
              </div>
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
