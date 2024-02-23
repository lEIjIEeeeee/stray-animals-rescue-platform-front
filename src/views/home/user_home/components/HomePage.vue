<script setup lang="ts">
const carouselImgList = [
  'src/assets/login/bg.png',
  'src/assets/login/bg.png',
  'src/assets/login/bg.png'
]
</script>

<template>
  <div class="bg-blue-50 flex flex-row px-[50px] py-[20px]">
    <div class="w-[580px] h-[370px] p-[10px] bg-white">
      <el-carousel trigger="click" height="350px">
        <el-carousel-item v-for="item in carouselImgList" :key="item">
          <div>
            <div>
              <img :src="item" />
            </div>
            <!-- <div class="absolute z-999">
              <el-tag type="primary">Tag 1</el-tag>
            </div> -->
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>

    <div>文本 文本</div>
  </div>
</template>

<style scoped></style>
