<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { SearchParams, NoticeTypeItem } from './types'
import { getDropDownListApi } from '../notice_type_manage/notice_type.api'
import { DataListResponse } from '@/views/common/types'
import useMainLoading from '@/hooks/useMainLoading'
import { getNoticeArticleListApi, deleteNoticeArticleApi } from './notice_article.api'
import router from '@/router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { get } from 'lodash'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))

const noticeTypeList = ref<InstanceType<typeof Array<NoticeTypeItem>>>([])
const getNoticeTypeDropDownList = async () => {
  const data = await getDropDownListApi()
  noticeTypeList.value = data.data
}

const searchParams = reactive(new SearchParams())
const noticeArticleList = reactive(new DataListResponse())
const getNoticeArticleList = async () => {
  try {
    openMainLoading()
    const data = await getNoticeArticleListApi(searchParams)
    Object.assign(noticeArticleList, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getNoticeTypeDropDownList()
  getNoticeArticleList()
}

onMounted(() => {
  init()
})

const searchButtonClick = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  getNoticeArticleList()
}

const handleClearSearchParams = () => {
  Object.assign(searchParams, new SearchParams())
  getNoticeArticleList()
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getNoticeArticleList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getNoticeArticleList()
}

const addNoticeArticle = () => {
  router.push({
    path: 'noticeArticleManage/add'
  })
}

const editNoticeArticle = (id: string) => {
  router.push({
    path: 'noticeArticleManage/edit',
    query: {
      id: id
    }
  })
}

const deleteNoticeArticle = async (id: string) => {
  try {
    openMainLoading()
    await ElMessageBox.confirm('确认删除该公告吗？删除后无法撤销此操作。', {
      type: 'warning'
    })
    const data = await deleteNoticeArticleApi({ id: id })
    if (get(data, 'code') === 0) {
      ElMessage.success('删除成功')
      getNoticeArticleList()
    }
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <div class="w-full px-[14px] pt-[10px] flex flex-col bg-white">
    <div class="flex flex-col">
      <div class="flex items-center">
        <div class="flex items-center">
          <span class="text-[14px] min-w-[70px]">公告名称：</span>
          <el-input
            type="text"
            v-model="searchParams.searchContent"
            clearable
            :disabled="loading"
            placeholder="请输入公告名称"
            style="width: 180px"
          ></el-input>
        </div>
        <div class="ml-[20px] flex items-center">
          <span class="text-[14px] min-w-[70px]">公告分类：</span>
          <el-select
            v-model="searchParams.noticeTypeId"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 180px"
          >
            <el-option
              v-for="item in noticeTypeList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </div>
        <el-button
          class="w-[70px] ml-[20px]"
          type="primary"
          :disabled="loading"
          @click="searchButtonClick"
        >
          <el-icon>
            <Search />
          </el-icon>
          <span class="6px">搜索</span>
        </el-button>
        <el-button class="w-[70px]" type="primary" :disabled="loading" @click="addNoticeArticle">
          <el-icon>
            <Plus />
          </el-icon>
          <span class="6px">添加</span>
        </el-button>
        <el-button class="w-[70px]" :disabled="loading" @click="handleClearSearchParams">
          <el-icon>
            <Refresh />
          </el-icon>
          <span class="6px">重置</span>
        </el-button>
      </div>
    </div>

    <div class="mt-[20px] flex-1">
      <el-table
        :data="noticeArticleList.dataList"
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
          prop="name"
          label="公告名称"
          min-width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="picUrl"
          label="公告图片"
          min-width="150"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-image
              v-if="scope.row.picUrl !== ''"
              class="w-full h-full cursor-pointer"
              :src="scope.row.picUrl"
              fit="cover"
              :preview-src-list="[scope.row.picUrl]"
              preview-teleported="true"
            ></el-image>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="noticeTypeName"
          label="公告分类"
          min-width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="desc"
          label="简介"
          min-width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
          min-width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <div class="operation-column flex flex-row justify-around items-center">
              <span class="text-[#0152d9] cursor-pointer" @click="editNoticeArticle(row.id)">
                修改
              </span>
              <span class="text-[#0152d9] cursor-pointer" @click="deleteNoticeArticle(row.id)">
                删除
              </span>
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
            :total="noticeArticleList.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
</template>
