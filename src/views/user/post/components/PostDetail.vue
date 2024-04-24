<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import { getDetailApi } from '../post.api'
import { computed, nextTick, onMounted, reactive, ref, unref } from 'vue'
import router from '@/router'
import { PostDetailInfo } from '../types'
import { bizTypeDict, getEnumNameByValue, postStatusDict } from '@/stores/enums'
import { getSysTokenLoginApi } from '@/views/common/common.api'
import { DataListResponse, SysTokenLogin } from '@/views/common/types'
import {
  getCommentListPageApi,
  getReplayListPageApi,
  sendCommentApi,
  sendReplayApi,
  getCountsApi
} from '@/views/user/comment/comment.api'
import { SearchParams, SearchReplayParams, SendComment } from '@/views/user/comment/types'
import { ElMessage } from 'element-plus'
import { get } from 'lodash'
import { getUserAvatar } from '@/utils/avatar'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => unref(mainLoading))

const postMedia = computed(() =>
  detail.picUrl == null || detail.picUrl == '' ? '' : detail.picUrl
)

onMounted(() => {
  init()
})

let postId: any = ''
const statusShow = ref(false)
const init = async () => {
  postId = unref(router.currentRoute).query?.id
  await sysTokenLogin()
  await getDetail()
  await getCommentList()
  await getCommentCounts()
}

const detail = reactive(new PostDetailInfo())
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

