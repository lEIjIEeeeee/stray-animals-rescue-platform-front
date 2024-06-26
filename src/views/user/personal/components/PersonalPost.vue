<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import useMainLoading from '@/hooks/useMainLoading'
import { BaseListResponse, SearchParams } from '../types'
import { getPersonalPostListApi } from '../personal.api'
import { bizTypeDict, getEnumNameByValue, postStatusDict } from '@/stores/enums'
import router from '@/router'
import { deletePostApi } from '@/views/user/post/post.api'
import { get } from 'lodash'
import { ElMessage, ElMessageBox } from 'element-plus'

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

const editPost = (postId: string) => {
  router.push({
    path: '/post/editPost',
    query: {
      id: postId
    }
  })
}

const deletePost = async (postId: number) => {
  try {
    openMainLoading()
    await ElMessageBox.confirm('确认删除帖子？删除后无法撤销此操作。', {
      type: 'warning'
    })
    const data = await deletePostApi({ id: postId })
    if (get(data, 'code') === 0) {
      ElMessage.success('删除成功')
    }
    closeMainLoading()
    getPostList()
  } catch (e) {
    closeMainLoading()
  }
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getPostList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getPostList()
}
</script>

<template>
  <div v-if="postListResponse.total > 0">
    <div class="mx-[20px]">
      <ul v-loading="loading">
        <li
          class="h-[200px] py-[20px] border-t-[1px]"
          v-for="item in postListResponse.dataList"
          :key="item.id"
        >
          <div class="h-full flex flex-row cursor-pointer" @click="goPostDetail(item.id)">
            <div>
              <el-image
                class="w-[240px] h-full mr-[20px]"
                :src="item.picUrl == '' || item.picUrl == null ? '' : item.picUrl"
                fit="cover"
              ></el-image>
            </div>
            <div class="w-full flex flex-col justify-between">
              <div class="flex flex-col">
                <div class="flex-1 line-clamp-1 text-ellipsis flex items-end">
                  <span class="flex-1 text-[18px] font-semibold hover:text-[#409eff]">
                    {{ item.title }}
                  </span>
                  <span
                    class="pr-[10px]"
                    :class="[
                      {
                        'text-[#fa8c35]': item.status === 1,
                        'text-[#00bc12]': item.status === 2,
                        'text-[#c83c23]': item.status === 3,
                        'text-[#b2b6b6]': item.status === 4
                      }
                    ]"
                  >
                    {{ getEnumNameByValue(postStatusDict, item.status) }}
                  </span>
                </div>
                <div class="mt-[10px] line-clamp-2 text-ellipsis">
                  <span class="text-[14px]">{{ item.postAbstract }}</span>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-1 flex items-center text-[14px]">
                  <div>
                    <el-tag>{{ item.categoryName }}</el-tag>
                    <el-tag class="ml-[5px]" type="warning">
                      {{ getEnumNameByValue(bizTypeDict, item.bizType) }}
                    </el-tag>
                  </div>
                  <div class="ml-[10px] text-black text-opacity-25">
                    <span>发布时间：{{ item.createTime }}</span>
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
                <div class="px-[10px] text-[14px] hover:text-[#409eff]">
                  <span @click.stop="editPost(item.id)">编辑</span>
                </div>
                <div class="px-[10px] text-[14px] hover:text-[#409eff]">
                  <span @click.stop="deletePost(item.id)">删除</span>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="w-full h-[50px] sticky bottom-0 bg-white"
      style="box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1)"
    >
      <div class="h-full py-[10px] pr-[10px] flex flex-row justify-end items-center">
        <el-config-provider>
          <el-pagination
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="prev, pager, next, jumper,sizes, total"
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
