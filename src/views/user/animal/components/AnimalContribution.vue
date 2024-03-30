<script setup lang="ts">
import usePopup from '@/hooks/usePopup'
import { computed, reactive, ref, unref } from 'vue'
import { ContributionApplyInfo } from '../types'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import useMainLoading from '@/hooks/useMainLoading'
import { getSysTokenLoginApi } from '@/views/common/common.api'
import UploadImg from '@/components/Upload/UploadImg.vue'
import { applyContributionApi } from '../animal.api'
import { get } from 'lodash'
import { contributionTypeDict } from '@/stores/enums'

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))

const emit = defineEmits<{
  (e: 'submit'): void
}>()

defineExpose({
  open
})

function open(animalId) {
  formData.animalId = animalId
  init()
  openPopup()
}

const init = () => {
  getPersonalInfo()
}

const applyUserName = ref('')
const getPersonalInfo = async () => {
  try {
    openMainLoading()
    const data = await getSysTokenLoginApi()
    applyUserName.value = data.data.nickName
    formData.contactPhone = data.data.phone
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const formData = reactive(new ContributionApplyInfo())
const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  itemType: [
    {
      required: true,
      message: '请选择捐助类型'
    }
  ],
  itemName: [
    {
      required: true,
      message: '请输入名称',
      trigger: 'blur'
    }
  ],
  itemPic: [
    {
      required: true,
      message: '请上传图片'
    }
  ],
  contactPhone: [
    {
      required: true,
      message: '请输入联系电话',
      trigger: 'blur'
    }
  ],
  remark: [
    {
      required: true,
      message: '请输入捐助备注',
      trigger: 'blur'
    }
  ]
}

const handleApplyContribution = async () => {
  try {
    await formRef.value?.validate()
    openMainLoading()
    const data = await applyContributionApi(formData)
    if (get(data, 'code') === 0) {
      ElMessage.success('提交成功')
    }
    closeMainLoading()
    emit('submit')
    closePopup()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <el-dialog title="我要捐助" v-model="show" :close-on-click-modal="false" width="50%">
    <div class="py-[10px] pr-[20px]">
      <el-form :model="formData" label-width="110" ref="formRef" :rules="formRules" @submit.prevent>
        <el-form-item label="申请人：">
          <span>{{ applyUserName }}</span>
        </el-form-item>
        <el-form-item class="w-[60%]" label="捐助类型：" prop="itemType">
          <el-select
            v-model="formData.itemType"
            clearable
            :disabled="loading"
            placeholder="请选择类型"
          >
            <el-option
              v-for="item in contributionTypeDict"
              :key="item.value"
              :label="item.label"
              :value="item.code"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="w-[60%]" label="捐助物名称：" prop="itemName">
          <el-input
            type="text"
            v-model="formData.itemName"
            clearable
            :disabled="loading"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="捐助物图片：" prop="itemPic">
          <UploadImg v-model="formData.itemPic" :upload-biz-type="'CONTRIBUTION'" />
        </el-form-item>
        <el-form-item class="w-[60%]" label="联系电话：" prop="contactPhone">
          <el-input
            type="text"
            v-model="formData.contactPhone"
            clearable
            :disabled="loading"
            placeholder="请输入联系电话"
          ></el-input>
        </el-form-item>
        <el-form-item class="w-[90%]" label="捐助备注：" prop="remark">
          <el-input
            type="textarea"
            v-model="formData.remark"
            rows="5"
            maxlength="200"
            show-word-limit
            :disabled="loading"
            placeholder="请输入捐助备注"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :disabled="loading" @click="handleApplyContribution"
            >确认</el-button
          >
          <el-button :disabled="loading" @click="closePopup">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
