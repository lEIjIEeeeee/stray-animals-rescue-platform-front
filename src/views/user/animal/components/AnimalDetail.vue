<script setup lang="ts">
import router from '@/router'
import { getDetailApi } from '../animal.api'
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { AnimalDetail } from '../types'
import AnimalAdopt from './AnimalAdopt.vue'
import useMainLoading from '@/hooks/useMainLoading'
import AnimalContribution from './AnimalContribution.vue'
import { getSysTokenLoginApi } from '@/views/common/common.api'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))
const isAdopted = computed(() => animalDetail.isAdopt === 1)
const isLosted = computed(() => animalDetail.isLost === 0)

const animalDetail = reactive(new AnimalDetail())
const getDetail = async () => {
  try {
    openMainLoading()
    const id = router.currentRoute.value.query.id
    const data = await getDetailApi(id)
    Object.assign(animalDetail, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const isOwner = ref(false)
const checkAnimalOwner = async () => {
  const data = await getSysTokenLoginApi()
  if (animalDetail.ownerId === data.data.id) {
    isOwner.value = true
  }
}

const init = async () => {
  await getDetail()
  await checkAnimalOwner()
}

onMounted(() => {
  init()
})

const animalAdoptRef = ref<InstanceType<typeof AnimalAdopt>>()
const handleAdoptAnimal = () => {
  animalAdoptRef.value?.open(router.currentRoute.value.query.id)
}

const animalContributionRef = ref<InstanceType<typeof AnimalContribution>>()
const handleContributionAnimal = () => {
  animalContributionRef.value?.open(router.currentRoute.value.query.id)
}
</script>

<template>
  <div class="w-full min-w-[1300px] flex justify-center">
    <div class="w-[1300px] p-[20px] mt-[20px] bg-white rounded-[4px]">
      <div class="flex" v-loading="loading">
        <div class="w-[400px] flex flex-col">
          <div class="w-full h-[400px]">
            <el-image class="w-full h-full" :src="animalDetail.picUrl" fit="cover"></el-image>
          </div>
          <div></div>
        </div>
        <div class="pl-[20px] flex flex-col flex-1 min-w-0 text-[14px]">
          <div class="h-[30px] flex items-center">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[20px]">
              {{ animalDetail.name }}
            </span>
            <el-tag v-if="isOwner" type="info" class="ml-[10px]">我的宠物</el-tag>
          </div>
          <div class="h-[60px] mt-[20px] px-[20px] bg-[#f5f5f5] flex items-center">
            <span>领养状态：</span>
            <span
              class="ml-[5px] font-bold text-[18px]"
              :class="[{ 'text-[#00AA00]': isAdopted, 'text-[#ff0000]': !isAdopted }]"
            >
              {{
                animalDetail.isAdopt === 0
                  ? '待领养'
                  : animalDetail.isAdopt === 1
                    ? '已领养'
                    : '未知'
              }}
            </span>
            <span class="ml-[50px]">遗失状态：</span>
            <span
              class="ml-[5px] font-bold text-[18px]"
              :class="[{ 'text-[#000]': isLosted, 'text-[#ff0000]': !isLosted }]"
            >
              {{
                animalDetail.isLost === 0 ? '未遗失' : animalDetail.isLost === 1 ? '已遗失' : '未知'
              }}
            </span>
          </div>
          <div class="px-[20px] py-[16px] grid grid-cols-2 gap-y-[16px]">
            <div class="flex items-center">
              <div class="w-[80px]">
                <span>宠物编号：</span>
              </div>
              <div class="flex-1 min-w-0">
                {{ animalDetail.animalNo }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-[80px]">
                <span>宠物类目：</span>
              </div>
              <div class="flex-1 min-w-0">
                {{ animalDetail.categoryName }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-[80px]">
                <span>宠物主人：</span>
              </div>
              <div class="flex-1 min-w-0">
                {{ animalDetail.ownerName }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-[80px]">
                <span>性别：</span>
              </div>
              <div class="flex-1 min-w-0">
                {{
                  animalDetail.gender === 'M'
                    ? '雄性'
                    : animalDetail.gender === 'F'
                      ? '雌性'
                      : '未知'
                }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-[80px]">
                <span>出生日期：</span>
              </div>
              <div class="flex-1 min-w-0">
                {{ animalDetail.birthday }}
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-[80px]">
                <span>体重：</span>
              </div>
              <div class="flex-1 min-w-0">{{ animalDetail.weight }} 千克</div>
            </div>
          </div>
          <div class="px-[20px] pb-[16px] flex items-start border-b-[1px]">
            <div class="w-[80px]">
              <span>描述信息：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ animalDetail.desc }}</span>
            </div>
          </div>
          <div class="h-[60px] px-[20px] mt-[30px] flex items-center bg-[#f5f5f5]">
            <div>联系电话：</div>
            <div class="ml-[5px] flex items-center" v-if="animalDetail.ownerPhone != null">
              <el-icon size="30" color="#ff0000">
                <phone />
              </el-icon>
              <span class="ml-[10px] font-bold text-[18px] text-[#ff0000]">{{
                animalDetail.ownerPhone
              }}</span>
            </div>
          </div>
          <div class="px-[20px] pt-[20px] flex items-center">
            <div
              v-if="animalDetail.isLost === 0 && !isOwner"
              class="w-[165px] h-[40px] rounded-[4px] bg-[#409eff] flex justify-center items-center cursor-pointer hover:opacity-70 active:opacity-100"
              @click="handleAdoptAnimal"
            >
              <el-icon size="20" color="#fff">
                <star />
              </el-icon>
              <span class="ml-[8px] text-[18px] text-[#fff]">我要领养</span>
            </div>
            <div
              v-if="animalDetail.isLost === 0 && !isOwner"
              class="w-[165px] h-[40px] ml-[20px] rounded-[4px] border border-[#409eff] flex justify-center items-center cursor-pointer"
              @click="handleContributionAnimal"
            >
              <el-icon size="20" color="#409eff">
                <present />
              </el-icon>
              <span class="ml-[8px] text-[18px] text-[#409eff]">我要捐助</span>
            </div>
            <!-- <div
              v-if="animalDetail.isLost === 1 && !isOwner"
              class="w-[165px] h-[40px] rounded-[4px] bg-[#409eff] flex justify-center items-center cursor-pointer hover:opacity-70 active:opacity-100"
            >
              <el-icon size="20" color="#fff">
                <chat-dot-square />
              </el-icon>
              <span class="ml-[8px] text-[18px] text-[#fff]">我有线索</span>
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
  <AnimalAdopt type="apply" @apply="getDetail" ref="animalAdoptRef" />
  <AnimalContribution @submit="router.go(0)" ref="animalContributionRef" />
</template>
