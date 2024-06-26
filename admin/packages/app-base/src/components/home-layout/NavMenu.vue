<template>
  <div class="home-nav-menu">
    <el-menu
      class="menu-box"
      :collapse="props.isCollapse"
      :default-active="active"
      ref="menuRef"
      unique-opened
      @open="onMenuOpen">
      <el-sub-menu
        v-for="item in authStore.state.menu"
        :key="item.id"
        :index="item.id">
        <template #title>
          <div class="menu-item">
            <div class="menu-item-collapse-box">
              <el-icon>
                <chant-icon-font :icon="icon(item.icon)"></chant-icon-font>
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
        <template v-for="item1 in item.children" :key="item1.id">
          <el-menu-item
            v-if="!item1.threeMenu"
            :index="item1.id"
            @click="onTab(item1.path)">
            <el-text truncated>{{ title(item1.meta) }}</el-text>
          </el-menu-item>
          <el-sub-menu v-else class="nest" :index="item1.id">
            <template #title>
              <el-text style="padding-left: 20px" truncated>
                {{ title(item1.meta) }}
              </el-text>
            </template>
            <el-menu-item
              v-for="item2 in item1.children"
              :key="item2.id"
              :index="item2.id"
              @click="onTab(item2.path)">
              <el-text truncated>{{ title(item2.meta) }}</el-text>
            </el-menu-item>
          </el-sub-menu>
        </template>
      </el-sub-menu>
    </el-menu>
    <!-- 版本号 -->
    <div class="version">
      <template v-if="!props.isCollapse">{{ gt('app.version') }}:</template>
      {{ appVersion }}
      <template v-if="isDev">({{ stage }})</template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from 'chant'

// props
const props = defineProps<{
  isCollapse: boolean
}>()
// use
const { t: gt } = useI18n({ useScope: 'global' })
const authStore = useAuthStore()
const route = useRoute()
const router = useRouter()
// var
let subIndex = ''
const appVersion = window.__APP_VERSION__
const isDev = import.meta.env.DEV
const stage = import.meta.env.VITE_STAGE
// state
const menuRef = ref(null)
// computed
const active = computed(() => {
  return route.path.replace(/\/(add|edit|detail)/, '')
})
// watch
watch(
  () => route.path,
  () => {
    // path为/折叠menu
    if (active.value === '/' && subIndex) {
      const menu = menuRef.value as any
      menu?.close(subIndex)
    }
  }
)
// 标题
function title(meta?: any) {
  return meta?.title
  // return gt(`router.${name}`)
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
  --light-black-color: #42485b;
  --black-color: #333744;
  --white-color: #fff;
  background-color: var(--light-black-color);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-right: 1px;
  .menu-box {
    --el-menu-text-color: var(--white-color);
    --el-menu-bg-color: var(--balck-color);
    --el-menu-hover-bg-color: var(--main-color);
    border-right: none;
    overflow: auto;
    flex: 1;
    &.el-menu--collapse {
      .menu-item-collapse-box {
        transform: scale(0.8);
      }
    }
    &:not(.el-menu--collapse) {
      width: 160px;
      .el-sub-menu.nest {
        .el-sub-menu__title {
          padding-left: 20px !important;
        }
      }
    }
    .el-text {
      color: inherit;
    }
    .el-menu-item {
      font-size: 12px;
      height: 40px;
      line-height: 40px;
    }
    .el-sub-menu {
      &.is-active {
        .el-sub-menu__title {
          background-color: var(--main-color);
          color: var(--white-color);
        }
      }
      .el-sub-menu__title {
        height: 40px;
        line-height: 40px;
        padding: 0 10px;
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
      .el-menu-item {
        background-color: var(--black-color);
        &:hover {
          background-color: var(--main-color);
          color: var(--white-color) !important;
          opacity: 0.8;
        }
        &.is-active {
          color: var(--main-color);
        }
      }
    }
    .el-sub-menu.nest {
      &.is-active {
        .el-sub-menu__title {
          color: var(--main-color);
        }
      }
      .el-sub-menu__title {
        background-color: var(--black-color);
        color: var(--white-color);
        &:hover {
          background-color: var(--main-color);
          color: var(--white-color) !important;
          opacity: 0.8;
        }
      }
      .el-menu {
        background-color: var(--black-color);
        .el-menu-item {
          padding-left: 50px;
          &:hover {
            opacity: 0.8;
          }
        }
      }
    }
  }
  .version {
    background-color: #42485b;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.7);
    font-size: 12px;
    padding: 5px 0;
    text-align: center;
  }
}
</style>
