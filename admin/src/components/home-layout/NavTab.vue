<template>
  <el-tabs
    v-model="state.path"
    class="nav-tab"
    ref="tabRef"
    type="card"
    @tab-click="onTab"
    @tab-remove="onTabRemove">
    <el-tab-pane
      v-for="item in state.tabs"
      :key="item.path"
      :closable="item.path !== '/'"
      :name="item.path">
      <template #label>
        <el-dropdown
          :id="item.path"
          ref="dropdownRef"
          trigger="contextmenu"
          @command="onCommand($event, item.path)"
          @visible-change="onVisibleChange($event, item.path)">
          <span>{{ tg(`router.${item?.title}`) }}</span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item command="close">
                {{ tg('app.close') }}
              </el-dropdown-item>
              <el-dropdown-item command="closeOther">
                {{ tg('app.closeOther') }}
              </el-dropdown-item>
              <el-dropdown-item command="closeAll">
                {{ tg('app.closeAll') }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </template>
    </el-tab-pane>
  </el-tabs>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { BusEnum, StorageEnum } from '@/enum'
import { useChaoser } from '@/use'
import { bus, core, storage } from '@/utils'

// type
type PathMapping = {
  name: string
  path: string
  title: string
}
// emits
const emits = defineEmits(['change'])
// use
const chaoser = useChaoser()
const { t: tg } = useI18n({ useScope: 'global' })
const route = useRoute()
const router = useRouter()
// var
const indexRaw = {
  name: '/',
  path: '/',
  title: 'index'
}
const tabs = (storage.getSession(StorageEnum.HomeNavTab) || [
  indexRaw
]) as PathMapping[]
// ref
const dropdownRef = ref()
const tabRef = ref()
// state
const state = reactive({
  path: route?.path,
  tabs: tabs
})
// 监听页面关闭
bus.on(BusEnum.ClosePage, (path) => {
  path = path || route.path
  onTabRemove(path as string)
})
// 监听tabs变化
watch(
  () => [...state.tabs],
  () => {
    storage.setSession(StorageEnum.HomeNavTab, state.tabs)
    // 通知外部keeps发生了变化
    busKeeps()
  }
)
// 监听路由变化
watch(() => route?.path, routerChange)
// onMounted
onMounted(() => {
  // 路由变化
  routerChange()
  // 通知外部keeps发生了变化
  busKeeps()
})
// 路由变化
function routerChange() {
  const path = route?.path
  const index = state.tabs.findIndex((item) => item?.path === path)
  // 跳转的路由存在于tabs中
  if (index > -1) {
    state.path = path
    return
  }
  // meta
  const meta = chaoser.getMetaByPath()
  // tabs
  if (meta) {
    state.tabs.push({
      path: route.path,
      title: meta?.title as string,
      name: path
    })
  }
  state.path = route.path
}
// 通知外部keeps发生了变化
function busKeeps() {
  let keeps = state.tabs.map((item) => {
    return item.name
  })
  emits('change', keeps)
}
// tab切换
function onTab(row: any) {
  const path = row.paneName
  router.push({ path })
}
// tab删除
function onTabRemove(path: any) {
  const index = state.tabs.findIndex((item) => item?.path === path)
  if (index < 0) {
    return
  }
  state.tabs.splice(index, 1)
  // 移除路由参数
  core.removeRouterQuery(path)
  // 跳转至父页面
  const parentPath = core.getParentPath(path)
  if (parentPath) {
    const inTab = state.tabs.some((item) => item.path === parentPath)
    if (inTab) {
      router.push({ path: parentPath })
      return
    }
  }
  // 关闭的当前页面则自动跳转至前一个页面
  if (state.path === path) {
    path = state.tabs[index - 1]?.path || '/'
    router.push({ path })
  }
}
// 下拉菜单显示
function onVisibleChange(visible: boolean, path: string) {
  if (visible) {
    dropdownRef.value.forEach((item: any) => {
      if (item.id !== path) {
        item.handleClose()
      }
    })
  }
}
// 下拉菜单选择
function onCommand(command: string, path: string) {
  if (command === 'close') {
    onTabRemove(path)
  } else if (command === 'closeOther') {
    onRemoveOther(path)
  } else {
    onRemoveAll()
  }
}
// 关闭其他
function onRemoveOther(path: string) {
  const row = state.tabs.find((item) => item?.path === path) as PathMapping
  if (row.path === '/') {
    state.tabs = [row]
  } else {
    state.tabs = [indexRaw, row]
  }
  // 路由参数
  const routerQuery = storage.getSession(StorageEnum.PageQuery) as any
  if (routerQuery) {
    const pathQuery = routerQuery[path]
    const map = {} as any
    map[path] = pathQuery
    storage.setSession(StorageEnum.PageQuery, map)
  }
  router.push({ path: row?.path })
}
// 关闭所有
function onRemoveAll() {
  state.tabs = [indexRaw]
  // 路由参数
  storage.setSession(StorageEnum.PageQuery, {})
  router.push({ path: '/' })
}
</script>

<style lang="scss">
.nav-tab {
  .el-tabs__item {
    &.is-active {
      .el-tooltip__trigger {
        color: var(--main-color);
      }
    }
    .el-dropdown {
      line-height: inherit;
      .el-tooltip__trigger {
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
}
</style>
