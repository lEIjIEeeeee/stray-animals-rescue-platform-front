<script setup lang="ts">
import { ref } from 'vue'

const carouselImgList = [
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png',
  'src/assets/login/bg_login.png'
]

const activeName = ref('first')

const dataList = ref([
  {
    id: 'test01',
    name: '小猫1',
    gender: 'F',
    categoryName: '类目1',
    picUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fss2.meipian.me%2Fusers%2F13927060%2F85d594ba648f433d90ff5556e747a1ea.jpeg%3Fmeipian-raw%2Fbucket%2Fivwen%2Fkey%2FdXNlcnMvMTM5MjcwNjAvODVkNTk0YmE2NDhmNDMzZDkwZmY1NTU2ZTc0N2ExZWEuanBlZw%3D%3D%2Fsign%2Fef6f7d352af0d6e52786b1f927eb23d7.jpg&refer=http%3A%2F%2Fss2.meipian.me&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712965224&t=7566d617dafd67f28f8ba7fbfe333850'
  },
  {
    id: 'test02',
    name: '小猫2',
    gender: 'M',
    categoryName: '类目1',
    picUrl:
      'https://img2.baidu.com/it/u=4191320190,1602368695&fm=253&fmt=auto&app=138&f=JPEG?w=350&h=500'
  },
  {
    id: 'test03',
    name: '小猫3',
    gender: 'M',
    categoryName: '类目3',
    picUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201909%2F13%2F20190913001225_js5BA.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712965324&t=32d479b9ffbddef7dfc8b18625d96f84'
  },
  {
    id: 'test04',
    name: '小猫4',
    gender: 'F',
    categoryName: '类目2',
    picUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201908%2F06%2F20190806081202_ZaYWa.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712965324&t=2f74368772587288f4487f572e4fb3a5'
  },
  {
    id: 'test05',
    name: '小猫5',
    gender: 'M',
    categoryName: '类目1',
    picUrl:
      'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fc-ssl.duitang.com%2Fuploads%2Fitem%2F201607%2F26%2F20160726152252_5MRis.thumb.1000_0.jpeg&refer=http%3A%2F%2Fc-ssl.duitang.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1712965324&t=6128bba9c0de6ae3bc1da2db310b859c'
  }
])

const noticeList = ref([
  {
    id: '',
    name: '',
    pid: '',
    pname: '',
    content: ''
  }
])
</script>

<template>
  <div class="px-[10px] pt-[20px] flex flex-col">
    <div class="flex flex-row">
      <div class="w-[600px] mr-[20px]">
        <el-carousel trigger="click" height="320px">
          <el-carousel-item v-for="item in carouselImgList" :key="item">
            <img :src="item" />
          </el-carousel-item>
        </el-carousel>
      </div>
      <div class="flex flex-col items-start" style="width: calc(100% - 600px)">
        <div class="border-b-[5px] px-[10px] py-[5px] mb-[20px] border-blue-300">领养须知</div>
        <div class="overflow-clip">
          公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容
        </div>
        <div class="border-b-[5px] px-[10px] py-[5px] mb-[20px] border-blue-300">小常识</div>
        <div class="overflow-clip">
          公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容公告内容
        </div>
      </div>
    </div>

    <div class="mb-[30px]">
      <el-tabs v-model="activeName">
        <el-tab-pane label="待领养" name="first"></el-tab-pane>
      </el-tabs>
      <div>
        <ul class="flex flex-row justify-between">
          <li class="p-[5px] flex flex-col bg-white" v-for="item in dataList" :key="item.id">
            <div class="">
              <el-image class="w-[250px] h-[180px]" :src="item.picUrl" fit="cover"></el-image>
            </div>
            <div class="mb-[5px]">
              <span class="mx-[10px]">{{ item.name }}</span>
              <span class="mr-[10px]">{{
                item.gender === 'F' ? '母' : item.gender === 'M' ? '公' : '未知'
              }}</span>
              <span>{{ item.categoryName }}</span>
            </div>
            <div class="w-full px-[10px] flex justify-between text-[#409eff]">
              <span class="cursor-pointer">我要领养</span>
              <span class="cursor-pointer">我要捐助</span>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
:deep(.el-tabs__nav-wrap::after) {
  /* 去除底部灰色下划线 */
  position: static !important;
}
</style>
