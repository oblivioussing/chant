<template>
  <chant-dialog
    v-model="vModel"
    append-to-body
    class="chant-table-picker"
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
          @reset="getList">
        </chant-table-search>
        <!-- table -->
        <chant-table
          v-model="state"
          class="picker-table"
          :dict="props.dict"
          :lang="props.lang"
          :reserve-selection="isMultiple"
          row-checked
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
          :list="state.selections"
          @delete="lister.toggleRowSelection($event, false)">
        </chant-selected-table>
      </div>
    </div>
    <div v-if="isMultiple" class="button-box">
      <!-- 关闭 -->
      <el-button @click="vModel = false">{{ tg('button.close') }}</el-button>
      <!-- 保存 -->
      <el-button type="primary" @click="onSave">
        {{ tg('button.save') }}
      </el-button>
    </div>
  </chant-dialog>
</template>

<script setup lang="ts">
import { computed, onMounted, reactive, type ModelRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { type ListColumn as Column } from '@/chant'
import { useLister } from '@/use'

// props
const props = defineProps<{
  apiPath: string
  columns: Column[]
  columnsSet?: Column['prop'][] // 将columns中的字段显示在右侧
  dict?: any
  lang?: any
  title: string
  width?: string | number
}>()
// emits
const emits = defineEmits(['change'])
// model
const vModel = defineModel() as ModelRef<boolean>
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
// onMounted
onMounted(() => {
  // 获取列表
  getList()
})
// 获取列表
function getList() {
  lister.getData(props.apiPath, state)
}
// 行点击
function onRowClick(row: any) {
  if (!isMultiple.value) {
    emits('change', row)
    vModel.value = false
  }
}
// 保存
function onSave() {
  emits('change', state.selections)
  vModel.value = false
}
</script>

<style lang="scss">
.chant-table-picker {
  height: 84vh;
  .picker-table {
    cursor: pointer;
  }
  .button-box {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-top: 10px;
  }
}
</style>
