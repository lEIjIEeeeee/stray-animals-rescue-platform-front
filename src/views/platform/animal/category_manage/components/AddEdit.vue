<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { CategoryDetail, CategorySubmitDetail } from '../types'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import usePopup from '@/hooks/usePopup'
import useMainLoading from '@/hooks/useMainLoading'
import { getCategoryDetailApi, categoryAddApi, categoryEditApi } from '../category.api'
import { enableDict } from '@/stores/enums'

const props = defineProps<{
  categoryTree
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
const categoryTreeData = ref([])

function open(categoryId?) {
  categoryTreeData.value[0] = props.categoryTree
  if (props.type === 'edit') {
    id.value = categoryId
    init()
  }
  openPopup()
}

const categoryDetail = reactive(new CategoryDetail())

const init = async () => {
  try {
    openMainLoading()
    const data = await getCategoryDetailApi(id.value)
    console.log(data.data)
    categoryDetail.pid = data.data.pid
    console.log(categoryDetail.pid)
    categoryDetail.name = data.data.name
    categoryDetail.status = data.data.status
    categoryDetail.sort = data.data.sort
    categoryDetail.remark = data.data.remark
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => mainLoading.value)
const title = computed(() => (props.type === 'add' ? '新增动物类目' : '编辑动物类目'))

const formRef = ref<InstanceType<typeof ElForm>>()
const rules: FormRules = {
  name: [
    {
      required: true,
      message: '请输入类目名称',
      trigger: 'blur'
    }
  ],
  pid: [
    {
      required: true,
      message: '请选择父级类目',
      trigger: 'blur'
    }
  ],
  sort: [
    {
      required: true,
      message: '请输入正确的',
      trigger: 'blur',
      pattern: /^[0-9]+$/
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

const categoryCascaderProps = reactive({
  value: 'id',
  label: 'name',
  checkStrictly: true
})

const categorySubmitDetail = reactive(new CategorySubmitDetail())

const handleSave = async () => {
  try {
    await formRef.value?.validate()
    const length = categoryDetail.pid.length
    const pid = categoryDetail.pid[length - 1]
    categorySubmitDetail.pid = pid
    categorySubmitDetail.name = categoryDetail.name
    categorySubmitDetail.status = enableDict[categoryDetail.status - 1].code
    categorySubmitDetail.sort = categoryDetail.sort
    if (props.type === 'add') {
      add()
    }
    if (props.type === 'edit') {
      edit()
    }
  } catch (e) {
    console.log(e)
  }
}

const add = async () => {
  try {
    openMainLoading()
    await categoryAddApi(categorySubmitDetail)
    closeMainLoading()
    ElMessage.success('添加成功')
    emit('add')
    closePopup()
  } catch (e) {
    closeMainLoading()
  }
}

const edit = async () => {
  try {
    openMainLoading()
    categorySubmitDetail['id'] = id.value
    await categoryEditApi(categorySubmitDetail)
    closeMainLoading()
    await ElMessage.success('修改成功')
    emit('edit')
    closePopup()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <el-dialog :title="title" v-model="show" :close-on-click-modal="false" width="40%">
    <el-form
      :model="categoryDetail"
      ref="formRef"
      :rules="rules"
      label-width="93"
      v-loading="loading"
    >
      <el-form-item label="类目名称：" prop="name">
        <el-input
          type="text"
          v-model="categoryDetail.name"
          clearable
          :disabled="loading"
          placeholder="请输入类目名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="父级类目：" prop="pid">
        <el-cascader
          class="w-[100%]"
          v-model="categoryDetail.pid"
          :options="categoryTreeData"
          :props="categoryCascaderProps"
          clearable
          :disabled="loading"
          placeholder="请选择父级类目"
        ></el-cascader>
      </el-form-item>
      <el-form-item label="状态：" prop="status">
        <el-radio-group v-model="categoryDetail.status">
          <el-radio :label="1">启用</el-radio>
          <el-radio :label="2">禁用</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="排序：" prop="sort">
        <el-input
          type="text"
          v-model.number="categoryDetail.sort"
          clearable
          :disabled="loading"
          placeholder="请输入序号"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="remark">
        <el-input
          type="textarea"
          v-model="categoryDetail.remark"
          rows="3"
          clearable
          :disabled="loading"
          placeholder="请输入备注信息"
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" :disabled="loading" @click="handleSave">确定</el-button>
        <el-button :disabled="loading" @click="closePopup()">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
../../../../platform/animal/category_manage/types../../../../platform/animal/category_manage/category.api
