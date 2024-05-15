<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, unref } from 'vue'
import { getAnimalListApi } from '@/views/user/animal/animal.api'
import { SearchParams } from '@/views/user/animal/types'

const windowWidth = ref(0)
const windowHeight = ref(0)

const carouselContainerHeight = computed(() => unref(windowHeight) - 90)

const handleResize = () => {
  windowWidth.value = window.innerWidth
  windowHeight.value = window.innerHeight
}

onMounted(() => {
  handleResize()
  window.addEventListener('resize', handleResize)
  init()
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
})

const advertList = [
  {
    picUrl: '/src/assets/advert/advert_1.jpg',
    sort: 1
  },
  {
    picUrl: '/src/assets/advert/advert_2.jpg',
    sort: 2
  },
  {
    picUrl: '/src/assets/advert/advert_3.jpg',
    sort: 3
  },
  {
    picUrl: '/src/assets/advert/advert_4.jpg',
    sort: 4
  }
]

const init = () => {
  getAnimalList()
}

const animalList = ref([])
const getAnimalList = async () => {
  const searchParams = new SearchParams()
  searchParams.pageSize = 6
  const data = await getAnimalListApi(searchParams)
  animalList.value = data.data.dataList
}
</script>

<template>
  <div class="w-full min-w-[1200px] flex justify-center">
    <div class="w-full flex flex-col">
      <div class="w-full">
        <el-carousel
          trigger="click"
          :height="carouselContainerHeight + 'px'"
          :pause-on-hover="false"
        >
          <el-carousel-item v-for="(item, index) in advertList" :key="'advert_' + index">
            <el-image class="w-full h-full" :src="item.picUrl" fit="cover"></el-image>
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="w-full flex flex-1 justify-center">
        <div class="w-[1400px] px-[20px] py-[30px] flex justify-center items-center">
          <div class="grid grid-cols-3 gap-x-[50px]">
            <div>
              <div class="font-semibold text-[18px] mb-[20px]">
                <span>网站简介</span>
              </div>
              <div class="leading-normal">
                本平台是互联网流浪动物救助平台，致力于流浪动物保护事业。以珍爱生命、倡导精神文明和发扬人道主义为思想基础，以保护流浪动物、维护流浪动物的生存权利和不受虐待的权利、以及改善和提高小动物的生命条件、饲养水平为宗旨，坚决反对任何虐待、残害流浪动物的行为和思想，为西安市流浪动物救助组织及救助人提供专业化救助服务及救助物资，为中国流浪动物救助事业做一份贡献。
              </div>
            </div>
            <div>
              <div class="font-semibold text-[18px] mb-[20px]">
                <span>宠物展示</span>
              </div>
              <div class="grid grid-cols-3 gap-x-[5px] gap-y-[5px]">
                <div v-for="item in animalList" :key="item.id">
                  <el-image class="w-full h-full" :src="item.picUrl" fit="cover"></el-image>
                </div>
              </div>
            </div>
            <div>
              <div class="font-semibold text-[18px] mb-[20px]">
                <span>联系我们</span>
              </div>
              <div class="grid grid-cols-1 gap-y-[20px]">
                <div>
                  <span>联系方式：</span>
                  <span class="text-[#409eff]">15769237821</span>
                </div>
                <div>
                  <span>邮箱：</span>
                  <span class="text-[#409eff]">15769237821@qq.com</span>
                </div>
              </div>
            </div>
          </div>
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
