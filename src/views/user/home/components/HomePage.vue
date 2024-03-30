<script setup lang="ts">
import { computed, onMounted, ref, unref } from 'vue'
import { getAnimalListApi } from '@/views/user/animal/animal.api'
import { AnimalCard, SearchParams } from '@/views/user/animal/types'
import router from '@/router'
import AnimalAdopt from '@/views/user/animal/components/AnimalAdopt.vue'
import AnimalContribution from '../../animal/components/AnimalContribution.vue'

const adoptAnimalList = ref<Array<AnimalCard>>([])
const getAdoptAnimalList = async () => {
  try {
    const queryData = new SearchParams()
    queryData.pageSize = 5
    queryData.isLost = 0
    const data = await getAnimalListApi(queryData)
    adoptAnimalList.value = data.data.dataList
  } catch (e) {
    console.log(e)
  }
}

const adoptItemIndex = ref(-1)
const adoptHandleMouseEnter = (index) => {
  adoptItemIndex.value = index
}

const adoptHandleMouseLeave = () => {
  adoptItemIndex.value = -1
}

const lostAnimalList = ref<Array<AnimalCard>>([])
const getLostAnimalList = async () => {
  try {
    const queryData = new SearchParams()
    queryData.pageSize = 5
    queryData.isLost = 1
    const data = await getAnimalListApi(queryData)
    lostAnimalList.value = data.data.dataList
  } catch (e) {
    console.log(e)
  }
}

const lostItemIndex = ref(-1)
const lostHandleMouseEnter = (index) => {
  lostItemIndex.value = index
}

const lostHandleMouseLeave = () => {
  lostItemIndex.value = -1
}

const init = () => {
  getAdoptAnimalList()
  getLostAnimalList()
}

onMounted(() => {
  init()
})

const getAnimalDetail = (animalId: string) => {
  const target = router.resolve({
    path: 'animal/detail',
    query: {
      id: animalId
    }
  })
  window.open(target.href, '_blank')
}

const animalAdoptRef = ref<InstanceType<typeof AnimalAdopt>>()
const handleAdoptApply = (animalId: string) => {
  animalAdoptRef.value?.open(animalId)
}

const animalContributionRef = ref<InstanceType<typeof AnimalContribution>>()
const handleContributionApply = (animalId: string) => {
  animalContributionRef.value?.open(animalId)
}
</script>

