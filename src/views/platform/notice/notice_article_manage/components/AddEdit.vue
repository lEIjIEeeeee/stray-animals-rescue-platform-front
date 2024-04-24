<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import router from '@/router/index'
import { NoticeTypeItem, NoticeArticleBaseInfo, NoticeArticleContent } from '../types'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import useMainLoading from '@/hooks/useMainLoading'
import { getDropDownListApi } from '@/views/platform/notice/notice_type_manage/notice_type.api'
import UploadImg from '@/components/Upload/UploadImg.vue'
import WangEditor from '@/components/WangEditor/index.vue'
import { getDetailApi, addNoticeArticleApi, editNoticeArticleApi } from '../notice_article.api'
import { get } from 'lodash'

const props = defineProps<{
  type: 'add' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'edit'): void
}>()

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))

const tabList = ref([
  {
    label: '公告信息',
    name: 'baseInfo'
  },
  {
    label: '公告内容',
    name: 'content'
  }
])
const activeName = ref('baseInfo')
const activeIndex = ref(0)
const handleTabClick = async (tab, event) => {
  if (unref(activeName) === 'baseInfo' && unref(tab.paneName) !== 'baseInfo') {
    await formRef.value?.validate()
  }
  activeName.value = tab.paneName
  activeIndex.value = Number(tab.index)
}

const handleBeforeLeave = async (newVal, oldVal) => {
  let result = false
  if (oldVal === 'baseInfo' && newVal !== 'baseInfo') {
    await formRef.value?.validate((valid) => {
      if (valid) {
        result = true
      }
    })
  } else {
    result = true
  }
  return result
}

const toPrev = () => {
  activeName.value = unref(tabList)[unref(activeIndex) - 1].name
  activeIndex.value -= 1
}

const toNext = async () => {
  if (unref(activeName) === 'baseInfo') {
    await formRef.value?.validate()
  }
  activeName.value = unref(tabList)[unref(activeIndex) + 1].name
  activeIndex.value += 1
}

let id: any = ''
onMounted(() => {
  init()
  if (props.type === 'edit') {
    id = unref(router.currentRoute).query?.id
    getNoticeArticleDetail()
  }
})

const init = () => {
  getNoticeTypeDropDownList()
}

const noticeTypeList = ref<InstanceType<typeof Array<NoticeTypeItem>>>([])
const getNoticeTypeDropDownList = async () => {
  const data = await getDropDownListApi()
  noticeTypeList.value = data.data
}

const formData = reactive(new NoticeArticleBaseInfo())
const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  name: [
    {
      required: true,
      message: '请输入公告名称',
      trigger: 'blur'
    }
  ],
  noticeTypeId: [
    {
      required: true,
      message: '请选择公告分类'
    }
  ]
}

