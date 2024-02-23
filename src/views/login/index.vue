<script setup lang="ts">
import router from '@/router'
import { loginApi } from './login.api'
import { setToken, setUserType } from '@/utils/auth'
import { ElMessage } from 'element-plus'
import { get } from 'lodash-unified'
import { reactive } from 'vue'

const loginUser = reactive({
  account: '',
  password: ''
})

const login = async () => {
  await loginApi({
    account: loginUser.account,
    password: loginUser.password
  }).then((data) => {
    if (data) {
      const token = get(data.data, 'token')
      const userType = get(data.data, 'userType')
      if (token) {
        setToken(token)
        setUserType(userType)
        ElMessage.success('登录成功')
        if (userType === 'NORMAL_USER') {
          router.replace('/home')
        } else if (userType === 'PLATFORM_ADMIN') {
          router.replace('/platform')
        }
      }
    }
  })
}
</script>

<template>
  <div
    class="w-full h-[100vh] bg-cover flex justify-center items-center"
    style="background-image: url(/src/assets/login/bg.png)"
  >
    <div
      class="w-[300px] p-[10px] flex flex-col"
      style="background-color: rgba(255, 255, 255, 40%)"
    >
      <div class="mb-[20px] text-[24px] font-blob text-center">流浪动物救助平台</div>
      <el-form :model="loginUser">
        <el-form-item>
          <el-input type="text" v-model="loginUser.account" placeholder="请输入账号/手机号" />
        </el-form-item>
        <el-form-item>
          <el-input type="password" v-model="loginUser.password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item>
          <el-button class="w-full bg-[#409eff]" type="primary" @click="login">登 录</el-button>
        </el-form-item>
      </el-form>
      <div class="mt-[10px] text-[14px] font-normal text-right">
        还没有账号？请<a class="text-[#0152d9]" href="">注册</a>
      </div>
    </div>
  </div>
</template>
