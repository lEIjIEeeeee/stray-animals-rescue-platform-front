<script setup lang="ts">
import { computed, onMounted, reactive, ref, unref } from 'vue'
import { getPostListApi } from './post.api'
import { SearchParams, PostList } from './types'
import router from '@/router/index'
import useMainLoading from '@/hooks/useMainLoading'
import { bizTypeDict, getEnumNameByValue } from '@/stores/enums'
import { getCategoryTreeApi } from '@/views/platform/animal/category_manage/category.api'

const { mainLoading, openMainLoading, closeMainLoading } = useMainLoading()
const loading = computed(() => unref(mainLoading))

const refreshDivDisable = ref(false)
const postDivDisable = ref(false)

const categoryTree = ref([])
const getCategoryTree = async () => {
  const data = await getCategoryTreeApi()
  categoryTree.value = data.data.children
}

const searchParams = new SearchParams()
const postList = reactive(new PostList())
const getPostList = async () => {
  try {
    openMainLoading()
    const data = await getPostListApi(searchParams)
    Object.assign(postList, data.data)
    closeMainLoading()
  } catch (e) {
    closeMainLoading()
  }
}

const handleCurrentPageChange = (val: number) => {
  searchParams.pageNo = val
  getPostList()
}

const handlePageSizeChange = (val: number) => {
  searchParams.pageSize = val
  getPostList()
}

const init = async () => {
  getCategoryTree()
  getPostList()
}

onMounted(() => {
  init()
})

const refreshPage = () => {
  location.reload()
}

const addPost = () => {
  router.push('post/addPost')
}

const getDetail = (id) => {
  const target = router.resolve({
    path: 'post/detail',
    query: {
      id: id
    }
  })
  window.open(target.href, '_blank')
}

const allAnimalWrapper = ref(true)
const handleReset = () => {
  searchParams.pageNo = 1
  searchParams.pageSize = 20
  searchParams.bizType = ''
  categoryCascaderPanelRef.value?.clearCheckedNodes()
  postTypeWrapper.value = false
}

const categoryCascaderPanelRef = ref(null)
const categoryWrapper = ref(false)
const handleCategoryChange = (categoryList) => {
  let idList = ''
  categoryList.forEach(function (item, index) {
    if (categoryList.length === index + 1) {
      idList += item
    } else {
      idList += item + ','
    }
  })
  searchParams.categoryIds = idList
  getPostList()
  if (idList === '') {
    allAnimalWrapper.value = true
    categoryWrapper.value = false
  } else {
    allAnimalWrapper.value = false
    categoryWrapper.value = true
  }
}

const postTypeWrapper = ref(false)
const handlePostTypeCommand = (command) => {
  if (unref(allAnimalWrapper) === true) {
    allAnimalWrapper.value = false
  }
  postTypeWrapper.value = true
  searchParams.bizType = command
  getPostList()
}
</script>

