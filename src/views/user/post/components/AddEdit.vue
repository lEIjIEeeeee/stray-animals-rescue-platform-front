<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { AddPostForm } from '../types'
import { FormRules, ElForm, ElMessage, ElMessageBox, ElCascader } from 'element-plus'
import router from '@/router/index'
import { getDetailApi, submitPostApi, resubmitPostApi } from '../post.api'
import WangEditor from '@/components/WangEditor/index.vue'
import { getCategoryTreeApi } from '@/views/platform/animal/category_manage/category.api'
import { getAnimalListByCategoryIdApi } from '../../animal/animal.api'
import UploadImg from '@/components/Upload/UploadImg.vue'
import useMainLoading from '@/hooks/useMainLoading'
import { bizTypeDict } from '@/stores/enums'
import { get } from 'lodash'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => unref(mainLoading))

const props = defineProps<{
  type: 'add' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit'): void
}>()

const title = computed(() => (props.type === 'add' ? '发布新帖' : '编辑帖子'))

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
  bizType: [
    {
      required: true,
      message: '请选择帖子类型'
    }
  ],
  categoryId: [
    {
      required: true,
      message: '请选择动物类目'
    }
  ],
  picUrl: [
    {
      required: true,
      message: '请上传帖子图片'
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
      message: '请输入正文内容'
    }
  ]
}

const save = async () => {
  try {
    await formRef.value?.validate()
    openMainLoading()
    // const data = await submitPostApi(formData)
    // if (get(data, 'code') === 0) {
    //   ElMessage.success('发帖成功')
    // }
    if (props.type === 'add') {
      addPost()
    }
    if (props.type === 'edit') {
      editPost()
    }
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const addPost = async () => {
  try {
    openMainLoading()
    await ElMessageBox.confirm('确认发布帖子？请保证帖子内容的正确性，平台会对帖子内容进行审核。', {
      type: 'warning'
    })
    const data = await submitPostApi(formData)
    if (get(data, 'code') === 0) {
      ElMessage.success('发布成功')
    }
    closeMainLoading()
    emit('add')
  } catch (e) {
    closeMainLoading()
  }
}

const editPost = async () => {
  try {
    openMainLoading()
    await ElMessageBox.confirm(
      '确认修改帖子并发布？请保证帖子内容的正确性，平台会对帖子内容进行审核。',
      {
        type: 'warning'
      }
    )
    formData['id'] = id
    const data = await resubmitPostApi(formData)
    if (get(data, 'code') === 0) {
      ElMessage.success('修改成功')
    }
    closeMainLoading()
    emit('edit')
  } catch (e) {
    closeMainLoading()
  }
}

const submitCancel = () => {
  router.go(-1)
}

const categoryTreeData = ref([])
const getCategoryTree = async () => {
  const data = await getCategoryTreeApi()
  categoryTreeData.value = data.data.children
}

const animalList = ref([])

const getDetail = async () => {
  try {
    openMainLoading()
    const data = await getDetailApi(id)
    formData.title = data.data.title
    formData.categoryId = data.data.categoryId
    formData.bizType = bizTypeDict.find((item) => {
      return item.value === data.data.bizType
    }).code
    formData.picUrl = data.data.picUrl
    formData.postAbstract = data.data.postAbstract
    formData.content = data.data.content
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

let id: any = ''
const init = () => {
  getCategoryTree()
  if (props.type === 'edit') {
    id = unref(router.currentRoute).query?.id
    getDetail()
  }
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
  if (!formData.categoryId) {
    const animalAllList = await getAnimalListByCategoryIdApi()
    animalList.value = animalAllList.data
  } else {
    const animalListById = await getAnimalListByCategoryIdApi({ categoryId: formData.categoryId })
    animalList.value = animalListById.data
  }
}
</script>

<template>
  <div class="w-full min-w-[1200px] flex justify-center">
    <div class="w-[1200px] my-[14px] pt-[20px] rounded-[4px] bg-white flex flex-col shadow">
      <div class="mx-[30px] text-[20px] font-bold">
        <span>{{ title }}</span>
      </div>
      <div class="mx-[50px] mt-[20px] flex justify-center">
        <el-form
          class=""
          label-width="100px"
          ref="formRef"
          :rules="formRules"
          :model="formData"
          v-loading="loading"
          @submit.prevent
        >
          <el-form-item label="标题：" prop="title">
            <el-input
              type="text"
              v-model="formData.title"
              maxlength="80"
              show-word-limit="true"
              placeholder="请输入标题"
            />
          </el-form-item>
          <el-form-item label="帖子类型：" prop="bizType">
            <el-radio-group v-model="formData.bizType">
              <el-radio :label="'ADOPT_BIZ'">领养</el-radio>
              <el-radio :label="'LOST_BIZ'">遗失</el-radio>
              <el-radio :label="'OTHER'">其他</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="动物类目：" prop="categoryId">
            <el-cascader
              class="w-[50%]"
              v-model="formData.categoryId"
              :options="categoryTreeData"
              :props="categoryCascaderProps"
              clearable
              :disabled="loading"
              placeholder="请选择父级类目"
              @visible-change="handleBlur"
              @change="handleCascaderChange"
              ref="categoryTreeRef"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="帖子图片：" prop="picUrl">
            <UploadImg v-model="formData.picUrl" :upload-biz-type="'POST'" />
          </el-form-item>
          <el-form-item label="摘要：" prop="postAbstract">
            <el-input
              type="textarea"
              :rows="3"
              v-model="formData.postAbstract"
              placeholder="请输入帖子摘要"
              maxlength="300"
              show-word-limit="true"
            />
          </el-form-item>
          <el-form-item label="正文内容：" prop="content">
            <div>
              <WangEditor v-model="formData.content" />
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">确认发布</el-button>
            <el-button @click="submitCancel">返回</el-button>
          </el-form-item>
        </el-form>
      </div>
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
