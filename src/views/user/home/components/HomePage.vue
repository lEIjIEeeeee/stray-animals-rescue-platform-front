<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { getAnimalListApi } from '@/views/user/animal/animal.api'
import { SearchParams } from '@/views/user/animal/types'

const carouselImgList = [
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png'
]

const adoptAnimalList = ref([])
const getAdoptAnimalList = async () => {
  const queryData = new SearchParams()
  queryData.isLost = 0
  const data = await getAnimalListApi(queryData)
  adoptAnimalList.value = data.data.dataList
}

const adoptItemIndex = ref(-1)
const adoptHandleMouseEnter = (index) => {
  adoptItemIndex.value = index
}

const adoptHandleMouseLeave = () => {
  adoptItemIndex.value = -1
}

const lostAnimalList = ref([])
const getLostAnimalList = async () => {
  const queryData = new SearchParams()
  queryData.isLost = 1
  const data = await getAnimalListApi(queryData)
  lostAnimalList.value = data.data.dataList
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
</script>

<template>
  <div class="w-full min-w-[1300px] flex justify-center">
    <div class="w-[1300px] py-[20px] flex flex-col">
      <div class="flex flex-row mb-[20px]">
        <div class="w-[600px] mr-[20px]">
          <el-carousel trigger="click" height="320px">
            <el-carousel-item v-for="item in carouselImgList" :key="item">
              <img :src="item" />
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
            >
              <el-image
                class="w-full h-[212px] mb-[10px] rounded-[10px]"
                :src="item.picUrl"
                fit="cover"
              ></el-image>
              <div v-if="adoptItemIndex !== index" class="w-full h-[25px] flex text-[14px]">
                <div>
                  <el-tag class="mr-[5px]">{{ item.categoryName }}</el-tag>
                  <el-tag>
                    {{ item.gender === 'M' ? '雄性' : item.gender === 'F' ? '雌性' : '未知' }}
                  </el-tag>
                </div>
                <div class="flex-1 flex justify-end">
                  <span>{{ item.name }}</span>
                </div>
              </div>
              <div v-else class="h-[25px] flex justify-between items-center text-[12px]">
                <div
                  class="w-[80px] h-full rounded-[10px] border border-[#979797] hover:border-[#409eff]"
                >
                  <span
                    class="h-full flex justify-center items-center text-[#979797] hover:text-[#409eff]"
                    >我要领养</span
                  >
                </div>
                <div
                  class="w-[80px] h-full rounded-[10px] border border-[#979797] hover:border-[#409eff]"
                >
                  <span
                    class="h-full flex justify-center items-center text-[#979797] hover:text-[#409eff]"
                    >我要捐助</span
                  >
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
            >
              <el-image
                class="w-full h-[212px] mb-[10px] rounded-[10px]"
                :src="item.picUrl"
                fit="cover"
              ></el-image>
              <div v-if="lostItemIndex !== index" class="w-full h-[25px] flex text-[14px]">
                <div>
                  <el-tag class="mr-[5px]">{{ item.categoryName }}</el-tag>
                  <el-tag>
                    {{ item.gender === 'M' ? '雄性' : item.gender === 'F' ? '雌性' : '未知' }}
                  </el-tag>
                </div>
                <div class="flex-1 flex justify-end">
                  <span>{{ item.name }}</span>
                </div>
              </div>
              <div v-else class="h-[25px] flex justify-start items-center text-[12px]">
                <div
                  class="w-[80px] h-full rounded-[10px] border border-[#979797] hover:border-[#409eff]"
                >
                  <span
                    class="h-full flex justify-center items-center text-[#979797] hover:text-[#409eff]"
                    >联系本人</span
                  >
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-tabs__nav-wrap::after) {
  /* 去除底部灰色下划线 */
  position: static !important;
}
</style>