<template>
  <div class="w-full min-w-[1200px] flex justify-center">
    <div class="w-[1200px]">
      <div class="my-[14px] flex items-center">
        <div class="flex items-center">
          <el-breadcrumb separator=">">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>社区交流</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
      </div>

      <div class="py-[20px] flex items-center">
        <div class="flex items-center text-[14px]">
          <div
            class="px-[20px] flex justify-center items-center cursor-pointer"
            :class="[{ 'text-[#409eff]': allAnimalWrapper }]"
            @click="handleReset"
          >
            <span>全部</span>
          </div>
          <div class="w-[1px] h-[14px] bg-[#d3d3d3]"></div>
          <div class="px-[20px] flex justify-center items-center">
            <el-dropdown>
              <span
                class="text-[#000] flex justify-center items-center"
                :class="[{ 'text-[#409eff]': categoryWrapper }]"
              >
                动物类目
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-cascader-panel
                  :options="categoryTree"
                  :props="{
                    multiple: 'true',
                    checkStrictly: 'true',
                    emitPath: false,
                    value: 'id',
                    label: 'name'
                  }"
                  @change="handleCategoryChange"
                  ref="categoryCascaderPanelRef"
                ></el-cascader-panel>
              </template>
            </el-dropdown>
          </div>
          <div class="w-[1px] h-[14px] bg-[#d3d3d3]"></div>
          <div class="px-[20px] flex justify-center items-center">
            <el-dropdown @command="handlePostTypeCommand">
              <span
                class="text-[#000] flex justify-center items-center"
                :class="[{ 'text-[#409eff]': postTypeWrapper }]"
              >
                帖子类型
                <el-icon>
                  <ArrowDown />
                </el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item
                    v-for="item in bizTypeDict"
                    :key="item.code"
                    :command="item.code"
                  >
                    <!-- <el-icon v-if="searchParams.bizType === item.code">
                      <check />
                    </el-icon>
                    <div class="w-[80px] flex justify-center items-center"> -->
                    {{ item.label }}
                    <!-- </div> -->
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </div>

      <div class="flex-1 min-h-0 shadow bg-white">
        <ul class="px-[24px]" v-loading="loading">
          <li
            class="h-[175px] py-[24px]"
            :class="[
              {
                'border-t-0': index === 0,
                'border-t-[1px]': index !== 0
              }
            ]"
            v-for="(item, index) in postList.dataList"
            :key="item.id"
          >
            <div class="h-full flex items-center">
              <el-image
                class="w-[216px] h-full mr-[10px]"
                :src="item.picUrl == null ? '' : item.picUrl"
                fit="cover"
              ></el-image>
              <div class="h-full flex flex-col flex-1 min-w-0">
                <div>
                  <a @click="getDetail(item.id)">
                    <span
                      class="font-medium text-[18px] hover:text-[#409eff] cursor-pointer"
                      title="标题"
                    >
                      {{ item.title }}
                    </span>
                  </a>
                </div>
                <div class="mt-[12px] flex-1">
                  <span class="post-abstract text-[14px] text-[#555666] font-medium" title="摘要">
                    {{ item.postAbstract }}</span
                  >
                </div>
                <div class="flex items-center mt-[16px] text-[14px]">
                  <div class="mr-[20px] text-black text-opacity-25 flex items-center flex-1">
                    <div>
                      <el-tag>{{ item.categoryName }}</el-tag>
                      <el-tag class="ml-[5px]" type="warning">
                        {{ getEnumNameByValue(bizTypeDict, item.bizType) }}帖
                      </el-tag>
                    </div>
                    <div class="ml-[10px]">
                      <span>作者：</span>
                    </div>
                    <div>
                      <el-image
                        class="w-[25px] h-[25px] rounded-[50%]"
                        :src="
                          item.avatar == null || item.avatar == ''
                            ? '/src/assets/user/default_avatar.png'
                            : item.avatar
                        "
                        fit="cover"
                      />
                    </div>
                    <div class="ml-[5px]">
                      <span>{{ item.createUser }}</span>
                    </div>
                  </div>
                  <div>
                    <span class="text-black text-opacity-25">{{ item.createTime }}</span>
                  </div>
                </div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div
        class="w-full h-[50px] pr-[24px] flex justify-end items-center sticky bottom-0 bg-white"
        style="box-shadow: 0 -3px 10px rgba(0, 0, 0, 0.05)"
      >
        <el-config-provider>
          <el-pagination
            :current-page="searchParams.pageNo"
            :page-size="searchParams.pageSize"
            :page-sizes="[10, 20, 50, 100]"
            layout="prev, pager, next, jumper, sizes, total"
            :total="postList.total"
            :disabled="loading"
            @current-change="handleCurrentPageChange"
            @size-change="handlePageSizeChange"
          />
        </el-config-provider>
      </div>
    </div>
  </div>

  <div
    class="w-[50px] h-[50px] fixed right-[50px] bottom-[220px] bg-gray-400 rounded-[4px] flex justify-center items-center cursor-pointer"
    style="box-shadow: 0 0 6px rgba(0, 0, 0, 0.12)"
    @mouseenter="refreshDivDisable = true"
    @mouseleave="refreshDivDisable = false"
    @click="refreshPage"
  >
    <el-icon v-if="!refreshDivDisable" :size="40" color="#ffffff">
      <refresh />
    </el-icon>
    <div v-if="refreshDivDisable" class="text-white font-medium text-[15px]">刷新</div>
  </div>
  <div
    class="w-[50px] h-[50px] fixed right-[50px] bottom-[160px] bg-blue-400 rounded-[4px] flex justify-center items-center cursor-pointer"
    style="box-shadow: 0 0 6px rgba(0, 0, 0, 0.12)"
    @mouseenter="postDivDisable = true"
    @mouseleave="postDivDisable = false"
    @click="addPost"
  >
    <el-icon v-if="!postDivDisable" :size="45" color="#ffffff">
      <edit />
    </el-icon>
    <div v-if="postDivDisable" class="text-white font-medium text-[15px]">发帖</div>
  </div>

  <el-backtop class="w-[50px] h-[50px]" :bottom="100" :right="55" visibility-height="90">
    <div
      class="w-full h-full rounded-[50%] flex flex-col items-center justify-center"
      style="box-shadow: 0 0 6px rgba(0, 0, 0, 0.12)"
    >
      <el-icon>
        <caret-top />
      </el-icon>
      <span class="font-medium text-[15px]">顶部</span>
    </div>
  </el-backtop>
</template>

<style scoped>
.post-abstract {
  display: -webkit-box !important;
  overflow: hidden;
  text-overflow: ellipsis;
  word-break: break-all;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical !important;
}
</style>
