<script setup lang="ts">
import { reactive } from 'vue'
import usePopup from '@/hooks/usePopup'
import router from '@/router'

const { show, openPopup, closePopup } = usePopup()

defineExpose({
  open
})

const accountInfo = reactive({
  nickName: '',
  account: ''
})
function open(data) {
  accountInfo.nickName = data.nickName
  accountInfo.account = data.account
  openPopup()
}

const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <el-dialog v-model="show" title="提示" width="600" :close-on-click-modal="false">
    <div class="mb-[20px] flex flex-col items-center">
      <div class="mb-[20px] flex flex-col items-center">
        <el-image
          class="w-[100px] h-[100px] mb-[10px]"
          src="src/assets/common/success.png"
        ></el-image>
        <span class="text-[18px] font-medium">注册成功！</span>
      </div>
      <div class="mb-[20px] text-[20px] font-medium flex flex-col items-center">
        <span>{{ accountInfo.nickName }}，您的登录账号是</span>
        <span class="text-[#ff0000]">{{ accountInfo.account }}</span>
      </div>
      <el-button type="primary" @click="goLogin">前往登录</el-button>
    </div>
  </el-dialog>
</template>
