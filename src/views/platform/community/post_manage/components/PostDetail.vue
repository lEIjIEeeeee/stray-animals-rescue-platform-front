<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import useMainLoading from '@/hooks/useMainLoading'
import router from '@/router'
import { getDetailApi } from '../post.api'
import { PostDetail } from '../types'
import { auditStatusDict, bizTypeDict, getEnumNameByValue } from '@/stores/enums'
import PostAudit from './PostAudit.vue'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)
const showViewer = ref(false)

let postId: any = ''
const init = () => {
  postId = unref(router.currentRoute).query?.id
  getDetail()
}

const detail = reactive(new PostDetail())
const getDetail = async () => {
  try {
    openMainLoading()
    const data = await getDetailApi(postId)
    Object.assign(detail, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

onMounted(() => {
  init()
})

const auditRef = ref<InstanceType<typeof PostAudit>>()
const handleAudit = () => {
  auditRef.value?.open(postId)
}
</script>

<template>
  <div class="w-full bg-gray-50 overflow-auto">
    <div class="h-full">
      <div class="px-[24px] py-[20px] flex flex-col">
        <div class="text-[18px] font-bold">
          <span>基本信息</span>
        </div>
        <div
          class="mt-[20px] grid grid-cols-3 gap-x-[10px] gap-y-[20px] text-[14px] text-[#606266] font-medium"
        >
          <div class="flex">
            <div class="w-[80px]">
              <span>帖子标题：</span>
            </div>
            <div class="ml-[10px] flex-1">
              <span>{{ detail.title }}</span>
            </div>
          </div>
          <div class="flex">
            <div class="w-[80px]">
              <span>作者：</span>
            </div>
            <div class="ml-[10px] flex-1">
              <span>{{ detail.nickName }}</span>
            </div>
          </div>
          <div class="flex">
            <div class="w-[80px]">
              <span>动物类目：</span>
            </div>
            <div class="ml-[10px] flex-1">
              <span>{{ detail.categoryName }}</span>
            </div>
          </div>
          <div class="flex">
            <div class="w-[80px]">
              <span>帖子分类：</span>
            </div>
            <div class="ml-[10px] flex-1">
              <span>{{ getEnumNameByValue(bizTypeDict, detail.bizType) }}帖</span>
            </div>
          </div>
          <div class="flex">
            <div class="w-[80px]">
              <span>发布时间：</span>
            </div>
            <div class="ml-[10px] flex-1">
              <span>{{ detail.createTime }}</span>
            </div>
          </div>
        </div>

        <div class="mt-[30px] text-[18px] font-bold">
          <span>封面主图</span>
        </div>
        <div class="h-[140px] mt-[20px] p-[10px] border rounded-[4px] flex items-center">
          <el-image
            class="w-[120px] h-[120px] cursor-pointer hover:opacity-50"
            fit="cover"
            :src="detail.picUrl"
            @click="showViewer = true"
          ></el-image>
          <el-image-viewer
            v-if="showViewer"
            :initial-index="0"
            :url-list="[detail.picUrl]"
            @close="showViewer = false"
          />
        </div>

        <div class="mt-[30px] text-[18px] font-bold">
          <span>帖子摘要</span>
        </div>
        <div class="mt-[20px] text-[#606266]">
          <div>{{ detail.postAbstract }}</div>
        </div>

        <div class="mt-[30px] text-[18px] font-bold">
          <span>正文内容</span>
        </div>
        <div class="mt-[20px]">
          <!-- <div class="p-[10px] rounded-[4px] border"> -->
          <div v-html="detail.content"></div>
          <!-- </div> -->
        </div>

        <div v-if="detail.status === 2 || detail.status === 3">
          <div class="mt-[30px] text-[18px] font-bold">
            <span>审核信息</span>
          </div>
          <div class="mt-[20px]">
            <div
              class="grid grid-cols-3 gap-x-[10px] gap-y-[20px] text-[14px] text-[#606266] font-medium"
            >
              <div class="flex">
                <div class="w-[80px]">
                  <span>审核结果：</span>
                </div>
                <div class="ml-[10px] flex-1">
                  <span>
                    {{ getEnumNameByValue(auditStatusDict, detail.status) }}
                  </span>
                </div>
              </div>
              <div class="flex">
                <div class="w-[80px]">
                  <span>审核人：</span>
                </div>
                <div class="ml-[10px] flex-1">
                  <span>{{ detail.auditorName }}</span>
                </div>
              </div>
              <div class="flex">
                <div class="w-[80px]">
                  <span>审核时间：</span>
                </div>
                <div class="ml-[10px] flex-1">
                  <span>{{ detail.auditTime }}</span>
                </div>
              </div>
              <div class="flex">
                <div class="w-[80px]">
                  <span>审核备注：</span>
                </div>
                <div class="ml-[10px] flex-1">
                  <span>{{ detail.auditRemark }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full h-[50px] pl-[10px] border-t-[1px] bg-white sticky bottom-0 z-10"
      v-if="detail.status === 1"
    >
      <div class="h-[50px] flex justify-start items-center">
        <el-button type="primary" :disabled="loading" @click="handleAudit">审核</el-button>
        <el-button :disabled="loading" @click="router.go(-1)">返回列表</el-button>
      </div>
    </div>
  </div>

  <PostAudit ref="auditRef" />
</template>
