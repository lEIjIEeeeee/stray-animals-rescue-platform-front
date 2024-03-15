<script setup lang="ts">
import router from '@/router'
import { loginApi } from './login.api'
import { setToken, setUserType } from '@/utils/auth'
import { ElForm, ElMessage, FormRules } from 'element-plus'
import { get } from 'lodash-unified'
import { computed, reactive, ref } from 'vue'
import { UserLogin } from './types'
import useMainDisabled from '@/hooks/useMainDisabled'

const { mainDisabled, openMainDisabled, closeMainDisabled } = useMainDisabled()
const disabled = computed(() => mainDisabled.value)

const userLogin = reactive(new UserLogin())

const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  account: [
    {
      required: true,
      message: '账号不能为空',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '密码不能为空',
      trigger: 'blur'
    }
  ]
}

const login = async () => {
  try {
    openMainDisabled()
    await loginApi(userLogin).then((data) => {
      console.log(data)
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
    closeMainDisabled()
  } catch (e) {
    closeMainDisabled()
  }
}

const goRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div
    class="w-full h-full bg-cover flex justify-center items-center"
    style="background-image: url(/src/assets/login/bg_login.png)"
  >
    <div
      class="w-[400px] p-[20px] flex flex-col rounded-[5px]"
      style="background-color: rgba(255, 255, 255, 60%)"
    >
      <div class="mb-[20px] text-[24px] font-blob text-center">流浪动物救助平台</div>
      <el-form :model="userLogin" @submit.prevent ref="formRef" :rules="formRules">
        <el-form-item prop="account">
          <el-input
            type="text"
            v-model="userLogin.account"
            clearable
            :disabled="disabled"
            placeholder="请输入账号/手机号"
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="userLogin.password"
            show-password
            clearable
            :disabled="disabled"
            placeholder="请输入密码"
          />
        </el-form-item>
        <el-form-item>
          <el-button class="w-full" type="primary" :disabled="disabled" @click="login"
            >登 录</el-button
          >
        </el-form-item>
      </el-form>
      <div class="text-[16px] font-normal text-right">
        还没有账号？请<a class="text-[#409eff] cursor-pointer" @click="goRegister">注册</a>
      </div>
    </div>
  </div>
</template>
