<template>
  <chant-picker-button
    v-bind="$attrs"
    v-model="visible"
    v-model:id="id"
    v-model:text="text"
    :placeholder="props.title"
    @clear="emits('change', {})">
  </chant-picker-button>
  <chant-table-picker
    v-if="visible"
    v-bind="$attrs"
    v-model="visible"
    :api-path="props.apiPath"
    :columns="props.columns"
    :columns-set="props.columnsSet"
    :dict="props.dict"
    :lang="props.lang"
    ref="tableRef"
    :search-slots="searchSlots"
    :title="props.title"
    @change="emits('change', $event)">
    <!-- search-slot -->
    <template
      v-for="item in searchSlots"
      v-slot:[`${item.prop}-search`]="slotProps">
      <slot
        :name="`${item.prop}-search`"
        :query="(slotProps as any).query"
        :row="slotProps.row">
      </slot>
    </template>
    <!-- table-slot -->
    <template
      v-for="item in tableSlots"
      v-slot:[`${item.prop}-table`]="{ row }">
      <slot :name="`${item.prop}-table`" :row="row"></slot>
    </template>
  </chant-table-picker>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { TablePickerProps } from '@chant/type'
import ChantPickerButton from './ChantPickerButton.vue'
import ChantTablePicker from './ChantTablePicker.vue'

// props
const props = defineProps<TablePickerProps>()
// emits
const emits = defineEmits(['change'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
// ref
const visible = ref(false)
const tableRef = ref()
// computed
const searchSlots = computed(() => {
  return props.columns.filter((item) => item.slot?.includes('search'))
})
const tableSlots = computed(() => {
  return props.columns.filter((item) => item.slot?.includes('list'))
})
// defineExpose
defineExpose({ query })
// 查询
function query() {
  tableRef.value.query()
}
</script>

<style scoped lang="scss"></style>
