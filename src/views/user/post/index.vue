<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { getPostListApi } from './post.api'
import { SearchParams, PostList } from './types'
import router from '@/router/index'

const searchParams = new SearchParams()
const postList = reactive(new PostList())

const getPostList = async () => {
  try {
    openElPageFormLoading()
    const result = await getPostListApi(searchParams)
    postList.pageNo = result.data.pageNo
    postList.pageSize = result.data.pageSize
    postList.total = result.data.total
    postList.dataList = result.data.dataList
    closeElPageFormLoading()
  } catch (e) {
    closeElPageFormLoading()
  }
}

const disabled = ref(false)
const loading = computed(() => disabled.value)

const openElPageFormLoading = () => {
  disabled.value = true
}

const closeElPageFormLoading = () => {
  disabled.value = false
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getPostList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getPostList()
}

const init = async () => {
  getPostList()
}

onMounted(() => {
  init()
})

const refreshDivDisable = ref(false)
const postDivDisable = ref(false)

const handlePostDivMouseEnter = () => {
  postDivDisable.value = true
}

const handlePostDivMouseLeave = () => {
  postDivDisable.value = false
}

const handleRefreshDivMouseEnter = () => {
  refreshDivDisable.value = true
}

const handleRefreshDivMouseLeave = () => {
  refreshDivDisable.value = false
}

const refreshPage = () => {
  location.reload()
}

const addPost = () => {
  router.push('/post/addPost')
}

const getDetail = (id) => {
  const target = router.resolve({
    path: 'post/detail',
    query: {
      id: id
    }
  })
  window.open(target.href, '_blank')
}
</script>

<template>
  <div class="w-full h-full flex flex-col items-center">
    <div class="h-full w-[800px] bg-white">
      <ul class="mx-[24px] my-[20px]" v-loading="loading">
        <li
          class="mb-[30px] border-b-[1px] pb-[16px]"
          v-for="item in postList.dataList"
          :key="item.id"
        >
          <a @click="getDetail(item.id)">
            <div class="mb-[12px] hover:text-[#409eff] cursor-pointer">
              <h4 class="font-medium text-[20px]">
                {{ item.title }}
              </h4>
            </div>
          </a>
          <div class="post-abstract text-[16px] font-medium overflow-hidden text-ellipsis">
            {{ item.postAbstract }}
          </div>
          <div class="flex items-center mt-[16px] text-[14px]">
            <div class="mr-[20px] text-black text-opacity-25 flex items-center">
              <span class="mr-[5px]">作者：</span>
              <el-image
                class="w-[25px] h-[25px] rounded-[50%] mr-[5px]"
                src="src/assets/user/default_avatar.png"
              />
              <span>{{ item.createUser }}wlj</span>
            </div>
            <span class="text-black text-opacity-25">发布时间：{{ item.createTime }}</span>
          </div>
        </li>
      </ul>
      <div class="w-full flex justify-end pr-[24px] pb-[20px]">
        <el-config-provider>
          <el-pagination
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout=" prev, pager, next, jumper,sizes, total"
            :total="postList.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>

  <div
    class="w-[50px] h-[50px] fixed right-[50px] bottom-[220px] bg-gray-400 rounded-[5px] flex justify-center items-center cursor-pointer"
    style="box-shadow: 0 0 6px rgba(0, 0, 0, 0.12)"
    @mouseenter="handleRefreshDivMouseEnter"
    @mouseleave="handleRefreshDivMouseLeave"
    @click="refreshPage"
  >
    <el-icon v-if="!refreshDivDisable" :size="40" color="#ffffff">
      <refresh />
    </el-icon>
    <div
      v-if="refreshDivDisable"
      class="w-full h-full text-white font-medium text-[15px] bg-gray-500 rounded-[5px] flex justify-center items-center"
    >
      刷新
    </div>
  </div>
  <div
    router
    class="w-[50px] h-[50px] fixed right-[50px] bottom-[160px] bg-blue-400 rounded-[5px] flex justify-center items-center cursor-pointer"
    style="box-shadow: 0 0 6px rgba(0, 0, 0, 0.12)"
    @mouseenter="handlePostDivMouseEnter"
    @mouseleave="handlePostDivMouseLeave"
    @click="addPost"
  >
    <el-icon v-if="!postDivDisable" :size="45" color="#ffffff">
      <edit />
    </el-icon>
    <div v-if="postDivDisable" class="text-white font-medium text-[15px]">发帖</div>
  </div>

  <el-backtop class="w-[50px] h-[50px]" :bottom="100" :right="55" visibility-height="90">
    <div
      class="w-full h-full rounded-[50%] flex flex-col items-center justify-center"
      style="box-shadow: 0 0 6px rgba(0, 0, 0, 0.12)"
    >
      <el-icon>
        <caret-top />
      </el-icon>
      <span class="font-medium text-[15px]">顶部</span>
    </div>
  </el-backtop>
</template>

<style scoped>
.post-abstract {
  display: -webkit-box !important;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical !important;
}
</style>
