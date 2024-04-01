<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import { getDetailApi } from '../post.api'
import { computed, onMounted, reactive, ref, unref } from 'vue'
import router from '@/router'
import { PostDetailInfo } from '../types'
import { bizTypeDict, getEnumNameByValue, postStatusDict } from '@/stores/enums'
import { getSysTokenLoginApi } from '@/views/common/common.api'
import { get } from 'lodash'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => unref(mainLoading))
const avatar = computed(() =>
  detail.avatar == null || detail.avatar == ''
    ? '/src/assets/user/default_avatar.png'
    : detail.avatar
)

const postMedia = computed(() =>
  detail.picUrl == null || detail.picUrl == '' ? '' : detail.picUrl
)

onMounted(() => {
  init()
})

const statusShow = ref(false)
const init = async () => {
  await getDetail()
  await sysTokenLogin()
}

const detail = reactive(new PostDetailInfo())
const getDetail = async () => {
  try {
    openMainLoading()
    const postId = unref(router.currentRoute).query?.id
    const data = await getDetailApi(postId)
    Object.assign(detail, data.data)
    console.log(detail)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const sysTokenLogin = async () => {
  const data = await getSysTokenLoginApi()
  if (data.data.id === detail.createId) {
    statusShow.value = true
  }
}

const comment = ref('')
const commentButtonDisabled = ref(false)

const sendComment = () => {
  debugger
  commentButtonDisabled.value = true
}
</script>

<template>
  <div class="w-full h-full min-w-[1200px] py-[14px] flex justify-center">
    <div class="w-[1200px] flex">
      <div class="w-[300px] mr-[10px]">
        <div class="p-[16px] rounded-[4px] bg-white">
          <div class="flex items-center">
            <el-image class="w-[48px] h-[48px] rounded-[50%]" :src="avatar" fit="cover"></el-image>
            <div class="ml-[10px] flex-1 flex flex-col">
              <span class="text-[18px] font-semibold">{{ detail.nickName }}</span>
              <span class="mt-[8px] text-[14px] text-[#999aaa]">注册时间：2023-02-12</span>
            </div>
          </div>
        </div>
        <div class="mt-[10px] pb-[10px] bg-white">
          <el-image class="w-full h-full rounded-t-[4px]" :src="postMedia" fit="cover"></el-image>
          <div class="flex justify-center items-center">
            <el-icon>
              <Picture />
            </el-icon>
            <span class="ml-[5px]">帖子图片共有1张</span>
          </div>
        </div>
        <div class="h-[400px] mt-[10px] rounded-[4px] bg-white"></div>
      </div>

      <div class="flex-1">
        <div class="px-[20px] py-[10px] bg-white rounded-[4px]">
          <div class="text-[28px] font-semibold">
            <span>{{ detail.title }}</span>
          </div>
          <div class="mt-[10px] px-[20px] py-[10px] bg-[#f8f8f8] rounded-[4px]">
            <div class="flex">
              <div class="text-[14px] text-[#555666]">
                <span>作者：{{ detail.nickName }}</span>
              </div>
              <div class="ml-[20px] text-[12px] text-[#999aaa] flex items-center">
                <el-icon>
                  <Clock />
                </el-icon>
                <span class="ml-[5px]">发布时间：{{ detail.createTime }}</span>
              </div>
              <div
                v-if="statusShow"
                class="flex-1 flex justify-end text-[12px] text-[#409eff]"
                :class="[]"
              >
                <span>{{ getEnumNameByValue(postStatusDict, detail.status) }}</span>
              </div>
            </div>
            <div class="mt-[5px] flex text-[14px] text-[#999aaa]">
              <div class="flex items-center">
                <span>帖子标签：</span>
                <el-tag>{{ detail.categoryName }}</el-tag>
                <el-tag class="ml-[5px]" type="warning">
                  {{ getEnumNameByValue(bizTypeDict, detail.bizType) }}帖
                </el-tag>
              </div>
            </div>
          </div>
          <div class="mt-[20px]" v-html="detail.content"></div>
        </div>
        <div class="mt-[10px] px-[20px] py-[10px] bg-white rounded-[4px]">
          <div class="flex">
            <div class="flex items-center">
              <span class="text-[20px] font-medium">评论</span>
              <span class="ml-[10px] text-[14px] text-[#999aaa]">0</span>
            </div>
            <div class="ml-[30px] text-[14px] font-normal flex items-center">
              <span class="cursor-pointer">最热</span>
              <div class="w-[1px] h-[12px] mx-[10px] bg-[#999aaa]"></div>
              <span class="cursor-pointer text-[#999aaa]">最新</span>
              <div class="w-[1px] h-[12px] mx-[10px] bg-[#999aaa]"></div>
              <span class="cursor-pointer text-[#999aaa]">只看作者</span>
            </div>
          </div>
          <div class="mt-[20px]">
            <div class="flex items-center">
              <div class="w-[80px] flex justify-center items-center">
                <el-image
                  class="w-[48px] h-[48px] rounded-[50%]"
                  :src="avatar"
                  fit="cover"
                ></el-image>
              </div>
              <div class="flex-1 flex items-center">
                <textarea
                  class="w-full h-[50px] px-[8px] bg-[#f1f1f1] font-normal text-[14px] leading-normal border rounded-[6px] outline-none resize-none hover:bg-[#fff] focus:bg-[#fff]"
                  v-model="comment"
                  placeholder="下面请简单汪两声"
                  @focus="commentButtonDisabled = true"
                  @blur="commentButtonDisabled = false"
                ></textarea>

                <!-- <el-input
                  type="textarea"
                  class="w-full h-full px-[8px] font-normal text-[14px] leading-normal border rounded-[6px] outline-none resize-none hover:bg-[#fff] focus:bg-[#fff]"
                  v-model="comment"
                  placeholder="下面请简单汪两声"
                  @focus="commentButtonDisabled = true"
                  @blur="commentButtonDisabled = false"
                  :input-style="{
                    backgroundColor: '#f1f1f1',
                  }"
                ></el-input> -->
              </div>
            </div>
            <div v-if="commentButtonDisabled || comment !== ''" class="mt-[10px] flex justify-end">
              <el-button type="primary">发布</el-button>
            </div>
            <div
              class="mt-[15px] text-[14px] text-[#999aaa] font-normal flex justify-center items-center"
            >
              <!-- 评论列表 -->
              <span>没有更多评论</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
