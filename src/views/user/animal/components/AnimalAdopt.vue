<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import usePopup from '@/hooks/usePopup'
import { getSysTokenLoginApi } from '@/views/common/common.api'
import { computed, reactive, ref, unref } from 'vue'
import { AdoptApplyInfo } from '../types'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import { get } from 'lodash'
import { applyAdoptApi, reapplyAdoptApi } from '../animal.api'

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))

const props = defineProps<{
  type: 'apply' | 'reapply'
}>()

const emit = defineEmits<{
  (e: 'apply'): void
  (e: 'reapply'): void
}>()

defineExpose({
  open
})

let id: any = ''
function open(animalId, recordId?) {
  formData.animalId = animalId
  if (props.type === 'reapply') {
    id = recordId
    console.log(id)
  }
  init()
  openPopup()
}

const init = () => {
  getPersonalInfo()
}

const getPersonalInfo = async () => {
  try {
    openMainLoading()
    const data = await getSysTokenLoginApi()
    adoptUserName.value = data.data.nickName
    formData.contactPhone = data.data.phone
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const adoptUserName = ref('')
const formData = reactive(new AdoptApplyInfo())
const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
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
      message: '请输入领养备注',
      trigger: 'blur'
    }
  ]
}

const handleApplyAdopt = async () => {
  try {
    await formRef.value?.validate()
    openMainLoading()
    let data
    if (props.type === 'apply') {
      data = await applyAdoptApi(formData)
    } else {
      formData['id'] = id
      data = await reapplyAdoptApi(formData)
    }
    if (get(data, 'code') === 0) {
      ElMessage.success('提交成功')
    }
    closeMainLoading()
    if (props.type === 'apply') {
      emit('apply')
    } else {
      emit('reapply')
    }
    closePopup()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <el-dialog title="我要领养" v-model="show" :close-on-click-modal="false" width="50%">
    <div class="py-[10px] pr-[20px]">
      <el-form :model="formData" label-width="100" ref="formRef" :rules="formRules" @submit.prevent>
        <el-form-item label="申请人：">
          <span>{{ adoptUserName }}</span>
        </el-form-item>
        <el-form-item label="联系电话：" prop="contactPhone">
          <el-input
            type="text"
            v-model="formData.contactPhone"
            clearable
            :disabled="loading"
            placeholder="请输入联系电话"
            style="width: 50%"
          ></el-input>
        </el-form-item>
        <el-form-item label="领养备注：" prop="remark">
          <el-input
            type="textarea"
            v-model="formData.remark"
            rows="5"
            maxlength="200"
            show-word-limit
            :disabled="loading"
            placeholder="请输入领养备注（最多不超过200字）"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" @click="handleApplyAdopt">确定</el-button>
          <el-button @click="closePopup">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
