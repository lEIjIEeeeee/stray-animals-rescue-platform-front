<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import { computed, onMounted, reactive, ref } from 'vue'
import { SearchParams, SearchRequest } from './types'
import { auditStatusDict, getEnumNameByValue } from '@/stores/enums'
import { getPlatformAdoptListApi } from './adopt.api'
import { DataListResponse } from '@/views/common/types'
import AdoptAudit from './components/AdoptAudit.vue'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)

const searchTypeList = [
  {
    code: 'ANIMAL_NAME',
    name: '宠物名称'
  },
  {
    code: 'ANIMAL_NO',
    name: '宠物编号'
  },
  {
    code: 'ADOPT_USER_NAME',
    name: '领养人名称'
  },
  {
    code: 'CONTACT_PHONE',
    name: '联系电话'
  }
]

const auditDefaultTime = reactive([new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)])

const auditDisabledDate = (time) => {
  const date = new Date()
  return (
    time.getTime() >
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
  )
}

const auditShortcuts = [
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

const adoptDefaultTime = reactive([new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)])

const adoptDisabledDate = (time) => {
  const date = new Date()
  return (
    time.getTime() >
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
  )
}

const adoptShortcuts = [
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

const applyDefaultTime = reactive([new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)])

const applyDisabledDate = (time) => {
  const date = new Date()
  return (
    time.getTime() >
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
  )
}