<template>
  <div class="w-full min-w-[1200px] flex justify-center">
    <div class="w-[1200px] py-[20px] flex flex-col">
      <div class="flex flex-row mb-[20px]">
        <div class="w-[700px] mr-[20px]">
          <el-carousel trigger="click" height="420px">
            <el-carousel-item v-for="item in adoptAnimalList" :key="item.id">
              <el-image
                class="w-full h-full"
                :src="item.picUrl == '' || item.picUrl == null ? '' : item.picUrl"
                fit="cover"
              ></el-image>
            </el-carousel-item>
          </el-carousel>
        </div>
        <div class="flex flex-col items-start" style="width: calc(100% - 600px)">
          <div class="border-b-[5px] px-[10px] py-[5px] mb-[20px] border-blue-300">领养须知</div>
          <div class="overflow-clip">公告内容</div>
          <div class="border-b-[5px] px-[10px] py-[5px] mb-[20px] border-blue-300">小常识</div>
          <div class="overflow-clip">公告内容</div>
        </div>
      </div>
      <div class="w-full mb-[20px]">
        <div class="mb-[10px] flex justify-start">
          <span class="flex-1 text-[22px]">领养宠物</span>
          <div class="flex justify-end items-center cursor-pointer hover:text-[#409eff]">
            <span>查看更多</span>
            <el-icon>
              <arrow-right />
            </el-icon>
          </div>
        </div>
        <div>
          <ul class="w-full grid grid-cols-5 gap-x-[10px]">
            <li
              class="w-full p-[10px] flex flex-col bg-white cursor-pointer"
              v-for="(item, index) in adoptAnimalList"
              :key="item.id"
              @mouseenter="adoptHandleMouseEnter(index)"
              @mouseleave="adoptHandleMouseLeave"
              @click="getAnimalDetail(item.id)"
            >
              <el-image
                class="w-full h-[212px] mb-[10px] rounded-[10px]"
                :src="item.picUrl === null || item.picUrl === undefined ? '' : item.picUrl"
                :title="item.name"
                fit="cover"
              ></el-image>
              <div class="mb-[10px] flex justify-between">
                <div>
                  <el-tag class="mr-[5px]">{{ item.categoryName }}</el-tag>
                </div>
                <div>
                  <el-tag type="success">
                    <span>{{ item.isAdopt === 1 ? '已领养' : '待领养' }}</span>
                  </el-tag>
                  <el-tag class="ml-[5px]" type="warning" v-if="item.isLost === 1">
                    <span>已遗失</span>
                  </el-tag>
                </div>
              </div>
              <div
                class="h-[30px] flex justify-start items-center text-[16px]"
                v-if="adoptItemIndex !== index"
              >
                <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ item.name }}</span>
              </div>
              <div class="h-[30px] flex justify-between items-center text-[12px]" v-else>
                <div
                  class="w-[100px] h-[26px] rounded-[16px] border border-[#979797] hover:border-[#409eff]"
                  @click.stop="handleAdoptApply(item.id)"
                >
                  <span
                    class="h-full flex justify-center items-center text-[#979797] hover:text-[#409eff]"
                  >
                    我要领养
                  </span>
                </div>
                <div
                  class="w-[100px] h-[26px] rounded-[16px] border border-[#979797] hover:border-[#409eff]"
                  @click.stop="handleContributionApply(item.id)"
                >
                  <span
                    class="h-full flex justify-center items-center text-[#979797] hover:text-[#409eff]"
                  >
                    我要捐助
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div class="w-full">
        <div class="mb-[10px] flex justify-start">
          <span class="flex-1 text-[22px]">遗失宠物</span>
          <div class="flex justify-end items-center cursor-pointer hover:text-[#409eff]">
            <span>查看更多</span>
            <el-icon>
              <arrow-right />
            </el-icon>
          </div>
        </div>
        <div>
          <ul class="w-full grid grid-cols-5 gap-x-[10px]">
            <li
              class="w-full p-[10px] flex flex-col bg-white cursor-pointer"
              v-for="(item, index) in lostAnimalList"
              :key="item.id"
              @mouseenter="lostHandleMouseEnter(index)"
              @mouseleave="lostHandleMouseLeave"
              @click="getAnimalDetail(item.id)"
            >
              <el-image
                class="w-full h-[212px] mb-[10px] rounded-[10px]"
                :src="item.picUrl === null || item.picUrl === undefined ? '' : item.picUrl"
                :title="item.name"
                fit="cover"
              ></el-image>
              <div class="mb-[10px] flex justify-between">
                <div>
                  <el-tag class="mr-[5px]">{{ item.categoryName }}</el-tag>
                </div>
                <div>
                  <el-tag type="success">
                    <span>{{ item.isAdopt === 1 ? '已领养' : '待领养' }}</span>
                  </el-tag>
                  <el-tag class="ml-[5px]" type="warning" v-if="item.isLost === 1">
                    <span>已遗失</span>
                  </el-tag>
                </div>
              </div>
              <div
                class="h-[30px] flex justify-start items-center text-[16px]"
                v-if="lostItemIndex !== index"
              >
                <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ item.name }}</span>
              </div>
              <div class="h-[30px] flex justify-between items-center text-[12px]" v-else>
                <div
                  class="w-[100px] h-[26px] rounded-[16px] border border-[#979797] hover:border-[#409eff]"
                >
                  <span
                    class="h-full flex justify-center items-center text-[#979797] hover:text-[#409eff]"
                  >
                    我有线索
                  </span>
                </div>
                <div
                  class="w-[100px] h-[26px] rounded-[16px] border border-[#979797] hover:border-[#409eff]"
                >
                  <span
                    class="h-full flex justify-center items-center text-[#979797] hover:text-[#409eff]"
                  >
                    联系本人
                  </span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
  <AnimalAdopt @submit="router.go(0)" ref="animalAdoptRef" />
  <AnimalContribution @submit="router.go(0)" ref="animalContributionRef" />
</template>

<style scoped>
:deep(.el-tabs__nav-wrap::after) {
  /* 去除底部灰色下划线 */
  position: static !important;
}
</style>
