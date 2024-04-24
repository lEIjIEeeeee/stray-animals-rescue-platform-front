<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import router from '@/router'
import MenuNavBar from '@/components/MenuNavBar/index.vue'
import { removeToken, removeUserType } from '@/utils/auth'
import { ElMessageBox } from 'element-plus'
import { SysTokenLogin } from '@/views/common/types'
import { getSysTokenLoginApi } from '@/views/common/common.api'

const avatar = computed(() =>
  sysTokenLogin.avatar == null ? '/src/assets/user/default_avatar.png' : sysTokenLogin.avatar
)

const menuList = [
  // {
  //   code: '/platform/home',
  //   name: '概况',
  //   module: 'home',
  //   icon: 'MostlyCloudy',
  //   children: [
  //     {
  //       code: '/platform/home/workbench',
  //       name: '工作台',
  //       module: 'workbench',
  //       icon: 'Notification',
  //       children: []
  //     }
  //   ]
  // },
  {
    code: '/platform/animal',
    name: '宠物管理',
    module: 'animal',
    icon: 'Menu',
    children: [
      {
        code: '/platform/animal/categoryManage',
        name: '动物类目管理',
        module: 'categoryManage',
        icon: 'Files',
        children: []
      },
      {
        code: '/platform/animal/animalManage',
        name: '宠物信息管理',
        module: 'animalManage',
        icon: 'Star',
        children: []
      },
      {
        code: '/platform/animal/adoptManage',
        name: '宠物领养管理',
        module: 'adoptManage',
        icon: 'Position',
        children: []
      },
      {
        code: '/platform/animal/contributionManage',
        name: '宠物捐助管理',
        module: 'contributionManage',
        icon: 'Present',
        children: []
      }
    ]
  },
  {
    code: '/platform/community',
    name: '社区管理',
    module: 'community',
    icon: 'LocationFilled',
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
  },
  {
    code: '/platform/notice',
    name: '公告管理',
    module: 'notice',
    icon: 'BellFilled',
    children: [
      {
        code: '/platform/notice/noticeTypeManage',
        name: '公告类型管理',
        module: 'noticeTypeManage',
        icon: 'Notification',
        children: []
      },
      {
        code: '/platform/notice/noticeArticleManage',
        name: '公告文章管理',
        module: 'noticeArticleManage',
        icon: 'Document',
        children: []
      }
    ]
  },
  {
    code: '/platform/system',
    name: '系统管理',
    module: 'system',
    icon: 'Tools',
    children: [
      {
        code: '/platform/system/userManage',
        name: '用户管理',
        module: 'userManage',
        icon: 'User',
        children: []
      }
    ]
  }
]

const isCollapse = ref(false)

const handleCollapse = async () => {
  isCollapse.value = !isCollapse.value
}

const handleSelect = (key, keyPath) => {
  let toPath = '/platform'
  if (keyPath.length === 1) {
    toPath += '/' + key
  } else {
    keyPath.forEach(function (item) {
      toPath += '/' + item
    })
  }
  router.push(toPath)
}

const init = () => {
  getSysTokenLogin()
}

const sysTokenLogin = reactive(new SysTokenLogin())
const getSysTokenLogin = async () => {
  const data = await getSysTokenLoginApi()
  Object.assign(sysTokenLogin, data.data)
}

onMounted(() => {
  init()
})

const goUserHomePage = () => {
  router.replace('/home')
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
      <div class="w-full flex flex-row items-center justify-center">
        <div class="w-[270px] px-[10px]">
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
            <div class="w-[50px] h-[50px] mr-[30px]">
              <el-image class="w-full h-full rounded-[50%]" :src="avatar" fit="cover" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <!-- <el-dropdown-item>
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
                <el-dropdown-item>
                  <el-icon>
                    <Bell />
                  </el-icon>
                  我的申请
                </el-dropdown-item> -->
                <el-dropdown-item @click="goUserHomePage">
                  <el-icon>
                    <user />
                  </el-icon>
                  用户端
                </el-dropdown-item>
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

    <div class="w-full flex flex-1 min-h-0">
      <div class="side-nav-bar__scrollbar h-full overflow-y-scroll border-r-[1px]">
        <el-menu
          router
          class="el-menu-vertical-demo h-full"
          mode="vertical"
          :default-active="$route.meta.module"
          :unique-opened="true"
          :collapse="isCollapse"
          @select="handleSelect"
          style="border: none"
        >
          <MenuNavBar :menu="menuList" />
        </el-menu>
      </div>

      <div class="h-full flex flex-1 min-w-0">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-tooltip__trigger:focus-visible) {
  outline: unset;
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

.side-nav-bar__scrollbar::-webkit-scrollbar {
  display: none;
}
</style>
