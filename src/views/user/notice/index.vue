<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import { DataListResponse } from '@/views/common/types'
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { getNoticeListApi, getNoticeTypeDropdownListApi } from './notice.api'
import { SearchParams, NoticeTypeItem } from './types'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))
const totalPage = computed(() => Math.ceil(noticeList.total / noticeList.pageSize))
const leftColor = computed(() => (unref(loading) || noticeList.pageNo <= 1 ? '#ccc' : '#000'))
const rightColor = computed(() =>
  unref(loading) || noticeList.pageNo >= unref(totalPage) ? '#ccc' : '#000'
)

onMounted(() => {
  init()
})

const init = async () => {
  await getNoticeTypeList()
  await getNoticeList()
}

const noticeType = ref('')
const title = ref('')
const noticeTypeList = ref<InstanceType<typeof Array<NoticeTypeItem>>>([])
const getNoticeTypeList = async () => {
  const data = await getNoticeTypeDropdownListApi()
  data.data.forEach((element, index) => {
    noticeTypeList.value[index] = element
  })
  noticeType.value = data.data[0].id
  title.value = data.data[0].name
}

const handleLabelClick = (labelName: string) => {
  title.value = labelName
  searchParams.noticeTypeId = unref(noticeType)
  getNoticeList()
}

const searchParams = reactive(new SearchParams())
const noticeList = reactive(new DataListResponse())
const getNoticeList = async () => {
  try {
    openMainLoading()
    searchParams.noticeTypeId = unref(noticeType)
    const data = await getNoticeListApi(searchParams)
    Object.assign(noticeList, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const handleLeftIconClick = () => {
  if (!unref(loading) && noticeList.pageNo > 1) {
    searchParams.pageNo -= 1
    getNoticeList()
  }
}

const handleRightIconClick = () => {
  if (!unref(loading) && noticeList.pageNo < unref(totalPage)) {
    searchParams.pageNo += 1
    getNoticeList()
  }
}

const currentPageChange = (val: number) => {
  searchParams.pageNo = val
  getNoticeList()
}

const getDetail = (id: string) => {
  router.push({
    path: 'notice/detail',
    query: {
      id: id
    }
  })
}
</script>

<template>
  <div class="w-full min-w-[1200px] flex justify-center overflow-auto">
    <div class="w-[1200px] h-full flex flex-col">
      <div class="my-[14px] flex justify-between items-center">
        <div class="flex items-center">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>公告须知</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <div class="flex items-center text-[14px] text-[#666666]">
          <span>共有{{ noticeList.total }}个公告</span>
          <el-icon
            class="ml-[10px] cursor-pointer"
            @click="handleLeftIconClick"
            :disabled="loading"
            :color="leftColor"
          >
            <arrow-left />
          </el-icon>
          <div>
            <span class="ml-[10px] text-[#409eff]">{{ noticeList.pageNo }}</span>
            <span>/{{ totalPage }}</span>
          </div>
          <el-icon
            class="ml-[10px] cursor-pointer"
            @click="handleRightIconClick"
            :color="rightColor"
          >
            <arrow-right />
          </el-icon>
        </div>
      </div>
      <div class="px-[30px] py-[20px] bg-white rounded-[16px] flex-1 min-h-0">
        <div class="flex justify-between items-center">
          <div>
            <span class="text-[24px] font-semibold">{{ title }}</span>
          </div>
          <div class="w-[200px]">
            <el-select v-model="noticeType">
              <el-option
                v-for="item in noticeTypeList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
                @click="handleLabelClick(item.name)"
              ></el-option>
            </el-select>
          </div>
        </div>
        <div class="mt-[20px]">
          <div
            v-for="item in noticeList.dataList"
            :key="item.id"
            class="py-[20px] flex border-b-[1px] cursor-pointer"
            @click="getDetail(item.id)"
          >
            <div class="h-[150px]">
              <el-image class="w-[230px] h-full" :src="item.picUrl" fit="cover"></el-image>
            </div>
            <div class="ml-[20px] flex-1 flex flex-col">
              <span class="text-[18px] font-semibold" :title="item.name">{{ item.name }}</span>
              <div class="mt-[20px] line-clamp-3 text-ellipsis" :title="item.desc">
                {{ item.desc }}
              </div>
              <div class="flex-1 flex flex-col justify-end">
                <span class="text-[14px] text-[#999]">发布时间：{{ item.createTime }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="h-[60px] flex justify-end">
        <el-config-provider>
          <el-pagination
            background
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            layout="prev, pager, next, jumper, total"
            :total="noticeList.total"
            :disabled="loading"
            @current-change="currentPageChange"
          />
        </el-config-provider>
      </div>
    </div>
    <!-- <el-image class="w-full h-full" fit="cover" src="/src/assets/tmp/notice.png"></el-image>
      <el-image class="w-full h-full" fit="cover" src="/src/assets/tmp/notice_end.png"></el-image> -->
  </div>
</template>
