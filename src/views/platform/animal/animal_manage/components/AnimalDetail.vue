<script setup lang="ts">
import router from '@/router'
import { ElForm, ElMessage, ElMessageBox, FormRules } from 'element-plus'
import { computed, onMounted, ref, reactive, unref } from 'vue'
import { animalEditInfoApi, getAnimalDetailApi } from '../animal.api'
import useMainLoading from '@/hooks/useMainLoading'
import { AnimalDetail, AnimalEditInfo } from '../types'
import { getCategoryTreeApi } from '../../category_manage/category.api'
import { getAnimalOwnerListApi } from '@/views/common/common.api'
import { get } from 'lodash'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()

const props = defineProps<{
  type: 'detail' | 'edit'
}>()

const emit = defineEmits<{
  (e: 'edit'): void
}>()

const disabled = computed(() => props.type === 'edit')
const loading = computed(() => mainLoading.value)

const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  animalNo: [
    {
      required: true,
      message: '请填写宠物编号',
      trigger: 'blur'
    }
  ],
  ownerId: [
    {
      required: false,
      message: '请选择宠物主人'
    }
  ],
  name: [
    {
      required: false,
      message: '请填写宠物名称'
    }
  ],
  isAdopt: [
    {
      required: true,
      message: '请选择领养状态'
    }
  ],
  gender: [
    {
      required: true,
      message: '请选择宠物性别',
      trigger: 'blur'
    }
  ],
  isLost: [
    {
      required: true,
      message: '请选择遗失状态'
    }
  ],
  categoryId: [
    {
      required: true,
      validator: (rule, value, callback) => {
        if (value.length === 0) {
          callback(new Error('请选择动物类目'))
        } else {
          callback()
        }
      }
    }
  ],
  desc: [
    {
      required: false,
      message: '请填写描述信息'
    }
  ]
}

const categoryTreeData = ref([])
const categoryCascaderProps = reactive({
  value: 'id',
  label: 'name',
  checkStrictly: true
})

const getCategoryTree = async () => {
  const data = await getCategoryTreeApi()
  categoryTreeData.value = data.data.children
}

const ownerList = ref([])
const getOwnerUserList = async () => {
  const data = await getAnimalOwnerListApi()
  ownerList.value = data.data
}

