<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { ChangeUserStatus, PlatformUserList, SearchParams } from './types'
import useMainLoading from '@/hooks/useMainLoading'
import { userTypeDict, genderDict, userStatusDict, getEnumNameByCode } from '@/stores/enums'
import { changeUserStatusApi, getPlatformUserListApi, resetPasswordApi } from './user.api'
import { ElMessage, ElMessageBox } from 'element-plus'
import AddEdit from './components/AddEdit.vue'
import { get } from 'lodash'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)

const searchParams = reactive(new SearchParams())
const searchTypeList = [
  {
    code: 'NICK_NAME',
    name: '用户昵称'
  },
  {
    code: 'LOGIN_ACCOUNT',
    name: '登录账号'
  },
  {
    code: 'PHONE',
    name: '手机号'
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

const userList = reactive(new PlatformUserList())
const getUserList = async () => {
  try {
    openMainLoading()
    let request = new SearchParams()
    if (searchParams.createDate === null) {
      searchParams.createDate = []
    }
    Object.assign(request, searchParams)
    delete request.createDate
    request['createStartDate'] = searchParams.createDate[0]
    request['createEndDate'] = searchParams.createDate[1]
    console.log(request)
    const data = await getPlatformUserListApi(request)
    Object.assign(userList, data.data)
    console.log(userList)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getUserList()
}

onMounted(() => {
  init()
})

const searchButtonClick = () => {
  getUserList()
}

const handleClearSearchParams = () => {
  const searchParamsNew = new SearchParams()
  Object.assign(searchParams, searchParamsNew)
  getUserList()
}

const handleCurrentPageChange = (val) => {
  searchParams.pageNo = val
  getUserList()
}

const handlePageSizeChange = (val) => {
  searchParams.pageSize = val
  getUserList()
}

const changeUserStatus = reactive(new ChangeUserStatus())
const handleStatusChange = async (item) => {
  try {
    await ElMessageBox.confirm('确认是否更改用户状态？', {
      type: 'warning'
    })
    openMainLoading()
    changeUserStatus.id = item.id
    if (item.status === 1) {
      changeUserStatus.status = 'NORMAL'
    } else {
      changeUserStatus.status = 'FREEZE'
    }
    await changeUserStatusApi(changeUserStatus)
    ElMessage.success('修改成功')
    closeMainLoading()
    await getUserList()
  } catch (e) {
    await getUserList()
    closeMainLoading()
  }
}

const resetPassword = async (id) => {
  try {
    await ElMessageBox.confirm('确认是否重置该用户密码？', {
      type: 'warning'
    })
    openMainLoading()
    const data = await resetPasswordApi({ id: id })
    if (get(data, 'code') === 0) {
      ElMessage.success('修改成功')
    }
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const addRef = ref<InstanceType<typeof AddEdit>>()
const editRef = ref<InstanceType<typeof AddEdit>>()
const addUser = () => {
  addRef.value?.open()
}

const editUser = (id) => {
  editRef.value?.open(id)
}
</script>

<template>
  <div class="w-full h-full px-[14px] pt-[10px] bg-white flex flex-col">
    <div class="mb-[20px]">
      <div class="mb-[20px] flex">
        <el-button class="w-[70px]" type="primary" @click="addUser">
          <el-icon>
            <Plus />
          </el-icon>
          <span class="6px">添加</span>
        </el-button>
        <div class="ml-[10px] flex">
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
            style="width: 220px"
          >
            <template #prefix>
              <el-icon>
                <Search />
              </el-icon>
            </template>
          </el-input>
        </div>
        <div class="ml-[30px] flex items-center">
          <span class="text-[14px] min-w-[70px]">用户类型：</span>
          <el-select
            v-model="searchParams.userType"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in userTypeDict"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="ml-[30px] flex items-center">
          <span class="text-[14px] min-w-[42px]">性别：</span>
          <el-select
            v-model="searchParams.gender"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in genderDict"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
        <div class="ml-[30px] flex items-center">
          <span class="text-[14px] min-w-[70px]">用户状态：</span>
          <el-select
            v-model="searchParams.status"
            clearable
            :disabled="loading"
            placeholder="请选择"
            style="width: 150px"
          >
            <el-option
              v-for="item in userStatusDict"
              :key="item.code"
              :label="item.label"
              :value="item.code"
            >
            </el-option>
          </el-select>
        </div>
      </div>
      <div class="flex">
        <div class="flex items-center">
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
        <el-button class="ml-[30px]" type="primary" :disabled="loading" @click="searchButtonClick"
          >搜索</el-button
        >
        <el-button :disabled="loading" @click="handleClearSearchParams">重置</el-button>
      </div>
    </div>

    <div class="flex-1">
      <el-table
        :data="userList.dataList"
        stripe
        v-loading="loading"
        :header-cell-style="{
          height: '50px',
          backgroundColor: '#f2f2f2',
          color: '#666666'
        }"
        style="height: calc(100vh - 246px)"
      >
        <el-table-column
          type="index"
          label="序号"
          width="55"
          align="center"
          fixed="left"
        ></el-table-column>
        <el-table-column
          prop="nickName"
          label="用户昵称"
          min-width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="account"
          label="登录账号"
          min-width="150"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="phone"
          label="手机号"
          min-width="120"
          align="center"
          show-overflow-tooltip
        ></el-table-column>
        <el-table-column
          prop="gender"
          label="性别"
          min-width="120"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ getEnumNameByCode(genderDict, scope.row.gender) }}</template
          >
        </el-table-column>
        <el-table-column
          prop="userType"
          label="用户类型"
          min-width="120"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            {{ getEnumNameByCode(userTypeDict, scope.row.userType) }}</template
          >
        </el-table-column>
        <el-table-column
          prop="status"
          label="状态"
          min-width="120"
          align="center"
          show-overflow-tooltip
        >
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              :active-text="'激活'"
              :inactive-text="'冻结'"
              @change="handleStatusChange(scope.row)"
            ></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastLoginTime"
          label="最后登录时间"
          min-width="180"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          min-width="180"
          align="center"
          show-overflow-tooltip
        >
        </el-table-column>
        <el-table-column label="操作" width="150" align="center" fixed="right">
          <template #default="{ row }">
            <div class="flex justify-around items-center text-[#0152d9]">
              <span class="cursor-pointer" @click="editUser(row.id)">编辑</span>
              <el-dropdown trigger="click">
                <span class="text-[#0152d9]">更多</span>
                <template #dropdown>
                  <el-dropdown-menu class="flex flex-col items-center" split-button="true">
                    <el-dropdown-item disabled="true">权限配置</el-dropdown-item>
                    <el-dropdown-item @click="resetPassword(row.id)">重置密码</el-dropdown-item>
                    <el-dropdown-item disabled="true">删除</el-dropdown-item>
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
            :total="userList.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
      <AddEdit type="add" @add="handleClearSearchParams" ref="addRef" />
      <AddEdit type="edit" @edit="handleClearSearchParams" ref="editRef" />
    </div>
  </div>
</template>

<style scoped>
@import '@/style/element-plus/switch-table.css';
</style>
