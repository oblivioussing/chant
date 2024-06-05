<template>
  <div>{{ props.data.column }}</div>
</template>

<script setup lang="ts">
const props = defineProps<{
  data: {
    cells: any[]
    column: any
    columns: any[]
    rowData: any
    rowIndex: number
  }
}>()
// model
// const row = defineModel('row')
// console.log(row)
// const list = defineModel('list')
</script>

<style scoped lang="scss"></style>
