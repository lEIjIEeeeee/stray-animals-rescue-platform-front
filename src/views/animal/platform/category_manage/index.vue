<script setup lang="ts">
import { reactive, ref } from 'vue'

const categoryList = reactive([
  {
    id: '0',
    pid: '-1',
    name: '动物分类树',
    level: 0,
    sort: 1,
    children: [
      {
        id: 'CAT-1',
        pid: '0',
        name: '一级大类1',
        level: 1,
        sort: 1,
        children: [
          {
            id: 'CAT-1-1',
            pid: 'CAT-1',
            name: '二级小类1-1',
            level: 2,
            sort: 1,
            children: [
              {
                id: 'CAT-1-1-1',
                pid: 'CAT-1-1',
                name: '种类(三级小类)1-1-1',
                level: 3,
                sort: 1,
                children: []
              }
            ]
          },
          {
            id: 'CAT-1-2',
            pid: 'CAT-1',
            name: '二级小类1-2',
            level: 2,
            sort: 2,
            children: []
          },
          {
            id: 'CAT-1-3',
            pid: 'CAT-1',
            name: '二级小类1-3',
            level: 2,
            sort: 3,
            children: []
          }
        ]
      },
      {
        id: 'CAT-2',
        pid: '0',
        name: '一级大类2',
        level: 1,
        sort: 2,
        children: []
      },
      {
        id: 'CAT-3',
        pid: '0',
        name: '一级大类3',
        level: 1,
        sort: 3,
        children: []
      }
    ]
  }
])

// const category

const categoryProps = {
  label: 'name'
}

const treeVisible = ref(true)
</script>

<template>
  <div class="h-full bg-white overflow-hidden flex flex-row">
    <el-tree
      v-if="treeVisible"
      :data="categoryList"
      node-key="id"
      :props="categoryProps"
      :auto-expand-parent="false"
      default-expanded-keys="[0]"
      :highlight-current="true"
      draggable
    >
    </el-tree>

    <div class="flex items-center bg-[#f5f7fa]">
      <div
        class="tree-drawer-btn h-[50px] cursor-pointer flex items-center"
        @click="treeVisible = !treeVisible"
      >
        <el-icon size="8">
          <caret-left v-if="treeVisible" />
          <caret-right v-else />
        </el-icon>
      </div>
    </div>

    <div class="w-full bg-blue-50 flex-1">
      <div>按钮</div>
      <el-table
        stripe
        :header-cell-style="{
          height: '50px',
          backgroundColor: '#f2f2f2',
          color: '#666666'
        }"
      >
        <el-table-column type="index" label="序号" width="55" align="center"></el-table-column>
        <el-table-column label="分类名称" align="center"></el-table-column>
        <el-table-column label="层级" align="center"></el-table-column>
        <el-table-column label="排序" align="center"></el-table-column>
        <el-table-column label="状态" align="center"></el-table-column>
        <el-table-column label="操作" align="center"></el-table-column>
      </el-table>
      <div>分页</div>
    </div>

    <!-- <div class="w-full bg-white border mr-[10px] flex-1">123</div> -->
  </div>
</template>

<style scoped>
:deep(.el-tree-node__content) {
  min-width: 200px;
  height: 40px;
  padding-right: 20px;
  font-weight: 600;
}

.tree-drawer-btn:hover {
  background-color: #409eff;
}

.el-table {
  /* width: 100%; */
}
</style>
