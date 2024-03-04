<script setup lang="ts">
import { computed, onMounted, reactive, ref } from 'vue'
import { AddPostForm } from '../types'
import { FormRules, ElForm, ElMessage, ElMessageBox, ElCascader } from 'element-plus'
import router from '@/router/index'
import { submitPostApi } from '../post.api'
import WangEditor from '@/components/WangEditor/index.vue'
import { getCategoryTreeApi } from '@/views/platform/animal/category_manage/category.api'
import { getAnimalListByCategoryIdApi } from '../../animal/animal.api'

const show = ref(false)
const loading = computed(() => show.value)

const openElFromLoading = () => {
  show.value = true
}

const closeElFromLoading = () => {
  show.value = false
}

const formData = reactive(new AddPostForm())

const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    }
  ],
  categoryId: [
    {
      required: true,
      message: '请选择动物类目',
      trigger: 'blur'
    }
  ],
  animalName: [
    {
      required: true,
      message: '请输入动物名称',
      trigger: 'blur'
    }
  ],
  bizType: [
    {
      required: true
    }
  ],
  postAbstract: [
    {
      required: true,
      message: '请输入摘要',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur'
    }
  ]
}

const submitPost = async (data) => {
  try {
    await formRef.value?.validate()
    openElFromLoading()
    if (animalInfoTemp.animalId === '') {
      await ElMessageBox.confirm('检测到新宠物信息，帖子审核通过后系统将会自动录入该信息。')
    } else {
      formData.animalId = animalInfoTemp.animalId
    }
    await submitPostApi(data)
    closeElFromLoading()
    ElMessage.success('发帖成功')
    router.go(-1)
  } catch (e) {
    closeElFromLoading()
  }
}

const submitCancel = () => {
  router.go(-1)
}

const categoryTreeData = ref([])
const getCategoryTree = async () => {
  const data = await getCategoryTreeApi()
  categoryTreeData.value = data.data
}

const animalList = ref([])
const getAnimalList = async () => {
  const data = await getAnimalListByCategoryIdApi()
  animalList.value = data.data
}

const init = () => {
  getCategoryTree()
  getAnimalList()
}

onMounted(() => {
  init()
})

const categoryTreeRef = ref<InstanceType<typeof ElCascader>>()
const categoryCascaderProps = reactive({
  value: 'id',
  label: 'name',
  checkStrictly: true,
  emitPath: false
})

const handleBlur = async (val: boolean) => {
  try {
    if (!val) {
      const data = await getAnimalListByCategoryIdApi({ categoryId: formData.categoryId })
      animalList.value = data.data
    }
  } catch (e) {
    console.log(e)
  }
}

const handleCascaderChange = async () => {
  formData.animalName = null
  if (!formData.categoryId) {
    const animalAllList = await getAnimalListByCategoryIdApi()
    animalList.value = animalAllList.data
  } else {
    const animalListById = await getAnimalListByCategoryIdApi({ categoryId: formData.categoryId })
    animalList.value = animalListById.data
  }
}

const handleFetchSuggestions = (resolve, cb) => {
  var result = resolve ? animalList.value.filter(createFilter(resolve)) : animalList.value
  cb(result)
}

const createFilter = (resolve) => {
  const queryStr = resolve === '' || resolve === 'null' ? '' : resolve
  return (animal) => {
    return animal.name.indexOf(queryStr) !== -1 || animal.animalNo.indexOf(queryStr) !== -1
  }
}

const animalInfoTemp = reactive({
  animalId: '',
  animalNo: '',
  animalName: ''
})

const handleSelect = async (item) => {
  animalInfoTemp.animalId = item.id
  animalInfoTemp.animalNo = item.animalNo
  animalInfoTemp.animalName = item.name
  formData.categoryId = item.categoryId
  const animalListByName = await getAnimalListByCategoryIdApi({ categoryId: item.categoryId })
  animalList.value = animalListByName.data
}

const handleChange = (val: string) => {
  if (val !== animalInfoTemp.animalName) {
    animalInfoTemp.animalId = ''
    animalInfoTemp.animalNo = ''
    animalInfoTemp.animalName = val
  }
}
// 1.类目清空时，名称也要清空
// 2.类目更换时，名称也要清空
// 3.名称选中节点时，附带类目要选中同时加载对应的animalList
// 4.
</script>

<template>
  <div class="w-full">
    <div class="w-full bg-white flex justify-center">
      <el-form
        class="w-[80%] mt-[20px] mb-[50px]"
        label-width="100px"
        ref="formRef"
        :rules="formRules"
        :model="formData"
        v-loading="loading"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题：" prop="title">
              <el-input
                type="text"
                v-model="formData.title"
                maxlength="100"
                show-word-limit="true"
                placeholder="请输入标题"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="动物类目：" prop="categoryId">
              <el-cascader
                class="w-[100%]"
                v-model="formData.categoryId"
                :options="categoryTreeData.children"
                :props="categoryCascaderProps"
                clearable
                :disabled="loading"
                placeholder="请选择父级类目"
                @visible-change="handleBlur"
                @change="handleCascaderChange"
                ref="categoryTreeRef"
              ></el-cascader>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="动物名称：" prop="animalName">
              <el-autocomplete
                value-key="name"
                v-model="formData.animalName"
                :fetch-suggestions="handleFetchSuggestions"
                @select="handleSelect"
                @change="handleChange"
                clearable
                highlight-first-item
                placeholder="请输入/选择动物名称"
              >
                <template #default="{ item }">
                  <div>{{ item.name + '(' + item.animalNo + ')' }}</div>
                </template>
              </el-autocomplete>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发帖类型：" prop="bizType">
              <el-radio-group v-model="formData.bizType">
                <el-radio :label="'ADOPT_BIZ'">领养</el-radio>
                <el-radio :label="'LOSS_BIZ'">挂失</el-radio>
                <el-radio :label="'OTHER'">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="摘要" prop="postAbstract">
              <el-input
                type="textarea"
                :rows="3"
                v-model="formData.postAbstract"
                placeholder="请输入摘要"
                maxlength="300"
                show-word-limit="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容：" prop="content">
              <div>
                <WangEditor v-model="formData.content" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitPost(formData)">确认发帖</el-button>
          <el-button @click="submitCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-autocomplete) {
  width: 100%;
}

.el-radio {
  margin-right: 60px;
}
</style>
