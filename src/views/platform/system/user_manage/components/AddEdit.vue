<script setup lang="ts">
import usePopup from '@/hooks/usePopup'
import useMainDisabled from '@/hooks/useMainDisabled'
import useMainLoading from '@/hooks/useMainLoading'
import { computed, reactive, ref } from 'vue'
import { UserAddRequest, UserDetailFormData, UserEditRequest } from '../types'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import { addUserApi, editUserApi, getDetailApi } from '../user.api'
import { get } from 'lodash'

const { show, openPopup, closePopup } = usePopup()
const { mainDisabled, openMainDisabled, closeMainDisabled } = useMainDisabled()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const title = computed(() => (props.type === 'add' ? '新增用户' : '编辑用户'))
const disabled = computed(() => mainDisabled.value)
const loading = computed(() => mainLoading.value)

const props = defineProps<{
  type: 'add' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit'): void
}>()

defineExpose({
  open
})

const id = ref()
function open(userId?) {
  if (props.type === 'edit') {
    id.value = userId
    init()
  }
  openPopup()
}

const init = () => {
  getDetail()
}

const getDetail = async () => {
  try {
    openMainLoading()
    const data = await getDetailApi(id.value)
    Object.assign(formData, data.data)
    console.log(formData)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const formData = reactive(new UserDetailFormData())

const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  nickName: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    }
  ],
  account: [
    {
      required: true,
      message: '请输入登录账号',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入用户密码',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: '请再次确认密码',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择性别',
      trigger: 'blur'
    }
  ],
  userType: [
    {
      required: true,
      message: '请选择用户类型',
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      message: '请选择状态',
      trigger: 'blur'
    }
  ]
}

const handleStatusChange = (val) => {
  formData.status = val
}

const userAddRequest = reactive(new UserAddRequest())
const addUser = async () => {
  try {
    await formRef.value?.validate()
    openMainDisabled()
    Object.assign(userAddRequest, formData)
    if (formData.status === 1) {
      userAddRequest.status = 'NORMAL'
    } else {
      userAddRequest.status = 'FREEZE'
    }
    const data = await addUserApi(userAddRequest)
    if (get(data, 'code') === 0) {
      ElMessage.success('添加成功')
    }
    closeMainDisabled()
    emit('add')
    closePopup()
  } catch (e) {
    closeMainDisabled()
  }
}

const userEditRequest = reactive(new UserEditRequest())
const editUser = async () => {
  try {
    await formRef.value?.validate()
    openMainDisabled()
    delete formData.password
    delete formData.confirmPassword
    Object.assign(userEditRequest, formData)
    if (formData.status === 1) {
      userEditRequest.status = 'NORMAL'
    } else {
      userEditRequest.status = 'FREEZE'
    }
    userEditRequest['id'] = id.value
    const data = await editUserApi(userEditRequest)
    if (get(data, 'code') === 0) {
      ElMessage.success('修改成功')
    }
    closeMainDisabled()
    emit('edit')
    closePopup()
  } catch (e) {
    closeMainDisabled()
  }
}
</script>

<template>
  <el-dialog :title="title" v-model="show" :close-on-click-modal="false" width="40%">
    <el-form
      :model="formData"
      ref="formRef"
      :rules="formRules"
      label-width="93px"
      @submit.prevent
      v-loading="loading"
    >
      <el-form-item label="用户昵称：" prop="nickName">
        <el-input
          type="text"
          v-model="formData.nickName"
          clearable
          :disabled="disabled"
          placeholder="请输入用户昵称"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="props.type === 'edit'" label="登录账号：" prop="account">
        <el-input
          type="text"
          v-model="formData.account"
          clearable
          :disabled="true"
          placeholder="请输入登录账号"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="props.type === 'add'" label="用户密码：" prop="password">
        <el-input
          type="password"
          v-model="formData.password"
          clearable
          :disabled="disabled"
          show-password="true"
          auto-complete="new-password"
          autocomplete="new-password"
          placeholder="请输入用户密码"
        ></el-input>
      </el-form-item>
      <el-form-item v-if="props.type === 'add'" label="确认密码：" prop="confirmPassword">
        <el-input
          type="confirmPassword"
          v-model="formData.confirmPassword"
          clearable
          :disabled="disabled"
          show-password="true"
          auto-complete="new-password"
          autocomplete="new-password"
          placeholder="请再次确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item label="手机号：" prop="phone">
        <el-input
          type="text"
          v-model="formData.phone"
          clearble
          :disabled="disabled"
          placeholder="请输入手机号"
        ></el-input>
      </el-form-item>
      <el-form-item label="真实姓名：">
        <el-input
          type="text"
          v-model="formData.realName"
          clearble
          :disabled="disabled"
          placeholder="请输入真实姓名"
        ></el-input>
      </el-form-item>
      <el-form-item label="性别：" prop="gender">
        <el-radio-group v-model="formData.gender" :disabled="disabled">
          <el-radio-button label="M">男</el-radio-button>
          <el-radio-button label="F">女</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="用户类型：" prop="userType">
        <el-radio-group v-model="formData.userType" :disabled="disabled">
          <el-radio-button label="NORMAL_USER">普通用户</el-radio-button>
          <el-radio-button label="PLATFORM_ADMIN">平台管理员</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-switch
          v-model="formData.status"
          :active-value="1"
          :inactive-value="2"
          :active-text="'激活'"
          :inactive-text="'冻结'"
          @change="handleStatusChange"
          :disabled="disabled"
        >
        </el-switch>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" v-if="props.type === 'add'" :disabled="disabled" @click="addUser"
          >确认</el-button
        >
        <el-button
          type="primary"
          v-if="props.type === 'edit'"
          :disabled="disabled"
          @click="editUser"
          >确认</el-button
        >
        <el-button :disabled="disabled" @click="closePopup">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
@import '@/style/element-plus/switch-form.css';
</style>
