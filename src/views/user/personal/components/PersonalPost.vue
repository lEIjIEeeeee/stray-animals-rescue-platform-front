<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import useMainLoading from '@/hooks/useMainLoading'
import { BaseListResponse, SearchParams } from '../types'
import { getPersonalPostListApi } from '../personal.api'
import dayjs from 'dayjs'
import { bizTypeDict, getEnumNameByValue } from '@/stores/enums'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => mainLoading.value)

defineExpose({
  search
})

const searchParams = reactive(new SearchParams())
function search(str) {
  searchParams.searchContent = str
  getPostList()
}

const postListResponse = reactive(new BaseListResponse())
const getPostList = async () => {
  try {
    openMainLoading()
    const data = await getPersonalPostListApi(searchParams)
    Object.assign(postListResponse, data.data)
    console.log(postListResponse.dataList)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getPostList()
}

onMounted(() => {
  init()
})

const goPostDetail = (postId: string) => {
  router.push({
    path: '/post/detail',
    query: {
      id: postId
    }
  })
}
</script>

<template>
  <div v-if="postListResponse.total > 0">
    <div class="mx-[20px]">
      <ul v-loading="loading">
        <li
          class="h-[180px] py-[24px] border-t-[1px]"
          v-for="item in postListResponse.dataList"
          :key="item.id"
        >
          <div class="list-div h-full flex flex-row cursor-pointer" @click="goPostDetail(item.id)">
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
                  <span class="text-[18px] font-medium hover:text-[#409eff]">{{ item.title }}</span>
                </div>
                <div class="line-clamp-3 text-ellipsis">
                  <span class="text-[14px]">{{ item.postAbstract }}</span>
                </div>
              </div>
              <div class="inline-flex items-center text-[14px]">
                <div>
                  <el-tag>{{ item.categoryName }}</el-tag>
                  <el-tag class="ml-[5px]" type="warning">{{
                    getEnumNameByValue(bizTypeDict, item.bizType)
                  }}</el-tag>
                </div>
                <div class="ml-[10px] text-black text-opacity-25">
                  <span>发布时间：{{ item.createTime }}</span>
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
                <div class="edit-button hidden hover:text-[#0152d9]">
                  <span>编辑</span>
                </div>
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
            :page-sizes="[1, 10, 20, 50, 100]"
            layout=" prev, pager, next, jumper,sizes, total"
            :total="postListResponse.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
</template>

<style scoped>
.list-div:hover .edit-button {
  display: inline;
  margin-left: auto;
}
</style>
