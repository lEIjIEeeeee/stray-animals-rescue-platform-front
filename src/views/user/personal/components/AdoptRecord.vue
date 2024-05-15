<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { SearchParams } from '../types'
import useMainLoading from '@/hooks/useMainLoading'
import { getAdoptRecordListApi } from '../personal.api'
import { DataListResponse } from '@/views/common/types'
import { auditStatusDict, getEnumNameByValue } from '@/stores/enums'
import AnimalAdopt from '../../animal/components/AnimalAdopt.vue'
import router from '@/router'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => unref(mainLoading))

defineExpose({
  search
})

const searchParams = reactive(new SearchParams())
function search(str) {
  searchParams.searchContent = str
  getAdoptRecordList()
}

onMounted(() => {
  init()
})

const init = () => {
  getAdoptRecordList()
}

const adoptRecordList = reactive(new DataListResponse())
const getAdoptRecordList = async () => {
  try {
    openMainLoading()
    const data = await getAdoptRecordListApi(searchParams)
    Object.assign(adoptRecordList, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const animalAdoptRef = ref<InstanceType<typeof AnimalAdopt>>(null)
const reApplyAdopt = (animalId: string, recordId: string) => {
  animalAdoptRef.value?.open(animalId, recordId)
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getAdoptRecordList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getAdoptRecordList()
}
</script>

<template>
  <div>
    <div class="mx-[20px]">
      <ul v-loading="loading">
        <li
          class="h-[200px] py-[20px] border-t-[1px]"
          v-for="item in adoptRecordList.dataList"
          :key="item.id"
        >
          <div class="h-full flex cursor-pointer">
            <div>
              <el-image
                class="w-[240px] h-full mr-[20px]"
                :src="item.animalPic == '' || item.animalPic == null ? '' : item.animalPic"
                fit="cover"
              ></el-image>
            </div>
            <div class="flex flex-col flex-1 justify-between">
              <div class="h-full flex flex-col">
                <div class="flex justify-between">
                  <div class="text-[18px] font-semibold">
                    <span>{{ item.animalName }}</span>
                  </div>
                  <div
                    class="pr-[10px] text-[16px]"
                    :class="[
                      {
                        'text-[#fa8c35]': item.status === 1,
                        'text-[#00bc12]': item.status === 2,
                        'text-[#c83c23]': item.status === 3
                      }
                    ]"
                  >
                    <span>{{ getEnumNameByValue(auditStatusDict, item.status) }}</span>
                  </div>
                </div>
                <div class="mt-[8px] h-full grid grid-cols-2 text-[14px]">
                  <div class="grid grid-cols-1 gap-y-[4px]">
                    <div>
                      <span>宠物编号：{{ item.animalNo }}</span>
                    </div>
                    <div>
                      <span>联系手机：{{ item.contactPhone }}</span>
                    </div>
                    <div class="flex" :title="'申请备注：' + item.remark">
                      <span>申请备注：</span>
                      <div class="flex-1 line-clamp-2 text-ellipsis">
                        {{ item.remark }}
                      </div>
                    </div>
                  </div>
                  <div
                    v-if="item.status === 2 || item.status === 3"
                    class="grid grid-cols-1 gap-y-[4px]"
                  >
                    <div>
                      <span>审核人：{{ item.auditorName }}</span>
                    </div>
                    <div>
                      <span>审核时间：{{ item.auditTime }}</span>
                    </div>
                    <div class="flex" :title="'审核备注：' + item.auditRemark">
                      <span>审核备注：</span>
                      <div class="flex-1 line-clamp-2 text-ellipsis">
                        {{ item.auditRemark }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="flex items-center">
                <div class="flex-1 flex items-center text-[14px]">
                  <div>
                    <el-tag>{{ item.categoryName }}</el-tag>
                  </div>
                  <div class="ml-[10px] text-black text-opacity-25">
                    <span>申请时间：{{ item.createTime }}</span>
                  </div>
                </div>
                <div
                  v-if="item.status === 3 && item.reapplyFlag !== 1"
                  class="px-[10px] text-[14px] hover:text-[#409eff]"
                >
                  <el-button type="normal" @click.stop="reApplyAdopt(item.animalId, item.id)">
                    重新申领
                  </el-button>
                </div>
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <div
      class="w-full h-[50px] sticky bottom-0 bg-white"
      style="box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.1)"
    >
      <div class="h-full py-[10px] pr-[10px] flex flex-row justify-end items-center">
        <el-config-provider>
          <el-pagination
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="prev, pager, next, jumper,sizes, total"
            :total="adoptRecordList.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>
  <AnimalAdopt type="reapply" @reapply="router.go(0)" ref="animalAdoptRef" />
</template>
