<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import { SearchParams, SearchRequest } from './types'
import { auditStatusDict, contributionTypeDict, getEnumNameByValue } from '@/stores/enums'
import { getPlatformContributionListApi } from './contribution.api'
import { computed, unref, reactive, onMounted, ref } from 'vue'
import { DataListResponse } from '@/views/common/types'
import ContributionAudit from './components/ContributionAudit.vue'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))

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
    code: 'ITEM_NAME',
    name: '捐助物名称'
  },
  {
    code: 'APPLY_USER_NAME',
    name: '捐助人名称'
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

const init = () => {
  getContributionList()
}

const searchParams = reactive(new SearchParams())
const dataListResponse = reactive(new DataListResponse())
const getContributionList = async () => {
  try {
    openMainLoading()
    const seachRequest = await convertRequestData()
    const data = await getPlatformContributionListApi(seachRequest)
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
  searchRequest.itemType = searchParams.itemType
  searchRequest.status = searchParams.status
  if (searchParams.auditTime == null) {
    searchParams.auditTime = []
  }
  if (searchParams.applyTime == null) {
    searchParams.applyTime = []
  }
  if (searchParams.auditTime.length > 0) {
    searchRequest.auditStartTime = searchParams.auditTime[0]
    searchRequest.auditEndTime = searchParams.auditTime[1]
  }
  if (searchParams.applyTime.length > 0) {
    searchRequest.applyStartTime = searchParams.applyTime[0]
    searchRequest.applyEndTime = searchParams.applyTime[1]
  }
  return searchRequest
}

onMounted(() => {
  init()
})

const handleSearch = () => {
  getContributionList()
}

const handleRefresh = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  searchParams.searchType = 'ANIMAL_NAME'
  searchParams.searchContent = ''
  searchParams.itemType = ''
  searchParams.status = ''
  searchParams.auditTime = []
  searchParams.applyTime = []
  getContributionList()
}

const currentPageChange = (val: number) => {
  searchParams.pageNo = val
  getContributionList()
}

const pageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getContributionList()
}

const getDetail = (recordId: string) => {
  router.push({
    path: 'contributionManage/detail',
    query: {
      id: recordId
    }
  })
}

const auditRef = ref<InstanceType<typeof ContributionAudit>>()
const handleAuditAdoptApply = (recordId: number) => {
  auditRef.value?.open(recordId)
}

const detailRef = ref<InstanceType<typeof ContributionAudit>>()
const handleGetAuditResultInfo = (recordId: number) => {
  detailRef.value?.open(recordId)
}
</script>

<template>
  <div class="w-full px-[14px] pt-[10px] flex flex-col bg-white">
    <div class="flex flex-col overflow-hidden">
      <div class="flex items-center">
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
        <div class="ml-[50px] flex items-center">
          <span class="text-[14px] min-w-[70px]">捐助类型：</span>
          <el-select
            v-model="searchParams.itemType"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 170px"
          >
            <el-option
              v-for="item in contributionTypeDict"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="ml-[50px] flex items-center">
          <span class="text-[14px] min-w-[70px]">审核状态：</span>
          <el-select
            v-model="searchParams.status"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 170px"
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
      </div>
      <div class="mt-[20px] flex items-center">
        <div class="flex items-center">
          <span class="text-[14px] min-w-[70px]">审核时间：</span>
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
        <div class="ml-[50px] flex items-center">
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

    <div class="mt-[20px] flex-1">
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
          prop="itemType"
          label="捐助类型"
          min-width="120"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ getEnumNameByValue(contributionTypeDict, scope.row.itemType) }}
          </template>
        </el-table-column>
        <el-table-column
          prop="itemName"
          label="捐助物名称"
          min-width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="itemPic"
          label="捐助物图片"
          min-width="150"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-image
              class="w-full h-full cursor-pointer"
              :src="scope.row.itemPic"
              fit="cover"
              :preview-src-list="[scope.row.itemPic]"
              preview-teleported="true"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyUserName"
          label="捐助人名称"
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
          label="捐助备注"
          min-width="180"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="status"
          label="审核状态"
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
  <ContributionAudit type="detail" ref="detailRef" />
  <ContributionAudit type="audit" @audit="handleRefresh" ref="auditRef" />
</template>
