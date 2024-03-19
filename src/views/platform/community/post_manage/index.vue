<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { SearchParams, PostListRequest, PlatformPostList } from './types'
import { getPlatformPostListApi, postDeleteApi } from './post.api'
import PostAudit from './components/PostAudit.vue'
import PostClose from './components/PostClose.vue'
import { bizTypeDict, postStatusDict } from '@/stores/enums'
import { ElMessage, ElMessageBox } from 'element-plus'
import useMainLoading from '@/hooks/useMainLoading'
import router from '@/router'
import { getCategoryTreeApi } from '../../animal/category_manage/category.api'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => mainLoading.value)

const searchTypeList = [
  {
    code: 'POST_TITLE',
    name: '帖子标题'
  },
  {
    code: 'CREATE_USER',
    name: '作者'
  },
  {
    code: 'ANIMAL_NAME',
    name: '宠物名称'
  }
]

const defaultTime = reactive([new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)])
const disabledDate = (time) => {
  const date = new Date()
  return (
    time.getTime() >
    new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59).getTime()
  )
}
const auditDateShortcuts = [
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
const createDateShortcuts = [
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
const postListRequest = reactive(new PostListRequest())
const platformPostList = reactive(new PlatformPostList())

const getPlatformPostList = async () => {
  try {
    openMainLoading()
    await copySearchParams()
    const data = await getPlatformPostListApi(postListRequest)
    fillPostListData(data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const copySearchParams = () => {
  Object.assign(postListRequest, searchParams)
  delete postListRequest.categoryIds
  delete postListRequest.auditDate
  delete postListRequest.createDate
  postListRequest['categoryIds'] = []
  if (searchParams.categoryIds.length > 0) {
    searchParams.categoryIds.forEach(function (item, index) {
      postListRequest.categoryIds[index] = item[item.length - 1]
    })
  }

  postListRequest.auditStartDate = searchParams.auditDate ? searchParams.auditDate[0] : ''
  postListRequest.auditEndDate = searchParams.auditDate ? searchParams.auditDate[1] : ''
  postListRequest.createStartDate = searchParams.createDate ? searchParams.createDate[0] : ''
  postListRequest.createEndDate = searchParams.createDate ? searchParams.createDate[1] : ''
}

const fillPostListData = (data) => {
  platformPostList.pageNo = data.pageNo
  platformPostList.pageSize = data.pageSize
  platformPostList.total = data.total
  platformPostList.dataList = data.dataList
}

const handleClearSearchParams = () => {
  resetSearchParams()
}

const resetSearchParams = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  searchParams.searchType = 'POST_TITLE'
  searchParams.searchContent = ''
  searchParams.bizType = ''
  searchParams.categoryIds = []
  searchParams.auditDate = []
  searchParams.createDate = []
  searchParams.status = ''
  getPlatformPostList()
}

const handleCurrentPageChange = async (val: number) => {
  openMainLoading()
  searchParams.pageNo = val
  postListRequest.pageNo = val
  const data = await getPlatformPostListApi(postListRequest)
  fillPostListData(data.data)
  closeMainLoading()
}

const handlePageSizeChange = async (val: number) => {
  openMainLoading()
  searchParams.pageSize = val
  postListRequest.pageSize = val
  const data = await getPlatformPostListApi(postListRequest)
  fillPostListData(data.data)
  closeMainLoading()
}

const postAuditRef = ref<InstanceType<typeof PostAudit>>()
const handlePostAudit = (id) => {
  postAuditRef.value?.open(id)
}

const postCloseRef = ref<InstanceType<typeof PostClose>>()
const handlePostClose = async (item) => {
  postCloseRef.value?.open(item)
}

const getPostCloseReson = (item) => {
  postCloseRef.value?.open(item)
}

const handlePostDelete = async (id) => {
  try {
    await ElMessageBox.confirm('确定删除该帖子吗？删除之后无法撤销此操作。', {
      type: 'warning'
    })
    openMainLoading()
    await postDeleteApi({ id: id })
    ElMessage.success('删除成功')
    copySearchParams()
    const data = await getPlatformPostListApi(postListRequest)
    fillPostListData(data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const handleOpenDetail = (postId) => {
  router.push({
    path: 'postManage/detail',
    query: {
      id: postId
    }
  })
}

const categoryTree = ref([])
const getCategoryTree = async () => {
  const data = await getCategoryTreeApi()
  categoryTree.value = data.data.children
}

const searchButtonClick = () => {
  getPlatformPostList()
}

const init = () => {
  getCategoryTree()
  getPlatformPostList()
}

onMounted(() => {
  init()
})

const tabClick = async (val) => {
  try {
    openMainLoading()
    searchParams.status = val.props.name
    await copySearchParams()
    const data = await getPlatformPostListApi(postListRequest)
    fillPostListData(data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <div class="px-[14px] pt-[10px] flex flex-col bg-white">
    <div class="flex flex-col">
      <div class="mb-[20px] flex">
        <div class="flex">
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
          <span class="text-[14px] min-w-[70px]">业务类型：</span>
          <el-select
            v-model="searchParams.bizType"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in bizTypeDict"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="ml-[50px] flex items-center">
          <span class="text-[14px] min-w-[70px]">动物类目：</span>
          <el-cascader
            :options="categoryTree"
            :props="{
              value: 'id',
              label: 'name',
              multiple: true,
              checkStrictly: true
            }"
            clearable
            :disabled="loading"
            :show-all-levels="false"
            :collapse-tags="true"
            v-model="searchParams.categoryIds"
            placeholder="请选择"
            style="width: 190px"
          >
          </el-cascader>
        </div>
      </div>
      <div class="mb-[20px] flex">
        <div class="flex items-center">
          <span class="text-[14px] min-w-[70px]">审核日期：</span>
          <el-date-picker
            v-model="searchParams.auditDate"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="auditDateShortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            :disabledDate="disabledDate"
            :disabled="loading"
            style="width: 360px"
          >
          </el-date-picker>
        </div>
        <div class="ml-[50px] flex items-center">
          <span class="text-[14px] min-w-[70px]">创建日期：</span>
          <el-date-picker
            class="w-[200px]"
            v-model="searchParams.createDate"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="createDateShortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            :disabledDate="disabledDate"
            :disabled="loading"
            style="width: 360px"
          >
          </el-date-picker>
        </div>
        <el-button class="ml-[20px]" type="primary" :disabled="loading" @click="searchButtonClick"
          >搜索</el-button
        >
        <el-button :disabled="loading" @click="handleClearSearchParams">重置</el-button>
      </div>

      <el-tabs v-model="searchParams.status" @tab-click="tabClick">
        <el-tab-pane label="全部" name="" />
        <el-tab-pane label="待审核" name="AUDIT_WAIT" />
        <el-tab-pane label="审核通过" name="AUDIT_PASS" />
        <el-tab-pane label="审核拒绝" name="AUDIT_REJECT" />
        <el-tab-pane label="已关闭" name="CLOSED" />
      </el-tabs>
    </div>

    <div class="flex-1">
      <div>
        <el-table
          :data="platformPostList.dataList"
          stripe
          v-loading="loading"
          :header-cell-style="{
            height: '50px',
            backgroundColor: '#f2f2f2',
            color: '#666666'
          }"
          style="height: calc(100vh - 299px)"
        >
          <el-table-column
            type="index"
            label="序号"
            width="55"
            align="center"
            fixed="left"
          ></el-table-column>
          <el-table-column prop="title" label="帖子标题" min-width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="createUser"
            label="作者"
            min-width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="animalName" label="宠物名称" width="120" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="categoryName"
            label="动物类目"
            min-width="120"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="bizType" label="业务类型" width="120" align="center">
            <template #default="scope">
              {{ bizTypeDict[scope.row.bizType - 1].label }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="状态" width="120" align="center">
            <template #default="scope">
              {{ postStatusDict[scope.row.status - 1].label }}
            </template>
          </el-table-column>
          <el-table-column
            prop="auditRemark"
            label="审核备注"
            min-width="180"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column
            prop="postAbstract"
            label="帖子摘要"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="createTime"
            label="发帖时间"
            min-width="180"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" min-width="150" align="center" fixed="right">
            <template #default="{ row }">
              <div class="operation-column flex flex-row justify-around items-center">
                <span @click="handleOpenDetail(row.id)">查看</span>
                <span
                  v-if="row.status === 1 && searchParams.status == 'AUDIT_WAIT'"
                  @click="handlePostAudit(row.id)"
                  >审核</span
                >
                <el-dropdown trigger="click">
                  <span>更多</span>
                  <template #dropdown>
                    <el-dropdown-menu :split-button="true">
                      <el-dropdown-item v-if="row.status !== 4" @click="handlePostClose(row)"
                        >关闭</el-dropdown-item
                      >
                      <el-dropdown-item v-if="row.status === 4" @click="getPostCloseReson(row)"
                        >查看关闭原因</el-dropdown-item
                      >
                      <el-dropdown-item divided @click="handlePostDelete(row.id)"
                        >删除</el-dropdown-item
                      >
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
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
              :total="platformPostList.total"
              :disabled="loading"
              @current-change="handleCurrentPageChange"
              @size-change="handlePageSizeChange"
            />
          </el-config-provider>
        </div>
      </div>

      <PostAudit ref="postAuditRef" @audit="getPlatformPostList" />
      <PostClose ref="postCloseRef" @submit="getPlatformPostList" />
    </div>
  </div>
</template>

<style scoped>
.el-tabs :deep(.el-tabs__header) {
  margin-bottom: 0px;
}

:deep(.el-tabs__nav-wrap::after) {
  /* 去除底部灰色下划线 */
  position: static !important;
}

.operation-column span {
  cursor: pointer;
  color: #0152d9;
}
</style>
