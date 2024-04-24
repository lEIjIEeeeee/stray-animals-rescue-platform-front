<script setup lang="ts">
import useMainLoading from '@/hooks/useMainLoading'
import router from '@/router'
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { getRecordDetailApi } from '../contribution.api'
import { ContributionRecordDetail } from '../types'
import { getEnumNameByValue, contributionTypeDict, auditStatusDict } from '@/stores/enums'
import ContributionAudit from './ContributionAudit.vue'

const { mainLoading, closeMainLoading, openMainLoading } = useMainLoading()

const loading = computed(() => unref(mainLoading))
const auditResult = computed(() => detail.status !== 1 && detail.status !== 2)
const animalPicShowViewer = ref(false)
const itemPicShowViewer = ref(false)

onMounted(() => {
  init()
})

const init = () => {
  getDetail()
}

let id: any = ''
const detail = reactive(new ContributionRecordDetail())
const getDetail = async () => {
  try {
    openMainLoading()
    id = unref(router.currentRoute).query?.id
    const data = await getRecordDetailApi(id)
    Object.assign(detail, data.data)
    console.log(data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const contributionAuditRef = ref<InstanceType<typeof ContributionAudit>>()
const handleAudit = () => {
  contributionAuditRef.value?.open(id)
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
              <span>{{ detail.animalName }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>宠物编号：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ detail.animalNo }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>动物类目：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ detail.categoryName }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>宠物主人：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ detail.ownerName }}</span>
            </div>
          </div>
          <div class="label-item flex">
            <div class="w-[90px]">
              <span>主人电话：</span>
            </div>
            <div class="flex-1 min-w-0">
              <span>{{ detail.ownerPhone }}</span>
            </div>
          </div>
        </div>
        <div class="mt-[30px] flex flex-col">
          <div class="text-[18px] font-bold">
            <span>宠物图片</span>
          </div>
          <div class="h-[140px] mt-[20px] p-[10px] border rounded-[4px] flex items-center">
            <el-image
              class="w-[120px] h-[120px] cursor-pointer hover:opacity-50"
              :src="detail.picUrl"
              fit="cover"
              @click="animalPicShowViewer = true"
            ></el-image>
            <el-image-viewer
              v-if="animalPicShowViewer"
              :initial-index="0"
              :url-list="[detail.picUrl]"
              @close="animalPicShowViewer = false"
            />
          </div>
        </div>
        <div class="mt-[30px] flex flex-col">
          <div class="text-[18px] font-bold">
            <span>捐助信息</span>
          </div>
          <div class="px-[20px] mt-[20px] grid grid-cols-3 gap-x-[10px] gap-y-[20px]">
            <div class="label-item flex">
              <div class="w-[90px]">
                <span>捐助人：</span>
              </div>
              <div class="flex-1 min-w-0">
                <span>{{ detail.applyUserName }}</span>
              </div>
            </div>
            <div class="label-item flex">
              <div class="w-[90px]">
                <span>捐助人账号：</span>
              </div>
              <div class="flex-1 min-w-0">
                <span>{{ detail.applyUserAccount }}</span>
              </div>
            </div>
            <div class="label-item flex">
              <div class="w-[90px]">
                <span>联系电话：</span>
              </div>
              <div class="flex-1 min-w-0">
                <span>{{ detail.contactPhone }}</span>
              </div>
            </div>
            <div class="label-item flex">
              <div class="w-[90px]">
                <span>捐助类型：</span>
              </div>
              <div class="flex-1 min-w-0">
                <span>{{ getEnumNameByValue(contributionTypeDict, detail.itemType) }}</span>
              </div>
            </div>
            <div class="label-item flex">
              <div class="w-[90px]">
                <span>捐助物名称：</span>
              </div>
              <div class="flex-1 min-w-0">
                <span>{{ detail.itemName }}</span>
              </div>
            </div>
            <div class="label-item flex">
              <div class="w-[90px]">
                <span>申请时间：</span>
              </div>
              <div class="flex-1 min-w-0">
                <span>{{ detail.applyTime }}</span>
              </div>
            </div>
            <div class="label-item flex">
              <div class="w-[90px]">
                <span>捐助备注：</span>
              </div>
              <div class="flex-1 min-w-0">
                <span>{{ detail.remark }}</span>
              </div>
            </div>
          </div>
          <div class="mt-[30px] flex flex-col">
            <div class="text-[18px] font-bold">
              <span>捐助物图片</span>
            </div>
            <div class="h-[140px] mt-[20px] p-[10px] border rounded-[4px] flex items-center">
              <el-image
                class="w-[120px] h-[120px] cursor-pointer hover:opacity-50"
                :src="detail.itemPic"
                fit="cover"
                @click="itemPicShowViewer = true"
              ></el-image>
              <el-image-viewer
                v-if="itemPicShowViewer"
                :initial-index="0"
                :url-list="[detail.itemPic]"
                @close="itemPicShowViewer = false"
              />
            </div>
          </div>
          <div v-if="detail.status === 2 || detail.status === 3" class="mt-[30px] flex flex-col">
            <div class="text-[18px] font-bold">
              <span>审核信息</span>
            </div>
            <div class="px-[20px] mt-[20px] grid grid-cols-3 gap-x-[10px] gap-y-[20px]">
              <div class="label-item flex">
                <div class="w-[90px]">
                  <span>审核结果：</span>
                </div>
                <div class="flex-1 min-w-0">
                  <span :class="[{ 'text-[#ff0000]': auditResult }]">
                    {{ getEnumNameByValue(auditStatusDict, detail.status) }}
                  </span>
                </div>
              </div>
              <div class="label-item flex">
                <div class="w-[90px]">
                  <span>审核人：</span>
                </div>
                <div class="flex-1 min-w-0">
                  <span>{{ detail.auditUserName }}</span>
                </div>
              </div>
              <div class="label-item flex">
                <div class="w-[90px]">
                  <span>审核时间：</span>
                </div>
                <div class="flex-1 min-w-0">
                  <span>{{ detail.auditTime }}</span>
                </div>
              </div>
              <div class="label-item flex">
                <div class="w-[90px]">
                  <span>审核备注：</span>
                </div>
                <div class="flex-1 min-w-0">
                  <span>{{ detail.auditRemark }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="w-full h-[50px] pl-[10px] border-t-[1px] bg-white sticky bottom-0 z-10"
      v-if="detail.status === 1"
    >
      <div class="h-[50px] flex justify-start items-center">
        <el-button type="primary" :disabled="loading" @click="handleAudit">审核</el-button>
        <el-button :disabled="loading" @click="router.go(-1)">返回列表</el-button>
      </div>
    </div>
  </div>
  <ContributionAudit type="audit" @audit="getDetail" ref="contributionAuditRef" />
</template>

<style scoped>
.label-item {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}
</style>
