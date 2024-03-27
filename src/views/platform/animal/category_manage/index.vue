<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  getCategoryTreeApi,
  getCategoryListApi,
  changeStatusApi,
  categoryDeleteApi
} from './category.api'
import useMainLoading from '@/hooks/useMainLoading'
import { SearchParams, CategoryList, ChangeStatusRequest } from './types'
import { ElMessage, ElMessageBox, ElTree } from 'element-plus'
import { enableDict } from '@/stores/enums'
import AddEdit from './components/AddEdit.vue'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => mainLoading.value)

const categoryTree = reactive([])
const treeVisible = ref(false)
const categoryProps = {
  label: 'name'
}
const expandedKeys = ref(['0'])

const getCategoryTree = async (currentKey?) => {
  try {
    openMainLoading()
    const data = await getCategoryTreeApi()
    categoryTree[0] = data.data
    expandedKeys.value.splice(1)
    if (currentKey) {
      expandedKeys.value.push(currentKey)
    }
    treeVisible.value = true
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const searchParams = reactive(new SearchParams())
const categoryTableData = reactive(new CategoryList())

const getCategoryList = async () => {
  try {
    openMainLoading()
    const data = await getCategoryListApi(searchParams)
    categoryTableData.pageNo = data.data.pageNo
    categoryTableData.pageSize = data.data.pageSize
    categoryTableData.total = data.data.total
    categoryTableData.dataList = data.data.dataList
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getCategoryList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getCategoryList()
}

const init = () => {
  getCategoryTree()
  getCategoryList()
}

onMounted(() => {
  init()
})

const categoryTreeRef = ref<InstanceType<typeof ElTree>>()

const handleNodeClick = () => {
  const pid = categoryTreeRef.value.getCurrentKey()
  getCategoryTree(pid)

  searchParams.pid = pid
  getCategoryList()
}

const changeStatusRequest = reactive(new ChangeStatusRequest())

const handleStatusChange = async (item) => {
  try {
    openMainLoading()
    changeStatusRequest.id = item.id
    changeStatusRequest.status = enableDict[item.status - 1].code
    await changeStatusApi(changeStatusRequest)
    ElMessage.success('修改成功')
    closeMainLoading()
    searchParams.pid = item.pid
    await getCategoryList()
  } catch (e) {
    await getCategoryList()
    closeMainLoading()
  }
}

const categoryAddRef = ref<InstanceType<typeof AddEdit>>()
const categoryAdd = () => {
  categoryAddRef.value?.open()
}

const categoryEditRef = ref<InstanceType<typeof AddEdit>>()
const categoryEdit = (item) => {
  categoryEditRef.value?.open(item.id)
}

const handleAddOrEdit = async () => {
  const currentKey = categoryTreeRef.value?.getCurrentKey()
  if (currentKey) {
    await getCategoryTree(currentKey)
    searchParams.pid = currentKey
  }
  await getCategoryList()
}

const categoryDelete = async (item) => {
  try {
    await ElMessageBox.confirm('确认是否删除该类目？删除之后将无法撤销此操作。', {
      type: 'warning'
    })
    openMainLoading()
    await categoryDeleteApi({ id: item.id })
    ElMessage.success('删除成功')
    closeMainLoading()
    searchParams.pid = item.pid
    await getCategoryList()
    await getCategoryTree(categoryTreeRef.value?.getCurrentKey())
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <div class="w-full h-full bg-white overflow-hidden flex flex-row">
    <div style="height: calc(100vh - 90px)">
      <el-scrollbar>
        <el-tree
          v-if="treeVisible"
          :data="categoryTree"
          ref="categoryTreeRef"
          node-key="id"
          :props="categoryProps"
          :expand-on-click-node="false"
          :auto-expand-parent="true"
          highlight-current
          draggable
          :default-expanded-keys="expandedKeys"
          @node-click="handleNodeClick"
        >
        </el-tree>
      </el-scrollbar>
    </div>

    <div class="flex items-center bg-[#f5f7fa]">
      <div
        class="tree-drawer-btn h-[50px] cursor-pointer flex items-center"
        @click="treeVisible = !treeVisible"
      >
        <el-icon size="8">
          <caret-left v-if="treeVisible" />
          <caret-right v-else />
        </el-icon>
      </div>
    </div>

    <div class="p-[10px] bg-white flex-1 overflow-hidden">
      <div class="mb-[5px]">
        <el-button type="primary" icon="plus" style="height: 40px" @click="categoryAdd"
          >添加</el-button
        >
      </div>

      <div class="border">
        <el-table
          :data="categoryTableData.dataList"
          v-loading="loading"
          stripe
          :header-cell-style="{
            height: '50px',
            backgroundColor: '#f2f2f2',
            color: '#666666'
          }"
          :row-style="{
            height: '80px'
          }"
          style="height: calc(100vh - 209px)"
        >
          <el-table-column
            label="分类名称"
            prop="name"
            min-width="120"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="层级" prop="level" width="120" align="center"></el-table-column>
          <el-table-column label="排序" prop="sort" width="120" align="center"></el-table-column>
          <el-table-column label="状态" prop="status" width="120" align="center">
            <template #default="scope">
              <el-switch
                v-model="scope.row.status"
                :active-value="1"
                :inactive-value="2"
                :active-text="'启用'"
                :inactive-text="'禁用'"
                @change="handleStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            label="备注"
            prop="remark"
            min-width="180"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" width="150" align="center" fixed="right">
            <template #default="scope">
              <div class="flex flex-row justify-around items-center text-[#0152d9]">
                <span class="cursor-pointer" @click="categoryEdit(scope.row)">编辑</span>
                <span class="cursor-pointer" @click="categoryDelete(scope.row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>

        <div class="my-[10px] flex justify-end">
          <el-config-provider>
            <el-pagination
              :current-page="searchParams.pageNo"
              :page-size="searchParams.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              layout=" prev, pager, next, jumper,sizes, total"
              :total="categoryTableData.total"
              :disabled="loading"
              @current-change="handleCurrentPageChange"
              @size-change="handlePageSizeChange"
            />
          </el-config-provider>
        </div>
      </div>
    </div>
  </div>

  <AddEdit
    type="add"
    :category-tree="categoryTree[0]"
    @add="handleAddOrEdit"
    ref="categoryAddRef"
  />
  <AddEdit
    type="edit"
    :category-tree="categoryTree[0]"
    @edit="handleAddOrEdit"
    ref="categoryEditRef"
  />
</template>

<style scoped>
@import '@/style/element-plus/switch-table.css';

:deep(.el-tree-node__content) {
  min-width: 200px;
  height: 40px;
  padding-right: 20px;
  font-weight: 600;
}

.tree-drawer-btn:hover {
  background-color: #409eff;
}
</style>