let id: any = ''
const animalDetail = reactive(new AnimalDetail())
const getDetail = async () => {
  try {
    openMainLoading()
    const data = await getAnimalDetailApi(id)
    Object.assign(animalDetail, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const init = () => {
  id = unref(router.currentRoute).query?.id
  getCategoryTree()
  getOwnerUserList()
  getDetail()
}

onMounted(() => {
  init()
})

const animalEditInfo = reactive(new AnimalEditInfo())
const saveBaseInfo = async () => {
  try {
    await ElMessageBox.confirm('确认保存修改的宠物信息？', {
      type: 'warning'
    })
    openMainLoading()
    await formRef.value?.validate
    animalEditInfo.id = id
    animalEditInfo.name = animalDetail.name
    animalEditInfo.categoryId = animalDetail.categoryId
    animalEditInfo.ownerId = animalDetail.ownerId
    animalEditInfo.birthday = animalDetail.birthday
    animalEditInfo.gender = animalDetail.gender
    animalEditInfo.weight = animalDetail.weight
    animalEditInfo.desc = animalDetail.desc
    const data = await animalEditInfoApi(animalEditInfo)
    if (get(data, 'code') === 0) {
      ElMessage.success('保存成功')
    }
    closeMainLoading()
    await getDetail()
  } catch (e) {
    closeMainLoading()
    await getDetail()
  }
}

const goBack = () => {
  router.go(-1)
}

const categoryChange = (val) => {
  if (!val) {
    animalDetail.categoryId = ''
    return
  }
  if (typeof val === 'string') {
    animalDetail.categoryId = val
  } else {
    animalDetail.categoryId = val[val.length - 1]
  }
}

const adoptReacordList = ref([])
</script>

<template>
  <div class="w-full flex overflow-auto bg-gray-50">
    <div class="w-full">
      <div class="w-full px-[24px] pt-[20px] flex flex-col">
        <div class="mb-[20px]">
          <span class="font-semibold">基本信息</span>
        </div>
        <div v-if="disabled" class="mb-[20px]">
          <el-form
            :model="animalDetail"
            :rules="formRules"
            ref="formRef"
            @submit.prevent
            label-width="100"
            v-loading="loading"
          >
            <el-row>
              <el-col :span="8">
                <el-form-item label="宠物名称：" prop="name">
                  <el-input
                    type="text"
                    v-model="animalDetail.name"
                    clearable
                    :disabled="loading"
                    placeholder="请填写宠物名称"
                  ></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4"></el-col>
              <el-col :span="8">
                <el-form-item label="宠物编号：" prop="animalNo">
                  <el-input
                    type="text"
                    v-model="animalDetail.animalNo"
                    placeholder="请填写宠物编号"
                    disabled="false"
                  ></el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="动物类目：" prop="categoryId">
                  <el-cascader
                    class="w-[100%]"
                    v-model="animalDetail.categoryId"
                    :options="categoryTreeData"
                    :props="categoryCascaderProps"
                    clearable
                    :disabled="loading"
                    @change="categoryChange"
                    placeholder="请选择动物类目"
                  >
                  </el-cascader>
                </el-form-item>
              </el-col>
              <el-col :span="4"></el-col>
              <el-col :span="8">
                <el-form-item label="宠物主人：" prop="ownerId">
                  <el-select
                    v-model="animalDetail.ownerId"
                    :disabled="loading"
                    filterable
                    clearable
                    placeholder="请选择宠物主人"
                  >
                    <el-option
                      v-for="item in ownerList"
                      :key="item.id"
                      :label="item.name"
                      :value="item.id"
                    ></el-option>
                  </el-select>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="宠物性别：" prop="gender">
                  <el-radio-group v-model="animalDetail.gender" :disabled="loading">
                    <el-radio :label="'M'">雄性</el-radio>
                    <el-radio :label="'F'">雌性</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
              <el-col :span="4"></el-col>
              <el-col :span="8">
                <el-form-item label="是否领养：" prop="isAdopt">
                  <el-radio-group v-model="animalDetail.isAdopt" disabled="false">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="出生日期：">
                  <el-date-picker
                    v-model="animalDetail.birthday"
                    type="date"
                    clearable
                    :disabled="loading"
                    placeholder="选择日期"
                    style="width: 100%"
                  ></el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="4"></el-col>
              <el-col :span="8">
                <el-form-item label="是否遗失：" prop="isLost">
                  <el-radio-group v-model="animalDetail.isLost" disabled="false">
                    <el-radio :label="1">是</el-radio>
                    <el-radio :label="0">否</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="8">
                <el-form-item label="宠物体重：">
                  <el-input
                    type="text"
                    v-model.number="animalDetail.weight"
                    clearable
                    :disabled="loading"
                    placeholder="请填写宠物体重"
                  >
                    <template #suffix>千克</template>
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
            <el-row>
              <el-col :span="20">
                <el-form-item label="描述信息：" prop="desc">
                  <el-input
                    type="textarea"
                    v-model="animalDetail.desc"
                    rows="3"
                    maxlength="200"
                    show-word-limit
                    :disabled="loading"
                    placeholder="请填写描述信息(最多200字)"
                  >
                  </el-input>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
        <div v-else class="mb-[20px]">
          <el-row class="mb-[20px]">
            <el-col :span="6">
              <div class="form-item">
                <span>宠物名称：</span>
                <span>{{ animalDetail.name }}</span>
              </div>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              <div class="form-item">
                <span>宠物编号：</span>
                <span>{{ animalDetail.animalNo }}</span>
              </div>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              <div class="form-item">
                <span>动物类目：</span>
                <span>{{ animalDetail.categoryName }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="mb-[20px]">
            <el-col :span="6">
              <div class="form-item">
                <span>宠物主人：</span>
                <span>{{ animalDetail.ownerName }}</span>
              </div>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              <div class="form-item">
                <span>宠物性别：</span>
                <span>
                  {{
                    animalDetail.gender === 'M'
                      ? '雄性'
                      : animalDetail.gender === 'F'
                        ? '雌性'
                        : '未知'
                  }}
                </span>
              </div>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              <div class="form-item">
                <span>出生日期：</span>
                <span>{{ animalDetail.birthday }}</span>
              </div>
            </el-col>
          </el-row>
          <el-row class="mb-[20px]">
            <el-col :span="6">
              <div class="form-item">
                <span>宠物体重：</span>
                <span>{{ animalDetail.weight }}</span>
              </div>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              <div class="form-item">
                <span>领养状态：</span>
                <span>
                  {{
                    animalDetail.isAdopt === 0
                      ? '待领养'
                      : animalDetail.isAdopt === 1
                        ? '已领养'
                        : '状态异常'
                  }}
                </span>
              </div>
            </el-col>
            <el-col :span="3"></el-col>
            <el-col :span="6">
              <div class="form-item">
                <span>遗失状态：</span>
                <span>
                  {{
                    animalDetail.isLost === 0
                      ? '未遗失'
                      : animalDetail.isLost === 1
                        ? '已遗失'
                        : '状态异常'
                  }}
                </span>
              </div>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="15">
              <div class="form-item">
                <span>描述信息：</span>
                <span>{{ animalDetail.desc }}</span>
              </div>
            </el-col>
          </el-row>
        </div>
        <div class="mb-[20px]">
          <span class="font-semibold">领养记录</span>
        </div>
        <div class="mb-[20px]">
          <el-table
            :data="adoptReacordList"
            stripe
            :header-cell-style="{
              height: '50px',
              backgroundColor: '#f2f2f2',
              color: '#666666'
            }"
          >
            <el-table-column label="序号" type="index" width="100"></el-table-column>
            <el-table-column label="领养人" width="180"></el-table-column>
            <el-table-column label="领养开始时间" min-width="180"></el-table-column>
            <el-table-column label="领养结束时间" min-width="180"></el-table-column>
          </el-table>
        </div>
        <div class="mb-[20px]">
          <span class="font-semibold">捐助记录</span>
        </div>
        <div class="mb-[20px]">
          <el-table
            :data="adoptReacordList"
            stripe
            :header-cell-style="{
              height: '50px',
              backgroundColor: '#f2f2f2',
              color: '#666666'
            }"
          >
            <el-table-column label="序号" type="index" width="100"></el-table-column>
            <el-table-column label="捐助人" width="180"></el-table-column>
            <el-table-column label="捐助名称" min-width="180"></el-table-column>
            <el-table-column label="捐助类型" min-width="180"></el-table-column>
            <el-table-column label="捐助图片" min-width="180"></el-table-column>
            <el-table-column label="捐助时间" min-width="180"></el-table-column>
          </el-table>
        </div>
      </div>
      <div
        class="w-full h-[50px] pl-[10px] border-t-[1px] bg-white sticky bottom-0 z-10"
        v-if="disabled"
      >
        <div class="h-[50px] flex justify-start items-center">
          <el-button type="primary" @click="saveBaseInfo"> 保存</el-button>
          <el-button @click="goBack">返回</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.form-item span {
  font-size: 14px;
  font-weight: 500;
  color: #606266;
}
</style>
