<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import usePopup from '@/hooks/usePopup'
import { computed, reactive, ref, unref } from 'vue'
import { getAuditDetailApi, auditApi } from '../contribution.api'
import { AuditDetailInfo, AuditInfo } from '../types'
import { auditStatusDict, contributionTypeDict, getEnumNameByValue } from '@/stores/enums'
import { ElForm, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { get } from 'lodash'

const title = computed(() =>
  props.type === 'detail' ? '捐助审核结果' : props.type === 'audit' ? '捐助申请审核' : ''
)

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))
const auditResult = computed(() => auditDetailInfo.status !== 1 && auditDetailInfo.status !== 2)
const showViewer = ref(false)

const props = defineProps<{
  type: 'detail' | 'audit'
}>()

const emit = defineEmits<{
  (e: 'audit'): void
}>()

defineExpose({
  open
})

function open(recordId) {
  id = recordId
  init()
  openPopup()
}

const init = () => {
  getAuditDetail()
}

let id = ''
const auditDetailInfo = reactive(new AuditDetailInfo())
const getAuditDetail = async () => {
  try {
    openMainLoading()
    const data = await getAuditDetailApi(id)
    Object.assign(auditDetailInfo, data.data)
    console.log(auditDetailInfo)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const formData = reactive(new AuditInfo())
const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  auditResult: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value == '' || value == null || value == undefined) {
          callback(new Error('操作结果不能为空'))
        } else {
          callback()
        }
      }
    }
  ],
  auditRemark: [
    {
      required: false,
      message: '审核拒绝时审核备注不能为空',
      validator: (rule, value, callback) => {
        if (formData.auditResult === 'REJECT' && formData.auditRemark === '') {
          callback(new Error('审核拒绝时审核备注不能为空'))
        } else {
          callback()
        }
      }
    }
  ]
}

const handleAudit = async () => {
  try {
    await ElMessageBox.confirm('确认进行审核操作吗？审核过后，数据无法撤销。', {
      type: 'warning'
    })
    await formRef.value?.validate()
    openMainLoading()
    formData.id = id
    const data = await auditApi(formData)
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
  <el-dialog :title="title" v-model="show" :close-on-click-modal="false" width="60%">
    <div class="pt-[14px]" v-loading="loading">
      <div class="grid grid-cols-3 gap-x-[20px] gap-y-[20px]">
        <div class="flex">
          <div class="w-[90px]">
            <span>宠物名称：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.animalName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>宠物编号：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.animalNo }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>动物类目：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.categoryName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>宠物主人：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.ownerName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>主人电话：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.ownerPhone }}</span>
          </div>
        </div>
      </div>
      <div class="mt-[20px] pt-[20px] grid grid-cols-3 gap-x-[20px] gap-y-[20px] border-t-[1px]">
        <div class="flex">
          <div class="w-[90px]">
            <span>捐助人：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.applyUserName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>联系电话：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.contactPhone }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>捐助类型：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ getEnumNameByValue(contributionTypeDict, auditDetailInfo.itemType) }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>捐助物名称：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.itemName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>申请时间：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.createTime }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>捐助备注：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.remark }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[90px]">
            <span>捐助物图片：</span>
          </div>
          <div class="flex items-center cursor-pointer" @click.stop="showViewer = true">
            <el-icon color="#409eff">
              <Picture />
            </el-icon>
            <span class="ml-[5px] text-[#409eff]">查看图片</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-[20px] pt-[20px] border-t-[1px]">
      <div
        v-if="props.type === 'detail'"
        class="grid grid-cols-3 gap-x-[20px] gap-y-[20px]"
        v-loading="loading"
      >
        <div class="flex">
          <div class="w-[80px]">
            <span>审核结果：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span :class="[{ 'text-[#ff0000]': auditResult }]">
              {{ getEnumNameByValue(auditStatusDict, auditDetailInfo.status) }}
            </span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>审核人：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.auditUserName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>审核时间：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.auditTime }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>审核备注：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.auditRemark }}</span>
          </div>
        </div>
      </div>
      <el-form
        v-if="props.type === 'audit'"
        :model="formData"
        label-width="100"
        ref="formRef"
        :rules="formRules"
        @submit.prevent
      >
        <el-form-item label="审核结果：" prop="auditResult">
          <el-radio-group v-model="formData.auditResult" :disabled="loading">
            <el-radio label="PASS">审核通过</el-radio>
            <el-radio label="REJECT">审核拒绝</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核备注：" prop="auditRemark">
          <el-input
            type="textarea"
            v-model="formData.auditRemark"
            rows="5"
            maxlength="200"
            show-word-limit
            :disabled="loading"
            placeholder="请输入审核备注（拒绝备注不能为空）"
          ></el-input>
        </el-form-item>
        <el-form-item label="">
          <el-button type="primary" :disabled="loading" @click="handleAudit">确定</el-button>
          <el-button :disabled="loading" @click="closePopup">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-image-viewer
      v-if="showViewer"
      :initial-index="0"
      :url-list="[auditDetailInfo.itemPic]"
      @close="showViewer = false"
    />
  </el-dialog>
</template>
