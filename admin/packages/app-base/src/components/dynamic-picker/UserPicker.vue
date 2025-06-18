<template>
  <chant-base-picker
    v-model:id="id"
    v-model:text="text"
    v-bind="$attrs"
    api-path="user/list"
    :columns="columns()"
    :dict="dict"
    ref="tableRef"
    @change="onChange">
    <!-- 职位 -->
    <template #positionId-search="{ query }">
      <position-select v-model="query.positionId" @change="onPosition">
      </position-select>
    </template>
  </chant-base-picker>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { columns, dict } from '@app-base/views/auth/user/share'
import PositionSelect from '@app-base/views/auth/user/components/PositionSelect.vue'

// emits
const emits = defineEmits(['change'])
// model
const id = defineModel<string>('id')
const text = defineModel<string>('text')
// ref
const tableRef = ref()
// change
function onChange(row: any) {
  id.value = row.id
  text.value = row.name
  emits('change', row)
}
// 职位
function onPosition() {
  tableRef.value.query()
}
</script>

<style scoped lang="scss"></style>
