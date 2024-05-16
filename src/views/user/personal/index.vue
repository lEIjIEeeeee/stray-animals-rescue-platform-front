<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { getCountsApi, getPersonalInfoApi } from './personal.api'
import { PersonalInfo, UserBizCounts } from './types'
import useMainLoading from '@/hooks/useMainLoading'
import router from '@/router'
import PersonalAnimal from './components/PersonalAnimal.vue'
import PersonalPost from './components/PersonalPost.vue'
import PersonalApply from './components/PersonalApply.vue'
import PersonalInfoEdit from './components/PersonalInfoEdit.vue'
import AdoptRecord from './components/AdoptRecord.vue'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)
const avatar = computed(() =>
  personalInfo.avatar == '' || personalInfo.avatar == null
    ? '/src/assets/user/default_avatar.png'
    : personalInfo.avatar
)

const personalInfo = reactive(new PersonalInfo())
const getPersonalInfo = async () => {
  try {
    openMainLoading()
    const data = await getPersonalInfoApi()
    Object.assign(personalInfo, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const userBizCounts = reactive(new UserBizCounts())
const getCounts = async () => {
  try {
    openMainLoading()
    const data = await getCountsApi()
    Object.assign(userBizCounts, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getPersonalInfo()
  getCounts()
}

onMounted(() => {
  init()
})

const goPersonalAnimal = () => {
  router.push('/personal/personalAnimal')
}

const goPersonalPost = () => {
  router.push('/personal/personalPost')
}

const goAdoptApply = () => {
  router.push('/personal/adoptRecord')
}

const searchContent = ref('')
const personalAnimalRef = ref<InstanceType<typeof PersonalAnimal>>()
const personalPostRef = ref<InstanceType<typeof PersonalPost>>()
const personalApplyRef = ref<InstanceType<typeof PersonalApply>>()
const adoptRecordRef = ref<InstanceType<typeof AdoptRecord>>()

const handleEnter = () => {
  inputSearch()
}

const handleClear = () => {
  inputSearch()
}

const inputSearch = () => {
  const module = router.currentRoute.value.meta.module
  if (module === 'personalAnimal') {
    personalAnimalRef.value?.search(searchContent)
  }
  if (module === 'personalPost') {
    personalPostRef.value?.search(searchContent)
  }
  if (module === 'personalApply') {
    personalApplyRef.value?.search(searchContent)
  }
  if (module === 'adoptRecord') {
    adoptRecordRef.value?.search(searchContent)
  }
}

const editPersonalRef = ref<InstanceType<typeof PersonalInfoEdit>>()
const editPersonalInfo = () => {
  editPersonalRef.value?.open()
}
</script>

<template>
  <div class="h-full px-[5%] flex flex-col items-center bg-blue-50 overflow-auto">
    <div class="w-full" v-loading="loading">
      <div class="my-[20px] h-[150px] rounded-[4px] bg-white shadow">
        <div class="relative">
          <div
            class="w-[102px] h-[102px] absolute top-[-12px] left-[24px] border-[4px] border-solid rounded-[50%] border-[#f0f0f2]"
          >
            <el-image class="w-full h-full rounded-[50%]" :src="avatar"> </el-image>
          </div>
        </div>
        <div class="w-full pl-[150px] pr-[20px] pt-[20px] flex flex-col">
          <div class="mb-[10px] flex flex-row justify-start items-center">
            <div class="mr-[10px]">
              <span class="text-[22px] font-medium">
                {{ personalInfo.nickName }}
              </span>
            </div>
            <el-tag
              >{{
                personalInfo.userType === 'NORMAL_USER'
                  ? '普通会员'
                  : personalInfo.userType === 'PLATFORM_ADMIN'
                    ? '平台管理员'
                    : '未知用户'
              }}
            </el-tag>
            <div class="ml-[auto]">
              <el-button style="border-radius: 20px" @click="editPersonalInfo">编辑资料</el-button>
            </div>
          </div>
          <div class="mb-[10px] flex flex-row justify-start items-center">
            <ul class="flex flex-row items-center">
              <!-- <li class="flex flex-row items-center">
                <span class="hover:text-[#ff0000]">
                  <span class="text-[20px] font-semibold mr-[5px]">
                    {{ userBizCounts.accessAmount }}</span
                  >
                  <span class="text-[14px]">总访问量</span>
                </span>
                <div class="w-[1px] h-[16px] mx-[16px] bg-[#e8e8ed]"></div>
              </li> -->
              <li class="flex flex-row items-center">
                <a class="cursor-pointer" @click="goPersonalAnimal">
                  <span class="hover:text-[#ff0000]">
                    <span class="text-[20px] font-semibold mr-[5px]">
                      {{ userBizCounts.animalAmount }}
                    </span>
                    <span>宠物数</span>
                  </span>
                </a>
                <div class="w-[1px] h-[16px] mx-[16px] bg-[#e8e8ed]"></div>
              </li>
              <li class="flex flex-row items-center">
                <a class="cursor-pointer" @click="goPersonalPost">
                  <span class="hover:text-[#ff0000]">
                    <span class="text-[20px] font-semibold mr-[5px]">
                      {{ userBizCounts.postAmount }}
                    </span>
                    <span>帖子数</span>
                  </span>
                </a>
                <div class="w-[1px] h-[16px] mx-[16px] bg-[#e8e8ed]"></div>
              </li>
              <li class="flex flex-row items-center">
                <a class="cursor-pointer" @click="goAdoptApply">
                  <span class="hover:text-[#ff0000]">
                    <span class="text-[20px] font-semibold mr-[5px]">
                      {{ userBizCounts.applyAmount }}
                    </span>
                    <span>申领数</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div class="text-[14px] font-normal inline">
            <span>注册时间：</span>
            <span>{{ personalInfo.createTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="w-full mb-[30px] border-none flex flex-row items-start">
      <div class="w-[350px] h-[400px] mr-[10px] rounded-[4px] shadow bg-white"></div>
      <div class="w-full bg-white rounded-[4px] shadow">
        <div class="w-full flex flex-row items-center">
          <el-menu
            router
            :default-active="$route.meta.module"
            class="mb-[20px] rounded-t-[5px] flex-1"
            style="border: none"
            mode="horizontal"
          >
            <el-menu-item index="personalAnimal" style="border-top-left-radius: 5px"
              >我的宠物</el-menu-item
            >
            <el-menu-item index="personalPost">我的帖子</el-menu-item>
            <el-menu-item index="adoptRecord">申领记录</el-menu-item>
          </el-menu>
          <div class="mr-[20px]">
            <el-input
              type="text"
              v-model="searchContent"
              prefix-icon="search"
              clearable
              @keyup.enter="handleEnter"
              @clear="handleClear"
              placeholder="请输入搜索关键字"
              style="width: 200px !important"
            ></el-input>
          </div>
        </div>
        <div>
          <PersonalAnimal
            v-if="router.currentRoute.value.meta.module === 'personalAnimal'"
            :searchContent="searchContent"
            ref="personalAnimalRef"
          />
          <PersonalPost
            v-if="router.currentRoute.value.meta.module === 'personalPost'"
            :searchContent="searchContent"
            ref="personalPostRef"
          />
          <AdoptRecord
            v-if="router.currentRoute.value.meta.module == 'adoptRecord'"
            :searchContent="searchContent"
            ref="adoptRecordRef"
          />
        </div>
      </div>
    </div>
  </div>
  <PersonalInfoEdit @edit="router.go(0)" ref="editPersonalRef" />
</template>

<style scoped>
.el-menu-item {
  background-color: white !important;
  font-size: 16px;
}
</style>
