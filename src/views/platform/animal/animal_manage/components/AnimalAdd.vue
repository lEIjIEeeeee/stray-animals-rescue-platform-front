<script setup lang="ts">
import usePopup from '@/hooks/usePopup'
import useMainLoading from '@/hooks/useMainLoading'
import { computed, reactive, ref } from 'vue'
import { AnimalAddInfo } from '../types'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import { getCategoryTreeApi } from '@/views/platform/animal/category_manage/category.api'
import { getAnimalOwnerListApi } from '@/views/common/common.api'
import { animalAddInfoApi } from '../animal.api'
import { get } from 'lodash'
import UploadImg from '@/components/Upload/UploadImg.vue'

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)

const emit = defineEmits<{
  (e: 'add'): void
}>()

defineExpose({
  open
})

function open() {
  init()
  openPopup()
}

const init = () => {
  getCategoryTree()
  getOwnerList()
}

const categoryTree = ref([])
const getCategoryTree = async () => {
  const data = await getCategoryTreeApi()
  categoryTree.value = data.data.children
}

const ownerList = ref([])
const getOwnerList = async () => {
  const data = await getAnimalOwnerListApi()
  ownerList.value = data.data
}

const formData = reactive(new AnimalAddInfo())

const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  categoryId: [
    {
      required: true,
      message: '请选择动物类目',
      trigger: 'blur'
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择宠物性别',
      trigger: 'blur'
    }
  ],
  isAdopt: [
    {
      required: true,
      message: '请选择领养状态',
      trigger: 'blur'
    }
  ],
  isLost: [
    {
      required: true,
      message: '请选择遗失状态',
      trigger: 'blur'
    }
  ],
  picUrl: [
    {
      required: true,
      message: '请上传宠物图片',
      trigger: 'blur'
    }
  ]
}

const categoryCascaderProps = reactive({
  value: 'id',
  label: 'name',
  checkStrictly: true
})

const addAnimal = async () => {
  try {
    await formRef.value?.validate()
    openMainLoading()
    const requestData = new AnimalAddInfo()
    Object.assign(requestData, formData)
    requestData.categoryId = formData.categoryId[formData.categoryId.length - 1]
    const data = await animalAddInfoApi(requestData)
    if (get(data, 'code') === 0) {
      ElMessage.success('添加成功')
    }
    closeMainLoading()
    emit('add')
    closePopup()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <el-dialog title="新增宠物" v-model="show" :close-on-click-modal="false">
    <el-form
      :model="formData"
      label-width="95"
      ref="formRef"
      :rules="formRules"
      @submit.prevent
      v-loading="loading"
    >
      <el-form-item label="宠物名称：">
        <el-input
          type="text"
          v-model="formData.name"
          clearable
          placeholder="请输入宠物名称"
        ></el-input>
      </el-form-item>
      <el-form-item label="动物类目：" prop="categoryId">
        <el-cascader
          class="w-[100%]"
          v-model="formData.categoryId"
          :options="categoryTree"
          :props="categoryCascaderProps"
          clearable
          :disabled="loading"
          placeholder="请选择动物类目"
        >
        </el-cascader>
      </el-form-item>
      <el-form-item label="宠物主人：">
        <el-select
          v-model="formData.ownerId"
          :disabled="loading"
          filterable
          clearable
          placeholder="请选择宠物主人"
        >
          <el-option
            v-for="item in ownerList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="宠物性别：" prop="gender">
        <el-radio-group v-model="formData.gender" :disabled="loading">
          <el-radio-button :label="'M'">雄性</el-radio-button>
          <el-radio-button :label="'F'">雌性</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期：">
        <el-date-picker
          v-model="formData.birthday"
          type="date"
          clearable
          :disabled="loading"
          placeholder="选择日期"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="宠物体重：">
        <el-input
          type="text"
          v-model.number="formData.weight"
          clearable
          :disabled="loading"
          placeholder="请输入宠物体重"
        >
          <template #suffix>千克</template>
        </el-input>
      </el-form-item>
      <el-form-item label="是否领养：" prop="isAdopt">
        <el-radio-group v-model="formData.isAdopt" :disabled="loading">
          <el-radio-button :label="0">否</el-radio-button>
          <el-radio-button :label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="是否遗失：" prop="isLost">
        <el-radio-group v-model="formData.isLost" :disabled="loading">
          <el-radio-button :label="0">否</el-radio-button>
          <el-radio-button :label="1">是</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="宠物图片：" prop="picUrl">
        <UploadImg v-model="formData.picUrl" :upload-biz-type="'ANIMAL'" />
      </el-form-item>
      <el-form-item label="描述信息：" style="width: 80%">
        <el-input
          type="textarea"
          v-model="formData.desc"
          rows="3"
          maxlength="200"
          show-word-limit
          :disabled="loading"
          placeholder="请输入描述信息（最多200字）"
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" @click="addAnimal">提交</el-button>
        <el-button @click="closePopup">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<style scoped>
.el-form-item {
  width: 60%;
}
</style>
