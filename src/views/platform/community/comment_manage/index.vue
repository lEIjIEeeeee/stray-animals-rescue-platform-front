<script setup lang="ts">
import { computed, onMounted, reactive } from 'vue'
import { CommentQueryRequest, SearchParams } from './types'
import useMainLoading from '@/hooks/useMainLoading'
import { commentTypeDict, getEnumNameByCode } from '@/stores/enums'
import { getPlatformCommentListApi, deleteCommentApi } from './comment.api'
import { get, has } from 'lodash'
import { DataListResponse } from '@/views/common/types'
import { ElMessage, ElMessageBox } from 'element-plus'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => mainLoading.value)

const defaultTime = reactive([new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)])
const disabledDate = (time) => {
  const date = new Date()
  return (
    time.getTime() >
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
  )
}

const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      start.setHours(0, 0, 0)
      end.setHours(23, 59, 59)
      return [start, end]
    }
  },
  {
    text: '最近一个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
      start.setHours(0, 0, 0)
      end.setHours(23, 59, 59)
      return [start, end]
    }
  },
  {
    text: '最近三个月',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
      start.setHours(0, 0, 0)
      end.setHours(23, 59, 59)
      return [start, end]
    }
  }
]

const searchTypeList = [
  {
    code: 'COMMENT_USER',
    name: '评论用户'
  },
  {
    code: 'POST_TITLE',
    name: '帖子标题'
  }
]

const searchParams = reactive(new SearchParams())
const commentList = reactive(new DataListResponse())
const getCommentList = async () => {
  try {
    openMainLoading()
    const queryRequest = new CommentQueryRequest()
    Object.assign(queryRequest, searchParams)
    if (has(queryRequest, 'commentTime')) {
      delete queryRequest.commentTime
    }
    if (searchParams.commentTime.length > 0) {
      queryRequest.startTime = searchParams.commentTime[0]
      queryRequest.endTime = searchParams.commentTime[1]
    }
    const data = await getPlatformCommentListApi(queryRequest)
    Object.assign(commentList, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getCommentList()
}

onMounted(() => {
  init()
})

const searchButtonClick = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  getCommentList()
}

const handleClearSearchParams = () => {
  Object.assign(searchParams, new SearchParams())
  getCommentList()
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getCommentList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getCommentList()
}

const deleteComment = async (id: string) => {
  try {
    openMainLoading()
    await ElMessageBox.confirm('确认删除该条评论？删除后将无法撤销。', {
      type: 'warning'
    })
    const data = await deleteCommentApi({ id: id })
    if (get(data, 'code') === 0) {
      ElMessage.success('删除成功')
    }
    closeMainLoading()
    getCommentList()
  } catch (e) {
    closeMainLoading()
    getCommentList()
  }
}
</script>

<template>
  <div class="w-full px-[14px] pt-[10px] flex flex-col bg-white">
    <div class="flex flex-col">
      <div class="flex">
        <div class="flex">
          <el-select
            v-model="searchParams.searchType"
            :disabled="loading"
            placeholder="请选择"
            style="width: 100px"
          >
            <el-option
              v-for="item in searchTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
          <el-input
            class="ml-[10px]"
            type="text"
            clearable
            :disabled="loading"
            v-model="searchParams.searchContent"
            maxlength="100"
            placeholder="请输入搜索关键字"
            style="width: 200px"
          >
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="ml-[20px] flex items-center">
          <span class="text-[14px] min-w-[70px]">评论类型：</span>
          <el-select
            v-model="searchParams.type"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in commentTypeDict"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="ml-[20px] flex items-center">
          <span class="text-[14px] min-w-[70px]">评论时间：</span>
          <el-date-picker
            class="w-[200px]"
            v-model="searchParams.commentTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD HH:mm:ss"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            :disabledDate="disabledDate"
            :disabled="loading"
            style="width: 420px"
          >
          </el-date-picker>
        </div>
        <el-button class="ml-[20px]" type="primary" :disabled="loading" @click="searchButtonClick">
          搜索
        </el-button>
        <el-button :disabled="loading" @click="handleClearSearchParams">重置</el-button>
      </div>
    </div>

    <div class="mt-[20px] flex-1">
      <el-table
        :data="commentList.dataList"
        stripe
        v-loading="loading"
        :header-cell-style="{
          height: '50px',
          backgroundColor: '#f2f2f2',
          color: '#666666'
        }"
        style="height: calc(100vh - 194px)"
      >
        <el-table-column
          type="index"
          label="序号"
          width="55"
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column
          prop="content"
          label="评论内容"
          min-width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createName"
          label="评论用户"
          min-width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="type"
          label="评论类型"
          min-width="120"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ getEnumNameByCode(commentTypeDict, scope.row.type) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="toUserName"
          label="回复用户"
          min-width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="title"
          label="帖子标题"
          min-width="200"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="评论时间"
          min-width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <div class="operation-column flex flex-row justify-around items-center">
              <!-- <span @click="handleOpenDetail(row.id)">查看</span> -->
              <span class="text-[#0152d9] cursor-pointer" @click="deleteComment(row.id)">删评</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <div class="py-[5px] pr-[10px] flex justify-end">
        <el-config-provider>
          <el-pagination
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="prev, pager, next, jumper, sizes, total"
            :total="commentList.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
</template>
