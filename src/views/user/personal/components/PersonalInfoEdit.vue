<script setup lang="ts">
import useMainDisabled from '@/hooks/useMainDisabled'
import useMainLoading from '@/hooks/useMainLoading'
import usePopup from '@/hooks/usePopup'
import { ElForm, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { computed, reactive, ref, unref } from 'vue'
import { editPersonalInfoApi, getPersonalInfoApi } from '../personal.api'
import { PersonalInfo, PersonalFormData } from '../types'
import UploadImg from '@/components/Upload/UploadImg.vue'
import { getEnumNameByCode, userTypeDict } from '@/stores/enums'
import { get } from 'lodash'

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const { mainDisabled, openMainDisabled, closeMainDisabled } = useMainDisabled()

const loading = computed(() => unref(mainLoading))
const disabled = computed(() => unref(mainDisabled))

const emit = defineEmits<{
  (e: 'edit'): void
}>()

defineExpose({
  open
})

function open() {
  init()
  openPopup()
}

const init = () => {
  getPersonalInfo()
}

const personalInfo = reactive(new PersonalInfo())
const getPersonalInfo = async () => {
  try {
    openMainLoading()
    const data = await getPersonalInfoApi()
    Object.assign(personalInfo, data.data)
    if (personalInfo.avatar == null) {
      formData.avatar = '/src/assets/user/default_avatar.png'
    } else {
      formData.avatar = personalInfo.avatar
    }
    formData.id = personalInfo.id
    formData.phone = personalInfo.phone
    formData.nickName = personalInfo.nickName
    formData.gender = personalInfo.gender
    formData.realName = personalInfo.realName
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const formData = reactive(new PersonalFormData())
const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  nickName: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入联系手机号',
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择性别'
    }
  ]
}
const editPersonalInfo = async () => {
  try {
    await ElMessageBox.confirm('是否确定修改用户信息？', {
      type: 'warning'
    })
    await formRef.value?.validate()
    openMainDisabled()
    const data = await editPersonalInfoApi(formData)
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
  <el-dialog title="编辑个人资料" v-model="show" :close-on-click-modal="false">
    <div>
      <el-form
        :model="formData"
        label-width="110"
        ref="formRef"
        :rules="formRules"
        @submit.prevent
        v-loading="loading"
      >
        <el-form-item label="头像：">
          <UploadImg v-model="formData.avatar" upload-biz-type="AVATAR" :disabled="disabled" />
          <!-- <div class="h-[50px]">
            <el-image class="h-full rounded-[50%]" :src="avatar" fit="cover"></el-image>
          </div> -->
        </el-form-item>
        <el-form-item label="登录账号：">
          <span>{{ personalInfo.account }}</span>
        </el-form-item>
        <el-form-item label="用户类型：">
          <span>{{ getEnumNameByCode(userTypeDict, personalInfo.userType) }}</span>
        </el-form-item>
        <el-form-item class="w-[80%]" label="用户昵称：" prop="nickName">
          <el-input
            type="text"
            v-model="formData.nickName"
            clearable
            :disabled="disabled"
            placeholder="请输入用户昵称"
          ></el-input>
        </el-form-item>
        <el-form-item class="w-[80%]" label="手机号：" prop="phone">
          <el-input
            type="text"
            v-model="formData.phone"
            clearable
            :disabled="disabled"
            placeholder="请输入手机号"
          ></el-input>
        </el-form-item>
        <el-form-item label="性别：" prop="gender">
          <el-radio-group v-model="formData.gender" :disabled="disabled">
            <el-radio-button label="F">男</el-radio-button>
            <el-radio-button label="M">女</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="真实姓名：">
          <el-input
            tyoe="text"
            class="w-[80%]"
            v-model="formData.realName"
            clearable
            :disabled="disabled"
            placeholder="请输入真实姓名"
          ></el-input>
        </el-form-item>
        <el-form-item label="注册时间：">
          <span>{{ personalInfo.createTime }}</span>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="editPersonalInfo">确定</el-button>
          <el-button @click="closePopup">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