const getNoticeArticleDetail = async () => {
  try {
    openMainLoading()
    const data = await getDetailApi(id)
    formData.name = data.data.name
    formData.picUrl = data.data.picUrl
    formData.noticeTypeId = data.data.noticeTypeId
    formData.desc = data.data.desc
    formData.sort = data.data.sort
    contentFormData.content = data.data.content
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const contentFormData = reactive(new NoticeArticleContent())
const addOrEditNoticeArticle = async () => {
  try {
    openMainLoading()
    const content = contentFormData.content
    content
      .replace(/<[^<p>]+>/g, '') // 将所有<p>标签 replace ''
      .replace(/<[</p>$]+>/g, '') // 将所有</p>标签 replace ''
      .replace(/&nbsp;/gi, '') // 将所有 空格 replace ''
      .replace(/<[^<br/>]+>/g, '') // 将所有 换行符 replace ''
    console.log(content)
    if (unref(activeName) === 'baseInfo') {
      await formRef.value?.validate()
    }
    if (content === '') {
      await ElMessage.error('公告内容不能为空')
    } else {
      if (props.type === 'add') {
        add()
      }
      if (props.type === 'edit') {
        edit()
      }
    }
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const add = async () => {
  try {
    openMainLoading()
    const addRequest = new NoticeArticleBaseInfo()
    Object.assign(addRequest, formData)
    addRequest['content'] = contentFormData.content
    const data = await addNoticeArticleApi(addRequest)
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
    const editRequest = new NoticeArticleBaseInfo()
    Object.assign(editRequest, formData)
    editRequest['id'] = unref(router.currentRoute).query?.id
    editRequest['content'] = contentFormData.content
    const data = await editNoticeArticleApi(editRequest)
    if (get(data, 'code') === 0) {
      ElMessage.success('修改成功')
    }
    closeMainLoading()
    emit('edit')
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <div class="w-full bg-gray-50 overflow-auto">
    <div class="h-full flex flex-col">
      <div class="px-[24px] pt-[20px] flex flex-col flex-1">
        <div>
          <el-tabs
            v-model="activeName"
            @tab-click="handleTabClick"
            :before-leave="handleBeforeLeave"
          >
            <el-tab-pane
              v-for="item in tabList"
              :key="item.name"
              :label="item.label"
              :name="item.name"
            ></el-tab-pane>
          </el-tabs>
        </div>
        <div class="mt-[20px] flex-1 min-h-0">
          <div v-show="activeName === 'baseInfo'">
            <el-form
              :model="formData"
              :rules="formRules"
              ref="formRef"
              @submit.prevent
              label-width="93"
              v-loading="loading"
            >
              <div class="grid grid-cols-1 gap-y-[20px] min-w-[600px]">
                <el-form-item class="w-[400px]" label="公告名称：" prop="name">
                  <el-input
                    type="text"
                    v-model="formData.name"
                    :disabled="loading"
                    clearable
                    placeholder="请输入公告名称"
                  ></el-input>
                </el-form-item>
                <el-form-item label="公告图片：">
                  <UploadImg v-model="formData.picUrl" :upload-biz-type="'NOTICE'" />
                </el-form-item>
                <el-form-item class="w-[400px]" label="公告分类：" prop="noticeTypeId">
                  <el-select
                    v-model="formData.noticeTypeId"
                    :disabled="loading"
                    clearable
                    placeholder="请选择公告分类"
                  >
                    <el-option
                      v-for="item in noticeTypeList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item class="w-[400px]" label="排序：">
                  <el-input
                    type="text"
                    v-model.number="formData.sort"
                    :disabled="loading"
                    clearable
                    placeholder="请输入序号"
                  ></el-input>
                </el-form-item>
                <el-form-item class="w-[600px]" label="简介：">
                  <el-input
                    type="textarea"
                    v-model="formData.desc"
                    rows="3"
                    :disabled="loading"
                    placeholder="请输入简介"
                  ></el-input>
                </el-form-item>
              </div>
            </el-form>
          </div>
          <div v-show="activeName === 'content'">
            <WangEditor v-model="contentFormData.content" />
          </div>
        </div>
      </div>
      <div class="h-[50px] pl-[10px] border-t-[1px] bg-white sticky bottom-0 z-10">
        <div class="h-[50px] flex justify-start items-center">
          <el-button type="primary" :disabled="!(activeIndex > 0)" @click="toPrev">
            上一步
          </el-button>
          <el-button type="primary" :disabled="!(activeIndex < tabList.length - 1)" @click="toNext">
            下一步
          </el-button>
          <el-button type="primary" @click="addOrEditNoticeArticle">保存</el-button>
          <el-button @click="router.go(-1)">返回列表</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.el-tabs :deep(.el-tabs__header) {
  font-size: 18px;
  margin-bottom: 0px;
}

:deep(.el-tabs__nav-wrap::after) {
  /* 去除底部灰色下划线 */
  position: static !important;
}

:deep(.el-tabs__item) {
  font-size: 18px !important;
}
</style>