const applyShortcuts = [
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

const searchParams = reactive(new SearchParams())
const dataListResponse = reactive(new DataListResponse())
const getAdoptList = async () => {
  try {
    openMainLoading()
    const searchRequest = await convertRequestData()
    const data = await getPlatformAdoptListApi(searchRequest)
    Object.assign(dataListResponse, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const convertRequestData = () => {
  const searchRequest = new SearchRequest()
  searchRequest.pageNo = searchParams.pageNo
  searchRequest.pageSize = searchParams.pageSize
  searchRequest.searchType = searchParams.searchType
  searchRequest.searchContent = searchParams.searchContent
  searchRequest.status = searchParams.status
  if (searchParams.auditTime == null) {
    searchParams.auditTime = []
  }
  if (searchParams.adoptDate == null) {
    searchParams.adoptDate = []
  }
  if (searchParams.applyTime == null) {
    searchParams.applyTime = []
  }
  if (searchParams.auditTime.length > 0) {
    searchRequest.auditStartTime = searchParams.auditTime[0]
    searchRequest.auditEndTime = searchParams.auditTime[1]
  }
  if (searchParams.adoptDate.length > 0) {
    searchRequest.adoptStartDate = searchParams.adoptDate[0]
    searchRequest.adoptEndDate = searchParams.adoptDate[1]
  }
  if (searchParams.applyTime.length > 0) {
    searchRequest.applyStartTime = searchParams.applyTime[0]
    searchRequest.applyEndTime = searchParams.applyTime[1]
  }
  return searchRequest
}

const init = () => {
  getAdoptList()
}

onMounted(() => {
  init()
})

const handleSearch = () => {
  getAdoptList()
}

const handleRefresh = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  searchParams.searchType = 'ANIMAL_NAME'
  searchParams.searchContent = ''
  searchParams.status = ''
  searchParams.auditTime = []
  searchParams.adoptDate = []
  searchParams.applyTime = []
  getAdoptList()
}

const currentPageChange = (val: number) => {
  searchParams.pageNo = val
  getAdoptList()
}

const pageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getAdoptList()
}

const getAuditResultRef = ref<InstanceType<typeof AdoptAudit>>()
const handleGetAuditResultInfo = (recordId: string) => {
  getAuditResultRef.value?.open(recordId)
}

const auditApplyRef = ref<InstanceType<typeof AdoptAudit>>()
const handleAuditAdoptApply = (recordId: string) => {
  auditApplyRef.value?.open(recordId)
}

const getDetail = (recordId: string) => {
  router.push({
    path: 'adoptManage/detail',
    query: {
      id: recordId
    }
  })
}
</script>

<template>
  <div class="w-full px-[14px] pt-[10px] flex flex-col bg-white">
    <div class="flex flex-col overflow-hidden">
      <div class="mb-[20px] flex items-center">
        <div class="flex items-center">
          <el-select
            v-model="searchParams.searchType"
            :disabled="loading"
            placeholder="请选择"
            style="width: 120px"
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
        <div class="ml-[30px] flex items-center">
          <span class="text-[14px] min-w-[70px]">审核状态：</span>
          <el-select
            v-model="searchParams.status"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in auditStatusDict"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="ml-[30px] flex items-center">
          <span class="text-[14px] min-w-[70px]">审核日期：</span>
          <el-date-picker
            v-model="searchParams.auditTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="auditShortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="auditDefaultTime"
            :disabledDate="auditDisabledDate"
            :disabled="loading"
            style="width: 360px"
          >
          </el-date-picker>
        </div>
      </div>
      <div class="mb-[20px] flex items-center">
        <div class="flex items-center">
          <span class="text-[14px] min-w-[70px]">领养日期：</span>
          <el-date-picker
            v-model="searchParams.adoptDate"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="adoptShortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="adoptDefaultTime"
            :disabledDate="adoptDisabledDate"
            :disabled="loading"
            style="width: 360px"
          >
          </el-date-picker>
        </div>
        <div class="ml-[30px] flex items-center">
          <span class="text-[14px] min-w-[70px]">申请时间：</span>
          <el-date-picker
            v-model="searchParams.applyTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="applyShortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="applyDefaultTime"
            :disabledDate="applyDisabledDate"
            :disabled="loading"
            style="width: 360px"
          >
          </el-date-picker>
        </div>
        <el-button class="ml-[20px]" type="primary" :disabled="loading" @click="handleSearch"
          >搜索</el-button
        >
        <el-button :disabled="loading" @click="handleRefresh">重置</el-button>
      </div>
    </div>
    <div class="flex-1">
      <el-table
        :data="dataListResponse.dataList"
        stripe
        v-loading="loading"
        :header-cell-style="{
          height: '50px',
          backgroundColor: '#f2f2f2',
          color: '#666666'
        }"
        style="height: calc(100vh - 246px)"
      >
        <el-table-column type="index" label="序号" width="55" align="center" fixed="left">
        </el-table-column>
        <el-table-column
          prop="animalName"
          label="宠物名称"
          min-width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="animalNo"
          label="宠物编号"
          min-width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="adoptUserName"
          label="领养人"
          min-width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="contactPhone"
          label="联系电话"
          min-width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="remark"
          label="领养备注"
          min-width="180"
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
            {{ getEnumNameByValue(auditStatusDict, scope.row.status) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="auditorName"
          label="审核人"
          min-width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="auditTime"
          label="审核时间"
          min-width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="auditRemark"
          label="审核备注"
          min-width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="createTime"
          label="申请时间"
          min-width="180"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <div class="flex flex-row justify-around items-center">
              <span class="text-[#0152d9] cursor-pointer" @click="getDetail(row.id)">详情</span>
              <span
                v-if="row.status === 1"
                class="text-[#0152d9] cursor-pointer"
                @click="handleAuditAdoptApply(row.id)"
                >审核</span
              >
              <span
                v-if="row.status === 2 || row.status === 3"
                class="text-[#0152d9] cursor-pointer"
                @click="handleGetAuditResultInfo(row.id)"
                >审核结果</span
              >
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
            layout=" prev, pager, next, jumper,sizes, total"
            :total="dataListResponse.total"
            :disabled="loading"
            @current-change="currentPageChange"
            @size-change="pageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
  <AdoptAudit type="detail" ref="getAuditResultRef" />
  <AdoptAudit type="audit" @audit="handleRefresh" ref="auditApplyRef" />
</template>
