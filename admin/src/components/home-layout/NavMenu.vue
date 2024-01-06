<template>
  <div class="home-nav-menu">
    <el-menu
      class="menu-box"
      :collapse="props.isCollapse"
      :default-active="state.path"
      ref="menuRef"
      unique-opened
      @open="onMenuOpen">
      <el-sub-menu v-for="item in menus" :key="item.path" :index="item.path">
        <template #title>
          <el-icon>
            <icon-font :icon="icon(item.meta?.icon)"></icon-font>
          </el-icon>
          <span style="padding-left: 5px">{{ title(item.meta) }}</span>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="child in item.children"
            :key="`${child.path}`"
            :index="`${item.path}/${child.path}`"
            @click="onTab(`${item.path}/${child.path}`)">
            {{ title(child.meta) }}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    <!-- 版本号 -->
    <div class="version">
      <template v-if="!props.isCollapse">{{ t('version') }}:</template>
      {{ appVersion }}
      <template v-if="isDev">({{ stage }})</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { LangEnum } from '@/enum'
import { useAppStore } from '@/store'
import IconFont from '../IconFont.vue'

// props
const props = defineProps<{
  isCollapse: boolean
}>()
// i18n
const { t } = useI18n({
  messages: {
    en: {
      version: 'version'
    },
    zh: {
      version: '版本号'
    }
  }
})
// router
const route = useRoute()
const router = useRouter()
// store
const appStore = useAppStore()
// var
let subIndex = ''
const appVersion = window.__APP_VERSION__
const isDev = import.meta.env.DEV
const stage = import.meta.env.VITE_STAGE
// state
const menuRef = ref(null)
const state = reactive({
  path: route.path
})
// computed
const menus = computed(() => {
  const routes = router.options.routes
  return routes.filter((item) => {
    const isIndex = '/' === item.path
    if (isIndex) {
      return
    }
    if (item.children) {
      item.children = item.children.filter((item) => {
        return item.path.indexOf('/index') >= 0
      })
    }
    return item.children?.length
  })
})
// watch
watch(
  () => route.path,
  () => {
    state.path = route.path
    // path为/折叠menu
    if (state.path === '/' && subIndex) {
      const menu = menuRef.value as any
      menu?.close(subIndex)
    }
  }
)
// 标题
function title(meta?: any) {
  const { titleEn, titleZh } = meta || {}
  const lang = appStore.state.lang
  return lang === LangEnum.En ? titleEn : titleZh
}
// 菜单切换
function onTab(path: string) {
  router.push({ path })
}
// sub-menu 展开的回调
function onMenuOpen(index: string) {
  subIndex = index
}
// 图标
function icon(icon?: unknown) {
  return icon as string
}
</script>

<style scoped lang="scss">
.home-nav-menu {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-right: 1px;
  .menu-box {
    overflow: auto;
    flex: 1;
    &:not(.el-menu--collapse) {
      width: 160px;
    }
  }
  .version {
    border-top: 1px solid #dcdfe6;
    border-right: 1px solid #dcdfe6;
    font-size: 12px;
    padding: 5px 0;
    text-align: center;
  }
}
</style>
