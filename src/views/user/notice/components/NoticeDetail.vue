<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import { computed, onMounted, reactive, unref } from 'vue'
import { getDetailApi } from '../notice.api'
import router from '@/router'
import { NoticeArticleDetail } from '../types'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))

let id: any = ''
const noticeArticleDetail = reactive(new NoticeArticleDetail())
const getDetail = async () => {
  try {
    openMainLoading()
    id = unref(router.currentRoute).query?.id
    const data = await getDetailApi(id)
    noticeArticleDetail.name = data.data.name
    noticeArticleDetail.content = data.data.content
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getDetail()
}

onMounted(() => {
  init()
})
</script>

<template>
  <div class="w-full min-w-[1200px] flex justify-center overflow-auto">
    <div class="w-[1200px] h-full flex flex-col">
      <div class="my-[14px]">
        <el-breadcrumb separator=">">
          <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item :to="{ path: '/notice' }">公告须知</el-breadcrumb-item>
          <el-breadcrumb-item>公告详情</el-breadcrumb-item>
        </el-breadcrumb>
      </div>
      <div class="px-[30px] pt-[20px] pb-[50px] bg-white rounded-[16px]" v-loading="loading">
        <div>
          <span class="text-[24px] font-semibold">{{ noticeArticleDetail.name }}</span>
        </div>
        <div class="mt-[20px]" v-html="noticeArticleDetail.content"></div>
      </div>
    </div>
  </div>
</template>
