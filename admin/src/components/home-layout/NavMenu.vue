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
          <div class="menu-item">
            <div class="menu-item-collapse-box">
              <el-icon>
                <icon-font :icon="icon(item.meta?.icon)"></icon-font>
              </el-icon>
              <el-text v-if="props.isCollapse" truncated>
                {{ title(item.meta) }}
              </el-text>
            </div>
            <div v-if="!props.isCollapse" class="menu-item-text">
              <el-text truncated>{{ title(item.meta) }}</el-text>
            </div>
          </div>
        </template>
        <el-menu-item-group>
          <el-menu-item
            v-for="child in item.children"
            :key="`${child.path}`"
            :index="`${item.path}/${child.path}`"
            @click="onTab(`${item.path}/${child.path}`)">
            <el-text truncated>{{ title(child.meta) }}</el-text>
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
    <!-- 版本号 -->
    <div class="version">
      <template v-if="!props.isCollapse">{{ tg('app.version') }}:</template>
      {{ appVersion }}
      <template v-if="isDev">({{ stage }})</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import lang from '@/lang/router'
import IconFont from '../IconFont.vue'

// props
const props = defineProps<{
  isCollapse: boolean
}>()
// use
const { t } = useI18n({ messages: lang })
const { t: tg } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
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
    if (item.children) {
      item.children = item.children.filter((item) => item.meta?.menu)
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
  return t(meta.title)
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

<style lang="scss">
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
    .el-text {
      color: inherit;
    }
    .el-sub-menu__title {
      padding: 0 10px !important;
      .el-sub-menu__icon-arrow {
        right: 10px;
      }
      .menu-item {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        .menu-item-collapse-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 12px;
          gap: 5px;
          line-height: 1;
        }
        .menu-item-text {
          flex: 1;
          overflow: hidden;
          padding-right: 30px;
        }
      }
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
