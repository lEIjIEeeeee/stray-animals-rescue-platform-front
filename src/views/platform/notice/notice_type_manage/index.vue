<script setup lang="ts">
import { enableDict, getEnumNameByValue } from '@/stores/enums'
import { SearchParams } from './types'
import { computed, onMounted, reactive, ref, unref } from 'vue'
import useMainLoading from '@/hooks/useMainLoading'
import { getNoticeTypeListApi, deleteNoticeTypeApi } from './notice_type.api'
import { DataListResponse } from '@/views/common/types'
import AddEdit from './components/AddEdit.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { get } from 'lodash'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))

const searchParams = reactive(new SearchParams())
const noticeTypeList = reactive(new DataListResponse())
const getNoticeTypeList = async () => {
  try {
    openMainLoading()
    const data = await getNoticeTypeListApi(searchParams)
    Object.assign(noticeTypeList, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getNoticeTypeList()
}

onMounted(() => {
  init()
})

const searchButtonClick = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  getNoticeTypeList()
}

const handleClearSearchParams = () => {
  Object.assign(searchParams, new SearchParams())
  getNoticeTypeList()
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getNoticeTypeList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getNoticeTypeList()
}

const addNoticeTypeRef = ref<InstanceType<typeof AddEdit>>()
const addNoticeType = () => {
  addNoticeTypeRef.value?.open()
}

const editNoticeTypeRef = ref<InstanceType<typeof AddEdit>>()
const editNoticeType = (id) => {
  editNoticeTypeRef.value?.open(id)
}

const deleteNoticeType = async (id: string) => {
  try {
    openMainLoading()
    await ElMessageBox.confirm('确认删除该公告分类？删除后无法撤销此操作。', {
      type: 'warning'
    })
    const data = await deleteNoticeTypeApi({ id: id })
    if (get(data, 'code') === 0) {
      ElMessage.success('删除成功')
      getNoticeTypeList()
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
          <span class="text-[14px] min-w-[70px]">分类名称：</span>
          <el-input
            type="text"
            v-model="searchParams.searchContent"
            clearable
            :disabled="loading"
            placeholder="请输入分类名称"
            style="width: 180px"
          ></el-input>
        </div>
        <div class="ml-[20px] flex items-center">
          <span class="text-[14px] min-w-[42px]">状态：</span>
          <el-select
            v-model="searchParams.status"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 120px"
          >
            <el-option
              v-for="item in enableDict"
              :key="item.code"
              :label="item.label"
              :value="item.code"
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
        <el-button class="w-[70px]" type="primary" :disabled="loading" @click="addNoticeType">
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
        :data="noticeTypeList.dataList"
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
          label="分类名称"
          min-width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="desc"
          label="简介"
          min-width="200"
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
          prop="status"
          label="状态"
          min-width="120"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ getEnumNameByValue(enableDict, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="120" align="center" fixed="right">
          <template #default="{ row }">
            <div class="operation-column flex flex-row justify-around items-center">
              <span class="text-[#0152d9] cursor-pointer" @click="editNoticeType(row.id)">
                修改
              </span>
              <span class="text-[#0152d9] cursor-pointer" @click="deleteNoticeType(row.id)">
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
            :total="noticeTypeList.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
  <AddEdit type="add" @add="router.go(0)" ref="addNoticeTypeRef" />
  <AddEdit type="edit" @edit="router.go(0)" ref="editNoticeTypeRef" />
</template>
