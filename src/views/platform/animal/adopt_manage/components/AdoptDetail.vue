<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import router from '@/router'
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { AdoptRecordDetail } from '../types'
import { getRecordDetailApi } from '../adopt.api'
import AdoptAudit from './AdoptAudit.vue'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => unref(mainLoading))

const showViewer = ref(false)

const init = () => {
  getDetail()
}

let id: any = ''
const adoptRecordDetail = reactive(new AdoptRecordDetail())
const getDetail = async () => {
  try {
    openMainLoading()
    id = unref(router.currentRoute).query?.id
    const data = await getRecordDetailApi(id)
    Object.assign(adoptRecordDetail, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

onMounted(() => {
  init()
})

const adoptAuditRef = ref<InstanceType<typeof AdoptAudit>>()
const handleAudit = () => {
  adoptAuditRef.value?.open(id)
}

const goBack = () => {
  router.go(-1)
}
</script>

<template>
  <div class="w-full h-full flex flex-col overflow-auto">
    <div class="px-[24px] py-[20px] flex flex-col flex-1 bg-gray-50" v-loading="loading">
      <div class="flex flex-col">
        <div class="text-[18px] font-bold">
          <span>宠物信息</span>
        </div>
        <div class="px-[20px] mt-[20px] grid grid-cols-3 gap-x-[10px] gap-y-[20px]">
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>宠物名称：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.animalName }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>宠物编号：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.animalNo }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>动物类目：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.categoryName }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>宠物主人：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.ownerName }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>主人电话：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.ownerPhone }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-[30px] flex flex-col">
        <div class="text-[18px] font-bold">
          <span>宠物图片</span>
        </div>
        <div class="h-[140px] mt-[20px] px-[20px] bg-white rounded-[4px] flex items-center">
          <el-image
            class="w-[120px] h-[120px] cursor-pointer"
            :src="adoptRecordDetail.picUrl"
            fit="cover"
            @click="showViewer = true"
          ></el-image>
          <el-image-viewer
            v-if="showViewer"
            :initial-index="0"
            :url-list="[adoptRecordDetail.picUrl]"
            @close="showViewer = false"
          />
        </div>
      </div>

      <div class="mt-[30px] flex flex-col">
        <div class="text-[18px] font-bold">
          <span>领养信息</span>
        </div>
        <div class="px-[20px] mt-[20px] grid grid-cols-3 gap-x-[10px] gap-y-[20px]">
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>领养人：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.adoptUserName }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>领养人账号：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.adoptUserAccount }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>联系电话：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.contactPhone }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>申请时间：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.applyTime }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>领养备注：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.remark }}</span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="adoptRecordDetail.status === 2 || adoptRecordDetail.status === 3"
        class="mt-[30px] flex flex-col"
      >
        <div class="text-[18px] font-bold">
          <span>审核信息</span>
        </div>
        <div class="px-[20px] mt-[20px] grid grid-cols-3 gap-x-[10px] gap-y-[20px]">
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>审核结果：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span :class="[{ 'text-[#ff0000]': !(adoptRecordDetail.auditResult === 'PASS') }]">
                {{
                  adoptRecordDetail.auditResult === 'PASS'
                    ? '审核通过'
                    : adoptRecordDetail.auditResult === 'REJECT'
                      ? '审核拒绝'
                      : '状态异常'
                }}
              </span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>审核人：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.auditUserName }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>审核时间：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.auditTime }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>审核备注：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ adoptRecordDetail.auditRemark }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full h-[50px] pl-[10px] border-t-[1px] bg-white sticky bottom-0 z-10"
      v-if="adoptRecordDetail.status === 1"
    >
      <div class="h-[50px] flex justify-start items-center">
        <el-button type="primary" @click="handleAudit">审核</el-button>
        <el-button @click="goBack">返回列表</el-button>
      </div>
    </div>
  </div>
  <AdoptAudit type="audit" @audit="getDetail" ref="adoptAuditRef" />
</template>

<style scoped>
.label-item {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}
</style>
