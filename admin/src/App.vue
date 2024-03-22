<template>
  <router-view></router-view>
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAppStore } from '@/store'

// use
const appStore = useAppStore()
// i18n
const { t: tg } = useI18n({ useScope: 'global' })
// subscribe
appStore.$subscribe((_, _state) => {
  // 设置标题
  setTitle()
})
// init
setTitle() // 设置标题
// 设置标题
function setTitle() {
  document.title = tg('app.projectName')
}
</script>

<style lang="scss">
@import './style/base.scss';
@import './style/element.scss';
@import './style/var.scss';
</style>
