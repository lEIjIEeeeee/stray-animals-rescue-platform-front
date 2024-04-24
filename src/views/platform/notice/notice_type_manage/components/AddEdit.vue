<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import usePopup from '@/hooks/usePopup'
import { computed, reactive, ref, unref } from 'vue'
import { NoticeTypeDetail } from '../types'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import { addNoticeTypeApi, editNoticeTypeApi, getDetailApi } from '../notice_type.api'
import { get } from 'lodash'
import { enableDict } from '@/stores/enums'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const { show, openPopup, closePopup } = usePopup()

const title = computed(() => (props.type === 'add' ? '新增公告类型' : '编辑公告类型'))
const loading = computed(() => unref(mainLoading))

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

let id = ''
function open(noticeTypeId?) {
  if (props.type === 'edit') {
    id = noticeTypeId
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
    const data = await getDetailApi(id)
    Object.assign(formData, data.data)
    formData.status = enableDict[data.data.status - 1].code
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const formData = reactive(new NoticeTypeDetail())
const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  name: [
    {
      required: true,
      message: '请输入公告分类名称',
      trigger: 'blur'
    }
  ],
  status: [
    {
      required: true,
      message: '请选择启用状态',
      trigger: 'blur'
    }
  ]
}

const addOrEditNoticeType = async () => {
  try {
    openPopup()
    await formRef.value?.validate()
    if (props.type === 'add') {
      add()
    }
    if (props.type === 'edit') {
      edit()
    }
    closePopup()
  } catch (e) {
    console.log(e)
  }
}

const add = async () => {
  try {
    openMainLoading()
    const data = await addNoticeTypeApi(formData)
    if (get(data, 'code') === 0) {
      ElMessage.success('添加成功')
    }
    closeMainLoading()
    emit('add')
  } catch (e) {
    closeMainLoading()
  }
}

const edit = async () => {
  try {
    openMainLoading()
    const data = await editNoticeTypeApi(formData)
    if (get(data, 'code') === 0) {
      ElMessage.success('修改成功')
    }
    closeMainLoading()
    emit('edit')
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <el-dialog :title="title" v-model="show" :close-on-click-modal="false">
    <div class="w-[80%]">
      <el-form
        :model="formData"
        ref="formRef"
        :rules="formRules"
        label-width="93"
        v-loading="loading"
        v-if="show"
        @submit.prevent
      >
        <el-form-item label="分类名称：" prop="name">
          <el-input
            type="text"
            v-model="formData.name"
            clearable
            :disabled="loading"
            placeholder="请输入分类名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="简介：">
          <el-input
            type="textarea"
            v-model="formData.desc"
            rows="3"
            clearable
            :disabled="loading"
            placeholder="请输入描述说明"
          ></el-input>
        </el-form-item>
        <el-form-item label="排序：">
          <el-input
            type="text"
            v-model.number="formData.sort"
            clearable
            :disabled="loading"
            placeholder="请输入序号"
          ></el-input>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio label="ENABLE">启用</el-radio>
            <el-radio label="DISABLE">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :disabled="loading" @click="addOrEditNoticeType"
            >确定</el-button
          >
          <el-button :disabled="loading" @click="closePopup">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
</template>
