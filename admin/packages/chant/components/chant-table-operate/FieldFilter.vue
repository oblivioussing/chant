<template>
  <Teleport v-if="state.visible" :to="props.parentNode">
    <div class="field-filter" @click.stop>
      <div class="bubble"></div>
      <draggable
        v-bind="{ animation: 200 }"
        v-model="vModel.columns"
        class="container"
        item-key="prop">
        <template #item="{ element }">
          <div v-if="show(element)" class="item">
            <el-icon class="handle">
              <Sort></Sort>
            </el-icon>
            <el-checkbox
              :checked="!element.hide"
              :value="!element.hide"
              @change="onChange($event, element)">
              {{ translate(element) }}
            </el-checkbox>
          </div>
        </template>
      </draggable>
      <!-- 保存 -->
      <div class="btn-box">
        <el-button @click="onReset">
          {{ t('chant.reset') }}
        </el-button>
        <el-button type="primary" @click="onSave">
          {{ gt('button.save') }}
        </el-button>
      </div>
    </div>
  </Teleport>
  <chant-button
    :content="t('chant.filter')"
    :icon="Document"
    type="primary"
    @click.stop="onShowFilter">
  </chant-button>
</template>

<script setup lang="ts">
import { cloneDeep } from 'lodash'
import { onMounted, reactive, watch, type ModelRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import draggable from 'vuedraggable'
import { Document, Sort } from '@element-plus/icons-vue'
import { base } from '@chant'
import type { Lang, ListColumn as Column, ListState } from '@chant/type'
import { chant as chantLang } from '@chant/lang'

// props
const props = defineProps<{
  lang?: Lang // 国际化
  parentNode?: any // 父节点,解决el-button-group边框问题
}>()
// model
const vModel = defineModel() as ModelRef<ListState>
// use
const en = { ...props.lang?.en, chant: chantLang.en }
const zh = { ...props.lang?.zh, chant: chantLang.zh }
const { t } = useI18n({ messages: { en, zh } })
const { t: gt } = useI18n({ useScope: 'global' })
const route = useRoute()
// var
const columnsBackups = cloneDeep(vModel.value.columns)
// state
let state = reactive({
  visible: false
})
// watch
watch(
  () => state.visible,
  () => {
    if (state.visible) {
      // 空白处点击
      document.addEventListener('click', blankClick)
    } else {
      // 移除点击事件
      document.removeEventListener('click', blankClick)
    }
  }
)
// onMounted
onMounted(() => {
  // 获取缓存columns
  getStorageColumns()
})
// 获取缓存columns
function getStorageColumns() {
  const obj = base.getPageStorage(route.path)
  const list = obj?.tableFilter as Column[]
  const columns = vModel.value.columns
  if (arraysEqual(list, columns)) {
    list.forEach((item, index) => {
      const row = columns.find((column) => column.prop === item.prop)
      if (row) {
        row.hide = item.hide
        list[index] = row
      }
    })
    vModel.value.columns = list
  } else {
    base.setPageStorage(route.path, 'tableFilter')
  }
}
// 判断两个数组是否一致
function arraysEqual(list: Column[], columns: Column[]) {
  const arr1 = list?.map((item) => item.prop)
  const arr2 = columns?.map((item) => item.prop)
  return (
    new Set(arr1).size === new Set(arr2).size &&
    [...new Set(arr1)].every((value) => arr2.includes(value))
  )
}
// 空白区点击
function blankClick() {
  state.visible = false
}
// 显示字段过滤
function onShowFilter() {
  state.visible = !state.visible
}
// change
function onChange(val: any, column: Column) {
  column.hide = !val
}
// 默认
function onReset() {
  const obj = base.getPageStorage(route.path)
  if (obj) {
    base.setPageStorage(route.path, 'tableFilter')
  }
  vModel.value.columns = cloneDeep(columnsBackups)
  state.visible = false
}
// 保存
function onSave() {
  const columns = vModel.value.columns.map((item) => {
    const { prop, hide } = item
    return { prop, hide }
  })
  base.setPageStorage(route.path, 'tableFilter', columns)
  state.visible = false
}
// 是否显示
function show(column: Column) {
  const hideList = column.hideInPages?.includes('list')
  const label = column.label || column.prop
  return !hideList && label
}
// 翻译
function translate(column: Column) {
  const label = column.label || column.prop
  return props.lang ? t(label) : label
}
</script>

<style scoped lang="scss">
.field-filter {
  background-color: #ffffff;
  border-radius: 2px;
  box-shadow: 0 0 4px 1px rgba(0, 0, 0, 0.2);
  font-size: 14px;
  padding: 5px 0;
  position: absolute;
  top: 53px;
  right: 0;
  z-index: 9;
  .bubble {
    border-left: 10px solid transparent;
    border-right: 10px solid transparent;
    border-bottom: 10px solid #ffffff;
    position: absolute;
    top: -10px;
    right: 15px;
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      border-left: 11px solid transparent;
      border-right: 11px solid transparent;
      border-bottom: 11px solid rgba(0, 0, 0, 0.2);
      position: absolute;
      top: -1px;
      left: -11px;
      z-index: -1;
      filter: blur(2px);
    }
    &::after {
      background-color: #ffffff;
      content: '';
      position: absolute;
      top: 10px;
      left: -10px;
      height: 10px;
      width: 20px;
    }
  }
  .container {
    max-height: 350px;
    overflow: auto;
  }
  .item {
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0 10px;
    white-space: nowrap;
    .handle {
      cursor: move;
      margin-right: 10px;
    }
  }
}
.btn-box {
  display: flex;
  padding: 5px 10px 0;
  :deep(.el-button) {
    height: 24px;
  }
}
</style>
