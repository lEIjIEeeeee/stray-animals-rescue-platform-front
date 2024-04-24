<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { AnimalCard, SearchParams } from './types'
import { getAnimalListApi } from './animal.api'
import useMainLoading from '@/hooks/useMainLoading'
import { DataListResponse } from '@/views/common/types'
import router from '@/router'
import AnimalAdopt from './components/AnimalAdopt.vue'
import AnimalContribution from './components/AnimalContribution.vue'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)
const totalPage = computed(() => Math.ceil(animalListResponse.total / animalListResponse.pageSize))
const leftColor = computed(() =>
  unref(loading) || animalListResponse.pageNo <= 1 ? '#ccc' : '#000'
)
const rightColor = computed(() =>
  unref(loading) || animalListResponse.pageNo >= unref(totalPage) ? '#ccc' : '#000'
)

const itemIndex = ref(-1)
const searchParams = reactive(new SearchParams())
const animalListResponse = reactive(new DataListResponse())
const getAnimalList = async () => {
  try {
    openMainLoading()
    const data = await getAnimalListApi(searchParams)
    animalListResponse.pageNo = data.data.pageNo
    animalListResponse.pageSize = data.data.pageSize
    animalListResponse.total = data.data.total
    animalListResponse.dataList = []
    data.data.dataList.forEach(function (item, index) {
      const animalInfo = new AnimalCard()
      animalInfo.id = item.id
      animalInfo.name = item.name
      animalInfo.categoryName = item.categoryName
      animalInfo.isAdopt = item.isAdopt
      animalInfo.isLost = item.isLost
      animalInfo.picUrl = item.picUrl
      animalListResponse.dataList[index] = animalInfo
    })
    console.log(animalListResponse)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const handleMouseEnter = (index: number) => {
  itemIndex.value = index
}

const handleMouseLeave = () => {
  itemIndex.value = -1
}

const init = () => {
  getAnimalList()
}

onMounted(() => {
  init()
})

const currentPageChange = (val: number) => {
  openMainLoading()
  searchParams.pageNo = val
  getAnimalList()
  closeMainLoading()
}

const handleLeftIconClick = () => {
  if (!unref(loading) && animalListResponse.pageNo > 1) {
    searchParams.pageNo -= 1
    getAnimalList()
  }
}

const handleRightIconClick = () => {
  if (!unref(loading) && animalListResponse.pageNo < unref(totalPage)) {
    searchParams.pageNo += 1
    getAnimalList()
  }
}

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
    <div class="w-[1200px]">
      <div class="my-[14px] flex justify-between items-center">
        <div class="flex items-center">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>全部萌宠</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="flex items-center text-[14px] text-[#666666]">
          <span>共有{{ animalListResponse.total }}个宠物</span>
          <el-icon
            class="ml-[10px] cursor-pointer"
            @click="handleLeftIconClick"
            :disabled="loading"
            :color="leftColor"
          >
            <arrow-left />
          </el-icon>
          <div>
            <span class="ml-[10px] text-[#409eff]">{{ animalListResponse.pageNo }}</span>
            <span>/{{ totalPage }}</span>
          </div>
          <el-icon
            class="ml-[10px] cursor-pointer"
            @click="handleRightIconClick"
            :color="rightColor"
          >
            <arrow-right />
          </el-icon>
        </div>
      </div>
      <div class="grid grid-cols-5 gap-x-[10px] gap-y-[20px]" v-loading="loading">
        <div
          class="p-[10px] flex flex-col bg-white cursor-pointer hover:shadow"
          v-for="(item, index) in animalListResponse.dataList"
          :key="item.id"
          @mouseenter="handleMouseEnter(index)"
          @mouseleave="handleMouseLeave"
          @click="getAnimalDetail(item.id)"
        >
          <el-image
            class="w-full h-[212px] mb-[10px] rounded-[4px]"
            :src="item.picUrl == '' || item.picUrl == null ? '' : item.picUrl"
            fit="cover"
            :title="item.name"
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
          <div class="h-[30px] flex items-center text-[16px]" v-if="itemIndex !== index">
            <span class="overflow-hidden text-ellipsis whitespace-nowrap">{{ item.name }}</span>
          </div>
          <div
            class="h-[30px] flex justify-between items-center text-[12px]"
            v-if="itemIndex === index && item.isLost === 0"
          >
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
          <div
            class="h-[30px] flex justify-between items-center text-[12px]"
            v-if="itemIndex === index && item.isLost === 1"
          >
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
        </div>
      </div>
      <div class="h-[60px] flex justify-end">
        <el-config-provider>
          <el-pagination
            background
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            layout="prev, pager, next, jumper, total"
            :total="animalListResponse.total"
            :disabled="loading"
            @current-change="currentPageChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
  <AnimalAdopt @submit="router.go(0)" ref="animalAdoptRef" />
  <AnimalContribution @submit="router.go(0)" ref="animalContributionRef" />
</template>

<style scoped></style>
