<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { AddPostForm } from '../types'
import { FormRules, ElForm, ElMessage } from 'element-plus'
import router from '@/router/index'
import { submitPostApi } from '../post.api'
import WangEditor from '@/components/WangEditor/index.vue'

const show = ref(false)
const loading = computed(() => show.value)

const openElFromLoading = () => {
  show.value = true
}

const closeElFromLoading = () => {
  show.value = false
}

const formData = reactive(new AddPostForm())
const options = [
  {
    value: 'CAT0001',
    label: '小猫'
  },
  {
    value: 'CAT0002',
    label: '小狗'
  },
  {
    value: 'CAT0003',
    label: '蛇'
  },
  {
    value: 'CAT0004',
    label: '仓鼠'
  },
  {
    value: 'CAT0005',
    label: '兔子'
  },
  {
    value: 'CAT0006',
    label: '其他'
  }
]

const animalAllList = ref([
  {
    value: '汪汪1',
    animalId: ''
  },
  {
    value: '汪汪2',
    animalId: 'NICK002'
  },
  {
    value: '汪汪3',
    animalId: ''
  },
  {
    value: '汪汪4',
    animalId: 'NICK004'
  }
])

const animalQueryList = ref([])

const searchAnimalByName = (query, callback) => {
  //TODO 待优化-根据动物类别id筛选返回的列表
  var resultList = query ? animalQueryList.value.filter(createFilter(query)) : animalQueryList.value
  // 调用 callback 返回建议列表的数据
  callback(resultList)
}

//TODO 待优化：模糊查找
const createFilter = (query) => {
  return (result) => {
    return result.value.toLowerCase().indexOf(query.toLowerCase()) === 0
  }
}

const handleSelect = (data) => {
  data.animalId ? (formData.animalId = data.animalId) : (formData.animalId = '')
  console.log(formData.animalId)
}

const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  title: [
    {
      required: true,
      message: '请输入标题',
      trigger: 'blur'
    }
  ],
  categoryId: [
    {
      required: true,
      message: '请选择动物类别',
      trigger: 'blur'
    }
  ],
  animalName: [
    {
      required: true,
      message: '请输入动物名称',
      trigger: 'blur'
    }
  ],
  bizType: [
    {
      required: true
    }
  ],
  postAbstract: [
    {
      required: true,
      message: '请输入摘要',
      trigger: 'blur'
    }
  ],
  content: [
    {
      required: true,
      message: '请输入内容',
      trigger: 'blur'
    }
  ]
}

const submitPost = async (data) => {
  try {
    await formRef.value?.validate()
    openElFromLoading()
    await submitPostApi(data)
    closeElFromLoading()
    ElMessage.success('发帖成功')
    router.go(-1)
  } catch (e) {
    closeElFromLoading()
  }
}

const submitCancel = () => {
  router.go(-1)
}

onMounted(() => {
  animalQueryList.value = unref(animalAllList)
})
</script>

<template>
  <div class="w-full">
    <div class="w-full bg-white flex justify-center">
      <el-form
        class="w-[80%] mt-[20px] mb-[50px]"
        label-width="100px"
        ref="formRef"
        :rules="formRules"
        :model="formData"
        v-loading="loading"
      >
        <el-row>
          <el-col :span="24">
            <el-form-item label="标题：" prop="title">
              <el-input
                type="text"
                v-model="formData.title"
                maxlength="100"
                show-word-limit="true"
                placeholder="请输入标题"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="动物类别：" prop="categoryId">
              <el-select
                v-model="formData.categoryId"
                placeholder="请选择动物类别"
                filterable
                clearable
              >
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="动物名称：" prop="animalName">
              <el-autocomplete
                v-model="formData.animalName"
                :fetch-suggestions="searchAnimalByName"
                placeholder="请输入动物名称"
                @select="handleSelect"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="发帖类型：" prop="bizType">
              <el-radio-group v-model="formData.bizType">
                <el-radio :label="'ADOPT_BIZ'">领养</el-radio>
                <el-radio :label="'LOSS_BIZ'">挂失</el-radio>
                <el-radio :label="'OTHER'">其他</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="摘要" prop="postAbstract">
              <el-input
                type="textarea"
                :rows="3"
                v-model="formData.postAbstract"
                placeholder="请输入摘要"
                maxlength="300"
                show-word-limit="true"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="24">
            <el-form-item label="内容：" prop="content">
              <div>
                <WangEditor v-model="formData.content" />
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item>
          <el-button type="primary" @click="submitPost(formData)">确认发帖</el-button>
          <el-button @click="submitCancel">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-autocomplete) {
  width: 100%;
}

.el-radio {
  margin-right: 60px;
}
</style>
