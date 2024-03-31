<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import usePopup from '@/hooks/usePopup'
import { computed, reactive, ref, unref } from 'vue'
import { auditApi, getAuditDetailApi } from '../adopt.api'
import { AuditDetailInfo, AuditInfo } from '../types'
import { ElForm, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { get } from 'lodash'

const { show, openPopup, closePopup } = usePopup()
const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const title = computed(() =>
  props.type === 'detail' ? '领养审核结果' : props.type === 'audit' ? '领养申请审核' : ''
)
const loading = computed(() => unref(mainLoading))
const isAdopted = computed(() => auditDetailInfo.isAdopt === 0)
const isLost = computed(() => auditDetailInfo.isLost === 0)

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

let id = ''

const init = () => {
  getAuditDetail()
}

const auditDetailInfo = reactive(new AuditDetailInfo())
const getAuditDetail = async () => {
  try {
    openMainLoading()
    const data = await getAuditDetailApi(id)
    Object.assign(auditDetailInfo, data.data)
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
    <div class="pt-[14px] pb-[20px] border-b-[1px]" v-loading="loading">
      <div class="grid grid-cols-3 gap-x-[20px] gap-y-[20px]">
        <div class="flex">
          <div class="w-[80px]">
            <span>宠物名称：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.animalName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>宠物编号：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.animalNo }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>动物类目：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.categoryName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>领养状态：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span :class="[{ 'text-[#ff0000]': !isAdopted }]">
              {{
                auditDetailInfo.isAdopt === 0
                  ? '待领养'
                  : auditDetailInfo.isAdopt === 1
                    ? '已领养'
                    : '未知'
              }}
            </span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>遗失状态：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span :class="[{ 'text-[#ff0000]': !isLost }]">
              {{
                auditDetailInfo.isLost === 0
                  ? '未遗失'
                  : auditDetailInfo.isLost === 1
                    ? '已遗失'
                    : '未知'
              }}
            </span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>宠物主人：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{
              auditDetailInfo.ownerName == null ? '暂无' : auditDetailInfo.ownerName
            }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>主人电话：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{
              auditDetailInfo.ownerPhone == null ? '暂无' : auditDetailInfo.ownerPhone
            }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>领养人：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.adoptUserName }}</span>
          </div>
        </div>
        <div class="flex">
          <div class="w-[80px]">
            <span>联系电话：</span>
          </div>
          <div class="flex-1 min-w-0">
            <span>{{ auditDetailInfo.contactPhone }}</span>
          </div>
        </div>
      </div>
      <div class="mt-[20px] flex">
        <div class="w-[80px]">
          <span>领养备注：</span>
        </div>
        <div class="flex-1 min-w-0">
          <span>{{ auditDetailInfo.remark }}</span>
        </div>
      </div>
    </div>
    <div class="mt-[20px]">
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
            <span :class="[{ 'text-[#ff0000]': auditDetailInfo.auditResult !== 'PASS' }]">
              {{
                auditDetailInfo.auditResult === 'PASS'
                  ? '审核通过'
                  : auditDetailInfo.auditResult === 'REJECT'
                    ? '审核拒绝'
                    : '状态异常'
              }}
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
    </div>
  </el-dialog>
</template>
