<template>
  <el-config-provider :locale="locale" size="small">
    <!-- header -->
    <nav-bar v-model="state.isCollapse"></nav-bar>
    <!-- body -->
    <div class="home-body">
      <!-- 菜单栏 -->
      <nav-menu :isCollapse="state.isCollapse"></nav-menu>
      <!-- container -->
      <div class="home-container">
        <!-- tab -->
        <nav-tab @change="onChange"></nav-tab>
        <!-- 路由视图 -->
        <router-view #="{ Component }">
          <keep-alive :include="state.keeps">
            <component :is="Component" />
          </keep-alive>
        </router-view>
      </div>
    </div>
  </el-config-provider>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useAppStore } from '@/store'
import NavBar from './NavBar.vue'
import NavMenu from './NavMenu.vue'
import NavTab from './NavTab.vue'

// store
const appStore = useAppStore()
// state
let state = reactive({
  isCollapse: false, // 是否水平折叠收起菜单
  keeps: []
})
// computed
const locale = computed(() => {
  const map = {
    zh: zhCn,
    en: undefined
  }
  return map[appStore.state.lang]
})
// nav tab变化
function onChange(arr: any) {
  state.keeps = arr
}
</script>

<style scoped lang="scss">
.home-body {
  display: flex;
  flex: 1;
  overflow: hidden;
  .home-container {
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 5px;
  }
}
</style>
