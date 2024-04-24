<script setup lang="ts">
import { UploadRequestOptions } from 'element-plus'
import { computed, ref, unref } from 'vue'
import { UploadBizType, uploadFile as _uploadFile } from './upload'

const props = withDefaults(
  defineProps<{
    type: 'add' | 'item'
    url?: string
    uploadBizType?: UploadBizType
    multiple?: boolean
    limit?: number
    disabled?: boolean
    uploadFile?
    addBtn?: boolean
  }>(),
  {
    multiple: false,
    disabled: false,
    addBtn: false
  }
)

const emit = defineEmits<{
  (e: 'add', file: File): void
  (e: 'update:url', url: string): void
  (e: 'complete'): void
}>()

defineExpose({
  upload,
  setDefault
})

const uploadPercent = ref(0)
const uploading = ref(false)
const uploadError = ref(false)
const isAdd = computed(() => {
  console.log(props.addBtn && props.url == '' && !unref(uploading) && !unref(uploadError))
  return props.addBtn && props.url == '' && !unref(uploading) && !unref(uploadError)
})

const uploadFileOption = {
  next: (percent) => {
    uploadPercent.value = parseInt(percent)
    uploading.value = true
    uploadError.value = false
  },
  complete: (url) => {
    emit('update:url', url)
    emit('complete')
    uploadPercent.value = 0
    uploading.value = false
    uploadError.value = false
  },
  error: () => {
    emit('update:url', '')
    uploadPercent.value = 0
    uploading.value = false
    uploadError.value = true
  }
}

function upload(file, uploadBizType) {
  if (props.uploadFile) {
    props.uploadFile(file, uploadFileOption)
  } else {
    _uploadFile(file, uploadBizType, uploadFileOption)
  }
}

function setDefault() {
  uploadPercent.value = 0
  uploadError.value = false
  uploading.value = false
}

const httpRequest = (res: UploadRequestOptions) => {
  return new Promise((resolve) => {
    upload(res.file, props.uploadBizType)
    resolve(true)
  })
}

const uploadAddFile = (res: UploadRequestOptions) => {
  return new Promise((resolve) => {
    emit('add', res.file)
    resolve(true)
  })
}
</script>

<template>
  <div class="bg-white">
    <el-upload
      v-if="props.type === 'item'"
      action="#"
      :show-file-list="false"
      :disabled="props.disabled"
      :http-request="httpRequest"
    >
      <slot
        :showAdd="isAdd"
        :showDefault="props.url != '' && !uploading && !uploadError"
        :showProgress="uploading && !uploadError"
        :showError="uploadError"
        :uploadPercent="uploadPercent"
        :disabled="props.disabled"
      ></slot>
    </el-upload>
    <el-upload
      v-else-if="props.type === 'add'"
      action="#"
      :multiple="props.multiple"
      :show-file-list="false"
      :limit="props.limit"
      :http-request="uploadAddFile"
    >
      <slot
        :showAdd="false"
        :showDefault="false"
        :showProgress="false"
        :showError="false"
        :uploadPercent="0"
        :disabled="props.disabled"
      />
    </el-upload>
  </div>
</template>
