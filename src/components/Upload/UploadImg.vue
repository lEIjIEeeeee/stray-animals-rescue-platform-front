<script setup lang="ts">
import { ref } from 'vue'
import Upload from './Upload.vue'
import UploadSlot from './UploadSlot.vue'
import { UploadBizType } from './upload'

const props = withDefaults(
  defineProps<{
    modelValue: string
    uploadBizType: UploadBizType
    disabled?: boolean
    fileType?: Array<string>
    uploadFile?
  }>(),
  {
    disabled: false,
    fileType: () => ['jpg', 'jpeg', 'gif', 'png']
  }
)
const emit = defineEmits<{
  (e: 'update:modelValue', url: string): void
}>()

const showViewer = ref(false)

const imgDel = () => {
  emit('update:modelValue', '')
  setDefault()
}

const uploadRef = ref<InstanceType<typeof Upload>>()
const setDefault = () => {
  uploadRef.value?.setDefault()
}
</script>

<template>
  <Upload
    ref="uploadRef"
    type="item"
    :url="props.modelValue"
    :upload-biz-type="props.uploadBizType"
    :disabled="props.disabled"
    :addBtn="true"
    :uploadFile="props.uploadFile"
    @update:url="emit('update:modelValue', $event)"
  >
    <template #default="{ showAdd, showDefault, showProgress, showError, uploadPercent, disabled }">
      <slot
        :url="props.modelValue"
        :showAdd="showAdd"
        :showDefault="showDefault"
        :showProgress="showProgress"
        :showError="showError"
        :uploadPercent="uploadPercent"
        :disabled="disabled"
      >
        <UploadSlot
          class="w-[120px] h-[120px] border border-dashed border-[#dcdfe6] rounded-[10px] hover:border-[#409eff]"
          :showAdd="showAdd"
          :showDefault="showDefault"
          :showProgress="showProgress"
          :showError="showError"
          :percentage="uploadPercent"
        >
          <template #add>
            <div class="container-wrapper flex-normal">
              <el-icon size="40" color="#dcdfe6">
                <Plus />
              </el-icon>
            </div>
          </template>
          <template #default>
            <div class="container-wrapper relative">
              <el-image
                class="container-wrapper object-fill rounded-[10px]"
                :src="props.modelValue"
              ></el-image>
              <div
                class="container-wrapper absolute left-0 right-0 top-0 bottom-0 bg-[#000] bg-opacity-50 opacity-0 hover:opacity-100"
              >
                <div class="container-wrapper flex-normal">
                  <div class="p-[10px]" @click.stop="showViewer = true">
                    <el-icon size="20" color="#fff">
                      <ZoomIn />
                    </el-icon>
                  </div>
                  <div class="p-[10px] ml-[10px]" @click.stop="imgDel">
                    <el-icon size="20" color="#fff">
                      <Delete />
                    </el-icon>
                  </div>
                </div>
              </div>
            </div>
          </template>
          <template #progress="{ percentage }">
            <div class="container-wrapper flex-normal">
              <el-progress type="circle" :percentage="percentage" :width="100"></el-progress>
            </div>
          </template>
          <template #error>
            <div class="container-wrapper flex-normal flex-col relative">
              <el-icon size="30">
                <Warning />
              </el-icon>
              <span>上传失败</span>
              <div
                class="w-[20px] h-[20px] flex-normal absolute top-0 right-0"
                @click.stop="imgDel"
              >
                <el-icon>
                  <circle-close-filled />
                </el-icon>
              </div>
            </div>
          </template>
          <template #loading>
            <div class="container-wrapper flex-normal">
              <el-icon class="is-loading" size="30">
                <loading />
              </el-icon>
            </div>
          </template>
        </UploadSlot>
      </slot>
    </template>
  </Upload>
  <el-image-viewer
    v-if="showViewer"
    :initial-index="0"
    :url-list="[props.modelValue]"
    @close="showViewer = false"
  />
</template>

<style scoped>
.container-wrapper {
  width: 100%;
  height: 100%;
}

.flex-normal {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
