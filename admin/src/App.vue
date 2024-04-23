<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { app as lang } from '@/lang'
import { useAppStore } from '@/store'

// use
const appStore = useAppStore()
// i18n
const { t } = useI18n({ messages: lang })
// onMounted
onMounted(() => {
  // 设置标题
  setTitle()
})
// subscribe
appStore.$subscribe(() => {
  // 设置标题
  setTitle()
})
// 设置标题
function setTitle() {
  document.title = t('projectName')
}
</script>

<style lang="scss">
@import './style/base.scss';
@import './style/element.scss';
@import './style/var.scss';
</style>
