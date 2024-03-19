<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import {
  SearchParams,
  PlatformAnimalList,
  AnimalListRequest,
  ChangeAdoptStatus,
  ChangeLostStatus
} from './types'
import useMainLoading from '@/hooks/useMainLoading'
import { getCategoryTreeApi } from '../category_manage/category.api'
import { flagDict, animalGenderDict, getEnumNameByCode } from '@/stores/enums'
import {
  animalDeleteApi,
  changeAdoptStatusApi,
  changeLostStatusApi,
  getPlatformAnimalListApi
} from './animal.api'
import { ElMessage, ElMessageBox } from 'element-plus'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => mainLoading.value)

const searchParams = reactive(new SearchParams())

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
    code: 'OWNER_NAME',
    name: '主人名称'
  }
]

const categoryTree = ref([])
const getCategoryTree = async () => {
  const data = await getCategoryTreeApi()
  categoryTree.value = data.data.children
}

const animalListRequest = reactive(new AnimalListRequest())
const platformAnimalList = reactive(new PlatformAnimalList())
const getPlatformAnimalList = async () => {
  try {
    openMainLoading()
    await copySearchParams()
    const data = await getPlatformAnimalListApi(animalListRequest)
    fillAnimalListData(data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const copySearchParams = () => {
  Object.assign(animalListRequest, searchParams)
  delete animalListRequest.categoryIds
  delete animalListRequest.createDate
  animalListRequest['categoryIds'] = []
  if (searchParams.categoryIds.length > 0) {
    searchParams.categoryIds.forEach(function (item, index) {
      animalListRequest.categoryIds[index] = item[item.length - 1]
    })
  }
  animalListRequest.createStartDate = searchParams.createDate ? searchParams.createDate[0] : ''
  animalListRequest.createEndDate = searchParams.createDate ? searchParams.createDate[1] : ''
}

const fillAnimalListData = (data) => {
  platformAnimalList.pageNo = data.pageNo
  platformAnimalList.pageSize = data.pageSize
  platformAnimalList.total = data.total
  platformAnimalList.dataList = data.dataList
}

const init = () => {
  getCategoryTree()
  getPlatformAnimalList()
}

onMounted(() => {
  init()
})

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

const currentPageChange = async (val: number) => {
  openMainLoading()
  searchParams.pageNo = val
  animalListRequest.pageNo = val
  const data = await getPlatformAnimalListApi(animalListRequest)
  fillAnimalListData(data.data)
  closeMainLoading()
}

const pageSizeChange = async (val: number) => {
  openMainLoading()
  searchParams.pageSize = val
  animalListRequest.pageSize = val
  const data = await getPlatformAnimalListApi(animalListRequest)
  fillAnimalListData(data.data)
  closeMainLoading()
}

const searchButtonClick = () => {
  getPlatformAnimalList()
}

const handleClearSearchParams = () => {
  resetSearchParams()
}

const resetSearchParams = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  searchParams.searchType = 'ANIMAL_NAME'
  searchParams.searchContent = ''
  searchParams.gender = ''
  searchParams.categoryIds = []
  searchParams.isAdopt = ''
  searchParams.isLost = ''
  searchParams.createDate = []
  getPlatformAnimalList()
}

const changeAdoptStatus = reactive(new ChangeAdoptStatus())
const handleAdoptStatusChange = async (item) => {
  try {
    await ElMessageBox.confirm('确认更改领养状态？', {
      type: 'warning'
    })
    openMainLoading()
    changeAdoptStatus.id = item.id
    changeAdoptStatus.isAdopt = item.isAdopt
    await changeAdoptStatusApi(changeAdoptStatus)
    ElMessage.success('修改成功')
    const data = await getPlatformAnimalListApi(animalListRequest)
    fillAnimalListData(data.data)
    closeMainLoading()
  } catch (e) {
    const data = await getPlatformAnimalListApi(animalListRequest)
    fillAnimalListData(data.data)
    closeMainLoading()
  }
}

const changeLostStatus = reactive(new ChangeLostStatus())
const handleLostStatusChange = async (item) => {
  try {
    await ElMessageBox.confirm('确认更改遗失状态？', {
      type: 'warning'
    })
    openMainLoading()
    changeLostStatus.id = item.id
    changeLostStatus.isLost = item.isLost
    await changeLostStatusApi(changeLostStatus)
    ElMessage.success('修改成功')
    const data = await getPlatformAnimalListApi(animalListRequest)
    fillAnimalListData(data.data)
    closeMainLoading()
  } catch (e) {
    const data = await getPlatformAnimalListApi(animalListRequest)
    fillAnimalListData(data.data)
    closeMainLoading()
  }
}

const animalDetail = (id) => {
  router.push({
    path: 'animalManage/detail',
    query: {
      id: id
    }
  })
}

const animalEdit = (id) => {
  router.push({
    path: 'animalManage/edit',
    query: {
      id: id
    }
  })
}

const animalDelete = async (item) => {
  try {
    await ElMessageBox.confirm('确认删除该宠物信息？删除之后将无法撤销此操作。', {
      type: 'warning'
    })
    openMainLoading()
    await animalDeleteApi({ id: item.id })
    ElMessage.success('删除成功')
    const data = await getPlatformAnimalListApi(animalListRequest)
    fillAnimalListData(data.data)
    closeMainLoading()
  } catch (e) {
    const data = await getPlatformAnimalListApi(animalListRequest)
    fillAnimalListData(data.data)
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
          <span class="text-[14px] min-w-[70px]">宠物性别：</span>
          <el-select
            v-model="searchParams.gender"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in animalGenderDict"
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
        <div class="ml-[50px] flex items-center">
          <span class="text-[14px] min-w-[70px]">是否领养：</span>
          <el-select
            v-model="searchParams.isAdopt"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in flagDict"
              :key="item.code"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="mb-[20px] flex">
        <div class="flex items-center">
          <span class="text-[14px] min-w-[70px]">是否遗失：</span>
          <el-select
            v-model="searchParams.isLost"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in flagDict"
              :key="item.code"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </div>
        <div class="ml-[50px] flex items-center">
          <span class="text-[14px] min-w-[70px]">创建日期：</span>
          <el-date-picker
            v-model="searchParams.createDate"
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
            style="width: 360px"
          >
          </el-date-picker>
        </div>
        <el-button class="ml-[20px]" type="primary" :disabled="loading" @click="searchButtonClick"
          >搜索</el-button
        >
        <el-button :disabled="loading" @click="handleClearSearchParams">重置</el-button>
      </div>
    </div>

    <div class="flex-1">
      <div>
        <el-table
          :data="platformAnimalList.dataList"
          stripe
          v-loading="loading"
          :header-cell-style="{
            height: '50px',
            backgroundColor: '#f2f2f2',
            color: '#666666'
          }"
          style="height: calc(100vh - 260px)"
        >
          <el-table-column type="index" label="序号" width="55" align="center" fixed="left">
          </el-table-column>
          <el-table-column
            prop="name"
            label="宠物名称"
            min-width="120"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="animalNo"
            label="宠物编号"
            width="150"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="categoryName"
            label="动物类目"
            min-width="150"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="ownerName"
            label="主人名称"
            width="120"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            prop="gender"
            label="宠物性别"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              {{ getEnumNameByCode(animalGenderDict, scope.row.gender) }}
            </template>
          </el-table-column>
          <el-table-column
            prop="isAdopt"
            label="是否领养"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.isAdopt"
                :active-value="1"
                :inactive-value="0"
                :active-text="'是'"
                :inactive-text="'否'"
                @change="handleAdoptStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="isLost"
            label="是否遗失"
            width="120"
            align="center"
            show-overflow-tooltip
          >
            <template #default="scope">
              <el-switch
                v-model="scope.row.isLost"
                :active-value="1"
                :inactive-value="0"
                :active-text="'是'"
                :inactive-text="'否'"
                @change="handleLostStatusChange(scope.row)"
              ></el-switch>
            </template>
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="创建时间"
            min-width="180"
            align="center"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column label="操作" min-width="150" align="center" fixed="right">
            <template #default="{ row }">
              <div class="operation-column flex flex-row justify-around items-center">
                <span @click="animalDetail(row.id)">查看</span>
                <span @click="animalEdit(row.id)">编辑</span>
                <span @click="animalDelete(row)">删除</span>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <div class="py-[5px] pr-[10px] flex justify-end">
        <el-config-provider>
          <el-pagination
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout=" prev, pager, next, jumper,sizes, total"
            :total="platformAnimalList.total"
            :disabled="loading"
            @current-change="currentPageChange"
            @size-change="pageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import '@/style/element-plus/switch-table.css';

.operation-column span {
  cursor: pointer;
  color: #0152d9;
}
</style>
