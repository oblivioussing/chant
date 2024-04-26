<template>
  <div class="login">
    <div class="abyss-img-box">
      <img class="abyss-img" src="./img/abyss.jpg" />
    </div>
    <div class="container">
      <div class="title">{{ t('projectName') }}</div>
      <el-form class="form" :model="state.form" ref="formRef" :rules="rules">
        <!-- 登录名 -->
        <el-form-item prop="loginName">
          <el-input
            v-model="state.form.loginName"
            :placeholder="t('loginName')"
            :prefix-icon="User"
            size="large">
          </el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            v-model="state.form.password"
            :placeholder="t('password')"
            :prefix-icon="Lock"
            size="large"
            type="password">
          </el-input>
        </el-form-item>
      </el-form>
      <!-- 登录 -->
      <el-button
        class="login-btn"
        :loading="state.loading"
        size="large"
        type="primary"
        @click="onLogin">
        {{ t('login') }}
      </el-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { FormInstance } from 'element-plus'
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { Lock, User } from '@element-plus/icons-vue'
import { shiki } from '@/api'
import { StorageEnum } from '@/enum'
import { app as lang } from '@/lang'
import { useUserStore } from '@/store'
import { storage } from '@/utils'

// use
const router = useRouter()
const userStore = useUserStore()
const { t } = useI18n({ messages: lang })
// ref
const formRef = ref<FormInstance>()
// state
let state = reactive({
  form: {
    loginName: 'admin',
    password: '123456'
  },
  loading: false
})
const rules = reactive({
  loginName: [{ required: true, message: t('loginNameRequired') }],
  password: [{ required: true, message: t('passwordRequired') }]
})
// 登录
async function onLogin() {
  const status = await formRef.value?.validate()
  if (!status) {
    return
  }
  state.loading = true
  const { data } = await shiki.post('user/login', state.form, { failTip: true })
  if (data) {
    userStore.state.token = data
    // 缓存token
    storage.setLocal(StorageEnum.Token, data)
    // 获取用户信息
    getUser()
  } else {
    state.loading = false
  }
}
// 获取用户信息
async function getUser() {
  const { data } = await shiki.get('user/info', null)
  state.loading = false
  if (data) {
    userStore.state.user = data
    // 缓存user
    storage.setLocal(StorageEnum.User, data)
    // 清空nav-tab
    storage.rmSession(StorageEnum.HomeNavTab)
    router.push({ path: '/' })
  }
}
</script>

<style scoped lang="scss">
.login {
  box-sizing: border-box;
  backdrop-filter: blur();
  display: flex;
  justify-content: center;
  height: 100vh;
  .abyss-img-box {
    flex: 1;
    overflow: hidden;
    .abyss-img {
      object-fit: cover;
      height: 100%;
      width: 100%;
    }
  }
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 0 100px 200px;
    width: 350px;
    .title {
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 30px;
    }
    .form {
      width: 100%;
    }
    .login-btn {
      margin-top: 10px;
      width: 100%;
    }
  }
}
</style>
