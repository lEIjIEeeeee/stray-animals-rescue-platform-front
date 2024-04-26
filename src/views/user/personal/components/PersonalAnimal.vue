<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { SearchParams, BaseListResponse } from '../types'
import useMainLoading from '@/hooks/useMainLoading'
import { getPersonalAnimalListApi } from '../personal.api'
import dayjs from 'dayjs'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => mainLoading.value)

defineExpose({
  search
})

const searchParams = reactive(new SearchParams())
function search(str) {
  searchParams.searchContent = str
  getAnimalList()
}

const animalListResponse = reactive(new BaseListResponse())
const getAnimalList = async () => {
  try {
    openMainLoading()
    const data = await getPersonalAnimalListApi(searchParams)
    Object.assign(animalListResponse, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getAnimalList()
}

onMounted(() => {
  init()
})

const handleCurrentPageChange = (val) => {
  searchParams.pageNo = val
  getAnimalList()
}

const handlePageSizeChange = (val) => {
  searchParams.pageSize = val
  getAnimalList()
}

const goAnimalDetail = (animalId: string) => {
  router.push({
    path: '/animal/detail',
    query: {
      id: animalId
    }
  })
}
</script>

<template>
  <div v-if="animalListResponse.total > 0">
    <div class="mx-[20px]">
      <ul v-loading="loading">
        <li
          class="h-[180px] py-[24px] border-t-[1px]"
          v-for="item in animalListResponse.dataList"
          :key="item.id"
          @click="goAnimalDetail(item.id)"
        >
          <div class="list-div h-full flex flex-row cursor-pointer">
            <div>
              <el-image
                class="w-[240px] h-full mr-[20px]"
                :src="item.picUrl == '' || item.picUrl == null ? '' : item.picUrl"
                fit="cover"
              ></el-image>
            </div>
            <div class="w-full flex flex-col justify-between">
              <div class="flex flex-col">
                <div class="inline-flex">
                  <span class="text-[18px] font-medium hover:text-[#409eff]">{{ item.name }}</span>
                  <span
                    class="ml-auto font-sans"
                    style="
                      background: linear-gradient(to right top, #00ff00, #0000ff);
                      -webkit-background-clip: text;
                      background-clip: text;
                      color: transparent;
                    "
                  >
                    NO.{{ item.animalNo }}
                  </span>
                </div>
                <div class="line-clamp-3 text-ellipsis">
                  <span class="text-[14px]">{{ item.desc }}</span>
                </div>
              </div>
              <div class="inline-flex items-center text-[14px]">
                <div class="flex-1 flex items-center text-[14px]">
                  <div>
                    <el-tag>{{ item.categoryName }}</el-tag>
                    <el-tag v-if="item.isLost === 1" class="ml-[5px]" type="info"
                      ><span>已遗失</span></el-tag
                    >
                  </div>
                  <div class="ml-[10px] text-black text-opacity-25">
                    <span>录入时间：{{ dayjs(item.createTime).format('YYYY-MM-DD') }}</span>
                  </div>
                </div>

                <!-- <div class="w-[1px] h-[10px] mx-[10px] bg-gray-300"></div>
                <div>
                  <span>{{ item.postAmount ? item.postAmount : 0 }} 帖子</span>
                </div>
                <div class="w-[1px] h-[10px] mx-[10px] bg-gray-300"></div>
                <div>
                  <span>{{ item.contributeAmount ? item.contributeAmount : 0 }} 捐助</span>
                </div>
                <div class="w-[1px] h-[10px] mx-[10px] bg-gray-300"></div>
                <div>
                  <span>{{ item.applyAmount ? item.applyAmount : 0 }} 申请</span>
                </div> -->
                <!-- <div class="hover:text-[#409eff]">
                  <span>编辑</span>
                </div> -->
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="w-full h-[70px] sticky bottom-0 bg-white"
      style="box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1)"
    >
      <div class="h-full py-[10px] pr-[10px] flex flex-row justify-end items-center">
        <el-config-provider>
          <el-pagination
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout=" prev, pager, next, jumper,sizes, total"
            :total="animalListResponse.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
</template>
