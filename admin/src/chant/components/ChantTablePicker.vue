<template>
  <chant-dialog
    v-model="vModel"
    append-to-body
    class="chant-table-picker"
    :class="{ single: !isMultiple }"
    :title="props.title"
    :width="props.width || '70%'">
    <div class="column-box">
      <div class="column-item flex-1">
        <!-- search -->
        <chant-table-search
          v-model="state"
          :dict="props.dict"
          :lang="props.lang"
          @query="getList"
          @reset="lister.reset(getList, state)">
        </chant-table-search>
        <!-- table -->
        <chant-table
          v-model="state"
          :class="{ 'picker-table': !isMultiple }"
          :dict="props.dict"
          :lang="props.lang"
          :reserve-selection="isMultiple"
          :show-selection="isMultiple"
          @instance="lister.bindInstance"
          @row-click="onRowClick">
        </chant-table>
        <!-- pagination -->
        <chant-pagination
          v-model="state.pages"
          :total="state.total"
          @change="getList">
        </chant-pagination>
      </div>
      <div v-if="isMultiple" class="column-item">
        <chant-selected-table
          :columns="props.columns"
          :columns-set="props.columnsSet!"
          :dict="props.dict"
          :lang="props.lang"
          :list="state.selection"
          @delete="lister.toggleRowSelection($event, false)">
        </chant-selected-table>
      </div>
    </div>
    <template v-if="isMultiple" #footer>
      <!-- 关闭 -->
      <el-button @click="vModel = false">{{ tg('button.close') }}</el-button>
      <!-- 保存 -->
      <el-button type="primary" @click="onSave">
        {{ tg('button.save') }}
      </el-button>
    </template>
  </chant-dialog>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import { type ListColumn as Column } from '@/chant'
import { useLister } from '@/use'

// props
const props = defineProps<{
  columns: Column[]
  columnsSet?: Column['prop'][] // 将columns中的字段显示在右侧
  dict?: any
  lang?: any
  modelValue: boolean
  title: string
  width?: string | number
}>()
// emits
const emits = defineEmits(['change', 'update:modelValue'])
// use
const vModel = useVModel(props, 'modelValue', emits)
// use
const { t: tg } = useI18n({ useScope: 'global' })
const lister = useLister()
// state
const state = reactive({
  ...lister.state,
  columns: props.columns
})
// computed
const isMultiple = computed(() => {
  return !!props.columnsSet?.length
})
// init
getList() // 获取列表
// 获取列表
function getList() {
  lister.getData('xx/xxx', state)
}
// 行点击
function onRowClick(row: any) {
  if (!isMultiple) {
    emits('change', row)
    vModel.value = false
  }
}
// 保存
function onSave() {}
</script>

<style lang="scss">
.chant-table-picker {
  height: 84vh;
  .el-dialog__body {
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex: 1;
    overflow: hidden;
    padding: 0 15px;
  }
  &.single {
    .el-dialog__footer {
      padding-bottom: 0;
    }
  }
  .picker-table {
    cursor: pointer;
  }
}
</style>
