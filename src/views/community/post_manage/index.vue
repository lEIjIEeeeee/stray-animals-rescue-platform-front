<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { SearchParams, PlatformPostList } from '@/views/community/post_manage/types'
import { getPlatformPostListApi, postDeleteApi } from '@/views/community/post_manage/post.api'
import PostAudit from './components/PostAudit.vue'
import PostClose from './components/PostClose.vue'
import { bizTypeDict, postStatusDict } from '@/stores/enums'
import { ElMessage, ElMessageBox } from 'element-plus'
import useMainLoading from '@/hooks/useMainLoading'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => mainLoading.value)

const searchTypeList = [
  {
    code: 'POST_TITLE',
    name: '帖子标题'
  },
  {
    code: 'ANIMAL_NAME',
    name: '动物名称'
  }
]

const bizTypeList = [
  {
    code: 'ADOPT_BIZ',
    name: '领养'
  },
  {
    code: 'LOSS_BIZ',
    name: '挂失'
  },
  {
    code: 'OTHER',
    name: '其他'
  }
]

const categoryList = [
  {
    value: 'CAT1',
    pid: '0',
    label: '大类1',
    level: '1',
    children: [
      {
        value: 'CAT1-1',
        pid: 'CAT1',
        label: '二级类目1',
        level: '2',
        children: [
          {
            value: 'CAT1-1-1',
            pid: 'CAT1-1',
            label: '三级类目1',
            level: '3',
            children: []
          }
        ]
      },
      {
        value: 'CAT1-2',
        pid: 'CAT1',
        label: '二级类目2',
        level: '2',
        children: []
      },
      {
        value: 'CAT1-3',
        pid: 'CAT1',
        label: '二级类目3',
        level: '2',
        children: []
      }
    ]
  },
  {
    value: 'CAT2',
    pid: '0',
    label: '大类2',
    level: '1',
    children: []
  },
  {
    value: 'CAT3',
    pid: '0',
    label: '大类3',
    level: '1',
    children: []
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
const shortcuts = [
  {
    text: '最近一周',
    value: () => {
      const end = new Date()
      const start = new Date()
      start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
      start.setHours(0, 0, 0)
      end.setHours(23, 59, 59)
      searchParams.auditTime = [start, end]
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
      searchParams.auditTime = [start, end]
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
      searchParams.auditTime = [start, end]
    }
  }
]

const searchParams = reactive(new SearchParams())
const platformPostList = reactive(new PlatformPostList())

const getPlatformPostList = async () => {
  try {
    openMainLoading()
    const result = await getPlatformPostListApi(searchParams)
    platformPostList.pageNo = result.data.pageNo
    platformPostList.pageSize = result.data.pageSize
    platformPostList.total = result.data.total
    platformPostList.dataList = result.data.dataList
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const handleClearSearchParams = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  searchParams.searchType = 'POST_TITLE'
  searchParams.searchContent = ''
  searchParams.bizType = null
  searchParams.categoryIds = []
  searchParams.auditTime = []
  searchParams.createTime = []
  searchParams.status = ''
  getPlatformPostList()
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getPlatformPostList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getPlatformPostList()
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
    await getPlatformPostList()
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

const tableHeight = ref()
const mainRef = ref(null)
onMounted(() => {
  getPlatformPostList()
  // const mainRefHeight = mainRef.value.clientHeight
  // tableHeight.value = mainRefHeight - 209
})
</script>

<template>
  <div class="h-full flex-col">
    <div class="px-[14px] pt-[10px] bg-white flex flex-col">
      <div class="mb-[20px] flex flex-row">
        <div class="search-item keywords-search">
          <el-select v-model="searchParams.searchType" :disabled="loading" placeholder="请选择">
            <el-option
              v-for="item in searchTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
          <el-input
            class="search-content-input ml-[10px]"
            type="text"
            clearable
            :disabled="loading"
            v-model="searchParams.searchContent"
            maxlength="100"
            placeholder="请输入搜索关键字"
          >
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="search-item biz-search ml-[50px]">
          <span>业务类型：</span>
          <el-select
            v-model="searchParams.bizType"
            clearable
            :disabled="loading"
            placeholder="请选择"
          >
            <el-option
              v-for="item in bizTypeList"
              :key="item.code"
              :label="item.name"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="search-item category-search ml-[50px]">
          <span>动物类目：</span>
          <el-cascader
            :options="categoryList"
            :props="{
              multiple: true,
              checkStrictly: true
            }"
            clearable
            :disabled="loading"
            :show-all-levels="false"
            :collapse-tags="true"
            separator=","
            v-model="searchParams.categoryIds"
            placeholder="请选择"
          >
          </el-cascader>
        </div>
      </div>
      <div class="mb-[20px] flex flex-row">
        <div class="search-item">
          <span>审核日期：</span>
          <el-date-picker
            v-model="searchParams.auditTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            :disabledDate="disabledDate"
            :disabled="loading"
          >
          </el-date-picker>
        </div>
        <div class="search-item ml-[50px]">
          <span>创建日期：</span>
          <el-date-picker
            class="w-[200px]"
            v-model="searchParams.createTime"
            type="daterange"
            unlink-panels
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :shortcuts="shortcuts"
            format="YYYY-MM-DD"
            value-format="YYYY-MM-DD HH:mm:ss"
            :default-time="defaultTime"
            :disabledDate="disabledDate"
            :disabled="loading"
          >
          </el-date-picker>
        </div>
        <el-button
          class="search-button ml-[20px]"
          type="primary"
          :disabled="loading"
          @click="getPlatformPostList"
          >搜索</el-button
        >
        <el-button :disabled="loading" @click="handleClearSearchParams">重置</el-button>
      </div>

      <div>
        <el-tabs v-model="searchParams.status" @tab-click="getPlatformPostList">
          <el-tab-pane label="全部" name="" />
          <el-tab-pane label="待审核" name="AUDIT_WAIT" />
          <el-tab-pane label="审核通过" name="AUDIT_PASS" />
          <el-tab-pane label="审核拒绝" name="AUDIT_REJECT" />
          <el-tab-pane label="已关闭" name="CLOSED" />
        </el-tabs>
      </div>
    </div>

    <!-- table-column至少有一列是有min-width属性保证列的伸缩，整体table得有width保证不溢出外层div，
      使得固定列生效。外层div得根据table宽度进行伸缩。
      
      1.先锁定table宽度
      2.实现外层div根据table表格宽度伸缩（不设定宽度）
      3.搞定高度问题
    -->
    <!-- <div class="px-[14px] pt-[14px] flex-1">
      <el-table :data="platformPostList.dataList">
        <el-table-column
          type="index"
          label="序号"
          width="55"
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column
          prop="title"
          label="帖子标题"
          min-width="1200"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          label="操作"
          min-width="180"
          align="center"
          fixed="right"
        ></el-table-column>
      </el-table>
    </div> -->
    <div class="w-full px-[14px] pt-[14px] flex-1">
      <div class="bg-white w-full">
        <el-table
          :data="platformPostList.dataList"
          stripe
          v-loading="loading"
          :header-cell-style="{
            height: '50px',
            backgroundColor: '#f2f2f2',
            color: '#666666'
          }"
        >
          <el-table-column
            type="index"
            label="序号"
            width="55"
            align="center"
            fixed="left"
          ></el-table-column>
          <el-table-column prop="title" label="帖子标题" min-width="200" show-overflow-tooltip>
          </el-table-column>
          <el-table-column
            prop="createUser"
            label="作者"
            min-width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="categoryName"
            label="动物类目"
            min-width="120"
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
          <el-table-column prop="postAbstract" label="帖子摘要" width="200">
            <template #default="scope">
              <el-tooltip :content="scope.row.postAbstract" placement="top" show-after="1000">
                <span class="show-over-line-2">{{ scope.row.postAbstract }}</span>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="发帖时间"
            min-width="180"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" min-width="160" align="center" fixed="right">
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
      </div>

      <div class="py-[5px] pr-[10px] flex justify-end bg-white">
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

      <PostAudit ref="postAuditRef" @audit="getPlatformPostList" />
      <PostClose ref="postCloseRef" @submit="getPlatformPostList" />
    </div>
  </div>
</template>

<style scoped>
.search-item {
  display: flex;
  align-items: center;
}

.search-item > span {
  font-size: 14px;
  width: 70px;
}

:deep(.el-select__wrapper) {
  min-width: 120px;
}

.keywords-search :deep(.el-select__wrapper) {
  width: 120px;
}
.keywords-search :deep(.el-input__wrapper) {
  width: 300px;
}

.biz-search :deep(.el-select),
.category-search :deep(.el-input__wrapper) {
  width: 180px;
}

:deep(.el-date-editor) {
  width: 360px;
}

.el-tabs :deep(.el-tabs__header) {
  margin-bottom: 0px;
}

:deep(.el-tabs__nav-wrap::after) {
  /* 去除底部灰色下划线 */
  position: static !important;
}

.show-over-line-1,
.show-over-line-2 {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-box-orient: vertical;
}

.show-over-line-1 {
  -webkit-line-clamp: 1;
}

.show-over-line-2 {
  -webkit-line-clamp: 2;
}

.operation-column span {
  cursor: pointer;
  color: #0152d9;
}

.el-table {
  width: 100%;
  height: calc(100vh - 299px);
}
</style>
