<template>
  <div class="home-header">
    <div class="left">
      <!-- logo -->
      <img src="/image/logo.png" class="logo-ic" />
      <!-- 项目名 -->
      <div>{{ tg('app.projectName') }}</div>
      <!-- 折叠/展开 -->
      <el-icon class="pointer" @click="onCollapse">
        <Expand v-if="state.isCollapse" />
        <Fold v-else />
      </el-icon>
    </div>
    <div class="right">
      <!-- 语言 -->
      <el-dropdown @command="onLang">
        <div class="dropdown">
          <div>{{ langLabel }}</div>
          <el-icon class="arrow-down-icon">
            <caret-bottom />
          </el-icon>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="LangEnum.Zh">中文</el-dropdown-item>
            <el-dropdown-item :command="LangEnum.En">English</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
      <!-- 退出 -->
      <el-dropdown @command="onQuit">
        <div class="dropdown">
          <el-avatar :src="avatarUrl" :size="25">
            <img
              src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
          </el-avatar>
          <div class="login-name-box">
            <div>{{ user.loginName }}</div>
            <div>{{ user.name }}</div>
          </div>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item command="quit">
              {{ tg('app.quit') }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { CaretBottom, Expand, Fold } from '@element-plus/icons-vue'
import { LangEnum, StorageEnum } from '@/enum'
import { vuei18n } from '@/plugs'
import { useAppStore, useUserStore } from '@/store'
import { storage } from '@/utils'

// emits
const emits = defineEmits(['update:modelValue'])
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// router
const router = useRouter()
// store
const appStore = useAppStore()
const userStore = useUserStore()
const user = userStore.state.user
// state
const state = reactive({
  orgs: [] as any[],
  isCollapse: false
})
// computed
const avatarUrl = computed(() => {
  return ''
})
const langLabel = computed(() => {
  const map = {
    en: 'English',
    zh: '中文'
  }
  return map[appStore.state.lang]
})
// 切换
function onCollapse() {
  state.isCollapse = !state.isCollapse
  emits('update:modelValue', state.isCollapse)
}
// 设置语言
function onLang(lang: LangEnum) {
  storage.setLocal(StorageEnum.Lang, lang)
  appStore.state.lang = lang
  vuei18n.global.locale.value = lang
}
// 退出
async function onQuit() {
  storage.rmLocal(StorageEnum.User)
  userStore.$state = {} as any
  router.push('/login')
}
</script>

<style scoped lang="scss">
.home-header {
  background-color: #333744;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  height: 45px;
  padding: 0 10px;
  .left {
    display: flex;
    align-items: center;
    font-size: 18px;
    .logo-ic {
      margin-right: 5px;
      width: 20px;
    }
    .pointer {
      cursor: pointer;
    }
  }
  .right {
    display: flex;
    align-items: center;
    .edit-type {
      cursor: pointer;
      font-size: 14px;
    }
    .badge {
      cursor: pointer;
      top: -10px;
      right: -5px;
    }
    .dropdown {
      color: #ffffff;
      cursor: pointer;
      display: flex;
      align-items: center;
      font-size: 12px;
      margin-left: 10px;
      .arrow-down-icon {
        color: #999999;
      }
      .login-name-box {
        margin-left: 5px;
        text-align: center;
      }
    }
  }
}
</style>
