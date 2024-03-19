<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import useMainDisabled from '@/hooks/useMainDisabled'
import router from '@/router'
import { UserRegister } from './types'
import { ElForm, FormRules } from 'element-plus'
import { registerApi } from './register.api'
import RegisterSuccess from './components/RegisterSuccess.vue'

const { mainDisabled, openMainDisabled, closeMainDisabled } = useMainDisabled()
const disabled = computed(() => mainDisabled.value)

const formRef = ref<InstanceType<typeof ElForm>>()
const formRules: FormRules = {
  nickName: [
    {
      required: true,
      message: '请输入用户昵称',
      trigger: 'blur'
    }
  ],
  password: [
    {
      required: true,
      message: '请输入用户密码',
      trigger: 'blur'
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: '请再次确认密码',
      trigger: 'blur'
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入手机号',
      trigger: 'blur'
    }
  ]
}

const registerSuccessRef = ref<InstanceType<typeof RegisterSuccess>>()
const userRegister = reactive(new UserRegister())
const handleRegister = async () => {
  try {
    await formRef.value?.validate()
    openMainDisabled()
    const data = await registerApi(userRegister)
    if (data.data) {
      registerSuccessRef.value?.open(data.data)
    }
    closeMainDisabled()
  } catch (e) {
    closeMainDisabled()
  }
}

const goLogin = () => {
  router.push('/login')
}
</script>

<template>
  <div
    class="w-full h-full bg-cover flex justify-center items-center"
    style="background-image: url('src/assets/login/bg_register.png')"
  >
    <div
      class="w-[400px] p-[20px] bg-white rounded-[10px] flex flex-col"
      style="background-color: rgba(255, 255, 255, 60%)"
    >
      <div class="mb-[20px] flex flex-col">
        <span class="mb-[10px] text-[28px] font-bold">流浪动物救助平台</span>
        <span class="text-[18px]">欢迎注册</span>
      </div>
      <el-form :model="userRegister" ref="formRef" :rules="formRules">
        <el-form-item prop="nickName">
          <el-input
            type="text"
            v-model="userRegister.nickName"
            maxlength="50"
            clearable
            :disabled="disabled"
            placeholder="用户昵称（必填）"
          ></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            type="password"
            v-model="userRegister.password"
            maxlength="45"
            clearable
            show-password
            :disabled="disabled"
            placeholder="登录密码（必填）"
            auto-complete="new-password"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item prop="confirmPassword">
          <el-input
            type="password"
            v-model="userRegister.confirmPassword"
            maxlength="45"
            clearable
            show-password
            :disabled="disabled"
            placeholder="确认密码（必填）"
            auto-complete="new-password"
            autocomplete="new-password"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-input
            type="text"
            v-model="userRegister.realName"
            maxlength="45"
            clearable
            :disabled="disabled"
            placeholder="真实姓名（不必填）"
          ></el-input>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input
            type="text"
            v-model="userRegister.phone"
            maxlength="45"
            clearable
            :disabled="disabled"
            placeholder="手机号（必填）"
          ></el-input>
        </el-form-item>
        <el-form-item>
          <el-button class="w-full" type="primary" :disabled="disabled" @click="handleRegister"
            >注册</el-button
          >
        </el-form-item>
      </el-form>
      <div class="ml-auto">
        <span
          >已有账号，马上<a class="text-[#409eff] cursor-pointer" @click="goLogin">登录</a></span
        >
      </div>
    </div>
  </div>
  <RegisterSuccess ref="registerSuccessRef" />
</template>
@/hooks/useMainDisabled
