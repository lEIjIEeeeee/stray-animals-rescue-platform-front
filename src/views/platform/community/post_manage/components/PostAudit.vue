<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import usePopup from '@/hooks/usePopup'
import useMainLoading from '@/hooks/useMainLoading'
import { PostAuditInfo } from '../types'
import { ElForm, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { postAuditApi } from '../post.api'
import { get } from 'lodash'

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)

const emit = defineEmits<{
  (e: 'audit'): void
}>()

defineExpose({
  open
})

function open(postId) {
  formData.id = postId
  openPopup()
}

const formData = reactive(new PostAuditInfo())
const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  auditResult: [
    {
      required: true,
      message: '请选择审核结果'
    }
  ],
  auditRemark: [
    {
      validator: (rule, value, callback) => {
        if (formData.auditResult === 'REJECT' && !formData.auditRemark) {
          callback(new Error('审核拒绝时必须填写备注'))
        } else {
          callback()
        }
      }
    }
  ]
}

const handleSubmit = async () => {
  try {
    await formRef.value?.validate()
    await ElMessageBox.confirm('确定提交审核吗？提交之后无法撤销此操作。', {
      type: 'warning'
    })
    openMainLoading()
    const data = await postAuditApi(formData)
    if (get(data, 'code') === 0) {
      ElMessage.success('审核完成')
    }
    closeMainLoading()
    emit('audit')
    closePopup()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <el-dialog title="审核帖子" v-model="show" width="600" :close-on-click-modal="false">
    <el-form
      :model="formData"
      :rules="formRules"
      ref="formRef"
      label-width="100"
      v-loading="loading"
      @submit.prevent
    >
      <el-form-item label="审核结果：" prop="auditResult">
        <el-radio-group v-model="formData.auditResult">
          <el-radio label="PASS">审核通过</el-radio>
          <el-radio label="REJECT">审核拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核备注：" prop="auditRemark">
        <el-input
          type="textarea"
          v-model="formData.auditRemark"
          rows="5"
          placeholder="请输入审核备注信息(审核拒绝必填)"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit">确认</el-button>
        <el-button @click="closePopup"> 取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