const searchParams = reactive(new SearchParams())
const commentList = reactive(new DataListResponse())
const getCommentList = async () => {
  try {
    openMainLoading()
    searchParams.postId = postId
    const data = await getCommentListPageApi(searchParams)
    commentList.pageNo = data.data.pageNo
    commentList.pageSize = data.data.pageSize
    commentList.total = data.data.total
    // data.data.dataList.forEach((element) => {
    //   commentList.dataList.push(element)
    // })
    commentList.dataList = data.data.dataList
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const getCommentListByAuthor = () => {
  searchParams.sortType = 'AUTHOR'
  getCommentList()
}

const getLatestCommentList = () => {
  searchParams.sortType = 'LATEST'
  getCommentList()
}

const currentUser = reactive(new SysTokenLogin())
const sysTokenLogin = async () => {
  const data = await getSysTokenLoginApi()
  Object.assign(currentUser, data.data)
  if (data.data.id === detail.createId) {
    statusShow.value = true
  }
}

const commentCounts = ref(0)
const getCommentCounts = async () => {
  const data = await getCountsApi(postId)
  commentCounts.value = data.data.count
}

const commentIsFocus = ref(false)
const commentInput = ref(false)
const commentButtonIsEnter = ref(false)
const commentButtonIsFocus = ref(false)
const commentButtonShow = computed(
  () =>
    unref(commentIsFocus) ||
    unref(commentButtonIsEnter) ||
    unref(commentButtonIsFocus) ||
    sendComment.content !== ''
)

const sendComment = reactive(new SendComment())
const handleSendComment = async () => {
  try {
    openMainLoading()
    if (sendComment.content === '') {
      await ElMessage.error('您还没有评论')
      closeMainLoading()
      return
    }
    sendComment.id = postId
    const data = await sendCommentApi(sendComment)
    if (get(data, 'code') === 0) {
      ElMessage.success('评论成功')
    }
    closeMainLoading()
    sendComment.content = ''
    await getCommentList()
  } catch (e) {
    closeMainLoading()
    sendComment.content = ''
    await getCommentList()
  }
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getCommentList()
}

const sendReplay = reactive(new SendComment())
const replayIndex = ref(-1)
const toUserNameRef = ref('')
const replayInputShow = ref(false)

const replayInputRefList = ref([])
const replayInputRef = (el, index) => {
  if (el) {
    replayInputRefList.value[index] = el
  }
}
const handleReplayButtonClick = (key: string, index: number, toUserName: string) => {
  replayIndex.value = index
  toUserNameRef.value = toUserName
  if (sendReplay.id === key) {
    replayInputShow.value = !unref(replayInputShow)
    if (unref(replayInputShow) === true) {
      sendReplay.content = ''
      replayInputRefList.value[index].focus()
      replayIsFocus.value = true
    }
  } else {
    sendReplay.id = key
    replayInputShow.value = true
    sendReplay.content = ''
    nextTick(() => {
      replayInputRefList.value[index].focus()
      replayIsFocus.value = true
    })
  }
}

const replayIsFocus = ref(false)
const replayInput = ref(false)
const replayButtonIsEnter = ref(false)
const replayButtonIsFocus = ref(false)
const handleSendReplay = async (index: number) => {
  try {
    openMainLoading()
    if (sendReplay.content === '') {
      await ElMessage.error('您还没有回复')
      closeMainLoading()
      return
    }
    const data = await sendReplayApi(sendReplay)
    if (get(data, 'code') === 0) {
      ElMessage.success('回复成功')
      const replayList = commentList.dataList[index].replayCommentList.dataList
      replayList[replayList.length] = data.data
      replayInputShow.value = false
    }
    closeMainLoading()
    sendReplay.content = ''
  } catch (e) {
    closeMainLoading()
    sendReplay.content = ''
  }
}

const searchReplayParams = reactive(new SearchReplayParams())
const searchReplay = async (id: string, index: number) => {
  try {
    openMainLoading()
    searchReplayParams.rootId = id
    const data = await getReplayListPageApi(searchReplayParams)
    const replayList = commentList.dataList[index].replayCommentList
    Object.assign(replayList, data.data)
    commentList.dataList[index].replayCommentList = replayList
    document.getElementById('more-replay-span-' + index).style.display = 'none'
    document.getElementById('replay-pagination-' + index).style.display = 'block'
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const replayCurrentPageChange = async (id, index, newPage) => {
  try {
    openMainLoading()
    commentList.dataList[index].replayCommentList.pageNo = newPage
    const queryRequest = new SearchReplayParams()
    queryRequest.pageNo = newPage
    queryRequest.pageSize = 10
    queryRequest.rootId = id
    const data = await getReplayListPageApi(queryRequest)
    const replayList = commentList.dataList[index].replayCommentList
    replayList.pageNo = data.data.pageNo
    replayList.pageSize = data.data.pageSize
    replayList.total = data.data.total
    replayList.dataList = data.data.dataList
    commentList.dataList[index].replayCommentList = replayList
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const dropdownRefList = ref([])
const dropdownRef = (el, index) => {
  dropdownRefList.value[index] = el
}

const commentDeleteIndex = ref(-1)
const replayDeleteIndex = ref(-1)

const handleCommentMouseEnter = (index) => {
  console.log('----------执行div移入事件----------')
  commentDeleteIndex.value = index
}

const handleCommentMouseLeave = () => {
  console.log('----------执行div移出事件----------')
  commentDeleteIndex.value = -1
}
</script>

<template>
  <div class="min-w-[1200px] py-[14px] flex justify-center">
    <div class="w-[1200px] h-full flex">
      <div class="w-[300px] h-full mr-[10px] flex flex-col">
        <div class="p-[16px] rounded-[4px] bg-white shadow">
          <div class="flex items-center">
            <el-image
              class="w-[48px] h-[48px] rounded-[50%]"
              :src="getUserAvatar(currentUser.avatar)"
              fit="cover"
            ></el-image>
            <div class="ml-[10px] flex-1 flex flex-col">
              <span class="text-[18px] text-[#fb7299] font-semibold">{{ detail.nickName }}</span>
              <span class="mt-[8px] text-[14px] text-[#999aaa]">注册时间：2023-02-12</span>
            </div>
          </div>
        </div>

        <div class="flex flex-col mt-[10px] bg-white shadow">
          <el-image class="w-full h-full rounded-t-[4px]" :src="postMedia" fit="cover"></el-image>
          <div class="py-[10px] flex justify-center items-center">
            <el-icon>
              <Picture />
            </el-icon>
            <span class="ml-[5px]">帖子封面主图</span>
          </div>
        </div>

        <div class="mt-[10px] rounded-[4px] bg-white shadow"></div>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="px-[20px] py-[10px] bg-white rounded-[4px] shadow flex flex-col">
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
              <div v-if="statusShow" class="flex-1 flex justify-end text-[12px] text-[#409eff]">
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
          <div class="mt-[20px] py-[24px]" v-html="detail.content"></div>
        </div>

        <div class="mt-[10px] px-[20px] py-[10px] bg-white rounded-[4px] shadow flex flex-col">
          <div class="flex">
            <div class="flex items-center">
              <span class="text-[20px] font-medium">评论</span>
              <span class="ml-[10px] text-[14px] text-[#999aaa]">{{ commentCounts }}</span>
            </div>
            <div class="ml-[30px] text-[14px] font-normal flex items-center">
              <!-- <span class="cursor-pointer">最热</span>
              <div class="w-[1px] h-[12px] mx-[10px] bg-[#999aaa]"></div> -->
              <span
                class="cursor-pointer"
                :class="[{ 'text-[#999aaa]': searchParams.sortType !== 'LATEST' }]"
                @click="getLatestCommentList"
              >
                最新
              </span>
              <div class="w-[1px] h-[12px] mx-[10px] bg-[#999aaa]"></div>
              <span
                class="cursor-pointer"
                :class="[{ 'text-[#999aaa]': searchParams.sortType !== 'AUTHOR' }]"
                @click="getCommentListByAuthor"
              >
                只看作者
              </span>
            </div>
          </div>
          <div class="mt-[20px]">
            <div class="flex">
              <div class="w-[80px] flex justify-center">
                <el-image
                  class="w-[48px] h-[48px] rounded-[50%]"
                  :src="getUserAvatar(currentUser.avatar)"
                  fit="cover"
                ></el-image>
              </div>
              <div class="flex-1 flex items-center">
                <el-input
                  type="textarea"
                  v-model="sendComment.content"
                  resize="none"
                  :autosize="{ minRows: 2, maxRows: 5 }"
                  :class="[
                    {
                      'comment-default-textarea': true,
                      'comment-input-textarea': commentInput || commentIsFocus
                    }
                  ]"
                  placeholder="下面请简单喵两句~"
                  @focus="commentIsFocus = true"
                  @blur="commentIsFocus = false"
                  @mouseenter="commentInput = true"
                  @mouseleave="commentInput = false"
                  :disabled="loading"
                ></el-input>
              </div>
            </div>
            <!-- 待优化：聚焦获取出现按钮，点击按钮验证表单之后重新聚焦 -->
            <div v-if="commentButtonShow" class="mt-[10px] flex justify-end">
              <el-button
                type="primary"
                @mouseenter="commentButtonIsEnter = true"
                @mouseleave="commentButtonIsEnter = false"
                @focus="commentButtonIsFocus = true"
                @blur="commentButtonIsFocus = false"
                @click="handleSendComment"
                :disabled="loading"
              >
                发布
              </el-button>
            </div>
          </div>
          <div class="mt-[20px] flex flex-col">
            <!-- 评论列表 -->
            <div class="overflow-auto" v-loading="loading">
              <div v-for="(item, index) in commentList.dataList" :key="item.id" class="pt-[20px]">
                <div class="flex">
                  <div class="w-[80px] flex justify-center">
                    <el-image
                      class="w-[48px] h-[48px] rounded-[50%]"
                      :src="getUserAvatar(item.avatar)"
                      fit="cover"
                    ></el-image>
                  </div>
                  <!-- @mouseenter="handleCommentMouseEnter(index)"
                    @mouseleave="handleCommentMouseLeave" -->
                  <div class="flex-1 pb-[20px] border-b-[1px]">
                    <div class="inline-flex items-center">
                      <span
                        class="text-[14px] text-[#999aaa] font-semibold cursor-pointer"
                        :class="[
                          {
                            'text-[#fb7299]': detail.createId === item.createId
                          }
                        ]"
                        >{{ item.nickName }}</span
                      >
                      <span
                        v-if="detail.createId === item.createId"
                        class="w-[30px] h-[16px] ml-[10px] text-[12px] text-[#fff] whitespace-nowrap rounded-[2px] flex justify-center items-center bg-[#fb7299]"
                        >作者</span
                      >
                    </div>
                    <div class="mt-[15px] text-[16px]">
                      <span>{{ item.content }}</span>
                    </div>
                    <div class="mt-[8px] flex">
                      <div class="flex-1 text-[14px] text-[#999aaa]">
                        <span>{{ item.createTime }}</span>
                        <span
                          class="ml-[10px] cursor-pointer hover:text-[#409eff]"
                          @click="handleReplayButtonClick(item.id, index, item.nickName)"
                        >
                          回复
                        </span>
                      </div>
                      <!-- <div
                        v-if="commentDeleteIndex === index"
                        class="flex items-center cursor-pointer"
                      >
                        <el-dropdown placement="bottom-end" :ref="(el) => dropdownRef(el, index)">
                          <div class="flex justify-center items-center hover:text-[#008ac5]">
                            <el-icon>
                              <more-filled />
                            </el-icon>
                          </div>
                          <template #dropdown>
                            <el-dropdown-menu>
                              <el-dropdown-item
                                :disabled="
                                  detail.createId !== currentUser.id &&
                                  item.createId !== currentUser.id
                                "
                              >
                                删除
                              </el-dropdown-item>
                            </el-dropdown-menu>
                          </template>
                        </el-dropdown>
                      </div> -->
                    </div>
                    <!-- 子评论列表 -->
                    <div v-if="item.replayCommentList.dataList.length > 0">
                      <div
                        v-for="replay in item.replayCommentList.dataList"
                        :key="replay.id"
                        class="pt-[20px]"
                      >
                        <div class="flex">
                          <el-image
                            class="w-[24px] h-[24px] rounded-[50%]"
                            :src="getUserAvatar(replay.avatar)"
                            fit="cover"
                          ></el-image>
                          <div class="ml-[10px] flex-1">
                            <div v-if="item.id === replay.pid" class="flex items-center">
                              <span
                                class="text-[14px] text-[#999aaa] font-semibold cursor-pointer"
                                :class="[
                                  {
                                    'text-[#fb7299]': detail.createId === replay.createId
                                  }
                                ]"
                              >
                                {{ replay.nickName }}
                              </span>
                              <span
                                v-if="detail.createId === replay.createId"
                                class="w-[30px] h-[16px] ml-[10px] text-[12px] text-[#fff] whitespace-nowrap rounded-[2px] flex justify-center items-center bg-[#fb7299]"
                              >
                                作者
                              </span>
                            </div>
                            <div v-else class="inline-flex items-center">
                              <span
                                class="text-[14px] text-[#999aaa] font-semibold cursor-pointer"
                                :class="[
                                  {
                                    'text-[#fb7299]': detail.createId === replay.createId
                                  }
                                ]"
                              >
                                {{ replay.nickName }}
                              </span>
                              <span
                                v-if="detail.createId === replay.createId"
                                class="w-[30px] h-[16px] ml-[10px] text-[12px] text-[#fff] whitespace-nowrap rounded-[2px] flex justify-center items-center bg-[#fb7299]"
                              >
                                作者
                              </span>
                              <span class="ml-[10px]">回复 </span>
                              <span class="cursor-pointer text-[#008ac5] hover:text-[#40c5f1]"
                                >@{{ replay.toUserName }}</span
                              >
                              <span>：</span>
                            </div>
                            <div class="mt-[15px]">
                              <span>{{ replay.content }}</span>
                            </div>
                            <div class="mt-[8px] text-[14px] text-[#999aaa]">
                              <span>{{ replay.createTime }}</span>
                              <span
                                class="ml-[10px] cursor-pointer hover:text-[#409eff]"
                                @click="handleReplayButtonClick(replay.id, index, replay.nickName)"
                              >
                                回复
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div
                      v-if="
                        commentList.dataList[index].replayCommentList.total >
                        searchParams.replayPageSize
                      "
                      :id="'more-replay-span-' + index"
                      class="mt-[10px] text-[14px] text-[#999aaa]"
                    >
                      <span>
                        共{{ commentList.dataList[index].replayCommentList.total }}条回复，
                      </span>
                      <span
                        class="cursor-pointer hover:text-[#00aeec]"
                        @click="searchReplay(item.id, index)"
                      >
                        点击查看
                      </span>
                    </div>
                    <div :id="'replay-pagination-' + index" style="display: none" class="mt-[10px]">
                      <el-config-provider>
                        <el-pagination
                          :current-page="commentList.dataList[index].replayCommentList.pageNo"
                          :page-size="commentList.dataList[index].replayCommentList.pageSize"
                          layout="total, prev, pager, next"
                          prev-text="上一页"
                          next-text="下一页"
                          hide-on-single-page="true"
                          :total="commentList.dataList[index].replayCommentList.total"
                          :disabled="loading"
                          @current-change="replayCurrentPageChange(item.id, index, $event)"
                        >
                        </el-pagination>
                      </el-config-provider>
                    </div>
                    <div v-show="replayInputShow && replayIndex === index" class="mt-[20px]">
                      <div class="flex">
                        <div class="w-[80px] flex justify-center items-center">
                          <el-image
                            class="w-[48px] h-[48px] rounded-[50%]"
                            :src="getUserAvatar(currentUser.avatar)"
                            fit="cover"
                          ></el-image>
                        </div>
                        <div class="flex-1 flex items-center">
                          <el-input
                            :class="[
                              {
                                'comment-default-textarea': true,
                                'comment-input-textarea': replayInput || replayIsFocus
                              }
                            ]"
                            type="textarea"
                            v-model="sendReplay.content"
                            resize="none"
                            :autosize="{ minRows: 2, maxRows: 5 }"
                            :placeholder="'回复 @' + toUserNameRef + ':'"
                            :ref="(el) => replayInputRef(el, index)"
                            @focus="replayIsFocus = true"
                            @blur="replayIsFocus = false"
                            @mouseenter="replayInput = true"
                            @mouseleave="replayInput = false"
                          ></el-input>
                        </div>
                      </div>

                      <div
                        v-if="
                          replayIsFocus ||
                          replayButtonIsEnter ||
                          replayButtonIsFocus ||
                          sendReplay.content !== ''
                        "
                        class="mt-[10px] flex justify-end"
                      >
                        <el-button
                          type="primary"
                          @mouseenter="replayButtonIsEnter = true"
                          @mouseleave="replayButtonIsEnter = false"
                          @focus="replayButtonIsFocus = true"
                          @blur="replayButtonIsFocus = false"
                          @click="handleSendReplay(index)"
                        >
                          发布
                        </el-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="mt-[10px] font-normal flex justify-end items-center">
              <el-config-provider>
                <el-pagination
                  :current-page="searchParams.pageNo"
                  :page-size="searchParams.pageSize"
                  layout="prev, pager, next, jumper, total"
                  :total="commentList.total"
                  :disabled="loading"
                  @current-change="handleCurrentPageChange"
                />
              </el-config-provider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-default-textarea :deep(.el-textarea__inner) {
  background-color: #f1f2f3;
}

.comment-input-textarea :deep(.el-textarea__inner) {
  background-color: #fff;
}

:deep(.el-textarea__inner)::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
:deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  background-color: #c3c3c3;
  cursor: default;
}
:deep(.el-textarea__inner)::-webkit-scrollbar-track {
  background-color: transparent;
}
</style>
