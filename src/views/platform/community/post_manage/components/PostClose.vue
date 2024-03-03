<script setup lang="ts">
import usePopup from '@/hooks/usePopup'
import { ElForm, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { computed, reactive, ref } from 'vue'
import { PostCloseInfo } from '../types'
import useMainLoading from '@/hooks/useMainLoading'
import { postClosedApi, getCloseReasonApi } from '../post.api'

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => mainLoading.value)

const emit = defineEmits<{
  (e: 'submit'): void
}>()

defineExpose({
  open
})

function open(item) {
  postStatus.value = item.status
  if (postStatus.value === 4) {
    postCloseParamsFormData.id = item.id
    init()
  } else {
    closedInfoFormData.id = item.id
  }
  openPopup()
}
const postStatus = ref()
const postCloseParamsFormData = reactive(new PostCloseInfo())

const closedInfoFormData = reactive(new PostCloseInfo())
const closedFormRef = ref<InstanceType<typeof ElForm>>()
const closedFormRules: FormRules = {
  closeReason: [
    {
      required: true,
      message: '请输入帖子关闭原因',
      trigger: 'blur'
    }
  ]
}

const handleSubmit = async (data) => {
  try {
    await closedFormRef.value?.validate()
    await ElMessageBox.confirm('确定关闭该帖子并提交关闭原因吗？提交之后无法撤销此操作。')
    openMainLoading()
    await postClosedApi(data)
    closeMainLoading()
    ElMessage.success('提交成功')
    emit('submit')
    closePopup()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  getPostCloseReson()
}

const getPostCloseReson = async () => {
  try {
    openMainLoading()
    const data = await getCloseReasonApi(postCloseParamsFormData.id)
    postCloseParamsFormData.closeReason = data.data.closeReason
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}
</script>

<template>
  <el-dialog
    v-if="postStatus === 4"
    title="查看关闭原因"
    v-model="show"
    width="600"
    :close-on-click-modal="false"
  >
    <div>
      <el-form :model="postCloseParamsFormData" label="100" v-loading="loading">
        <el-form-item label="拒绝原因：" prop="closeReason">
          <el-input
            type="textarea"
            v-model="postCloseParamsFormData.closeReason"
            rows="5"
            readonly="true"
          ></el-input>
        </el-form-item>
      </el-form>
    </div>
  </el-dialog>
  <el-dialog v-else title="关闭帖子" v-model="show" width="600" :close-on-click-modal="false">
    <el-form
      :model="closedInfoFormData"
      :rules="closedFormRules"
      ref="closedFormRef"
      label-width="100"
      v-loading="loading"
    >
      <el-form-item label="拒绝原因：" prop="closeReason">
        <el-input
          type="textarea"
          v-model="closedInfoFormData.closeReason"
          rows="5"
          placeholder="请输入关闭原因(必填)"
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSubmit(closedInfoFormData)">确认</el-button>
        <el-button @click="closePopup"> 取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
